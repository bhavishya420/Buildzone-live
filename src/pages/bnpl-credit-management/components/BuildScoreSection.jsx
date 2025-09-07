import React, { useState, useEffect } from 'react';
import { Trophy, Star, Target, ShoppingBag } from 'lucide-react';
import Icon from '../../../components/AppIcon';
import { useAuth } from '../../../contexts/AuthContext';
import { creditScoringService } from '../../../services/creditScoringService';

const BuildScoreSection = () => {
  const { user } = useAuth();
  const [buildScoreData, setBuildScoreData] = useState(null);
  const [orderStats, setOrderStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBuildScoreData();
  }, [user]);

  const fetchBuildScoreData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      // Get current BuildScore and tier from loyalty_points
      const loyaltyResult = await creditScoringService?.getLoyaltyPoints(user?.id);
      
      // Get order statistics for calculations
      const orderStatsResult = await creditScoringService?.getUserOrderStats(user?.id);
      
      // If no loyalty points exist yet, trigger calculation by calling credit eligibility
      if (!loyaltyResult?.data) {
        await creditScoringService?.calculateCreditEligibility(user?.id);
        // Fetch again after calculation
        const retryResult = await creditScoringService?.getLoyaltyPoints(user?.id);
        setBuildScoreData(retryResult?.data);
      } else {
        setBuildScoreData(loyaltyResult?.data);
      }
      
      setOrderStats(orderStatsResult?.data);
    } catch (err) {
      console.error('Error fetching BuildScore data:', err);
      setError(err?.message || 'Failed to fetch BuildScore information');
    } finally {
      setLoading(false);
    }
  };

  const getTierInfo = (tier) => {
    const tiers = {
      Silver: {
        name: 'Silver',
        range: '0-100',
        color: '#C0C0C0',
        bgColor: 'from-gray-100 to-gray-50',
        icon: '🥈',
        benefits: ['Basic credit access', '45 days interest-free', 'Standard support']
      },
      Gold: {
        name: 'Gold', 
        range: '101-250',
        color: '#FFD700',
        bgColor: 'from-yellow-100 to-yellow-50',
        icon: '🥇',
        benefits: ['Higher credit limits', 'Priority support', 'Extended payment terms', 'Exclusive offers']
      },
      Platinum: {
        name: 'Platinum',
        range: '251+',
        color: '#E5E4E2', 
        bgColor: 'from-slate-100 to-slate-50',
        icon: '💎',
        benefits: ['Maximum credit limits', 'Premium support', 'VIP treatment', 'All exclusive benefits']
      }
    };
    return tiers?.[tier] || tiers?.Silver;
  };

  const getNextTierInfo = () => {
    const currentScore = buildScoreData?.buildscore || 0;
    
    if (currentScore <= 100) {
      return {
        nextTier: 'Gold',
        targetScore: 101,
        pointsNeeded: Math.max(0, 101 - currentScore),
        icon: '🥇',
        color: '#FFD700'
      };
    } else if (currentScore <= 250) {
      return {
        nextTier: 'Platinum',
        targetScore: 251,
        pointsNeeded: Math.max(0, 251 - currentScore),
        icon: '💎', 
        color: '#E5E4E2'
      };
    } else {
      return {
        nextTier: null,
        targetScore: null,
        pointsNeeded: 0,
        icon: '👑',
        color: '#E5E4E2',
        maxTier: true
      };
    }
  };

  const calculateProgress = () => {
    const currentScore = buildScoreData?.buildscore || 0;
    const tier = buildScoreData?.tier || 'Silver';
    
    switch (tier) {
      case 'Silver':
        return Math.min((currentScore / 100) * 100, 100);
      case 'Gold':
        if (currentScore <= 100) return 0;
        if (currentScore >= 250) return 100;
        return ((currentScore - 101) / (250 - 101)) * 100;
      case 'Platinum':
        return 100;
      default:
        return 0;
    }
  };

  const calculateOrdersNeeded = () => {
    const nextTierInfo = getNextTierInfo();
    if (!nextTierInfo?.nextTier) return 0;
    
    // Estimate orders needed: Each order contributes roughly 10 points
    // This is based on the formula: BuildScore = (order_count * 10) + (total_spend / 10000)
    const ordersNeeded = Math.max(1, Math.ceil(nextTierInfo?.pointsNeeded / 10));
    return ordersNeeded;
  };

  if (loading) {
    return (
      <div className="bg-surface border border-border rounded-xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-48"></div>
          <div className="h-16 bg-muted rounded"></div>
          <div className="h-4 bg-muted rounded w-64"></div>
          <div className="h-2 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6">
        <div className="flex items-center space-x-2 text-destructive mb-2">
          <Icon name="AlertTriangle" size={20} />
          <span className="font-medium">Unable to load BuildScore</span>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <button
          onClick={fetchBuildScoreData}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const currentScore = buildScoreData?.buildscore || 0;
  const currentTier = buildScoreData?.tier || 'Silver';
  const tierInfo = getTierInfo(currentTier);
  const nextTierInfo = getNextTierInfo();
  const progress = calculateProgress();
  const ordersNeeded = calculateOrdersNeeded();

  return (
    <div className={`bg-gradient-to-br ${tierInfo?.bgColor} border border-border rounded-xl p-6`}>
      {/* Header with BuildScore */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-foreground flex items-center">
          <Trophy className="w-6 h-6 mr-2" style={{ color: tierInfo?.color }} />
          Your BuildScore
        </h3>
        <div className="text-right">
          <div className="text-3xl font-bold text-foreground">{currentScore}</div>
          <div className="text-sm text-muted-foreground">Points</div>
        </div>
      </div>

      {/* Current Tier Badge */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center text-xl"
            style={{ backgroundColor: `${tierInfo?.color}20` }}
          >
            {tierInfo?.icon}
          </div>
          <div>
            <div className="font-semibold text-foreground text-lg">{tierInfo?.name} Tier</div>
            <div className="text-sm text-muted-foreground">Range: {tierInfo?.range} points</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Total Orders</div>
          <div className="text-lg font-bold text-foreground">{orderStats?.orderCount || 0}</div>
        </div>
      </div>

      {/* Progress to Next Tier */}
      {nextTierInfo?.nextTier ? (
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                Progress to {nextTierInfo?.nextTier}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-muted/50 rounded-full h-3 relative overflow-hidden">
            <div 
              className="h-3 rounded-full transition-all duration-1000 ease-in-out"
              style={{ 
                width: `${progress}%`, 
                backgroundColor: nextTierInfo?.color || '#FFD700'
              }}
            />
          </div>
          
          {/* Orders Needed Text - As requested in requirements */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <ShoppingBag className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Orders to Next Tier</span>
            </div>
            <p className="text-foreground">
              Place <span className="font-bold text-primary">{ordersNeeded}</span> more orders to unlock{' '}
              <span className="font-bold" style={{ color: nextTierInfo?.color }}>
                {nextTierInfo?.nextTier}
              </span> tier.
            </p>
          </div>
        </div>
      ) : (
        /* Max Tier Reached */
        <div className="text-center py-4 mb-6">
          <div 
            className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl"
            style={{ backgroundColor: `${tierInfo?.color}20` }}
          >
            👑
          </div>
          <h4 className="text-lg font-semibold text-foreground mb-2">
            Maximum Tier Achieved!
          </h4>
          <p className="text-muted-foreground">
            You've reached the highest tier. Enjoy all premium benefits!
          </p>
        </div>
      )}

      {/* Tier Benefits */}
      <div className="border-t border-border pt-4">
        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
          <Star className="w-4 h-4 mr-1 text-success" />
          {tierInfo?.name} Tier Benefits
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {tierInfo?.benefits?.map((benefit, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Icon name="Check" size={14} className="text-success flex-shrink-0" />
              <span className="text-sm text-muted-foreground">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Refresh Button */}
      <div className="mt-6 pt-4 border-t border-border">
        <button
          onClick={fetchBuildScoreData}
          className="w-full px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors"
        >
          Refresh BuildScore
        </button>
      </div>
    </div>
  );
};

export default BuildScoreSection;