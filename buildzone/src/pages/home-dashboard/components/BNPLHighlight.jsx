import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const BNPLHighlight = () => {
  const navigate = useNavigate();
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  const content = {
    en: "Buy Now • Up to ₹50L credit • 45 days interest-free",
    hi: "अब खरीदें • ₹50 लाख तक क्रेडिट • 45 दिनों तक बिना ब्याज"
  };

  const bnplFeatures = [
    {
      icon: "Calendar",
      title: "45 Days Interest-Free",
      description: "No interest charges for first 45 days"
    },
    {
      icon: "CreditCard",
      title: "Up to ₹50L Credit",
      description: "High credit limits for bulk purchases"
    },
    {
      icon: "Shield",
      title: "Instant Approval",
      description: "Quick KYC verification process"
    },
    {
      icon: "Truck",
      title: "Free Delivery",
      description: "No delivery charges on BNPL orders"
    }
  ];

  const handleApplyNow = () => {
    navigate('/bnpl-credit-management');
  };

  const handleLearnMore = () => {
    navigate('/bnpl-credit-management');
  };

  return (
    <div className="space-y-4">
      {/* BNPL Hero Snippet */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-4">
        <div className="text-center">
          <p className="text-white font-bold text-lg">
            {content?.[currentLanguage]}
          </p>
        </div>
      </div>
      {/* Existing BNPL Highlight Component */}
      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-6 border border-primary/20">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Icon name="CreditCard" size={32} className="text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            BNPL Credit Solutions
          </h2>
          <p className="text-muted-foreground text-sm">
            Flexible payment options for your business growth
          </p>
        </div>
        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {bnplFeatures?.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-background rounded-lg mb-3 shadow-soft">
                <Icon name={feature?.icon} size={20} className="text-primary" />
              </div>
              <h3 className="font-semibold text-foreground text-sm mb-1">
                {feature?.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                {feature?.description}
              </p>
            </div>
          ))}
        </div>
        {/* Credit Status */}
        <div className="bg-background rounded-lg p-4 mb-6 border border-border">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-foreground">Your Credit Status</span>
            <span className="text-xs text-muted-foreground">Not Applied</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">Available Credit</span>
                <span className="font-bold text-foreground">₹0</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full w-0 transition-all duration-300" />
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Limit</div>
              <div className="text-sm font-semibold text-foreground">₹50L</div>
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="default"
            onClick={handleApplyNow}
            iconName="ArrowRight"
            iconPosition="right"
            className="flex-1"
          >
            Apply for Credit
          </Button>
          <Button
            variant="outline"
            onClick={handleLearnMore}
            iconName="Info"
            iconPosition="left"
            className="flex-1"
          >
            Learn More
          </Button>
        </div>
        {/* Trust Indicators */}
        <div className="mt-6 pt-4 border-t border-border/50">
          <div className="flex items-center justify-center space-x-6 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="Shield" size={12} />
              <span>RBI Approved</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Lock" size={12} />
              <span>Secure KYC</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Users" size={12} />
              <span>10,000+ Users</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BNPLHighlight;