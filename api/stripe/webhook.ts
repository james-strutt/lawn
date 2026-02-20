/**
 * Stripe Webhook Handler
 *
 * Handles Stripe webhook events for subscriptions and payments.
 * Deploy to /api/stripe/webhook
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(req: VercelRequest) {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature']!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: 'Webhook signature verification failed' });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (error: any) {
    console.error('Webhook handler error:', error);
    return res.status(500).json({ error: error.message });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.user_id;
  const type = session.metadata?.type;

  if (!userId) return;

  // Handle subscription
  if (type === 'subscription' && session.subscription) {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    await supabase
      .from('stripe_customers')
      .update({
        stripe_subscription_id: subscription.id,
        subscription_status: subscription.status,
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      })
      .eq('stripe_customer_id', session.customer as string);

    // Update user to Pro tier
    await supabase
      .from('profiles')
      .update({ subscription_tier: 'pro' })
      .eq('id', userId);
  }

  // Handle one-time payment (report credits)
  if (type === 'credits' && session.payment_intent) {
    const paymentIntent = await stripe.paymentIntents.retrieve(
      session.payment_intent as string
    );

    // Determine credits based on amount
    const amount = paymentIntent.amount;
    let credits = 0;
    if (amount === 2500) credits = 5;
    else if (amount === 6000) credits = 15;
    else if (amount === 15000) credits = 50;

    // Add credits to user
    await supabase.rpc('increment_report_credits', {
      p_user_id: userId,
      p_credits: credits,
    });

    // Record purchase
    await supabase.from('report_credit_purchases').insert({
      user_id: userId,
      stripe_payment_intent_id: paymentIntent.id,
      credits_purchased: credits,
      amount_paid: amount,
    });
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  await supabase
    .from('stripe_customers')
    .update({
      stripe_subscription_id: subscription.id,
      subscription_status: subscription.status,
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    })
    .eq('stripe_customer_id', subscription.customer as string);

  // Update user tier based on status
  const { data: customer } = await supabase
    .from('stripe_customers')
    .select('user_id')
    .eq('stripe_customer_id', subscription.customer as string)
    .single();

  if (customer) {
    const tier = subscription.status === 'active' ? 'pro' : 'free';
    await supabase
      .from('profiles')
      .update({ subscription_tier: tier })
      .eq('id', customer.user_id);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  // Downgrade user to free tier
  const { data: customer } = await supabase
    .from('stripe_customers')
    .select('user_id')
    .eq('stripe_customer_id', subscription.customer as string)
    .single();

  if (customer) {
    await supabase
      .from('profiles')
      .update({ subscription_tier: 'free' })
      .eq('id', customer.user_id);

    await supabase
      .from('stripe_customers')
      .update({
        subscription_status: 'canceled',
        stripe_subscription_id: null,
      })
      .eq('stripe_customer_id', subscription.customer as string);
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('Invoice paid:', invoice.id);
  // Additional logic for successful payments if needed
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Invoice payment failed:', invoice.id);
  // Send notification to user about payment failure
}
