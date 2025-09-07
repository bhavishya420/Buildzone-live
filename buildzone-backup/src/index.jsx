// src/index.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/tailwind.css"; // or index.css if your project uses that
import App from "./App";

import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { LanguageProvider } from "./contexts/LanguageContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <LanguageProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </LanguageProvider>
    </AuthProvider>
  </React.StrictMode>
);
