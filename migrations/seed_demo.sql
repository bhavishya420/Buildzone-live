-- Buildzone Demo Data Seeding
-- This file creates demo users and sample data for testing

-- NOTE: This script assumes you have UUIDs for demo users
-- Replace <UUID_OF_SHARMA> and <UUID_OF_GUPTA> with actual auth.users UUIDs after signup
-- Or use the seed-demo script to create users via Supabase Admin API

-- Demo User UUIDs (replace with actual UUIDs from auth.users after signup)
-- <UUID_OF_SHARMA> = Replace with Sharma's actual UUID from auth.users
-- <UUID_OF_GUPTA> = Replace with Gupta's actual UUID from auth.users

-- Insert sample products if they don't exist
INSERT INTO public.products (name, description, price, category, brand, stock, image_url) VALUES
('Cement Bags', 'High quality Portland cement bags 50kg each', 400, 'Construction Materials', 'UltraTech', 200, 'https://example.com/cement.jpg'),
('Steel Rods', '12mm TMT steel rods for construction', 65, 'Construction Materials', 'Tata Steel', 500, 'https://example.com/steel.jpg'),
('PVC Pipes', '4 inch PVC pipes for plumbing', 250, 'Plumbing', 'Supreme', 150, 'https://example.com/pvc.jpg'),
('Bricks', 'Red clay bricks for construction', 8, 'Construction Materials', 'Local', 10000, 'https://example.com/bricks.jpg'),
('Tiles', 'Ceramic floor tiles 2x2 feet', 45, 'Flooring', 'Kajaria', 800, 'https://example.com/tiles.jpg'),
('Paint', 'Exterior wall paint 20L bucket', 3200, 'Paints', 'Asian Paints', 50, 'https://example.com/paint.jpg'),
('Sand', 'Construction sand per cubic meter', 1200, 'Construction Materials', 'Local', 100, 'https://example.com/sand.jpg'),
('Wire', 'Electrical wire 2.5mm copper', 120, 'Electrical', 'Havells', 300, 'https://example.com/wire.jpg')
ON CONFLICT DO NOTHING;

-- Insert demo user profiles (use actual UUIDs from auth.users)
-- These will need to be updated with real UUIDs after user signup
INSERT INTO public.user_profiles (id, name, email, shop_name, shop_size, role) VALUES
('<UUID_OF_SHARMA>', 'Sharma Hardware', 'sharma@demo.com', 'Sharma Hardware', 'small', 'customer'),
('<UUID_OF_GUPTA>', 'Gupta Sanitary Mart', 'gupta@demo.com', 'Gupta Sanitary Mart', 'large', 'customer')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    shop_name = EXCLUDED.shop_name,
    shop_size = EXCLUDED.shop_size;

-- Insert loyalty points for demo users
INSERT INTO public.loyalty_points (user_id, buildscore, tier) VALUES
('<UUID_OF_SHARMA>', 125.5, 'Silver'),
('<UUID_OF_GUPTA>', 285.0, 'Gold')
ON CONFLICT (user_id) DO UPDATE SET
    buildscore = EXCLUDED.buildscore,
    tier = EXCLUDED.tier;

-- Insert sample orders for Sharma (replace <UUID_OF_SHARMA>)
INSERT INTO public.orders (id, user_id, items, total_amount, status, contact_number, delivery_address, created_at, updated_at) VALUES
(
    uuid_generate_v4(),
    '<UUID_OF_SHARMA>',
    '[{"name":"Cement Bags","price":400,"quantity":5,"product_id":""}]',
    2000,
    'Delivered',
    '+91-9876543210',
    'Shop No. 15, Hardware Market, Delhi',
    NOW() - INTERVAL '30 days',
    NOW() - INTERVAL '25 days'
),
(
    uuid_generate_v4(),
    '<UUID_OF_SHARMA>',
    '[{"name":"Steel Rods","price":65,"quantity":25,"product_id":""}]',
    1625,
    'Delivered',
    '+91-9876543210',
    'Shop No. 15, Hardware Market, Delhi',
    NOW() - INTERVAL '15 days',
    NOW() - INTERVAL '10 days'
),
(
    uuid_generate_v4(),
    '<UUID_OF_SHARMA>',
    '[{"name":"PVC Pipes","price":250,"quantity":8,"product_id":""}]',
    2000,
    'Pending',
    '+91-9876543210',
    'Shop No. 15, Hardware Market, Delhi',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days'
);

