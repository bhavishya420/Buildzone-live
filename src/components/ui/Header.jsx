import React from 'react';
import { Bell, Search, Menu, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../hooks/useLanguage';
import CartButton from './CartButton';
import LanguageToggle from './LanguageToggle';
import { useNavigate } from 'react-router-dom';



const Header = ({ creditData = { available: 50000, used: 15000, currency: '₹' } }) => {
  const { user, profile, signOut } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login-register');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleProfileClick = () => {
    if (user) {
      navigate('/profile-and-settings');
    } else {
      navigate('/login-register');
    }
  };

  return (
    <header className="bg-surface border-b border-border sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side - Logo and Menu */}
        <div className="flex items-center space-x-3">
          <button className="p-2 hover:bg-muted rounded-lg lg:hidden">
            <Menu className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">BZ</span>
            </div>
            <span className="font-bold text-lg text-foreground">Buildzone</span>
          </div>
        </div>

        {/* Center - Search (hidden on mobile) */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-2">
          {/* Language Toggle */}
          <LanguageToggle className="hidden sm:flex" />
          
          {/* Cart Button */}
          <CartButton />
          
          {/* Credit Info - only show if user is authenticated */}
          {user && creditData && (
            <div className="hidden lg:flex items-center space-x-2 px-3 py-2 bg-muted rounded-lg">
              <div className="text-xs text-muted-foreground">
                Available Credit
              </div>
              <div className="text-sm font-semibold text-foreground">
                {creditData?.currency}{creditData?.available?.toLocaleString() || '0'}
              </div>
            </div>
          )}

          {/* Notifications - only show if user is authenticated */}
          {user && (
            <button className="p-2 hover:bg-muted rounded-lg relative">
              <Bell className="w-5 h-5 text-foreground" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"></span>
            </button>
          )}

          {/* Authentication Section */}
          {user ? (
            /* Authenticated User Profile */
            <div className="flex items-center space-x-2 ml-2">
              <button
                onClick={handleProfileClick}
                className="flex items-center space-x-2 hover:bg-muted rounded-lg p-1 transition-colors"
              >
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-medium text-sm">
                    {profile?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-medium text-foreground">
                    {profile?.name || user?.email?.split('@')?.[0] || 'User'}
                  </div>
                  {profile?.shop_name && (
                    <div className="text-xs text-muted-foreground">
                      {profile?.shop_name}
                    </div>
                  )}
                </div>
              </button>
              
              {/* Logout Button */}
              <button
                onClick={handleSignOut}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </button>
            </div>
          ) : (
            /* Login Button for Unauthenticated Users */
            <button
              onClick={handleLogin}
              className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span className="font-medium">Login</span>
            </button>
          )}
        </div>
      </div>
      {/* Mobile search bar */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;