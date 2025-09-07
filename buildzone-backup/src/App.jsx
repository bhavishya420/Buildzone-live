// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Core pages
import HomeDashboard from "./pages/home-dashboard";
import LoginRegister from "./pages/login-register";
import ProductDetail from "./pages/product-detail";
import ShoppingCartAndCheckout from "./pages/shopping-cart-and-checkout";
import Profile from "./pages/profile-and-settings";
import OrdersAndTracking from "./pages/orders-and-tracking";
import CategoryDetailWithProducts from "./pages/category-detail-with-products";
import NotFound from "./pages/NotFound.jsx";

// Extra pages you have in src/pages
import AgentLogs from "./pages/agent-logs-and-analytics";
import AiLabBeta from "./pages/ai-lab-beta";
import BnplCreditManagement from "./pages/bnpl-credit-management";
import CategoriesGrid from "./pages/categories-grid";
import CommunityFeed from "./pages/community-feed";
import DemoDataManagement from "./pages/demo-data-management";
import EnhancedAuth from "./pages/enhanced-authentication";
import EnhancedBnplCredit from "./pages/enhanced-bnpl-credit-management";
import NotificationsAndVibecode from "./pages/notifications-and-vibecode";
import OffersAndSchemes from "./pages/offers-and-schemes";
import ReorderAgentDashboard from "./pages/reorder-agent-dashboard";
import SuggestedOrdersManagement from "./pages/suggested-orders-management";
import VoiceOrderingModal from "./pages/voice-ordering-modal";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Main flows */}
        <Route path="/" element={<HomeDashboard />} />
        <Route path="/home-dashboard" element={<HomeDashboard />} />
        <Route path="/login" element={<LoginRegister />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<ShoppingCartAndCheckout />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<OrdersAndTracking />} />
        <Route path="/category/:id" element={<CategoryDetailWithProducts />} />

        {/* Extra flows */}
        <Route path="/agent-logs" element={<AgentLogs />} />
        <Route path="/ai-lab" element={<AiLabBeta />} />
        <Route path="/bnpl-credit" element={<BnplCreditManagement />} />
        <Route path="/categories" element={<CategoriesGrid />} />
        <Route path="/community" element={<CommunityFeed />} />
        <Route path="/demo-data" element={<DemoDataManagement />} />
        <Route path="/enhanced-auth" element={<EnhancedAuth />} />
        <Route path="/enhanced-bnpl" element={<EnhancedBnplCredit />} />
        <Route path="/notifications" element={<NotificationsAndVibecode />} />
        <Route path="/offers" element={<OffersAndSchemes />} />
        <Route path="/reorder-agent" element={<ReorderAgentDashboard />} />
        <Route path="/suggested-orders" element={<SuggestedOrdersManagement />} />
        <Route path="/voice-order" element={<VoiceOrderingModal />} />

        {/* fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
