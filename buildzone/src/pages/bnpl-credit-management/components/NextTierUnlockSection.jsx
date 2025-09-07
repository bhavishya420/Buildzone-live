import React, { useState, useEffect } from 'react';
import { Target, Star } from 'lucide-react';
import Icon from '../../../components/AppIcon';
import { useAuth } from '../../../contexts/AuthContext';
import { creditScoringService } from '../../../services/creditScoringService';

const NextTierUnlockSection = ({ currentScore, currentTier }) => {
  const { user } = useAuth();
  const [orderStats, setOrderStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderStats();
  }, [user]);

  const fetchOrderStats = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const result = await creditScoringService?.getUserOrderStats(user?.id);
      if (result?.data) {
        setOrderStats(result?.data);
      }
    } catch (error) {
      console.error('Error fetching order stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateNextTierInfo = () => {
    const score = currentScore || 0;
    
    if (score < 100) {
      return {
        nextTier: 'Gold',
        targetScore: 100,
        icon: '🥇',
        color: '#FFD700'
      };
    } else if (score < 250) {
      return {
        nextTier: 'Platinum', 
        targetScore: 250,
        icon: '💎',
        color: '#E5E4E2'
      };
    } else {
      return {
        nextTier: null,
        targetScore: null,
        icon: '👑',
        color: '#E5E4E2',
        message: 'Already at Max Tier'
      };
    }
  };

  const calculateOrdersNeeded = () => {
    const nextTierInfo = calculateNextTierInfo();
    const currentOrderCount = orderStats?.orderCount || 0;
    
    if (!nextTierInfo?.nextTier) {
      return 0;
    }

    // Simple calculation: Each order contributes roughly 10 points to score
    // This is a simplified calculation - in reality it depends on order value, history, etc.
    const pointsNeeded = nextTierInfo?.targetScore - currentScore;
    const ordersNeeded = Math.max(0, Math.ceil(pointsNeeded / 10));
    
    return ordersNeeded;
  };

  const calculateProgress = () => {
    const nextTierInfo = calculateNextTierInfo();
    if (!nextTierInfo?.targetScore) return 100;
    
    const score = currentScore || 0;
    let baseScore = 0;
    
    // Calculate base score for current tier
    if (nextTierInfo?.nextTier === 'Gold') {
      baseScore = 0;
    } else if (nextTierInfo?.nextTier === 'Platinum') {
      baseScore = 100;
    }
    
    const progress = ((score - baseScore) / (nextTierInfo?.targetScore - baseScore)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  if (loading) {
    return (
      <div className="bg-surface border border-border rounded-xl p-6 animate-pulse">
        <div className="h-6 bg-muted rounded w-48 mb-4"></div>
        <div className="h-4 bg-muted rounded w-64 mb-4"></div>
        <div className="h-2 bg-muted rounded w-full"></div>
      </div>
    );
  }

  const nextTierInfo = calculateNextTierInfo();
  const ordersNeeded = calculateOrdersNeeded();
  const progress = calculateProgress();

  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
        <Target className="w-5 h-5 mr-2 text-primary" />
        Next Tier Unlock
      </h3>

      {nextTierInfo?.nextTier ? (
        <>
          {/* Next Tier Info */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                style={{ backgroundColor: `${nextTierInfo?.color}20` }}
              >
                {nextTierInfo?.icon}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Next Tier</p>
                <p className="font-semibold text-foreground">{nextTierInfo?.nextTier}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Target Score</p>
              <p className="font-semibold text-foreground">{nextTierInfo?.targetScore}</p>
            </div>
          </div>

          {/* Orders Needed Text */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="ShoppingBag" size={16} className="text-primary" />
              <span className="text-sm font-medium text-primary">Orders to Next Tier</span>
            </div>
            <p className="text-foreground">
              Place <span className="font-bold text-primary">{ordersNeeded}</span> more orders to unlock{' '}
              <span className="font-bold" style={{ color: nextTierInfo?.color }}>
                {nextTierInfo?.nextTier}
              </span> tier.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress to {nextTierInfo?.nextTier}</span>
              <span className="text-foreground font-medium">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3 relative overflow-hidden">
              <div 
                className="h-3 rounded-full transition-all duration-1000 ease-in-out relative"
                style={{ 
                  width: `${progress}%`, 
                  backgroundColor: nextTierInfo?.color || '#FFD700'
                }}
              >
                {/* Shine effect */}
                <div 
                  className="absolute inset-0 bg-white/20 rounded-full transform -skew-x-12 animate-pulse"
                  style={{ width: '30%', left: `${Math.min(progress - 15, 70)}%` }}
                ></div>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
              <span>{currentTier}</span>
              <span>{nextTierInfo?.nextTier}</span>
            </div>
          </div>

          {/* Current Stats */}
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
            <div className="text-center">
              <div className="text-lg font-bold text-foreground">{orderStats?.orderCount || 0}</div>
              <div className="text-xs text-muted-foreground">Total Orders</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-foreground">{currentScore || 0}</div>
              <div className="text-xs text-muted-foreground">Current Score</div>
            </div>
          </div>
        </>
      ) : (
        /* Max Tier Reached */
        <div className="text-center py-6">
          <div 
            className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl"
            style={{ backgroundColor: `${nextTierInfo?.color}20` }}
          >
            {nextTierInfo?.icon}
          </div>
          <h4 className="text-lg font-semibold text-foreground mb-2">
            Congratulations!
          </h4>
          <p className="text-muted-foreground mb-4">
            You've reached the maximum tier. Enjoy all premium benefits!
          </p>
          <div className="bg-success/10 border border-success/20 rounded-lg p-3">
            <div className="flex items-center justify-center space-x-2 text-success">
              <Star className="w-4 h-4" />
              <span className="text-sm font-medium">Already at Max Tier</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NextTierUnlockSection;