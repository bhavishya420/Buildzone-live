import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Users, ShoppingBag, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import DemoUserCard from './components/DemoUserCard';
import ResetButton from './components/ResetButton';
import StatusDisplay from './components/StatusDisplay';

const DemoDataManagement = () => {
  const [demoUsers, setDemoUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [resetStatus, setResetStatus] = useState(null);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    fetchDemoData();
  }, []);

  const fetchDemoData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch demo users with their orders
      const { data: profiles, error: profileError } = await supabase
        ?.from('user_profiles')
        ?.select('*')
        ?.in('email', ['sharma@demo.com', 'gupta@demo.com']);

      if (profileError) throw profileError;

      // Fetch orders for each demo user
      const usersWithOrders = await Promise?.all(
        profiles?.map(async (profile) => {
          const { data: orders, error: orderError } = await supabase
            ?.from('orders')
            ?.select('*')
            ?.eq('user_id', profile?.id);

          if (orderError) {
            console.error('Error fetching orders:', orderError);
            return { ...profile, orders: [], orderCount: 0, totalValue: 0 };
          }

          const totalValue = orders?.reduce((sum, order) => sum + parseFloat(order?.total_amount || 0), 0) || 0;

          return {
            ...profile,
            orders: orders || [],
            orderCount: orders?.length || 0,
            totalValue
          };
        }) || []
      );

      setDemoUsers(usersWithOrders || []);
    } catch (error) {
      console.error('Error fetching demo data:', error);
      setResetStatus({ type: 'error', message: 'Failed to fetch demo data' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetDemoData = async () => {
    try {
      setIsResetting(true);
      setResetStatus({ type: 'loading', message: 'Resetting demo data...' });

      // Call the reset function
      const { error } = await supabase?.rpc('reset_demo_data');

      if (error) throw error;

      setResetStatus({ type: 'success', message: 'Demo data reset successfully!' });
      
      // Refresh the data after reset
      setTimeout(() => {
        fetchDemoData();
      }, 1000);

    } catch (error) {
      console.error('Error resetting demo data:', error);
      setResetStatus({ 
        type: 'error', 
        message: `Reset failed: ${error?.message || 'Unknown error'}` 
      });
    } finally {
      setIsResetting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading demo data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Demo Data Management</h1>
              <p className="text-gray-600">
                Manage demonstration user accounts and order data for BNPL credit scoring testing
              </p>
            </div>
            <ResetButton 
              onReset={handleResetDemoData}
              isResetting={isResetting}
            />
          </div>
        </div>
      </div>

      {/* Status Display */}
      {resetStatus && (
        <div className="max-w-6xl mx-auto mb-6">
          <StatusDisplay 
            status={resetStatus} 
            onClose={() => setResetStatus(null)}
          />
        </div>
      )}

      {/* Demo Users Overview */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Demo Users Overview</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {demoUsers?.map((user) => (
              <DemoUserCard key={user?.id} user={user} />
            )) || []}
          </div>

          {demoUsers?.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">No Demo Users Found</h3>
              <p className="text-sm">Click "Reset Demo Data" to create fresh demo accounts</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Statistics</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Users className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-blue-900">{demoUsers?.length || 0}</div>
              <div className="text-sm text-blue-700">Demo Users</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <ShoppingBag className="w-6 h-6 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-green-900">
                {demoUsers?.reduce((sum, user) => sum + (user?.orderCount || 0), 0)}
              </div>
              <div className="text-sm text-green-700">Total Orders</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-lg font-bold text-purple-900">
                ₹{demoUsers?.reduce((sum, user) => sum + (user?.totalValue || 0), 0)?.toLocaleString('en-IN')}
              </div>
              <div className="text-sm text-purple-700">Total Value</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <CheckCircle className="w-6 h-6 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold text-orange-900">100%</div>
              <div className="text-sm text-orange-700">Orders Delivered</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoDataManagement;