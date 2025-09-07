import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import BottomNavigation from '../../components/ui/BottomNavigation';
import FloatingVoiceButton from '../../components/ui/FloatingVoiceButton';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import PromotionalBanner from './components/PromotionalBanner';
import OfferFilters from './components/OfferFilters';
import OfferSection from './components/OfferSection';
import OfferDetailModal from './components/OfferDetailModal';
import NotificationSettings from './components/NotificationSettings';

const OffersAndSchemes = () => {
  const [filters, setFilters] = useState({
    offerType: 'all',
    brand: 'all',
    category: 'all',
    discountRange: 'all'
  });
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotificationSettingsOpen, setIsNotificationSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mock offers data
  const allOffers = [
    // Flash Deals
    {
      id: 1,
      type: 'flash',
      title: 'Premium Bathroom Faucets Flash Sale',
      description: 'Limited time offer on premium bathroom faucets from top brands. Hurry, only few hours left!',
      image: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=800',
      discount: 45,
      originalPrice: 8500,
      salePrice: 4675,
      savings: 3825,
      validUntil: '31st Aug 2025',
      endTime: '2025-08-30T23:59:59',
      stockLeft: 15,
      minOrder: 5000,
      brand: 'hindware',
      category: 'taps',
      eligibleProducts: ['Basin Mixers', 'Shower Mixers', 'Kitchen Taps']
    },
    {
      id: 2,
      type: 'flash',
      title: 'PVC Pipes Mega Deal',
      description: 'Flash sale on high-quality PVC pipes. Perfect for plumbing projects.',
      image: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=800',
      discount: 35,
      originalPrice: 12000,
      salePrice: 7800,
      savings: 4200,
      validUntil: '30th Aug 2025',
      endTime: '2025-08-30T18:00:00',
      stockLeft: 8,
      brand: 'all',
      category: 'pipes'
    },

    // Brand Promotions
    {
      id: 3,
      type: 'brand',
      title: 'Cera Sanitaryware Festival',
      description: 'Exclusive Cera brand promotion with amazing discounts on complete bathroom solutions.',
      image: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=800',
      discount: 30,
      originalPrice: 25000,
      salePrice: 17500,
      savings: 7500,
      validUntil: '15th Sep 2025',
      minOrder: 15000,
      brand: 'cera',
      category: 'taps',
      eligibleProducts: ['Wash Basins', 'Water Closets', 'Faucets', 'Accessories']
    },
    {
      id: 4,
      type: 'brand',
      title: 'Jaquar Premium Collection',
      description: 'Luxury bathroom fittings from Jaquar at unbeatable prices.',
      image: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=800',
      discount: 25,
      originalPrice: 35000,
      salePrice: 26250,
      savings: 8750,
      validUntil: '20th Sep 2025',
      brand: 'jaquar',
      category: 'taps'
    },

    // Bulk Discounts
    {
      id: 5,
      type: 'bulk',
      title: 'Bulk Tile Adhesive Bonanza',
      description: 'Special bulk pricing on premium tile adhesives. Perfect for large construction projects.',
      image: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=800',
      discount: 20,
      originalPrice: 50000,
      salePrice: 40000,
      savings: 10000,
      validUntil: '30th Sep 2025',
      minOrder: 50000,
      brand: 'all',
      category: 'adhesives'
    },
    {
      id: 6,
      type: 'bulk',
      title: 'Water Tank Bulk Purchase',
      description: 'Bulk discounts on water storage tanks. Ideal for residential and commercial projects.',
      image: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=800',
      discount: 18,
      originalPrice: 75000,
      salePrice: 61500,
      savings: 13500,
      validUntil: '25th Sep 2025',
      minOrder: 75000,
      brand: 'all',
      category: 'tanks'
    },

    // Seasonal Offers
    {
      id: 7,
      type: 'seasonal',
      title: 'Ganesh Chaturthi Special',
      description: 'Celebrate Ganesh Chaturthi with special discounts on home improvement materials.',
      image: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=800',
      discount: 28,
      originalPrice: 18000,
      salePrice: 12960,
      savings: 5040,
      validUntil: '15th Sep 2025',
      brand: 'all',
      category: 'tiles'
    },
    {
      id: 8,
      type: 'seasonal',
      title: 'Monsoon Plumbing Solutions',
      description: 'Monsoon-ready plumbing solutions at special prices. Prepare for the rainy season.',
      image: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=800',
      discount: 22,
      originalPrice: 15000,
      salePrice: 11700,
      savings: 3300,
      validUntil: '10th Sep 2025',
      brand: 'all',
      category: 'pipes'
    }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const filterOffers = (offers, filters) => {
    return offers?.filter(offer => {
      if (filters?.offerType !== 'all' && offer?.type !== filters?.offerType) return false;
      if (filters?.brand !== 'all' && offer?.brand !== filters?.brand && offer?.brand !== 'all') return false;
      if (filters?.category !== 'all' && offer?.category !== filters?.category) return false;
      
      if (filters?.discountRange !== 'all') {
        const discount = offer?.discount;
        switch (filters?.discountRange) {
          case '0-10': return discount <= 10;
          case '10-25': return discount > 10 && discount <= 25;
          case '25-40': return discount > 25 && discount <= 40;
          case '40+': return discount > 40;
          default: return true;
        }
      }
      
      return true;
    });
  };

  const filteredOffers = filterOffers(allOffers, filters);

  const getOffersByType = (type) => {
    return filteredOffers?.filter(offer => offer?.type === type);
  };

  const handleOfferClick = (offer) => {
    setSelectedOffer(offer);
    setIsModalOpen(true);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>Offers & Schemes - Buildzone</title>
          <meta name="description" content="Discover amazing offers and schemes on building materials" />
        </Helmet>
        <Header />
        <div className="pt-4 pb-20">
          {/* Loading Skeleton */}
          <div className="px-4 space-y-6">
            <div className="h-64 bg-muted rounded-xl animate-pulse" />
            <div className="h-16 bg-muted rounded-lg animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6]?.map((i) => (
                <div key={i} className="space-y-4">
                  <div className="h-48 bg-muted rounded-xl animate-pulse" />
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Offers & Schemes - Buildzone</title>
        <meta name="description" content="Discover amazing offers and schemes on building materials. Flash deals, brand promotions, bulk discounts and seasonal offers." />
        <meta name="keywords" content="offers, schemes, deals, discounts, building materials, flash sale" />
      </Helmet>
      <Header />
      <main className="pt-4 pb-20">
        {/* Page Header */}
        <div className="px-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Offers & Schemes</h1>
              <p className="text-muted-foreground">Save more on your building material purchases</p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsNotificationSettingsOpen(true)}
            >
              <Icon name="Settings" size={20} />
            </Button>
          </div>
        </div>

        {/* Promotional Banner */}
        <div className="px-4 mb-6">
          <PromotionalBanner />
        </div>

        {/* Filters */}
        <OfferFilters 
          onFiltersChange={handleFiltersChange}
          appliedFilters={filters}
        />

        {/* Offers Content */}
        <div className="px-4 space-y-8 mt-6">
          {filteredOffers?.length === 0 ? (
            // Empty State
            (<div className="text-center py-16">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="Tag" size={32} className="text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No Offers Found</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                No offers match your current filters. Try adjusting your filters or browse our categories for the latest deals.
              </p>
              <Button
                variant="default"
                onClick={() => handleFiltersChange({
                  offerType: 'all',
                  brand: 'all',
                  category: 'all',
                  discountRange: 'all'
                })}
              >
                Clear Filters
              </Button>
            </div>)
          ) : (
            <>
              {/* Flash Deals */}
              <OfferSection
                title="Flash Deals"
                subtitle="Limited time offers - Act fast!"
                icon="Zap"
                offers={getOffersByType('flash')}
                emptyMessage="No flash deals available right now. Check back soon!"
              />

              {/* Brand Promotions */}
              <OfferSection
                title="Brand Promotions"
                subtitle="Exclusive brand campaigns and partnerships"
                icon="Award"
                offers={getOffersByType('brand')}
                emptyMessage="No brand promotions currently active."
              />

              {/* Bulk Discounts */}
              <OfferSection
                title="Bulk Discounts"
                subtitle="Save more when you buy in bulk"
                icon="Package"
                offers={getOffersByType('bulk')}
                emptyMessage="No bulk discount offers available."
              />

              {/* Seasonal Offers */}
              <OfferSection
                title="Seasonal Offers"
                subtitle="Festival and seasonal special deals"
                icon="Calendar"
                offers={getOffersByType('seasonal')}
                emptyMessage="No seasonal offers currently running."
              />
            </>
          )}
        </div>
      </main>
      {/* Offer Detail Modal */}
      <OfferDetailModal
        offer={selectedOffer}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      {/* Notification Settings Modal */}
      <NotificationSettings
        isOpen={isNotificationSettingsOpen}
        onClose={() => setIsNotificationSettingsOpen(false)}
      />
      <BottomNavigation />
      <FloatingVoiceButton />
    </div>
  );
};

export default OffersAndSchemes;