import React, { useState } from 'react';
import { CheckCircle, XCircle, Package, TrendingUp, Clock, AlertTriangle } from 'lucide-react';

const SuggestedOrderCard = ({
  suggestion,
  urgencyLevel,
  isSelected,
  onSelectionChange,
  onConfirm,
  onDismiss
}) => {
  const [confirming, setConfirming] = useState(false);
  const [dismissing, setDismissing] = useState(false);

  const handleConfirm = async () => {
    try {
      setConfirming(true);
      await onConfirm?.();
    } catch (err) {
      console.error('Error confirming suggestion:', err);
    } finally {
      setConfirming(false);
    }
  };

  const handleDismiss = async () => {
    try {
      setDismissing(true);
      await onDismiss?.();
    } catch (err) {
      console.error('Error dismissing suggestion:', err);
    } finally {
      setDismissing(false);
    }
  };

  const getUrgencyColor = (level) => {
    switch (level) {
      case 'high':
        return 'border-red-300 bg-red-50';
      case 'medium':
        return 'border-yellow-300 bg-yellow-50';
      case 'low':
        return 'border-green-300 bg-green-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  const getUrgencyTextColor = (level) => {
    switch (level) {
      case 'high':
        return 'text-red-700';
      case 'medium':
        return 'text-yellow-700';
      case 'low':
        return 'text-green-700';
      default:
        return 'text-gray-700';
    }
  };

  const getUrgencyIcon = (level) => {
    switch (level) {
      case 'high':
        return AlertTriangle;
      case 'medium':
        return Clock;
      case 'low':
        return TrendingUp;
      default:
        return Package;
    }
  };

  const UrgencyIcon = getUrgencyIcon(urgencyLevel);
  const estimatedValue = (suggestion?.suggested_qty || 0) * (suggestion?.product?.price || 0);
  const currentStock = suggestion?.inventory_qty || 0;

  return (
    <div className={`bg-white border-2 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ${
      isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
    }`}>
      {/* Header with checkbox and urgency */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelectionChange?.(e?.target?.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm font-medium text-gray-900">
              Select
            </span>
          </label>
          
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            getUrgencyColor(urgencyLevel)
          } ${getUrgencyTextColor(urgencyLevel)}`}>
            <UrgencyIcon className="w-3 h-3 mr-1" />
            {urgencyLevel?.toUpperCase()} PRIORITY
          </div>
        </div>
      </div>
      {/* Product Info */}
      <div className="p-4">
        <div className="flex items-start space-x-3">
          {/* Product Image */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              {suggestion?.product?.image_url ? (
                <img
                  src={suggestion?.product?.image_url}
                  alt={suggestion?.product?.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : (
                <Package className="w-8 h-8 text-gray-400" />
              )}
              <div className="w-full h-full hidden items-center justify-center">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 truncate">
              {suggestion?.product?.name || 'Product Name'}
            </h3>
            <p className="text-xs text-gray-600 truncate">
              {suggestion?.product?.brand || 'Brand'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              ₹{(suggestion?.product?.price || 0)?.toLocaleString()} per unit
            </p>
          </div>
        </div>

        {/* Stock & Suggestion Info */}
        <div className="mt-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Current Stock:</span>
            <span className={`text-sm font-medium ${
              currentStock <= 5 ? 'text-red-600' : 'text-gray-900'
            }`}>
              {currentStock} units
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Suggested Quantity:</span>
            <span className="text-sm font-medium text-blue-600">
              {suggestion?.suggested_qty || 0} units
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Estimated Value:</span>
            <span className="text-sm font-medium text-green-600">
              ₹{estimatedValue?.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Reasoning */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-xs font-medium text-gray-700 mb-1">AI Reasoning:</h4>
          <p className="text-xs text-gray-600 line-clamp-3">
            {suggestion?.reason || 'Based on sales analysis and inventory levels.'}
          </p>
        </div>

        {/* Metadata */}
        <div className="mt-3 flex items-center text-xs text-gray-500">
          <Clock className="w-3 h-3 mr-1" />
          {suggestion?.created_at ? new Date(suggestion.created_at)?.toLocaleDateString() : 'Recently'}
          <span className="mx-2">•</span>
          Lead Time: {suggestion?.lead_time_days || 7} days
        </div>
      </div>
      {/* Action Buttons */}
      <div className="p-4 border-t border-gray-100 flex space-x-2">
        <button
          onClick={handleConfirm}
          disabled={confirming || dismissing}
          className={`flex-1 flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
            confirming
              ? 'bg-gray-400 cursor-not-allowed' :'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
          } transition-colors duration-200`}
        >
          <CheckCircle className={`w-4 h-4 mr-1 ${confirming ? 'animate-spin' : ''}`} />
          {confirming ? 'Confirming...' : 'Confirm Order'}
        </button>
        
        <button
          onClick={handleDismiss}
          disabled={confirming || dismissing}
          className={`flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 ${
            dismissing
              ? 'bg-gray-100 cursor-not-allowed' :'bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
          } transition-colors duration-200`}
        >
          <XCircle className={`w-4 h-4 mr-1 ${dismissing ? 'animate-spin' : ''}`} />
          {dismissing ? 'Dismissing...' : 'Dismiss'}
        </button>
      </div>
    </div>
  );
};

export default SuggestedOrderCard;