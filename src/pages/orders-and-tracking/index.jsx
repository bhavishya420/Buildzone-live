import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import BottomNavigation from '../../components/ui/BottomNavigation';
import FloatingVoiceButton from '../../components/ui/FloatingVoiceButton';
import OrderCard from './components/OrderCard';
import OrderFilters from './components/OrderFilters';
import { OrderSkeletonList } from './components/OrderSkeleton';
import EmptyOrdersState from './components/EmptyOrdersState';
import OrderStats from './components/OrderStats';
import { reorderAgentService } from '../../services/reorderAgentService';

const OrdersAndTracking = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Load orders from Supabase instead of mock data
  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        const result = await reorderAgentService?.getOrders();
        if (result?.success) {
          setOrders(result?.data || []);
        } else {
          console.error('Failed to load orders:', result?.error);
          setOrders([]);
        }
      } catch (error) {
        console.error('Error loading orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  // Filter and search orders
  const filteredOrders = useMemo(() => {
    let filtered = orders;

    // Apply status filter
    if (activeFilter !== 'all') {
      switch (activeFilter) {
        case 'draft':
          filtered = filtered?.filter(order => 
            order?.status?.toLowerCase() === 'draft'
          );
          break;
        case 'active':
          filtered = filtered?.filter(order => 
            ['processing', 'shipped']?.includes(order?.status?.toLowerCase())
          );
          break;
        case 'completed':
          filtered = filtered?.filter(order => 
            order?.status?.toLowerCase() === 'delivered'
          );
          break;
        case 'cancelled':
          filtered = filtered?.filter(order => 
            order?.status?.toLowerCase() === 'cancelled'
          );
          break;
      }
    }

    // Apply search filter
    if (searchQuery?.trim()) {
      const query = searchQuery?.toLowerCase();
      filtered = filtered?.filter(order =>
        order?.id?.toLowerCase()?.includes(query) ||
        order?.items?.some(item => 
          item?.name?.toLowerCase()?.includes(query)
        )
      );
    }

    return filtered?.sort((a, b) => new Date(b?.created_at) - new Date(a?.created_at));
  }, [orders, activeFilter, searchQuery]);

  // Calculate order counts for filters
  const orderCounts = useMemo(() => {
    return {
      all: orders?.length,
      draft: orders?.filter(order => 
        order?.status?.toLowerCase() === 'draft'
      )?.length,
      active: orders?.filter(order => 
        ['processing', 'shipped']?.includes(order?.status?.toLowerCase())
      )?.length,
      completed: orders?.filter(order => 
        order?.status?.toLowerCase() === 'delivered'
      )?.length,
      cancelled: orders?.filter(order => 
        order?.status?.toLowerCase() === 'cancelled'
      )?.length
    };
  }, [orders]);

  // Calculate order statistics
  const orderStats = useMemo(() => {
    const totalSpent = orders?.filter(order => order?.status?.toLowerCase() !== 'cancelled')?.reduce((sum, order) => sum + (order?.total_amount || 0), 0);
    
    const thisMonthOrders = orders?.filter(order => {
      const orderDate = new Date(order?.created_at);
      const now = new Date();
      return orderDate?.getMonth() === now?.getMonth() && 
             orderDate?.getFullYear() === now?.getFullYear();
    })?.length;

    const completedOrders = orders?.filter(order => 
      order?.status?.toLowerCase() !== 'cancelled'
    );

    return {
      totalOrders: orders?.length,
      totalSpent,
      thisMonth: thisMonthOrders,
      avgOrderValue: completedOrders?.length > 0 ? totalSpent / completedOrders?.length : 0
    };
  }, [orders]);

  const handleConfirmDraftOrder = async (order) => {
    try {
      setLoading(true);
      const result = await reorderAgentService?.confirmDraftOrder(order?.id);
      
      if (result?.success) {
        // Refresh orders list
        const updatedResult = await reorderAgentService?.getOrders();
        if (updatedResult?.success) {
          setOrders(updatedResult?.data || []);
        }
        console.log('Draft order confirmed successfully');
      } else {
        console.error('Failed to confirm draft order:', result?.error);
        alert('Failed to confirm order. Please try again.');
      }
    } catch (error) {
      console.error('Error confirming draft order:', error);
      alert('An error occurred while confirming the order.');
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = (order) => {
    // Add all items from the order to cart
    console.log('Reordering:', order);
    navigate('/shopping-cart-and-checkout', { 
      state: { 
        reorderItems: order?.items?.map(item => ({
          ...item,
          quantity: item?.qty || item?.quantity
        }))
      }
    });
  };

  const handleDownloadInvoice = (order) => {
    // Simulate invoice download
    console.log('Downloading invoice for:', order?.id);
    // In real app, this would trigger a PDF download
    alert(`Invoice for order ${order?.id} will be downloaded.`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pb-20">
        {/* Page Header */}
        <div className="bg-card border-b border-border">
          <div className="px-4 py-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Orders & Tracking
            </h1>
            <p className="text-muted-foreground">
              Track your orders and manage purchase history
            </p>
          </div>
        </div>

        {loading ? (
          <div className="p-4">
            <OrderSkeletonList count={5} />
          </div>
        ) : (
          <>
            {orders?.length > 0 && (
              <div className="p-4">
                <OrderStats stats={orderStats} />
              </div>
            )}

            <OrderFilters
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              orderCounts={orderCounts}
            />

            <div className="p-4">
              {filteredOrders?.length === 0 ? (
                <EmptyOrdersState filterType={activeFilter} />
              ) : (
                <div className="space-y-4">
                  {filteredOrders?.map((order) => (
                    <OrderCard
                      key={order?.id}
                      order={order}
                      onReorder={handleReorder}
                      onDownloadInvoice={handleDownloadInvoice}
                      onConfirmDraftOrder={handleConfirmDraftOrder}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
      <BottomNavigation />
      <FloatingVoiceButton />
    </div>
  );
};

export default OrdersAndTracking;