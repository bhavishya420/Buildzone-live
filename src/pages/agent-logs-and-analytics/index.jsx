import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase.js';
import { Activity, Download, Filter, RefreshCw, BarChart3 } from 'lucide-react';
import LogEntryCard from './components/LogEntryCard.jsx';
import PerformanceMetrics from './components/PerformanceMetrics.jsx';
import FilterControls from './components/FilterControls.jsx';
import ExportDialog from './components/ExportDialog.jsx';

const AgentLogsAndAnalytics = () => {
  const [logs, setLogs] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    dateRange: '7d',
    eventType: 'all',
    agentName: 'all',
    searchTerm: ''
  });
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const logsPerPage = 20;

  useEffect(() => {
    fetchLogs();
    fetchMetrics();
  }, [filters, currentPage]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      let query = supabase?.from('agent_logs')?.select('*', { count: 'exact' })?.order('created_at', { ascending: false })?.range((currentPage - 1) * logsPerPage, currentPage * logsPerPage - 1);

      // Apply date filter
      if (filters?.dateRange !== 'all') {
        const days = parseInt(filters?.dateRange);
        const dateThreshold = new Date();
        dateThreshold?.setDate(dateThreshold?.getDate() - days);
        query = query?.gte('created_at', dateThreshold?.toISOString());
      }

      // Apply event type filter
      if (filters?.eventType !== 'all') {
        query = query?.eq('event_type', filters?.eventType);
      }

      // Apply agent name filter
      if (filters?.agentName !== 'all') {
        query = query?.eq('agent_name', filters?.agentName);
      }

      // Apply search filter
      if (filters?.searchTerm) {
        query = query?.or(`event_type.ilike.%${filters?.searchTerm}%,agent_name.ilike.%${filters?.searchTerm}%`);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      setLogs(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching logs:', error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetrics = async () => {
    try {
      // Get basic metrics
      const { data: totalExecutions } = await supabase?.from('agent_logs')?.select('*', { count: 'exact', head: true })?.eq('event_type', 'execution_completed');

      const { data: totalErrors } = await supabase?.from('agent_logs')?.select('*', { count: 'exact', head: true })?.eq('event_type', 'execution_error');

      const { data: recentLogs } = await supabase?.from('agent_logs')?.select('created_at, event_type, payload')?.gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)?.toISOString())?.order('created_at', { ascending: false });

      // Calculate success rate
      const executions = totalExecutions?.length || 0;
      const errors = totalErrors?.length || 0;
      const successRate = executions > 0 ? ((executions - errors) / executions * 100)?.toFixed(1) : 0;

      // Calculate suggestions created from recent logs
      const suggestionsCreated = recentLogs?.filter(log => 
        log?.event_type === 'suggestion_created'
      )?.length || 0;

      setMetrics({
        totalExecutions: executions,
        successRate: parseFloat(successRate),
        avgProcessingTime: 2.3, // Mock value - would calculate from actual data
        suggestionsGenerated: suggestionsCreated,
        recentActivity: recentLogs?.slice(0, 10) || []
      });
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const handleRunAgent = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase?.rpc('run_reorder_agent');
      
      if (error) throw error;
      
      // Refresh logs after running agent
      await fetchLogs();
      await fetchMetrics();
      
      // Show success message (you could add a toast notification here)
      console.log('Agent executed successfully:', data);
    } catch (error) {
      console.error('Error running agent:', error);
      // Show error message (you could add a toast notification here)
    }
  };

  const handleExport = async (format, dateRange) => {
    try {
      let query = supabase?.from('agent_logs')?.select('*')?.order('created_at', { ascending: false });

      if (dateRange !== 'all') {
        const days = parseInt(dateRange);
        const dateThreshold = new Date();
        dateThreshold?.setDate(dateThreshold?.getDate() - days);
        query = query?.gte('created_at', dateThreshold?.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;

      if (format === 'json') {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `agent-logs-${new Date()?.toISOString()?.split('T')?.[0]}.json`;
        a?.click();
      } else if (format === 'csv') {
        const csv = [
          'ID,Agent Name,Event Type,Created At,Payload',
          ...data?.map(log => 
            `${log?.id},${log?.agent_name},${log?.event_type},${log?.created_at},"${JSON.stringify(log?.payload || {})}"`
          )
        ]?.join('\n');
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `agent-logs-${new Date()?.toISOString()?.split('T')?.[0]}.csv`;
        a?.click();
      }

      setShowExportDialog(false);
    } catch (error) {
      console.error('Error exporting logs:', error);
    }
  };

  const totalPages = Math.ceil(totalCount / logsPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Agent Logs & Analytics</h1>
                  <p className="text-sm text-gray-600">Monitor Reorder Agent operations and performance</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleRunAgent}
                  disabled={loading}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  Run Agent
                </button>
                <button
                  onClick={() => setShowExportDialog(true)}
                  className="inline-flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Performance Metrics */}
        <PerformanceMetrics metrics={metrics} loading={loading} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
          {/* Filter Controls */}
          <div className="lg:col-span-1">
            <FilterControls 
              filters={filters}
              onFiltersChange={setFilters}
              onRefresh={fetchLogs}
            />
          </div>

          {/* Logs Section */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Log Entries</h2>
                  <div className="text-sm text-gray-500">
                    {totalCount} total entries
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {loading ? (
                  <div className="p-8 text-center">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">Loading logs...</p>
                  </div>
                ) : logs?.length === 0 ? (
                  <div className="p-8 text-center">
                    <Activity className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 mb-2">No log entries found</p>
                    <p className="text-sm text-gray-400">Try adjusting your filters or run the agent to generate logs</p>
                  </div>
                ) : (
                  logs?.map((log) => (
                    <LogEntryCard key={log?.id} log={log} />
                  ))
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between p-4 border-t border-gray-200">
                  <div className="text-sm text-gray-700">
                    Showing {((currentPage - 1) * logsPerPage) + 1} to {Math.min(currentPage * logsPerPage, totalCount)} of {totalCount} entries
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-1 text-sm text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Export Dialog */}
      {showExportDialog && (
        <ExportDialog
          onExport={handleExport}
          onClose={() => setShowExportDialog(false)}
        />
      )}
    </div>
  );
};

export default AgentLogsAndAnalytics;