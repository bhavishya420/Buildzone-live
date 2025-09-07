import React from 'react';
import { Search, Filter, RefreshCw } from 'lucide-react';

const FilterControls = ({ filters, onFiltersChange, onRefresh }) => {
  const handleFilterChange = (key, value) => {
    onFiltersChange(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const dateRangeOptions = [
    { value: '1d', label: 'Last 24 hours' },
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: 'all', label: 'All time' }
  ];

  const eventTypeOptions = [
    { value: 'all', label: 'All Events' },
    { value: 'execution_completed', label: 'Executions' },
    { value: 'execution_error', label: 'Errors' },
    { value: 'suggestion_created', label: 'Suggestions Created' },
    { value: 'suggestion_confirmed', label: 'Suggestions Confirmed' },
    { value: 'suggestion_dismissed', label: 'Suggestions Dismissed' }
  ];

  const agentNameOptions = [
    { value: 'all', label: 'All Agents' },
    { value: 'Reorder Agent', label: 'Reorder Agent' },
    { value: 'System', label: 'System' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-gray-500" />
        <h3 className="text-lg font-medium text-gray-900">Filters</h3>
      </div>
      <div className="space-y-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search events, agents..."
              value={filters?.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e?.target?.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Range
          </label>
          <select
            value={filters?.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e?.target?.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            {dateRangeOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>
        </div>

        {/* Event Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Type
          </label>
          <select
            value={filters?.eventType}
            onChange={(e) => handleFilterChange('eventType', e?.target?.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            {eventTypeOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>
        </div>

        {/* Agent Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Agent Name
          </label>
          <select
            value={filters?.agentName}
            onChange={(e) => handleFilterChange('agentName', e?.target?.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            {agentNameOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>
        </div>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>
      {/* System Status */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-2">System Status</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Agent Status</span>
            <span className="inline-flex items-center gap-1 text-green-600">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              Online
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Last Execution</span>
            <span className="text-gray-500">2 minutes ago</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Next Scheduled</span>
            <span className="text-gray-500">22 hours</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;