import { supabase } from '../lib/supabase';

// ============ PRODUCTS API ============
export const productsApi = {
  // Get all products with optional filtering
  getAll: async (filters = {}) => {
    try {
      let query = supabase?.from('products')?.select('*')
      
      if (filters?.category) {
        query = query?.eq('category', filters?.category)
      }
      
      if (filters?.brand) {
        query = query?.eq('brand', filters?.brand)
      }
      
      if (filters?.search) {
        query = query?.or(`name.ilike.%${filters?.search}%,description.ilike.%${filters?.search}%`)
      }
      
      const { data, error } = await query?.order('created_at', { ascending: false })
      
      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      return { data: [], error }
    }
  },

  // Get single product by ID
  getById: async (id) => {
    try {
      const { data, error } = await supabase?.from('products')?.select('*')?.eq('id', id)?.single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Create new product (admin only)
  create: async (productData) => {
    try {
      const { data, error } = await supabase?.from('products')?.insert([productData])?.select()?.single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Update product (admin only)
  update: async (id, updates) => {
    try {
      const { data, error } = await supabase?.from('products')?.update(updates)?.eq('id', id)?.select()?.single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Delete product (admin only)
  delete: async (id) => {
    try {
      const { error } = await supabase?.from('products')?.delete()?.eq('id', id)
      
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error }
    }
  }
}

// ============ ORDERS API ============
export const ordersApi = {
  // Get user's orders
  getByUser: async (userId) => {
    try {
      const { data, error } = await supabase?.from('order_details')?.select('*')?.eq('user_id', userId)?.order('created_at', { ascending: false })
      
      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      return { data: [], error }
    }
  },

  // Get all orders (admin only)
  getAll: async (filters = {}) => {
    try {
      let query = supabase?.from('order_details')?.select('*')
      
      if (filters?.status) {
        query = query?.eq('status', filters?.status)
      }
      
      const { data, error } = await query?.order('created_at', { ascending: false })
      
      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      return { data: [], error }
    }
  },

  // Create new order
  create: async (orderData) => {
    try {
      const { data, error } = await supabase?.from('orders')?.insert([orderData])?.select()?.single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Update order status
  updateStatus: async (orderId, status, adminNotes = '') => {
    try {
      const updates = { status }
      if (adminNotes) {
        updates.admin_notes = adminNotes
      }
      
      const { data, error } = await supabase?.from('orders')?.update(updates)?.eq('id', orderId)?.select()?.single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }
}

// ============ OFFERS API ============
export const offersApi = {
  // Get all active offers
  getActive: async () => {
    try {
      const { data, error } = await supabase?.from('offers')?.select('*')?.eq('is_active', true)?.gte('valid_till', new Date()?.toISOString()?.split('T')?.[0])?.order('created_at', { ascending: false })
      
      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      return { data: [], error }
    }
  },

  // Get all offers (admin only)
  getAll: async () => {
    try {
      const { data, error } = await supabase?.from('offers')?.select('*')?.order('created_at', { ascending: false })
      
      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      return { data: [], error }
    }
  },

  // Create new offer (admin only)
  create: async (offerData) => {
    try {
      const { data, error } = await supabase?.from('offers')?.insert([offerData])?.select()?.single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Update offer (admin only)
  update: async (id, updates) => {
    try {
      const { data, error } = await supabase?.from('offers')?.update(updates)?.eq('id', id)?.select()?.single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Delete offer (admin only)
  delete: async (id) => {
    try {
      const { error } = await supabase?.from('offers')?.delete()?.eq('id', id)
      
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error }
    }
  }
}

// ============ CREDIT APPLICATIONS API ============
export const creditApi = {
  // Get user's credit applications
  getByUser: async (userId) => {
    try {
      const { data, error } = await supabase?.from('credit_applications')?.select('*')?.eq('user_id', userId)?.order('created_at', { ascending: false })
      
      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      return { data: [], error }
    }
  },

  // Get all credit applications (admin only)
  getAll: async (filters = {}) => {
    try {
      let query = supabase?.from('credit_applications')?.select(`
          *,
          user_profiles!inner(name, email, shop_name)
        `)
      
      if (filters?.status) {
        query = query?.eq('status', filters?.status)
      }
      
      const { data, error } = await query?.order('created_at', { ascending: false })
      
      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      return { data: [], error }
    }
  },

  // Submit credit application
  create: async (applicationData) => {
    try {
      const { data, error } = await supabase?.from('credit_applications')?.insert([applicationData])?.select()?.single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Update application status (admin only)
  updateStatus: async (id, status, approvedLimit = null, adminNotes = '') => {
    try {
      const updates = { status, admin_notes: adminNotes }
      if (approvedLimit !== null) {
        updates.approved_limit = approvedLimit
      }
      
      const { data, error } = await supabase?.from('credit_applications')?.update(updates)?.eq('id', id)?.select()?.single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }
}

// ============ COMMUNITY FEED API ============
export const communityApi = {
  // Get all community posts
  getAll: async (filters = {}) => {
    try {
      let query = supabase?.from('community_feed')?.select('*')
      
      if (filters?.category && filters?.category !== 'all') {
        query = query?.eq('category', filters?.category)
      }
      
      if (filters?.search) {
        query = query?.or(`title.ilike.%${filters?.search}%,content.ilike.%${filters?.search}%`)
      }
      
      const { data, error } = await query?.order('created_at', { ascending: false })
      
      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      return { data: [], error }
    }
  },

  // Create new community post (admin only)
  create: async (postData) => {
    try {
      const { data, error } = await supabase?.from('community_feed')?.insert([postData])?.select()?.single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Update community post (admin only)
  update: async (id, updates) => {
    try {
      const { data, error } = await supabase?.from('community_feed')?.update(updates)?.eq('id', id)?.select()?.single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Delete community post (admin only)
  delete: async (id) => {
    try {
      const { error } = await supabase?.from('community_feed')?.delete()?.eq('id', id)
      
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error }
    }
  }
}

// ============ USER PROFILES API ============
export const userProfilesApi = {
  // Get user profile
  getById: async (userId) => {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.select('*')?.eq('id', userId)?.single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Update user profile
  update: async (userId, updates) => {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.update(updates)?.eq('id', userId)?.select()?.single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }
}