import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext.jsx';
import { reorderAgentService } from '../../../services/reorderAgentService.js';
import { Play, Clock, Users, Target } from 'lucide-react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';



const AgentControlPanel = ({ onAgentRun, loading: isLoading }) => {
  const { user } = useAuth();
  const [isRunning, setIsRunning] = useState(false);
  const [lastRunResult, setLastRunResult] = useState(null);
  const [runMode, setRunMode] = useState('all'); // 'all' or 'demo'
  const [demoUsers, setDemoUsers] = useState([]);
  const [selectedDemoUser, setSelectedDemoUser] = useState('');

  useEffect(() => {
    fetchDemoUsers();
  }, []);

  const fetchDemoUsers = async () => {
    try {
      // Get demo users (Sharma & Gupta)
      const { data: inventoryData } = await reorderAgentService?.getInventory();
      
      if (inventoryData?.success && inventoryData?.data) {
        const uniqueUsers = inventoryData?.data
          ?.filter(item => item?.user?.name?.includes('Sharma') || item?.user?.name?.includes('Gupta'))
          ?.reduce((acc, item) => {
            if (item?.user && !acc?.find(u => u?.id === item?.user?.id)) {
              acc?.push(item?.user);
            }
            return acc;
          }, []) || [];
          
        setDemoUsers(uniqueUsers);
        if (uniqueUsers?.length > 0) {
          setSelectedDemoUser(uniqueUsers?.[0]?.id);
        }
      }
    } catch (err) {
      console.error('Error fetching demo users:', err);
    }
  };

  const handleRunAgent = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    try {
      const result = await reorderAgentService?.runReorderAgent();
      setLastRunResult(result);
      
      if (result?.success) {
        onAgentRun?.(result);
        
        // Show success message with vibecode info
        if (result?.suggestions_created > 0) {
          console.log(`✨ Reorder Agent completed successfully! 
            - ${result?.suggestions_created} suggestions created
            - ${result?.draft_orders_created || 0} draft orders created
            - Vibecode triggered!`);
        }
      } else {
        console.error('Agent execution failed:', result?.error);
      }
    } catch (error) {
      console.error('Error running agent:', error);
      setLastRunResult({ success: false, error: error?.message });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon name="Bot" size={24} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Reorder Agent Control</h3>
            <p className="text-sm text-muted-foreground">
              Automated inventory analysis and draft order generation
            </p>
          </div>
        </div>
        
        <Button
          onClick={handleRunAgent}
          disabled={isRunning || isLoading}
          variant="default"
          size="sm"
          iconName={isRunning ? "Loader2" : "Play"}
          iconPosition="left"
          className={isRunning ? "animate-spin" : ""}
        >
          {isRunning ? 'Running...' : 'Run Agent'}
        </Button>
      </div>

      {/* Enhanced Status Display */}
      {lastRunResult && (
        <div className={`p-4 rounded-lg border ${
          lastRunResult?.success ? 'bg-success/5 border-success/20' : 'bg-error/5 border-error/20'
        }`}>
          <div className="flex items-start space-x-2">
            <Icon 
              name={lastRunResult?.success ? "CheckCircle" : "XCircle"} 
              size={20} 
              className={lastRunResult?.success ? "text-success" : "text-error"}
            />
            <div className="flex-1">
              <p className={`font-medium ${
                lastRunResult?.success ? 'text-success' : 'text-error'
              }`}>
                {lastRunResult?.success ? 'Agent Executed Successfully' : 'Agent Execution Failed'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {lastRunResult?.message || lastRunResult?.error}
              </p>
              
              {lastRunResult?.success && (
                <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                  <div className="bg-background rounded p-2">
                    <div className="font-medium text-foreground">
                      {lastRunResult?.users_processed || 0}
                    </div>
                    <div className="text-muted-foreground">Users Processed</div>
                  </div>
                  <div className="bg-background rounded p-2">
                    <div className="font-medium text-foreground">
                      {lastRunResult?.suggestions_created || 0}
                    </div>
                    <div className="text-muted-foreground">Suggestions</div>
                  </div>
                  <div className="bg-background rounded p-2">
                    <div className="font-medium text-foreground">
                      {lastRunResult?.draft_orders_created || 0}
                    </div>
                    <div className="text-muted-foreground">Draft Orders</div>
                  </div>
                </div>
              )}
              
              {lastRunResult?.suggestions_created > 0 && (
                <div className="mt-2 flex items-center space-x-2 text-sm">
                  <Icon name="Smartphone" size={16} className="text-primary" />
                  <span className="text-primary">Vibecode triggered - Check your device!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Last Run Info */}
      {lastRunTime && (
        <div className="bg-gray-50 rounded-lg p-4 border">
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-gray-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-900">Last Run</p>
              <p className="text-sm text-gray-600">{lastRunTime}</p>
            </div>
          </div>
        </div>
      )}
      {/* Run Controls */}
      <div className="bg-white border rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          Agent Execution Controls
        </h4>
        
        {/* Run Mode Selection */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center space-x-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                value="all"
                checked={runMode === 'all'}
                onChange={(e) => setRunMode(e?.target?.value)}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                runMode === 'all' ?'border-blue-500 bg-blue-500' :'border-gray-300'
              }`}>
                {runMode === 'all' && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              <span className="ml-3 flex items-center">
                <Users className="w-4 h-4 mr-2 text-gray-500" />
                Run for All Users
              </span>
            </label>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                value="demo"
                checked={runMode === 'demo'}
                onChange={(e) => setRunMode(e?.target?.value)}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                runMode === 'demo' ?'border-blue-500 bg-blue-500' :'border-gray-300'
              }`}>
                {runMode === 'demo' && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              <span className="ml-3 flex items-center">
                <Target className="w-4 h-4 mr-2 text-gray-500" />
                Run for Demo User
              </span>
            </label>
          </div>

          {/* Demo User Selection */}
          {runMode === 'demo' && demoUsers?.length > 0 && (
            <div className="ml-7">
              <select
                value={selectedDemoUser}
                onChange={(e) => setSelectedDemoUser(e?.target?.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                {demoUsers?.map(user => (
                  <option key={user?.id} value={user?.id}>
                    {user?.name} ({user?.shop_name})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Run Button */}
        <button
          onClick={handleRunAgent}
          disabled={isRunning || isLoading || (runMode === 'demo' && !selectedDemoUser)}
          className={`w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white ${
            isRunning || isLoading
              ? 'bg-gray-400 cursor-not-allowed' :'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          } transition-colors duration-200`}
        >
          <Play className={`w-5 h-5 mr-2 ${(isRunning || isLoading) ? 'animate-spin' : ''}`} />
          {isRunning 
            ? 'Agent Running...' 
            : isLoading 
              ? 'Starting Agent...' :'Run Reorder Agent'
          }
        </button>
      </div>
      {/* Info Panel */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h5 className="text-sm font-medium text-blue-900 mb-2">
          How the Reorder Agent Works
        </h5>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Analyzes sales history for the last 30 days</li>
          <li>• Calculates average daily sales and projected needs</li>
          <li>• Considers lead time (7 days) and safety factor (1.2x)</li>
          <li>• Suggests reorders when current stock is below projected need</li>
          <li>• Creates actionable suggestions for retailers to review</li>
        </ul>
      </div>
    </div>
  );
};

export default AgentControlPanel;