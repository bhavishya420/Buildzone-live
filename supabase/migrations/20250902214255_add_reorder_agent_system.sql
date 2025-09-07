-- Location: supabase/migrations/20250902214255_add_reorder_agent_system.sql
-- Schema Analysis: Existing schema has orders, products, user_profiles tables
-- Integration Type: Addition - building new reorder agent system
-- Dependencies: orders, products, user_profiles tables (existing)

-- 1. Create inventory table for tracking user stock levels
CREATE TABLE public.inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    qty INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create suggested_orders table for reorder agent recommendations
CREATE TABLE public.suggested_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    suggested_qty INTEGER NOT NULL,
    reason TEXT NOT NULL,
    safety_factor NUMERIC DEFAULT 1.2,
    lead_time_days INTEGER DEFAULT 7,
    status TEXT DEFAULT 'suggested' CHECK (status IN ('suggested', 'confirmed', 'dismissed')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create agent_logs table for observability
CREATE TABLE public.agent_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_name TEXT NOT NULL,
    event_type TEXT NOT NULL,
    payload JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create order_items view to expand orders.items JSON into rows
CREATE OR REPLACE VIEW public.order_items AS
SELECT
    o.id AS order_id,
    o.user_id,
    (item->>'productId')::UUID AS product_id,
    (item->>'qty')::INTEGER AS qty,
    o.created_at
FROM public.orders o,
jsonb_array_elements(o.items) AS item;

-- 5. Create indexes for performance
CREATE INDEX idx_inventory_user_id ON public.inventory(user_id);
CREATE INDEX idx_inventory_product_id ON public.inventory(product_id);
CREATE UNIQUE INDEX idx_inventory_user_product ON public.inventory(user_id, product_id);

CREATE INDEX idx_suggested_orders_user_id ON public.suggested_orders(user_id);
CREATE INDEX idx_suggested_orders_product_id ON public.suggested_orders(product_id);
CREATE INDEX idx_suggested_orders_status ON public.suggested_orders(status);
CREATE INDEX idx_suggested_orders_created_at ON public.suggested_orders(created_at);

CREATE INDEX idx_agent_logs_agent_name ON public.agent_logs(agent_name);
CREATE INDEX idx_agent_logs_event_type ON public.agent_logs(event_type);
CREATE INDEX idx_agent_logs_created_at ON public.agent_logs(created_at);

-- 6. Enable RLS
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suggested_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_logs ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS policies
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

-- Admin can view all agent logs, users can view their own
CREATE OR REPLACE FUNCTION public.has_role_from_auth(required_role TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM auth.users au
    WHERE au.id = auth.uid() 
    AND au.raw_user_meta_data->>'role' = required_role
)
$$;

CREATE POLICY "admin_view_all_agent_logs"
ON public.agent_logs
FOR SELECT
TO authenticated
USING (public.has_role_from_auth('admin'));

CREATE POLICY "users_view_own_agent_logs"
ON public.agent_logs
FOR SELECT
TO authenticated
USING (payload->>'user_id' = auth.uid()::TEXT);

-- 8. Create reorder agent function
CREATE OR REPLACE FUNCTION public.run_reorder_agent(
    target_user_id UUID DEFAULT NULL,
    lookback_days INTEGER DEFAULT 30,
    default_lead_time INTEGER DEFAULT 7,
    safety_factor NUMERIC DEFAULT 1.2,
    reorder_buffer INTEGER DEFAULT 2
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $func$
DECLARE
    user_record RECORD;
    inventory_record RECORD;
    total_sold INTEGER;
    avg_daily NUMERIC;
    projected_need INTEGER;
    suggested_qty INTEGER;
    suggestions_created INTEGER := 0;
    users_processed INTEGER := 0;
    result JSONB;
BEGIN
    -- Get users to process (specific user or all users)
    FOR user_record IN
        SELECT id FROM public.user_profiles 
        WHERE (target_user_id IS NULL OR id = target_user_id)
        AND role = 'customer'
    LOOP
        users_processed := users_processed + 1;
        
        -- Process each product in user's inventory or recently ordered products
        FOR inventory_record IN
            SELECT DISTINCT 
                COALESCE(i.user_id, oi.user_id) AS user_id,
                COALESCE(i.product_id, oi.product_id) AS product_id,
                COALESCE(i.qty, 0) AS current_stock
            FROM public.inventory i
            FULL OUTER JOIN (
                SELECT DISTINCT user_id, product_id 
                FROM public.order_items 
                WHERE user_id = user_record.id
                AND created_at >= CURRENT_TIMESTAMP - INTERVAL '%s days' % lookback_days
            ) oi ON i.user_id = oi.user_id AND i.product_id = oi.product_id
            WHERE COALESCE(i.user_id, oi.user_id) = user_record.id
        LOOP
            -- Calculate total sold in lookback period
            SELECT COALESCE(SUM(qty), 0) INTO total_sold
            FROM public.order_items
            WHERE user_id = inventory_record.user_id
            AND product_id = inventory_record.product_id
            AND created_at >= CURRENT_TIMESTAMP - INTERVAL '%s days' % lookback_days;
            
            -- Skip if no sales
            IF total_sold <= 0 THEN
                CONTINUE;
            END IF;
            
            -- Calculate metrics
            avg_daily := total_sold::NUMERIC / lookback_days;
            projected_need := CEIL(avg_daily * default_lead_time * safety_factor);
            
            -- Check if reorder is needed
            IF inventory_record.current_stock <= projected_need THEN
                suggested_qty := GREATEST(
                    CEIL(projected_need - inventory_record.current_stock + reorder_buffer), 
                    1
                );
                
                -- Upsert suggested order
                INSERT INTO public.suggested_orders (
                    user_id, product_id, suggested_qty, reason, 
                    safety_factor, lead_time_days, status
                )
                VALUES (
                    inventory_record.user_id,
                    inventory_record.product_id,
                    suggested_qty,
                    format('Avg daily sales = %s. Lead time = %s days. Safety factor = %s. Projected need = %s. Current stock = %s. Suggested qty = %s.',
                        avg_daily, default_lead_time, safety_factor, projected_need, inventory_record.current_stock, suggested_qty),
                    safety_factor,
                    default_lead_time,
                    'suggested'
                )
                ON CONFLICT (user_id, product_id) 
                WHERE status = 'suggested'
                DO UPDATE SET
                    suggested_qty = EXCLUDED.suggested_qty,
                    reason = EXCLUDED.reason,
                    updated_at = CURRENT_TIMESTAMP;
                
                -- Log the suggestion
                INSERT INTO public.agent_logs (agent_name, event_type, payload)
                VALUES (
                    'Reorder Agent',
                    'suggestion_created',
                    jsonb_build_object(
                        'user_id', inventory_record.user_id,
                        'product_id', inventory_record.product_id,
                        'avg_daily', avg_daily,
                        'current_stock', inventory_record.current_stock,
                        'projected_need', projected_need,
                        'suggested_qty', suggested_qty
                    )
                );
                
                suggestions_created := suggestions_created + 1;
            END IF;
        END LOOP;
    END LOOP;
    
    -- Log agent execution
    INSERT INTO public.agent_logs (agent_name, event_type, payload)
    VALUES (
        'Reorder Agent',
        'execution_completed',
        jsonb_build_object(
            'users_processed', users_processed,
            'suggestions_created', suggestions_created,
            'parameters', jsonb_build_object(
                'lookback_days', lookback_days,
                'default_lead_time', default_lead_time,
                'safety_factor', safety_factor,
                'reorder_buffer', reorder_buffer
            )
        )
    );
    
    result := jsonb_build_object(
        'success', true,
        'users_processed', users_processed,
        'suggestions_created', suggestions_created
    );
    
    RETURN result;
    
EXCEPTION
    WHEN OTHERS THEN
        -- Log error
        INSERT INTO public.agent_logs (agent_name, event_type, payload)
        VALUES (
            'Reorder Agent',
            'execution_error',
            jsonb_build_object(
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

-- 9. Create function to confirm suggested order
CREATE OR REPLACE FUNCTION public.confirm_suggested_order(suggestion_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $func$
DECLARE
    suggestion_record RECORD;
    new_order_id UUID;
    result JSONB;
BEGIN
    -- Get suggestion details
    SELECT * INTO suggestion_record
    FROM public.suggested_orders
    WHERE id = suggestion_id 
    AND user_id = auth.uid()
    AND status = 'suggested';
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Suggestion not found or not accessible');
    END IF;
    
    -- Create new order
    INSERT INTO public.orders (user_id, items, total_amount, status)
    SELECT 
        suggestion_record.user_id,
        jsonb_build_array(
            jsonb_build_object(
                'productId', suggestion_record.product_id,
                'qty', suggestion_record.suggested_qty,
                'name', p.name,
                'price', p.price
            )
        ),
        p.price * suggestion_record.suggested_qty,
        'Pending'::order_status
    FROM public.products p
    WHERE p.id = suggestion_record.product_id
    RETURNING id INTO new_order_id;
    
    -- Update suggestion status
    UPDATE public.suggested_orders
    SET status = 'confirmed', updated_at = CURRENT_TIMESTAMP
    WHERE id = suggestion_id;
    
    -- Log the confirmation
    INSERT INTO public.agent_logs (agent_name, event_type, payload)
    VALUES (
        'Reorder Agent',
        'suggestion_confirmed',
        jsonb_build_object(
            'suggestion_id', suggestion_id,
            'order_id', new_order_id,
            'user_id', suggestion_record.user_id,
            'product_id', suggestion_record.product_id,
            'qty', suggestion_record.suggested_qty
        )
    );
    
    RETURN jsonb_build_object(
        'success', true,
        'order_id', new_order_id,
        'message', 'Order created successfully'
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM
        );
END;
$func$;

-- 10. Create function to dismiss suggested order
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
        RETURN jsonb_build_object('success', false, 'error', 'Suggestion not found or not accessible');
    END IF;
    
    -- Update suggestion status
    UPDATE public.suggested_orders
    SET status = 'dismissed', updated_at = CURRENT_TIMESTAMP
    WHERE id = suggestion_id;
    
    -- Log the dismissal
    INSERT INTO public.agent_logs (agent_name, event_type, payload)
    VALUES (
        'Reorder Agent',
        'suggestion_dismissed',
        jsonb_build_object(
            'suggestion_id', suggestion_id,
            'user_id', suggestion_record.user_id,
            'product_id', suggestion_record.product_id
        )
    );
    
    RETURN jsonb_build_object(
        'success', true,
        'message', 'Suggestion dismissed successfully'
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM
        );
END;
$func$;

-- 11. Add triggers for updated_at
CREATE TRIGGER handle_updated_at_inventory
    BEFORE UPDATE ON public.inventory
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_suggested_orders
    BEFORE UPDATE ON public.suggested_orders
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 12. Insert demo data for existing users
DO $$
DECLARE
    sharma_id UUID;
    gupta_id UUID;
    demo_product_ids UUID[];
BEGIN
    -- Get existing demo users
    SELECT id INTO sharma_id FROM public.user_profiles WHERE email = 'sharma@demo.com';
    SELECT id INTO gupta_id FROM public.user_profiles WHERE email = 'gupta@demo.com';
    
    -- Get some product IDs for demo
    SELECT ARRAY_AGG(id) INTO demo_product_ids 
    FROM public.products 
    LIMIT 5;
    
    -- Add inventory for demo users if they exist
    IF sharma_id IS NOT NULL AND demo_product_ids IS NOT NULL THEN
        INSERT INTO public.inventory (user_id, product_id, qty) 
        SELECT sharma_id, unnest(demo_product_ids[1:3]), generate_series(5, 15, 5);
        
        INSERT INTO public.inventory (user_id, product_id, qty)
        SELECT gupta_id, unnest(demo_product_ids[2:4]), generate_series(10, 20, 5);
    END IF;
    
    -- Add initial agent log
    INSERT INTO public.agent_logs (agent_name, event_type, payload)
    VALUES (
        'System',
        'initialization',
        jsonb_build_object(
            'message', 'Reorder agent system initialized',
            'timestamp', CURRENT_TIMESTAMP
        )
    );
    
EXCEPTION
    WHEN OTHERS THEN
        -- Log any initialization errors
        INSERT INTO public.agent_logs (agent_name, event_type, payload)
        VALUES (
            'System',
            'initialization_error',
            jsonb_build_object(
                'error', SQLERRM,
                'timestamp', CURRENT_TIMESTAMP
            )
        );
END $$;