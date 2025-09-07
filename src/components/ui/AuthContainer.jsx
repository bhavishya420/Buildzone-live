import React from 'react';
import { useLocation } from 'react-router-dom';

const AuthContainer = ({ children }) => {
  const location = useLocation();

  // Only render on authentication pages
  if (location?.pathname !== '/login-register') {
    return children;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Auth Header */}
      <header className="flex items-center justify-center py-8 px-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 text-primary-foreground"
              fill="currentColor"
            >
              <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
              <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-foreground">Buildzone</span>
            <span className="text-sm text-muted-foreground">B2B Building Materials</span>
          </div>
        </div>
      </header>

      {/* Auth Content */}
      <main className="flex-1 flex items-center justify-center px-4 pb-8">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-xl shadow-soft p-8">
            {children}
          </div>
        </div>
      </main>

      {/* Auth Footer */}
      <footer className="py-6 px-4 text-center">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Trusted by 10,000+ retailers across India
          </p>
          <div className="flex items-center justify-center space-x-6 text-xs text-muted-foreground">
            <span>Secure Payments</span>
            <span>•</span>
            <span>24/7 Support</span>
            <span>•</span>
            <span>BNPL Available</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AuthContainer;