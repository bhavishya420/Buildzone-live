import React from 'react';
import { useNavigate } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const EmptyCart = () => {
  const navigate = useNavigate();

  const suggestedProducts = [
    {
      id: 1,
      name: "Premium PVC Pipes",
      image: "https://images.pexels.com/photos/8293778/pexels-photo-8293778.jpeg",
      price: 450,
      originalPrice: 520,
      discount: 13
    },
    {
      id: 2,
      name: "Ceramic Wall Tiles",
      image: "https://images.pexels.com/photos/6585759/pexels-photo-6585759.jpeg",
      price: 85,
      originalPrice: 100,
      discount: 15
    },
    {
      id: 3,
      name: "Brass Water Taps",
      image: "https://images.pexels.com/photos/6585756/pexels-photo-6585756.jpeg",
      price: 1250,
      originalPrice: 1450,
      discount: 14
    }
  ];

  const categories = [
    { name: 'Taps', icon: 'Droplets', path: '/category-detail-with-products' },
    { name: 'Pipes', icon: 'Zap', path: '/category-detail-with-products' },
    { name: 'Tiles', icon: 'Grid3X3', path: '/category-detail-with-products' },
    { name: 'Tanks', icon: 'Container', path: '/category-detail-with-products' }
  ];

  return (
    <div className="text-center py-8">
      {/* Empty Cart Illustration */}
      <div className="w-32 h-32 mx-auto mb-6 bg-surface rounded-full flex items-center justify-center">
        <Icon name="ShoppingCart" size={48} className="text-muted-foreground" />
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-2">
        Your cart is empty
      </h2>
      <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
        Add some products to your cart to get started with your order
      </p>
      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
        <Button
          variant="default"
          onClick={() => navigate('/categories-grid')}
          className="min-w-[140px]"
        >
          <Icon name="Grid3X3" size={16} className="mr-2" />
          Browse Categories
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate('/home-dashboard')}
          className="min-w-[140px]"
        >
          <Icon name="Home" size={16} className="mr-2" />
          Go to Home
        </Button>
      </div>
      {/* Quick Categories */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-foreground mb-4">Shop by Category</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories?.map((category) => (
            <button
              key={category?.name}
              onClick={() => navigate(category?.path)}
              className="bg-card border border-border rounded-lg p-4 hover:shadow-soft transition-smooth"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Icon name={category?.icon} size={24} className="text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">{category?.name}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Suggested Products */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Recommended for You</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {suggestedProducts?.map((product) => (
            <div key={product?.id} className="bg-card border border-border rounded-lg p-4">
              <div className="w-full h-32 bg-surface rounded-lg overflow-hidden mb-3">
                <Image
                  src={product?.image}
                  alt={product?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="text-sm font-medium text-foreground mb-2 line-clamp-2">
                {product?.name}
              </h4>
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-lg font-bold text-foreground">
                  ₹{product?.price?.toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  ₹{product?.originalPrice?.toLocaleString('en-IN')}
                </span>
                <span className="text-xs bg-success/10 text-success px-2 py-1 rounded">
                  {product?.discount}% OFF
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/product-detail')}
                className="w-full"
              >
                <Icon name="Plus" size={14} className="mr-2" />
                Add to Cart
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmptyCart;