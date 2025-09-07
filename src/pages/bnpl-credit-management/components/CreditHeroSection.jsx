import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CreditHeroSection = ({ onApplyNow }) => {
  const benefits = [
    {
      icon: 'Clock',
      title: '45 Days Interest-Free',
      description: 'No interest charges for first 45 days'
    },
    {
      icon: 'CreditCard',
      title: 'Up to ₹50L Credit',
      description: 'High credit limits for your business'
    },
    {
      icon: 'CheckCircle',
      title: 'Quick Approval',
      description: 'Get approved in 24-48 hours'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-primary/5 to-primary/10 px-4 py-8 md:py-12">
      <div className="max-w-6xl mx-auto">
        {/* Hero Content */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
            BNPL Credit Solutions
          </h1>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Grow your business with flexible payment terms. Get instant credit approval and manage your cash flow efficiently.
          </p>
          <Button 
            variant="default" 
            size="lg"
            onClick={onApplyNow}
            iconName="ArrowRight"
            iconPosition="right"
            className="px-8"
          >
            Apply for Credit
          </Button>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits?.map((benefit, index) => (
            <div key={index} className="bg-card border border-border rounded-xl p-6 text-center shadow-soft">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name={benefit?.icon} size={24} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {benefit?.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {benefit?.description}
              </p>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Icon name="Shield" size={16} className="text-success" />
              <span>RBI Approved</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Lock" size={16} className="text-success" />
              <span>256-bit SSL Encryption</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Users" size={16} className="text-success" />
              <span>10,000+ Retailers Trust Us</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditHeroSection;