-- Add report credits purchase tracking

CREATE TABLE IF NOT EXISTS public.report_credit_purchases (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    stripe_payment_intent_id TEXT NOT NULL UNIQUE,
    credits_purchased INTEGER NOT NULL,
    amount_paid INTEGER NOT NULL, -- in cents
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS report_credit_purchases_user_id_idx ON public.report_credit_purchases(user_id);

-- Enable RLS
ALTER TABLE public.report_credit_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own credit purchases"
    ON public.report_credit_purchases FOR SELECT
    USING (auth.uid() = user_id);

-- Add report usage tracking
CREATE TABLE IF NOT EXISTS public.report_usage (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    property_id UUID REFERENCES public.saved_properties(id) ON DELETE SET NULL,
    report_type TEXT NOT NULL CHECK (report_type IN ('pdf', 'pptx')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS report_usage_user_id_idx ON public.report_usage(user_id);
CREATE INDEX IF NOT EXISTS report_usage_created_at_idx ON public.report_usage(created_at DESC);

-- Enable RLS
ALTER TABLE public.report_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own report usage"
    ON public.report_usage FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own report usage"
    ON public.report_usage FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Function to check if user has report credits available
CREATE OR REPLACE FUNCTION public.has_report_credits(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_subscription_tier TEXT;
    v_report_credits INTEGER;
    v_reports_this_month INTEGER;
BEGIN
    -- Get user subscription tier and credits
    SELECT subscription_tier, report_credits
    INTO v_subscription_tier, v_report_credits
    FROM public.profiles
    WHERE id = p_user_id;

    -- Pro users get 3 reports per month
    IF v_subscription_tier = 'pro' THEN
        SELECT COUNT(*)
        INTO v_reports_this_month
        FROM public.report_usage
        WHERE user_id = p_user_id
        AND created_at >= DATE_TRUNC('month', NOW());

        RETURN v_reports_this_month < 3;
    END IF;

    -- Free users need purchased credits
    RETURN v_report_credits > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to consume a report credit
CREATE OR REPLACE FUNCTION public.consume_report_credit(
    p_user_id UUID,
    p_property_id UUID,
    p_report_type TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    v_subscription_tier TEXT;
    v_report_credits INTEGER;
    v_reports_this_month INTEGER;
BEGIN
    -- Get user info
    SELECT subscription_tier, report_credits
    INTO v_subscription_tier, v_report_credits
    FROM public.profiles
    WHERE id = p_user_id;

    -- Check if Pro user
    IF v_subscription_tier = 'pro' THEN
        SELECT COUNT(*)
        INTO v_reports_this_month
        FROM public.report_usage
        WHERE user_id = p_user_id
        AND created_at >= DATE_TRUNC('month', NOW());

        IF v_reports_this_month >= 3 THEN
            RAISE EXCEPTION 'Monthly report limit reached';
        END IF;
    ELSE
        -- Free user - check credits
        IF v_report_credits <= 0 THEN
            RAISE EXCEPTION 'No report credits available';
        END IF;

        -- Deduct credit
        UPDATE public.profiles
        SET report_credits = report_credits - 1
        WHERE id = p_user_id;
    END IF;

    -- Record usage
    INSERT INTO public.report_usage (user_id, property_id, report_type)
    VALUES (p_user_id, p_property_id, p_report_type);

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
