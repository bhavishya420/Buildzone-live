import React, { useState } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

const ResetButton = ({ onReset, isResetting }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleConfirm = () => {
    setShowConfirmation(false);
    onReset?.();
  };

  if (showConfirmation) {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-red-900 mb-1">Confirm Demo Data Reset</p>
          <p className="text-xs text-red-700">
            This will delete all existing demo users and recreate them with fresh data.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowConfirmation(false)}
            className="px-3 py-1 text-xs font-medium text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isResetting}
            className="px-3 py-1 text-xs font-medium bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            Confirm Reset
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirmation(true)}
      disabled={isResetting}
      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      <RefreshCw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
      {isResetting ? 'Resetting...' : 'Reset Demo Data'}
    </button>
  );
};

export default ResetButton;