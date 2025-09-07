import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config();

const supabaseUrl = process.env?.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env?.SUPABASE_SERVICE_ROLE_KEY;
const seedToken = process.env?.SEED_TOKEN;

// Create Supabase admin client
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const demoUsers = [
  {
    email: 'sharma@demo.com',
    password: 'Demo123456!',
    name: 'Sharma Hardware',
    shop_name: 'Sharma Hardware',
    shop_size: 'small',
    role: 'customer'
  },
  {
    email: 'gupta@demo.com',
    password: 'Demo123456!',
    name: 'Gupta Sanitary Mart',
    shop_name: 'Gupta Sanitary Mart',
    shop_size: 'large',
    role: 'customer'
  }
];

const sampleProducts = [
  {
    name: 'Cement Bags',
    description: 'High quality Portland cement bags 50kg each',
    price: 400,
    category: 'Construction Materials',
    brand: 'UltraTech',
    stock: 200,
    image_url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400'
  },
  {
    name: 'Steel Rods',
    description: '12mm TMT steel rods for construction',
    price: 65,
    category: 'Construction Materials',
    brand: 'Tata Steel',
    stock: 500,
    image_url: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=400'
  },
  {
    name: 'PVC Pipes',
    description: '4 inch PVC pipes for plumbing',
    price: 250,
    category: 'Plumbing',
    brand: 'Supreme',
    stock: 150,
    image_url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7e73?w=400'
  },
  {
    name: 'Bricks',
    description: 'Red clay bricks for construction',
    price: 8,
    category: 'Construction Materials',
    brand: 'Local',
    stock: 10000,
    image_url: 'https://images.unsplash.com/photo-1558681843-afdf048c2ca9?w=400'
  },
  {
    name: 'Tiles',
    description: 'Ceramic floor tiles 2x2 feet',
    price: 45,
    category: 'Flooring',
    brand: 'Kajaria',
    stock: 800,
    image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'
  }
];

const sampleOffers = [
  {
    title: 'Monsoon Construction Sale',
    description: 'Get 15% off on all cement and steel items',
    image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400',
    discount_percentage: 15,
    valid_till: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)?.toISOString(),
    is_active: true
  },
  {
    title: 'Bulk Purchase Discount',
    description: 'Buy more than 100 pieces and save 10%',
    image_url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400',
    discount_percentage: 10,
    valid_till: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)?.toISOString(),
    is_active: true
  }
];

async function createDemoUsers() {
  const createdUsers = [];
  
  for (const user of demoUsers) {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase?.auth?.admin?.createUser({
        email: user?.email,
        password: user?.password,
        email_confirm: true,
        user_metadata: {
          name: user?.name
        }
      });

      if (authError) {
        console.log(`User ${user?.email} might already exist:`, authError?.message);
        
        // Try to get existing user
        const { data: users, error: listError } = await supabase?.auth?.admin?.listUsers();
        if (listError) throw listError;
        
        const existingUser = users?.users?.find(u => u?.email === user?.email);
        if (existingUser) {
          console.log(`Using existing user: ${user?.email}`);
          createdUsers?.push({ ...user, id: existingUser?.id });
          continue;
        } else {
          throw authError;
        }
      }

      // Update user profile
      const { error: profileError } = await supabase?.from('user_profiles')?.upsert({
          id: authData?.user?.id,
          name: user?.name,
          email: user?.email,
          shop_name: user?.shop_name,
          shop_size: user?.shop_size,
          role: user?.role
        });

      if (profileError) {
        console.error('Error creating user profile:', profileError);
      } else {
        console.log(`✅ Created user: ${user?.email}`);
        createdUsers?.push({ ...user, id: authData?.user?.id });
      }
    } catch (error) {
      console.error(`Error creating user ${user?.email}:`, error?.message);
    }
  }
  
  return createdUsers;
}

async function seedProducts() {
  try {
    const { data, error } = await supabase?.from('products')?.upsert(sampleProducts, { onConflict: 'name', ignoreDuplicates: true });
    
    if (error) throw error;
    console.log('✅ Products seeded successfully');
    return data;
  } catch (error) {
    console.error('Error seeding products:', error?.message);
    return null;
  }
}

async function seedOffers() {
  try {
    const { data, error } = await supabase?.from('offers')?.upsert(sampleOffers, { onConflict: 'title', ignoreDuplicates: true });
    
    if (error) throw error;
    console.log('✅ Offers seeded successfully');
  } catch (error) {
    console.error('Error seeding offers:', error?.message);
  }
}

