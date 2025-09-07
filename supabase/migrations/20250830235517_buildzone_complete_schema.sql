-- Location: supabase/migrations/20250830235517_buildzone_complete_schema.sql
-- Schema Analysis: No existing schema found - creating complete schema from scratch
-- Integration Type: Full authentication + e-commerce + community platform
-- Dependencies: auth.users (Supabase managed)

-- 1. Custom Types
CREATE TYPE public.order_status AS ENUM ('Pending', 'Confirmed', 'Delivered', 'Cancelled');
CREATE TYPE public.credit_status AS ENUM ('Pending', 'Approved', 'Rejected');
CREATE TYPE public.user_role AS ENUM ('admin', 'customer');

-- 2. User Profiles Table (Critical intermediary table for PostgREST compatibility)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT NOT NULL UNIQUE,
    shop_name TEXT,
    role public.user_role DEFAULT 'customer'::public.user_role,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Products Table
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- e.g. Taps, Pipes, Tanks, Valves
    brand TEXT,
    price NUMERIC(10,2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    image_url TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Orders Table
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    items JSONB NOT NULL, -- array of {productId, qty, price}
    total_amount NUMERIC(10,2) NOT NULL,
    status public.order_status DEFAULT 'Pending'::public.order_status,
    delivery_address TEXT,
    contact_number TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Offers Table
CREATE TABLE public.offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    discount_percentage NUMERIC(5,2),
    valid_till DATE,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Credit Applications Table
CREATE TABLE public.credit_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    pan_number TEXT NOT NULL,
    gst_number TEXT,
    requested_limit NUMERIC(10,2) NOT NULL,
    status public.credit_status DEFAULT 'Pending'::public.credit_status,
    documents_uploaded BOOLEAN DEFAULT false,
    admin_notes TEXT,
    approved_limit NUMERIC(10,2),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. Community Feed Table
CREATE TABLE public.community_feed (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_name TEXT,
    category TEXT DEFAULT 'general',
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. Essential Indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_brand ON public.products(brand);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_credit_applications_user_id ON public.credit_applications(user_id);
CREATE INDEX idx_credit_applications_status ON public.credit_applications(status);
CREATE INDEX idx_offers_valid_till ON public.offers(valid_till);
CREATE INDEX idx_community_feed_created_at ON public.community_feed(created_at DESC);

-- 9. Storage Buckets
-- Product images (public for marketplace viewing)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'product-images',
    'product-images',
    true,
    10485760, -- 10MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
);

-- Offer banners (public for promotional content)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'offer-banners',
    'offer-banners', 
    true,
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
);

-- KYC documents (private for security)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'kyc-documents',
    'kyc-documents',
    false,
    20971520, -- 20MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'application/pdf']
);

-- 10. Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_feed ENABLE ROW LEVEL SECURITY;

-- 11. RLS Policies

-- Pattern 1: Core user table - user_profiles (simple, no functions)
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Pattern 4: Public read, admin write - products
CREATE POLICY "public_can_read_products"
ON public.products
FOR SELECT
TO public
USING (true);

CREATE POLICY "admins_manage_products"
ON public.products
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM auth.users au
        WHERE au.id = auth.uid() 
        AND (au.raw_user_meta_data->>'role' = 'admin')
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM auth.users au
        WHERE au.id = auth.uid() 
        AND (au.raw_user_meta_data->>'role' = 'admin')
    )
);

-- Pattern 2: Simple user ownership - orders
CREATE POLICY "users_manage_own_orders"
ON public.orders
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Pattern 4: Public read, admin write - offers
CREATE POLICY "public_can_read_offers"
ON public.offers
FOR SELECT
TO public
USING (true);

CREATE POLICY "admins_manage_offers"
ON public.offers
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM auth.users au
        WHERE au.id = auth.uid() 
        AND (au.raw_user_meta_data->>'role' = 'admin')
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM auth.users au
        WHERE au.id = auth.uid() 
        AND (au.raw_user_meta_data->>'role' = 'admin')
    )
);

