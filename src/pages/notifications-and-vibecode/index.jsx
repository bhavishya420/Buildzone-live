import React, { useState, useEffect } from 'react';
import { Bell, Vibrate, Settings } from 'lucide-react';
import Header from '../../components/ui/Header';
import BottomNavigation from '../../components/ui/BottomNavigation';

import VibecodeLegend from './components/VibecodeLegend';
import NotificationHistory from './components/NotificationHistory';
import VibecodeSettings from './components/VibecodeSettings';
import { useLanguage } from '../../hooks/useLanguage';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const NotificationsAndVibecode = () => {
  const { t } = useLanguage();
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('notifications');
  const [vibecodeEnabled, setVibecodeEnabled] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Load mock notification data
    const mockNotifications = [
      {
        id: 1,
        type: 'order_confirmed',
        title: 'Order Confirmed',
        message: 'Your order #BZ-2025-001 has been confirmed',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
        vibecodePattern: 'short-short'
      },
      {
        id: 2,
        type: 'payment_due',
        title: 'Payment Reminder',
        message: 'Payment of ₹15,000 is due tomorrow',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        vibecodePattern: 'short-short-short'
      },
      {
        id: 3,
        type: 'out_for_delivery',
        title: 'Out for Delivery',
        message: 'Your order is out for delivery',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        vibecodePattern: 'long-short'
      },
      {
        id: 4,
        type: 'low_stock_alert',
        title: 'Low Stock Alert',
        message: 'PVC Pipes are running low in inventory',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        vibecodePattern: 'short-long-short'
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  const triggerVibration = (pattern) => {
    if (!vibecodeEnabled) {
      toast?.error('Vibecode is disabled in settings');
      return;
    }

    if ('vibrate' in navigator) {
      let vibrationPattern = [];
      
      // Convert pattern to milliseconds
      switch (pattern) {
        case 'short-short':
          vibrationPattern = [200, 100, 200];
          break;
        case 'long-short':
          vibrationPattern = [500, 100, 200];
          break;
        case 'short-short-short':
          vibrationPattern = [200, 100, 200, 100, 200];
          break;
        case 'short-long-short':
          vibrationPattern = [200, 100, 500, 100, 200];
          break;
        default:
          vibrationPattern = [200];
      }

      try {
        navigator.vibrate(vibrationPattern);
        toast?.success(`Vibecode activated: ${pattern}`, {
          icon: '📳',
          duration: 2000,
        });
      } catch (error) {
        console.error('Vibration not supported:', error);
        toast?.error('Vibration not supported on this device');
      }
    } else {
      toast?.error('Vibration not supported on this device');
    }
  };

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'vibecode', label: 'Vibecode', icon: Vibrate },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const creditData = {
    available: 0,
    used: 0,
    currency: '₹'
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header creditData={creditData} />

      {/* Main Content */}
      <main className="pb-20 pt-4">
        <div className="px-4 py-6">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Notifications & Vibecode</h1>
            <p className="text-muted-foreground mt-1">
              Manage your notifications and haptic feedback patterns
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex bg-muted rounded-lg p-1 mb-6">
            {tabs?.map?.((tab) => {
              const IconComponent = tab?.icon;
              const isActive = activeTab === tab?.id;
              
              return (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-all ${
                    isActive
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab?.label}</span>
                </button>
              );
            }) ?? null}
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'notifications' && (
              <NotificationHistory notifications={notifications} />
            )}
            
            {activeTab === 'vibecode' && (
              <VibecodeLegend onTestVibecode={triggerVibration} />
            )}
            
            {activeTab === 'settings' && (
              <VibecodeSettings 
                vibecodeEnabled={vibecodeEnabled}
                onToggleVibecode={setVibecodeEnabled}
              />
            )}
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default NotificationsAndVibecode;