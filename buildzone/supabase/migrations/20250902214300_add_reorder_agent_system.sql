-- Location: supabase/migrations/20250902214300_add_reorder_agent_system.sql
-- Schema Analysis: Building upon existing orders, products, user_profiles tables
-- Integration Type: Addition - Adding reorder agent functionality
-- Dependencies: orders, products, user_profiles (existing)

-- 1. Create reorder agent specific tables
CREATE TABLE public.inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    qty INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.suggested_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    suggested_qty INTEGER NOT NULL,
    reason TEXT NOT NULL,
    safety_factor NUMERIC NOT NULL,
    lead_time_days INTEGER NOT NULL,
    status TEXT DEFAULT 'suggested' CHECK (status IN ('suggested', 'confirmed', 'dismissed')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.agent_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_name TEXT NOT NULL,
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create order_items view to expand orders.items JSON into rows
CREATE OR REPLACE VIEW public.order_items AS
SELECT
    o.id as order_id,
    o.user_id,
    (item->>'productId')::UUID as product_id,
    (item->>'qty')::INTEGER as qty,
    o.created_at
FROM public.orders o, jsonb_array_elements(o.items) as item;

-- 3. Create indexes for performance
CREATE INDEX idx_inventory_user_id ON public.inventory(user_id);
CREATE INDEX idx_inventory_product_id ON public.inventory(product_id);
CREATE INDEX idx_inventory_user_product ON public.inventory(user_id, product_id);

CREATE INDEX idx_suggested_orders_user_id ON public.suggested_orders(user_id);
CREATE INDEX idx_suggested_orders_product_id ON public.suggested_orders(product_id);
CREATE INDEX idx_suggested_orders_status ON public.suggested_orders(status);
CREATE INDEX idx_suggested_orders_user_product_status ON public.suggested_orders(user_id, product_id, status);

CREATE INDEX idx_agent_logs_agent_name ON public.agent_logs(agent_name);
CREATE INDEX idx_agent_logs_event_type ON public.agent_logs(event_type);
CREATE INDEX idx_agent_logs_created_at ON public.agent_logs(created_at);

-- 4. Enable RLS
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suggested_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_logs ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies using Pattern 2 (Simple User Ownership)
CREATE POLICY "users_manage_own_inventory"
ON public.inventory
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_manage_own_suggested_orders"
ON public.suggested_orders
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Admin can view all agent logs, users can view their own related logs
CREATE OR REPLACE FUNCTION public.can_view_agent_logs(log_payload JSONB)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT 
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() AND up.role = 'admin'
    )
    OR 
    (log_payload->>'user_id')::UUID = auth.uid()
$$;

CREATE POLICY "users_can_view_relevant_agent_logs"
ON public.agent_logs
FOR SELECT
TO authenticated
USING (public.can_view_agent_logs(payload));

-- 6. Create Reorder Agent function
CREATE OR REPLACE FUNCTION public.run_reorder_agent(target_user_id UUID DEFAULT NULL)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $func$
DECLARE
    LOOKBACK_DAYS INTEGER := 30;
    DEFAULT_LEAD_TIME INTEGER := 7;
    SAFETY_FACTOR NUMERIC := 1.2;
    REORDER_BUFFER INTEGER := 2;
    
    user_record RECORD;
    product_record RECORD;
    total_sold INTEGER;
    avg_daily NUMERIC;
    current_stock INTEGER;
    projected_need NUMERIC;
    suggested_qty INTEGER;
    reason_text TEXT;
    processed_users INTEGER := 0;
    processed_products INTEGER := 0;
    suggestions_created INTEGER := 0;
