# Supabase Local Development

This directory contains Supabase configuration and migrations for the LAWN app.

## Setup

### 1. Install Supabase CLI

```bash
npm install -g supabase
```

### 2. Initialize Supabase (if not already done)

```bash
cd /home/user/landiq-labs/lawn
supabase init
```

### 3. Start Local Supabase

```bash
supabase start
```

This will start:
- PostgreSQL database on `postgresql://postgres:postgres@localhost:54322/postgres`
- Supabase Studio on `http://localhost:54323`
- API endpoint on `http://localhost:54321`

### 4. Run Migrations

```bash
supabase db reset
```

Or apply specific migrations:

```bash
supabase db push
```

## Migrations

### `20260208000000_initial_schema.sql`

Creates the core database schema:

- **profiles** - User profiles linked to auth.users
- **saved_properties** - User's shortlisted properties
- **property_comparisons** - Saved comparison sets
- **stripe_customers** - Stripe customer/subscription tracking

Includes:
- Row Level Security (RLS) policies
- Indexes for performance
- Triggers for `updated_at` timestamps
- Automatic profile creation on user signup

### `20260208000001_report_credits.sql`

Adds report credit system:

- **report_credit_purchases** - Track credit purchases
- **report_usage** - Track report generation
- Functions:
  - `has_report_credits(user_id)` - Check if user can generate report
  - `consume_report_credit(user_id, property_id, type)` - Use a credit

## Production Setup

### 1. Create Supabase Project

Visit https://app.supabase.com and create a new project.

### 2. Link to Production

```bash
supabase link --project-ref YOUR_PROJECT_REF
```

### 3. Push Migrations

```bash
supabase db push
```

### 4. Update Environment Variables

Copy the credentials from Supabase dashboard to `.env`:

```bash
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## Database Schema

```
auth.users (Supabase managed)
    ↓
profiles
    - id (FK to auth.users)
    - email
    - user_type
    - subscription_tier
    - report_credits
    ↓
saved_properties
    - user_id (FK to profiles)
    - address, zone, area, etc.
    - geometry (JSONB)
    ↓
property_comparisons
    - user_id (FK to profiles)
    - property_ids (array)

stripe_customers
    - user_id (FK to profiles)
    - stripe_customer_id
    - subscription_status

report_credit_purchases
    - user_id (FK to profiles)
    - credits_purchased
    - amount_paid

report_usage
    - user_id (FK to profiles)
    - property_id (FK to saved_properties)
    - report_type
```

## Security

All tables have Row Level Security (RLS) enabled:

- Users can only access their own data
- Service role (backend) can manage Stripe customers
- Policies enforce user_id checks on all operations

## Useful Commands

```bash
# Reset database (WARNING: deletes all data)
supabase db reset

# Generate TypeScript types
supabase gen types typescript --local > src/lib/database.types.ts

# View database URL
supabase status

# Stop local Supabase
supabase stop
```
