import React from 'react';
import { Search, Filter, SortAsc } from 'lucide-react';

const FilterControls = ({
  filters,
  onFiltersChange,
  totalCount,
  filteredCount
}) => {
  const handleFilterChange = (key, value) => {
    onFiltersChange?.(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const urgencyOptions = [
    { value: 'all', label: 'All Urgency Levels' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  const sortOptions = [
    { value: 'created_at', label: 'Recent First' },
    { value: 'urgency', label: 'Urgency Level' },
    { value: 'quantity', label: 'Suggested Quantity' },
    { value: 'product_name', label: 'Product Name' }
  ];

  return (
    <div className="bg-white border rounded-lg p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        {/* Left Side - Search and Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products or brands..."
              value={filters?.search || ''}
              onChange={(e) => handleFilterChange('search', e?.target?.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Urgency Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filters?.urgency || 'all'}
              onChange={(e) => handleFilterChange('urgency', e?.target?.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              {urgencyOptions?.map(option => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center space-x-2">
            <SortAsc className="w-4 h-4 text-gray-500" />
            <select
              value={filters?.sortBy || 'created_at'}
              onChange={(e) => handleFilterChange('sortBy', e?.target?.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              {sortOptions?.map(option => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Side - Results Count */}
        <div className="flex items-center text-sm text-gray-600">
          <span>
            Showing {filteredCount} of {totalCount} suggestions
          </span>
        </div>
      </div>
      {/* Active Filters Display */}
      {(filters?.search || filters?.urgency !== 'all') && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-600">Active filters:</span>
            
            {filters?.search && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                Search: "{filters?.search}"
                <button
                  onClick={() => handleFilterChange('search', '')}
                  className="ml-1 text-blue-500 hover:text-blue-700"
                >
                  ×
                </button>
              </span>
            )}
            
            {filters?.urgency !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                Urgency: {urgencyOptions?.find(opt => opt?.value === filters?.urgency)?.label}
                <button
                  onClick={() => handleFilterChange('urgency', 'all')}
                  className="ml-1 text-purple-500 hover:text-purple-700"
                >
                  ×
                </button>
              </span>
            )}
            
            {(filters?.search || filters?.urgency !== 'all') && (
              <button
                onClick={() => onFiltersChange?.({
                  search: '',
                  urgency: 'all',
                  category: 'all',
                  sortBy: 'created_at'
                })}
                className="text-xs text-gray-500 hover:text-gray-700 underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterControls;