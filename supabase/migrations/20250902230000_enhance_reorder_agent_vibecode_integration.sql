-- Location: supabase/migrations/20250902230000_enhance_reorder_agent_vibecode_integration.sql
-- Schema Analysis: orders table exists with order_status enum, agent_logs table exists, suggested_orders table exists
-- Integration Type: enhancement - adding 'Draft' status to order_status enum and updating reorder agent function
-- Dependencies: orders, suggested_orders, agent_logs, user_profiles, products tables

-- 1. Add 'Draft' to existing order_status enum if not already present
DO $$
BEGIN
    -- Check if 'Draft' value already exists in the enum
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'Draft' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'order_status')
    ) THEN
        -- Add 'Draft' to the order_status enum
        ALTER TYPE public.order_status ADD VALUE 'Draft';
    END IF;
END $$;

-- 2. Create enhanced reorder agent function that creates draft orders and triggers vibecode
CREATE OR REPLACE FUNCTION public.run_reorder_agent_enhanced(target_user_id UUID DEFAULT NULL)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    users_processed INTEGER := 0;
    suggestions_created INTEGER := 0;
    draft_orders_created INTEGER := 0;
    user_record RECORD;
    inventory_record RECORD;
    product_record RECORD;
    suggested_qty INTEGER;
    avg_daily_sales NUMERIC;
    projected_need NUMERIC;
    current_stock INTEGER;
    suggestion_id UUID;
    new_order_id UUID;
    existing_suggestion_id UUID;
BEGIN
    -- Log execution start
    INSERT INTO public.agent_logs (agent_name, event_type, payload)
    VALUES ('reorder_agent', 'execution_started', jsonb_build_object(
        'target_user_id', target_user_id,
        'started_at', now()
    ));

    -- Loop through users (filtered by target_user_id if provided)
    FOR user_record IN 
        SELECT up.id, up.name, up.shop_name
        FROM public.user_profiles up
        WHERE (target_user_id IS NULL OR up.id = target_user_id)
        AND up.id IS NOT NULL
    LOOP
        users_processed := users_processed + 1;

        -- Loop through user's inventory items
        FOR inventory_record IN
            SELECT i.*, p.name as product_name, p.price
            FROM public.inventory i
            JOIN public.products p ON i.product_id = p.id
            WHERE i.user_id = user_record.id
            AND i.qty IS NOT NULL
        LOOP
            current_stock := COALESCE(inventory_record.qty, 0);
            
            -- Simple reorder logic (in production, this would be more sophisticated)
            avg_daily_sales := 2.5; -- Mock average daily sales
            projected_need := avg_daily_sales * 14; -- 2 weeks projection
            
            -- Determine if reorder is needed
            IF current_stock < projected_need THEN
                suggested_qty := CEIL(projected_need * 1.2)::INTEGER; -- 20% safety buffer

                -- Check if suggestion already exists for this user-product combination
                SELECT id INTO existing_suggestion_id
                FROM public.suggested_orders
                WHERE user_id = user_record.id 
                AND product_id = inventory_record.product_id
                AND status = 'suggested';

                -- Only create suggestion if one doesn't already exist
                IF existing_suggestion_id IS NULL THEN
                    -- Create suggested order
                    INSERT INTO public.suggested_orders (
                        user_id, product_id, suggested_qty, reason, 
                        lead_time_days, safety_factor, status
                    ) VALUES (
                        user_record.id, inventory_record.product_id, suggested_qty,
                        'Low stock detected by Reorder Agent - Auto-reorder suggested',
                        7, 1.2, 'suggested'
                    ) RETURNING id INTO suggestion_id;

                    suggestions_created := suggestions_created + 1;

                    -- Create draft order immediately
                    INSERT INTO public.orders (
                        user_id, items, status, total_amount,
                        created_at, updated_at
                    ) VALUES (
                        user_record.id,
                        jsonb_build_array(
                            jsonb_build_object(
                                'productId', inventory_record.product_id,
                                'qty', suggested_qty,
                                'name', inventory_record.product_name,
                                'price', inventory_record.price
                            )
                        ),
                        'Draft',
                        suggested_qty * COALESCE(inventory_record.price, 0),
                        now(),
                        now()
                    ) RETURNING id INTO new_order_id;

                    draft_orders_created := draft_orders_created + 1;

                    -- Log draft order creation
                    INSERT INTO public.agent_logs (agent_name, event_type, payload)
                    VALUES ('reorder_agent', 'draft_order_created', jsonb_build_object(
                        'user_id', user_record.id,
                        'product_id', inventory_record.product_id,
                        'suggested_qty', suggested_qty,
                        'order_id', new_order_id,
                        'suggestion_id', suggestion_id,
                        'current_stock', current_stock,
                        'projected_need', projected_need
                    ));
                END IF;
            END IF;
        END LOOP;
    END LOOP;

    -- Log execution completion
    INSERT INTO public.agent_logs (agent_name, event_type, payload)
    VALUES ('reorder_agent', 'execution_completed', jsonb_build_object(
        'users_processed', users_processed,
        'suggestions_created', suggestions_created,
        'draft_orders_created', draft_orders_created,
        'completed_at', now()
    ));

    RETURN jsonb_build_object(
        'success', true,
        'users_processed', users_processed,
        'suggestions_created', suggestions_created,
        'draft_orders_created', draft_orders_created,
        'message', 'Reorder agent executed successfully with draft orders'
    );

