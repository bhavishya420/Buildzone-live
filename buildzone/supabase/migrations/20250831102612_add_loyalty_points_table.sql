-- Location: supabase/migrations/20250831102612_add_loyalty_points_table.sql
-- Schema Analysis: Existing schema has orders, user_profiles tables with proper relationships
-- Integration Type: Addition - Adding loyalty_points table for credit scoring
-- Dependencies: user_profiles table (existing)

-- Create loyalty_points table for tracking user credit scores and tiers
CREATE TABLE public.loyalty_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    buildscore NUMERIC NOT NULL DEFAULT 0,
    tier TEXT NOT NULL DEFAULT 'Silver',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_loyalty_points_user_id ON public.loyalty_points(user_id);
CREATE INDEX idx_loyalty_points_tier ON public.loyalty_points(tier);

-- Enable RLS
ALTER TABLE public.loyalty_points ENABLE ROW LEVEL SECURITY;

-- RLS Policy - Pattern 2: Simple User Ownership
CREATE POLICY "users_manage_own_loyalty_points"
ON public.loyalty_points
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Create function for credit eligibility calculation
CREATE OR REPLACE FUNCTION public.calculate_credit_eligibility(input_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    order_count INTEGER := 0;
    total_spend NUMERIC := 0;
    shop_size_value TEXT := '';
    credit_score NUMERIC := 0;
    credit_limit NUMERIC := 0;
    tier_value TEXT := 'Silver';
    shop_size_bonus INTEGER := 0;
BEGIN
    -- Fetch order count and total spend from orders table
    SELECT 
        COUNT(*),
        COALESCE(SUM(total_amount), 0)
    INTO order_count, total_spend
    FROM public.orders 
    WHERE user_id = input_user_id;
    
    -- Fetch shop_size from user_profiles
    SELECT shop_size INTO shop_size_value
    FROM public.user_profiles 
    WHERE id = input_user_id;
    
    -- Calculate base credit score: (order_count * 10) + (total_spend / 10000)
    credit_score := (order_count * 10) + (total_spend / 10000);
    
    -- Add shop_size bonus
    IF shop_size_value = 'medium' THEN
        shop_size_bonus := 10;
    ELSIF shop_size_value = 'large' THEN
        shop_size_bonus := 20;
    ELSE
        shop_size_bonus := 0;
    END IF;
    
    credit_score := credit_score + shop_size_bonus;
    
    -- Cap score at 100
    IF credit_score > 100 THEN
        credit_score := 100;
    END IF;
    
    -- Calculate credit limit: score * 5000, cap at ₹5,00,000
    credit_limit := credit_score * 5000;
    IF credit_limit > 500000 THEN
        credit_limit := 500000;
    END IF;
    
    -- Determine tier
    IF credit_score >= 0 AND credit_score <= 100 THEN
        tier_value := 'Silver';
    END IF;
    
    IF credit_limit >= 101 AND credit_limit <= 250000 THEN
        tier_value := 'Gold';
    END IF;
    
    IF credit_limit >= 251000 THEN
        tier_value := 'Platinum';
    END IF;
    
    -- Update or insert loyalty_points record
    INSERT INTO public.loyalty_points (user_id, buildscore, tier, updated_at)
    VALUES (input_user_id, credit_score, tier_value, CURRENT_TIMESTAMP)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        buildscore = EXCLUDED.buildscore,
        tier = EXCLUDED.tier,
        updated_at = CURRENT_TIMESTAMP;
    
    -- Return result JSON
    RETURN jsonb_build_object(
        'score', credit_score,
        'limit', credit_limit,
        'tier', tier_value,
        'order_count', order_count,
        'total_spend', total_spend,
        'shop_size', shop_size_value
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error calculating credit eligibility: %', SQLERRM;
        RETURN jsonb_build_object(
            'score', 0,
            'limit', 0,
            'tier', 'Silver',
            'error', SQLERRM
        );
END;
$$;

-- Create unique constraint on user_id for loyalty_points
ALTER TABLE public.loyalty_points ADD CONSTRAINT loyalty_points_user_id_key UNIQUE (user_id);

-- Add updated_at trigger
CREATE TRIGGER handle_updated_at_loyalty_points
    BEFORE UPDATE ON public.loyalty_points
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Mock data for demonstration
DO $$
DECLARE
    existing_user_id UUID;
BEGIN
    -- Get existing user ID from user_profiles
    SELECT id INTO existing_user_id FROM public.user_profiles LIMIT 1;
    
    IF existing_user_id IS NOT NULL THEN
        -- Create initial loyalty points record
        INSERT INTO public.loyalty_points (user_id, buildscore, tier)
        VALUES (existing_user_id, 45, 'Silver');
        
        RAISE NOTICE 'Mock loyalty points created for user: %', existing_user_id;
    ELSE
        RAISE NOTICE 'No existing users found. Create users first.';
    END IF;
END $$;