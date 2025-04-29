// src/contexts/ProductContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import axios from 'axios';
import { BackendProduct } from '../types/BackendProduct'; // Importar o tipo do backend
import { Product } from '../types/Product'; // Importar o tipo do frontend
import { Category } from '../types/Category'; // Importar o tipo de categoria
import { Smartphone, Tv, ShoppingBag, Home, Brush, Dumbbell, LayoutGrid } from 'lucide-react'; // Importar seus ícones para mapeamento

// --- Helper Functions for Data Transformation ---

// Converte string (ex: "R$ 1.200,50") para number (ex: 1200.50)
const parseCurrencyString = (value: string | undefined | null): number => {
  if (value === undefined || value === null || value === "") {
    return 0;
  }
  // Remove o símbolo da moeda (R$), pontos de milhar e substitui vírgula decimal por ponto
  const cleanedValue = value.replace(/[R$\s.]/g, '').replace(',', '.');
  const number = parseFloat(cleanedValue);
  return isNaN(number) ? 0 : number;
};

// Converte string numérica com ou sem % (ex: "15%", "15") para number (ex: 15)
const parsePercentageString = (value: string | undefined | null): number => {
    if (value === undefined || value === null || value === "") {
        return 0;
    }
    const cleanedValue = value.replace(/%/g, '');
    const number = parseFloat(cleanedValue);
    return isNaN(number) ? 0 : number;
};

// Converte string numérica (ex: "4.5", "120") para number
const parseSimpleNumberString = (value: string | undefined | null): number => {
     if (value === undefined || value === null || value === "") {
        return 0;
    }
    const number = parseFloat(value);
    return isNaN(number) ? 0 : number;
};


// Gera um slug a partir de uma string
const generateSlug = (text: string | undefined | null): string => {
    if (!text) return 'outros';
    return text
        .toLowerCase()
        .normalize('NFD') // Decompose accented characters
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/[^\w-]+/g, '') // Remove all non-word chars except hyphens
        .replace(/--+/g, '-') // Replace multiple hyphens with a single one
        .replace(/^-+|-+$/g, ''); // Remove hyphens from start and end
};

// --- Context Definition ---