BEGIN
    -- Log agent start
    INSERT INTO public.agent_logs (agent_name, event_type, payload)
    VALUES (
        'reorder_agent',
        'agent_start',
        jsonb_build_object(
            'started_at', now(),
            'target_user_id', target_user_id,
            'parameters', jsonb_build_object(
                'lookback_days', LOOKBACK_DAYS,
                'default_lead_time', DEFAULT_LEAD_TIME,
                'safety_factor', SAFETY_FACTOR,
                'reorder_buffer', REORDER_BUFFER
            )
        )
    );

    -- Loop through users (either specific user or all users with inventory)
    FOR user_record IN 
        SELECT DISTINCT up.id, up.name, up.shop_name
        FROM public.user_profiles up
        WHERE (target_user_id IS NULL OR up.id = target_user_id)
        AND EXISTS (
            SELECT 1 FROM public.inventory i 
            WHERE i.user_id = up.id
        )
    LOOP
        processed_users := processed_users + 1;
        
        -- For each product in user's inventory
        FOR product_record IN
            SELECT i.product_id, i.qty as current_stock, p.name as product_name
            FROM public.inventory i
            JOIN public.products p ON i.product_id = p.id
            WHERE i.user_id = user_record.id
        LOOP
            processed_products := processed_products + 1;
            current_stock := product_record.current_stock;
            
            -- Calculate total sold in last LOOKBACK_DAYS
            SELECT COALESCE(SUM(oi.qty), 0) INTO total_sold
            FROM public.order_items oi
            WHERE oi.user_id = user_record.id 
            AND oi.product_id = product_record.product_id
            AND oi.created_at >= (now() - (LOOKBACK_DAYS || ' days')::INTERVAL);
            
            -- Calculate average daily sales
            avg_daily := CASE 
                WHEN total_sold > 0 THEN total_sold::NUMERIC / LOOKBACK_DAYS 
                ELSE 0 
            END;
            
            -- Calculate projected need
            projected_need := CEIL(avg_daily * DEFAULT_LEAD_TIME * SAFETY_FACTOR);
            
            -- Check if reorder is needed
            IF projected_need > 0 AND current_stock <= projected_need THEN
                suggested_qty := GREATEST(CEIL(projected_need - current_stock + REORDER_BUFFER), 1);
                
                reason_text := format(
                    'Avg daily sales = %s. Lead time = %s days. Safety factor = %s. Projected need = %s. Current stock = %s. Suggested qty = %s.',
                    avg_daily::TEXT,
                    DEFAULT_LEAD_TIME::TEXT,
                    SAFETY_FACTOR::TEXT,
                    projected_need::TEXT,
                    current_stock::TEXT,
                    suggested_qty::TEXT
                );
                
                -- Upsert suggested order
                INSERT INTO public.suggested_orders (
                    user_id, 
                    product_id, 
                    suggested_qty, 
                    reason, 
                    safety_factor, 
                    lead_time_days,
                    status,
                    updated_at
                )
                VALUES (
                    user_record.id,
                    product_record.product_id,
                    suggested_qty,
                    reason_text,
                    SAFETY_FACTOR,
                    DEFAULT_LEAD_TIME,
                    'suggested',
                    now()
                )
                ON CONFLICT (user_id, product_id) 
                WHERE status = 'suggested'
                DO UPDATE SET
                    suggested_qty = EXCLUDED.suggested_qty,
                    reason = EXCLUDED.reason,
                    safety_factor = EXCLUDED.safety_factor,
                    lead_time_days = EXCLUDED.lead_time_days,
                    updated_at = now();
                
                suggestions_created := suggestions_created + 1;
                
                -- Log suggestion creation
                INSERT INTO public.agent_logs (agent_name, event_type, payload)
                VALUES (
                    'reorder_agent',
                    'suggestion_created',
                    jsonb_build_object(
                        'user_id', user_record.id,
                        'product_id', product_record.product_id,
                        'product_name', product_record.product_name,
                        'avg_daily', avg_daily,
                        'current_stock', current_stock,
                        'projected_need', projected_need,
                        'suggested_qty', suggested_qty
                    )
                );
            END IF;
        END LOOP;
    END LOOP;

    -- Log agent completion
    INSERT INTO public.agent_logs (agent_name, event_type, payload)
    VALUES (
        'reorder_agent',
        'agent_complete',
        jsonb_build_object(
            'completed_at', now(),
            'processed_users', processed_users,
            'processed_products', processed_products,
            'suggestions_created', suggestions_created
        )
    );

    RETURN jsonb_build_object(
        'success', true,
        'processed_users', processed_users,
        'processed_products', processed_products,
        'suggestions_created', suggestions_created
    );

EXCEPTION
    WHEN OTHERS THEN
        -- Log error
        INSERT INTO public.agent_logs (agent_name, event_type, payload)
        VALUES (
            'reorder_agent',
            'agent_error',
            jsonb_build_object(
                'error_at', now(),
                'error_message', SQLERRM,
                'error_detail', SQLSTATE
            )
        );
        
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM
        );
END;
$func$;

