-- Location: supabase/migrations/20250101000000_seed_demo_data.sql
-- Seed demo data for Buildzone app to make it look active during demo

-- Seed Products
DO $$
BEGIN
    -- Insert demo products if they don't exist
    INSERT INTO public.products (name, description, price, category, brand, image_url, stock)
    VALUES
        ('Premium Cement 50kg', 'High-quality Portland cement for all construction needs', 450.00, 'Cement', 'UltraTech', '/api/placeholder/300/300', 150),
        ('Steel TMT Bars 12mm', 'Fe500D grade TMT steel bars for reinforcement', 65.00, 'Steel', 'Tata Steel', '/api/placeholder/300/300', 200),
        ('Red Clay Bricks', 'Premium red clay bricks - Class A quality', 8.50, 'Bricks', 'Local Kiln', '/api/placeholder/300/300', 5000),
        ('Marble Floor Tiles', 'Premium Italian marble tiles - 2x2 feet', 850.00, 'Tiles', 'Kajaria', '/api/placeholder/300/300', 75),
        ('PVC Electrical Pipes', 'ISI marked PVC pipes for electrical wiring', 125.00, 'Electrical', 'Finolex', '/api/placeholder/300/300', 300),
        ('Waterproof Paint 20L', 'Weather-resistant exterior paint', 2800.00, 'Paint', 'Asian Paints', '/api/placeholder/300/300', 45),
        ('Plywood Sheet 18mm', 'BWP grade marine plywood sheet', 3200.00, 'Wood', 'Century Ply', '/api/placeholder/300/300', 60),
        ('Bathroom Fittings Set', 'Complete bathroom fitting set with taps', 12500.00, 'Plumbing', 'Hindware', '/api/placeholder/300/300', 25),
        ('LED Panel Lights', 'Energy efficient LED panel lights - 40W', 850.00, 'Electrical', 'Philips', '/api/placeholder/300/300', 120),
        ('Sand (per ton)', 'River sand for construction - Grade A', 1200.00, 'Aggregates', 'Local Supplier', '/api/placeholder/300/300', 80)
    ON CONFLICT (name) DO NOTHING;

    -- Insert demo offers
    INSERT INTO public.offers (title, description, discount_percentage, image_url, valid_till, is_active)
    VALUES
        ('New Year Sale', 'Get up to 30% off on all construction materials', 30.0, '/api/placeholder/600/200', '2025-01-31', true),
        ('Bulk Order Discount', 'Special discount for orders above ₹50,000', 15.0, '/api/placeholder/600/200', '2025-02-28', true),
        ('Monsoon Special', 'Waterproofing materials at best prices', 25.0, '/api/placeholder/600/200', '2025-03-31', true),
        ('Premium Brands Sale', 'Exclusive discounts on premium brand products', 20.0, '/api/placeholder/600/200', '2025-02-15', true)
    ON CONFLICT (title) DO NOTHING;

    -- Insert demo community feed posts
    INSERT INTO public.community_feed (title, content, author_name, category, likes_count)
    VALUES
        ('Best Cement Brands in 2025', 'After working in construction for 15 years, I can recommend UltraTech and ACC as the most reliable cement brands. They provide consistent quality and strength for all types of construction projects.', 'Rajesh Kumar', 'tips', 24),
        ('How to Save 20% on Construction Costs', 'Here are some proven tips to reduce your construction costs: 1. Buy materials in bulk 2. Plan purchases during sale seasons 3. Compare prices from multiple suppliers 4. Negotiate for better rates on large orders', 'Priya Sharma', 'tips', 18),
        ('New TMT Steel Rates Update', 'Steel prices have dropped by ₹3 per kg this week. Good time to stock up on TMT bars if you have upcoming projects. Expected to rise again next month due to increased demand.', 'Construction Updates', 'market', 32),
        ('Quality Check Tips for Bricks', 'Always test bricks before bulk purchase: 1. Check for uniform color 2. Listen for clear ringing sound when hit 3. No white patches (efflorescence) 4. Proper dimensions and smooth edges', 'Amit Gupta', 'tips', 15),
        ('Monsoon Preparation for Sites', 'Essential monsoon preparation checklist: Waterproof storage for cement, cover steel bars, proper drainage around site, stock up on tarpaulins, and plan indoor work schedules.', 'Site Supervisor', 'general', 27),
        ('Best Paint Brands Comparison', 'Compared Asian Paints, Berger, and Nerolac for exterior painting. Asian Paints wins for durability, Berger for coverage, and Nerolac for value for money. Choose based on your priorities.', 'Painter Professional', 'tips', 21)
    ON CONFLICT (title) DO NOTHING;

    RAISE NOTICE 'Demo data seeded successfully for products, offers, and community feed';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error seeding demo data: %', SQLERRM;
END $$;