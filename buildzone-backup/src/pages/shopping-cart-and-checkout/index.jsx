import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Trash2 } from 'lucide-react';
import Header from '../../components/ui/Header';
import BottomNavigation from '../../components/ui/BottomNavigation';
import { useCart } from '../../hooks/useCart';
import { useLanguage } from '../../hooks/useLanguage';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import DemoCheckout from './components/DemoCheckout';
import EmptyCart from './components/EmptyCart';

const ShoppingCartAndCheckout = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, getTotalAmount } = useCart();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [showCheckout, setShowCheckout] = useState(false);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleOrderPlaced = (order) => {
    setShowCheckout(false);
    // Navigate to orders page or show success message
    navigate('/orders');
  };

  const creditData = {
    available: 0,
    used: 0,
    currency: '₹'
  };

  if (cartItems?.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header creditData={creditData} />
        <main className="pb-20">
          <div className="flex items-center px-4 py-4 border-b border-border">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-muted rounded-lg mr-3"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="text-xl font-semibold text-foreground">{t('cart')}</h1>
          </div>
          <EmptyCart />
        </main>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header creditData={creditData} />
      
      <main className="pb-20">
        {/* Header */}
        <div className="flex items-center px-4 py-4 border-b border-border">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-muted rounded-lg mr-3"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-xl font-semibold text-foreground">{t('cart')}</h1>
          <span className="ml-auto text-sm text-muted-foreground">
            {cartItems?.length} items
          </span>
        </div>

        <div className="px-4 py-6">
          {showCheckout ? (
            <div>
              <div className="flex items-center mb-6">
                <button
                  onClick={() => setShowCheckout(false)}
                  className="p-2 hover:bg-muted rounded-lg mr-3"
                >
                  <ArrowLeft className="w-5 h-5 text-foreground" />
                </button>
                <h2 className="text-xl font-semibold text-foreground">{t('checkout')}</h2>
              </div>
              <DemoCheckout onOrderPlaced={handleOrderPlaced} />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Cart Items */}
              <div className="space-y-4">
                {cartItems?.map?.((item) => (
                  <div key={item?.id} className="bg-surface rounded-lg p-4 border border-border">
                    <div className="flex items-start space-x-4">
                      {/* Product Image */}
                      <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                        {item?.image_url ? (
                          <img
                            src={item?.image_url}
                            alt={item?.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                            No Image
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">
                          {item?.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {item?.category}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center space-x-3">
                            {/* Quantity Controls */}
                            <div className="flex items-center space-x-2 bg-background border border-border rounded-lg">
                              <button
                                onClick={() => handleQuantityChange(item?.id, item?.quantity - 1)}
                                className="p-1 hover:bg-muted rounded"
                              >
                                <Minus className="w-4 h-4 text-foreground" />
                              </button>
                              <span className="px-3 py-1 text-sm font-medium text-foreground min-w-[40px] text-center">
                                {item?.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item?.id, item?.quantity + 1)}
                                className="p-1 hover:bg-muted rounded"
                              >
                                <Plus className="w-4 h-4 text-foreground" />
                              </button>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => removeFromCart(item?.id)}
                              className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <div className="text-lg font-bold text-foreground">
                              ₹{(item?.price * item?.quantity)?.toFixed(2)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              ₹{item?.price} each
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )) ?? null}
              </div>

              {/* Cart Summary */}
              <div className="bg-surface rounded-lg p-6 border border-border">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-medium text-foreground">₹{getTotalAmount()?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Shipping:</span>
                    <span className="font-medium text-foreground">Free</span>
                  </div>
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-foreground">{t('total')}:</span>
                      <span className="text-xl font-bold text-primary">₹{getTotalAmount()?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => setShowCheckout(true)}
                  className="w-full mt-6"
                  variant="default"
                >
                  Proceed to {t('checkout')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default ShoppingCartAndCheckout;