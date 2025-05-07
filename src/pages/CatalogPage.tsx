import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProducts } from '../contexts/ProductContext';
import ProductGrid from '../components/products/ProductGrid';
import { ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react';

const CatalogPage: React.FC = () => {
  const location = useLocation();
  const { products = [], loading } = useProducts();
  
  const [filteredProducts, setFilteredProducts] = useState<Array<any>>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [sortBy, setSortBy] = useState('relevance');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  // Process URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('categoria');
    const queryParam = params.get('q');
    const tagParam = params.get('tag');
    
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    
    if (queryParam) {
      setSearchQuery(queryParam);
    }
  }, [location.search]);

  // Filter products based on selected criteria
  useEffect(() => {
    if (!loading && Array.isArray(products)) {
      let filtered = [...products];
      
      // Filter by category
      if (selectedCategory) {
        filtered = filtered.filter(product => 
          product.category.toLowerCase() === selectedCategory.toLowerCase()
        );
      }
      
      // Filter by search term
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(product => 
          product.name.toLowerCase().includes(query) || 
          product.description.toLowerCase().includes(query) ||
          product.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }
      
      // Filter by price range
      filtered = filtered.filter(product => 
        product.price >= priceRange[0] && product.price <= priceRange[1]
      );
      
      // Sort products
      switch (sortBy) {
        case 'price-asc':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default:
          break;
      }
      
      setFilteredProducts(filtered);
    }
  }, [loading, products, selectedCategory, searchQuery, priceRange, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
  };

  const handleClearFilters = () => {
    setSelectedCategory(null);
    setSearchQuery('');
    setPriceRange([0, 5000]);
    setSortBy('relevance');
  };

  const handlePriceChange = (index: number, value: number) => {
    const newRange = [...priceRange] as [number, number];
    newRange[index] = value;
    setPriceRange(newRange);
  };

  const toggleMobileFilter = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen);
  };

  // Get unique categories from products array
  const categories = Array.isArray(products) 
    ? [...new Set(products.map(product => product.category))]
    : [];

  return (
    <div className="container-custom py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2 mt-10">
      {selectedCategory
        ? `Produtos: ${selectedCategory}`
        : searchQuery
          ? `Resultados para "${searchQuery}"`
          : 'Todos os Produtos'}
        </h1>
        
        <p className="text-neutral-600 mb-8">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
        </p>
      </motion.div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop filters */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="hidden lg:block w-64 flex-shrink-0"
        >
          <div className="bg-white p-5 rounded-lg shadow-sm mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-neutral-900">Filtros</h2>
              <button 
                onClick={handleClearFilters}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Limpar
              </button>
            </div>
            
            {/* Categories */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-neutral-900 mb-3">Categorias</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => handleCategorySelect(null)}
                    className={`text-sm w-full text-left ${
                      selectedCategory === null 
                        ? 'text-primary-600 font-medium' 
                        : 'text-neutral-700'
                    }`}
                  >
                    Todas as Categorias
                  </button>
                </li>
                {categories.map(category => (
                  <li key={category}>
                    <button
                      onClick={() => handleCategorySelect(category)}
                      className={`text-sm w-full text-left ${
                        selectedCategory === category 
                          ? 'text-primary-600 font-medium' 
                          : 'text-neutral-700'
                      }`}
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Price range */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-neutral-900 mb-3">Faixa de Preço</h3>
              <div className="mb-4">
                <div className="flex justify-between text-xs text-neutral-500 mb-1">
                  <span>R$ {priceRange[0]}</span>
                  <span>R$ {priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange(0, parseInt(e.target.value))}
                  className="w-full"
                />
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange(1, parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="sr-only" htmlFor="min-price">Preço Mínimo</label>
                  <input
                    id="min-price"
                    type="number"
                    placeholder="Mín"
                    value={priceRange[0]}
                    onChange={(e) => handlePriceChange(0, parseInt(e.target.value))}
                    className="w-full p-2 text-sm border border-neutral-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="sr-only" htmlFor="max-price">Preço Máximo</label>
                  <input
                    id="max-price"
                    type="number"
                    placeholder="Máx"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceChange(1, parseInt(e.target.value))}
                    className="w-full p-2 text-sm border border-neutral-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.aside>
        
        {/* Main content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1"
        >
          {/* Controls bar */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col sm:flex-row justify-between gap-4">
            {/* Search */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1">
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
            </form>
            
            <div className="flex gap-3">
              {/* Mobile filter button */}
              <button
                onClick={toggleMobileFilter}
                className="lg:hidden flex items-center px-4 py-2 bg-white border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-50"
              >
                <SlidersHorizontal size={18} className="mr-2" />
                Filtros
              </button>
              
              {/* Sort */}
              <div className="relative group">
                <button className="flex items-center px-4 py-2 bg-white border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-50">
                  <span>Ordenar</span>
                  <ChevronDown size={18} className="ml-2" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-10 hidden group-hover:block">
                  <button
                    onClick={() => setSortBy('relevance')}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      sortBy === 'relevance' ? 'bg-primary-50 text-primary-600' : 'text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    Relevância
                  </button>
                  <button
                    onClick={() => setSortBy('price-asc')}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      sortBy === 'price-asc' ? 'bg-primary-50 text-primary-600' : 'text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    Menor Preço
                  </button>
                  <button
                    onClick={() => setSortBy('price-desc')}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      sortBy === 'price-desc' ? 'bg-primary-50 text-primary-600' : 'text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    Maior Preço
                  </button>
                  <button
                    onClick={() => setSortBy('rating')}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      sortBy === 'rating' ? 'bg-primary-50 text-primary-600' : 'text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    Melhor Avaliação
                  </button>
                  <button
                    onClick={() => setSortBy('newest')}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      sortBy === 'newest' ? 'bg-primary-50 text-primary-600' : 'text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    Mais Recentes
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Active filters */}
          {(selectedCategory || searchQuery || priceRange[0] > 0 || priceRange[1] < 5000) && (
            <div className="mb-6 flex flex-wrap gap-2">
              {selectedCategory && (
                <div className="inline-flex items-center bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm">
                  Categoria: {selectedCategory}
                  <button 
                    onClick={() => setSelectedCategory(null)}
                    className="ml-2 text-primary-500 hover:text-primary-700"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              
              {searchQuery && (
                <div className="inline-flex items-center bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm">
                  Busca: {searchQuery}
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="ml-2 text-primary-500 hover:text-primary-700"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              
              {(priceRange[0] > 0 || priceRange[1] < 5000) && (
                <div className="inline-flex items-center bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm">
                  Preço: R$ {priceRange[0]} - R$ {priceRange[1]}
                  <button 
                    onClick={() => setPriceRange([0, 5000])}
                    className="ml-2 text-primary-500 hover:text-primary-700"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              
              <button 
                onClick={handleClearFilters}
                className="text-sm text-primary-600 hover:text-primary-700 px-3 py-1 border border-primary-600 rounded-full hover:bg-primary-50"
              >
                Limpar Todos
              </button>
            </div>
          )}
          
          {/* Product list */}
          <ProductGrid 
            products={filteredProducts} 
            loading={loading} 
            emptyMessage={
              searchQuery 
                ? `Nenhum produto encontrado para "${searchQuery}". Tente outra busca.` 
                : "Nenhum produto encontrado com os filtros atuais."
            } 
          />
        </motion.div>
      </div>
      
      {/* Mobile filters */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
          isMobileFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleMobileFilter}
      >
        <div 
          className={`absolute right-0 top-0 bottom-0 w-80 max-w-full bg-white transform transition-transform duration-300 ${
            isMobileFilterOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={e => e.stopPropagation()}
        >
          <div className="p-5">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-neutral-900">Filtros</h2>
              <button onClick={toggleMobileFilter} className="text-neutral-500 hover:text-neutral-700">
                <X size={24} />
              </button>
            </div>
            
            {/* Categories */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-neutral-900 mb-3">Categorias</h3>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => {
                      handleCategorySelect(null);
                      toggleMobileFilter();
                    }}
                    className={`text-sm w-full text-left ${
                      selectedCategory === null 
                        ? 'text-primary-600 font-medium' 
                        : 'text-neutral-700'
                    }`}
                  >
                    Todas as Categorias
                  </button>
                </li>
                {categories.map(category => (
                  <li key={category}>
                    <button
                      onClick={() => {
                        handleCategorySelect(category);
                        toggleMobileFilter();
                      }}
                      className={`text-sm w-full text-left ${
                        selectedCategory === category 
                          ? 'text-primary-600 font-medium' 
                          : 'text-neutral-700'
                      }`}
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Price range */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-neutral-900 mb-3">Faixa de Preço</h3>
              <div className="mb-4">
                <div className="flex justify-between text-xs text-neutral-500 mb-1">
                  <span>R$ {priceRange[0]}</span>
                  <span>R$ {priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange(0, parseInt(e.target.value))}
                  className="w-full"
                />
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange(1, parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="sr-only" htmlFor="min-price-mobile">Preço Mínimo</label>
                  <input
                    id="min-price-mobile"
                    type="number"
                    placeholder="Mín"
                    value={priceRange[0]}
                    onChange={(e) => handlePriceChange(0, parseInt(e.target.value))}
                    className="w-full p-2 text-sm border border-neutral-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="sr-only" htmlFor="max-price-mobile">Preço Máximo</label>
                  <input
                    id="max-price-mobile"
                    type="number"
                    placeholder="Máx"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceChange(1, parseInt(e.target.value))}
                    className="w-full p-2 text-sm border border-neutral-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>
            
            {/* Apply filters */}
            <div className="flex flex-col gap-3">
              <button 
                onClick={toggleMobileFilter}
                className="button-primary py-3"
              >
                Aplicar Filtros
              </button>
              <button 
                onClick={() => {
                  handleClearFilters();
                  toggleMobileFilter();
                }}
                className="button-outline py-3"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;