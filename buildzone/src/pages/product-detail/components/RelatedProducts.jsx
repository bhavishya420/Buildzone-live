import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const RelatedProducts = ({ products = [] }) => {
  const navigate = useNavigate();

  if (!products?.length) {
    return null;
  }

  const handleProductClick = (productId) => {
    // In a real app, this would navigate to the specific product
    navigate('/product-detail');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Related Products</h3>
        <Button
          variant="ghost"
          size="sm"
          iconName="ArrowRight"
          iconPosition="right"
          onClick={() => navigate('/categories-grid')}
        >
          View All
        </Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products?.slice(0, 4)?.map((product, index) => (
          <div
            key={index}
            onClick={() => handleProductClick(product?.id)}
            className="bg-card border border-border rounded-lg p-3 cursor-pointer hover:shadow-elevated transition-smooth"
          >
            <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-3">
              <Image
                src={product?.image}
                alt={product?.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground line-clamp-2">
                {product?.name}
              </p>
              
              <div className="flex items-center space-x-1">
                {[...Array(5)]?.map((_, i) => (
                  <Icon
                    key={i}
                    name="Star"
                    size={12}
                    className={i < product?.rating ? "text-warning fill-current" : "text-muted-foreground"}
                  />
                ))}
                <span className="text-xs text-muted-foreground ml-1">
                  ({product?.reviews})
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    ₹{product?.price?.toLocaleString()}
                  </p>
                  {product?.originalPrice > product?.price && (
                    <p className="text-xs text-muted-foreground line-through">
                      ₹{product?.originalPrice?.toLocaleString()}
                    </p>
                  )}
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8"
                  onClick={(e) => {
                    e?.stopPropagation();
                    // Handle add to cart for related product
                  }}
                >
                  <Icon name="Plus" size={14} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;