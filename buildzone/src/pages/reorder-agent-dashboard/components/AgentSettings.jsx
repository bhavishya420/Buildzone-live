import React, { useState } from 'react';
import { Save, RefreshCw, Settings, Info } from 'lucide-react';

const AgentSettings = () => {
  const [settings, setSettings] = useState({
    lookbackDays: 30,
    defaultLeadTime: 7,
    safetyFactor: 1.2,
    reorderBuffer: 2,
    autoRun: false,
    runFrequency: 'daily',
    notifyOnCompletion: true,
    minSuggestionThreshold: 1
  });
  
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleInputChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Simulate API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSettings({
      lookbackDays: 30,
      defaultLeadTime: 7,
      safetyFactor: 1.2,
      reorderBuffer: 2,
      autoRun: false,
      runFrequency: 'daily',
      notifyOnCompletion: true,
      minSuggestionThreshold: 1
    });
  };

  return (
    <div className="space-y-6">
      {/* Settings Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Settings className="w-5 h-5 text-gray-600 mr-2" />
          <h4 className="text-lg font-semibold text-gray-900">Agent Configuration</h4>
        </div>
        {saved && (
          <div className="text-green-600 text-sm font-medium">
            Settings saved successfully!
          </div>
        )}
      </div>
      {/* Algorithm Parameters */}
      <div className="bg-white border rounded-lg p-6">
        <h5 className="text-lg font-medium text-gray-900 mb-4">
          Algorithm Parameters
        </h5>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lookback Days
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <Info className="w-3 h-3 mr-1" />
                Days of sales history to analyze
              </div>
            </label>
            <input
              type="number"
              min="7"
              max="90"
              value={settings?.lookbackDays}
              onChange={(e) => handleInputChange('lookbackDays', parseInt(e?.target?.value))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Lead Time (Days)
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <Info className="w-3 h-3 mr-1" />
                Expected delivery time from suppliers
              </div>
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={settings?.defaultLeadTime}
              onChange={(e) => handleInputChange('defaultLeadTime', parseInt(e?.target?.value))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Safety Factor
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <Info className="w-3 h-3 mr-1" />
                Multiplier for demand uncertainty (1.0-2.0)
              </div>
            </label>
            <input
              type="number"
              min="1.0"
              max="2.0"
              step="0.1"
              value={settings?.safetyFactor}
              onChange={(e) => handleInputChange('safetyFactor', parseFloat(e?.target?.value))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reorder Buffer
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <Info className="w-3 h-3 mr-1" />
                Extra units to add to each suggestion
              </div>
            </label>
            <input
              type="number"
              min="0"
              max="10"
              value={settings?.reorderBuffer}
              onChange={(e) => handleInputChange('reorderBuffer', parseInt(e?.target?.value))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
      {/* Automation Settings */}
      <div className="bg-white border rounded-lg p-6">
        <h5 className="text-lg font-medium text-gray-900 mb-4">
          Automation & Scheduling
        </h5>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings?.autoRun}
              onChange={(e) => handleInputChange('autoRun', e?.target?.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-3 text-sm font-medium text-gray-700">
              Enable automatic agent execution
            </label>
          </div>
          
          {settings?.autoRun && (
            <div className="ml-7">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Run Frequency
              </label>
              <select
                value={settings?.runFrequency}
                onChange={(e) => handleInputChange('runFrequency', e?.target?.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="hourly">Every Hour</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          )}
        </div>
      </div>
      {/* Notification Settings */}
      <div className="bg-white border rounded-lg p-6">
        <h5 className="text-lg font-medium text-gray-900 mb-4">
          Notifications & Alerts
        </h5>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings?.notifyOnCompletion}
              onChange={(e) => handleInputChange('notifyOnCompletion', e?.target?.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-3 text-sm font-medium text-gray-700">
              Notify when agent run completes
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Suggestion Threshold
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <Info className="w-3 h-3 mr-1" />
                Only notify if this many suggestions are created
              </div>
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={settings?.minSuggestionThreshold}
              onChange={(e) => handleInputChange('minSuggestionThreshold', parseInt(e?.target?.value))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
        <button
          onClick={handleReset}
          className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Reset to Defaults
        </button>
        
        <button
          onClick={handleSave}
          disabled={saving}
          className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
            saving
              ? 'bg-gray-400 cursor-not-allowed' :'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          }`}
        >
          <Save className={`w-4 h-4 mr-2 ${saving ? 'animate-spin' : ''}`} />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
      {/* Configuration Preview */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h6 className="text-sm font-medium text-gray-900 mb-2">
          Current Configuration Preview
        </h6>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• Analyze {settings?.lookbackDays} days of sales history</p>
          <p>• Use {settings?.defaultLeadTime} day lead time with {settings?.safetyFactor}x safety factor</p>
          <p>• Add {settings?.reorderBuffer} extra units to each suggestion</p>
          <p>• {settings?.autoRun ? `Auto-run ${settings?.runFrequency}` : 'Manual execution only'}</p>
        </div>
      </div>
    </div>
  );
};

export default AgentSettings;