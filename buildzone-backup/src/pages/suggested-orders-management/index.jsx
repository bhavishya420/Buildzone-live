import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { reorderAgentService } from '../../services/reorderAgentService.js';
import SuggestedOrderCard from './components/SuggestedOrderCard.jsx';
import FilterControls from './components/FilterControls.jsx';
import EmptyState from './components/EmptyState.jsx';
import LoadingState from './components/LoadingState.jsx';
import BulkActions from './components/BulkActions.jsx';
import { RefreshCw, TrendingUp, Package, AlertCircle } from 'lucide-react';

const SuggestedOrdersManagement = () => {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [selectedSuggestions, setSelectedSuggestions] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const [filters, setFilters] = useState({
    search: '',
    urgency: 'all',
    category: 'all',
    sortBy: 'created_at'
  });

  useEffect(() => {
    if (!user) return;
    
    fetchSuggestions();
    
    // Subscribe to real-time updates
    const channel = reorderAgentService?.subscribeSuggestedOrders(
      user?.id,
      handleSuggestionUpdate
    );
    
    return () => {
      reorderAgentService?.unsubscribe(channel);
    };
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [suggestions, filters]);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await reorderAgentService?.getSuggestedOrders(user?.id);
      
      if (result?.success) {
        setSuggestions(result?.data || []);
      } else {
        setError(result?.error || 'Failed to fetch suggestions');
      }
    } catch (err) {
      setError(err?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchSuggestions();
    } catch (err) {
      setError(err?.message);
    } finally {
      setRefreshing(false);
    }
  };

  const handleSuggestionUpdate = (payload) => {
    try {
      const { eventType, new: newRecord, old: oldRecord } = payload;
      
      if (eventType === 'INSERT' && newRecord) {
        setSuggestions(prev => [newRecord, ...prev]);
      } else if (eventType === 'UPDATE' && newRecord) {
        setSuggestions(prev => 
          prev?.map(item => item?.id === newRecord?.id ? newRecord : item)
        );
      } else if (eventType === 'DELETE' && oldRecord) {
        setSuggestions(prev => 
          prev?.filter(item => item?.id !== oldRecord?.id)
        );
      }
    } catch (err) {
      console.error('Error handling suggestion update:', err);
    }
  };

  const applyFilters = () => {
    try {
      let filtered = [...(suggestions || [])];
      
      // Search filter
      if (filters?.search) {
        const searchTerm = filters?.search?.toLowerCase();
        filtered = filtered?.filter(suggestion =>
          suggestion?.product?.name?.toLowerCase()?.includes(searchTerm) ||
          suggestion?.product?.brand?.toLowerCase()?.includes(searchTerm)
        );
      }
      
      // Urgency filter
      if (filters?.urgency !== 'all') {
        filtered = filtered?.filter(suggestion => {
          const currentStock = suggestion?.inventory_qty || 0;
          const suggestedQty = suggestion?.suggested_qty || 0;
          const urgencyScore = suggestedQty / Math.max(currentStock, 1);
          
          if (filters?.urgency === 'high') return urgencyScore >= 2;
          if (filters?.urgency === 'medium') return urgencyScore >= 1.5 && urgencyScore < 2;
          if (filters?.urgency === 'low') return urgencyScore < 1.5;
          
          return true;
        });
      }
      
      // Sort
      filtered?.sort((a, b) => {
        switch (filters?.sortBy) {
          case 'urgency':
            const urgencyA = (a?.suggested_qty || 0) / Math.max(a?.inventory_qty || 1, 1);
            const urgencyB = (b?.suggested_qty || 0) / Math.max(b?.inventory_qty || 1, 1);
            return urgencyB - urgencyA;
          case 'quantity':
            return (b?.suggested_qty || 0) - (a?.suggested_qty || 0);
          case 'product_name':
            return (a?.product?.name || '')?.localeCompare(b?.product?.name || '');
          case 'created_at':
          default:
            return new Date(b?.created_at || 0) - new Date(a?.created_at || 0);
        }
      });
      
      setFilteredSuggestions(filtered);
    } catch (err) {
      console.error('Error applying filters:', err);
      setFilteredSuggestions(suggestions || []);
    }
  };

  const handleConfirmSuggestion = async (suggestionId) => {
    try {
      const result = await reorderAgentService?.confirmSuggestedOrder(suggestionId);
      
      if (result?.success) {
        // Remove from suggestions list or update status
        setSuggestions(prev => 
          prev?.filter(item => item?.id !== suggestionId)
        );
        setSelectedSuggestions(prev => {
          const newSet = new Set(prev);
          newSet?.delete(suggestionId);
          return newSet;
        });
      } else {
        setError(result?.error || 'Failed to confirm suggestion');
      }
    } catch (err) {
      setError(err?.message);
    }
  };

  const handleDismissSuggestion = async (suggestionId) => {
    try {
      const result = await reorderAgentService?.dismissSuggestedOrder(suggestionId);
      
      if (result?.success) {
        // Remove from suggestions list
        setSuggestions(prev => 
          prev?.filter(item => item?.id !== suggestionId)
        );
        setSelectedSuggestions(prev => {
          const newSet = new Set(prev);
          newSet?.delete(suggestionId);
          return newSet;
        });
      } else {
        setError(result?.error || 'Failed to dismiss suggestion');
      }
    } catch (err) {
      setError(err?.message);
    }
  };

  const handleSelectionChange = (suggestionId, isSelected) => {
    const newSelected = new Set(selectedSuggestions);
    
    if (isSelected) {
      newSelected?.add(suggestionId);
    } else {
      newSelected?.delete(suggestionId);
    }
    
    setSelectedSuggestions(newSelected);
  };

  const getUrgencyLevel = (suggestion) => {
    const currentStock = suggestion?.inventory_qty || 0;
    const suggestedQty = suggestion?.suggested_qty || 0;
    const urgencyScore = suggestedQty / Math.max(currentStock, 1);
    
    if (urgencyScore >= 2) return 'high';
    if (urgencyScore >= 1.5) return 'medium';
    return 'low';
  };

  // Calculate summary stats
  const stats = {
    total: filteredSuggestions?.length || 0,
    highUrgency: filteredSuggestions?.filter(s => getUrgencyLevel(s) === 'high')?.length || 0,
    totalValue: filteredSuggestions?.reduce((sum, s) => 
      sum + ((s?.suggested_qty || 0) * (s?.product?.price || 0)), 0
    ) || 0
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Suggested Orders
              </h1>
              <p className="text-gray-600 mt-1">
                AI-powered reorder recommendations based on your sales patterns
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <Package className="w-5 h-5 text-blue-600 mr-2" />
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total Suggestions</p>
                  <p className="text-2xl font-bold text-blue-900">{stats?.total}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                <div>
                  <p className="text-sm text-red-600 font-medium">High Urgency</p>
                  <p className="text-2xl font-bold text-red-900">{stats?.highUrgency}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                <div>
                  <p className="text-sm text-green-600 font-medium">Estimated Value</p>
                  <p className="text-2xl font-bold text-green-900">
                    ₹{stats?.totalValue?.toLocaleString()}
                  </p>
                </div>
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
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Filter Controls */}
        <FilterControls
          filters={filters}
          onFiltersChange={setFilters}
          totalCount={suggestions?.length || 0}
          filteredCount={filteredSuggestions?.length || 0}
        />

        {/* Bulk Actions */}
        {selectedSuggestions?.size > 0 && (
          <BulkActions
            selectedCount={selectedSuggestions?.size}
            onConfirmAll={async () => {
              for (const id of selectedSuggestions) {
                await handleConfirmSuggestion(id);
              }
            }}
            onDismissAll={async () => {
              for (const id of selectedSuggestions) {
                await handleDismissSuggestion(id);
              }
            }}
            onClearSelection={() => setSelectedSuggestions(new Set())}
          />
        )}

        {/* Suggestions Grid */}
        {filteredSuggestions?.length === 0 ? (
          <EmptyState hasData={suggestions?.length > 0} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSuggestions?.map(suggestion => (
              <SuggestedOrderCard
                key={suggestion?.id}
                suggestion={suggestion}
                urgencyLevel={getUrgencyLevel(suggestion)}
                isSelected={selectedSuggestions?.has(suggestion?.id)}
                onSelectionChange={(isSelected) => 
                  handleSelectionChange(suggestion?.id, isSelected)
                }
                onConfirm={() => handleConfirmSuggestion(suggestion?.id)}
                onDismiss={() => handleDismissSuggestion(suggestion?.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SuggestedOrdersManagement;