-- Pattern 2: Simple user ownership - credit applications
CREATE POLICY "users_manage_own_credit_applications"
ON public.credit_applications
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Admins can view all credit applications
CREATE POLICY "admins_view_all_credit_applications"
ON public.credit_applications
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM auth.users au
        WHERE au.id = auth.uid() 
        AND (au.raw_user_meta_data->>'role' = 'admin')
    )
);

-- Pattern 4: Public read - community feed (anyone can read)
CREATE POLICY "public_can_read_community_feed"
ON public.community_feed
FOR SELECT
TO public
USING (true);

-- Admins can manage community feed
CREATE POLICY "admins_manage_community_feed"
ON public.community_feed
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM auth.users au
        WHERE au.id = auth.uid() 
        AND (au.raw_user_meta_data->>'role' = 'admin')
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM auth.users au
        WHERE au.id = auth.uid() 
        AND (au.raw_user_meta_data->>'role' = 'admin')
    )
);

-- 12. Storage RLS Policies

-- Product images - public read, admin upload
CREATE POLICY "public_can_view_product_images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'product-images');

CREATE POLICY "admins_upload_product_images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'product-images'
    AND EXISTS (
        SELECT 1 FROM auth.users au
        WHERE au.id = auth.uid() 
        AND (au.raw_user_meta_data->>'role' = 'admin')
    )
);

-- Fixed: Separate policies for UPDATE and DELETE operations
CREATE POLICY "admins_update_product_images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id = 'product-images'
    AND EXISTS (
        SELECT 1 FROM auth.users au
        WHERE au.id = auth.uid() 
        AND (au.raw_user_meta_data->>'role' = 'admin')
    )
);

CREATE POLICY "admins_delete_product_images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'product-images'
    AND EXISTS (
        SELECT 1 FROM auth.users au
        WHERE au.id = auth.uid() 
        AND (au.raw_user_meta_data->>'role' = 'admin')
    )
);

-- Offer banners - public read, admin upload
CREATE POLICY "public_can_view_offer_banners"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'offer-banners');

CREATE POLICY "admins_insert_offer_banners"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'offer-banners'
    AND EXISTS (
        SELECT 1 FROM auth.users au
        WHERE au.id = auth.uid() 
        AND (au.raw_user_meta_data->>'role' = 'admin')
    )
);

CREATE POLICY "admins_update_offer_banners"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id = 'offer-banners'
    AND EXISTS (
        SELECT 1 FROM auth.users au
        WHERE au.id = auth.uid() 
        AND (au.raw_user_meta_data->>'role' = 'admin')
    )
);

CREATE POLICY "admins_delete_offer_banners"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'offer-banners'
    AND EXISTS (
        SELECT 1 FROM auth.users au
        WHERE au.id = auth.uid() 
        AND (au.raw_user_meta_data->>'role' = 'admin')
    )
);

-- KYC documents - private user access
CREATE POLICY "users_manage_own_kyc_documents"
ON storage.objects
FOR ALL
TO authenticated
USING (
    bucket_id = 'kyc-documents' 
    AND owner = auth.uid()
    AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
    bucket_id = 'kyc-documents'
    AND owner = auth.uid()
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Admins can view KYC documents for approval
CREATE POLICY "admins_view_kyc_documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
    bucket_id = 'kyc-documents'
    AND EXISTS (
        SELECT 1 FROM auth.users au
        WHERE au.id = auth.uid() 
        AND (au.raw_user_meta_data->>'role' = 'admin')
    )
);

-- 13. Functions for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, name, phone, shop_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        NEW.phone,
        NEW.raw_user_meta_data->>'shop_name',
        COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'customer'::public.user_role)
    );
    RETURN NEW;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 14. Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- Add updated_at triggers to relevant tables
