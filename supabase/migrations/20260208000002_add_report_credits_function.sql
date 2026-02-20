-- Helper function to increment report credits
CREATE OR REPLACE FUNCTION public.increment_report_credits(
    p_user_id UUID,
    p_credits INTEGER
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE public.profiles
    SET report_credits = report_credits + p_credits
    WHERE id = p_user_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