-- 7. Create function to confirm suggested order
CREATE OR REPLACE FUNCTION public.confirm_suggested_order(suggestion_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $func$
DECLARE
    suggestion_record RECORD;
    new_order_id UUID;
    product_record RECORD;
BEGIN
    -- Get suggestion details
    SELECT so.*, p.name as product_name, p.price
    INTO suggestion_record
    FROM public.suggested_orders so
    JOIN public.products p ON so.product_id = p.id
    WHERE so.id = suggestion_id 
    AND so.user_id = auth.uid()
    AND so.status = 'suggested';
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Suggestion not found or not accessible'
        );
    END IF;
    
    -- Create new order
    new_order_id := gen_random_uuid();
    INSERT INTO public.orders (
        id,
        user_id,
        items,
        total_amount,
        status
    )
    VALUES (
        new_order_id,
        suggestion_record.user_id,
        jsonb_build_array(
            jsonb_build_object(
                'productId', suggestion_record.product_id,
                'qty', suggestion_record.suggested_qty,
                'name', suggestion_record.product_name,
                'price', suggestion_record.price
            )
        ),
        suggestion_record.suggested_qty * suggestion_record.price,
        'Pending'
    );
    
    -- Update suggestion status
    UPDATE public.suggested_orders 
    SET status = 'confirmed', updated_at = now()
    WHERE id = suggestion_id;
    
    -- Log confirmation
    INSERT INTO public.agent_logs (agent_name, event_type, payload)
    VALUES (
        'reorder_agent',
        'suggestion_confirmed',
        jsonb_build_object(
            'user_id', suggestion_record.user_id,
            'suggestion_id', suggestion_id,
            'order_id', new_order_id,
            'product_id', suggestion_record.product_id,
            'qty', suggestion_record.suggested_qty
        )
    );
    
    RETURN jsonb_build_object(
        'success', true,
        'order_id', new_order_id
    );
END;
$func$;

-- 8. Create function to dismiss suggested order
CREATE OR REPLACE FUNCTION public.dismiss_suggested_order(suggestion_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $func$
DECLARE
    suggestion_record RECORD;
BEGIN
    -- Get suggestion details
    SELECT * INTO suggestion_record
    FROM public.suggested_orders
    WHERE id = suggestion_id 
    AND user_id = auth.uid()
    AND status = 'suggested';
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Suggestion not found or not accessible'
        );
    END IF;
    
    -- Update suggestion status
    UPDATE public.suggested_orders 
    SET status = 'dismissed', updated_at = now()
    WHERE id = suggestion_id;
    
    -- Log dismissal
    INSERT INTO public.agent_logs (agent_name, event_type, payload)
    VALUES (
        'reorder_agent',
        'suggestion_dismissed',
        jsonb_build_object(
            'user_id', suggestion_record.user_id,
            'suggestion_id', suggestion_id,
            'product_id', suggestion_record.product_id
        )
    );
    
    RETURN jsonb_build_object('success', true);
END;
$func$;

-- 9. Add unique constraint to prevent duplicate suggestions
CREATE UNIQUE INDEX idx_suggested_orders_unique_user_product_active 
ON public.suggested_orders (user_id, product_id) 
WHERE status = 'suggested';

-- 10. Mock data for demo
DO $$
DECLARE
    sharma_user_id UUID;
    gupta_user_id UUID;
    product1_id UUID;
    product2_id UUID;
    product3_id UUID;
BEGIN
    -- Get existing demo user IDs
    SELECT id INTO sharma_user_id FROM public.user_profiles WHERE email = 'sharma@demo.com';
    SELECT id INTO gupta_user_id FROM public.user_profiles WHERE email = 'gupta@demo.com';
    
    -- Get some product IDs
    SELECT id INTO product1_id FROM public.products LIMIT 1;
    SELECT id INTO product2_id FROM public.products OFFSET 1 LIMIT 1;
    SELECT id INTO product3_id FROM public.products OFFSET 2 LIMIT 1;
    
    IF sharma_user_id IS NOT NULL AND product1_id IS NOT NULL THEN
        -- Create inventory for demo users
        INSERT INTO public.inventory (user_id, product_id, qty) VALUES
            (sharma_user_id, product1_id, 5),
            (sharma_user_id, product2_id, 2),
            (gupta_user_id, product1_id, 15),
            (gupta_user_id, product3_id, 8)
        ON CONFLICT (user_id, product_id) DO NOTHING;
        
        -- Create some historical orders to trigger reorder suggestions
        INSERT INTO public.orders (user_id, items, total_amount, status, created_at) VALUES
            (sharma_user_id, 
             jsonb_build_array(
                 jsonb_build_object('productId', product1_id, 'qty', 10, 'name', 'Product 1', 'price', 100)
             ), 
             1000, 'Delivered', now() - interval '15 days'),
            (sharma_user_id, 
             jsonb_build_array(
                 jsonb_build_object('productId', product1_id, 'qty', 8, 'name', 'Product 1', 'price', 100)
             ), 
             800, 'Delivered', now() - interval '25 days'),
            (gupta_user_id, 
             jsonb_build_array(
                 jsonb_build_object('productId', product1_id, 'qty', 20, 'name', 'Product 1', 'price', 100)
             ), 
             2000, 'Delivered', now() - interval '10 days')
        ON CONFLICT DO NOTHING;
    END IF;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Mock data insertion failed: %', SQLERRM;
END $$;