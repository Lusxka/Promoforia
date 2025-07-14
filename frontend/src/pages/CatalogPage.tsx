// src/pages/CatalogPage.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProducts } from '../contexts/ProductContext';
import ProductGrid from '../components/products/ProductGrid';
import Pagination from '../components/common/Pagination';
import { ChevronDown, Search, SlidersHorizontal, X, Filter, Tag, DollarSign } from 'lucide-react';

const displayCategories = [
    { name: "Relâmpago", pathSuffix: "relampago" },
    { name: "Ofertas", pathSuffix: "ofertas" },
    { name: "Menos de R$100", pathSuffix: "menos-de-100" },
    { name: "Compra do Mês", pathSuffix: "compra-do-mes" },
    { name: "Moda", pathSuffix: "moda" },
];

const CatalogPage: React.FC = () => {
    // ... A sua lógica de estados e hooks permanece 100% intacta ...
    const location = useLocation();
    const navigate = useNavigate();
    const { products: allProductsFromContext, loading, error } = useProducts();
    const [searchQuery, setSearchQuery] = useState('');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
    const [sortBy, setSortBy] = useState('relevance');
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 40;

    const toggleMobileFilter = () => {
        setIsMobileFilterOpen(!isMobileFilterOpen);
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const queryParam = params.get('q');
        setSearchQuery(queryParam || '');
        const sortParam = params.get('sort');
        if (sortParam) {
            setSortBy(sortParam);
        } else {
            setSortBy('relevance');
        }
    }, [location.search]);

    const filteredProducts = useMemo(() => {
        if (!allProductsFromContext || !Array.isArray(allProductsFromContext)) { return []; }
        let filtered = [...allProductsFromContext];
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(query) ||
                (product.description && product.description.toLowerCase().includes(query)) ||
                (product.tags && Array.isArray(product.tags) && product.tags.some(tag => tag.toLowerCase().includes(query)))
            );
        }
        filtered = filtered.filter(product => product.price >= priceRange[0] && product.price <= priceRange[1]);
        let sorted = [...filtered];
        switch (sortBy) {
            case 'price-asc': sorted.sort((a, b) => a.price - b.price); break;
            case 'price-desc': sorted.sort((a, b) => b.price - a.price); break;
            case 'rating-desc': sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
            default: break;
        }
        return sorted;
    }, [allProductsFromContext, searchQuery, priceRange, sortBy]);

    useEffect(() => {
        setCurrentPage(1);
    }, [filteredProducts]);
    
    const handleClearFilters = () => {
        setSearchQuery('');
        setPriceRange([0, 5000]);
        setSortBy('relevance');
    };

    const handleCategorySelectAndNavigate = (categoryPathSuffix: string | null) => {
        if (categoryPathSuffix) {
            navigate(`/categorias/${categoryPathSuffix}`);
        } else {
            navigate('/catalogo');
        }
        if (isMobileFilterOpen) toggleMobileFilter();
    };

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handlePriceChange = (index: number, value: number) => {
        const newRange = [...priceRange] as [number, number];
        newRange[index] = isNaN(value) ? (index === 0 ? 0 : 5000) : value;
        setPriceRange(newRange);
    };

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading && allProductsFromContext.length === 0) {
        return <div className="container-custom py-16"><ProductGrid loading={true} count={40} /></div>;
    }

    if (error) {
        return <div className="container-custom py-16 text-center text-red-500 dark:text-red-400">Erro ao carregar produtos: {error}</div>;
    }

    return (
        <>
            <div className="container-custom py-16 mt-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                        {searchQuery ? `Resultados para "${searchQuery}"` : 'Todos os Produtos'}
                    </h1>
                    <p className="text-neutral-600 dark:text-neutral-300 mb-8">
                        {filteredProducts.length} {filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
                    </p>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-8">
                    <motion.aside 
                        className="hidden lg:block w-64 flex-shrink-0"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-hidden">
                            <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Filter size={20} className="text-secondary-500 dark:text-secondary-400 mr-2" />
                                        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Filtros</h2>
                                    </div>
                                    <button
                                        onClick={handleClearFilters}
                                        className="text-sm text-secondary-600 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-300 font-medium transition-colors"
                                    >
                                        Limpar
                                    </button>
                                </div>
                            </div>
                            <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
                                <div className="flex items-center mb-4">
                                    <Tag size={18} className="text-neutral-600 dark:text-neutral-400 mr-2" />
                                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Categorias</h3>
                                </div>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => handleCategorySelectAndNavigate(null)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                                            location.pathname === '/catalogo'
                                                ? 'bg-secondary-50 dark:bg-secondary-500/10 text-secondary-700 dark:text-secondary-300 font-medium border border-secondary-200 dark:border-secondary-500/20'
                                                : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 hover:text-secondary-600 dark:hover:text-secondary-400'
                                        }`}
                                    >
                                        Todos os Produtos
                                    </button>
                                    {displayCategories.map(category => (
                                        <button
                                            key={category.pathSuffix}
                                            onClick={() => handleCategorySelectAndNavigate(category.pathSuffix)}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                                                location.pathname === `/categorias/${category.pathSuffix}`
                                                    ? 'bg-secondary-50 dark:bg-secondary-500/10 text-secondary-700 dark:text-secondary-300 font-medium border border-secondary-200 dark:border-secondary-500/20'
                                                    : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 hover:text-secondary-600 dark:hover:text-secondary-400'
                                            }`}
                                        >
                                            {category.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center mb-4">
                                    <DollarSign size={18} className="text-neutral-600 dark:text-neutral-400 mr-2" />
                                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Faixa de Preço</h3>
                                </div>
                                <div className="mb-4">
                                    <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-2">
                                        <span>R$ {priceRange[0].toFixed(2)}</span>
                                        <span>R$ {priceRange[1].toFixed(2)}</span>
                                    </div>
                                    {/* ✅ SLIDER COM CLASSE PARA A BOLINHA AMARELA ✅ */}
                                    <div className="space-y-2">
                                        <input type="range" min="0" max="5000" step="10" value={priceRange[0]} onChange={(e) => handlePriceChange(0, parseInt(e.target.value))} className="w-full h-2 bg-neutral-200 dark:bg-neutral-600 rounded-lg appearance-none cursor-pointer slider-yellow" />
                                        <input type="range" min="0" max="5000" step="10" value={priceRange[1]} onChange={(e) => handlePriceChange(1, parseInt(e.target.value))} className="w-full h-2 bg-neutral-200 dark:bg-neutral-600 rounded-lg appearance-none cursor-pointer slider-yellow" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-xs text-neutral-500 dark:text-neutral-400 mb-1">Mínimo</label>
                                        <input type="number" placeholder="0" value={priceRange[0]} onChange={(e) => handlePriceChange(0, parseInt(e.target.value))} className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all" min="0" />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-neutral-500 dark:text-neutral-400 mb-1">Máximo</label>
                                        <input type="number" placeholder="5000" value={priceRange[1]} onChange={(e) => handlePriceChange(1, parseInt(e.target.value))} className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all" min="0" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.aside>
                    <motion.div 
                        className="flex-1"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        {/* ... O resto do JSX com a barra de busca, grid, etc. permanece o mesmo ... */}
                        <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 mb-6">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                <form onSubmit={(e) => { e.preventDefault()}} className="relative flex-1 w-full sm:max-w-md">
                                    <input type="text" placeholder="Buscar produtos..." value={searchQuery} onChange={handleSearchInputChange} className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all" />
                                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500 dark:text-neutral-400" />
                                </form>
                                <div className="flex items-center gap-3">
                                    <button onClick={toggleMobileFilter} className="lg:hidden flex items-center px-4 py-2 bg-neutral-100 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-all">
                                        <SlidersHorizontal size={18} className="mr-2" />
                                        Filtros
                                    </button>
                                    <div className="relative group">
                                        <button className="flex items-center px-4 py-2 bg-neutral-100 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-all">
                                            <span className="text-sm">Ordenar</span>
                                            <ChevronDown size={16} className="ml-2" />
                                        </button>
                                        <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden z-10 hidden group-hover:block">
                                            <button onClick={() => setSortBy('relevance')} className={`block w-full text-left px-4 py-3 text-sm transition-colors ${ sortBy === 'relevance' ? 'bg-secondary-50 dark:bg-secondary-500/10 text-secondary-600 dark:text-secondary-300 font-medium' : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700'}`}>Relevância</button>
                                            <button onClick={() => setSortBy('price-asc')} className={`block w-full text-left px-4 py-3 text-sm transition-colors ${ sortBy === 'price-asc' ? 'bg-secondary-50 dark:bg-secondary-500/10 text-secondary-600 dark:text-secondary-300 font-medium' : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700'}`}>Menor Preço</button>
                                            <button onClick={() => setSortBy('price-desc')} className={`block w-full text-left px-4 py-3 text-sm transition-colors ${ sortBy === 'price-desc' ? 'bg-secondary-50 dark:bg-secondary-500/10 text-secondary-600 dark:text-secondary-300 font-medium' : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700'}`}>Maior Preço</button>
                                            <button onClick={() => setSortBy('rating-desc')} className={`block w-full text-left px-4 py-3 text-sm transition-colors ${ sortBy === 'rating-desc' ? 'bg-secondary-50 dark:bg-secondary-500/10 text-secondary-600 dark:text-secondary-300 font-medium' : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700'}`}>Melhor Avaliado</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {filteredProducts.length === 0 && !loading ? (
                            <div className="text-center py-12 text-neutral-600 dark:text-neutral-300">
                                <div className="mb-4">
                                    <Search size={48} className="mx-auto text-neutral-400 dark:text-neutral-500 mb-4" />
                                    <p className="text-lg font-medium mb-2">Nenhum produto encontrado</p>
                                    <p className="text-sm">Tente ajustar seus filtros ou fazer uma nova busca</p>
                                </div>
                                <button onClick={handleClearFilters} className="px-6 py-2 bg-secondary-600 hover:bg-secondary-700 text-white rounded-lg font-medium transition-colors">
                                    Limpar Filtros
                                </button>
                            </div>
                        ) : (
                            <>
                                <ProductGrid
                                    products={currentProducts}
                                    loading={loading}
                                    emptyMessage="Nenhum produto encontrado nesta página."
                                />
                                {totalPages > 1 && (
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={handlePageChange}
                                    />
                                )}
                            </>
                        )}
                    </motion.div>
                </div>
            </div>
            
            {/* ✅ NOVO CSS PARA A BOLINHA AMARELA DO SLIDER ✅ */}
            <style>{`
                .slider-yellow::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    background-color: #FBBF24; /* Cor amarela principal (secondary-400) */
                    border-radius: 50%;
                    border: 2px solid #ffffff; /* Borda branca para destacar */
                    box-shadow: 0 0 2px rgba(0,0,0,0.3);
                    cursor: pointer;
                    margin-top: -6px; /* Ajuste para centralizar na barra (h-2 = 8px) */
                    transition: transform 0.2s ease-in-out;
                }
                .slider-yellow::-webkit-slider-thumb:hover {
                    transform: scale(1.15);
                }
                .slider-yellow::-moz-range-thumb {
                    width: 16px;
                    height: 16px;
                    background-color: #FBBF24; /* Cor amarela principal */
                    border-radius: 50%;
                    border: 2px solid #ffffff;
                    cursor: pointer;
                }
                .slider-yellow::-moz-range-thumb:hover {
                    transform: scale(1.15);
                }
            `}</style>
        </>
    );
};

export default CatalogPage;