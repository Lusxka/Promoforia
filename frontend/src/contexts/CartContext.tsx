// src/contexts/CartContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Product } from '../types/Product';

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
  finalizePurchase: () => void; // ✅ NOVA FUNÇÃO
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
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      const parsedCart = savedCart ? JSON.parse(savedCart) : [];
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
      return [];
    } catch (e) {
      console.error("Failed to parse cart from localStorage", e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cart]);

  const addToCart = (product: Product, quantity = 1) => {
    if (!product || !product._id) {
      console.error("Cannot add product to cart: Invalid product object or missing _id", product);
      return;
    }
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product._id === product._id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
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
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + ((item.product.price || 0) * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // ✅ Função para abrir links de afiliados em novas abas
  const finalizePurchase = () => {
    if (cart.length === 0) {
      alert("Seu carrinho está vazio.");
      return;
    }

    cart.forEach(({ product }) => {
      const url = product.affiliateLink || product.link_afiliado || product.link || null;
      if (url && typeof url === 'string') {
        window.open(url, '_blank');
      } else {
        console.warn("Produto sem link de afiliado:", product);
      }
    });
  };

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    finalizePurchase, // ✅ Incluído no contexto
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
