// src/pages/ConcreteCategoryPage.tsx (NOVO ARQUIVO)
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useProducts } from '../contexts/ProductContext'; // Usaremos para chamar fetchProductsByCollectionName
import ProductGrid from '../components/products/ProductGrid';
import { ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react'; // Ícones podem ser reutilizados
import { Product } from '../types/Product';

// Defina COLLECTION_MAP como no ProductContext ou importe-o se exportado
const COLLECTION_MAP = { // Repetido aqui para clareza, idealmente importar/compartilhar
    RELAMPAGO: "mercado_livre_relampago",
    OFERTAS: "mercado_livre_todas",
    MENOS_DE_100: "mercado_livre_menos_100",
    COMPRA_DO_MES: "mercado_livre_compra_mes",
    MODA: "mercado_livre_moda"
};

interface ConcreteCategoryPageProps {
  categoryPageTitle: string;
  collectionKey: keyof typeof COLLECTION_MAP; // Ex: "RELAMPAGO", "MODA"
}

const ConcreteCategoryPage: React.FC<ConcreteCategoryPageProps> = ({ categoryPageTitle, collectionKey }) => {
  const { fetchProductsByCollectionName, loading: contextLoading, error: contextError } = useProducts();
  
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); // Para filtros locais nesta página
  
  // Estados para filtros locais (busca, preço, ordenação), similar ao CatalogPage
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]); // Ajuste o máximo conforme necessário
  const [sortBy, setSortBy] = useState('relevance');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);


  useEffect(() => {
    const loadCategoryProducts = async () => {
      setPageLoading(true);
      const products = await fetchProductsByCollectionName(collectionKey);
      setCategoryProducts(products);
      setFilteredProducts(products); // Inicialmente, mostre todos os produtos da categoria
      setPageLoading(false);
    };
    loadCategoryProducts();
  }, [collectionKey, fetchProductsByCollectionName]);

  // Lógica de filtragem e ordenação (adaptada do seu CatalogPage.tsx)
  // Este useEffect operará sobre `categoryProducts`
  useEffect(() => {
    let filtered = [...categoryProducts];
    
    // Filter by search term (dentro da categoria atual)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) || 
        (product.description && product.description.toLowerCase().includes(query)) ||
        (product.tags && product.tags.some(tag => tag.toLowerCase().includes(query)))
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
      case 'newest': // Se você tiver um campo de data de criação
        // filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        // Ou por nome, como no seu CatalogPage:
        filtered.sort((a, b) => a.name.localeCompare(b.name)); // Verifique se esta é a intenção de 'newest'
        break;
      default: // 'relevance' - pode não ter um correspondente direto sem um score do backend
        break;
    }
    
    setFilteredProducts(filtered);
  }, [searchQuery, priceRange, sortBy, categoryProducts]);

  // Handlers (handleSearchSubmit, handleClearFilters, handlePriceChange, toggleMobileFilter)
  // podem ser copiados/adaptados do seu CatalogPage.tsx
  // Exemplo:
   const handleSearchSubmit = (e: React.FormEvent) => { e.preventDefault(); /* A busca já é reativa */ };
   const handleClearFilters = () => {
    setSearchQuery('');
    setPriceRange([0, 5000]);
    setSortBy('relevance');
   };
  const handlePriceChange = (index: number, value: number) => {
    const newRange = [...priceRange] as [number, number];
    newRange[index] = value;
    setPriceRange(newRange);
  };
  const toggleMobileFilter = () => setIsMobileFilterOpen(!isMobileFilterOpen);

  // A UI será muito similar à do CatalogPage, mas sem o filtro de "Categorias"
  // O título principal será `categoryPageTitle`
  
  const isLoading = pageLoading || contextLoading;

  if (isLoading) {
    // Pode usar um skeleton similar ao ProductGridSkeleton ou uma mensagem simples
    return <div className="container-custom py-16 text-center">Carregando produtos de {categoryPageTitle}...</div>;
  }

  if (contextError) {
    return <div className="container-custom py-16 text-center text-red-500">Erro ao carregar produtos: {contextError}</div>;
  }

  return (
    <div className="container-custom py-16">
      <motion.div /* Animações como em CatalogPage */ >
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2 mt-10">
          {categoryPageTitle}
        </h1>
        <p className="text-neutral-600 mb-8">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
        </p>
      </motion.div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filtros (Desktop) - Adaptado de CatalogPage, REMOVA a seção "Categorias" */}
        <motion.aside className="hidden lg:block w-64 flex-shrink-0" /* ... */>
          <div className="bg-white p-5 rounded-lg shadow-sm mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-neutral-900">Filtros</h2>
              <button onClick={handleClearFilters} className="text-sm text-primary-600 hover:text-primary-700">Limpar</button>
            </div>
            {/* NÃO incluir filtro de categorias aqui */}
            
            {/* Filtro de Faixa de Preço (copiado/adaptado de CatalogPage) */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-neutral-900 mb-3">Faixa de Preço</h3>
              {/* ... inputs de preço min/max e range sliders ... */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-neutral-500 mb-1">
                    <span>R$ {priceRange[0]}</span>
                    <span>R$ {priceRange[1]}</span>
                </div>
                <input type="range" min="0" max="5000" step="100" value={priceRange[0]} onChange={(e) => handlePriceChange(0, parseInt(e.target.value))} className="w-full" />
                <input type="range" min="0" max="5000" step="100" value={priceRange[1]} onChange={(e) => handlePriceChange(1, parseInt(e.target.value))} className="w-full" />
              </div>
              <div className="flex gap-2">
                  <input type="number" placeholder="Mín" value={priceRange[0]} onChange={(e) => handlePriceChange(0, parseInt(e.target.value))} className="w-full p-2 text-sm border border-neutral-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500" />
                  <input type="number" placeholder="Máx" value={priceRange[1]} onChange={(e) => handlePriceChange(1, parseInt(e.target.value))} className="w-full p-2 text-sm border border-neutral-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500" />
              </div>
            </div>
          </div>
        </motion.aside>
        
        {/* Conteúdo Principal (Barra de Controles e Grid de Produtos) - Adaptado de CatalogPage */}
        <motion.div className="flex-1" /* ... */>
          {/* Barra de Controles (Busca e Ordenação) */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col sm:flex-row justify-between gap-4">
            <form onSubmit={handleSearchSubmit} className="relative flex-1">
              <input type="text" placeholder={`Buscar em ${categoryPageTitle}...`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500" />
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
            </form>
            <div className="flex gap-3">
              <button onClick={toggleMobileFilter} className="lg:hidden flex items-center px-4 py-2 bg-white border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-50">
                <SlidersHorizontal size={18} className="mr-2" /> Filtros
              </button>
              {/* Dropdown de Ordenação (copiado/adaptado de CatalogPage) */}
              <div className="relative group">
                <button className="flex items-center px-4 py-2 bg-white border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-50">
                    <span>Ordenar</span> <ChevronDown size={18} className="ml-2" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-10 hidden group-hover:block">
                    {/* Opções de Ordenação: Relevância, Menor Preço, Maior Preço, etc. */}
                    <button onClick={() => setSortBy('relevance')} className={`block w-full text-left px-4 py-2 text-sm ${sortBy === 'relevance' ? 'bg-primary-50 text-primary-600' : 'text-neutral-700 hover:bg-neutral-50'}`}>Relevância</button>
                    <button onClick={() => setSortBy('price-asc')} className={`block w-full text-left px-4 py-2 text-sm ${sortBy === 'price-asc' ? 'bg-primary-50 text-primary-600' : 'text-neutral-700 hover:bg-neutral-50'}`}>Menor Preço</button>
                    {/* ... mais opções ... */}
                </div>
              </div>
            </div>
          </div>
          
          {/* Filtros Ativos (se houver) */}
          {/* ... (lógica para exibir tags de filtros ativos, adaptada de CatalogPage) ... */}

          <ProductGrid products={filteredProducts} loading={isLoading} emptyMessage={`Nenhum produto encontrado em ${categoryPageTitle} com os filtros atuais.`} />
        </motion.div>
      </div>

      {/* Filtros Mobile (Adaptado de CatalogPage, REMOVA a seção "Categorias") */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 ... ${isMobileFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={toggleMobileFilter}>
        <div className={`absolute right-0 top-0 bottom-0 w-80 ...`} onClick={e => e.stopPropagation()}>
          <div className="p-5">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-neutral-900">Filtros</h2>
                <button onClick={toggleMobileFilter}><X size={24} /></button>
            </div>
            {/* NÃO incluir filtro de categorias aqui */}
            {/* Filtro de Faixa de Preço Mobile (copiado/adaptado de CatalogPage) */}
            {/* Botões Aplicar/Limpar Filtros Mobile */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConcreteCategoryPage;