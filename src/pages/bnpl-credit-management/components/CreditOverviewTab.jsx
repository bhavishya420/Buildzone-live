import React from 'react';
import Icon from '../../../components/AppIcon';
import CreditScoreSection from './CreditScoreSection';
import BuildScoreSection from './BuildScoreSection';

const CreditOverviewTab = () => {
  const features = [
    {
      icon: 'Calendar',
      title: 'Flexible Payment Terms',
      description: 'Choose from 15, 30, or 45-day payment cycles based on your business needs.',
      highlight: '45 Days Interest-Free'
    },
    {
      icon: 'TrendingUp',
      title: 'Credit Limit Growth',
      description: 'Your credit limit increases automatically based on payment history and business growth.',
      highlight: 'Up to ₹50,00,000'
    },
    {
      icon: 'FileText',
      title: 'Simple Documentation',
      description: 'Minimal paperwork required. Just GST certificate, bank statements, and basic KYC.',
      highlight: 'Quick Approval'
    },
    {
      icon: 'Smartphone',
      title: 'Digital Management',
      description: 'Track payments, view statements, and manage credit entirely through our mobile app.',
      highlight: 'Mobile First'
    }
  ];

  const eligibilityCriteria = [
    'Valid GST registration',
    'Minimum 1 year in business',
    'Monthly turnover of ₹2,00,000+',
    'Clean credit history',
    'Valid bank account and statements'
  ];

  const partnerBanks = [
    'HDFC Bank',
    'ICICI Bank',
    'Axis Bank',
    'Kotak Mahindra',
    'Yes Bank'
  ];

  return (
    <div className="space-y-8">
      {/* BuildScore Gamification Section - NEW */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-6">BuildScore Rewards</h3>
        <BuildScoreSection />
      </div>

      {/* Credit Score Section */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-6">Your Credit Profile</h3>
        <CreditScoreSection />
      </div>

      {/* Key Features */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-6">Key Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features?.map((feature, index) => (
            <div key={index} className="bg-surface border border-border rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name={feature?.icon} size={20} className="text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-foreground">{feature?.title}</h4>
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                      {feature?.highlight}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{feature?.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Eligibility Criteria */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="CheckCircle" size={20} className="text-success mr-2" />
          Eligibility Criteria
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {eligibilityCriteria?.map((criteria, index) => (
            <div key={index} className="flex items-center space-x-3">
              <Icon name="Check" size={16} className="text-success flex-shrink-0" />
              <span className="text-sm text-foreground">{criteria}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Partner Banks */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Building2" size={20} className="text-primary mr-2" />
          Partner Banks
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {partnerBanks?.map((bank, index) => (
            <div key={index} className="bg-surface border border-border rounded-lg p-4 text-center">
              <div className="w-8 h-8 bg-primary/10 rounded mx-auto mb-2 flex items-center justify-center">
                <Icon name="Building2" size={16} className="text-primary" />
              </div>
              <span className="text-xs font-medium text-foreground">{bank}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Interest Rates */}
      <div className="bg-gradient-to-r from-success/5 to-success/10 border border-success/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Percent" size={20} className="text-success mr-2" />
          Interest Rates & Charges
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-success mb-1">0%</div>
            <div className="text-sm text-muted-foreground">First 45 Days</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground mb-1">1.5%</div>
            <div className="text-sm text-muted-foreground">Monthly Interest</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground mb-1">₹500</div>
            <div className="text-sm text-muted-foreground">Processing Fee</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditOverviewTab;