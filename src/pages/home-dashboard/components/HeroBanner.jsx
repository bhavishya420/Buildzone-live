import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

const HeroBanner = ({ heroOffers = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Default banners if no custom ones are available
  const defaultBanners = [
    {
      id: 'default-1',
      title: 'Premium Building Materials',
      description: 'Get the best quality materials for your construction needs',
      image_url: '/api/placeholder/1200/400',
      discount_percentage: 25,
      target_url: '/categories'
    },
    {
      id: 'default-2', 
      title: 'BNPL Credit Available',
      description: 'Shop now, pay later with our flexible credit options',
      image_url: '/api/placeholder/1200/400',
      discount_percentage: null,
      target_url: '/bnpl-credit-management'
    }
  ];

  const banners = heroOffers?.length > 0 ? heroOffers : defaultBanners;
  const totalSlides = banners?.length || 1;

  useEffect(() => {
    if (totalSlides > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [totalSlides]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const handleBannerClick = (targetUrl) => {
    if (targetUrl) {
      if (targetUrl?.startsWith('http')) {
        window.open(targetUrl, '_blank');
      } else {
        window.location.href = targetUrl;
      }
    }
  };

  if (!banners || banners?.length === 0) {
    return (
      <div className="relative h-48 bg-gradient-to-r from-primary to-primary/80 rounded-xl overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-primary-foreground">
            <h2 className="text-xl font-bold mb-2">Welcome to Buildzone</h2>
            <p className="text-primary-foreground/80">Your trusted construction partner</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-48 md:h-56 bg-surface rounded-xl overflow-hidden group">
      {/* Banner Content */}
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {banners?.map?.((banner, index) => (
          <div
            key={banner?.id || index}
            className="w-full flex-shrink-0 relative cursor-pointer"
            onClick={() => handleBannerClick(banner?.target_url)}
          >
            {/* Background Image or Gradient */}
            <div 
              className={`absolute inset-0 ${
                banner?.image_url && banner?.image_url !== '/api/placeholder/1200/400' ?'bg-cover bg-center' :'bg-gradient-to-r from-primary to-primary/80'
              }`}
              style={banner?.image_url && banner?.image_url !== '/api/placeholder/1200/400' ? {
                backgroundImage: `url(${banner?.image_url})`
              } : {}}
            >
              <div className="absolute inset-0 bg-black/30" />
            </div>

            {/* Content Overlay */}
            <div className="relative h-full flex items-center p-6">
              <div className="text-white max-w-lg">
                <h2 className="text-xl md:text-2xl font-bold mb-2">
                  {banner?.title}
                </h2>
                {banner?.description && (
                  <p className="text-white/90 text-sm md:text-base mb-4">
                    {banner?.description}
                  </p>
                )}
                
                {/* Discount Badge */}
                {banner?.discount_percentage && (
                  <div className="inline-flex items-center bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium mb-3">
                    {banner?.discount_percentage}% OFF
                  </div>
                )}

                {/* External Link Indicator */}
                {banner?.target_url && (
                  <div className="flex items-center text-white/80 text-sm">
                    <span className="mr-1">Click to explore</span>
                    <ExternalLink className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )) ?? null}
      </div>
      {/* Navigation Arrows */}
      {totalSlides > 1 && (
        <>
          <button
            onClick={(e) => {
              e?.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={(e) => {
              e?.stopPropagation();
              goToNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}
      {/* Dots Indicator */}
      {totalSlides > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {banners?.map?.((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e?.stopPropagation();
                goToSlide(index);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide 
                  ? 'bg-white w-6' :'bg-white/50 hover:bg-white/70'
              }`}
            />
          )) ?? null}
        </div>
      )}
    </div>
  );
};

export default HeroBanner;