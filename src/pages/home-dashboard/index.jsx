import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Header from '../../components/ui/Header';
import BottomNavigation from '../../components/ui/BottomNavigation';
import FloatingVoiceButton from '../../components/ui/FloatingVoiceButton';
import HeroBanner from './components/HeroBanner';
import BestDealsCarousel from './components/BestDealsCarousel';
import NewProductsGrid from './components/NewProductsGrid';
import BNPLHighlight from './components/BNPLHighlight';
import QuickAccessShortcuts from './components/QuickAccessShortcuts';
import BrandHeroSlotForm from './components/BrandHeroSlotForm';
import { useLanguage } from '../../hooks/useLanguage';
import { useAuth } from '../../contexts/AuthContext';

// ✅ Import ProductSearch
import ProductSearch from '../../components/ProductSearch';

const HomeDashboard = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, profile } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showBrandHeroForm, setShowBrandHeroForm] = useState(false);
  const [heroOffers, setHeroOffers] = useState([]);

  useEffect(() => {
    // Load hero offers from localStorage or API
    const savedOffers = localStorage?.getItem('heroOffers');
    if (savedOffers) {
      setHeroOffers(JSON.parse(savedOffers));
    }
  }, []);

  const handlePullToRefresh = async () => {
    setIsRefreshing(true);

    // Simulate refresh delay
    setTimeout(() => {
      setIsRefreshing(false);
      console.log('Content refreshed');
    }, 1500);
  };

  const handleBannerPublished = (newBanner) => {
    const updatedOffers = [newBanner, ...heroOffers];
    setHeroOffers(updatedOffers);
    localStorage?.setItem('heroOffers', JSON.stringify(updatedOffers));
  };

  const creditData = {
    available: 0,
    used: 0,
    currency: '₹',
  };

  // Check if user has admin role or is authenticated to show admin features
  const canManageBanners =
    user && (profile?.role === 'admin' || user?.email?.includes('admin'));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header creditData={creditData} />

      {/* ✅ Product Search Bar */}
      <div className="px-4 mt-4">
        <ProductSearch />
      </div>

      {/* Main Content */}
      <main className="pb-20">
        {/* Pull to Refresh Indicator */}
        {isRefreshing && (
          <div className="fixed top-16 left-0 right-0 z-50 bg-primary text-primary-foreground text-center py-2 text-sm">
            Refreshing content...
          </div>
        )}

        <div className="px-4 py-6 space-y-8">
          {/* Hero Banner with Admin Controls */}
          <section className="relative">
            <HeroBanner heroOffers={heroOffers} />

            {/* Admin: Add Hero Banner Button */}
            {canManageBanners && (
              <button
                onClick={() => setShowBrandHeroForm(true)}
                className="absolute top-4 right-4 bg-primary text-primary-foreground p-2 rounded-full shadow-lg hover:bg-primary/90 transition-colors z-10"
                title="Add Hero Banner"
              >
                <Plus className="w-5 h-5" />
              </button>
            )}
          </section>

          {/* Quick Access Shortcuts */}
          <section>
            <QuickAccessShortcuts />
          </section>

          {/* Best Deals Carousel */}
          <section>
            <BestDealsCarousel />
          </section>

          {/* New Products Grid */}
          <section>
            <NewProductsGrid />
          </section>

          {/* BNPL Highlight */}
          <section>
            <BNPLHighlight />
          </section>

          {/* Additional Features */}
          <section className="bg-surface rounded-xl p-6">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-foreground mb-2">
                Why Choose Buildzone?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">10,000+</div>
                  <div className="text-sm text-muted-foreground">Happy Retailers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">24/7</div>
                  <div className="text-sm text-muted-foreground">Customer Support</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">₹50L</div>
                  <div className="text-sm text-muted-foreground">Max Credit Limit</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />

      {/* Floating Voice Button */}
      <FloatingVoiceButton />

      {/* Brand Hero Slot Form Modal */}
      {showBrandHeroForm && (
        <BrandHeroSlotForm
          onBannerPublished={handleBannerPublished}
          onClose={() => setShowBrandHeroForm(false)}
        />
      )}
    </div>
  );
};

export default HomeDashboard;
