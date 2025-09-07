import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Zap, TrendingUp, CreditCard, Package, Sparkles, ArrowRight, Clock } from 'lucide-react';
import Header from '../../components/ui/Header';
import BottomNavigation from '../../components/ui/BottomNavigation';
import Button from '../../components/ui/Button';
import AIAgentCard from './components/AIAgentCard';
import DevelopmentTimeline from './components/DevelopmentTimeline';
import AIFeaturePreview from './components/AIFeaturePreview';
import { useLanguage } from '../../hooks/useLanguage';
import { useAuth } from '../../contexts/AuthContext';

const AILabBeta = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, profile } = useAuth();
  const [selectedAgent, setSelectedAgent] = useState(null);

  const aiAgents = [
    {
      id: 'reorder-agent',
      name: 'Reorder Agent',
      description: 'Will auto-suggest when stock is low',
      longDescription: 'Advanced AI that monitors your inventory patterns and automatically suggests reorders when stock levels drop below optimal thresholds. Learns from your purchasing history to predict demand.',
      icon: Package,
      status: 'coming_soon',
      progress: 75,
      estimatedLaunch: 'Q2 2025',
      features: [
        'Predictive stock monitoring',
        'Smart reorder suggestions',
        'Seasonal demand forecasting',
        'Bulk discount optimization'
      ],
      demoAvailable: false
    },
    {
      id: 'credit-agent',
      name: 'Credit Agent',
      description: 'Will auto-approve BNPL applications',
      longDescription: 'Intelligent credit assessment system that analyzes your business patterns, payment history, and market trends to instantly approve Buy Now Pay Later applications with optimal terms.',
      icon: CreditCard,
      status: 'in_development',
      progress: 60,
      estimatedLaunch: 'Q3 2025',
      features: [
        'Instant credit assessment',
        'Dynamic limit adjustments',
        'Risk-based pricing',
        'Alternative data analysis'
      ],
      demoAvailable: false
    },
    {
      id: 'offer-optimizer',
      name: 'Offer Optimizer',
      description: 'Will recommend best promotions',
      longDescription: 'Machine learning system that analyzes market conditions, your preferences, and supplier offers to recommend the most cost-effective deals and bulk purchase opportunities.',
      icon: TrendingUp,
      status: 'planning',
      progress: 25,
      estimatedLaunch: 'Q4 2025',
      features: [
        'Personalized offer matching',
        'Price trend analysis',
        'Bulk purchase optimization',
        'Supplier comparison engine'
      ],
      demoAvailable: false
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'coming_soon':
        return 'text-primary bg-primary/10 border-primary/20';
      case 'in_development':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'planning':
        return 'text-muted-foreground bg-muted/20 border-muted/30';
      default:
        return 'text-muted-foreground bg-muted/20 border-muted/30';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'coming_soon':
        return 'Coming Soon';
      case 'in_development':
        return 'In Development';
      case 'planning':
        return 'Planning';
      default:
        return 'Coming Soon';
    }
  };

  const creditData = {
    available: 0,
    used: 0,
    currency: '₹'
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header creditData={creditData} />
      {/* Main Content */}
      <main className="pb-20 pt-4">
        <div className="px-4 py-6 space-y-8">
          {/* Hero Section */}
          <div className="text-center bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 rounded-2xl p-8 border border-primary/10">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">
              AI Lab <span className="text-primary">Beta</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto leading-relaxed">
              Experience the future of AI-powered procurement automation. Our intelligent agents will transform 
              how you manage inventory, credit, and purchasing decisions.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-primary">
              <Sparkles className="w-4 h-4" />
              <span className="font-medium">Powered by Advanced Machine Learning</span>
            </div>
          </div>

          {/* AI Agents Grid */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">AI Agent Roadmap</h2>
                <p className="text-muted-foreground mt-1">
                  Intelligent automation for modern B2B procurement
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/home-dashboard')}
              >
                Back to Dashboard
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiAgents?.map?.((agent) => (
                <AIAgentCard
                  key={agent?.id}
                  agent={agent}
                  onSelect={() => setSelectedAgent(agent)}
                />
              )) ?? null}
            </div>
          </section>

          {/* Development Timeline */}
          <section>
            <DevelopmentTimeline agents={aiAgents} />
          </section>

          {/* Feature Preview */}
          <section>
            <AIFeaturePreview />
          </section>

          {/* Beta Program CTA */}
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-xl p-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Join the AI Beta Program
                </h3>
                <p className="text-muted-foreground mb-4">
                  Get early access to AI features and help shape the future of intelligent procurement.
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-success rounded-full" />
                    <span className="text-muted-foreground">Early access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-muted-foreground">Priority support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-warning rounded-full" />
                    <span className="text-muted-foreground">Exclusive features</span>
                  </div>
                </div>
              </div>
              <Button className="flex items-center gap-2">
                Request Access
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Current AI Features Notice */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Available Now: Voice Ordering Demo
                </h3>
                <p className="text-muted-foreground mb-4">
                  Experience our current AI capabilities with the Voice Ordering system. 
                  Use the floating microphone button on the Home page to try speech-to-text ordering.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/home-dashboard')}
                  className="flex items-center gap-2"
                >
                  Try Voice Ordering
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Bottom Navigation */}
      <BottomNavigation />
      {/* Agent Detail Modal */}
      {selectedAgent && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedAgent(null)}
        >
          <div 
            className="bg-card rounded-2xl w-full max-w-lg shadow-2xl border border-border"
            onClick={(e) => e?.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getStatusColor(selectedAgent?.status)}`}>
                  <selectedAgent.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{selectedAgent?.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(selectedAgent?.status)}`}>
                    {getStatusText(selectedAgent?.status)}
                  </span>
                </div>
              </div>

              <p className="text-muted-foreground mb-6">{selectedAgent?.longDescription}</p>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Key Features</h4>
                  <ul className="space-y-2">
                    {selectedAgent?.features?.map?.((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        {feature}
                      </li>
                    )) ?? null}
                  </ul>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Development Progress</span>
                    <span className="text-sm text-muted-foreground">{selectedAgent?.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${selectedAgent?.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Estimated Launch: {selectedAgent?.estimatedLaunch}</span>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button 
                  variant="outline" 
                  fullWidth
                  onClick={() => setSelectedAgent(null)}
                >
                  Close
                </Button>
                <Button 
                  fullWidth
                  disabled
                  className="opacity-50 cursor-not-allowed"
                >
                  Coming Soon
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AILabBeta;