import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import BottomNavigation from '../../components/ui/BottomNavigation';
import FloatingVoiceButton from '../../components/ui/FloatingVoiceButton';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ImageCarousel from './components/ImageCarousel';
import ProductInfo from './components/ProductInfo';
import ProductTabs from './components/ProductTabs';
import PriceComparison from './components/PriceComparison';
import QuantitySelector from './components/QuantitySelector';
import ActionButtons from './components/ActionButtons';
import RelatedProducts from './components/RelatedProducts';
import Breadcrumb from './components/Breadcrumb';

const ProductDetail = () => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Mock product data
  const productData = {
    id: "tap-001",
    name: "Premium Basin Mixer Tap with Chrome Finish",
    brand: "Jaquar",
    price: 3250,
    originalPrice: 4500,
    rating: 4.3,
    reviewCount: 127,
    sku: "JAQ-BM-001",
    availability: "In Stock",
    gstRate: 18,
    images: [
      "https://images.pexels.com/photos/6585759/pexels-photo-6585759.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/6585760/pexels-photo-6585760.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/6585761/pexels-photo-6585761.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/6585762/pexels-photo-6585762.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    specifications: {
      material: "Brass with Chrome Plating",
      mountingType: "Deck Mounted",
      spoutHeight: "150mm",
      spoutReach: "120mm",
      cartridge: "Ceramic Disc",
      warranty: "10 Years",
      waterPressure: "0.5 to 5 kg/cm²",
      threadSize: "1/2 inch BSP",
      finish: "Chrome",
      weight: "1.2 kg"
    },
    description: `This premium basin mixer tap combines elegant design with superior functionality. Crafted from high-grade brass with a lustrous chrome finish, it offers exceptional durability and corrosion resistance.

Key Features:
• Advanced ceramic disc cartridge for smooth operation and long life
• Water-saving aerator reduces consumption by up to 30%
• Easy single-lever operation for precise temperature and flow control
• Contemporary design complements modern bathroom aesthetics
• Lead-free construction ensures safe drinking water
• Easy installation with standard 1/2" BSP connections

Perfect for residential and commercial applications, this mixer tap is designed to withstand heavy usage while maintaining its premium appearance. The chrome finish is easy to clean and maintains its shine for years.

Installation includes all necessary mounting hardware and detailed instructions. Professional installation recommended for optimal performance.`,
    reviews: [
      {
        userName: "Rajesh Kumar",rating: 5,date: "15 Dec 2024",comment: "Excellent quality tap. Very smooth operation and looks premium. Installation was easy and it\'s working perfectly for 6 months now."
      },
      {
        userName: "Priya Sharma",rating: 4,date: "8 Dec 2024",comment: "Good product with nice finish. Water flow is consistent. Only issue is the packaging could be better to avoid scratches during shipping."
      },
      {
        userName: "Amit Patel",rating: 5,date: "2 Dec 2024",comment: "Best tap in this price range. Chrome finish is excellent and cartridge quality is very good. Highly recommended for bathroom renovation."
      }
    ]
  };

  // Mock price comparison data
  const priceComparisons = [
    {
      seller: "BuildMart",
      price: 3450,
      shipping: 0,
      rating: 4.2,
      reviews: 89
    },
    {
      seller: "SupplyHub",
      price: 3650,
      shipping: 50,
      rating: 4.0,
      reviews: 156
    },
    {
      seller: "TradeZone",
      price: 3350,
      shipping: 100,
      rating: 4.1,
      reviews: 67
    }
  ];

  // Mock related products
  const relatedProducts = [
    {
      id: "tap-002",
      name: "Wall Mounted Basin Mixer",
      image: "https://images.pexels.com/photos/6585763/pexels-photo-6585763.jpeg?auto=compress&cs=tinysrgb&w=400",
      price: 2850,
      originalPrice: 3200,
      rating: 4.1,
      reviews: 45
    },
    {
      id: "tap-003",
      name: "Sensor Basin Tap",
      image: "https://images.pexels.com/photos/6585764/pexels-photo-6585764.jpeg?auto=compress&cs=tinysrgb&w=400",
      price: 5200,
      originalPrice: 6000,
      rating: 4.5,
      reviews: 78
    },
    {
      id: "tap-004",
      name: "Pillar Cock Tap",
      image: "https://images.pexels.com/photos/6585765/pexels-photo-6585765.jpeg?auto=compress&cs=tinysrgb&w=400",
      price: 1850,
      originalPrice: 2100,
      rating: 4.0,
      reviews: 92
    },
    {
      id: "tap-005",
      name: "Kitchen Sink Mixer",
      image: "https://images.pexels.com/photos/6585766/pexels-photo-6585766.jpeg?auto=compress&cs=tinysrgb&w=400",
      price: 4200,
      originalPrice: 4800,
      rating: 4.4,
      reviews: 134
    }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleAddToCart = async (product, quantity) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Added to cart:', { product: product?.id, quantity });
  };

  const handleBuyNow = (product, quantity) => {
    console.log('Buy now:', { product: product?.id, quantity });
  };

  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-4 pb-20 px-4">
          {/* Loading skeleton */}
          <div className="animate-pulse space-y-6">
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-80 bg-muted rounded-lg"></div>
            <div className="space-y-3">
              <div className="h-6 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-8 bg-muted rounded w-1/3"></div>
            </div>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-4 pb-20">
        <div className="px-4 space-y-6">
          {/* Breadcrumb */}
          <Breadcrumb />

          {/* Back Button - Mobile */}
          <div className="flex items-center justify-between md:hidden">
            <Button
              variant="ghost"
              size="sm"
              iconName="ArrowLeft"
              iconPosition="left"
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <Icon name="Heart" size={20} />
              </Button>
              <Button variant="ghost" size="icon">
                <Icon name="Share2" size={20} />
              </Button>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Images */}
            <div className="space-y-6">
              <ImageCarousel 
                images={productData?.images} 
                productName={productData?.name}
              />
              
              {/* Price Comparison - Desktop */}
              <div className="hidden lg:block">
                <PriceComparison comparisons={priceComparisons} />
              </div>
            </div>

            {/* Right Column - Product Info */}
            <div className="space-y-6">
              <ProductInfo product={productData} />
              
              <QuantitySelector
                initialQuantity={quantity}
                onQuantityChange={handleQuantityChange}
                unit="pieces"
                maxQuantity={50}
              />
              
              <ActionButtons
                product={productData}
                quantity={quantity}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
              />
            </div>
          </div>

          {/* Product Tabs */}
          <ProductTabs product={productData} />

          {/* Price Comparison - Mobile */}
          <div className="lg:hidden">
            <PriceComparison comparisons={priceComparisons} />
          </div>

          {/* Related Products */}
          <RelatedProducts products={relatedProducts} />
        </div>
      </main>
      <BottomNavigation />
      <FloatingVoiceButton />
    </div>
  );
};

export default ProductDetail;