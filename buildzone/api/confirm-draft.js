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
    const { orderId, suggestionId } = req?.body;

    if (!orderId) {
      return res?.status(400)?.json({ 
        error: 'Missing required field: orderId' 
      });
    }

    // Validate environment variables
    if (!process.env?.VITE_SUPABASE_URL || !process.env?.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing Supabase configuration');
    }

    console.log(`Confirming draft order: ${orderId}`);

    // Try using the database function first
    let result;
    try {
      const { data, error } = await supabase?.rpc('confirm_draft_order', {
        order_id: orderId,
        suggestion_id: suggestionId || null
      });

      if (error) throw error;
      result = data;
    } catch (rpcError) {
      console.warn('RPC function not available, using manual logic:', rpcError?.message);
      result = await manualConfirmDraft(orderId, suggestionId);
    }

    // Log the confirmation
    const { error: logError } = await supabase?.from('agent_logs')?.insert({
        agent_name: 'OrderAgent',
        event_type: 'draft_confirmed',
        payload: {
          order_id: orderId,
          suggestion_id: suggestionId,
          confirmation_time: new Date()?.toISOString(),
          result: result
        }
      });

    if (logError) {
      console.warn('Failed to log order confirmation:', logError?.message);
    }

    return res?.status(200)?.json({
      success: true,
      message: 'Draft order confirmed successfully',
      data: result,
      timestamp: new Date()?.toISOString()
    });

  } catch (error) {
    console.error('Confirm draft order API error:', error);
    
    return res?.status(500)?.json({
      success: false,
      error: 'Failed to confirm draft order',
      message: error?.message,
      details: process.env?.NODE_ENV === 'development' ? error?.stack : undefined
    });
  }
}

// Manual draft confirmation logic
async function manualConfirmDraft(orderId, suggestionId) {
  try {
    // Get the draft order
    const { data: order, error: orderError } = await supabase?.from('orders')?.select('*')?.eq('id', orderId)?.eq('status', 'Draft')?.single();

    if (orderError) {
      throw new Error(`Draft order not found: ${orderError.message}`);
    }

    if (!order) {
      throw new Error('Draft order not found or already confirmed');
    }

    // Update order status to Pending
    const { data: updatedOrder, error: updateError } = await supabase?.from('orders')?.update({ 
        status: 'Pending',
        updated_at: new Date()?.toISOString()
      })?.eq('id', orderId)?.select()?.single();

    if (updateError) {
      throw new Error(`Failed to update order status: ${updateError.message}`);
    }

    // If this was created from a suggestion, mark the suggestion as confirmed
    if (suggestionId) {
      const { error: suggestionError } = await supabase?.from('suggested_orders')?.update({ 
          status: 'confirmed',
          updated_at: new Date()?.toISOString()
        })?.eq('id', suggestionId);

      if (suggestionError) {
        console.warn('Failed to update suggestion status:', suggestionError?.message);
      }
    }

    return {
      success: true,
      message: 'Draft order confirmed and moved to Pending status',
      order: updatedOrder,
      previous_status: 'Draft',
      new_status: 'Pending'
    };

  } catch (error) {
    console.error('Manual confirm draft error:', error);
    throw error;
  }
}

// Helper function to validate order ownership (optional security check)
async function validateOrderOwnership(orderId, userId) {
  if (!userId) return true; // Skip validation if no user provided

  const { data, error } = await supabase?.from('orders')?.select('user_id')?.eq('id', orderId)?.single();

  if (error || !data) {
    throw new Error(`Order not found: ${orderId}`);
  }

  if (data?.user_id !== userId) {
    throw new Error('Unauthorized: Order does not belong to user');
  }

  return true;
}