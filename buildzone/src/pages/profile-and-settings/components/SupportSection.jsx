import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SupportSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const supportChannels = [
    {
      id: 'phone',
      title: 'Phone Support',
      description: 'Speak directly with our support team',
      contact: '+91 1800-123-4567',
      hours: 'Mon-Sat: 9:00 AM - 7:00 PM',
      icon: 'Phone',
      color: 'text-primary bg-primary/10',
      action: () => window.open('tel:+911800123456')
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp Support',
      description: 'Quick help via WhatsApp chat',
      contact: '+91 98765-43210',
      hours: '24/7 Available',
      icon: 'MessageCircle',
      color: 'text-success bg-success/10',
      action: () => window.open('https://wa.me/919876543210')
    },
    {
      id: 'email',
      title: 'Email Support',
      description: 'Send us your detailed queries',
      contact: 'support@buildzone.in',
      hours: 'Response within 24 hours',
      icon: 'Mail',
      color: 'text-warning bg-warning/10',
      action: () => window.open('mailto:support@buildzone.in')
    }
  ];

  const helpTopics = [
    {
      title: 'Order Management',
      description: 'Track orders, modify requests, returns',
      icon: 'Package',
      articles: 12
    },
    {
      title: 'Payment & BNPL',
      description: 'Credit limits, payment methods, billing',
      icon: 'CreditCard',
      articles: 8
    },
    {
      title: 'Account & Verification',
      description: 'Profile setup, document upload, KYC',
      icon: 'Shield',
      articles: 6
    },
    {
      title: 'Product Information',
      description: 'Specifications, availability, pricing',
      icon: 'Info',
      articles: 15
    }
  ];

  return (
    <div className="bg-card border border-border rounded-xl shadow-soft">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-smooth rounded-xl"
      >
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
            <Icon name="HelpCircle" size={20} className="text-success" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-foreground">Support & Help</h3>
            <p className="text-sm text-muted-foreground">Get help and contact our support team</p>
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
            {/* Contact Channels */}
            <div>
              <h4 className="text-md font-medium text-foreground mb-4 flex items-center space-x-2">
                <Icon name="Headphones" size={18} className="text-primary" />
                <span>Contact Support</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {supportChannels?.map((channel) => (
                  <div key={channel?.id} className="p-4 border border-border rounded-lg hover:shadow-soft transition-smooth">
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${channel?.color}`}>
                        <Icon name={channel?.icon} size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-medium text-foreground">{channel?.title}</h5>
                        <p className="text-xs text-muted-foreground mt-1">{channel?.description}</p>
                        <p className="text-xs font-medium text-foreground mt-2 font-mono">{channel?.contact}</p>
                        <p className="text-xs text-muted-foreground">{channel?.hours}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3 w-full"
                          onClick={channel?.action}
                          iconName="ExternalLink"
                          iconPosition="right"
                        >
                          Contact
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Help Center */}
            <div>
              <h4 className="text-md font-medium text-foreground mb-4 flex items-center space-x-2">
                <Icon name="BookOpen" size={18} className="text-warning" />
                <span>Help Center</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {helpTopics?.map((topic, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-smooth cursor-pointer">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                        <Icon name={topic?.icon} size={16} className="text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <h5 className="text-sm font-medium text-foreground">{topic?.title}</h5>
                        <p className="text-xs text-muted-foreground mt-1">{topic?.description}</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-muted-foreground">{topic?.articles} articles</span>
                          <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Quick Access */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon name="MessageSquare" size={20} className="text-primary" />
                  <div>
                    <h5 className="text-sm font-medium text-foreground">Frequently Asked Questions</h5>
                    <p className="text-xs text-muted-foreground">Find quick answers to common questions</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="ArrowRight"
                  iconPosition="right"
                >
                  View FAQ
                </Button>
              </div>
            </div>

            {/* Business Hours */}
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <Icon name="Clock" size={20} className="text-primary mt-0.5" />
                <div>
                  <h5 className="text-sm font-medium text-foreground">Business Hours</h5>
                  <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                    <p>Monday - Friday: 9:00 AM - 7:00 PM</p>
                    <p>Saturday: 9:00 AM - 5:00 PM</p>
                    <p>Sunday: Closed</p>
                    <p className="text-primary font-medium mt-2">WhatsApp support available 24/7</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportSection;