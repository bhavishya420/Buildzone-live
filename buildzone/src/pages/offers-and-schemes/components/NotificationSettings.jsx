import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const NotificationSettings = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState({
    flashDeals: true,
    brandPromotions: false,
    bulkDiscounts: true,
    seasonalOffers: true,
    priceDrops: false,
    stockAlerts: true
  });

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e?.target === e?.currentTarget) {
      onClose();
    }
  };

  const handleSettingChange = (key, checked) => {
    setSettings(prev => ({ ...prev, [key]: checked }));
  };

  const handleSaveSettings = () => {
    console.log('Notification settings saved:', settings);
    onClose();
  };

  const notificationTypes = [
    {
      key: 'flashDeals',
      title: 'Flash Deals',
      description: 'Get notified about time-limited flash deals',
      icon: 'Zap'
    },
    {
      key: 'brandPromotions',
      title: 'Brand Promotions',
      description: 'Receive updates on brand-specific campaigns',
      icon: 'Award'
    },
    {
      key: 'bulkDiscounts',
      title: 'Bulk Discounts',
      description: 'Alerts for bulk purchase opportunities',
      icon: 'Package'
    },
    {
      key: 'seasonalOffers',
      title: 'Seasonal Offers',
      description: 'Festival and seasonal promotion alerts',
      icon: 'Calendar'
    },
    {
      key: 'priceDrops',
      title: 'Price Drops',
      description: 'Notify when prices drop on watched items',
      icon: 'TrendingDown'
    },
    {
      key: 'stockAlerts',
      title: 'Stock Alerts',
      description: 'Get notified when out-of-stock items are available',
      icon: 'Bell'
    }
  ];

  return (
    <div 
      className="fixed inset-0 z-500 bg-black/50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-card border border-border rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Notification Settings</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          <p className="text-sm text-muted-foreground">
            Choose which offer notifications you'd like to receive to stay updated on the best deals.
          </p>

          {/* Notification Types */}
          <div className="space-y-4">
            {notificationTypes?.map((type) => (
              <div key={type?.key} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Icon name={type?.icon} size={18} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-foreground">{type?.title}</h3>
                    <Checkbox
                      checked={settings?.[type?.key]}
                      onChange={(e) => handleSettingChange(type?.key, e?.target?.checked)}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{type?.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery Method */}
          <div className="border-t border-border pt-6">
            <h3 className="font-semibold text-foreground mb-3">Delivery Method</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Icon name="Smartphone" size={18} className="text-primary" />
                  <span className="font-medium text-foreground">Push Notifications</span>
                </div>
                <Checkbox checked disabled />
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Icon name="MessageSquare" size={18} className="text-primary" />
                  <span className="font-medium text-foreground">WhatsApp</span>
                </div>
                <Checkbox />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleSaveSettings}
              className="flex-1"
              iconName="Check"
              iconPosition="left"
            >
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;