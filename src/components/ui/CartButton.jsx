import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useLanguage } from '../../hooks/useLanguage';
import { useNavigate } from 'react-router-dom';

const CartButton = ({ className = "" }) => {
  const cartHook = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Defensive: support both API shapes
  const getTotalItemsSafe = () => {
    if (!cartHook) return 0;
    if (typeof cartHook.getTotalItems === 'function') {
      try { return cartHook.getTotalItems() || 0; } catch { /* ignore */ }
    }
    if (Array.isArray(cartHook.cartItems)) {
      return cartHook.cartItems.reduce((s, it) => s + (it.quantity || 1), 0);
    }
    if (Array.isArray(cartHook.cart)) {
      return cartHook.cart.reduce((s, it) => s + (it.quantity || 1), 0);
    }
    return 0;
  };

  const totalItems = getTotalItemsSafe();

  const handleCartClick = () => {
    // navigate to the cart route used in your app
    navigate('/cart');
  };

  return (
    <button
      onClick={handleCartClick}
      className={`relative flex items-center space-x-2 px-3 py-2 text-sm font-medium text-foreground bg-surface hover:bg-surface/80 rounded-lg border transition-colors ${className}`}
      aria-label={t ? t('cart') : 'Cart'}
    >
      <ShoppingCart className="w-5 h-5" />
      <span className="hidden sm:block">{t ? t('cart') : 'Cart'}</span>

      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-6 w-6 flex items-center justify-center min-w-6">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </button>
  );
};

export default CartButton;
