import React from 'react';
import { Vibrate, VolumeX, Smartphone, Accessibility } from 'lucide-react';
import Button from '../../../components/ui/Button';

const VibecodeSettings = ({ vibecodeEnabled, onToggleVibecode }) => {
  const settings = [
    {
      id: 'vibecode_enabled',
      title: 'Enable Vibecode',
      description: 'Allow haptic feedback for notifications',
      value: vibecodeEnabled,
      type: 'toggle'
    },
    {
      id: 'vibecode_intensity',
      title: 'Vibration Intensity',
      description: 'Adjust the strength of vibrations',
      value: 'medium',
      type: 'select',
      options: ['light', 'medium', 'strong']
    },
    {
      id: 'business_hours_only',
      title: 'Business Hours Only',
      description: 'Only vibrate during 9 AM - 6 PM',
      value: false,
      type: 'toggle'
    }
  ];

  const handleToggle = (settingId, currentValue) => {
    if (settingId === 'vibecode_enabled') {
      onToggleVibecode?.(!currentValue);
    }
    // Handle other settings here
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Vibrate className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Vibecode Settings</h2>
        <p className="text-muted-foreground">
          Customize your haptic feedback preferences
        </p>
      </div>
      {/* Settings List */}
      <div className="space-y-4">
        {settings?.map?.((setting) => (
          <div
            key={setting?.id}
            className="bg-card border border-border rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-foreground">{setting?.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {setting?.description}
                </p>
              </div>

              <div className="flex-shrink-0 ml-4">
                {setting?.type === 'toggle' && (
                  <Button
                    variant={setting?.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleToggle(setting?.id, setting?.value)}
                    className="min-w-[60px]"
                  >
                    {setting?.value ? 'ON' : 'OFF'}
                  </Button>
                )}

                {setting?.type === 'select' && (
                  <select className="px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm">
                    {setting?.options?.map?.((option) => (
                      <option key={option} value={option}>
                        {option?.charAt(0)?.toUpperCase() + option?.slice(1)}
                      </option>
                    )) ?? null}
                  </select>
                )}
              </div>
            </div>
          </div>
        )) ?? null}
      </div>
      {/* Device Compatibility */}
      <div className="bg-info/10 border border-info/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Smartphone className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-info-foreground mb-1">Device Compatibility</p>
            <p className="text-muted-foreground">
              Vibecode works best on mobile devices and tablets with haptic feedback support. 
              Desktop browsers may have limited vibration capabilities.
            </p>
          </div>
        </div>
      </div>
      {/* Accessibility Notice */}
      <div className="bg-success/10 border border-success/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Accessibility className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-success-foreground mb-1">Accessibility Feature</p>
            <p className="text-muted-foreground">
              Vibecode is designed to help users with hearing impairments or those working 
              in noisy environments stay informed about important notifications.
            </p>
          </div>
        </div>
      </div>
      {/* Test Section */}
      <div className="border-t border-border pt-6">
        <div className="text-center">
          <h3 className="font-medium text-foreground mb-3">Test Your Settings</h3>
          <Button 
            variant="outline" 
            disabled={!vibecodeEnabled}
            onClick={() => {
              if (vibecodeEnabled && 'vibrate' in navigator) {
                navigator.vibrate([200, 100, 200]);
              }
            }}
          >
            {vibecodeEnabled ? (
              <>
                <Vibrate className="w-4 h-4 mr-2" />
                Test Vibration
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 mr-2" />
                Enable to Test
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VibecodeSettings;