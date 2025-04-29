import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import axios from 'axios';
import { Product } from '../types/Product';

interface ProductContextType {
  products: Product[];
  featuredProducts: Product[];
  loading: boolean;
  error: string | null;
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
  getProductsBySearch: (query: string) => Product[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts deve ser usado dentro de um ProductProvider');
  }
  return context;
};

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider = ({ children }: ProductProviderProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/products');
        const fetchedProducts = response.data;
        setProducts(fetchedProducts);
        
        // Define featured products (8 best rated)
        const featured = [...fetchedProducts]
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 8);
        setFeaturedProducts(featured);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Não foi possível carregar os produtos. Por favor, tente novamente mais tarde.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getProductById = (id: string) => {
    return products.find(product => product._id === id);
  };

  const getProductsByCategory = (category: string) => {
    return products.filter(product => product.category === category);
  };

  const getProductsBySearch = (query: string) => {
    const lowerCaseQuery = query.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(lowerCaseQuery) || 
      product.description.toLowerCase().includes(lowerCaseQuery) ||
      product.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery))
    );
  };

  const value = {
    products,
    featuredProducts,
    loading,
    error,
    getProductById,
    getProductsByCategory,
    getProductsBySearch
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};