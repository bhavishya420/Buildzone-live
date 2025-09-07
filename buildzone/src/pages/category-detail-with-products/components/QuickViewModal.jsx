import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const QuickViewModal = ({ product, isOpen, onClose, onAddToCart }) => {
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  if (!isOpen || !product) return null;

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await onAddToCart({
        ...product,
        selectedSize,
        quantity
      });
      setTimeout(() => {
        setIsAdding(false);
        onClose();
      }, 1000);
    } catch (error) {
      setIsAdding(false);
    }
  };

  const handleViewDetails = () => {
    navigate('/product-detail', { state: { product } });
    onClose();
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="Star"
        size={14}
        className={index < Math.floor(rating) ? 'text-warning fill-current' : 'text-muted-foreground'}
      />
    ));
  };

  return (
    <div className="fixed inset-0 z-400 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl shadow-elevated max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Quick View</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden bg-muted rounded-lg">
            <Image
              src={product?.image}
              alt={product?.name}
              className="w-full h-full object-cover"
            />
            {product?.discount && (
              <div className="absolute top-2 left-2 bg-error text-error-foreground px-2 py-1 rounded text-xs font-medium">
                {product?.discount}% OFF
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-foreground text-lg mb-1">
                {product?.name}
              </h3>
              <p className="text-sm text-muted-foreground">{product?.brand}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-0.5">
                {renderStars(product?.rating)}
              </div>
              <span className="text-sm text-muted-foreground">
                {product?.rating} ({product?.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-foreground font-mono">
                ₹{product?.price?.toLocaleString('en-IN')}
              </span>
              {product?.originalPrice && (
                <span className="text-lg text-muted-foreground line-through font-mono">
                  ₹{product?.originalPrice?.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* Size Selection */}
            {product?.sizes && product?.sizes?.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {product?.sizes?.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
                        selectedSize === size
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background text-foreground hover:border-primary'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Quantity
              </label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 border border-border rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Icon name="Minus" size={16} />
                </button>
                <span className="text-lg font-medium text-foreground min-w-[2rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 border border-border rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Icon name="Plus" size={16} />
                </button>
              </div>
            </div>

            {/* Key Features */}
            {product?.features && (
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Key Features</h4>
                <ul className="space-y-1">
                  {product?.features?.slice(0, 3)?.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Icon name="Check" size={14} className="text-success" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border space-y-3">
          <Button
            variant="default"
            fullWidth
            loading={isAdding}
            onClick={handleAddToCart}
          >
            {isAdding ? 'Adding to Cart...' : 'Add to Cart'}
          </Button>
          <Button
            variant="outline"
            fullWidth
            onClick={handleViewDetails}
          >
            View Full Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;