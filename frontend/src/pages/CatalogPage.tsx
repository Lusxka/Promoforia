// src/pages/CatalogPage.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProducts } from '../contexts/ProductContext';
import ProductGrid from '../components/products/ProductGrid';
import Pagination from '../components/common/Pagination';
import { ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react';

const displayCategories = [
    { name: "Relâmpago", pathSuffix: "relampago" },
    { name: "Ofertas", pathSuffix: "ofertas" },
    { name: "Menos de R$100", pathSuffix: "menos-de-100" },
    { name: "Compra do Mês", pathSuffix: "compra-do-mes" },
    { name: "Moda", pathSuffix: "moda" },
];

const CatalogPage: React.FC = () => {
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
        if (!allProductsFromContext || !Array.isArray(allProductsFromContext)) {
            return [];
        }
        let filtered = [...allProductsFromContext];
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(query) ||
                (product.description && product.description.toLowerCase().includes(query)) ||
                (product.tags && Array.isArray(product.tags) && product.tags.some(tag => tag.toLowerCase().includes(query)))
            );
        }
        filtered = filtered.filter(product =>
            product.price >= priceRange[0] && product.price <= priceRange[1]
        );
        let sorted = [...filtered];
        switch (sortBy) {
            case 'price-asc': sorted.sort((a, b) => a.price - b.price); break;
            case 'price-desc': sorted.sort((a, b) => b.price - a.price); break;
            case 'name-asc': sorted.sort((a, b) => a.name.localeCompare(b.name)); break;
            case 'name-desc': sorted.sort((a, b) => b.name.localeCompare(a.name)); break;
            case 'rating-desc': sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
            default:
                break;
        }
        return sortBy === 'relevance' ? filtered : sorted;
    }, [allProductsFromContext, searchQuery, priceRange, sortBy]);

    useEffect(() => {
        setCurrentPage(1);
        const params = new URLSearchParams(location.search);
        if (searchQuery) {
            params.set('q', searchQuery);
        } else {
            params.delete('q');
        }
        params.set('minPrice', priceRange[0].toString());
        params.set('maxPrice', priceRange[1].toString());
        params.set('sort', sortBy);
        navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    }, [filteredProducts, location.pathname, navigate, priceRange, searchQuery, sortBy]);

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

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isMobileFilterOpen) toggleMobileFilter();
    };

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: 0 | 1) => {
        const value = parseInt(e.target.value, 10);
        const newValue = isNaN(value) ? (index === 0 ? 0 : 5000) : value;
        const newRange: [number, number] = [...priceRange];
        if (index === 0) {
            newRange[0] = Math.min(newValue, newRange[1]);
        } else {
            newRange[1] = Math.max(newValue, newRange[0]);
        }
        setPriceRange(newRange);
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(e.target.value);
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
        // ProductGrid deve ter seus próprios estilos de dark mode para os skeletons.
        return <div className="container-custom py-16"><ProductGrid loading={true} count={40} /></div>;
    }

    if (error) {
        // CORREÇÃO DARK MODE: Cor do texto de erro.
        return <div className="container-custom py-16 text-center text-red-500 dark:text-red-400">Erro ao carregar produtos: {error}</div>;
    }

    return (
        <div className="container-custom py-16 mt-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* CORREÇÃO DARK MODE: Cor do cabeçalho */}
                <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                    {searchQuery ? `Resultados para "${searchQuery}"` : 'Todos os Produtos'}
                </h1>
                <p className="text-neutral-600 dark:text-neutral-300 mb-8">
                    {filteredProducts.length} {filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
                </p>
            </motion.div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* CORREÇÃO DARK MODE: Sidebar de filtros */}
                <aside className="hidden lg:block w-64 flex-shrink-0">
                    <div className="bg-white dark:bg-neutral-800 p-5 rounded-lg shadow-sm mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-medium text-neutral-900 dark:text-white">Filtros</h2>
                            <button
                                onClick={handleClearFilters}
                                className="text-sm text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors"
                            >
                                Limpar
                            </button>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-3">Categorias</h3>
                            <ul className="space-y-2">
                                <li>
                                    <button
                                        onClick={() => handleCategorySelectAndNavigate(null)}
                                        className={`text-sm w-full text-left transition-colors ${
                                            location.pathname === '/catalogo'
                                                ? 'text-primary-600 dark:text-primary-400 font-medium'
                                                : 'text-neutral-700 dark:text-neutral-200 hover:text-primary-600 dark:hover:text-primary-400'
                                        }`}
                                    >
                                        Todos os Produtos
                                    </button>
                                </li>
                                {displayCategories.map(category => (
                                    <li key={category.pathSuffix}>
                                        <button
                                            onClick={() => handleCategorySelectAndNavigate(category.pathSuffix)}
                                            className={`text-sm w-full text-left transition-colors ${
                                                location.pathname === `/categorias/${category.pathSuffix}`
                                                    ? 'text-primary-600 dark:text-primary-400 font-medium'
                                                    : 'text-neutral-700 dark:text-neutral-200 hover:text-primary-600 dark:hover:text-primary-400'
                                            }`}
                                        >
                                            {category.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-3">Preço</h3>
                            <div className="flex items-center space-x-3">
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={priceRange[0]}
                                    onChange={(e) => handlePriceChange(e, 0)}
                                    className="w-1/2 px-2 py-1 border rounded text-sm bg-transparent dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 dark:text-white"
                                    min="0"
                                />
                                <span className='dark:text-neutral-400'>-</span>
                                <input
                                    type="number"
                                    placeholder="5000"
                                    value={priceRange[1]}
                                    onChange={(e) => handlePriceChange(e, 1)}
                                    className="w-1/2 px-2 py-1 border rounded text-sm bg-transparent dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 dark:text-white"
                                    min="0"
                                />
                            </div>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Atual: R${priceRange[0].toFixed(2)} - R${priceRange[1].toFixed(2)}</p>
                        </div>
                    </div>
                </aside>

                <div className="flex-1">
                    {/* CORREÇÃO DARK MODE: Barra de controle */}
                    <div className="flex justify-between items-center mb-6">
                        <button
                            onClick={toggleMobileFilter}
                            className="lg:hidden flex items-center text-neutral-700 dark:text-neutral-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        >
                            <SlidersHorizontal size={20} className="mr-2" />
                            Filtrar
                        </button>

                        <div className="flex items-center">
                            <label htmlFor="sort-by" className="text-sm text-neutral-700 dark:text-neutral-300 mr-2">Ordenar por:</label>
                            <select
                                id="sort-by"
                                value={sortBy}
                                onChange={handleSortChange}
                                className="text-sm border rounded px-2 py-1 bg-white dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 dark:text-white"
                            >
                                <option value="relevance">Relevância</option>
                                <option value="price-asc">Preço: Menor para Maior</option>
                                <option value="price-desc">Preço: Maior para Menor</option>
                                <option value="name-asc">Nome: A-Z</option>
                                <option value="name-desc">Nome: Z-A</option>
                                <option value="rating-desc">Avaliação: Maior para Menor</option>
                            </select>
                        </div>
                    </div>

                    {filteredProducts.length === 0 && !loading ? (
                        // CORREÇÃO DARK MODE: Mensagem de "nenhum produto"
                        <div className="text-center py-12 text-neutral-600 dark:text-neutral-300">
                            Nenhum produto encontrado com os filtros atuais.
                            <button onClick={handleClearFilters} className="mt-4 text-primary-600 dark:text-primary-400 hover:underline">Limpar Filtros</button>
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
                </div>
            </div>

            {/* CORREÇÃO DARK MODE: Sidebar mobile */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
                    isMobileFilterOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                onClick={toggleMobileFilter}
            ></div>
            <div
                className={`fixed top-0 right-0 w-64 h-full bg-white dark:bg-neutral-900 shadow-lg z-50 transform transition-transform duration-300 ${
                    isMobileFilterOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
                onClick={e => e.stopPropagation()}
            >
                <div className="p-5 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
                    <h2 className="text-lg font-medium text-neutral-900 dark:text-white">Filtros</h2>
                    <button onClick={toggleMobileFilter} className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"><X size={24} /></button>
                </div>

                <div className="p-5 flex flex-col space-y-6 overflow-y-auto h-[calc(100%-70px)]">
                    <button
                        onClick={() => { handleClearFilters(); toggleMobileFilter(); }}
                        className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors w-full text-right"
                    >
                        Limpar Filtros
                    </button>

                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-3">Categorias</h3>
                        <ul className="space-y-3">
                             <li>
                                <button
                                    onClick={() => handleCategorySelectAndNavigate(null)}
                                    className={`text-sm w-full text-left transition-colors ${
                                        location.pathname === '/catalogo'
                                            ? 'text-primary-600 dark:text-primary-400 font-medium'
                                            : 'text-neutral-700 dark:text-neutral-200 hover:text-primary-600 dark:hover:text-primary-400'
                                    }`}
                                >
                                    Todos os Produtos
                                </button>
                            </li>
                            {displayCategories.map(category => (
                                <li key={category.pathSuffix}>
                                    <button
                                        onClick={() => handleCategorySelectAndNavigate(category.pathSuffix)}
                                        className={`text-sm w-full text-left transition-colors ${
                                            location.pathname === `/categorias/${category.pathSuffix}`
                                                ? 'text-primary-600 dark:text-primary-400 font-medium'
                                                : 'text-neutral-700 dark:text-neutral-200 hover:text-primary-600 dark:hover:text-primary-400'
                                        }`}
                                    >
                                        {category.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-3">Preço</h3>
                        <div className="flex items-center space-x-3">
                            <input
                                type="number"
                                placeholder="0"
                                value={priceRange[0]}
                                onChange={(e) => handlePriceChange(e, 0)}
                                className="w-1/2 px-2 py-1 border rounded text-sm bg-transparent dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 dark:text-white"
                                min="0"
                            />
                            <span className="dark:text-neutral-400">-</span>
                            <input
                                type="number"
                                placeholder="5000"
                                value={priceRange[1]}
                                onChange={(e) => handlePriceChange(e, 1)}
                                className="w-1/2 px-2 py-1 border rounded text-sm bg-transparent dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 dark:text-white"
                                min="0"
                            />
                        </div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Atual: R${priceRange[0].toFixed(2)} - R${priceRange[1].toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CatalogPage;