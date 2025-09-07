import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Bell, CheckCircle2, AlertCircle, Truck, CreditCard } from 'lucide-react';
import Button from '../../../components/ui/Button';

const NotificationHistory = ({ notifications = [] }) => {
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order_confirmed':
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case 'out_for_delivery':
        return <Truck className="w-5 h-5 text-primary" />;
      case 'payment_due':
        return <CreditCard className="w-5 h-5 text-warning" />;
      case 'low_stock_alert':
        return <AlertCircle className="w-5 h-5 text-error" />;
      default:
        return <Bell className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getVibecodeIndicator = (pattern) => {
    const patternMap = {
      'short-short': '••',
      'long-short': '—•',
      'short-short-short': '•••',
      'short-long-short': '•—•'
    };
    
    return patternMap?.[pattern] || '•';
  };

  if (!notifications?.length) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Bell className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No notifications yet</h3>
        <p className="text-muted-foreground">
          Your notifications and vibecode history will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Recent Notifications</h2>
        <Button variant="outline" size="sm">
          Mark All Read
        </Button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications?.map?.((notification) => (
          <div
            key={notification?.id}
            className="bg-card border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-start gap-4">
              {/* Notification Icon */}
              <div className="flex-shrink-0 mt-0.5">
                {getNotificationIcon(notification?.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-medium text-foreground leading-5">
                      {notification?.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1 leading-5">
                      {notification?.message}
                    </p>
                  </div>

                  {/* Timestamp */}
                  <div className="flex-shrink-0 text-right">
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(notification?.timestamp, { addSuffix: true })}
                    </p>
                  </div>
                </div>

                {/* Vibecode Pattern */}
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Vibecode:</span>
                    <div className="bg-primary/20 px-2 py-1 rounded text-xs font-mono text-primary">
                      {getVibecodeIndicator(notification?.vibecodePattern)}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      ({notification?.vibecodePattern})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )) ?? null}
      </div>

      {/* Load More */}
      <div className="text-center pt-4">
        <Button variant="outline" className="w-full">
          Load More Notifications
        </Button>
      </div>
    </div>
  );
};

export default NotificationHistory;