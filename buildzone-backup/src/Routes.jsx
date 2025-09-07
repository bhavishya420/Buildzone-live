import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import { ErrorBoundary } from 'react-error-boundary';
import ScrollToTop from './components/ScrollToTop.jsx';
import ErrorFallback from './components/ErrorFallback';
import NotFound from "pages/NotFound";
import ProductDetail from './pages/product-detail';
import HomeDashboard from './pages/home-dashboard';
import CategoriesGrid from './pages/categories-grid';
import CommunityFeed from './pages/community-feed';
import LoginRegisterPage from './pages/login-register';
import EnhancedAuthentication from './pages/enhanced-authentication';
import CategoryDetailWithProducts from './pages/category-detail-with-products';
import OffersAndSchemes from './pages/offers-and-schemes';
import ShoppingCartAndCheckout from './pages/shopping-cart-and-checkout';
import BNPLCreditManagement from './pages/bnpl-credit-management';
import EnhancedBNPLCreditManagement from './pages/enhanced-bnpl-credit-management';
import OrdersAndTracking from './pages/orders-and-tracking';
import ProfileAndSettings from './pages/profile-and-settings';
import VoiceOrderingModal from './pages/voice-ordering-modal';
import NotificationsAndVibecode from './pages/notifications-and-vibecode';
import AILabBeta from './pages/ai-lab-beta';
import DemoDataManagement from './pages/demo-data-management';
const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <ScrollToTop />
        <RouterRoutes>
          {/* Define your route here */}
          <Route path="/" element={<EnhancedBNPLCreditManagement />} />
          <Route path="/product-detail" element={<ProductDetail />} />
          <Route path="/home-dashboard" element={<HomeDashboard />} />
          <Route path="/categories-grid" element={<CategoriesGrid />} />
          <Route path="/community-feed" element={<CommunityFeed />} />
          <Route path="/login-register" element={<LoginRegisterPage />} />
          <Route path="/enhanced-authentication" element={<EnhancedAuthentication />} />
          <Route path="/category-detail-with-products" element={<CategoryDetailWithProducts />} />
          <Route path="/offers-and-schemes" element={<OffersAndSchemes />} />
          <Route path="/shopping-cart-and-checkout" element={<ShoppingCartAndCheckout />} />
          <Route path="/bnpl-credit-management" element={<BNPLCreditManagement />} />
          <Route path="/enhanced-bnpl-credit-management" element={<EnhancedBNPLCreditManagement />} />
          <Route path="/orders-and-tracking" element={<OrdersAndTracking />} />
          <Route path="/profile-and-settings" element={<ProfileAndSettings />} />
          <Route path="/voice-ordering-modal" element={<VoiceOrderingModal />} />
          <Route path="/notifications-and-vibecode" element={<NotificationsAndVibecode />} />
          <Route path="/ai-lab-beta" element={<AILabBeta />} />
          <Route path="/demo-data-management" element={<DemoDataManagement />} />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};
export default Routes;