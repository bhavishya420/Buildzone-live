import { useState, useContext, createContext, useCallback } from "react";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = useCallback((product, quantity = 1) => {
    setCartItems(current => {
      const existingItem = current?.find(item => item?.id === product?.id);
      
      if (existingItem) {
        return current?.map(item =>
          item?.id === product?.id
            ? { ...item, quantity: item?.quantity + quantity }
            : item
        );
      }
      
      return [...current, { ...product, quantity }];
    });
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(current =>
      current?.map(item =>
        item?.id === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCartItems(current => current?.filter(item => item?.id !== productId));
  }, []);

  const getTotalAmount = useCallback(() => {
    return cartItems?.reduce((total, item) => 
      total + (item?.price * item?.quantity), 0
    );
  }, [cartItems]);

  const getTotalItems = useCallback(() => {
    return cartItems?.reduce((total, item) => total + item?.quantity, 0);
  }, [cartItems]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const getCartItems = useCallback(() => {
    return cartItems?.map(item => ({
      productId: item?.id,
      quantity: item?.quantity,
      price: item?.price,
      name: item?.name
    }));
  }, [cartItems]);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      updateQuantity,
      removeFromCart,
      getTotalAmount,
      getTotalItems,
      clearCart,
      getCartItems
    }}>
      {children}
    </CartContext.Provider>
  );
};