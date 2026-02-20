-- LAWN Database Schema Migration
-- Create tables for user profiles, saved properties, and comparisons

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    user_type TEXT CHECK (user_type IN ('first-home-buyer', 'investor', 'upgrader')),
    subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro')),
    annual_income NUMERIC,
    deposit NUMERIC,
    is_first_home_buyer BOOLEAN NOT NULL DEFAULT false,
    report_credits INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create saved_properties table
CREATE TABLE IF NOT EXISTS public.saved_properties (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    address TEXT NOT NULL,
    lot_dp TEXT,
    property_value NUMERIC,
    zone TEXT,
    area NUMERIC,
    flood BOOLEAN,
    bushfire BOOLEAN,
    heritage BOOLEAN,
    weekly_rent NUMERIC,
    geometry JSONB,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create property_comparisons table
CREATE TABLE IF NOT EXISTS public.property_comparisons (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    property_ids TEXT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create stripe_customers table for payment tracking
CREATE TABLE IF NOT EXISTS public.stripe_customers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
    stripe_customer_id TEXT NOT NULL UNIQUE,
    stripe_subscription_id TEXT,
    subscription_status TEXT,
    current_period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS saved_properties_user_id_idx ON public.saved_properties(user_id);
CREATE INDEX IF NOT EXISTS saved_properties_created_at_idx ON public.saved_properties(created_at DESC);
CREATE INDEX IF NOT EXISTS property_comparisons_user_id_idx ON public.property_comparisons(user_id);
CREATE INDEX IF NOT EXISTS stripe_customers_user_id_idx ON public.stripe_customers(user_id);
CREATE INDEX IF NOT EXISTS stripe_customers_stripe_customer_id_idx ON public.stripe_customers(stripe_customer_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_customers ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Saved properties policies
CREATE POLICY "Users can view own saved properties"
    ON public.saved_properties FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved properties"
    ON public.saved_properties FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own saved properties"
    ON public.saved_properties FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved properties"
    ON public.saved_properties FOR DELETE
    USING (auth.uid() = user_id);

-- Property comparisons policies
CREATE POLICY "Users can view own comparisons"
    ON public.property_comparisons FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own comparisons"
    ON public.property_comparisons FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comparisons"
    ON public.property_comparisons FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comparisons"
    ON public.property_comparisons FOR DELETE
    USING (auth.uid() = user_id);

-- Stripe customers policies (service role only)
CREATE POLICY "Service role can manage stripe customers"
    ON public.stripe_customers FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

-- Function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, subscription_tier, is_first_home_buyer)
    VALUES (NEW.id, NEW.email, 'free', false);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_property_comparisons_updated_at BEFORE UPDATE ON public.property_comparisons
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_stripe_customers_updated_at BEFORE UPDATE ON public.stripe_customers
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
