import { createClient } from '@supabase/supabase-js';

// Create Supabase admin client with service role key
const supabase = createClient(
  process.env?.VITE_SUPABASE_URL,
  process.env?.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export default async function handler(req, res) {
  // Set CORS headers
  res?.setHeader('Access-Control-Allow-Credentials', true);
  res?.setHeader('Access-Control-Allow-Origin', '*');
  res?.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res?.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req?.method === 'OPTIONS') {
    res?.status(200)?.end();
    return;
  }

  if (req?.method !== 'POST') {
    return res?.status(405)?.json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    // Validate request
    const { userId } = req?.body;

    if (!userId) {
      return res?.status(400)?.json({ 
        error: 'Missing required field: userId' 
      });
    }

    // Validate environment variables
    if (!process.env?.VITE_SUPABASE_URL || !process.env?.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing Supabase configuration');
    }

    console.log(`Running reorder agent for user: ${userId}`);

    // Call the enhanced reorder agent function
    const { data: result, error } = await supabase?.rpc('run_reorder_agent_enhanced', {
      target_user_id: userId
    });

    if (error) {
      console.error('Supabase RPC error:', error);
      return res?.status(500)?.json({
        error: 'Failed to run reorder agent',
        details: error?.message
      });
    }

    // Log the agent execution
    const { error: logError } = await supabase?.from('agent_logs')?.insert({
        agent_name: 'ReorderAgent',
        event_type: 'api_execution',
        payload: {
          user_id: userId,
          execution_time: new Date()?.toISOString(),
          result: result,
          triggered_by: 'api_call'
        }
      });

    if (logError) {
      console.warn('Failed to log agent execution:', logError?.message);
    }

    // Return success response
    return res?.status(200)?.json({
      success: true,
      message: 'Reorder agent executed successfully',
      data: result,
      timestamp: new Date()?.toISOString()
    });

  } catch (error) {
    console.error('Reorder agent API error:', error);
    
    return res?.status(500)?.json({
      success: false,
      error: 'Internal server error',
      message: error?.message,
      details: process.env?.NODE_ENV === 'development' ? error?.stack : undefined
    });
  }
}

// Helper function to validate user exists
async function validateUser(userId) {
  const { data, error } = await supabase?.from('user_profiles')?.select('id, name, shop_name')?.eq('id', userId)?.single();

  if (error || !data) {
    throw new Error(`User not found: ${userId}`);
  }

  return data;
}

// Alternative manual reorder logic (if RPC function not available)
async function manualReorderLogic(userId) {
  try {
    // Get user's order history for analysis
    const { data: orderHistory, error: orderError } = await supabase?.from('order_items')?.select('*')?.eq('user_id', userId);

    if (orderError) throw orderError;

    if (!orderHistory?.length) {
      return {
        success: true,
        message: 'No order history found for analysis',
        suggestions_created: 0
      };
    }

    // Calculate average daily consumption
    const productConsumption = {};
    orderHistory?.forEach(item => {
      if (!productConsumption?.[item?.product_id]) {
        productConsumption[item.product_id] = { total_qty: 0, orders: 0 };
      }
      productConsumption[item.product_id].total_qty += item?.qty || 0;
      productConsumption[item.product_id].orders += 1;
    });

    // Get current inventory
    const { data: inventory, error: invError } = await supabase?.from('inventory')?.select('*, product:products(*)')?.eq('user_id', userId);

    if (invError) throw invError;

    const suggestions = [];
    const leadTimeDays = 7; // Default lead time
    const safetyFactor = 1.5; // Safety stock multiplier

    for (const [productId, consumption] of Object.entries(productConsumption)) {
      const avgDailyUsage = consumption?.total_qty / Math.max(consumption?.orders, 1);
      const projectedNeed = avgDailyUsage * leadTimeDays * safetyFactor;
      
      const currentStock = inventory?.find(inv => inv?.product_id === productId)?.qty || 0;
      
      if (currentStock < projectedNeed) {
        const suggestedQty = Math.ceil(projectedNeed - currentStock);
        
        // Insert suggestion
        const { error: suggestionError } = await supabase?.from('suggested_orders')?.insert({
            user_id: userId,
            product_id: productId,
            suggested_qty: suggestedQty,
            reason: `Based on ${avgDailyUsage?.toFixed(1)} daily usage`,
            lead_time_days: leadTimeDays,
            safety_factor: safetyFactor,
            status: 'suggested'
          });

        if (!suggestionError) {
          suggestions?.push({
            product_id: productId,
            suggested_qty: suggestedQty,
            reason: `Based on ${avgDailyUsage?.toFixed(1)} daily usage`
          });
        }
      }
    }

    return {
      success: true,
      message: `Analysis complete. Created ${suggestions?.length} suggestions.`,
      suggestions_created: suggestions?.length,
      suggestions: suggestions
    };

  } catch (error) {
    console.error('Manual reorder logic error:', error);
    throw error;
  }
}