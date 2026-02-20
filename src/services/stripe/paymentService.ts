import { loadStripe, Stripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''
);

export class PaymentService {
  private stripe: Stripe | null = null;

  async init() {
    this.stripe = await stripePromise;
  }

  /**
   * Create a checkout session for Pro subscription
   */
  async createProSubscription() {
    // This would call your backend API to create a Stripe Checkout session
    // For now, this is a placeholder

    console.log('Creating Pro subscription...');

    // Example flow:
    // 1. Call backend: POST /api/stripe/create-checkout-session
    // 2. Backend creates Stripe Checkout session with price_id for Pro plan
    // 3. Backend returns session ID
    // 4. Redirect to Stripe Checkout
    // 5. On success, Stripe redirects back to success URL
    // 6. Webhook updates Supabase profile with subscription_tier='pro'

    const mockCheckoutUrl = 'https://checkout.stripe.com/...';
    window.location.href = mockCheckoutUrl;
  }

  /**
   * Create a checkout session for report credits
   */
  async purchaseReportCredits(creditPack: 5 | 15 | 50) {
    console.log(`Purchasing ${creditPack} report credits...`);

    const priceMap = {
      5: 2500, // $25
      15: 6000, // $60
      50: 15000, // $150
    };

    // Same flow as subscription, but one-time payment
    const mockCheckoutUrl = 'https://checkout.stripe.com/...';
    window.location.href = mockCheckoutUrl;
  }

  /**
   * Open Stripe Customer Portal for managing subscription
   */
  async openCustomerPortal() {
    // Call backend: POST /api/stripe/create-portal-session
    // Redirect to Stripe Customer Portal
    console.log('Opening customer portal...');
    const mockPortalUrl = 'https://billing.stripe.com/...';
    window.location.href = mockPortalUrl;
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription() {
    // This would be handled via Stripe Customer Portal
    // Or direct API call if you want custom cancellation flow
    console.log('Canceling subscription...');
  }
}

export const paymentService = new PaymentService();
export default paymentService;
