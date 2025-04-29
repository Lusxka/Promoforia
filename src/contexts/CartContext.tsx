// src/contexts/CartContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Product } from '../types/Product'; // Certifique-se de que está importando o tipo Product ATUALIZADO

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  // Load from localStorage on initial render
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      // Ensure parsed data matches CartItem structure and product has an _id
      const parsedCart = savedCart ? JSON.parse(savedCart) : [];
       // Basic validation for items in localStorage
      if (Array.isArray(parsedCart)) {
          return parsedCart.filter(item =>
              typeof item === 'object' &&
              item !== null &&
              typeof item.quantity === 'number' &&
              item.quantity > 0 &&
              typeof item.product === 'object' &&
              item.product !== null &&
              typeof item.product._id === 'string'
          );
      }
       return []; // Return empty array if parsed data is not valid
    } catch (e) {
      console.error("Failed to parse cart from localStorage", e);
      return []; // Return empty array on error
    }
  });

  // Save to localStorage whenever cart state changes
  useEffect(() => {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
    } catch (e) {
        console.error("Failed to save cart to localStorage", e);
        // Handle storage full error etc.
    }
  }, [cart]);

  const addToCart = (product: Product, quantity = 1) => {
    // Ensure product has a valid _id before adding
     if (!product || !product._id) {
         console.error("Cannot add product to cart: Invalid product object or missing _id", product);
         return;
     }
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product._id === product._id);

      if (existingItem) {
        // Create new array with updated item
        return prevCart.map(item =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Create new array with the new item
        return [...prevCart, { product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
     if (!productId) return;
    setCart(prevCart => prevCart.filter(item => item.product._id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
     if (!productId) return;

    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.product._id === productId
          ? { ...item, quantity: quantity } // Use the passed quantity
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    // Ensure product price is a valid number before summing
    return cart.reduce((total, item) => total + ((item.product.price || 0) * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};