import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { reorderAgentService } from '../../services/reorderAgentService.js';
import AgentControlPanel from './components/AgentControlPanel.jsx';
import AgentMetrics from './components/AgentMetrics.jsx';
import AgentLogs from './components/AgentLogs.jsx';
import AgentSettings from './components/AgentSettings.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';
import { AlertCircle, RefreshCw, Settings, BarChart3 } from 'lucide-react';
import Icon from '../../components/AppIcon';


const ReorderAgentDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('control');
  const [agentLogs, setAgentLogs] = useState([]);
  const [metrics, setMetrics] = useState({
    totalSuggestions: 0,
    acceptanceRate: 0,
    avgProcessingTime: 0,
    lastRunTime: null,
    isRunning: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tabs = [
    { id: 'control', label: 'Agent Control', icon: RefreshCw },
    { id: 'metrics', label: 'Metrics', icon: BarChart3 },
    { id: 'logs', label: 'Activity Logs', icon: AlertCircle },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  useEffect(() => {
    if (!user) return;
    
    fetchInitialData();
    
    // Subscribe to real-time agent logs
    const logsChannel = reorderAgentService?.subscribeAgentLogs(handleLogUpdate);
    
    return () => {
      reorderAgentService?.unsubscribe(logsChannel);
    };
  }, [user]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch agent logs
      const logsResult = await reorderAgentService?.getAgentLogs(100);
      if (logsResult?.success) {
        setAgentLogs(logsResult?.data);
        calculateMetrics(logsResult?.data);
      } else {
        setError(logsResult?.error || 'Failed to fetch agent logs');
      }
    } catch (err) {
      setError(err?.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = (logs) => {
    try {
      const completedRuns = logs?.filter(log => 
        log?.event_type === 'agent_complete'
      ) || [];
      
      const suggestionLogs = logs?.filter(log => 
        log?.event_type === 'suggestion_created'
      ) || [];
      
      const confirmedLogs = logs?.filter(log => 
        log?.event_type === 'suggestion_confirmed'
      ) || [];
      
      const totalSuggestions = suggestionLogs?.length || 0;
      const acceptanceRate = totalSuggestions > 0 
        ? ((confirmedLogs?.length || 0) / totalSuggestions * 100)?.toFixed(1)
        : 0;
      
      const lastRunLog = completedRuns?.[0];
      const lastRunTime = lastRunLog?.created_at 
        ? new Date(lastRunLog.created_at)?.toLocaleString()
        : null;
        
      // Check if agent is currently running
      const runningLogs = logs?.filter(log => 
        log?.event_type === 'agent_start'
      ) || [];
      
      const latestStart = runningLogs?.[0];
      const latestComplete = completedRuns?.[0];
      
      const isRunning = latestStart && latestComplete 
        ? new Date(latestStart?.created_at) > new Date(latestComplete?.created_at)
        : !!latestStart;

      setMetrics({
        totalSuggestions,
        acceptanceRate: parseFloat(acceptanceRate),
        avgProcessingTime: completedRuns?.length || 0,
        lastRunTime,
        isRunning
      });
    } catch (err) {
      console.error('Error calculating metrics:', err);
    }
  };

  const handleLogUpdate = (payload) => {
    try {
      const newLog = payload?.new;
      if (newLog) {
        setAgentLogs(prev => [newLog, ...prev]);
        
        // Update metrics if relevant log
        if (['agent_complete', 'suggestion_created', 'suggestion_confirmed']?.includes(newLog?.event_type)) {
          setAgentLogs(currentLogs => {
            const updatedLogs = [newLog, ...currentLogs];
            calculateMetrics(updatedLogs);
            return updatedLogs;
          });
        }
      }
    } catch (err) {
      console.error('Error handling log update:', err);
    }
  };

  const handleAgentRun = async (targetUserId = null) => {
    try {
      setError(null);
      setMetrics(prev => ({ ...prev, isRunning: true }));
      
      const result = await reorderAgentService?.runReorderAgent(targetUserId);
      
      if (result?.success) {
        // Refresh data after successful run
        setTimeout(() => {
          fetchInitialData();
        }, 2000);
      } else {
        setError(result?.error || 'Failed to run reorder agent');
        setMetrics(prev => ({ ...prev, isRunning: false }));
      }
    } catch (err) {
      setError(err?.message);
      setMetrics(prev => ({ ...prev, isRunning: false }));
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Reorder Agent Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Monitor and control AI-powered inventory reordering system
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                metrics?.isRunning 
                  ? 'bg-green-100 text-green-800' :'bg-gray-100 text-gray-800'
              }`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  metrics?.isRunning ? 'bg-green-500' : 'bg-gray-500'
                }`} />
                {metrics?.isRunning ? 'Active' : 'Standby'}
              </div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs?.map((tab) => {
                const Icon = tab?.icon;
                return (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === tab?.id
                        ? 'border-blue-500 text-blue-600' :'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab?.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'control' && (
              <AgentControlPanel
                onRunAgent={handleAgentRun}
                isRunning={metrics?.isRunning}
                lastRunTime={metrics?.lastRunTime}
              />
            )}
            
            {activeTab === 'metrics' && (
              <AgentMetrics metrics={metrics} />
            )}
            
            {activeTab === 'logs' && (
              <AgentLogs logs={agentLogs} />
            )}
            
            {activeTab === 'settings' && (
              <AgentSettings />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReorderAgentDashboard;