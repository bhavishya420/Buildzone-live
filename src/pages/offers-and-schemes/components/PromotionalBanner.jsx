import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PromotionalBanner = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = [
    {
      id: 1,
      title: "Mega Monsoon Sale",
      subtitle: "Up to 40% OFF on Pipes & Fittings",
      description: "Premium quality pipes from top brands. Limited time offer!",
      image: "https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=800",
      discount: "40%",
      validUntil: "31st Aug 2025",
      ctaText: "Shop Now",
      bgGradient: "from-blue-600 to-blue-800"
    },
    {
      id: 2,
      title: "Festival Special",
      subtitle: "Ganesh Chaturthi Offers",
      description: "Special discounts on tiles and adhesives for your projects",
      image: "https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=800",
      discount: "35%",
      validUntil: "15th Sep 2025",
      ctaText: "Explore Deals",
      bgGradient: "from-orange-600 to-red-600"
    },
    {
      id: 3,
      title: "Bulk Purchase Bonanza",
      subtitle: "Extra 20% OFF on orders above ₹50,000",
      description: "Perfect for large projects and bulk requirements",
      image: "https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=800",
      discount: "20%",
      validUntil: "30th Sep 2025",
      ctaText: "Order Bulk",
      bgGradient: "from-green-600 to-emerald-700"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners?.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners?.length]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners?.length) % banners?.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners?.length);
  };

  const handleBannerClick = (banner) => {
    navigate('/categories-grid', { state: { offerFilter: banner?.id } });
  };

  return (
    <div className="relative h-64 md:h-80 overflow-hidden rounded-xl bg-gradient-to-r from-primary to-secondary">
      {/* Banner Slides */}
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {banners?.map((banner) => (
          <div
            key={banner?.id}
            className={`min-w-full h-full bg-gradient-to-r ${banner?.bgGradient} relative cursor-pointer`}
            onClick={() => handleBannerClick(banner)}
          >
            {/* Background Image Overlay */}
            <div className="absolute inset-0 bg-black/20" />
            
            {/* Content */}
            <div className="relative z-10 h-full flex items-center justify-between px-6 md:px-8">
              <div className="flex-1 text-white">
                {/* Discount Badge */}
                <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 mb-3">
                  <Icon name="Tag" size={16} className="mr-1" />
                  <span className="text-sm font-semibold">{banner?.discount} OFF</span>
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold mb-2">{banner?.title}</h2>
                <h3 className="text-lg md:text-xl font-medium mb-2 opacity-90">{banner?.subtitle}</h3>
                <p className="text-sm md:text-base opacity-80 mb-4 max-w-md">{banner?.description}</p>
                
                <div className="flex items-center space-x-4">
                  <Button
                    variant="default"
                    className="bg-white text-primary hover:bg-white/90"
                    iconName="ArrowRight"
                    iconPosition="right"
                  >
                    {banner?.ctaText}
                  </Button>
                  
                  <div className="text-sm opacity-80">
                    <Icon name="Clock" size={14} className="inline mr-1" />
                    Valid till {banner?.validUntil}
                  </div>
                </div>
              </div>
              
              {/* Banner Image */}
              <div className="hidden md:block w-48 h-48 ml-6">
                <Image
                  src={banner?.image}
                  alt={banner?.title}
                  className="w-full h-full object-cover rounded-lg opacity-80"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Navigation Arrows */}
      <button
        onClick={handlePrevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
      >
        <Icon name="ChevronLeft" size={20} />
      </button>
      <button
        onClick={handleNextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
      >
        <Icon name="ChevronRight" size={20} />
      </button>
      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {banners?.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default PromotionalBanner;