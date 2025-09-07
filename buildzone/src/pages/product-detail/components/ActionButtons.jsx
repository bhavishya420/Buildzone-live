import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActionButtons = ({ 
  product = {}, 
  quantity = 1,
  onAddToCart = () => {},
  onBuyNow = () => {}
}) => {
  const navigate = useNavigate();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      await onAddToCart(product, quantity);
      // Show success feedback
      setTimeout(() => setIsAddingToCart(false), 1000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    onBuyNow(product, quantity);
    navigate('/shopping-cart-and-checkout');
  };

  const handleApplyBNPL = () => {
    navigate('/bnpl-credit-management');
  };

  const handleShare = (platform) => {
    const productUrl = window.location?.href;
    const productName = product?.name || 'Product';
    const productPrice = product?.price || 0;
    
    const shareText = `Check out this ${productName} for ₹${productPrice?.toLocaleString()} on Buildzone!`;
    
    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + productUrl)}`, '_blank');
        break;
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(productName)}&body=${encodeURIComponent(shareText + '\n\n' + productUrl)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard?.writeText(productUrl);
        break;
      default:
        break;
    }
    setShowShareMenu(false);
  };

  const totalPrice = (product?.price || 0) * quantity;

  return (
    <div className="space-y-4">
      {/* BNPL Highlight */}
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <Icon name="CreditCard" size={20} className="text-primary" />
          <div className="flex-1">
            <p className="text-sm font-medium text-primary">Buy Now, Pay Later</p>
            <p className="text-xs text-primary/80">45 days interest-free • Up to ₹5L credit</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleApplyBNPL}
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            Apply
          </Button>
        </div>
      </div>
      {/* Total Price */}
      <div className="bg-surface rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total ({quantity} items)</span>
          <span className="text-xl font-bold text-foreground">
            ₹{totalPrice?.toLocaleString()}
          </span>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={handleAddToCart}
          loading={isAddingToCart}
          iconName={isAddingToCart ? "Check" : "ShoppingCart"}
          iconPosition="left"
          className="h-12"
        >
          {isAddingToCart ? "Added!" : "Add to Cart"}
        </Button>
        
        <Button
          variant="default"
          onClick={handleBuyNow}
          iconName="Zap"
          iconPosition="left"
          className="h-12"
        >
          Buy Now
        </Button>
      </div>
      {/* Secondary Actions */}
      <div className="flex items-center justify-center space-x-6 pt-2">
        <button
          className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-smooth"
        >
          <Icon name="Heart" size={18} />
          <span className="text-sm">Wishlist</span>
        </button>
        
        <div className="relative">
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-smooth"
          >
            <Icon name="Share2" size={18} />
            <span className="text-sm">Share</span>
          </button>
          
          {/* Share Menu */}
          {showShareMenu && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-card border border-border rounded-lg shadow-elevated p-2 min-w-[120px]">
              <button
                onClick={() => handleShare('whatsapp')}
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-foreground hover:bg-surface rounded transition-smooth"
              >
                <Icon name="MessageCircle" size={16} />
                <span>WhatsApp</span>
              </button>
              <button
                onClick={() => handleShare('email')}
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-foreground hover:bg-surface rounded transition-smooth"
              >
                <Icon name="Mail" size={16} />
                <span>Email</span>
              </button>
              <button
                onClick={() => handleShare('copy')}
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-foreground hover:bg-surface rounded transition-smooth"
              >
                <Icon name="Copy" size={16} />
                <span>Copy Link</span>
              </button>
            </div>
          )}
        </div>
        
        <button
          className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-smooth"
        >
          <Icon name="BarChart3" size={18} />
          <span className="text-sm">Compare</span>
        </button>
      </div>
    </div>
  );
};

export default ActionButtons;