EXCEPTION
    WHEN OTHERS THEN
        -- Log error
        INSERT INTO public.agent_logs (agent_name, event_type, payload)
        VALUES ('reorder_agent', 'execution_error', jsonb_build_object(
            'error_message', SQLERRM,
            'error_detail', SQLSTATE,
            'failed_at', now()
        ));

        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'message', 'Reorder agent execution failed'
        );
END;
$$;

-- 3. Create function to confirm draft order
CREATE OR REPLACE FUNCTION public.confirm_draft_order(order_id UUID, suggestion_id UUID DEFAULT NULL)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    order_record RECORD;
    suggestion_record RECORD;
BEGIN
    -- Get order details
    SELECT o.*, up.name as user_name
    INTO order_record
    FROM public.orders o
    JOIN public.user_profiles up ON o.user_id = up.id
    WHERE o.id = order_id AND o.status = 'Draft';

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Draft order not found or already confirmed'
        );
    END IF;

    -- Update order status to Pending
    UPDATE public.orders
    SET status = 'Pending', updated_at = now()
    WHERE id = order_id;

    -- If suggestion_id is provided, update suggested_orders status
    IF suggestion_id IS NOT NULL THEN
        UPDATE public.suggested_orders
        SET status = 'confirmed', updated_at = now()
        WHERE id = suggestion_id;
    END IF;

    -- Log the confirmation
    INSERT INTO public.agent_logs (agent_name, event_type, payload)
    VALUES ('reorder_agent', 'draft_order_confirmed', jsonb_build_object(
        'order_id', order_id,
        'suggestion_id', suggestion_id,
        'user_id', order_record.user_id,
        'total_amount', order_record.total_amount,
        'confirmed_at', now()
    ));

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Draft order confirmed successfully',
        'order_id', order_id
    );

EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM
        );
END;
$$;

-- 4. Update existing run_reorder_agent function to use the enhanced version
DROP FUNCTION IF EXISTS public.run_reorder_agent(UUID);
CREATE OR REPLACE FUNCTION public.run_reorder_agent(target_user_id UUID DEFAULT NULL)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN public.run_reorder_agent_enhanced(target_user_id);
END;
$$;

-- 5. Create some sample draft orders for demo purposes
DO $$
DECLARE
    sharma_user_id UUID;
    cement_product_id UUID;
    steel_product_id UUID;
    suggestion_id1 UUID;
    suggestion_id2 UUID;
BEGIN
    -- Get Sharma's user ID (assuming exists from previous migrations)
    SELECT id INTO sharma_user_id
    FROM public.user_profiles
    WHERE name ILIKE '%sharma%' OR shop_name ILIKE '%sharma%'
    LIMIT 1;

    -- Get some product IDs
    SELECT id INTO cement_product_id
    FROM public.products
    WHERE name ILIKE '%cement%'
    LIMIT 1;

    SELECT id INTO steel_product_id
    FROM public.products
    WHERE name ILIKE '%steel%' OR name ILIKE '%rod%'
    LIMIT 1;

    -- Only create demo data if we found the required records
    IF sharma_user_id IS NOT NULL AND cement_product_id IS NOT NULL THEN
        -- Create suggested order
        INSERT INTO public.suggested_orders (
            user_id, product_id, suggested_qty, reason,
            lead_time_days, safety_factor, status
        ) VALUES (
            sharma_user_id, cement_product_id, 50,
            'Demo: Low stock detected - Auto-reorder suggested',
            7, 1.2, 'suggested'
        ) RETURNING id INTO suggestion_id1;

        -- Create corresponding draft order
        INSERT INTO public.orders (
            user_id, items, status, total_amount,
            contact_number, delivery_address
        ) VALUES (
            sharma_user_id,
            jsonb_build_array(
                jsonb_build_object(
                    'productId', cement_product_id,
                    'qty', 50,
                    'name', 'Cement Bags',
                    'price', 450
                )
            ),
            'Draft',
            22500,
            '+91-9876543210',
            'Shop No. 15, Hardware Market, Delhi'
        );

        -- Log the demo draft order creation
        INSERT INTO public.agent_logs (agent_name, event_type, payload)
        VALUES ('reorder_agent', 'draft_order_created', jsonb_build_object(
            'user_id', sharma_user_id,
            'product_id', cement_product_id,
            'suggested_qty', 50,
            'demo_data', true,
            'created_at', now()
        ));
    END IF;

    -- Create second demo order if steel product exists
    IF sharma_user_id IS NOT NULL AND steel_product_id IS NOT NULL THEN
        INSERT INTO public.suggested_orders (
            user_id, product_id, suggested_qty, reason,
            lead_time_days, safety_factor, status
        ) VALUES (
            sharma_user_id, steel_product_id, 25,
            'Demo: Low stock detected - Auto-reorder suggested',
            10, 1.3, 'suggested'
        ) RETURNING id INTO suggestion_id2;

        INSERT INTO public.orders (
            user_id, items, status, total_amount,
            contact_number, delivery_address
        ) VALUES (
            sharma_user_id,
            jsonb_build_array(
                jsonb_build_object(
                    'productId', steel_product_id,
                    'qty', 25,
                    'name', 'Steel Rods',
                    'price', 850
                )
            ),
            'Draft',
            21250,
            '+91-9876543210',
            'Shop No. 15, Hardware Market, Delhi'
        );
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        -- Ignore errors in demo data creation
        RAISE NOTICE 'Demo data creation skipped: %', SQLERRM;
END $$;