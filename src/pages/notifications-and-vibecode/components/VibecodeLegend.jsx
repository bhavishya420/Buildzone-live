import React from 'react';
import { Play, Zap } from 'lucide-react';
import Button from '../../../components/ui/Button';

const VibecodeLegend = ({ onTestVibecode }) => {
  const vibecodePatterns = [
    {
      id: 'order_confirmed',
      name: 'Order Confirmed',
      pattern: 'short-short',
      description: 'Two quick pulses',
      icon: '✅',
      color: 'text-success'
    },
    {
      id: 'out_for_delivery',
      name: 'Out for Delivery',
      pattern: 'long-short',
      description: 'One long pulse, one short',
      icon: '🚚',
      color: 'text-primary'
    },
    {
      id: 'payment_due',
      name: 'Payment Due',
      pattern: 'short-short-short',
      description: 'Three quick pulses',
      icon: '💳',
      color: 'text-warning'
    },
    {
      id: 'low_stock_alert',
      name: 'Low Stock Alert',
      pattern: 'short-long-short',
      description: 'Short, long, short pulse',
      icon: '📦',
      color: 'text-error'
    }
  ];

  const handleTestPattern = (pattern) => {
    onTestVibecode?.(pattern);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6">
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Zap className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Vibecode System</h2>
        <p className="text-muted-foreground">
          Experience tactile notifications through unique vibration patterns
        </p>
      </div>

      {/* Vibecode Patterns */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground mb-4">Pattern Legend</h3>
        
        {vibecodePatterns?.map?.((item) => (
          <div
            key={item?.id}
            className="bg-card border border-border rounded-lg p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`text-2xl ${item?.color}`}>
                  {item?.icon}
                </div>
                <div>
                  <h4 className="font-medium text-foreground">{item?.name}</h4>
                  <p className="text-sm text-muted-foreground">{item?.description}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-xs font-mono text-muted-foreground mb-2">
                  {item?.pattern}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleTestPattern(item?.pattern)}
                  className="flex items-center gap-2"
                >
                  <Play className="w-3 h-3" />
                  Test
                </Button>
              </div>
            </div>

            {/* Visual Pattern Representation */}
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs text-muted-foreground">Pattern:</span>
              <div className="flex items-center gap-1">
                {item?.pattern?.split('-')?.map?.((pulse, index) => (
                  <div
                    key={index}
                    className={`bg-primary/60 rounded-full ${
                      pulse === 'short' ?'w-2 h-2' :'w-4 h-2'
                    }`}
                  />
                )) ?? null}
              </div>
            </div>
          </div>
        )) ?? null}
      </div>

      {/* Info Section */}
      <div className="bg-info/10 border border-info/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-info rounded-full mt-2 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-info-foreground mb-1">How Vibecode Works</p>
            <p className="text-muted-foreground">
              Each notification type has a unique vibration pattern. This allows you to identify 
              the type of notification without looking at your device - perfect for busy work environments.
            </p>
          </div>
        </div>
      </div>

      {/* Future Integration Notice */}
      <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-warning rounded-full mt-2 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-warning-foreground mb-1">Coming Soon</p>
            <p className="text-muted-foreground">
              Automatic vibecode triggers will be connected to real-time Supabase events 
              (new orders, payment updates, delivery status changes).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VibecodeLegend;