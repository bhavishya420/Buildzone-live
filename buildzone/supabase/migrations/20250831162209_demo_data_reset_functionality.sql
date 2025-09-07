-- Location: supabase/migrations/20250831162209_demo_data_reset_functionality.sql
-- Schema Analysis: Existing user_profiles, orders tables with proper relationships
-- Integration Type: Enhancement - Adding demo data management functionality
-- Dependencies: user_profiles, orders tables (existing)

-- Create cleanup function for demo data reset
CREATE OR REPLACE FUNCTION public.reset_demo_data()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    demo_user_emails TEXT[] := ARRAY['sharma@demo.com', 'gupta@demo.com'];
    demo_auth_ids UUID[];
BEGIN
    -- Get auth user IDs for demo emails
    SELECT ARRAY_AGG(id) INTO demo_auth_ids
    FROM auth.users
    WHERE email = ANY(demo_user_emails);

    -- Delete in dependency order (children first)
    DELETE FROM public.orders WHERE user_id = ANY(demo_auth_ids);
    DELETE FROM public.user_profiles WHERE id = ANY(demo_auth_ids);
    
    -- Delete auth.users last (after all references are removed)
    DELETE FROM auth.users WHERE id = ANY(demo_auth_ids);
    
    -- Create fresh demo users
    PERFORM public.create_demo_users();
    
    RAISE NOTICE 'Demo data reset completed successfully';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Demo data reset failed: %', SQLERRM;
END;
$$;

-- Create function to generate demo users
CREATE OR REPLACE FUNCTION public.create_demo_users()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    sharma_id UUID := gen_random_uuid();
    gupta_id UUID := gen_random_uuid();
BEGIN
    -- Create auth users with complete field structure
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (sharma_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'sharma@demo.com', crypt('demo123', gen_salt('bf', 10)), now(), now(), now(),
         '{"name": "Rajesh Sharma", "shop_name": "Sharma Hardware", "shop_size": "small"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (gupta_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'gupta@demo.com', crypt('demo123', gen_salt('bf', 10)), now(), now(), now(),
         '{"name": "Priya Gupta", "shop_name": "Gupta Sanitary Mart", "shop_size": "large"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create demo orders for Sharma (smaller amounts)
    INSERT INTO public.orders (user_id, total_amount, status, delivery_address, contact_number, items)
    VALUES
        (sharma_id, 2000.00, 'Delivered'::order_status, 'Shop 15, Hardware Market, Delhi-110001', '+91-9876543210',
         '[{"name": "Cement Bags", "quantity": 10, "price": 1500}, {"name": "Steel Rods", "quantity": 5, "price": 500}]'::jsonb),
        (sharma_id, 1500.00, 'Delivered'::order_status, 'Shop 15, Hardware Market, Delhi-110001', '+91-9876543210',
         '[{"name": "Paint Brushes", "quantity": 20, "price": 800}, {"name": "Primer", "quantity": 10, "price": 700}]'::jsonb);

    -- Create demo orders for Gupta (larger amounts for higher tier)
    INSERT INTO public.orders (user_id, total_amount, status, delivery_address, contact_number, items)
    VALUES
        (gupta_id, 60000.00, 'Delivered'::order_status, 'Showroom 23A, Sanitary Market, Mumbai-400001', '+91-9123456789',
         '[{"name": "Premium Bathroom Fixtures", "quantity": 15, "price": 40000}, {"name": "Designer Tiles", "quantity": 50, "price": 20000}]'::jsonb),
        (gupta_id, 45000.00, 'Delivered'::order_status, 'Showroom 23A, Sanitary Market, Mumbai-400001', '+91-9123456789',
         '[{"name": "Water Heaters", "quantity": 8, "price": 30000}, {"name": "Faucets Set", "quantity": 25, "price": 15000}]'::jsonb),
        (gupta_id, 12000.00, 'Delivered'::order_status, 'Showroom 23A, Sanitary Market, Mumbai-400001', '+91-9123456789',
         '[{"name": "Bathroom Accessories", "quantity": 30, "price": 8000}, {"name": "Mirror Sets", "quantity": 10, "price": 4000}]'::jsonb);

    RAISE NOTICE 'Demo users created successfully';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Demo user creation failed: %', SQLERRM;
END;
$$;

-- Create initial demo users on first run
SELECT public.create_demo_users();