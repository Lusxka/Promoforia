// src/pages/ConcreteCategoryPage.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useProducts } from '../contexts/ProductContext';
import ProductGrid from '../components/products/ProductGrid';
import Pagination from '../components/common/Pagination';
import { ChevronDown, Search, SlidersHorizontal, X, Filter, DollarSign } from 'lucide-react';
import { Product } from '../types/Product';

const COLLECTION_MAP = {
    RELAMPAGO: "mercado_livre_relampago",
    OFERTAS: "mercado_livre_todas",
    MENOS_DE_100: "mercado_livre_menos_100",
    COMPRA_DO_MES: "mercado_livre_compra_mes",
    MODA: "mercado_livre_moda"
};

interface ConcreteCategoryPageProps {
    categoryPageTitle: string;
    collectionKey: keyof typeof COLLECTION_MAP;
}

const ConcreteCategoryPage: React.FC<ConcreteCategoryPageProps> = ({ categoryPageTitle, collectionKey }) => {
    // ... toda a sua lógica de estados e hooks permanece 100% intacta ...
    const { fetchProductsByCollectionName, loading: contextLoading, error: contextError } = useProducts();
    const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
    const [sortBy, setSortBy] = useState('relevance');
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 40;

    useEffect(() => {
        const loadCategoryProducts = async () => {
            setPageLoading(true);
            const products = await fetchProductsByCollectionName(collectionKey);
            setCategoryProducts(products);
            setCurrentPage(1);
            setPageLoading(false);
        };
        loadCategoryProducts();
    }, [collectionKey, fetchProductsByCollectionName]);

    useEffect(() => {
        let filtered = [...categoryProducts];
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(query) ||
                (product.description && product.description.toLowerCase().includes(query)) ||
                (product.tags && product.tags.some(tag => tag.toLowerCase().includes(query)))
            );
        }
        filtered = filtered.filter(product =>
            product.price >= priceRange[0] && product.price <= priceRange[1]
        );
        switch (sortBy) {
            case 'price-asc': filtered.sort((a, b) => a.price - b.price); break;
            case 'price-desc': filtered.sort((a, b) => b.price - a.price); break;
            case 'rating': filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
            case 'newest': filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
            default: break;
        }
        setFilteredProducts(filtered);
        setCurrentPage(1);
    }, [searchQuery, priceRange, sortBy, categoryProducts]);
    
    const handleSearchSubmit = (e: React.FormEvent) => { e.preventDefault(); };
    const handleClearFilters = () => {
        setSearchQuery('');
        setPriceRange([0, 5000]);
        setSortBy('relevance');
    };
    const handlePriceChange = (index: number, value: number) => {
        const newRange = [...priceRange] as [number, number];
        newRange[index] = isNaN(value) ? (index === 0 ? 0 : 5000) : value;
        setPriceRange(newRange);
    };
    const toggleMobileFilter = () => setIsMobileFilterOpen(!isMobileFilterOpen);

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const isLoading = pageLoading || contextLoading;

    if (isLoading && categoryProducts.length === 0) {
        return <div className="container-custom py-16"><ProductGrid loading={true} count={40} products={[]} /></div>;
    }

    if (contextError) {
        return <div className="container-custom py-16 text-center text-red-500 dark:text-red-400">Erro ao carregar produtos: {contextError}</div>;
    }

    const showNoResultsMessage = !isLoading && filteredProducts.length === 0;

    return (
        <>
            <div className="container-custom py-16 mt-12">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-2">
                        {categoryPageTitle}
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

                     {/* ... O resto do seu JSX (main content, mobile filter) permanece o mesmo, já que a cor e o slider já foram ajustados ... */}
                     <motion.div 
                        className="flex-1"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                       <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 mb-6">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                               <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full sm:max-w-md">
                                    <input type="text" placeholder={`Buscar em ${categoryPageTitle}...`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all" />
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
                                            <button onClick={() => setSortBy('rating')} className={`block w-full text-left px-4 py-3 text-sm transition-colors ${ sortBy === 'rating' ? 'bg-secondary-50 dark:bg-secondary-500/10 text-secondary-600 dark:text-secondary-300 font-medium' : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700'}`}>Melhor Avaliado</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {showNoResultsMessage ? (
                             <div className="text-center py-12 text-neutral-600 dark:text-neutral-300">
                                <Search size={48} className="mx-auto text-neutral-400 dark:text-neutral-500 mb-4" />
                                <p className="text-lg font-medium mb-2">Nenhum produto encontrado</p>
                                <p className="text-sm">Tente ajustar seus filtros para encontrar o que procura</p>
                                <button onClick={handleClearFilters} className="mt-4 px-6 py-2 bg-secondary-600 hover:bg-secondary-700 text-white rounded-lg font-medium transition-colors">Limpar Filtros</button>
                             </div>
                        ) : (
                            <>
                                <ProductGrid products={currentProducts} loading={isLoading} />
                                {totalPages > 1 && (
                                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
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
                    background-color: #FBBF24; /* Cor amarela principal */
                    border-radius: 50%;
                    border: 2px solid #ffffff; /* Borda branca para destacar */
                    box-shadow: 0 0 2px rgba(0,0,0,0.3);
                    cursor: pointer;
                    margin-top: -6px; /* Ajuste vertical para centralizar na barra (h-2 = 8px) */
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

export default ConcreteCategoryPage;