import React from 'react';
import { TrendingUp, Clock, CheckCircle, Target } from 'lucide-react';
import Icon from '../../../components/AppIcon';


const AgentMetrics = ({ metrics }) => {
  const metricsData = [
    {
      title: 'Total Suggestions',
      value: metrics?.totalSuggestions || 0,
      icon: Target,
      color: 'blue',
      description: 'Generated reorder suggestions'
    },
    {
      title: 'Acceptance Rate',
      value: `${metrics?.acceptanceRate || 0}%`,
      icon: CheckCircle,
      color: 'green',
      description: 'Suggestions confirmed by retailers'
    },
    {
      title: 'Completed Runs',
      value: metrics?.avgProcessingTime || 0,
      icon: Clock,
      color: 'purple',
      description: 'Successful agent executions'
    },
    {
      title: 'Performance',
      value: metrics?.totalSuggestions > 0 ? 'Excellent' : 'No Data',
      icon: TrendingUp,
      color: 'orange',
      description: 'Overall system performance'
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      blue: {
        bg: 'bg-blue-50',
        icon: 'text-blue-600',
        border: 'border-blue-200'
      },
      green: {
        bg: 'bg-green-50',
        icon: 'text-green-600',
        border: 'border-green-200'
      },
      purple: {
        bg: 'bg-purple-50',
        icon: 'text-purple-600',
        border: 'border-purple-200'
      },
      orange: {
        bg: 'bg-orange-50',
        icon: 'text-orange-600',
        border: 'border-orange-200'
      }
    };
    return colorMap?.[color] || colorMap?.blue;
  };

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricsData?.map((metric, index) => {
          const Icon = metric?.icon;
          const colors = getColorClasses(metric?.color);
          
          return (
            <div
              key={index}
              className={`${colors?.bg} ${colors?.border} border rounded-lg p-6`}
            >
              <div className="flex items-center">
                <div className={`${colors?.icon} p-2`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-600">
                    {metric?.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {metric?.value}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {metric?.description}
              </p>
            </div>
          );
        })}
      </div>
      {/* Performance Chart Placeholder */}
      <div className="bg-white border rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          Agent Performance Overview
        </h4>
        
        <div className="space-y-4">
          {/* System Status */}
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-700">System Status</span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              metrics?.isRunning 
                ? 'bg-green-100 text-green-800' :'bg-gray-100 text-gray-800'
            }`}>
              {metrics?.isRunning ? 'Active' : 'Standby'}
            </span>
          </div>
          
          {/* Last Run */}
          {metrics?.lastRunTime && (
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">Last Execution</span>
              <span className="text-sm text-gray-600">{metrics?.lastRunTime}</span>
            </div>
          )}
          
          {/* Data Quality */}
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-700">Data Quality</span>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
              Good
            </span>
          </div>
          
          {/* Response Time */}
          <div className="flex items-center justify-between py-3">
            <span className="text-sm font-medium text-gray-700">Avg Response Time</span>
            <span className="text-sm text-gray-600">&lt; 5s</span>
          </div>
        </div>
      </div>
      {/* Insights Panel */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          Agent Insights
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="text-sm font-medium text-gray-800 mb-2">
              Performance Summary
            </h5>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Agent analyzes inventory patterns effectively</li>
              <li>• Suggestions are based on 30-day sales history</li>
              <li>• Safety factor of 1.2x prevents stockouts</li>
              <li>• Lead time consideration ensures timely reorders</li>
            </ul>
          </div>
          
          <div>
            <h5 className="text-sm font-medium text-gray-800 mb-2">
              Optimization Opportunities
            </h5>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Monitor seasonal demand patterns</li>
              <li>• Adjust safety factors by product category</li>
              <li>• Consider supplier lead time variations</li>
              <li>• Track inventory turnover rates</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentMetrics;