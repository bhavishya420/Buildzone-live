import { supabase } from '../lib/supabase';

export const creditScoringService = {
  // Calculate credit eligibility for a user
  async calculateCreditEligibility(userId) {
    try {
      const { data, error } = await supabase
        ?.rpc('calculate_credit_eligibility', { 
          input_user_id: userId 
        });
      
      if (error) throw error;
      return {
        data,
        error: null
      };
    } catch (error) {
      console.error('Error calculating credit eligibility:', error?.message);
      return {
        data: null,
        error: error?.message || 'Failed to calculate credit eligibility'
      };
    }
  },

  // Get user's loyalty points and tier information
  async getLoyaltyPoints(userId) {
    try {
      const { data, error } = await supabase
        ?.from('loyalty_points')
        ?.select('*')
        ?.eq('user_id', userId)
        ?.single();
      
      if (error) throw error;
      return {
        data,
        error: null
      };
    } catch (error) {
      console.error('Error fetching loyalty points:', error?.message);
      return {
        data: null,
        error: error?.message || 'Failed to fetch loyalty points'
      };
    }
  },

  // Update user's BuildScore and tier
  async updateBuildScore(userId, buildScore, tier) {
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
      return {
        data,
        error: null
      };
    } catch (error) {
      console.error('Error updating BuildScore:', error?.message);
      return {
        data: null,
        error: error?.message || 'Failed to update BuildScore'
      };
    }
  },

  // Get user's order statistics for credit calculation
  async getUserOrderStats(userId) {
    try {
      const { data, error } = await supabase
        ?.from('orders')
        ?.select('total_amount, created_at, status')
        ?.eq('user_id', userId);
      
      if (error) throw error;
      
      // Only count completed/delivered orders for credit scoring
      const completedOrders = data?.filter(order => 
        order?.status === 'Delivered' || order?.status === 'Confirmed'
      ) || [];
      
      const orderCount = completedOrders?.length || 0;
      const totalSpend = completedOrders?.reduce((sum, order) => 
        sum + (parseFloat(order?.total_amount) || 0), 0) || 0;
      
      return {
        data: {
          orderCount,
          totalSpend,
          orders: completedOrders,
          allOrders: data
        },
        error: null
      };
    } catch (error) {
      console.error('Error fetching order statistics:', error?.message);
      return {
        data: null,
        error: error?.message || 'Failed to fetch order statistics'
      };
    }
  },

  // Get tier configuration and benefits - Updated tier ranges
  getTierInfo() {
    return {
      Silver: {
        range: '0-100',
        color: '#C0C0C0',
        benefits: ['Basic credit access', '45 days interest-free'],
        icon: '🥈'
      },
      Gold: {
        range: '101-250',
        color: '#FFD700',
        benefits: ['Higher credit limits', 'Priority support', 'Extended payment terms'],
        icon: '🥇'
      },
      Platinum: {
        range: '251+',
        color: '#E5E4E2',
        benefits: ['Maximum credit limits', 'Premium support', 'Exclusive offers'],
        icon: '💎'
      }
    };
  },

  // Calculate tier progress percentage - Updated logic for correct tier boundaries
  calculateTierProgress(score, tier) {
    switch (tier) {
      case 'Silver':
        return Math.min((score / 100) * 100, 100);
      case 'Gold':
        // Gold tier: score 101-250, progress from 0% at 101 to 100% at 250
        if (score <= 100) return 0;
        if (score >= 250) return 100;
        return ((score - 101) / (250 - 101)) * 100;
      case 'Platinum':
        // Platinum tier: score 251+, always 100% progress
        return score >= 251 ? 100 : 0;
      default:
        return 0;
    }
  },

  // NEW: Calculate next tier information for progression - Updated for BuildScore
  getNextTierInfo(currentScore) {
    const score = currentScore || 0;
    
    if (score <= 100) {
      return {
        nextTier: 'Gold',
        targetScore: 101,
        icon: '🥇',
        color: '#FFD700',
        pointsNeeded: 101 - score
      };
    } else if (score <= 250) {
      return {
        nextTier: 'Platinum',
        targetScore: 251,
        icon: '💎',
        color: '#E5E4E2',
        pointsNeeded: 251 - score
      };
    } else {
      return {
        nextTier: null,
        targetScore: null,
        icon: '👑',
        color: '#E5E4E2',
        pointsNeeded: 0,
        maxTier: true
      };
    }
  },

  // NEW: Calculate estimated orders needed for next tier - Updated calculation
  calculateOrdersNeeded(currentScore, orderHistory) {
    const nextTierInfo = this?.getNextTierInfo(currentScore);
    
    if (!nextTierInfo?.nextTier) {
      return 0;
    }

    // Estimate based on historical data if available
    if (orderHistory?.orderCount > 0 && currentScore > 0) {
      const avgPointsPerOrder = currentScore / orderHistory?.orderCount;
      if (avgPointsPerOrder > 0) {
        return Math.max(1, Math.ceil(nextTierInfo?.pointsNeeded / avgPointsPerOrder));
      }
    }

    // Fallback calculation: assume ~10 points per order based on formula
    // BuildScore = (order_count * 10) + (total_spend / 10000)
    return Math.max(1, Math.ceil(nextTierInfo?.pointsNeeded / 10));
  },

  // Enhanced method to trigger BuildScore calculation and update
  async calculateAndUpdateBuildScore(userId) {
    try {
      // Trigger the database function which calculates and saves BuildScore
      const creditResult = await this?.calculateCreditEligibility(userId);
      
      if (creditResult?.error) {
        throw new Error(creditResult?.error);
      }

      // Get the updated loyalty points data
      const loyaltyResult = await this?.getLoyaltyPoints(userId);
      
      return {
        data: {
          creditData: creditResult?.data,
          loyaltyData: loyaltyResult?.data
        },
        error: null
      };
    } catch (error) {
      console.error('Error calculating and updating BuildScore:', error?.message);
      return {
        data: null,
        error: error?.message || 'Failed to calculate and update BuildScore'
      };
    }
  },

  // New method to format the response for display
  formatCreditResponse(creditData) {
    if (!creditData) return null;
    
    return {
      credit_score: creditData?.score || creditData?.credit_score || 0,
      credit_limit: creditData?.limit || creditData?.credit_limit || 0,
      offer: creditData?.offer || '45 days interest-free',
      tier: creditData?.tier || 'Silver',
      buildscore: creditData?.buildscore || creditData?.score || creditData?.credit_score || 0
    };
  }
};