import React from 'react';
import { Package, Filter, Sparkles } from 'lucide-react';

const EmptyState = ({ hasData }) => {
  if (hasData) {
    // Has data but filtered out
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <Filter className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No suggestions match your filters
        </h3>
        <p className="text-gray-600 mb-4 max-w-md mx-auto">
          Try adjusting your search terms or filter criteria to see more suggestions.
        </p>
        <div className="space-y-2 text-sm text-gray-500">
          <p>• Try searching with different keywords</p>
          <p>• Check different urgency levels</p>
          <p>• Clear active filters to see all suggestions</p>
        </div>
      </div>
    );
  }

  // No data at all
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
        <Sparkles className="w-8 h-8 text-blue-500" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No reorder suggestions yet
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Our AI agent analyzes your sales patterns to create smart reorder suggestions. 
        Run the reorder agent to get started!
      </p>
      
      <div className="bg-gray-50 border rounded-lg p-6 max-w-md mx-auto">
        <div className="flex items-start space-x-3">
          <Package className="w-5 h-5 text-blue-500 mt-1" />
          <div className="text-left">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              How to get suggestions:
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>1. Ensure you have inventory data</li>
              <li>2. Have some order history for analysis</li>
              <li>3. Run the reorder agent from the dashboard</li>
              <li>4. Review AI-generated suggestions here</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <a
          href="/reorder-agent-dashboard"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Go to Agent Dashboard
        </a>
      </div>
    </div>
  );
};

export default EmptyState;