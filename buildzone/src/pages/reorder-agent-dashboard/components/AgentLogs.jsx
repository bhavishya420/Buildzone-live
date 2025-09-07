import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Clock, CheckCircle, AlertCircle, PlayCircle, XCircle } from 'lucide-react';
import Icon from '../../../components/AppIcon';


const AgentLogs = ({ logs }) => {
  const [expandedLogs, setExpandedLogs] = useState(new Set());
  const [filter, setFilter] = useState('all');

  const toggleLogExpansion = (logId) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded?.has(logId)) {
      newExpanded?.delete(logId);
    } else {
      newExpanded?.add(logId);
    }
    setExpandedLogs(newExpanded);
  };

  const getEventIcon = (eventType) => {
    const iconMap = {
      'agent_start': PlayCircle,
      'agent_complete': CheckCircle,
      'agent_error': AlertCircle,
      'suggestion_created': Clock,
      'suggestion_confirmed': CheckCircle,
      'suggestion_dismissed': XCircle
    };
    return iconMap?.[eventType] || Clock;
  };

  const getEventColor = (eventType) => {
    const colorMap = {
      'agent_start': 'text-blue-600 bg-blue-50 border-blue-200',
      'agent_complete': 'text-green-600 bg-green-50 border-green-200',
      'agent_error': 'text-red-600 bg-red-50 border-red-200',
      'suggestion_created': 'text-yellow-600 bg-yellow-50 border-yellow-200',
      'suggestion_confirmed': 'text-green-600 bg-green-50 border-green-200',
      'suggestion_dismissed': 'text-gray-600 bg-gray-50 border-gray-200'
    };
    return colorMap?.[eventType] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getEventTitle = (eventType) => {
    const titleMap = {
      'agent_start': 'Agent Started',
      'agent_complete': 'Agent Completed',
      'agent_error': 'Agent Error',
      'suggestion_created': 'Suggestion Created',
      'suggestion_confirmed': 'Suggestion Confirmed',
      'suggestion_dismissed': 'Suggestion Dismissed'
    };
    return titleMap?.[eventType] || eventType;
  };

  const filteredLogs = logs?.filter(log => {
    if (filter === 'all') return true;
    return log?.event_type === filter;
  }) || [];

  const eventTypes = [
    { value: 'all', label: 'All Events' },
    { value: 'agent_start', label: 'Agent Starts' },
    { value: 'agent_complete', label: 'Agent Completions' },
    { value: 'suggestion_created', label: 'Suggestions Created' },
    { value: 'suggestion_confirmed', label: 'Suggestions Confirmed' },
    { value: 'suggestion_dismissed', label: 'Suggestions Dismissed' },
    { value: 'agent_error', label: 'Errors' }
  ];

  const formatPayload = (payload) => {
    if (!payload) return 'No details available';
    
    try {
      const data = typeof payload === 'string' ? JSON.parse(payload) : payload;
      
      // Format different payload types
      if (data?.error_message) {
        return `Error: ${data?.error_message}`;
      }
      
      if (data?.processed_users && data?.suggestions_created !== undefined) {
        return `Processed ${data?.processed_users} users, created ${data?.suggestions_created} suggestions`;
      }
      
      if (data?.product_name && data?.suggested_qty) {
        return `${data?.product_name}: Suggested ${data?.suggested_qty} units (Current: ${data?.current_stock}, Avg Daily: ${data?.avg_daily})`;
      }
      
      return JSON.stringify(data, null, 2);
    } catch (err) {
      return 'Invalid payload format';
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h4 className="text-lg font-semibold text-gray-900">Agent Activity Logs</h4>
        <div className="mt-2 sm:mt-0">
          <select
            value={filter}
            onChange={(e) => setFilter(e?.target?.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            {eventTypes?.map(type => (
              <option key={type?.value} value={type?.value}>
                {type?.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Logs List */}
      <div className="space-y-2">
        {filteredLogs?.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No logs found for the selected filter</p>
          </div>
        ) : (
          filteredLogs?.map((log) => {
            const Icon = getEventIcon(log?.event_type);
            const isExpanded = expandedLogs?.has(log?.id);
            const colorClasses = getEventColor(log?.event_type);
            
            return (
              <div key={log?.id} className={`border rounded-lg ${colorClasses}`}>
                <div
                  onClick={() => toggleLogExpansion(log?.id)}
                  className="flex items-center justify-between p-4 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5" />
                    <div className="flex-1">
                      <h5 className="font-medium">
                        {getEventTitle(log?.event_type)}
                      </h5>
                      <p className="text-sm opacity-75">
                        {new Date(log?.created_at)?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs px-2 py-1 bg-white bg-opacity-50 rounded">
                      {log?.agent_name}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </div>
                </div>
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-opacity-20">
                    <div className="mt-3">
                      <h6 className="text-sm font-medium mb-2">Event Details:</h6>
                      <div className="bg-white bg-opacity-50 rounded p-3 text-sm font-mono">
                        <pre className="whitespace-pre-wrap">
                          {formatPayload(log?.payload)}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      {/* Summary Stats */}
      {filteredLogs?.length > 0 && (
        <div className="bg-gray-50 border rounded-lg p-4">
          <h5 className="text-sm font-medium text-gray-900 mb-2">
            Activity Summary
          </h5>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Total Events</p>
              <p className="font-semibold">{filteredLogs?.length}</p>
            </div>
            <div>
              <p className="text-gray-600">Agent Runs</p>
              <p className="font-semibold">
                {filteredLogs?.filter(log => log?.event_type === 'agent_complete')?.length || 0}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Suggestions</p>
              <p className="font-semibold">
                {filteredLogs?.filter(log => log?.event_type === 'suggestion_created')?.length || 0}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Errors</p>
              <p className="font-semibold text-red-600">
                {filteredLogs?.filter(log => log?.event_type === 'agent_error')?.length || 0}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentLogs;