import React from 'react';
import { Activity, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import Icon from '../../../components/AppIcon';


const PerformanceMetrics = ({ metrics, loading }) => {
  const metricCards = [
    {
      title: 'Total Executions',
      value: metrics?.totalExecutions || 0,
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Success Rate',
      value: `${metrics?.successRate || 0}%`,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+5%',
      changeType: 'positive'
    },
    {
      title: 'Avg Processing Time',
      value: `${metrics?.avgProcessingTime || 0}s`,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: '-0.3s',
      changeType: 'positive'
    },
    {
      title: 'Suggestions Generated',
      value: metrics?.suggestionsGenerated || 0,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: '+8',
      changeType: 'positive'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4]?.map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="ml-4 flex-1">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricCards?.map((metric, index) => {
        const Icon = metric?.icon;
        return (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className={`p-3 ${metric?.bgColor} rounded-lg`}>
                <Icon className={`h-6 w-6 ${metric?.color}`} />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">{metric?.title}</p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">{metric?.value}</p>
                  <p className={`ml-2 text-sm font-medium ${
                    metric?.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric?.change}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PerformanceMetrics;