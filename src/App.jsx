import React from 'react';
import Routes from'./Routes';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './hooks/useLanguage.jsx';
import { CartProvider } from './hooks/useCart.jsx';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <CartProvider>
          <Routes />
        </CartProvider>
      </LanguageProvider>
    </AuthProvider>
  )
}

export default App;