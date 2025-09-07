import React from 'react';
import { CheckCircle, AlertCircle, Loader2, X } from 'lucide-react';

const StatusDisplay = ({ status, onClose }) => {
  const getStatusConfig = () => {
    switch (status?.type) {
      case 'success':
        return {
          icon: CheckCircle,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          iconColor: 'text-green-600',
          textColor: 'text-green-800'
        };
      case 'error':
        return {
          icon: AlertCircle,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          iconColor: 'text-red-600',
          textColor: 'text-red-800'
        };
      case 'loading':
        return {
          icon: Loader2,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          iconColor: 'text-blue-600',
          textColor: 'text-blue-800'
        };
      default:
        return {
          icon: AlertCircle,
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          iconColor: 'text-gray-600',
          textColor: 'text-gray-800'
        };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config?.icon;

  return (
    <div className={`p-4 rounded-lg border ${config?.bgColor} ${config?.borderColor}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StatusIcon 
            className={`w-5 h-5 ${config?.iconColor} ${status?.type === 'loading' ? 'animate-spin' : ''}`} 
          />
          <span className={`font-medium ${config?.textColor}`}>
            {status?.message}
          </span>
        </div>
        
        {status?.type !== 'loading' && onClose && (
          <button
            onClick={onClose}
            className={`p-1 rounded-full hover:bg-gray-200 transition-colors ${config?.iconColor}`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default StatusDisplay;