import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useLanguage } from '../../hooks/useLanguage';
import { useNavigate } from 'react-router-dom';

const CartButton = ({ className = "" }) => {
  const { getTotalItems } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const totalItems = getTotalItems();

  const handleCartClick = () => {
    navigate('/cart');
  };

  return (
    <button
      onClick={handleCartClick}
      className={`relative flex items-center space-x-2 px-3 py-2 text-sm font-medium text-foreground bg-surface hover:bg-surface/80 rounded-lg border transition-colors ${className}`}
      aria-label={t('cart')}
    >
      <ShoppingCart className="w-5 h-5" />
      <span className="hidden sm:block">{t('cart')}</span>
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-6 w-6 flex items-center justify-center min-w-6">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </button>
  );
};

export default CartButton;