// src/contexts/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const raw = localStorage.getItem("bz_cart_v1");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("bz_cart_v1", JSON.stringify(cartItems));
    } catch {}
  }, [cartItems]);

  const addToCart = (product, qty = 1) => {
    setCartItems((prev) => {
      const found = prev.find((p) => p.id === product.id);
      if (found) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + qty } : p
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });
  };

  const updateQuantity = (productId, newQty) => {
    setCartItems((prev) =>
      prev
        .map((p) => (p.id === productId ? { ...p, quantity: newQty } : p))
        .filter((p) => p.quantity > 0)
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((p) => p.id !== productId));
  };

  const getTotalAmount = () => {
    return cartItems.reduce((sum, it) => sum + (it.price || 0) * (it.quantity || 1), 0);
  };

  const getTotalItems = () => cartItems.reduce((s, it) => s + (it.quantity || 0), 0);

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    getTotalAmount,
    getTotalItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
