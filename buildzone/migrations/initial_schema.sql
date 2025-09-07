-- Buildzone Initial Schema Migration
-- This file represents the combined schema for Buildzone app
-- Run this migration if setting up a fresh database

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom enum types
DO $$ BEGIN
    CREATE TYPE public.user_role AS ENUM ('admin', 'customer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.order_status AS ENUM ('Pending', 'Confirmed', 'Delivered', 'Cancelled', 'Draft');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.credit_status AS ENUM ('Pending', 'Approved', 'Rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create user_profiles table (main user data)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role public.user_role DEFAULT 'customer',
    shop_name TEXT,
    shop_size TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create profile table (legacy compatibility)
CREATE TABLE IF NOT EXISTS public.profile (
    id UUID PRIMARY KEY,
    shop_name TEXT NOT NULL,
    shop_size TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    category TEXT NOT NULL,
    brand TEXT,
    stock INTEGER DEFAULT 0,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    items JSONB NOT NULL,
    total_amount NUMERIC NOT NULL,
    status public.order_status DEFAULT 'Pending',
    contact_number TEXT,
    delivery_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create inventory table
CREATE TABLE IF NOT EXISTS public.inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    qty INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create suggested_orders table
CREATE TABLE IF NOT EXISTS public.suggested_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    suggested_qty INTEGER NOT NULL,
    reason TEXT NOT NULL,
    lead_time_days INTEGER NOT NULL,
    safety_factor NUMERIC NOT NULL,
    status TEXT DEFAULT 'suggested',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create agent_logs table
CREATE TABLE IF NOT EXISTS public.agent_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_name TEXT NOT NULL,
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create loyalty_points table
CREATE TABLE IF NOT EXISTS public.loyalty_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    buildscore NUMERIC DEFAULT 0 NOT NULL,
    tier TEXT DEFAULT 'Silver' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create order_items view
CREATE OR REPLACE VIEW public.order_items AS
SELECT 
    o.user_id,
    o.id as order_id,
    o.created_at,
    item_data.product_id::UUID as product_id,
    (item_data.quantity)::INTEGER as qty
FROM 
    public.orders o,
    LATERAL jsonb_array_elements(o.items) AS item(data),
    LATERAL jsonb_to_record(item.data) AS item_data(product_id text, quantity text)
WHERE 
    o.status = 'Delivered';

-- Create credit_applications table
CREATE TABLE IF NOT EXISTS public.credit_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    pan_number TEXT NOT NULL,
    gst_number TEXT,
    requested_limit NUMERIC NOT NULL,
    documents_uploaded BOOLEAN DEFAULT false,
    status public.credit_status DEFAULT 'Pending',
    admin_notes TEXT,
    approved_limit NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create offers table
CREATE TABLE IF NOT EXISTS public.offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    discount_percentage NUMERIC,
    valid_till TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create community_feed table
CREATE TABLE IF NOT EXISTS public.community_feed (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_name TEXT NOT NULL,
    image_url TEXT,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create voice_intents table
CREATE TABLE IF NOT EXISTS public.voice_intents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    transcript TEXT NOT NULL,
    intent TEXT,
    entities JSONB,
    confidence NUMERIC,
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create order_details table (if needed)
CREATE TABLE IF NOT EXISTS public.order_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID,
    product_id UUID,
    quantity INTEGER,
    unit_price NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create product_catalog table (if needed)
CREATE TABLE IF NOT EXISTS public.product_catalog (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT,
    subcategory TEXT,
    price_range_min NUMERIC,
    price_range_max NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_shop_size ON public.user_profiles(shop_size);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products(brand);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_inventory_user_id ON public.inventory(user_id);
CREATE INDEX IF NOT EXISTS idx_inventory_product_id ON public.inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_user_product ON public.inventory(user_id, product_id);
CREATE INDEX IF NOT EXISTS idx_suggested_orders_user_id ON public.suggested_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_suggested_orders_product_id ON public.suggested_orders(product_id);
CREATE INDEX IF NOT EXISTS idx_suggested_orders_status ON public.suggested_orders(status);
CREATE INDEX IF NOT EXISTS idx_suggested_orders_user_product_status ON public.suggested_orders(user_id, product_id, status);
CREATE INDEX IF NOT EXISTS idx_agent_logs_created_at ON public.agent_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_agent_logs_event_type ON public.agent_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_agent_logs_agent_name ON public.agent_logs(agent_name);
CREATE INDEX IF NOT EXISTS idx_loyalty_points_user_id ON public.loyalty_points(user_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_points_tier ON public.loyalty_points(tier);

-- Create unique constraints
CREATE UNIQUE INDEX IF NOT EXISTS loyalty_points_user_id_key ON public.loyalty_points(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS user_profiles_email_key ON public.user_profiles(email);
CREATE UNIQUE INDEX IF NOT EXISTS idx_suggested_orders_unique_user_product_active ON public.suggested_orders(user_id, product_id) WHERE status = 'suggested';

-- Trigger functions
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS handle_updated_at_user_profiles ON public.user_profiles;
CREATE TRIGGER handle_updated_at_user_profiles
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at_products ON public.products;
CREATE TRIGGER handle_updated_at_products
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at_orders ON public.orders;
CREATE TRIGGER handle_updated_at_orders
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at_loyalty_points ON public.loyalty_points;
CREATE TRIGGER handle_updated_at_loyalty_points
    BEFORE UPDATE ON public.loyalty_points
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Helper functions for RLS policies
CREATE OR REPLACE FUNCTION public.can_view_agent_logs(payload_data JSONB)
RETURNS BOOLEAN AS $$
BEGIN
    -- Allow users to view logs related to their actions
    RETURN (
        auth.uid()::text = (payload_data->>'user_id') OR
        auth.uid()::text = (payload_data->>'target_user_id') OR
        EXISTS (
            SELECT 1 FROM public.user_profiles up
            WHERE up.id = auth.uid() AND up.role = 'admin'
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, name)
    VALUES (
        NEW.id,
        COALESCE(NEW.email, ''),
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email, 'User')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suggested_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "users_manage_own_user_profiles" ON public.user_profiles;
CREATE POLICY "users_manage_own_user_profiles" ON public.user_profiles
    FOR ALL USING (id = auth.uid()) WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "users_manage_own_orders" ON public.orders;
CREATE POLICY "users_manage_own_orders" ON public.orders
    FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "users_manage_own_inventory" ON public.inventory;
CREATE POLICY "users_manage_own_inventory" ON public.inventory
    FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "users_manage_own_suggested_orders" ON public.suggested_orders;
CREATE POLICY "users_manage_own_suggested_orders" ON public.suggested_orders
    FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "users_can_view_relevant_agent_logs" ON public.agent_logs;
CREATE POLICY "users_can_view_relevant_agent_logs" ON public.agent_logs
    FOR SELECT USING (can_view_agent_logs(payload));

DROP POLICY IF EXISTS "users_manage_own_loyalty_points" ON public.loyalty_points;
CREATE POLICY "users_manage_own_loyalty_points" ON public.loyalty_points
    FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "public_can_read_products" ON public.products;
CREATE POLICY "public_can_read_products" ON public.products
    FOR SELECT TO PUBLIC USING (true);

DROP POLICY IF EXISTS "admins_manage_products" ON public.products;
CREATE POLICY "admins_manage_products" ON public.products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users au
            JOIN public.user_profiles up ON up.id = au.id
            WHERE au.id = auth.uid() AND up.role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users au
            JOIN public.user_profiles up ON up.id = au.id
            WHERE au.id = auth.uid() AND up.role = 'admin'
        )
    );

-- Set up auth trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

COMMENT ON SCHEMA public IS 'Buildzone application schema with user management, orders, inventory, and AI agent features';