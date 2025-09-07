import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ProductCard = ({ product, onAddToCart, onQuickView }) => {
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e) => {
    e?.stopPropagation();
    setIsAdding(true);
    
    try {
      await onAddToCart(product);
      setTimeout(() => setIsAdding(false), 1000);
    } catch (error) {
      setIsAdding(false);
    }
  };

  const handleProductClick = () => {
    navigate('/product-detail', { state: { product } });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="Star"
        size={12}
        className={index < Math.floor(rating) ? 'text-warning fill-current' : 'text-muted-foreground'}
      />
    ));
  };

  return (
    <div 
      className="bg-card border border-border rounded-lg overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-200 cursor-pointer"
      onClick={handleProductClick}
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={product?.image}
          alt={product?.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        {product?.discount && (
          <div className="absolute top-2 left-2 bg-error text-error-foreground px-2 py-1 rounded text-xs font-medium">
            {product?.discount}% OFF
          </div>
        )}
        {product?.isNew && (
          <div className="absolute top-2 right-2 bg-success text-success-foreground px-2 py-1 rounded text-xs font-medium">
            NEW
          </div>
        )}
        <button
          onClick={(e) => {
            e?.stopPropagation();
            onQuickView(product);
          }}
          className="absolute bottom-2 right-2 w-8 h-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Icon name="Eye" size={16} />
        </button>
      </div>
      {/* Product Info */}
      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-medium text-foreground text-sm line-clamp-2 mb-1">
            {product?.name}
          </h3>
          <p className="text-xs text-muted-foreground">{product?.brand}</p>
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-1 mb-2">
          <div className="flex items-center space-x-0.5">
            {renderStars(product?.rating)}
          </div>
          <span className="text-xs text-muted-foreground">
            ({product?.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-lg font-bold text-foreground font-mono">
            ₹{product?.price?.toLocaleString('en-IN')}
          </span>
          {product?.originalPrice && (
            <span className="text-sm text-muted-foreground line-through font-mono">
              ₹{product?.originalPrice?.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Size/Variant Info */}
        {product?.size && (
          <div className="text-xs text-muted-foreground mb-3">
            Size: {product?.size}
          </div>
        )}

        {/* Add to Cart Button */}
        <Button
          variant="default"
          size="sm"
          fullWidth
          loading={isAdding}
          onClick={handleAddToCart}
          className="text-xs"
        >
          {isAdding ? 'Adding...' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;