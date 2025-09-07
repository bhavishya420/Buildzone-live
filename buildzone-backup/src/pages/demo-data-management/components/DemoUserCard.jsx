import React from 'react';
import { Store, ShoppingBag, TrendingUp, Award } from 'lucide-react';

const DemoUserCard = ({ user }) => {
  const getTierInfo = () => {
    const totalValue = user?.totalValue || 0;
    if (totalValue >= 50000) {
      return {
        tier: 'Gold',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        eligibility: 'High',
        description: 'Premium credit tier with high spending history'
      };
    } else if (totalValue >= 10000) {
      return {
        tier: 'Silver',
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        eligibility: 'Medium',
        description: 'Standard credit tier with moderate spending'
      };
    } else {
      return {
        tier: 'Bronze',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        eligibility: 'Low',
        description: 'Basic credit tier for new customers'
      };
    }
  };

  const tierInfo = getTierInfo();

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">{user?.name}</h3>
          <p className="text-sm text-gray-600">{user?.email}</p>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${tierInfo?.bgColor} ${tierInfo?.color} ${tierInfo?.borderColor} border`}>
          <Award className="w-3 h-3 inline mr-1" />
          {tierInfo?.tier} Tier
        </div>
      </div>

      {/* Shop Info */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Store className="w-4 h-4 text-gray-600" />
          <span className="font-medium text-gray-900">{user?.shop_name}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Shop Size:</span>
          <span className={`capitalize px-2 py-1 rounded text-xs font-medium ${
            user?.shop_size === 'large' ? 'bg-green-100 text-green-800' :
            user?.shop_size === 'medium'? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
          }`}>
            {user?.shop_size}
          </span>
        </div>
      </div>

      {/* Order Statistics */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <ShoppingBag className="w-4 h-4 mx-auto mb-1 text-blue-600" />
          <div className="text-lg font-bold text-blue-900">{user?.orderCount || 0}</div>
          <div className="text-xs text-blue-700">Orders</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <TrendingUp className="w-4 h-4 mx-auto mb-1 text-green-600" />
          <div className="text-lg font-bold text-green-900">
            ₹{user?.totalValue?.toLocaleString('en-IN') || '0'}
          </div>
          <div className="text-xs text-green-700">Total Value</div>
        </div>
      </div>

      {/* Credit Profile */}
      <div className="border-t pt-3">
        <h4 className="text-sm font-medium text-gray-900 mb-2">BNPL Credit Profile</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Eligibility Score:</span>
            <span className={`font-medium ${
              tierInfo?.eligibility === 'High' ? 'text-green-600' :
              tierInfo?.eligibility === 'Medium'? 'text-blue-600' : 'text-orange-600'
            }`}>
              {tierInfo?.eligibility}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            {tierInfo?.description}
          </div>
        </div>
      </div>

      {/* Login Credentials */}
      <div className="mt-3 pt-3 border-t bg-yellow-50 rounded p-2">
        <div className="text-xs font-medium text-yellow-800 mb-1">Test Login Credentials:</div>
        <div className="text-xs text-yellow-700">
          Email: {user?.email} | Password: demo123
        </div>
      </div>
    </div>
  );
};

export default DemoUserCard;