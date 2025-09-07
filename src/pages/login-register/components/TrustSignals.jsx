import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const trustFeatures = [
    {
      icon: 'Shield',
      title: 'Secure Payments',
      description: 'Bank-grade security'
    },
    {
      icon: 'Clock',
      title: '24/7 Support',
      description: 'Always here to help'
    },
    {
      icon: 'CreditCard',
      title: 'BNPL Available',
      description: 'Up to ₹50L credit'
    },
    {
      icon: 'FileCheck',
      title: 'GST Compliant',
      description: 'Proper invoicing'
    }
  ];

  const certifications = [
    {
      name: 'ISO 27001',
      description: 'Information Security'
    },
    {
      name: 'PCI DSS',
      description: 'Payment Security'
    },
    {
      name: 'GSTN Certified',
      description: 'GST Network Partner'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Trust Features */}
      <div className="grid grid-cols-2 gap-4">
        {trustFeatures?.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center p-4 bg-surface rounded-lg"
          >
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
              <Icon name={feature?.icon} size={20} className="text-primary" />
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1">
              {feature?.title}
            </h3>
            <p className="text-xs text-muted-foreground">
              {feature?.description}
            </p>
          </div>
        ))}
      </div>
      {/* Statistics */}
      <div className="bg-primary/5 border border-primary/10 rounded-lg p-6">
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold text-foreground mb-2">
            Trusted by Retailers Across India
          </h3>
          <p className="text-sm text-muted-foreground">
            Join thousands of successful businesses
          </p>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary mb-1">10K+</div>
            <div className="text-xs text-muted-foreground">Active Retailers</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary mb-1">₹500Cr+</div>
            <div className="text-xs text-muted-foreground">Monthly GMV</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary mb-1">99.8%</div>
            <div className="text-xs text-muted-foreground">Uptime</div>
          </div>
        </div>
      </div>
      {/* Certifications */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground text-center">
          Security Certifications
        </h4>
        <div className="flex items-center justify-center space-x-6">
          {certifications?.map((cert, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-2 mx-auto">
                <Icon name="Award" size={20} className="text-success" />
              </div>
              <div className="text-xs font-medium text-foreground">{cert?.name}</div>
              <div className="text-xs text-muted-foreground">{cert?.description}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Customer Testimonial */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-primary-foreground">RK</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h5 className="text-sm font-semibold text-foreground">Rajesh Kumar</h5>
              <div className="flex items-center space-x-1">
                {[...Array(5)]?.map((_, i) => (
                  <Icon key={i} name="Star" size={12} className="text-warning fill-current" />
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              "Buildzone has transformed our procurement process. Easy ordering, reliable delivery, and excellent credit terms."
            </p>
            <div className="text-xs text-muted-foreground">
              Kumar Building Materials, Pune
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustSignals;