# LAWN API Endpoints

Backend API functions for Stripe integration and payment processing.

These are Vercel serverless functions deployed at `/api/*`.

## Setup

### 1. Install Dependencies

```bash
npm install stripe @vercel/node @supabase/supabase-js
```

### 2. Environment Variables

Add to `.env.local` (for local development) and Vercel dashboard (for production):

```bash
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_PRO=price_...
STRIPE_PRICE_ID_CREDITS_5=price_...
STRIPE_PRICE_ID_CREDITS_15=price_...
STRIPE_PRICE_ID_CREDITS_50=price_...

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

### 3. Create Stripe Products

In Stripe Dashboard:

**Pro Subscription:**
- Product: "LAWN Pro"
- Price: $29/month recurring
- Copy Price ID to `STRIPE_PRICE_ID_PRO`

**Report Credits:**
- Product: "5 Report Credits" - $25
- Product: "15 Report Credits" - $60
- Product: "50 Report Credits" - $150
- Copy Price IDs to respective env vars

## Endpoints

### POST /api/stripe/checkout

Create a Stripe Checkout session.

**Request:**
```json
{
  "priceId": "price_1234...",
  "userId": "uuid",
  "type": "subscription" | "credits"
}
```

**Response:**
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/..."
}
```

**Usage:**
```typescript
const response = await fetch('/api/stripe/checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    priceId: process.env.VITE_STRIPE_PRICE_ID_PRO,
    userId: user.id,
    type: 'subscription',
  }),
});

const { url } = await response.json();
window.location.href = url;
```

### POST /api/stripe/webhook

Stripe webhook handler for events.

**Events Handled:**
- `checkout.session.completed` - Activate subscription or add credits
- `customer.subscription.created` - New subscription
- `customer.subscription.updated` - Subscription changes
- `customer.subscription.deleted` - Cancellation
- `invoice.payment_succeeded` - Successful payment
- `invoice.payment_failed` - Failed payment

**Setup:**
1. Run `stripe listen --forward-to localhost:3000/api/stripe/webhook` for local testing
2. In Stripe Dashboard, add webhook endpoint: `https://your-domain.com/api/stripe/webhook`
3. Select events to listen for
4. Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### POST /api/stripe/portal

Create a Stripe Customer Portal session.

**Request:**
```json
{
  "userId": "uuid"
}
```

**Response:**
```json
{
  "url": "https://billing.stripe.com/..."
}
```

**Usage:**
```typescript
const response = await fetch('/api/stripe/portal', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userId: user.id }),
});

const { url } = await response.json();
window.location.href = url;
```

## Database Integration

Webhook handlers update Supabase tables:

**On Subscription Created/Updated:**
- Updates `stripe_customers` with subscription details
- Sets `profiles.subscription_tier` to 'pro'

**On Subscription Deleted:**
- Sets `profiles.subscription_tier` to 'free'
- Clears subscription ID

**On Credits Purchase:**
- Adds credits to `profiles.report_credits`
- Records purchase in `report_credit_purchases`

## Testing

### Local Testing with Stripe CLI

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Trigger test events
stripe trigger checkout.session.completed
stripe trigger customer.subscription.created
```

### Test Cards

```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0025 0000 3155
```

## Deployment

### Vercel

These functions are automatically deployed with your Vercel app.

Ensure environment variables are set in Vercel dashboard:
- Settings → Environment Variables
- Add all Stripe and Supabase keys
- Redeploy

### Webhook URL

After deployment, update Stripe webhook endpoint to:
```
https://your-app.vercel.app/api/stripe/webhook
```

## Security

- ✅ Webhook signature verification
- ✅ Service role key for Supabase (server-side only)
- ✅ CORS not needed (same domain)
- ✅ Environment variables never exposed to client
- ✅ User ID validated against Supabase

## Troubleshooting

**Webhook signature failed:**
- Ensure `STRIPE_WEBHOOK_SECRET` matches your endpoint
- Check raw body is being passed to `stripe.webhooks.constructEvent`

**Customer not found:**
- Verify user exists in Supabase profiles
- Check `stripe_customers` table has entry

**Credits not added:**
- Check webhook received `checkout.session.completed` event
- Verify amount matches credit tier (2500, 6000, or 15000 cents)
- Check `report_credit_purchases` table
