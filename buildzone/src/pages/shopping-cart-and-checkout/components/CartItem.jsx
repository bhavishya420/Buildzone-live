import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    onUpdateQuantity(item?.id, newQuantity);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-4">
      <div className="flex items-start space-x-4">
        {/* Product Image */}
        <div className="w-20 h-20 bg-surface rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={item?.image}
            alt={item?.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-1">
                {item?.name}
              </h3>
              <p className="text-xs text-muted-foreground mb-1">
                Brand: {item?.brand}
              </p>
              <p className="text-xs text-muted-foreground">
                SKU: {item?.sku}
              </p>
            </div>
            
            {/* Remove Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemove(item?.id)}
              className="text-muted-foreground hover:text-destructive ml-2"
            >
              <Icon name="Trash2" size={16} />
            </Button>
          </div>

          {/* Price and Quantity */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">
                ₹{item?.price?.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-muted-foreground">
                per {item?.unit}
              </span>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(item?.quantity - 1)}
                disabled={item?.quantity <= 1}
                className="w-8 h-8"
              >
                <Icon name="Minus" size={14} />
              </Button>
              
              <span className="text-sm font-medium text-foreground min-w-[2rem] text-center">
                {item?.quantity}
              </span>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(item?.quantity + 1)}
                className="w-8 h-8"
              >
                <Icon name="Plus" size={14} />
              </Button>
            </div>
          </div>

          {/* Line Total */}
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-border">
            <span className="text-xs text-muted-foreground">
              {item?.quantity} × ₹{item?.price?.toLocaleString('en-IN')}
            </span>
            <span className="text-sm font-semibold text-foreground">
              ₹{(item?.quantity * item?.price)?.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;