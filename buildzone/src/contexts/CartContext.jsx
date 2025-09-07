// src/contexts/CartContext.jsx
import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // simple cart stored in memory for demo
  const [items, setItems] = useState([]); // [{id, qty, product}]

  const addItem = (product, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((p) => p.id === product.id);
      if (found) {
        return prev.map((p) => (p.id === product.id ? { ...p, qty: p.qty + qty } : p));
      }
      return [...prev, { id: product.id, qty, product }];
    });
  };

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((p) => p.id !== productId));
  };

  const clear = () => setItems([]);

  const getTotalItems = () => items.reduce((s, i) => s + i.qty, 0);

  const value = { items, addItem, removeItem, clear, getTotalItems };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