interface ProductContextType {
  products: Product[]; // All products (frontend format)
  featuredProducts: Product[]; // Subset of products (frontend format)
  categories: Category[]; // Derived categories
  loading: boolean; // Loading state for the initial fetch
  error: string | null; // Error state for the initial fetch
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (categorySlug: string) => Product[]; // Use categorySlug
  getProductsBySearch: (query: string) => Product[]; // Assuming search logic
  getCategoryIcon: (slug: string) => React.ReactNode; // Helper to get icons for categories
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
  const [allProducts, setAllProducts] = useState<Product[]>([]); // Store processed products
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]); // Store featured products
  const [categories, setCategories] = useState<Category[]>([]); // Store derived categories
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Icon Mapping (Frontend-specific) ---
  // Map slugs (derived from backend category names) to icons
  const categoryIconMap: { [key: string]: React.ReactNode } = {
    'eletronicos': <Smartphone size={28} />,
    'moda': <ShoppingBag size={28} />,
    'casa': <Home size={28} />,
    'beleza': <Brush size={28} />,
    'esportes': <Dumbbell size={28} />,
    'entretenimento': <Tv size={28} />,
     'telefonia': <Smartphone size={28} />,
     'informatica': <Tv size={28} />,
     'casa-moveis-decoracao': <Home size={28} />,
    // Add mappings for any other categories your backend might return after slugging
    'outros': <LayoutGrid size={28} />, // Default slug for products without category
    'default': <LayoutGrid size={28} />, // Default icon if slug doesn't match mapping
  };

  const getCategoryIcon = (slug: string): React.ReactNode => {
    return categoryIconMap[slug] || categoryIconMap['default'];
  };
  // -----------------------------------------


  useEffect(() => {
    const fetchAndProcessProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Fetch ALL products from the backend using Axios
        // Ensure your backend is running on http://localhost:5000 or update the URL
        const response = await axios.get<BackendProduct[]>('http://localhost:4000/api/products');
        const backendData = response.data;

        // 2. Process and Transform Backend Data to Frontend Product Type
        const processedProducts: Product[] = backendData
        .filter(item => item.nome && item.link_afiliado && item.preco_para) // Basic validation
        .map(item => {
            const price = parseCurrencyString(item.preco_para);
            const originalPrice = parseCurrencyString(item.preco_de);
            const discount = parsePercentageString(item.desconto);
            const rating = parseSimpleNumberString(item.avaliacao);
            const reviewCount = parseSimpleNumberString(item.numero_avaliacoes);
            const categorySlug = generateSlug(item.categoria);

            return {
                _id: item._id, // Use MongoDB _id
                name: item.nome,
                // Use nome or category as a basic description placeholder
                description: item.nome || item.categoria || 'Produto sem descrição.',
                price: price,
                // Only include originalPrice if it's a valid number and greater than the current price
                originalPrice: originalPrice > price ? originalPrice : undefined,
                // Only include discount if it's a valid number and greater than 0
                discount: discount > 0 ? discount : undefined,
                // Convert single image string to an array, handle missing image
                images: item.imagens ? [item.imagens] : [],
                categorySlug: categorySlug,
                backendCategory: item.categoria, // Keep backend category name if useful
                tags: [], // No tags in backend, provide empty array
                rating: rating,
                reviewCount: reviewCount,
                stockQuantity: 100, // No stock in backend, provide default
                sellerName: item.vendedor, // Mapeado de vendedor
                affiliateLink: item.link_afiliado,
                featured: false, // Default, update logic below if needed
                bestseller: false, // Default, update logic below if needed
                new: false, // Default, update logic below if needed

                // Include other optional fields from backend if mapped in Product.ts
                frete: item.frete,
                parcelas: item.parcelas,
                tempo_restante: item.tempo_restante,
                porcentagem_vendida: parseSimpleNumberString(item.porcentagem_vendida),
                preco_exterior: parseCurrencyString(item.preco_exterior), // Assuming preco_exterior is currency-like
                ultima_verificacao: item.ultima_verificacao ? new Date(item.ultima_verificacao) : undefined, // Attempt to parse date
            };
        });

        // 3. Set All Processed Products
        setAllProducts(processedProducts);

        // 4. Derive Featured Products (Example: Top 8 by Rating)
        const featured = [...processedProducts]
            .filter(p => p.rating > 0) // Only consider products with a rating
            .sort((a, b) => b.rating - a.rating) // Sort by rating descending
            .slice(0, 8); // Take the top 8
        // You could add more sophisticated logic here (e.g., combine rating and discount)
        setFeaturedProducts(featured);

        // 5. Derive Categories and Counts
        const categoryCounts: { [slug: string]: { title: string, count: number, originalName: string } } = {};
        processedProducts.forEach(product => {
            // Use the derived slug for counting
            const slug = product.categorySlug || 'outros';
             // Use the original backend category name if available, fallback to slug
            const title = product.backendCategory || (slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' '));

            if (!categoryCounts[slug]) {
                categoryCounts[slug] = { title: title, count: 0, originalName: product.backendCategory || '' };
            }
            categoryCounts[slug].count++;
        });

        const derivedCategories: Category[] = Object.keys(categoryCounts).map(slug => ({
            id: slug, // Use slug as ID
            title: categoryCounts[slug].title,
            slug: slug,
            count: categoryCounts[slug].count,
        }));

        // Optional: Sort categories alphabetically by title
        setCategories(derivedCategories.sort((a, b) => a.title.localeCompare(b.title)));

        setLoading(false); // Set loading to false only after all processing is done

      } catch (err: any) {
        console.error('Erro ao buscar e processar dados:', err);
        // Check if it's an Axios error with a response
         const errorMessage = axios.isAxiosError(err) && err.response
            ? `Erro do servidor: ${err.response.status} - ${err.response.data?.message || err.message}`
            : 'Não foi possível carregar os dados. Por favor, tente novamente mais tarde.';
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchAndProcessProducts();
  }, []); // Empty dependency array means this runs once on mount

  // --- Helper functions using the processed data ---

  const getProductById = (id: string) => {
    return allProducts.find(product => product._id === id);
  };

  const getProductsByCategory = (categorySlug: string) => {
     if (!categorySlug) return allProducts; // Return all if no category is specified
    return allProducts.filter(product => product.categorySlug === categorySlug);
  };

  const getProductsBySearch = (query: string) => {
    const lowerCaseQuery = query.toLowerCase();
    // Search logic based on available frontend fields
    return allProducts.filter(product =>
      product.name.toLowerCase().includes(lowerCaseQuery) ||
      product.description.toLowerCase().includes(lowerCaseQuery) || // Use the derived description
      (product.backendCategory || '').toLowerCase().includes(lowerCaseQuery) || // Search original category name
      product.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery)) || // Will always be false if tags is empty []
      (product.sellerName || '').toLowerCase().includes(lowerCaseQuery)
      // Add other fields like frete, parcelas if they are relevant for search
    );
  };
    // NOTE: Implement search logic for other relevant fields from backend like vendor etc.


  const value = {
    products: allProducts, // Provide all processed products
    featuredProducts, // Provide featured products
    categories, // Provide derived categories
    loading,
    error,
    getProductById,
    getProductsByCategory,
    getProductsBySearch,
    getCategoryIcon, // Provide the icon helper
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};