CREATE TRIGGER handle_updated_at_user_profiles
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_products
    BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_orders
    BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_offers
    BEFORE UPDATE ON public.offers
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_credit_applications
    BEFORE UPDATE ON public.credit_applications
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 15. Mock Data for Development
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    customer_uuid UUID := gen_random_uuid();
    product1_uuid UUID := gen_random_uuid();
    product2_uuid UUID := gen_random_uuid();
    offer1_uuid UUID := gen_random_uuid();
BEGIN
    -- Create mock auth users
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@buildzone.com', crypt('Admin@123', gen_salt('bf', 10)), now(), now(), now(),
         '{"name": "Admin User", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (customer_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'customer@example.com', crypt('Customer@123', gen_salt('bf', 10)), now(), now(), now(),
         '{"name": "John Doe", "shop_name": "Doe Hardware Store"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, '+919876543210', '', '', null);

    -- Mock products
    INSERT INTO public.products (id, name, category, brand, price, stock, description) VALUES
        (product1_uuid, 'Premium Kitchen Tap', 'Taps', 'AquaFlow', 2500.00, 25, 'High-quality stainless steel kitchen tap with modern design'),
        (product2_uuid, 'PVC Water Pipe 1 inch', 'Pipes', 'FlowTech', 150.00, 100, 'Durable PVC water pipe suitable for residential use'),
        (gen_random_uuid(), 'Water Storage Tank 500L', 'Tanks', 'AquaStore', 8500.00, 10, 'Food-grade plastic water storage tank'),
        (gen_random_uuid(), 'Ball Valve 2 inch', 'Valves', 'ValveTech', 450.00, 50, 'Heavy-duty brass ball valve for industrial use');

    -- Mock offers
    INSERT INTO public.offers (id, title, description, discount_percentage, valid_till) VALUES
        (offer1_uuid, 'New Year Special', 'Get 20% off on all taps and fittings', 20.00, '2025-01-31'),
        (gen_random_uuid(), 'Bulk Purchase Discount', 'Buy pipes in bulk and save up to 15%', 15.00, '2025-02-28');

    -- Mock order
    INSERT INTO public.orders (user_id, items, total_amount, delivery_address, contact_number) VALUES
        (customer_uuid, 
         '[{"productId": "'|| product1_uuid ||'", "qty": 2, "price": 2500.00}, {"productId": "'|| product2_uuid ||'", "qty": 5, "price": 150.00}]'::jsonb,
         5750.00,
         '123 Main Street, Cityville, State 12345',
         '+919876543210'
        );

    -- Mock credit application
    INSERT INTO public.credit_applications (user_id, pan_number, gst_number, requested_limit) VALUES
        (customer_uuid, 'ABCDE1234F', '27ABCDE1234F1Z5', 50000.00);

    -- Mock community feed posts
    INSERT INTO public.community_feed (title, content, author_name, category) VALUES
        ('Best Practices for Pipe Installation', 'Here are some tips for proper pipe installation in residential buildings...', 'Expert Plumber', 'tips'),
        ('New Valve Technology', 'Latest innovations in valve technology are making plumbing more efficient...', 'Industry News', 'technology'),
        ('Seasonal Maintenance Tips', 'Prepare your plumbing system for the upcoming season with these maintenance tips...', 'Home Advisor', 'maintenance');

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error during mock data creation: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error during mock data creation: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error during mock data creation: %', SQLERRM;
END $$;

-- 16. Helpful Views for API endpoints
CREATE VIEW public.order_details AS
SELECT 
    o.id,
    o.user_id,
    up.name as customer_name,
    up.shop_name,
    o.items,
    o.total_amount,
    o.status,
    o.delivery_address,
    o.contact_number,
    o.created_at,
    o.updated_at
FROM public.orders o
JOIN public.user_profiles up ON o.user_id = up.id;

CREATE VIEW public.product_catalog AS
SELECT 
    p.*,
    CASE 
        WHEN p.stock > 0 THEN 'In Stock'
        ELSE 'Out of Stock'
    END as availability_status
FROM public.products p
WHERE p.stock >= 0
ORDER BY p.category, p.name;