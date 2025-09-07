import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { CreditCard, TrendingUp, Award, ShoppingBag, CheckCircle, Info, ArrowRight, Star, Calendar, Building } from 'lucide-react';

const EnhancedBNPLCreditManagement = () => {
  const { user, profile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [creditData, setCreditData] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    if (user && profile) {
      fetchCreditData();
      fetchOrderHistory();
    }
  }, [user, profile]);

  const fetchCreditData = async () => {
    try {
      // Calculate credit eligibility based on user profile and order history
      const { data: orders } = await supabase?.from('orders')?.select('*')?.eq('user_id', user?.id)?.eq('status', 'Delivered');

      const totalOrderValue = orders?.reduce((sum, order) => sum + parseFloat(order?.total_amount || 0), 0) || 0;
      const orderCount = orders?.length || 0;

      // Credit scoring logic based on shop size and order history
      let creditLimit = 0;
      let tier = 'Bronze';
      let eligibilityScore = 0;

      if (profile?.shop_size === 'large') {
        creditLimit = totalOrderValue > 100000 ? 200000 : 150000;
        tier = totalOrderValue > 100000 ? 'Gold' : 'Silver';
        eligibilityScore = totalOrderValue > 100000 ? 95 : 85;
      } else if (profile?.shop_size === 'medium') {
        creditLimit = totalOrderValue > 50000 ? 100000 : 75000;
        tier = totalOrderValue > 50000 ? 'Silver' : 'Bronze';
        eligibilityScore = totalOrderValue > 50000 ? 75 : 65;
      } else {
        creditLimit = totalOrderValue > 5000 ? 50000 : 25000;
        tier = totalOrderValue > 5000 ? 'Silver' : 'Silver';
        eligibilityScore = totalOrderValue > 5000 ? 65 : 55;
      }

      setCreditData({
        creditLimit,
        tier,
        eligibilityScore,
        totalOrderValue,
        orderCount,
        availableCredit: creditLimit * 0.9, // 90% of limit available
        usedCredit: creditLimit * 0.1
      });
    } catch (error) {
      console.error('Error fetching credit data:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const fetchOrderHistory = async () => {
    try {
      const { data, error } = await supabase?.from('orders')?.select('*')?.eq('user_id', user?.id)?.order('created_at', { ascending: false })?.limit(10);

      if (error) throw error;
      setOrderHistory(data || []);
    } catch (error) {
      console.error('Error fetching order history:', error);
    }
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 'Gold': return 'text-yellow-600 bg-yellow-100';
      case 'Silver': return 'text-gray-600 bg-gray-100';
      default: return 'text-orange-600 bg-orange-100';
    }
  };

  const getTierIcon = (tier) => {
    switch (tier) {
      case 'Gold': return <Award className="w-5 h-5" />;
      case 'Silver': return <Star className="w-5 h-5" />;
      default: return <TrendingUp className="w-5 h-5" />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    })?.format(amount);
  };

  if (loading || isLoadingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-blue-600 font-medium">Loading credit data...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">Please log in to access your BNPL credit management.</p>
          <button
            onClick={() => window.location.href = '/enhanced-authentication'}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Building className="w-6 h-6 text-blue-600" />
                <span className="text-lg font-medium text-gray-900">{profile?.shop_name || 'Your Shop'}</span>
              </div>
              <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getTierColor(creditData?.tier)}`}>
                {getTierIcon(creditData?.tier)}
                <span>{creditData?.tier} Tier</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Credit Limit Card */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-medium text-blue-100">Credit Limit</h3>
                <div className="text-3xl font-bold">{formatCurrency(creditData?.creditLimit)}</div>
              </div>
              <CreditCard className="w-8 h-8 text-blue-200" />
            </div>
            <div className="flex items-center space-x-2 text-sm text-blue-100">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Available: {formatCurrency(creditData?.availableCredit)}</span>
            </div>
          </div>

          {/* Eligibility Score */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Eligibility Score</h3>
                <div className="text-3xl font-bold text-gray-900">{creditData?.eligibilityScore}/100</div>
              </div>
              <div className="w-16 h-16 relative">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-200"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    className={creditData?.eligibilityScore >= 80 ? 'text-green-500' : creditData?.eligibilityScore >= 60 ? 'text-yellow-500' : 'text-red-500'}
                    strokeDasharray={`${(creditData?.eligibilityScore / 100) * 175.84} 175.84`}
                  />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-500">Based on shop size and order history</p>
          </div>

          {/* Order History Summary */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Total Orders</h3>
                <div className="text-3xl font-bold text-gray-900">{formatCurrency(creditData?.totalOrderValue)}</div>
              </div>
              <ShoppingBag className="w-8 h-8 text-gray-400" />
            </div>
            <div className="text-sm text-gray-500">
              {creditData?.orderCount} completed orders
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
          <div className="flex border-b border-gray-200">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'history', label: 'Credit History', icon: Calendar },
              { id: 'upgrade', label: 'Tier Upgrade', icon: Award }
            ]?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 font-medium transition-colors ${
                  activeTab === tab?.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' :'text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab?.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Your BNPL Benefits</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700">0% interest on purchases</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700">Flexible payment terms</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700">Instant approval process</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700">Build business credit score</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Eligibility Factors</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Shop Size</span>
                        <span className="font-medium capitalize">{profile?.shop_size}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Order History</span>
                        <span className="font-medium">{formatCurrency(creditData?.totalOrderValue)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Payment Track</span>
                        <span className="font-medium text-green-600">Excellent</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-between">
                      <span className="font-medium">Apply for Credit</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button className="bg-white text-blue-600 border-2 border-blue-200 p-4 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-between">
                      <span className="font-medium">View Eligibility Details</span>
                      <Info className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">Order-Based Credit Assessment</h4>
                {orderHistory?.length > 0 ? (
                  <div className="space-y-3">
                    {orderHistory?.map((order) => (
                      <div key={order?.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            order?.status === 'Delivered' ? 'bg-green-500' : 'bg-yellow-500'
                          }`}></div>
                          <div>
                            <div className="font-medium">Order #{order?.id?.slice(0, 8)}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(order?.created_at)?.toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatCurrency(order?.total_amount)}</div>
                          <div className={`text-xs px-2 py-1 rounded-full ${
                            order?.status === 'Delivered' ?'bg-green-100 text-green-700' :'bg-yellow-100 text-yellow-700'
                          }`}>
                            {order?.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No order history available</p>
                  </div>
                )}
              </div>
            )}

            {/* Upgrade Tab */}
            {activeTab === 'upgrade' && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-900">Tier Advancement Requirements</h4>

                {creditData?.tier === 'Silver' && profile?.shop_size === 'small' && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <Award className="w-6 h-6 text-orange-600" />
                      <h5 className="font-semibold text-orange-800">Upgrade to Gold Tier</h5>
                    </div>
                    <div className="space-y-3">
                      <p className="text-orange-700">To unlock Gold tier benefits:</p>
                      <ul className="space-y-2 text-orange-700">
                        <li className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                          <span>Increase total order value to ₹50,000+</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                          <span>Maintain excellent payment track record</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                          <span>Complete at least 10 successful orders</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {creditData?.tier === 'Gold' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <Award className="w-6 h-6 text-green-600" />
                      <h5 className="font-semibold text-green-800">Congratulations! Gold Tier Member</h5>
                    </div>
                    <p className="text-green-700">
                      You have achieved our highest tier. Enjoy premium benefits including:
                    </p>
                    <ul className="mt-3 space-y-2 text-green-700">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Maximum credit limit of ₹2,00,000</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Priority customer support</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Extended payment terms</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedBNPLCreditManagement;
