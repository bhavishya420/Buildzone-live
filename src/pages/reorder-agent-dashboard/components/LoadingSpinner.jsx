import React from 'react';
import { RefreshCw } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <RefreshCw className="w-8 h-8 text-blue-600 mx-auto mb-4 animate-spin" />
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Loading Reorder Agent Dashboard
        </h2>
        <p className="text-gray-600">
          Fetching agent data and performance metrics...
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;