// src/pages/ConcreteCategoryPage.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useProducts } from '../contexts/ProductContext';
import ProductGrid from '../components/products/ProductGrid';
import Pagination from '../components/common/Pagination'; // Importar o novo componente de Paginação
import { ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react';
import { Product } from '../types/Product';



// Defina COLLECTION_MAP como no ProductContext ou importe-o se exportado
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
    const { fetchProductsByCollectionName, loading: contextLoading, error: contextError } = useProducts();

    const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

    // Estados para filtros locais (busca, preço, ordenação), similar ao CatalogPage
    const [searchQuery, setSearchQuery] = useState('');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]); // Ajuste o máximo conforme necessário
    const [sortBy, setSortBy] = useState('relevance');
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);

    // --- Estados para Paginação ---
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 40; // Definido como 40 produtos por página
    // ---------------------------------

    useEffect(() => {
        const loadCategoryProducts = async () => {
            setPageLoading(true);
            const products = await fetchProductsByCollectionName(collectionKey);
            setCategoryProducts(products);
            // Resetar a página para 1 sempre que os produtos da categoria mudarem
            setCurrentPage(1);
            setPageLoading(false);
        };
        loadCategoryProducts();
    }, [collectionKey, fetchProductsByCollectionName]);

    // Lógica de filtragem e ordenação
    // Este useEffect operará sobre `categoryProducts` e atualizará `filteredProducts`
    useEffect(() => {
        let filtered = [...categoryProducts];

        // Filter by search term
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
                filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0)); // Garantir que ratings nulos/undefined sejam tratados
                break;
            case 'newest':
                 // Supondo que 'newest' no CatalogPage ordenava por nome ou outra propriedade
                 // Ajuste aqui para a lógica de ordenação 'newest' real do seu projeto
                 filtered.sort((a, b) => a.name.localeCompare(b.name)); // Exemplo: ordenar por nome
                break;
            default: // 'relevance'
                break;
        }

        setFilteredProducts(filtered);
         // Resetar a página para 1 sempre que os filtros mudarem
        setCurrentPage(1);
    }, [searchQuery, priceRange, sortBy, categoryProducts]);

    // Handlers
    const handleSearchSubmit = (e: React.FormEvent) => { e.preventDefault(); /* A busca já é reativa via useEffect */ };
    const handleClearFilters = () => {
        setSearchQuery('');
        setPriceRange([0, 5000]); // Resetar para o range padrão
        setSortBy('relevance'); // Resetar para ordenação padrão
        // Não precisa chamar setFilteredProducts aqui, o useEffect fará isso
    };
     const handlePriceChange = (index: number, value: number) => {
        const newRange = [...priceRange] as [number, number];
        newRange[index] = isNaN(value) ? (index === 0 ? 0 : 5000) : value; // Tratar NaN
        setPriceRange(newRange);
     };
    const toggleMobileFilter = () => setIsMobileFilterOpen(!isMobileFilterOpen);

    // --- Lógica de Paginação para Exibir Produtos ---
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    // Fatiar o array filteredProducts para obter os produtos da página atual
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    // Calcular o número total de páginas
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    // ---------------------------------------------

    // Handler para mudar de página
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        // Opcional: scrollar para o topo da lista de produtos ou da página ao mudar a página
        // Você pode adicionar um ref a um elemento (ex: o div da ProductGrid) e scrollar para ele
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll para o topo da janela
    };


    const isLoading = pageLoading || contextLoading;

    if (isLoading && categoryProducts.length === 0) { // Mostra esqueleto apenas no carregamento inicial ou ao mudar categoria/filtros sem dados anteriores
         return <div className="container-custom py-16"><ProductGrid loading={true} count={40} products={[]} /></div>; // Mostrar 40 esqueletos
    }


    if (contextError) {
        return <div className="container-custom py-16 text-center text-red-500">Erro ao carregar produtos: {contextError}</div>;
    }

     const showEmptyMessage = !isLoading && currentProducts.length === 0 && filteredProducts.length > 0; // Mostra se não estiver carregando, não houver produtos NA PÁGINA ATUAL, mas houver produtos filtrados (acontece se estiver na última página de um filtro e o próximo filtro resultar em menos páginas)
     const showNoResultsMessage = !isLoading && filteredProducts.length === 0; // Mostra se não houver NENHUM produto após filtros

    return (
        <div className="container-custom py-16">
            <motion.div /* Animações como em CatalogPage */ >
                <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2 mt-10">
                    {categoryPageTitle}
                </h1>
                 {/* Mostrar contagem total de produtos filtrados */}
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

                        {/* Filtro de Faixa de Preço */}
                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-neutral-900 mb-3">Faixa de Preço</h3>
                            <div className="mb-4">
                                <div className="flex justify-between text-xs text-neutral-500 mb-1">
                                     <span>R$ {priceRange[0].toFixed(2)}</span> {/* Formatar para 2 casas decimais */}
                                     <span>R$ {priceRange[1].toFixed(2)}</span> {/* Formatar para 2 casas decimais */}
                                </div>
                                 {/* Ajustar max dos sliders conforme o range máximo que você espera */}
                                <input type="range" min="0" max="5000" step="10" value={priceRange[0]} onChange={(e) => handlePriceChange(0, parseInt(e.target.value))} className="w-full" />
                                <input type="range" min="0" max="5000" step="10" value={priceRange[1]} onChange={(e) => handlePriceChange(1, parseInt(e.target.value))} className="w-full" />
                            </div>
                            <div className="flex gap-2">
                                 <input type="number" placeholder="Mín" value={priceRange[0]} onChange={(e) => handlePriceChange(0, parseInt(e.target.value))} className="w-full p-2 text-sm border border-neutral-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500" />
                                 <input type="number" placeholder="Máx" value={priceRange[1]} onChange={(e) => handlePriceChange(1, parseInt(e.target.value))} className="w-full p-2 text-sm border border-neutral-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500" />
                            </div>
                        </div>
                    </div>
                </motion.aside>

                {/* Conteúdo Principal (Barra de Controles e Grid de Produtos) */}
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
                            {/* Dropdown de Ordenação */}
                            <div className="relative group">
                                <button className="flex items-center px-4 py-2 bg-white border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-50">
                                    <span>Ordenar</span> <ChevronDown size={18} className="ml-2" />
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-10 hidden group-hover:block">
                                    {/* Opções de Ordenação */}
                                    <button onClick={() => setSortBy('relevance')} className={`block w-full text-left px-4 py-2 text-sm ${sortBy === 'relevance' ? 'bg-primary-50 text-primary-600' : 'text-neutral-700 hover:bg-neutral-50'}`}>Relevância</button>
                                    <button onClick={() => setSortBy('price-asc')} className={`block w-full text-left px-4 py-2 text-sm ${sortBy === 'price-asc' ? 'bg-primary-50 text-primary-600' : 'text-neutral-700 hover:bg-neutral-50'}`}>Menor Preço</button>
                                    <button onClick={() => setSortBy('price-desc')} className={`block w-full text-left px-4 py-2 text-sm ${sortBy === 'price-desc' ? 'bg-primary-50 text-primary-600' : 'text-neutral-700 hover:bg-neutral-50'}`}>Maior Preço</button>
                                    <button onClick={() => setSortBy('rating')} className={`block w-full text-left px-4 py-2 text-sm ${sortBy === 'rating' ? 'bg-primary-50 text-primary-600' : 'text-neutral-700 hover:bg-neutral-50'}`}>Melhor Avaliado</button>
                                    {/* Ajuste ou adicione outras opções de ordenação conforme necessário */}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filtros Ativos (se houver) */}
                    {/* Adicione lógica aqui para exibir e remover filtros ativos */}

                    {/* Exibir mensagem se não houver produtos filtrados */}
                     {showNoResultsMessage ? (
                        <div className="text-center py-12 text-neutral-600">
                            Nenhum produto encontrado em "{categoryPageTitle}" com os filtros aplicados.
                             <button onClick={handleClearFilters} className="mt-4 text-primary-600 hover:underline">Limpar Filtros</button>
                        </div>
                    ) : (
                        <>
                            {/* Passar apenas os produtos da página atual */}
                            <ProductGrid
                                products={currentProducts} // Usar currentProducts aqui
                                loading={isLoading}
                                emptyMessage={`Nenhum produto encontrado nesta página.`} 
                                
                            />

                             {/* --- Adicionar Componente de Paginação --- */}
                            {totalPages > 1 && ( // Só mostra a paginação se houver mais de 1 página
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            )}
                            {/* ------------------------------------------ */}
                        </>
                     )}

                </motion.div>
            </div>

            {/* Filtros Mobile (Adaptado de CatalogPage, REMOVA a seção "Categorias") */}
            <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${isMobileFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={toggleMobileFilter}>
                <div className={`absolute right-0 top-0 bottom-0 w-80 bg-white shadow-lg transform transition-transform duration-300 ${isMobileFilterOpen ? 'translate-x-0' : 'translate-x-full'}`} onClick={e => e.stopPropagation()}>
                    <div className="p-5">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-medium text-neutral-900">Filtros</h2>
                            <button onClick={toggleMobileFilter}><X size={24} /></button>
                        </div>
                        {/* NÃO incluir filtro de categorias aqui */}
                        {/* Filtro de Faixa de Preço Mobile (copiado/adaptado de CatalogPage) */}
                         <div className="mb-6">
                            <h3 className="text-sm font-medium text-neutral-900 mb-3">Faixa de Preço</h3>
                            <div className="mb-4">
                                <div className="flex justify-between text-xs text-neutral-500 mb-1">
                                     <span>R$ {priceRange[0].toFixed(2)}</span> {/* Formatar para 2 casas decimais */}
                                     <span>R$ {priceRange[1].toFixed(2)}</span> {/* Formatar para 2 casas decimais */}
                                </div>
                                 {/* Ajustar max dos sliders conforme o range máximo que você espera */}
                                <input type="range" min="0" max="5000" step="10" value={priceRange[0]} onChange={(e) => handlePriceChange(0, parseInt(e.target.value))} className="w-full" />
                                <input type="range" min="0" max="5000" step="10" value={priceRange[1]} onChange={(e) => handlePriceChange(1, parseInt(e.target.value))} className="w-full" />
                            </div>
                            <div className="flex gap-2">
                                 <input type="number" placeholder="Mín" value={priceRange[0]} onChange={(e) => handlePriceChange(0, parseInt(e.target.value))} className="w-full p-2 text-sm border border-neutral-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500" />
                                 <input type="number" placeholder="Máx" value={priceRange[1]} onChange={(e) => handlePriceChange(1, parseInt(e.target.value))} className="w-full p-2 text-sm border border-neutral-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500" />
                            </div>
                        </div>
                        {/* Botões Aplicar/Limpar Filtros Mobile */}
                         <div className="mt-auto flex gap-4"> {/* Pode precisar de um flex-col no container pai para empurrar para baixo */}
                            <button onClick={() => { handleClearFilters(); toggleMobileFilter(); }} className="flex-1 px-4 py-2 bg-neutral-100 text-neutral-700 rounded-md hover:bg-neutral-200">Limpar</button>
                            <button onClick={toggleMobileFilter} className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Aplicar</button> {/* A aplicação é reativa, este botão só fecha */}
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConcreteCategoryPage;