import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, FileText, TrendingUp } from 'lucide-react';
import Header from '../../components/ui/Header';
import BottomNavigation from '../../components/ui/BottomNavigation';
import CreditOverviewTab from './components/CreditOverviewTab';
import CreditApplicationTab from './components/CreditApplicationTab';
import CreditManagementTab from './components/CreditManagementTab';
import CreditHeroSection from './components/CreditHeroSection';
import BNPLApplicationForm from './components/BNPLApplicationForm';
import { useLanguage } from '../../hooks/useLanguage';
import Icon from '../../components/AppIcon';


const BNPLCreditManagement = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  const tabs = [
    {
      key: 'overview',
      label: 'Overview',
      icon: TrendingUp,
    },
    {
      key: 'apply',
      label: t('applyForCredit'),
      icon: FileText,
    },
    {
      key: 'manage',
      label: 'Manage',
      icon: CreditCard,
    },
  ];

  const creditData = {
    available: 0,
    used: 0,
    currency: '₹'
  };

  const handleApplicationSubmitted = (application) => {
    setShowApplicationForm(false);
    setActiveTab('overview');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <CreditOverviewTab />;
      case 'apply':
        return showApplicationForm ? (
          <BNPLApplicationForm 
            onApplicationSubmitted={handleApplicationSubmitted}
          />
        ) : (
          <CreditApplicationTab 
            onApplyClick={() => setShowApplicationForm(true)}
          />
        );
      case 'manage':
        return <CreditManagementTab />;
      default:
        return <CreditOverviewTab />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header creditData={creditData} />
      
      <main className="pb-20">
        {/* Header */}
        <div className="flex items-center px-4 py-4 border-b border-border">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-muted rounded-lg mr-3"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-xl font-semibold text-foreground">BNPL Credit</h1>
        </div>

        {/* Hero Section */}
        <CreditHeroSection onApplyNow={() => {
          setActiveTab('apply');
          setShowApplicationForm(true);
        }} />

        {/* Tab Navigation */}
        <div className="px-4 py-4">
          <div className="flex space-x-1 bg-muted p-1 rounded-lg">
            {tabs?.map?.((tab) => {
              const Icon = tab?.icon;
              return (
                <button
                  key={tab?.key}
                  onClick={() => {
                    setActiveTab(tab?.key);
                    if (tab?.key !== 'apply') {
                      setShowApplicationForm(false);
                    }
                  }}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab?.key
                      ? 'bg-surface text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:block">{tab?.label}</span>
                </button>
              );
            }) ?? null}
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-4 pb-6">
          {renderTabContent()}
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default BNPLCreditManagement;