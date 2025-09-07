-- Fix BuildScore and Tier Logic for BNPL Credit Scoring
-- This migration corrects the tier calculation logic to use BuildScore instead of capped credit score

-- Drop existing function
DROP FUNCTION IF EXISTS public.calculate_credit_eligibility(uuid);

-- Create corrected function with proper BuildScore tier logic
CREATE OR REPLACE FUNCTION public.calculate_credit_eligibility(input_user_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    order_count INTEGER := 0;
    total_spend NUMERIC := 0;
    shop_size_value TEXT := '';
    credit_score NUMERIC := 0;
    buildscore NUMERIC := 0;
    credit_limit NUMERIC := 0;
    tier_value TEXT := 'Silver';
    shop_size_bonus INTEGER := 0;
    offer_text TEXT := '45 days interest-free';
BEGIN
    -- Fetch order count and total spend from orders table (only completed orders)
    SELECT 
        COUNT(*),
        COALESCE(SUM(total_amount), 0)
    INTO order_count, total_spend
    FROM public.orders 
    WHERE user_id = input_user_id 
    AND status IN ('Delivered', 'Confirmed');
    
    -- Fetch shop_size from user_profiles
    SELECT shop_size INTO shop_size_value
    FROM public.user_profiles 
    WHERE id = input_user_id;
    
    -- Calculate BuildScore using the required formula: (order_count * 10) + (total_spend / 10000)
    buildscore := (order_count * 10) + (total_spend / 10000);
    
    -- Add shop_size bonus to BuildScore
    IF shop_size_value = 'medium' THEN
        shop_size_bonus := 10;
    ELSIF shop_size_value = 'large' THEN
        shop_size_bonus := 20;
    ELSE
        shop_size_bonus := 0;
    END IF;
    
    buildscore := buildscore + shop_size_bonus;
    
    -- Calculate credit score (capped at 100 for credit eligibility)
    credit_score := buildscore;
    IF credit_score > 100 THEN
        credit_score := 100;
    END IF;
    
    -- Calculate credit limit: credit_score * 5000, cap at ₹5,00,000
    credit_limit := credit_score * 5000;
    IF credit_limit > 500000 THEN
        credit_limit := 500000;
    END IF;
    
    -- Determine tier based on BuildScore (NOT capped credit_score)
    -- Silver: 0–100, Gold: 101–250, Platinum: 251+
    IF buildscore >= 0 AND buildscore <= 100 THEN
        tier_value := 'Silver';
    ELSIF buildscore >= 101 AND buildscore <= 250 THEN
        tier_value := 'Gold';
    ELSIF buildscore >= 251 THEN
        tier_value := 'Platinum';
    ELSE
        tier_value := 'Silver'; -- Default fallback
    END IF;
    
    -- Update or insert loyalty_points record with BuildScore
    INSERT INTO public.loyalty_points (user_id, buildscore, tier, updated_at)
    VALUES (input_user_id, buildscore, tier_value, CURRENT_TIMESTAMP)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        buildscore = EXCLUDED.buildscore,
        tier = EXCLUDED.tier,
        updated_at = CURRENT_TIMESTAMP;
    
    -- Return result JSON with all required fields
    RETURN jsonb_build_object(
        'credit_score', credit_score,
        'credit_limit', credit_limit,
        'offer', offer_text,
        'tier', tier_value,
        'score', credit_score,
        'limit', credit_limit,
        'buildscore', buildscore,
        'order_count', order_count,
        'total_spend', total_spend,
        'shop_size', shop_size_value
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error calculating credit eligibility: %', SQLERRM;
        RETURN jsonb_build_object(
            'credit_score', 0,
            'credit_limit', 0,
            'offer', offer_text,
            'tier', 'Silver',
            'score', 0,
            'limit', 0,
            'buildscore', 0,
            'order_count', order_count,
            'total_spend', total_spend,
            'error', SQLERRM
        );
END;
$function$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.calculate_credit_eligibility(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.calculate_credit_eligibility(uuid) TO anon;

-- Add comment for documentation
COMMENT ON FUNCTION public.calculate_credit_eligibility(uuid) IS 'Calculate BNPL credit eligibility with BuildScore gamification. BuildScore = (order_count * 10) + (total_spend / 10000). Tiers: Silver (0-100), Gold (101-250), Platinum (251+)';