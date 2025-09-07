import React, { useState } from 'react';
import { Zap, Cpu, Shield, Globe, Play } from 'lucide-react';
import Button from '../../../components/ui/Button';

const AIFeaturePreview = () => {
  const [activeFeature, setActiveFeature] = useState('intelligence');

  const features = [
    {
      id: 'intelligence',
      name: 'Smart Intelligence',
      description: 'Advanced machine learning algorithms analyze your business patterns',
      icon: Cpu,
      details: [
        'Pattern recognition from purchase history',
        'Predictive analytics for demand forecasting',
        'Behavioral analysis for personalized recommendations',
        'Market trend integration for optimal timing'
      ],
      color: 'text-primary bg-primary/10'
    },
    {
      id: 'automation',
      name: 'Process Automation',
      description: 'Streamline workflows with intelligent automation capabilities',
      icon: Zap,
      details: [
        'Automated reorder triggers based on inventory levels',
        'Smart approval workflows for credit applications',
        'Dynamic pricing adjustments for bulk orders',
        'Intelligent supplier selection and negotiation'
      ],
      color: 'text-warning bg-warning/10'
    },
    {
      id: 'security',
      name: 'Enterprise Security',
      description: 'Bank-grade security with privacy-first AI processing',
      icon: Shield,
      details: [
        'End-to-end encryption for all AI processing',
        'GDPR compliant data handling and storage',
        'On-premise AI model deployment options',
        'Regular security audits and compliance reporting'
      ],
      color: 'text-success bg-success/10'
    },
    {
      id: 'integration',
      name: 'Seamless Integration',
      description: 'Connect with existing tools and platforms effortlessly',
      icon: Globe,
      details: [
        'API-first architecture for easy integration',
        'Pre-built connectors for popular ERP systems',
        'Webhook support for real-time data sync',
        'Custom integration support and consulting'
      ],
      color: 'text-secondary bg-secondary/10'
    }
  ];

  const activeFeatureData = features?.find?.(f => f?.id === activeFeature);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          AI-Powered Features Preview
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover the advanced capabilities that will power your AI agents and transform 
          your procurement experience.
        </p>
      </div>
      {/* Feature Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-2 bg-muted rounded-lg">
        {features?.map?.((feature) => {
          const IconComponent = feature?.icon;
          const isActive = activeFeature === feature?.id;
          
          return (
            <button
              key={feature?.id}
              onClick={() => setActiveFeature(feature?.id)}
              className={`p-3 rounded-md transition-all duration-200 text-center ${
                isActive
                  ? 'bg-card shadow-sm text-foreground'
                  : 'hover:bg-card/50 text-muted-foreground'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center ${
                isActive ? feature?.color : 'bg-muted text-muted-foreground'
              }`}>
                <IconComponent className="w-4 h-4" />
              </div>
              <div className="text-xs font-medium">{feature?.name}</div>
            </button>
          );
        }) ?? null}
      </div>
      {/* Active Feature Content */}
      {activeFeatureData && (
        <div className="bg-card border border-border rounded-xl p-6 shadow-soft">
          <div className="flex items-start gap-4 mb-6">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${activeFeatureData?.color}`}>
              <activeFeatureData.icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {activeFeatureData?.name}
              </h3>
              <p className="text-muted-foreground">
                {activeFeatureData?.description}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-foreground mb-4">Key Capabilities</h4>
              <ul className="space-y-3">
                {activeFeatureData?.details?.map?.((detail, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground leading-relaxed">
                      {detail}
                    </span>
                  </li>
                )) ?? null}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-muted/30 to-transparent rounded-lg p-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Interactive demo will be available when the feature launches
                </p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  disabled
                  className="opacity-50 cursor-not-allowed"
                >
                  Demo Coming Soon
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Technical Architecture Preview */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6 border border-primary/10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Technical Architecture
            </h3>
            <p className="text-muted-foreground text-sm">
              Built on cutting-edge AI and cloud-native technologies
            </p>
          </div>
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Cpu className="w-5 h-5 text-primary" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-card/50 rounded-lg">
            <div className="text-lg font-bold text-primary mb-1">GPT-4</div>
            <div className="text-xs text-muted-foreground">Language Model</div>
          </div>
          <div className="p-3 bg-card/50 rounded-lg">
            <div className="text-lg font-bold text-primary mb-1">TensorFlow</div>
            <div className="text-xs text-muted-foreground">ML Framework</div>
          </div>
          <div className="p-3 bg-card/50 rounded-lg">
            <div className="text-lg font-bold text-primary mb-1">PostgreSQL</div>
            <div className="text-xs text-muted-foreground">Vector Database</div>
          </div>
          <div className="p-3 bg-card/50 rounded-lg">
            <div className="text-lg font-bold text-primary mb-1">Kubernetes</div>
            <div className="text-xs text-muted-foreground">Orchestration</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIFeaturePreview;