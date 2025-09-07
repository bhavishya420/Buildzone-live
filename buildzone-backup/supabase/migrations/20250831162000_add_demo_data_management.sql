-- Location: supabase/migrations/20250831162000_add_demo_data_management.sql
-- Adding demo data seeding and reset functionality for Buildzone app
-- Based on existing schema analysis: user_profiles and orders tables already exist

-- Reset Demo Data Function
CREATE OR REPLACE FUNCTION public.reset_demo_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    demo_user_ids UUID[];
BEGIN
    -- Get demo user IDs first
    SELECT ARRAY_AGG(id) INTO demo_user_ids
    FROM auth.users
    WHERE email IN ('sharma@demo.com', 'gupta@demo.com');

    -- Delete in dependency order (children first)
    DELETE FROM public.orders WHERE user_id = ANY(demo_user_ids);
    DELETE FROM public.user_profiles WHERE id = ANY(demo_user_ids);
    
    -- Delete from auth.users last (after all references are removed)
    DELETE FROM auth.users WHERE id = ANY(demo_user_ids);
    
    RAISE NOTICE 'Demo data cleanup completed for % users', array_length(demo_user_ids, 1);
EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key constraint prevents deletion: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Demo data cleanup failed: %', SQLERRM;
END;
$$;

-- Seed Demo Data Function
CREATE OR REPLACE FUNCTION public.seed_demo_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    sharma_uuid UUID := gen_random_uuid();
    gupta_uuid UUID := gen_random_uuid();
    order1_uuid UUID := gen_random_uuid();
    order2_uuid UUID := gen_random_uuid();
    order3_uuid UUID := gen_random_uuid();
    order4_uuid UUID := gen_random_uuid();
    order5_uuid UUID := gen_random_uuid();
BEGIN
    -- First reset any existing demo data
    PERFORM public.reset_demo_data();
    
    -- Create auth users with required fields for demo accounts
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (sharma_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'sharma@demo.com', crypt('demo123', gen_salt('bf', 10)), now(), now(), now(),
         '{"shop_name": "Sharma Hardware", "shop_size": "small", "name": "Sharma Hardware"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (gupta_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'gupta@demo.com', crypt('demo123', gen_salt('bf', 10)), now(), now(), now(),
         '{"shop_name": "Gupta Sanitary Mart", "shop_size": "large", "name": "Gupta Sanitary Mart"}'::jsonb,
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create user profiles (will be auto-created by trigger, but ensuring they exist)
    INSERT INTO public.user_profiles (id, email, name, shop_name, shop_size, role, created_at, updated_at)
    VALUES
        (sharma_uuid, 'sharma@demo.com', 'Sharma Hardware', 'Sharma Hardware', 'small', 'customer'::public.user_role, now(), now()),
        (gupta_uuid, 'gupta@demo.com', 'Gupta Sanitary Mart', 'Gupta Sanitary Mart', 'large', 'customer'::public.user_role, now(), now())
    ON CONFLICT (id) DO UPDATE SET
        shop_name = EXCLUDED.shop_name,
        shop_size = EXCLUDED.shop_size,
        updated_at = now();

    -- Create orders for Sharma (small shop - lower values)
    INSERT INTO public.orders (id, user_id, total_amount, status, items, delivery_address, contact_number, created_at, updated_at)
    VALUES
        (order1_uuid, sharma_uuid, 2000.00, 'Delivered'::public.order_status,
         '[{"name": "Cement Bags", "quantity": 10, "price": 200}]'::jsonb,
         'Shop No. 15, Hardware Market, Delhi', '+91-9876543210',
         now() - interval '30 days', now() - interval '25 days'),
        (order2_uuid, sharma_uuid, 1500.00, 'Delivered'::public.order_status,
         '[{"name": "Steel Rods", "quantity": 5, "price": 300}]'::jsonb,
         'Shop No. 15, Hardware Market, Delhi', '+91-9876543210',
         now() - interval '15 days', now() - interval '10 days');

    -- Create orders for Gupta (large shop - higher values)
    INSERT INTO public.orders (id, user_id, total_amount, status, items, delivery_address, contact_number, created_at, updated_at)
    VALUES
        (order3_uuid, gupta_uuid, 60000.00, 'Delivered'::public.order_status,
         '[{"name": "Bathroom Fittings Set", "quantity": 50, "price": 1200}]'::jsonb,
         'Gupta Sanitary Mart, Main Road, Mumbai', '+91-9123456789',
         now() - interval '60 days', now() - interval '55 days'),
        (order4_uuid, gupta_uuid, 45000.00, 'Delivered'::public.order_status,
         '[{"name": "Tiles Premium Collection", "quantity": 100, "price": 450}]'::jsonb,
         'Gupta Sanitary Mart, Main Road, Mumbai', '+91-9123456789',
         now() - interval '40 days', now() - interval '35 days'),
        (order5_uuid, gupta_uuid, 12000.00, 'Delivered'::public.order_status,
         '[{"name": "Water Heater Units", "quantity": 8, "price": 1500}]'::jsonb,
         'Gupta Sanitary Mart, Main Road, Mumbai', '+91-9123456789',
         now() - interval '20 days', now() - interval '15 days');

    RAISE NOTICE 'Demo data seeded successfully: Sharma Hardware (₹3,500 total) and Gupta Sanitary Mart (₹1,17,000 total)';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Demo data seeding failed: %', SQLERRM;
        RAISE;
END;
$$;

-- Execute the demo data seeding
SELECT public.seed_demo_data();