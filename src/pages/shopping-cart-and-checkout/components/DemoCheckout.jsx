import React, { useState } from 'react';
import { useCart } from '../../../hooks/useCart';
import { useLanguage } from '../../../hooks/useLanguage';
import { useAuth } from '../../../contexts/AuthContext';
import { supabaseService } from '../../../services/supabaseService';
import Button from '../../../components/ui/Button';

const DemoCheckout = ({ onOrderPlaced }) => {
  const { cartItems, getTotalAmount, getCartItems, clearCart } = useCart();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handlePlaceOrder = async () => {
    if (!user?.id) {
      alert('Please log in to place an order');
      return;
    }

    if (cartItems?.length === 0) {
      alert(t('emptyCart'));
      return;
    }

    setIsLoading(true);
    try {
      const orderData = {
        user_id: user?.id,
        items: getCartItems(),
        total_amount: getTotalAmount(),
        contact_number: user?.phone || null,
        delivery_address: 'Demo Address - Please update in profile'
      };

      const createdOrder = await supabaseService?.createOrder(orderData);
      
      if (createdOrder) {
        clearCart();
        onOrderPlaced?.(createdOrder);
        alert(t('orderPlaced'));
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert(`${t('error')}: ${error?.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (cartItems?.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{t('emptyCart')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <div className="bg-surface rounded-lg p-4">
        <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
        
        {cartItems?.map?.((item) => (
          <div key={item?.id} className="flex justify-between items-center py-2 border-b border-border last:border-0">
            <div>
              <p className="font-medium">{item?.name}</p>
              <p className="text-sm text-muted-foreground">
                {t('quantity')}: {item?.quantity} × ₹{item?.price}
              </p>
            </div>
            <p className="font-semibold">₹{(item?.price * item?.quantity)?.toFixed(2)}</p>
          </div>
        )) ?? <p>No items in cart</p>}
        
        <div className="pt-4 mt-4 border-t border-border">
          <div className="flex justify-between items-center text-lg font-bold">
            <span>{t('total')}:</span>
            <span>₹{getTotalAmount()?.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Demo Order Button */}
      <Button
        onClick={handlePlaceOrder}
        disabled={isLoading || cartItems?.length === 0}
        className="w-full"
        variant="default"
      >
        {isLoading ? t('loading') : t('placeOrderDemo')}
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        <p>This is a demo order. No actual payment will be processed.</p>
      </div>
    </div>
  );
};

export default DemoCheckout;