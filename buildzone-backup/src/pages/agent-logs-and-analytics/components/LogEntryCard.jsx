import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Activity, AlertTriangle, CheckCircle, Info, Clock, Edit, Package } from 'lucide-react';

const LogEntryCard = ({ log }) => {
  const [expanded, setExpanded] = useState(false);

  const getEventIcon = (eventType) => {
    switch (eventType) {
      case 'execution_completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'execution_error':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'suggestion_created':
        return <Info className="h-5 w-5 text-blue-600" />;
      case 'suggestion_confirmed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'suggestion_dismissed':
        return <Activity className="h-5 w-5 text-gray-600" />;
      case 'draft_order_created':
        return <Edit className="h-5 w-5 text-orange-600" />;
      case 'draft_order_confirmed':
        return <Package className="h-5 w-5 text-green-600" />;
      default:
        return <Activity className="h-5 w-5 text-gray-600" />;
    }
  };

  const getEventColor = (eventType) => {
    switch (eventType) {
      case 'execution_completed':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'execution_error':
        return 'bg-red-50 text-red-800 border-red-200';
      case 'suggestion_created':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'suggestion_confirmed':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'suggestion_dismissed':
        return 'bg-gray-50 text-gray-800 border-gray-200';
      case 'draft_order_created':
        return 'bg-orange-50 text-orange-800 border-orange-200';
      case 'draft_order_confirmed':
        return 'bg-green-50 text-green-800 border-green-200';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    
    return date?.toLocaleDateString();
  };

  const formatPayload = (payload) => {
    if (!payload) return 'No additional data';
    
    // Handle draft order created events
    if (payload?.user_id && payload?.product_id && payload?.suggested_qty && payload?.order_id) {
      return (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">User ID:</span> <code className="text-xs bg-gray-100 px-1 rounded">{payload?.user_id?.slice(-8)}</code>
            </div>
            <div>
              <span className="font-medium">Product ID:</span> <code className="text-xs bg-gray-100 px-1 rounded">{payload?.product_id?.slice(-8)}</code>
            </div>
            <div>
              <span className="font-medium">Suggested Qty:</span> {payload?.suggested_qty}
            </div>
            <div>
              <span className="font-medium">Order ID:</span> <code className="text-xs bg-gray-100 px-1 rounded">{payload?.order_id?.slice(-8)}</code>
            </div>
          </div>
          {payload?.current_stock !== undefined && (
            <div className="mt-3 p-3 bg-gray-50 rounded border">
              <div className="font-medium text-sm text-gray-700 mb-2">Stock Analysis:</div>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                <div>Current Stock: {payload?.current_stock}</div>
                <div>Projected Need: {payload?.projected_need}</div>
              </div>
            </div>
          )}
        </div>
      );
    }

    // Handle draft order confirmed events
    if (payload?.order_id && payload?.suggestion_id && payload?.total_amount) {
      return (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Order ID:</span> <code className="text-xs bg-gray-100 px-1 rounded">{payload?.order_id?.slice(-8)}</code>
            </div>
            <div>
              <span className="font-medium">Suggestion ID:</span> <code className="text-xs bg-gray-100 px-1 rounded">{payload?.suggestion_id?.slice(-8)}</code>
            </div>
            <div>
              <span className="font-medium">Total Amount:</span> ₹{payload?.total_amount?.toLocaleString()}
            </div>
            <div>
              <span className="font-medium">User ID:</span> <code className="text-xs bg-gray-100 px-1 rounded">{payload?.user_id?.slice(-8)}</code>
            </div>
          </div>
        </div>
      );
    }
    
    // Handle common payload formats
    if (payload?.error_message) {
      return (
        <div className="space-y-2">
          <div className="text-red-600 font-medium">Error: {payload?.error_message}</div>
          {payload?.error_detail && (
            <div className="text-sm text-gray-600">Detail: {payload?.error_detail}</div>
          )}
        </div>
      );
    }
    
    if (payload?.users_processed !== undefined && payload?.suggestions_created !== undefined) {
      return (
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">Users Processed:</span> {payload?.users_processed}
            </div>
            <div>
              <span className="font-medium">Suggestions Created:</span> {payload?.suggestions_created}
            </div>
            {payload?.draft_orders_created !== undefined && (
              <div>
                <span className="font-medium">Draft Orders:</span> {payload?.draft_orders_created}
              </div>
            )}
          </div>
          {payload?.parameters && (
            <div className="mt-3 p-3 bg-gray-50 rounded border">
              <div className="font-medium text-sm text-gray-700 mb-2">Parameters:</div>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                <div>Lookback: {payload?.parameters?.lookback_days}d</div>
                <div>Lead Time: {payload?.parameters?.default_lead_time}d</div>
                <div>Safety Factor: {payload?.parameters?.safety_factor}</div>
                <div>Buffer: {payload?.parameters?.reorder_buffer}</div>
              </div>
            </div>
          )}
        </div>
      );
    }
    
    if (payload?.avg_daily !== undefined) {
      return (
        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium">Avg Daily Sales:</span> {payload?.avg_daily}
            </div>
            <div>
              <span className="font-medium">Current Stock:</span> {payload?.current_stock}
            </div>
            <div>
              <span className="font-medium">Projected Need:</span> {payload?.projected_need}
            </div>
            <div>
              <span className="font-medium">Suggested Qty:</span> {payload?.suggested_qty}
            </div>
          </div>
        </div>
      );
    }
    
    // Default JSON display for complex payloads
    return (
      <pre className="text-xs bg-gray-50 p-3 rounded border overflow-auto">
        {JSON.stringify(payload, null, 2)}
      </pre>
    );
  };

  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getEventIcon(log?.event_type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="font-medium text-gray-900">
                {log?.agent_name}
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getEventColor(log?.event_type)}`}>
                {log?.event_type?.replace(/_/g, ' ')}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              {formatTimestamp(log?.created_at)}
            </div>
          </div>
          
          {log?.payload && (
            <div className="mt-2">
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                {expanded ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    Hide details
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    Show details
                  </>
                )}
              </button>
              
              {expanded && (
                <div className="mt-3 pl-4 border-l-2 border-gray-200">
                  {formatPayload(log?.payload)}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogEntryCard;