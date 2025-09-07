import React from 'react';
import { Package } from 'lucide-react';

const LoadingState = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
          <Package className="w-8 h-8 text-blue-600 animate-pulse" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Loading Suggestions
        </h2>
        <p className="text-gray-600 mb-4">
          Fetching your AI-powered reorder recommendations...
        </p>
        <div className="flex space-x-2 justify-center">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;