async function createSampleOrders(users, products) {
  if (!users?.length || !products?.length) return;

  const sharma = users?.find(u => u?.email === 'sharma@demo.com');
  const gupta = users?.find(u => u?.email === 'gupta@demo.com');

  if (!sharma || !gupta) {
    console.log('⚠️ Could not find demo users for creating sample orders');
    return;
  }

  const cement = products?.find(p => p?.name === 'Cement Bags');
  const steel = products?.find(p => p?.name === 'Steel Rods');
  const tiles = products?.find(p => p?.name === 'Tiles');

  const sampleOrders = [
    {
      user_id: sharma?.id,
      items: JSON.stringify([{
        name: 'Cement Bags',
        price: 400,
        quantity: 5,
        product_id: cement?.id || ''
      }]),
      total_amount: 2000,
      status: 'Delivered',
      contact_number: '+91-9876543210',
      delivery_address: 'Shop No. 15, Hardware Market, Delhi',
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)?.toISOString(),
      updated_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)?.toISOString()
    },
    {
      user_id: gupta?.id,
      items: JSON.stringify([{
        name: 'Tiles',
        price: 45,
        quantity: 100,
        product_id: tiles?.id || ''
      }]),
      total_amount: 4500,
      status: 'Delivered',
      contact_number: '+91-9876554321',
      delivery_address: 'Shop No. 8, Sanitary Market, Mumbai',
      created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)?.toISOString(),
      updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)?.toISOString()
    },
    {
      user_id: sharma?.id,
      items: JSON.stringify([{
        name: 'Steel Rods',
        price: 65,
        quantity: 10,
        product_id: steel?.id || ''
      }]),
      total_amount: 650,
      status: 'Draft',
      contact_number: '+91-9876543210',
      delivery_address: 'Shop No. 15, Hardware Market, Delhi'
    }
  ];

  try {
    const { error } = await supabase?.from('orders')?.upsert(sampleOrders);
    if (error) throw error;
    console.log('✅ Sample orders created successfully');
  } catch (error) {
    console.error('Error creating sample orders:', error?.message);
  }
}

async function createLoyaltyPoints(users) {
  if (!users?.length) return;

  const loyaltyData = users?.map(user => ({
    user_id: user?.id,
    buildscore: user?.email?.includes('sharma') ? 125.5 : 285.0,
    tier: user?.email?.includes('sharma') ? 'Silver' : 'Gold'
  }));

  try {
    const { error } = await supabase?.from('loyalty_points')?.upsert(loyaltyData);
    if (error) throw error;
    console.log('✅ Loyalty points created successfully');
  } catch (error) {
    console.error('Error creating loyalty points:', error?.message);
  }
}

async function createAgentLogs(users) {
  if (!users?.length) return;

  const sharma = users?.find(u => u?.email === 'sharma@demo.com');
  const gupta = users?.find(u => u?.email === 'gupta@demo.com');

  const agentLogs = [
    {
      agent_name: 'ReorderAgent',
      event_type: 'reorder_analysis',
      payload: JSON.stringify({
        user_id: sharma?.id,
        products_analyzed: 4,
        suggestions_created: 2,
        analysis_time: new Date()?.toISOString()
      })
    },
    {
      agent_name: 'ReorderAgent',
      event_type: 'order_suggestion',
      payload: JSON.stringify({
        user_id: gupta?.id,
        product_id: 'cement',
        suggested_qty: 20,
        reason: 'low_stock',
        confidence: 0.85
      })
    }
  ];

  try {
    const { error } = await supabase?.from('agent_logs')?.insert(agentLogs);
    if (error) throw error;
    console.log('✅ Agent logs created successfully');
  } catch (error) {
    console.error('Error creating agent logs:', error?.message);
  }
}

// Main seeding function
async function seedDemoData() {
  try {
    console.log('🌱 Starting demo data seeding...');
    
    // Check if required environment variables exist
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing required environment variables: VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
    }

    // Test Supabase connection
    const { data, error } = await supabase?.from('user_profiles')?.select('count');
    if (error) {
      throw new Error(`Supabase connection failed: ${error.message}`);
    }

    // Seed products first
    const products = await seedProducts();
    
    // Create demo users
    const users = await createDemoUsers();
    
    // Create related data
    await seedOffers();
    await createLoyaltyPoints(users);
    await createSampleOrders(users, products);
    await createAgentLogs(users);
    
    console.log('🎉 Demo data seeding completed successfully!');
    
    return {
      success: true,
      message: 'Demo data seeded successfully',
      users: users?.map(u => ({ email: u?.email, id: u?.id })),
      stats: {
        users_created: users?.length,
        products_seeded: products?.length || 0
      }
    };
  } catch (error) {
    console.error('❌ Demo data seeding failed:', error?.message);
    return {
      success: false,
      error: error?.message
    };
  }
}

// Allow running as standalone script or imported module
if (import.meta.url === `file://${process.argv?.[1]}`) {
  // Run as standalone script
  seedDemoData()?.then(result => {
    console.log('\n📊 Final Result:', JSON.stringify(result, null, 2));
    process.exit(result?.success ? 0 : 1);
  });
}

export { seedDemoData };