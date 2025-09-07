import React, { useState, useEffect } from 'react';
import { TrendingUp, Percent, Gift } from 'lucide-react';
import Icon from '../../../components/AppIcon';
import { useAuth } from '../../../contexts/AuthContext';
import { creditScoringService } from '../../../services/creditScoringService';
import NextTierUnlockSection from './NextTierUnlockSection';

const CreditScoreSection = () => {
  const { user } = useAuth();
  const [creditData, setCreditData] = useState(null);
  const [loyaltyData, setLoyaltyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCreditData();
  }, [user]);

  const fetchCreditData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      // Calculate credit eligibility
      const creditResult = await creditScoringService?.calculateCreditEligibility(user?.id);
      if (creditResult?.error) {
        throw new Error(creditResult?.error);
      }

      // Fetch loyalty points
      const loyaltyResult = await creditScoringService?.getLoyaltyPoints(user?.id);
      
      setCreditData(creditResult?.data);
      setLoyaltyData(loyaltyResult?.data);
    } catch (err) {
      console.error('Error fetching credit data:', err);
      setError(err?.message || 'Failed to fetch credit information');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount || 0);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreBackground = (score) => {
    if (score >= 80) return 'from-success/20 to-success/5';
    if (score >= 60) return 'from-warning/20 to-warning/5';
    return 'from-destructive/20 to-destructive/5';
  };

  const getTierInfo = () => {
    const tierConfig = creditScoringService?.getTierInfo();
    const currentTier = creditData?.tier || loyaltyData?.tier || 'Silver';
    return tierConfig?.[currentTier] || tierConfig?.Silver;
  };

  const calculateProgress = () => {
    const score = creditData?.score || creditData?.credit_score || loyaltyData?.buildscore || 0;
    const tier = creditData?.tier || loyaltyData?.tier || 'Silver';
    return creditScoringService?.calculateTierProgress(score, tier);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Credit Score Skeleton */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-muted rounded w-32 animate-pulse"></div>
            <div className="h-8 bg-muted rounded w-16 animate-pulse"></div>
          </div>
          <div className="h-24 bg-muted rounded animate-pulse mb-4"></div>
          <div className="h-4 bg-muted rounded w-48 animate-pulse"></div>
        </div>
        
        {/* Available Limit Skeleton */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <div className="h-6 bg-muted rounded w-32 animate-pulse mb-4"></div>
          <div className="h-8 bg-muted rounded w-48 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6">
        <div className="flex items-center space-x-2 text-destructive mb-2">
          <Icon name="AlertTriangle" size={20} />
          <span className="font-medium">Unable to load credit information</span>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <button
          onClick={fetchCreditData}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const currentScore = creditData?.score || creditData?.credit_score || loyaltyData?.buildscore || 0;
  const currentLimit = creditData?.limit || creditData?.credit_limit || 0;
  const currentTier = creditData?.tier || loyaltyData?.tier || 'Silver';
  const currentOffer = creditData?.offer || '45 days interest-free';
  const buildScore = creditData?.buildscore || loyaltyData?.buildscore || currentScore;
  const tierInfo = getTierInfo();
  const progress = calculateProgress();

  return (
    <div className="space-y-6">
      {/* Credit Score Card - Enhanced with exact user requirements */}
      <div className={`bg-gradient-to-br ${getScoreBackground(currentScore)} border border-border rounded-xl p-6`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-primary" />
            Eligibility Score
          </h3>
          <span className={`text-2xl font-bold ${getScoreColor(currentScore)}`}>
            {currentScore}/100
          </span>
        </div>

        {/* Circular Progress Bar - As requested in requirements */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 -rotate-90" viewBox="0 0 128 128">
              {/* Background circle */}
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-muted/20"
              />
              {/* Progress circle */}
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className={getScoreColor(currentScore)}
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - currentScore / 100)}`}
                strokeLinecap="round"
                style={{
                  transition: 'stroke-dashoffset 1s ease-in-out'
                }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-xl font-bold ${getScoreColor(currentScore)}`}>
                  {currentScore}
                </div>
                <div className="text-xs text-muted-foreground">Score</div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Based on your order history and business profile
          </p>
        </div>
      </div>

      {/* Credit Limit Card - As requested in requirements */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="CreditCard" size={20} className="mr-2 text-primary" />
          Credit Limit
        </h3>
        <div className="text-3xl font-bold text-primary mb-2">
          {formatCurrency(currentLimit)}
        </div>
        <p className="text-sm text-muted-foreground">
          Maximum credit limit available to you
        </p>
      </div>

      {/* Offer Text Card - As requested in requirements */}
      <div className="bg-gradient-to-r from-success/10 to-success/5 border border-success/20 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <Gift className="w-6 h-6 text-success" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Special Offer
            </h3>
            <div className="flex items-center space-x-2 mb-2">
              <Percent className="w-4 h-4 text-success" />
              <span className="text-xl font-bold text-success">{currentOffer}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Enjoy {currentOffer} credit on all your purchases. Start building your credit today!
            </p>
          </div>
        </div>
      </div>

      {/* BuildScore section - As requested in requirements */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center">
            {tierInfo?.icon} Your BuildScore
          </h3>
          <span className="text-2xl font-bold text-primary">
            {buildScore}
          </span>
        </div>

        <div className="text-center mb-4">
          <p className="text-foreground">
            Your BuildScore: <span className="font-bold text-primary">{buildScore}</span> (Current Tier: <span className="font-bold" style={{ color: tierInfo?.color }}>{currentTier}</span>)
          </p>
        </div>

        {/* Progress Bar toward Next Tier */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Progress to next tier</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-1000 ease-in-out"
              style={{ 
                width: `${progress}%`, 
                backgroundColor: tierInfo?.color 
              }}
            />
          </div>
        </div>

        {/* Next Tier Unlock Text - As requested in requirements */}
        {creditScoringService?.getNextTierInfo(buildScore)?.nextTier && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Next Tier Unlock</span>
            </div>
            <p className="text-foreground">
              Place <span className="font-bold text-primary">
                {creditScoringService?.calculateOrdersNeeded(buildScore, { orderCount: creditData?.order_count || 0 })}
              </span> more orders to unlock{' '}
              <span className="font-bold" style={{ color: creditScoringService?.getNextTierInfo(buildScore)?.color }}>
                {creditScoringService?.getNextTierInfo(buildScore)?.nextTier}
              </span> tier.
            </p>
          </div>
        )}

        {/* Current Tier Benefits */}
        <div className="space-y-2 mt-4">
          <p className="text-sm font-medium text-foreground">Current Tier Benefits:</p>
          {tierInfo?.benefits?.map((benefit, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Icon name="Check" size={16} className="text-success flex-shrink-0" />
              <span className="text-sm text-muted-foreground">{benefit}</span>
            </div>
          )) ?? null}
        </div>
      </div>

      {/* Next Tier Unlock Section - NEW ADDITION */}
      <NextTierUnlockSection 
        currentScore={currentScore}
        currentTier={currentTier}
      />

      {/* Refresh Button */}
      <button
        onClick={fetchCreditData}
        className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
      >
        Refresh Credit Information
      </button>
    </div>
  );
};

export default CreditScoreSection;