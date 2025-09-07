import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LegalSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const legalDocuments = [
    {
      title: 'Terms of Service',
      description: 'Terms and conditions for using Buildzone platform',
      lastUpdated: '15 Aug 2025',
      icon: 'FileText',
      action: () => console.log('Open Terms of Service')
    },
    {
      title: 'Privacy Policy',
      description: 'How we collect, use, and protect your data',
      lastUpdated: '10 Aug 2025',
      icon: 'Shield',
      action: () => console.log('Open Privacy Policy')
    },
    {
      title: 'BNPL Terms',
      description: 'Buy Now Pay Later credit terms and conditions',
      lastUpdated: '20 Aug 2025',
      icon: 'CreditCard',
      action: () => console.log('Open BNPL Terms')
    },
    {
      title: 'Return & Refund Policy',
      description: 'Product return and refund guidelines',
      lastUpdated: '05 Aug 2025',
      icon: 'RotateCcw',
      action: () => console.log('Open Return Policy')
    }
  ];

  const complianceCertifications = [
    {
      title: 'ISO 27001 Certified',
      description: 'Information Security Management',
      icon: 'Shield',
      verified: true
    },
    {
      title: 'GST Compliant',
      description: 'Goods and Services Tax compliance',
      icon: 'FileCheck',
      verified: true
    },
    {
      title: 'RBI Guidelines',
      description: 'Reserve Bank of India payment guidelines',
      icon: 'Landmark',
      verified: true
    },
    {
      title: 'Data Protection',
      description: 'GDPR and Indian data protection laws',
      icon: 'Lock',
      verified: true
    }
  ];

  return (
    <div className="bg-card border border-border rounded-xl shadow-soft">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-smooth rounded-xl"
      >
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
            <Icon name="Scale" size={20} className="text-error" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-foreground">Legal & Compliance</h3>
            <p className="text-sm text-muted-foreground">Terms, policies, and compliance information</p>
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
            {/* Legal Documents */}
            <div>
              <h4 className="text-md font-medium text-foreground mb-4 flex items-center space-x-2">
                <Icon name="FileText" size={18} className="text-primary" />
                <span>Legal Documents</span>
              </h4>
              <div className="space-y-3">
                {legalDocuments?.map((doc, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-smooth">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                          <Icon name={doc?.icon} size={16} className="text-muted-foreground" />
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-foreground">{doc?.title}</h5>
                          <p className="text-xs text-muted-foreground mt-1">{doc?.description}</p>
                          <p className="text-xs text-muted-foreground mt-2">Last updated: {doc?.lastUpdated}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="ExternalLink"
                        onClick={doc?.action}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Compliance Certifications */}
            <div>
              <h4 className="text-md font-medium text-foreground mb-4 flex items-center space-x-2">
                <Icon name="Award" size={18} className="text-success" />
                <span>Compliance & Certifications</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {complianceCertifications?.map((cert, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                        <Icon name={cert?.icon} size={16} className="text-success" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h5 className="text-sm font-medium text-foreground">{cert?.title}</h5>
                          {cert?.verified && (
                            <Icon name="CheckCircle" size={14} className="text-success" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{cert?.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Legal Team */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon name="Scale" size={20} className="text-primary" />
                  <div>
                    <h5 className="text-sm font-medium text-foreground">Legal Inquiries</h5>
                    <p className="text-xs text-muted-foreground">For legal questions or compliance concerns</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Mail"
                  iconPosition="left"
                  onClick={() => window.open('mailto:legal@buildzone.in')}
                >
                  Contact Legal
                </Button>
              </div>
            </div>

            {/* Data Rights */}
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <Icon name="Database" size={20} className="text-primary mt-0.5" />
                <div>
                  <h5 className="text-sm font-medium text-foreground">Your Data Rights</h5>
                  <p className="text-xs text-muted-foreground mt-1">
                    You have the right to access, modify, or delete your personal data. Contact our support team for data-related requests.
                  </p>
                  <div className="flex space-x-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      Download Data
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      Delete Account
                    </Button>
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

export default LegalSection;