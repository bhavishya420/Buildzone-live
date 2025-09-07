import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const PreferencesSection = ({ preferences, onUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('english');
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    offerAlerts: true,
    paymentReminders: true,
    priceDrops: false,
    newProducts: true,
    marketInsights: false
  });

  useEffect(() => {
    // Check localStorage for saved language preference
    const savedLanguage = localStorage.getItem('buildzone_language') || 'english';
    setCurrentLanguage(savedLanguage);
  }, []);

  const handleLanguageToggle = (language) => {
    setCurrentLanguage(language);
    localStorage.setItem('buildzone_language', language);
    onUpdate && onUpdate({ language });
    
    // Trigger app-wide language update
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: language }));
  };

  const handleNotificationChange = (key, value) => {
    const updatedNotifications = {
      ...notifications,
      [key]: value
    };
    setNotifications(updatedNotifications);
    onUpdate && onUpdate({ notifications: updatedNotifications });
  };

  const getLanguageText = (key) => {
    const texts = {
      english: {
        title: 'Preferences',
        subtitle: 'Language, notifications, and display settings',
        language: 'Language Settings',
        notifications: 'Notification Preferences',
        currency: 'Currency Format',
        orderUpdates: 'Order Updates',
        offerAlerts: 'Special Offers & Deals',
        paymentReminders: 'Payment Reminders',
        priceDrops: 'Price Drop Alerts',
        newProducts: 'New Product Launches',
        marketInsights: 'Market Insights'
      },
      hindi: {
        title: 'प्राथमिकताएं',
        subtitle: 'भाषा, सूचनाएं और डिस्प्ले सेटिंग्स',
        language: 'भाषा सेटिंग्स',
        notifications: 'सूचना प्राथमिकताएं',
        currency: 'मुद्रा प्रारूप',
        orderUpdates: 'ऑर्डर अपडेट',
        offerAlerts: 'विशेष ऑफर और सौदे',
        paymentReminders: 'भुगतान रिमाइंडर',
        priceDrops: 'मूल्य गिरावट अलर्ट',
        newProducts: 'नए उत्पाद लॉन्च',
        marketInsights: 'बाजार अंतर्दृष्टि'
      }
    };
    return texts?.[currentLanguage]?.[key] || texts?.english?.[key];
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-soft">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-smooth rounded-xl"
      >
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="Settings" size={20} className="text-accent" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-foreground">{getLanguageText('title')}</h3>
            <p className="text-sm text-muted-foreground">{getLanguageText('subtitle')}</p>
          </div>
        </div>
        <Icon 
          name="ChevronDown" 
          size={20} 
          className={`text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
        />
      </button>
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-border">
          <div className="space-y-8 pt-6">
            {/* Language Settings */}
            <div>
              <h4 className="text-md font-medium text-foreground mb-4 flex items-center space-x-2">
                <Icon name="Globe" size={18} className="text-primary" />
                <span>{getLanguageText('language')}</span>
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={currentLanguage === 'english' ? 'default' : 'outline'}
                  fullWidth
                  onClick={() => handleLanguageToggle('english')}
                  iconName="Check"
                  iconPosition="right"
                  className={currentLanguage === 'english' ? '' : 'text-muted-foreground'}
                >
                  English
                </Button>
                <Button
                  variant={currentLanguage === 'hindi' ? 'default' : 'outline'}
                  fullWidth
                  onClick={() => handleLanguageToggle('hindi')}
                  iconName="Check"
                  iconPosition="right"
                  className={currentLanguage === 'hindi' ? '' : 'text-muted-foreground'}
                >
                  हिंदी
                </Button>
              </div>
            </div>

            {/* Currency Format */}
            <div>
              <h4 className="text-md font-medium text-foreground mb-4 flex items-center space-x-2">
                <Icon name="IndianRupee" size={18} className="text-success" />
                <span>{getLanguageText('currency')}</span>
              </h4>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Indian Rupees (₹)</p>
                    <p className="text-xs text-muted-foreground">Format: ₹1,00,000</p>
                  </div>
                  <Icon name="Check" size={16} className="text-success" />
                </div>
              </div>
            </div>

            {/* Notification Preferences */}
            <div>
              <h4 className="text-md font-medium text-foreground mb-4 flex items-center space-x-2">
                <Icon name="Bell" size={18} className="text-warning" />
                <span>{getLanguageText('notifications')}</span>
              </h4>
              <div className="space-y-4">
                <Checkbox
                  label={getLanguageText('orderUpdates')}
                  description="Get notified about order status changes and delivery updates"
                  checked={notifications?.orderUpdates}
                  onChange={(e) => handleNotificationChange('orderUpdates', e?.target?.checked)}
                />
                <Checkbox
                  label={getLanguageText('offerAlerts')}
                  description="Receive alerts about special offers and promotional deals"
                  checked={notifications?.offerAlerts}
                  onChange={(e) => handleNotificationChange('offerAlerts', e?.target?.checked)}
                />
                <Checkbox
                  label={getLanguageText('paymentReminders')}
                  description="Reminders for pending payments and due dates"
                  checked={notifications?.paymentReminders}
                  onChange={(e) => handleNotificationChange('paymentReminders', e?.target?.checked)}
                />
                <Checkbox
                  label={getLanguageText('priceDrops')}
                  description="Alerts when prices drop on your wishlist items"
                  checked={notifications?.priceDrops}
                  onChange={(e) => handleNotificationChange('priceDrops', e?.target?.checked)}
                />
                <Checkbox
                  label={getLanguageText('newProducts')}
                  description="Notifications about new product launches in your categories"
                  checked={notifications?.newProducts}
                  onChange={(e) => handleNotificationChange('newProducts', e?.target?.checked)}
                />
                <Checkbox
                  label={getLanguageText('marketInsights')}
                  description="Weekly market trends and pricing insights"
                  checked={notifications?.marketInsights}
                  onChange={(e) => handleNotificationChange('marketInsights', e?.target?.checked)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreferencesSection;