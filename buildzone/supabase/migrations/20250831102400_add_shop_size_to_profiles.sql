-- Migration: Add shop_size column to user_profiles for BNPL credit scoring
-- Schema Analysis: user_profiles already exists with shop_name, orders table has total_amount
-- Integration Type: Addition (adding shop_size column only)
-- Dependencies: user_profiles table (existing)

-- Add shop_size column to existing user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN shop_size TEXT CHECK (shop_size IN ('small', 'medium', 'large'));

-- Add index for shop_size for better query performance
CREATE INDEX idx_user_profiles_shop_size ON public.user_profiles(shop_size);

-- Comment on the new column
COMMENT ON COLUMN public.user_profiles.shop_size IS 'Shop size category for BNPL credit scoring: small, medium, or large';

-- Update existing records with default value if needed
UPDATE public.user_profiles 
SET shop_size = 'small' 
WHERE shop_size IS NULL;

-- Mock data example for testing BNPL credit scoring calculations
DO $$
DECLARE
    existing_user_id UUID;
BEGIN
    -- Get existing user ID from user_profiles
    SELECT id INTO existing_user_id FROM public.user_profiles LIMIT 1;
    
    -- Update existing user profile with shop_size for testing
    IF existing_user_id IS NOT NULL THEN
        UPDATE public.user_profiles 
        SET shop_size = 'medium' 
        WHERE id = existing_user_id;
    END IF;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Mock data update failed: %', SQLERRM;
END $$;