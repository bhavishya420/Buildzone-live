import { supabase } from "../lib/supabase";

export const supabaseService = {
  // Products
  async getProducts() {
    try {
      const { data, error } = await supabase
        ?.from('products')
        ?.select('*')
        ?.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching products:', error?.message);
      throw error;
    }
  },

  async getProductById(id) {
    try {
      const { data, error } = await supabase
        ?.from('products')
        ?.select('*')
        ?.eq('id', id)
        ?.single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching product:', error?.message);
      throw error;
    }
  },

  // Orders
  async createOrder(orderData) {
    try {
      const { data, error } = await supabase
        ?.from('orders')
        ?.insert([{
          user_id: orderData?.user_id,
          items: orderData?.items,
          total_amount: orderData?.total_amount,
          status: 'Pending',
          contact_number: orderData?.contact_number || null,
          delivery_address: orderData?.delivery_address || null,
          created_at: new Date()?.toISOString()
        }])
        ?.select()
        ?.single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating order:', error?.message);
      throw error;
    }
  },

  async getUserOrders(userId) {
    try {
      const { data, error } = await supabase
        ?.from('orders')
        ?.select('*')
        ?.eq('user_id', userId)
        ?.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching orders:', error?.message);
      throw error;
    }
  },

  // Credit Applications
  async createCreditApplication(applicationData) {
    try {
      const { data, error } = await supabase
        ?.from('credit_applications')
        ?.insert([{
          user_id: applicationData?.user_id,
          pan_number: applicationData?.pan_number,
          gst_number: applicationData?.gst_number || null,
          requested_limit: applicationData?.requested_limit,
          documents_uploaded: applicationData?.documents_uploaded || false,
          status: 'Pending',
          admin_notes: null,
          approved_limit: null
        }])
        ?.select()
        ?.single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating credit application:', error?.message);
      throw error;
    }
  },

  // Loyalty Points
  async getLoyaltyPoints(userId) {
    try {
      const { data, error } = await supabase
        ?.from('loyalty_points')
        ?.select('*')
        ?.eq('user_id', userId)
        ?.single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching loyalty points:', error?.message);
      throw error;
    }
  },

  async updateLoyaltyPoints(userId, buildScore, tier) {
    try {
      const { data, error } = await supabase
        ?.from('loyalty_points')
        ?.upsert({
          user_id: userId,
          buildscore: buildScore,
          tier: tier,
          updated_at: new Date()?.toISOString()
        })
        ?.select()
        ?.single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating loyalty points:', error?.message);
      throw error;
    }
  },

  // Credit Scoring
  async calculateCreditEligibility(userId) {
    try {
      const { data, error } = await supabase
        ?.rpc('calculate_credit_eligibility', { 
          input_user_id: userId 
        });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error calculating credit eligibility:', error?.message);
      throw error;
    }
  },

  // Offers
  async getActiveOffers() {
    try {
      const { data, error } = await supabase
        ?.from('offers')
        ?.select('*')
        ?.eq('is_active', true)
        ?.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching offers:', error?.message);
      throw error;
    }
  },

  async createOffer(offerData) {
    try {
      const { data, error } = await supabase
        ?.from('offers')
        ?.insert([{
          title: offerData?.title,
          description: offerData?.description || null,
          image_url: offerData?.image_url,
          discount_percentage: offerData?.discount_percentage || null,
          valid_till: offerData?.valid_till || null,
          is_active: true
        }])
        ?.select()
        ?.single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating offer:', error?.message);
      throw error;
    }
  },

  // Community Feed
  async getCommunityPosts() {
    try {
      const { data, error } = await supabase
        ?.from('community_feed')
        ?.select('*')
        ?.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching community posts:', error?.message);
      throw error;
    }
  },

  // File Upload
  async uploadFile(file, bucket, path) {
    try {
      const fileExt = file?.name?.split('.')?.pop();
      const fileName = `${path}.${fileExt}`;

      const { data, error } = await supabase?.storage
        ?.from(bucket)
        ?.upload(fileName, file, { upsert: true });

      if (error) throw error;

      const { data: urlData } = supabase?.storage
        ?.from(bucket)
        ?.getPublicUrl(fileName);

      return urlData?.publicUrl;
    } catch (error) {
      console.error('Upload error:', error?.message);
      throw error;
    }
  }
};