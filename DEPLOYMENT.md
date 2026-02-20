# LAWN Deployment Guide

Complete guide for deploying LAWN to production.

## Prerequisites

- [x] Vercel account
- [x] Supabase project
- [x] Stripe account
- [x] Mapbox account
- [x] Domain name (optional)

---

## 1. Supabase Setup

### Create Project

1. Visit https://app.supabase.com
2. Click "New Project"
3. Fill in project details
4. Wait for project to be ready

### Run Migrations

```bash
# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Push migrations
supabase db push
```

### Get Credentials

From Supabase Dashboard → Settings → API:
- **URL**: `https://YOUR_PROJECT.supabase.co`
- **anon/public key**: `eyJhbG...` (client-side safe)
- **service_role key**: `eyJhbG...` (server-side only, NEVER expose)

---

## 2. Stripe Setup

### Create Products

1. Go to Stripe Dashboard → Products
2. Create products:

**Pro Subscription:**
- Name: "LAWN Pro"
- Pricing: $29/month recurring
- Copy Price ID: `price_...`

**Report Credits:**
- "5 Report Credits" - $25 one-time
- "15 Report Credits" - $60 one-time
- "50 Report Credits" - $150 one-time

### Configure Webhook

1. Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-app.vercel.app/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.*`
   - `invoice.payment_*`
4. Copy webhook signing secret: `whsec_...`

---

## 3. Mapbox Setup

1. Visit https://account.mapbox.com/
2. Create access token with scopes:
   - `styles:read`
   - `fonts:read`
   - `datasets:read`
3. Copy token: `pk.eyJ1...`

---

## 4. Vercel Deployment

### Install Vercel CLI (optional)

```bash
npm install -g vercel
```

### Deploy via Git (Recommended)

1. Push code to GitHub
2. Import project in Vercel dashboard
3. Configure build settings:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### Set Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

**Client-side (VITE_*):**
```
VITE_MAPBOX_TOKEN=pk.eyJ1...
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
VITE_POSTHOG_KEY=phc_... (optional)
```

**Server-side (for API routes):**
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

**Stripe Price IDs:**
```
STRIPE_PRICE_ID_PRO=price_...
STRIPE_PRICE_ID_CREDITS_5=price_...
STRIPE_PRICE_ID_CREDITS_15=price_...
STRIPE_PRICE_ID_CREDITS_50=price_...
```

### Deploy

```bash
# Manual deploy
vercel

# Production deploy
vercel --prod
```

Or push to `main` branch for automatic deployment.

---

## 5. Post-Deployment

### Verify Deployment

- [ ] Visit your app URL
- [ ] Test map loading (Mapbox token works)
- [ ] Test authentication (Supabase connection)
- [ ] Test property search
- [ ] Test financial calculators

### Test Stripe Integration

1. Use test mode first
2. Test card: `4242 4242 4242 4242`
3. Test subscription purchase
4. Test credit purchase
5. Check webhook events in Stripe Dashboard

### Update Stripe Webhook

1. Update webhook URL to production: `https://your-app.vercel.app/api/stripe/webhook`
2. Switch from test mode to live mode

---

## 6. Custom Domain (Optional)

### Add Domain

1. Vercel Dashboard → Settings → Domains
2. Add your domain
3. Update DNS records as instructed

### SSL Certificate

Vercel automatically provisions SSL certificates.

---

## 7. Monitoring

### Vercel Analytics

Enable in Vercel Dashboard → Analytics

### Supabase Monitoring

Check Database → Logs for query performance

### Stripe Dashboard

Monitor payments and subscriptions in Stripe Dashboard

### Error Tracking

Consider adding Sentry:

```bash
npm install @sentry/react
```

---

## Environment Variables Checklist

```bash
# Client-side (VITE_*)
✅ VITE_MAPBOX_TOKEN
✅ VITE_SUPABASE_URL
✅ VITE_SUPABASE_ANON_KEY
✅ VITE_STRIPE_PUBLISHABLE_KEY
⬜ VITE_POSTHOG_KEY (optional)

# Server-side
✅ STRIPE_SECRET_KEY
✅ STRIPE_WEBHOOK_SECRET
✅ SUPABASE_SERVICE_ROLE_KEY
✅ NEXT_PUBLIC_APP_URL

# Stripe Prices
✅ STRIPE_PRICE_ID_PRO
✅ STRIPE_PRICE_ID_CREDITS_5
✅ STRIPE_PRICE_ID_CREDITS_15
✅ STRIPE_PRICE_ID_CREDITS_50
```

---

## Troubleshooting

### Map Not Loading
- Check `VITE_MAPBOX_TOKEN` is set
- Verify token has correct scopes
- Check browser console for errors

### Authentication Failing
- Verify Supabase URL and keys
- Check Supabase project is active
- Check database migrations were run

### Payments Not Working
- Verify Stripe keys (test vs live)
- Check webhook signature secret matches
- View webhook logs in Stripe Dashboard

### API Routes 404
- Ensure `api/` folder is in project root
- Check Vercel build logs
- Verify API route file names match URLs

---

## Production Checklist

- [ ] Database migrations run successfully
- [ ] All environment variables set in Vercel
- [ ] Stripe products created with correct prices
- [ ] Stripe webhook configured and tested
- [ ] Mapbox token working in production
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Test user signup/signin flow
- [ ] Test payment flow (subscription + credits)
- [ ] Test report generation
- [ ] Monitor error logs first 24 hours

---

## Rollback Procedure

If deployment fails:

1. Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click three dots → "Promote to Production"

---

## Scaling Considerations

### Database
- Supabase Pro plan for production
- Enable connection pooling
- Add indexes for slow queries

### API Rate Limits
- Implement request caching
- Add rate limiting middleware
- Monitor NSW API usage

### CDN
- Vercel Edge Network handles this
- Static assets automatically cached

---

## Support

- Vercel: https://vercel.com/support
- Supabase: https://supabase.com/support
- Stripe: https://support.stripe.com/
- Mapbox: https://support.mapbox.com/

---

**Your LAWN app is ready for production!** 🚀
