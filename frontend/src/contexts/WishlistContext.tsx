// src/contexts/WishlistContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Product } from '../types/Product'; // Certifique-se de que está importando o tipo Product ATUALIZADO

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist deve ser usado dentro de um WishlistProvider');
  }
  return context;
};

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider = ({ children }: WishlistProviderProps) => {
  // Load from localStorage on initial render
  const [wishlist, setWishlist] = useState<Product[]>(() => {
     try {
      const savedWishlist = localStorage.getItem('wishlist');
       // Ensure parsed data is an array of objects with _id
      const parsedWishlist = savedWishlist ? JSON.parse(savedWishlist) : [];
       // Basic validation for items in localStorage
      if (Array.isArray(parsedWishlist)) {
          return parsedWishlist.filter(item =>
              typeof item === 'object' &&
              item !== null &&
              typeof item._id === 'string'
          );
      }
       return []; // Return empty array if parsed data is not valid
    } catch (e) {
      console.error("Failed to parse wishlist from localStorage", e);
      return []; // Return empty array on error
    }
  });

  // Save to localStorage whenever wishlist state changes
  useEffect(() => {
    try {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    } catch (e) {
        console.error("Failed to save wishlist to localStorage", e);
        // Handle storage full error etc.
    }
  }, [wishlist]);

  const addToWishlist = (product: Product) => {
     // Ensure product has a valid _id before adding
      if (!product || !product._id) {
          console.error("Cannot add product to wishlist: Invalid product object or missing _id", product);
          return;
      }
    if (!isInWishlist(product._id)) {
      setWishlist(prevWishlist => [...prevWishlist, product]);
    }
  };

  const removeFromWishlist = (productId: string) => {
     if (!productId) return;
    setWishlist(prevWishlist =>
      prevWishlist.filter(product => product._id !== productId)
    );
  };

  const isInWishlist = (productId: string) => {
     if (!productId) return false;
    return wishlist.some(product => product._id === productId);
  };

  const toggleWishlist = (product: Product) => {
     // Ensure product has a valid _id before toggling
     if (!product || !product._id) {
         console.error("Cannot toggle wishlist: Invalid product object or missing _id", product);
         return;
     }
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const value = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};