-- Insert sample orders for Gupta (replace <UUID_OF_GUPTA>)
INSERT INTO public.orders (id, user_id, items, total_amount, status, contact_number, delivery_address, created_at, updated_at) VALUES
(
    uuid_generate_v4(),
    '<UUID_OF_GUPTA>',
    '[{"name":"Tiles","price":45,"quantity":100,"product_id":""},{"name":"Paint","price":3200,"quantity":2,"product_id":""}]',
    10900,
    'Delivered',
    '+91-9876554321',
    'Shop No. 8, Sanitary Market, Mumbai',
    NOW() - INTERVAL '45 days',
    NOW() - INTERVAL '40 days'
),
(
    uuid_generate_v4(),
    '<UUID_OF_GUPTA>',
    '[{"name":"Wire","price":120,"quantity":20,"product_id":""}]',
    2400,
    'Confirmed',
    '+91-9876554321',
    'Shop No. 8, Sanitary Market, Mumbai',
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '5 days'
);

-- Insert sample inventory for demo users
INSERT INTO public.inventory (user_id, product_id, qty) 
SELECT 
    '<UUID_OF_SHARMA>', 
    p.id, 
    CASE 
        WHEN p.name = 'Cement Bags' THEN 25
        WHEN p.name = 'Steel Rods' THEN 50
        WHEN p.name = 'PVC Pipes' THEN 15
        WHEN p.name = 'Bricks' THEN 1000
        ELSE 0
    END
FROM public.products p
WHERE p.name IN ('Cement Bags', 'Steel Rods', 'PVC Pipes', 'Bricks')
ON CONFLICT DO NOTHING;

INSERT INTO public.inventory (user_id, product_id, qty)
SELECT 
    '<UUID_OF_GUPTA>',
    p.id,
    CASE 
        WHEN p.name = 'Tiles' THEN 200
        WHEN p.name = 'Paint' THEN 10
        WHEN p.name = 'Wire' THEN 100
        WHEN p.name = 'PVC Pipes' THEN 75
        ELSE 0
    END
FROM public.products p
WHERE p.name IN ('Tiles', 'Paint', 'Wire', 'PVC Pipes')
ON CONFLICT DO NOTHING;

-- Insert sample offers
INSERT INTO public.offers (title, description, image_url, discount_percentage, valid_till, is_active) VALUES
('Monsoon Construction Sale', 'Get 15% off on all cement and steel items', 'https://example.com/monsoon-offer.jpg', 15, NOW() + INTERVAL '30 days', true),
('Bulk Purchase Discount', 'Buy more than 100 pieces and save 10%', 'https://example.com/bulk-offer.jpg', 10, NOW() + INTERVAL '60 days', true),
('New Customer Special', 'First-time buyers get 20% off on tiles', 'https://example.com/new-customer.jpg', 20, NOW() + INTERVAL '45 days', true)
ON CONFLICT DO NOTHING;

-- Insert sample community posts
INSERT INTO public.community_feed (title, content, author_name, image_url, likes_count, comments_count) VALUES
('Best Cement Brands for Monsoon Construction', 'During monsoon season, it is crucial to choose the right cement brand...', 'Construction Expert', 'https://example.com/cement-tips.jpg', 24, 8),
('How to Store Steel Rods Properly', 'Proper storage of steel rods prevents rusting and maintains quality...', 'Steel Specialist', 'https://example.com/steel-storage.jpg', 18, 5),
('PVC vs Copper Pipes: Complete Comparison', 'Choosing between PVC and copper pipes? Here is everything you need to know...', 'Plumbing Pro', 'https://example.com/pipes-comparison.jpg', 32, 12)
ON CONFLICT DO NOTHING;

-- Insert sample agent logs
INSERT INTO public.agent_logs (agent_name, event_type, payload) VALUES
('ReorderAgent', 'reorder_analysis', '{"user_id":"<UUID_OF_SHARMA>","products_analyzed":4,"suggestions_created":2,"analysis_time":"2024-01-15T10:30:00Z"}'),
('ReorderAgent', 'order_suggestion', '{"user_id":"<UUID_OF_GUPTA>","product_id":"cement","suggested_qty":20,"reason":"low_stock","confidence":0.85}'),
('CreditAgent', 'eligibility_check', '{"user_id":"<UUID_OF_SHARMA>","credit_score":725,"eligible_limit":50000,"tier":"silver"}')
ON CONFLICT DO NOTHING;

-- Create a draft order for testing
INSERT INTO public.orders (id, user_id, items, total_amount, status, contact_number, delivery_address) VALUES
(
    uuid_generate_v4(),
    '<UUID_OF_SHARMA>',
    '[{"name":"Cement Bags","price":400,"quantity":10,"product_id":""}]',
    4000,
    'Draft',
    '+91-9876543210',
    'Shop No. 15, Hardware Market, Delhi'
);

COMMENT ON TABLE public.user_profiles IS 'Demo data created for Sharma Hardware and Gupta Sanitary Mart. Replace UUID placeholders with actual auth.users IDs.';

-- Instructions for updating UUIDs:
-- 1. Sign up users via Supabase Auth (or use Admin API in seed-demo script)
-- 2. Get their UUIDs from auth.users table
-- 3. Replace <UUID_OF_SHARMA> and <UUID_OF_GUPTA> in this file
-- 4. Run the updated SQL to insert proper demo data