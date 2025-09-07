import React, { useState } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

const BulkActions = ({
  selectedCount,
  onConfirmAll,
  onDismissAll,
  onClearSelection
}) => {
  const [confirmingAll, setConfirmingAll] = useState(false);
  const [dismissingAll, setDismissingAll] = useState(false);

  const handleConfirmAll = async () => {
    try {
      setConfirmingAll(true);
      await onConfirmAll?.();
    } catch (err) {
      console.error('Error confirming all suggestions:', err);
    } finally {
      setConfirmingAll(false);
    }
  };

  const handleDismissAll = async () => {
    try {
      setDismissingAll(true);
      await onDismissAll?.();
    } catch (err) {
      console.error('Error dismissing all suggestions:', err);
    } finally {
      setDismissingAll(false);
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div className="flex items-center">
          <div className="flex items-center text-blue-700">
            <span className="text-sm font-medium">
              {selectedCount} suggestion{selectedCount !== 1 ? 's' : ''} selected
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleConfirmAll}
            disabled={confirmingAll || dismissingAll}
            className={`inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
              confirmingAll
                ? 'bg-gray-400 cursor-not-allowed' :'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
            } transition-colors duration-200`}
          >
            <CheckCircle className={`w-4 h-4 mr-1 ${confirmingAll ? 'animate-spin' : ''}`} />
            {confirmingAll ? 'Confirming...' : 'Confirm All'}
          </button>
          
          <button
            onClick={handleDismissAll}
            disabled={confirmingAll || dismissingAll}
            className={`inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 ${
              dismissingAll
                ? 'bg-gray-100 cursor-not-allowed' :'bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
            } transition-colors duration-200`}
          >
            <XCircle className={`w-4 h-4 mr-1 ${dismissingAll ? 'animate-spin' : ''}`} />
            {dismissingAll ? 'Dismissing...' : 'Dismiss All'}
          </button>
          
          <button
            onClick={onClearSelection}
            disabled={confirmingAll || dismissingAll}
            className="inline-flex items-center px-2 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-500 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
            title="Clear selection"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkActions;