import React from 'react';
import { useNavigate } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const NewProductsGrid = () => {
  const navigate = useNavigate();

  const newProducts = [
    {
      id: 1,
      name: "Smart Sensor Faucet",
      price: 8999,
      image: "https://images.pixabay.com/photo/2020/07/08/04/12/work-5382501_1280.jpg?auto=compress&cs=tinysrgb&w=400",
      brand: "Grohe",
      isNew: true,
      category: "Taps",
      features: ["Touch-free", "Battery operated"]
    },
    {
      id: 2,
      name: "CPVC Pipe System",
      price: 1299,
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=400&q=80",
      brand: "Astral",
      isNew: true,
      category: "Pipes",
      features: ["Hot water resistant", "ISI certified"]
    },
    {
      id: 3,
      name: "Overhead Water Tank",
      price: 15999,
      image: "https://images.pexels.com/photos/6585759/pexels-photo-6585759.jpeg?auto=compress&cs=tinysrgb&w=400",
      brand: "Penguin",
      isNew: true,
      category: "Tanks",
      features: ["UV resistant", "10 year warranty"]
    },
    {
      id: 4,
      name: "Pressure Relief Valve",
      price: 599,
      image: "https://images.pixabay.com/photo/2017/09/07/08/54/money-2724241_1280.jpg?auto=compress&cs=tinysrgb&w=400",
      brand: "L&T",
      isNew: true,
      category: "Valves",
      features: ["Brass body", "High pressure rated"]
    }
  ];

  const handleProductClick = (product) => {
    navigate('/product-detail', { state: { product } });
  };

  const handleQuickAdd = (e, product) => {
    e?.stopPropagation();
    console.log('Quick add product:', product?.name);
    // Handle quick add to cart
  };

  return (
    <div className="bg-background">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">New Products</h2>
          <p className="text-sm text-muted-foreground">Latest arrivals this month</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/categories-grid')}
          iconName="ArrowRight"
          iconPosition="right"
        >
          View All
        </Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {newProducts?.map((product) => (
          <div
            key={product?.id}
            onClick={() => handleProductClick(product)}
            className="bg-card border border-border rounded-lg overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300 cursor-pointer"
          >
            {/* Product Image */}
            <div className="relative h-32 md:h-40 overflow-hidden">
              <Image
                src={product?.image}
                alt={product?.name}
                className="w-full h-full object-cover"
              />
              
              {/* New Badge */}
              {product?.isNew && (
                <div className="absolute top-2 left-2 bg-success text-success-foreground text-xs font-medium px-2 py-1 rounded">
                  NEW
                </div>
              )}

              {/* Category Badge */}
              <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm text-foreground text-xs px-2 py-1 rounded">
                {product?.category}
              </div>
            </div>

            {/* Product Info */}
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground font-medium">{product?.brand}</span>
                <div className="flex items-center space-x-1">
                  <Icon name="Sparkles" size={12} className="text-warning" />
                </div>
              </div>

              <h3 className="font-medium text-foreground text-sm mb-2 line-clamp-2">
                {product?.name}
              </h3>

              {/* Features */}
              <div className="mb-3">
                {product?.features?.slice(0, 2)?.map((feature, index) => (
                  <span
                    key={index}
                    className="inline-block text-xs text-muted-foreground bg-muted px-2 py-1 rounded mr-1 mb-1"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-foreground">
                  ₹{product?.price?.toLocaleString('en-IN')}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => handleQuickAdd(e, product)}
                  iconName="Plus"
                  iconPosition="left"
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewProductsGrid;