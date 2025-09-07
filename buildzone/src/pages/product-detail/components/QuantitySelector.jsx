import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuantitySelector = ({ 
  initialQuantity = 1, 
  minQuantity = 1, 
  maxQuantity = 100,
  onQuantityChange = () => {},
  unit = "pieces"
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleDecrease = () => {
    if (quantity > minQuantity) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onQuantityChange(newQuantity);
    }
  };

  const handleIncrease = () => {
    if (quantity < maxQuantity) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      onQuantityChange(newQuantity);
    }
  };

  const handleInputChange = (e) => {
    const value = parseInt(e?.target?.value) || minQuantity;
    const clampedValue = Math.max(minQuantity, Math.min(maxQuantity, value));
    setQuantity(clampedValue);
    onQuantityChange(clampedValue);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">Quantity</label>
        <span className="text-xs text-muted-foreground">
          Min: {minQuantity} {unit} • Max: {maxQuantity} {unit}
        </span>
      </div>
      
      <div className="flex items-center space-x-3">
        <Button
          variant="outline"
          size="icon"
          onClick={handleDecrease}
          disabled={quantity <= minQuantity}
          className="w-10 h-10 rounded-lg"
        >
          <Icon name="Minus" size={16} />
        </Button>
        
        <div className="flex-1 max-w-24">
          <input
            type="number"
            value={quantity}
            onChange={handleInputChange}
            min={minQuantity}
            max={maxQuantity}
            className="w-full text-center py-2 px-3 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>
        
        <Button
          variant="outline"
          size="icon"
          onClick={handleIncrease}
          disabled={quantity >= maxQuantity}
          className="w-10 h-10 rounded-lg"
        >
          <Icon name="Plus" size={16} />
        </Button>
      </div>
      
      <div className="text-center">
        <span className="text-sm text-muted-foreground">
          {quantity} {unit} selected
        </span>
      </div>
    </div>
  );
};

export default QuantitySelector;