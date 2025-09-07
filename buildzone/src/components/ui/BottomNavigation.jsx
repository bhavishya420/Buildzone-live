import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Grid3X3, ShoppingCart, User, MessageCircle, LogIn } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../AppIcon';


const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { getTotalItems } = useCart();
  const { user } = useAuth();
  const totalCartItems = getTotalItems();

  // Dynamic navigation based on authentication status
  const getNavItems = () => {
    const baseItems = [
      {
        path: '/home-dashboard',
        icon: Home,
        label: t('home') || 'Home',
        key: 'home'
      },
      {
        path: '/categories-grid',
        icon: Grid3X3,
        label: t('categories') || 'Categories',
        key: 'categories'
      },
      {
        path: '/shopping-cart-and-checkout',
        icon: ShoppingCart,
        label: t('cart') || 'Cart',
        key: 'cart',
        badge: totalCartItems
      },
      {
        path: '/community-feed',
        icon: MessageCircle,
        label: t('community') || 'Community',
        key: 'community'
      }
    ];

    // Add profile or login based on authentication status
    if (user) {
      baseItems?.push({
        path: '/profile-and-settings',
        icon: User,
        label: t('profile') || 'Profile',
        key: 'profile'
      });
    } else {
      baseItems?.push({
        path: '/login-register',
        icon: LogIn,
        label: t('login') || 'Login',
        key: 'login'
      });
    }

    return baseItems;
  };

  const navItems = getNavItems();

  const handleNavigation = (path, event) => {
    event?.preventDefault();
    navigate(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-30 safe-area-pb">
      <div className="flex items-center justify-around py-2">
        {navItems?.map?.((item) => {
          const Icon = item?.icon;
          const isActive = location?.pathname === item?.path;
          
          return (
            <button
              key={item?.key}
              onClick={(e) => handleNavigation(item?.path, e)}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-200 relative min-w-[60px] ${
                isActive
                  ? 'text-primary bg-primary/10 transform scale-105'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              aria-label={item?.label}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {item?.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px] text-[10px] font-medium">
                    {item?.badge > 99 ? '99+' : item?.badge}
                  </span>
                )}
              </div>
              <span className={`text-xs mt-1 transition-all font-medium ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}>
                {item?.label}
              </span>
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-primary rounded-b-full" />
              )}
            </button>
          );
        }) ?? null}
      </div>
    </nav>
  );
};

export default BottomNavigation;