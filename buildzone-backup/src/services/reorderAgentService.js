import { supabase } from '../lib/supabase.js';

class ReorderAgentService {
  async runReorderAgent(targetUserId = null) {
    try {
      const { data, error } = await supabase?.rpc('run_reorder_agent', {
        target_user_id: targetUserId
      });

      if (error) {
        console.error('Error running reorder agent:', error);
        return { success: false, error: error?.message };
      }

      // Trigger vibecode on successful execution if suggestions were created
      if (data?.suggestions_created > 0) {
        this.triggerVibecode();
      }

      return data;
    } catch (err) {
      console.error('Reorder agent service error:', err);
      return { success: false, error: err?.message };
    }
  }

  // New method to trigger vibecode
  triggerVibecode(pattern = [200, 100, 200]) {
    try {
      if (navigator?.vibrate) {
        navigator?.vibrate(pattern);
        console.log('Vibecode triggered:', pattern);
      } else {
        console.log('Vibration API not supported on this device');
      }
    } catch (error) {
      console.error('Error triggering vibecode:', error);
    }
  }

  // New method to confirm draft order
  async confirmDraftOrder(orderId, suggestionId = null) {
    try {
      const { data, error } = await supabase?.rpc('confirm_draft_order', {
        order_id: orderId,
        suggestion_id: suggestionId
      });

      if (error) {
        console.error('Error confirming draft order:', error);
        return { success: false, error: error?.message };
      }

      return data;
    } catch (err) {
      console.error('Confirm draft order error:', err);
      return { success: false, error: err?.message };
    }
  }

  // Enhanced method to get orders including draft orders
  async getOrders(userId = null, includeItems = true) {
    try {
      let query = supabase?.from('orders')?.select(`
          *,
          ${includeItems ? 'items,' : ''}
          user:user_profiles(id, name, shop_name)
        `)?.order('created_at', { ascending: false });

      if (userId) {
        query = query?.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching orders:', error);
        return { success: false, error: error?.message };
      }

      return { success: true, data };
    } catch (err) {
      console.error('Get orders error:', err);
      return { success: false, error: err?.message };
    }
  }

  // Method to get draft orders specifically
  async getDraftOrders(userId = null) {
    try {
      let query = supabase?.from('orders')?.select(`
          *,
          items,
          user:user_profiles(id, name, shop_name)
        `)?.eq('status', 'Draft')?.order('created_at', { ascending: false });

      if (userId) {
        query = query?.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching draft orders:', error);
        return { success: false, error: error?.message };
      }

      return { success: true, data };
    } catch (err) {
      console.error('Get draft orders error:', err);
      return { success: false, error: err?.message };
    }
  }

  async getSuggestedOrders(userId = null) {
    try {
      let query = supabase?.from('suggested_orders')?.select(`
          *,
          product:products(id, name, brand, image_url, price),
          user:user_profiles(id, name, shop_name)
        `)?.eq('status', 'suggested')?.order('created_at', { ascending: false });

      if (userId) {
        query = query?.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching suggested orders:', error);
        return { success: false, error: error?.message };
      }

      return { success: true, data };
    } catch (err) {
      console.error('Get suggested orders error:', err);
      return { success: false, error: err?.message };
    }
  }

  async confirmSuggestedOrder(suggestionId) {
    try {
      const { data, error } = await supabase?.rpc('confirm_suggested_order', {
        suggestion_id: suggestionId
      });

      if (error) {
        console.error('Error confirming suggested order:', error);
        return { success: false, error: error?.message };
      }

      return data;
    } catch (err) {
      console.error('Confirm suggested order error:', err);
      return { success: false, error: err?.message };
    }
  }

  async dismissSuggestedOrder(suggestionId) {
    try {
      const { data, error } = await supabase?.rpc('dismiss_suggested_order', {
        suggestion_id: suggestionId
      });

      if (error) {
        console.error('Error dismissing suggested order:', error);
        return { success: false, error: error?.message };
      }

      return data;
    } catch (err) {
      console.error('Dismiss suggested order error:', err);
      return { success: false, error: err?.message };
    }
  }

  async getAgentLogs(limit = 50) {
    try {
      const { data, error } = await supabase?.from('agent_logs')?.select('*')?.order('created_at', { ascending: false })?.limit(limit);

      if (error) {
        console.error('Error fetching agent logs:', error);
        return { success: false, error: error?.message };
      }

      return { success: true, data };
    } catch (err) {
      console.error('Get agent logs error:', err);
      return { success: false, error: err?.message };
    }
  }

  async getInventory(userId = null) {
    try {
      let query = supabase?.from('inventory')?.select(`
          *,
          product:products(id, name, brand, image_url, price, stock),
          user:user_profiles(id, name, shop_name)
        `)?.order('updated_at', { ascending: false });

      if (userId) {
        query = query?.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching inventory:', error);
        return { success: false, error: error?.message };
      }

      return { success: true, data };
    } catch (err) {
      console.error('Get inventory error:', err);
      return { success: false, error: err?.message };
    }
  }

  async updateInventory(inventoryId, qty) {
    try {
      const { data, error } = await supabase?.from('inventory')?.update({ qty, updated_at: new Date()?.toISOString() })?.eq('id', inventoryId)?.select()?.single();

      if (error) {
        console.error('Error updating inventory:', error);
        return { success: false, error: error?.message };
      }

      return { success: true, data };
    } catch (err) {
      console.error('Update inventory error:', err);
      return { success: false, error: err?.message };
    }
  }

  // Real-time subscription for suggested orders
  subscribeSuggestedOrders(userId, callback) {
    const channel = supabase?.channel('suggested_orders_changes')?.on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'suggested_orders',
          filter: userId ? `user_id=eq.${userId}` : undefined
        },
        callback
      )?.subscribe();

    return channel;
  }

  // Real-time subscription for orders (including draft orders)
  subscribeOrders(userId, callback) {
    const channel = supabase?.channel('orders_changes')?.on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: userId ? `user_id=eq.${userId}` : undefined
        },
        callback
      )?.subscribe();

    return channel;
  }

  // Real-time subscription for agent logs
  subscribeAgentLogs(callback) {
    const channel = supabase?.channel('agent_logs_changes')?.on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'agent_logs'
        },
        callback
      )?.subscribe();

    return channel;
  }

  // Unsubscribe from real-time updates
  unsubscribe(channel) {
    if (channel) {
      supabase?.removeChannel(channel);
    }
  }
}

export const reorderAgentService = new ReorderAgentService();
export default reorderAgentService;