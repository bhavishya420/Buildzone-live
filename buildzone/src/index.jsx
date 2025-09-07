// src/index.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/tailwind.css";
import { AuthProvider } from "./contexts/AuthContext"; // keep if present
import { CartProvider } from "./contexts/CartContext";
import { LanguageProvider } from "./contexts/LanguageContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
