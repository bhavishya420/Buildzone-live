import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const BestDealsCarousel = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  // Updated with 12 demo products across categories
  const bestDeals = [
    // Taps Category
    {
      id: 1,
      name: "Premium Bathroom Faucet",
      originalPrice: 4500,
      salePrice: 2999,
      discount: 33,
      image: "https://images.pexels.com/photos/6585759/pexels-photo-6585759.jpeg?auto=compress&cs=tinysrgb&w=400",
      brand: "Kohler",
      rating: 4.5,
      inStock: true,
      category: "Taps"
    },
    {
      id: 2,
      name: "Smart Sensor Faucet",
      originalPrice: 12000,
      salePrice: 8999,
      discount: 25,
      image: "https://images.pexels.com/photos/6585759/pexels-photo-6585759.jpeg?auto=compress&cs=tinysrgb&w=400",
      brand: "Grohe",
      rating: 4.7,
      inStock: true,
      category: "Taps"
    },
    {
      id: 3,
      name: "Kitchen Sink Mixer",
      originalPrice: 3500,
      salePrice: 2199,
      discount: 37,
      image: "https://images.pexels.com/photos/6585759/pexels-photo-6585759.jpeg?auto=compress&cs=tinysrgb&w=400",
      brand: "Jaquar",
      rating: 4.3,
      inStock: true,
      category: "Taps"
    },
    // Pipes Category
    {
      id: 4,
      name: "PVC Pipe 4 inch - 6m",
      originalPrice: 850,
      salePrice: 699,
      discount: 18,
      image: "https://images.pexels.com/photos/8293778/pexels-photo-8293778.jpeg?auto=compress&cs=tinysrgb&w=400",
      brand: "Supreme",
      rating: 4.2,
      inStock: true,
      category: "Pipes"
    },
    {
      id: 5,
      name: "CPVC Hot Water Pipe",
      originalPrice: 1200,
      salePrice: 899,
      discount: 25,
      image: "https://images.pexels.com/photos/8293778/pexels-photo-8293778.jpeg?auto=compress&cs=tinysrgb&w=400",
      brand: "Astral",
      rating: 4.4,
      inStock: true,
      category: "Pipes"
    },
    {
      id: 6,
      name: "PPR Pipe System",
      originalPrice: 1500,
      salePrice: 1099,
      discount: 27,
      image: "https://images.pexels.com/photos/8293778/pexels-photo-8293778.jpeg?auto=compress&cs=tinysrgb&w=400",
      brand: "Prince",
      rating: 4.1,
      inStock: true,
      category: "Pipes"
    },
    // Valves Category
    {
      id: 7,
      name: "Ball Valve 1/2 inch",
      originalPrice: 299,
      salePrice: 199,
      discount: 33,
      image: "https://images.pexels.com/photos/8293778/pexels-photo-8293778.jpeg?auto=compress&cs=tinysrgb&w=400",
      brand: "Jaquar",
      rating: 4.1,
      inStock: true,
      category: "Valves"
    },
    {
      id: 8,
      name: "Pressure Relief Valve",
      originalPrice: 799,
      salePrice: 599,
      discount: 25,
      image: "https://images.pexels.com/photos/8293778/pexels-photo-8293778.jpeg?auto=compress&cs=tinysrgb&w=400",
      brand: "L&T",
      rating: 4.5,
      inStock: true,
      category: "Valves"
    },
    // Tank Category
    {
      id: 9,
      name: "Water Storage Tank 500L",
      originalPrice: 12000,
      salePrice: 9999,
      discount: 17,
      image: "https://images.pexels.com/photos/6585759/pexels-photo-6585759.jpeg?auto=compress&cs=tinysrgb&w=400",
      brand: "Sintex",
      rating: 4.3,
      inStock: true,
      category: "Tanks"
    },
    {
      id: 10,
      name: "Overhead Water Tank 1000L",
      originalPrice: 18000,
      salePrice: 14999,
      discount: 17,
      image: "https://images.pexels.com/photos/6585759/pexels-photo-6585759.jpeg?auto=compress&cs=tinysrgb&w=400",
      brand: "Penguin",
      rating: 4.6,
      inStock: true,
      category: "Tanks"
    },
    // Tiles Category
    {
      id: 11,
      name: "Ceramic Wall Tiles",
      originalPrice: 1200,
      salePrice: 899,
      discount: 25,
      image: "https://images.pexels.com/photos/6585759/pexels-photo-6585759.jpeg?auto=compress&cs=tinysrgb&w=400",
      brand: "Kajaria",
      rating: 4.4,
      inStock: true,
      category: "Tiles"
    },
    {
      id: 12,
      name: "Vitrified Floor Tiles",
      originalPrice: 2500,
      salePrice: 1899,
      discount: 24,
      image: "https://images.pexels.com/photos/6585759/pexels-photo-6585759.jpeg?auto=compress&cs=tinysrgb&w=400",
      brand: "Somany",
      rating: 4.2,
      inStock: true,
      category: "Tiles"
    }
  ];

  // 3 Demo Offers
  const specialOffers = [
    {
      id: 'offer-1',
      title: 'Monsoon Special',
      description: 'Extra 20% off on all pipes and fittings',
      discount: '20% OFF',
      validTill: '31 Aug 2025',
      image: "https://images.pexels.com/photos/8293778/pexels-photo-8293778.jpeg?auto=compress&cs=tinysrgb&w=400",
      isOffer: true
    },
    {
      id: 'offer-2',
      title: 'Tank Combo Deal',
      description: 'Buy 2 tanks, get 1 valve free',
      discount: 'COMBO',
      validTill: '15 Sep 2025',
      image: "https://images.pexels.com/photos/6585759/pexels-photo-6585759.jpeg?auto=compress&cs=tinysrgb&w=400",
      isOffer: true
    },
    {
      id: 'offer-3',
      title: 'First Order Bonus',
      description: 'Flat ₹500 off + free delivery',
      discount: '₹500 OFF',
      validTill: '30 Sep 2025',
      image: "https://images.pexels.com/photos/6585759/pexels-photo-6585759.jpeg?auto=compress&cs=tinysrgb&w=400",
      isOffer: true
    }
  ];

  const allItems = [...specialOffers, ...bestDeals];

  const scroll = (direction) => {
    if (scrollRef?.current) {
      const scrollAmount = 280;
      scrollRef?.current?.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleProductClick = (product) => {
    if (product?.isOffer) {
      navigate('/offers-and-schemes');
    } else {
      navigate('/product-detail', { state: { product } });
    }
  };

  const handleQuickAdd = (e, product) => {
    e?.stopPropagation();
    console.log('Quick add product:', product?.name || product?.title);
    // Handle quick add to cart
  };

  return (
    <div className="bg-background">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Best Deals & Offers</h2>
          <p className="text-sm text-muted-foreground">Limited time offers & special deals</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/offers-and-schemes')}
          iconName="ArrowRight"
          iconPosition="right"
        >
          View All
        </Button>
      </div>
      <div className="relative">
        {/* Navigation Buttons */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm border border-border shadow-soft"
        >
          <Icon name="ChevronLeft" size={20} />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm border border-border shadow-soft"
        >
          <Icon name="ChevronRight" size={20} />
        </Button>

        {/* Products Carousel */}
        <div
          ref={scrollRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {allItems?.map((item) => (
            <div
              key={item?.id}
              onClick={() => handleProductClick(item)}
              className="flex-shrink-0 w-64 bg-card border border-border rounded-lg overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300 cursor-pointer"
            >
              {/* Product Image */}
              <div className="relative h-40 overflow-hidden">
                <Image
                  src={item?.image}
                  alt={item?.name || item?.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Discount Badge */}
                <div className={`absolute top-2 left-2 text-xs font-medium px-2 py-1 rounded ${
                  item?.isOffer 
                    ? 'bg-warning text-warning-foreground' 
                    : 'bg-error text-error-foreground'
                }`}>
                  {item?.discount || `${item?.discount}% OFF`}
                </div>

                {/* Category/Offer Badge */}
                <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm text-foreground text-xs px-2 py-1 rounded">
                  {item?.isOffer ? 'OFFER' : item?.category}
                </div>
              </div>

              {/* Item Info */}
              <div className="p-4">
                {item?.isOffer ? (
                  <>
                    <h3 className="font-bold text-foreground text-sm mb-2">
                      {item?.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      {item?.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Valid till {item?.validTill}
                      </span>
                      <Button variant="outline" size="sm">
                        View Offer
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground font-medium">{item?.brand}</span>
                      <div className="flex items-center space-x-1">
                        <Icon name="Star" size={12} className="text-warning fill-current" />
                        <span className="text-xs text-muted-foreground">{item?.rating}</span>
                      </div>
                    </div>

                    <h3 className="font-medium text-foreground text-sm mb-3 line-clamp-2">
                      {item?.name}
                    </h3>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-lg font-bold text-foreground">
                          ₹{item?.salePrice?.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-muted-foreground line-through">
                          ₹{item?.originalPrice?.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <Button
                        variant="default"
                        size="sm"
                        onClick={(e) => handleQuickAdd(e, item)}
                        disabled={!item?.inStock}
                        iconName="Plus"
                        iconPosition="left"
                      >
                        Add
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BestDealsCarousel;