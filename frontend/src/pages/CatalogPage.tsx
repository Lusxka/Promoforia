// src/pages/CatalogPage.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProducts } from '../contexts/ProductContext';
import ProductGrid from '../components/products/ProductGrid';
import Pagination from '../components/common/Pagination'; // Importe o componente de Paginação
import { ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react';

// Seus nomes de categoria para exibição e mapeamento para rotas
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

    // `products` aqui virão de `all-collections` via ProductContext
    const { products: allProductsFromContext, loading, error } = useProducts();

    // --- ESTADOS LOCAIS PARA FILTROS, UI E PAGINAÇÃO ---
    const [searchQuery, setSearchQuery] = useState('');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]); // Exemplo de range inicial
    const [sortBy, setSortBy] = useState('relevance');
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // --- Estados para Paginação ---
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 40; // Definido como 40 produtos por página
    // ---------------------------------
    // --- FIM ESTADOS ---


    // >>> ADIÇÃO PARA CORRIGIR ReferenceError: Define a função de toggle
    const toggleMobileFilter = () => {
        setIsMobileFilterOpen(!isMobileFilterOpen);
        // Opcional: Controlar o scroll do corpo quando o modal/sidebar do filtro mobile estiver aberto
        // document.body.style.overflow = !isMobileFilterOpen ? 'hidden' : 'auto';
    };


    // Processar parâmetros de URL (q para busca global) na montagem e mudança de URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const queryParam = params.get('q');
        // Atualiza o estado local de busca com base na URL
        setSearchQuery(queryParam || '');

        // Note: A lógica de CATEGORIA AGORA É BASEADA NA ROTA.
        // Esta página (`/catalogo`) não lê categoria da URL, mas sim dos filtros.
        // As páginas `/categorias/:slug` usarão ConcreteCategoryPage.tsx.

        // Opcional: Ler outros parâmetros de filtro da URL se desejar que sejam persistentes
        // const minPriceParam = params.get('minPrice');
        // const maxPriceParam = params.get('maxPrice');
        // if (minPriceParam || maxPriceParam) {
        //     setPriceRange([Number(minPriceParam) || 0, Number(maxPriceParam) || 5000]);
        // }
         const sortParam = params.get('sort');
         if (sortParam) {
             setSortBy(sortParam);
         } else {
             setSortBy('relevance'); // Resetar para relevância se não houver sort param
         }


    }, [location.search]); // Depende apenas de location.search para reagir a mudanças na URL

    // --- LÓGICA DE FILTRAGEM E ORDENAÇÃO ---
    // Use useMemo para otimizar a filtragem e ordenação
    const filteredProducts = useMemo(() => {
        // Certifique-se de que allProductsFromContext é um array antes de filtrar
        if (!allProductsFromContext || !Array.isArray(allProductsFromContext)) {
            return []; // Retorna array vazio se não houver produtos base
        }

        let filtered = [...allProductsFromContext];

        // --- Aplicar Filtros ---
        // Filtro de busca (aplicado a todos os produtos de all-collections)
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(query) ||
                (product.description && product.description.toLowerCase().includes(query)) ||
                (product.tags && Array.isArray(product.tags) && product.tags.some(tag => tag.toLowerCase().includes(query))) // Verifica se tags é um array
            );
        }

        // Filtro de preço
        filtered = filtered.filter(product =>
            product.price >= priceRange[0] && product.price <= priceRange[1]
        );

        // --- Aplicar Ordenação ---
        // Crie uma cópia ANTES de ordenar para não mutar o array original do filtro
        let sorted = [...filtered];
        switch (sortBy) {
            case 'price-asc': sorted.sort((a, b) => a.price - b.price); break;
            case 'price-desc': sorted.sort((a, b) => b.price - a.price); break;
            case 'name-asc': sorted.sort((a, b) => a.name.localeCompare(b.name)); break;
            case 'name-desc': sorted.sort((a, b) => b.name.localeCompare(a.name)); break;
            case 'rating-desc': sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break; // Trata ratings nulos/undefined
            // 'relevance' (padrão) não precisa ordenar aqui se os dados já vêm ordenados por relevância da API
            default:
                // Se 'relevance' é o padrão e os dados da API já vêm ordenados assim,
                // ou se não há ordenação aplicada para outros casos, apenas use 'filtered'.
                // Se a ordenação padrão precisar ser aplicada, faça aqui.
                break;
        }

         // Retorna o array filtrado (e potencialmente ordenado)
         // Se o sortBy for 'relevance' ou não corresponder a nenhum case, retorna o array filtrado original
         // Caso contrário, retorna o array ordenado
         return sortBy === 'relevance' ? filtered : sorted;


    }, [allProductsFromContext, searchQuery, priceRange, sortBy]); // Dependências do useMemo

     // --- Efeito para resetar a página da paginação quando os produtos filtrados mudam ---
     useEffect(() => {
         setCurrentPage(1);
         // Opcional: Atualizar query params na URL ao mudar filtros (minPrice, maxPrice, sort)
         const params = new URLSearchParams(location.search);
         // Manter o query 'q' se existir
         if (searchQuery) {
             params.set('q', searchQuery);
         } else {
             params.delete('q');
         }
         // Adicionar/atualizar outros params
         params.set('minPrice', priceRange[0].toString());
         params.set('maxPrice', priceRange[1].toString());
         params.set('sort', sortBy);

         // Substituir o histórico para não poluir o navegador com cada mudança de filtro
         navigate(`${location.pathname}?${params.toString()}`, { replace: true });

     }, [filteredProducts, location.search, navigate, priceRange, searchQuery, sortBy]); // Depende de filteredProducts, priceRange, etc.


    // Limpar todos os filtros locais
    const handleClearFilters = () => {
        setSearchQuery('');
        setPriceRange([0, 5000]); // Reset para o range padrão
        setSortBy('relevance');
        // O useEffect acima irá detectar a mudança nos estados e atualizar a URL e filteredProducts
    };

    // Esta função agora NAVEGA para a página de categoria
    const handleCategorySelectAndNavigate = (categoryPathSuffix: string | null) => {
        if (categoryPathSuffix) {
            // Navega para a rota específica da categoria
            navigate(`/categorias/${categoryPathSuffix}`);
        } else {
            // Navega para a página geral de catálogo e limpa filtros locais
            navigate('/catalogo');
             // A navegação para /catalogo vai resetar o state do componente CatalogPage
             // e o useEffect que lê a URL vai limpar os filtros.
             // Não precisamos chamar handleClearFilters() diretamente aqui.
        }
        // Fecha o filtro mobile após a seleção
        if (isMobileFilterOpen) toggleMobileFilter();
    };

    // Lógica para lidar com a busca global (provavelmente já definida em outro lugar, mas aqui como exemplo)
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // A atualização do searchQuery já é tratada pelo onChange do input e refletida no useEffect de filteredProducts.
        // O useEffect que atualiza a URL agora lida com adicionar o query param 'q'.
        // Se estiver no filtro mobile, fecha ele
        if (isMobileFilterOpen) toggleMobileFilter();
    };

    // Lógica para lidar com a mudança no input de busca
    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        // O useEffect que observa searchQuery e filteredProducts vai resetar a página e atualizar a URL
    };

    // Lógica para lidar com a mudança no input de range de preço
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: 0 | 1) => {
         const value = parseInt(e.target.value, 10); // Usar parseInt com base 10
        const newValue = isNaN(value) ? (index === 0 ? 0 : 5000) : value; // Tratar NaN
        const newRange: [number, number] = [...priceRange];

        if (index === 0) { // Mudando o preço mínimo
            newRange[0] = Math.min(newValue, newRange[1]); // Garante que min não ultrapasse o max
        } else { // Mudando o preço máximo
             newRange[1] = Math.max(newValue, newRange[0]); // Garante que max não seja menor que o min
        }

        setPriceRange(newRange);
        // O useEffect que observa priceRange e filteredProducts vai resetar a página e atualizar a URL
    };

    // Lógica para lidar com a mudança na ordenação
    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(e.target.value);
        // O useEffect que observa sortBy e filteredProducts vai resetar a página e atualizar a URL
    };

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
        // Scrollar para o topo da lista de produtos
        // Você pode adicionar um ref a um elemento (ex: o div da ProductGrid) e scrollar para ele
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll para o topo da janela
    };


    // --- RENDERIZAÇÃO ---

    // Estado de Loading Global (busca inicial de todos os produtos)
    // Se o loading estiver ativo e ainda não houver produtos carregados, mostra o esqueleto
    if (loading && allProductsFromContext.length === 0) {
        return <div className="container-custom py-16"><ProductGrid loading={true} count={40} /></div>; // Mostrar 40 esqueletos na carga inicial
    }
     // Se o loading estiver ativo MAS já houver produtos (ex: ao refiltrar), mostrar o esqueleto por cima ou usar um spinner
     // Aqui, ProductGrid já lida com o prop 'loading' internamente para mostrar esqueleto se 'products' é vazio E 'loading' é true.
     // Então a condição acima já cobre o caso inicial. Se o loading for para um refetch, ProductGrid pode precisar de um overlay.
     // Por enquanto, manter a lógica simples.

    // Estado de Erro Global
    if (error) {
        return <div className="container-custom py-16 text-center text-red-500">Erro ao carregar produtos: {error}</div>;
    }

     // Mensagens para estados vazios
     // filteredProducts.length === 0 significa que APÓS FILTROS, não há resultados
     // currentProducts.length === 0 significa que APENAS NA PÁGINA ATUAL, não há resultados (pode acontecer na última página)

    return (
        <div className="container-custom py-16 mt-12"> {/* Ajuste o padding-top conforme o header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* Título da página, pode refletir a busca ou categoria */}
                <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2">
                     {searchQuery ? `Resultados para "${searchQuery}"` : 'Todos os Produtos'}
                    {/* Se estivesse em uma rota de categoria, poderia mostrar o nome da categoria */}
                    {/* {isCategoryPage ? `Produtos em ${nomeDaCategoria}` : 'Todos os Produtos'} */}
                </h1>
                {/* Contagem de produtos encontrados - Mostrar sempre a contagem total APÓS filtros */}
                <p className="text-neutral-600 mb-8">
                    {filteredProducts.length} {filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
                </p>
            </motion.div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Desktop filters Sidebar - Estrutura e Classes para o Design Padronizado */}
                {/* Use classes Tailwind para controlar visibilidade: hidden em mobile, block em lg e acima */}
                <aside className="hidden lg:block w-64 flex-shrink-0">
                    <div className="bg-white p-5 rounded-lg shadow-sm mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-medium text-neutral-900">Filtros</h2>
                            <button
                                onClick={handleClearFilters}
                                className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
                            >
                                Limpar
                            </button>
                        </div>

                        {/* Categorias - AGORA NAVEGAM */}
                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-neutral-900 mb-3">Categorias</h3>
                            <ul className="space-y-2">
                                <li>
                                    <button
                                        onClick={() => handleCategorySelectAndNavigate(null)} // Leva para "Todos os Produtos" (/catalogo)
                                        // Destaque a categoria "Todos os Produtos" se a rota atual for /catalogo e não /categorias/*
                                        className={`text-sm w-full text-left transition-colors ${
                                             location.pathname === '/catalogo' // Verifica se a rota é exatamente /catalogo
                                            ? 'text-primary-600 font-medium'
                                            : 'text-neutral-700 hover:text-primary-600'
                                        }`}
                                    >
                                        Todos os Produtos
                                    </button>
                                </li>
                                {displayCategories.map(category => (
                                    <li key={category.pathSuffix}>
                                        <button
                                            onClick={() => handleCategorySelectAndNavigate(category.pathSuffix)}
                                            // Destaque se a rota atual corresponder a esta categoria específica
                                            className={`text-sm w-full text-left transition-colors ${
                                                 location.pathname === `/categorias/${category.pathSuffix}` // Verifica se a rota corresponde à categoria
                                                ? 'text-primary-600 font-medium'
                                                : 'text-neutral-700 hover:text-primary-600'
                                            }`}
                                        >
                                            {category.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Price range desktop - Estrutura e Classes para o Design Padronizado */}
                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-neutral-900 mb-3">Preço</h3>
                            <div className="flex items-center space-x-3">
                                <input
                                    type="number"
                                     placeholder="0" // Placeholder adicionado
                                    value={priceRange[0]}
                                    onChange={(e) => handlePriceChange(e, 0)}
                                    className="w-1/2 px-2 py-1 border rounded text-sm"
                                    min="0"
                                />
                                <span>-</span>
                                <input
                                    type="number"
                                     placeholder="5000" // Placeholder adicionado
                                    value={priceRange[1]}
                                    onChange={(e) => handlePriceChange(e, 1)}
                                    className="w-1/2 px-2 py-1 border rounded text-sm"
                                    min="0" // Pode ajustar o min se souber o preço mínimo real
                                />
                            </div>
                            {/* Exibir range atual abaixo dos inputs */}
                            <p className="text-xs text-neutral-500 mt-1">Atual: R${priceRange[0].toFixed(2)} - R${priceRange[1].toFixed(2)}</p>
                        </div>

                        {/* Outros filtros podem ir aqui */}
                    </div>
                </aside>

                {/* Main content area */}
                <div className="flex-1">
                    {/* Controls bar (Mobile Filter Toggle, Sort) - Estrutura e Classes para o Design Padronizado */}
                    <div className="flex justify-between items-center mb-6">
                        {/* Botão para abrir filtro mobile */}
                        <button
                            onClick={toggleMobileFilter}
                            className="lg:hidden flex items-center text-neutral-700 hover:text-primary-600 transition-colors"
                        >
                            <SlidersHorizontal size={20} className="mr-2" />
                            Filtrar
                        </button>

                        {/* Select de Ordenação - Estrutura e Classes para o Design Padronizado */}
                        <div className="flex items-center">
                            <label htmlFor="sort-by" className="text-sm text-neutral-700 mr-2">Ordenar por:</label>
                            <select
                                id="sort-by"
                                value={sortBy}
                                onChange={handleSortChange}
                                className="text-sm border rounded px-2 py-1"
                            >
                                <option value="relevance">Relevância</option>
                                <option value="price-asc">Preço: Menor para Maior</option>
                                <option value="price-desc">Preço: Maior para Menor</option>
                                <option value="name-asc">Nome: A-Z</option>
                                <option value="name-desc">Nome: Z-A</option>
                                <option value="rating-desc">Avaliação: Maior para Menor</option>
                                {/* Certifique-se que as opções de valor (value) correspondem às usadas na lógica de ordenação no useMemo */}
                            </select>
                        </div>
                    </div>

                    {/* Mensagem de nenhum produto encontrado após filtros */}
                     {filteredProducts.length === 0 && !loading ? (
                         <div className="text-center py-12 text-neutral-600">
                             Nenhum produto encontrado com os filtros atuais.
                             <button onClick={handleClearFilters} className="mt-4 text-primary-600 hover:underline">Limpar Filtros</button>
                         </div>
                     ) : (
                         <>
                            {/* Grade de Produtos */}
                            {/* Passa os produtos da PÁGINA ATUAL */}
                            <ProductGrid
                                products={currentProducts} // Passa apenas os produtos da página atual
                                loading={loading} // Mantém o loading para mostrar esqueleto se necessário (embora a lógica acima já lide com a carga inicial)
                                emptyMessage="Nenhum produto encontrado nesta página." // Mensagem para a página atual
                            />

                            {/* --- Componente de Paginação --- */}
                             {totalPages > 1 && ( // Só mostra a paginação se houver mais de 1 página
                                 <Pagination
                                     currentPage={currentPage}
                                     totalPages={totalPages}
                                     onPageChange={handlePageChange}
                                 />
                             )}
                            {/* ------------------------------- */}
                         </>
                     )}

                </div>
            </div>

            {/* Mobile filters Sidebar Overlay - Estrutura e Classes para o Design Padronizado */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
                    isMobileFilterOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                onClick={toggleMobileFilter} // Clicar no overlay fecha o filtro
            ></div> {/* Overlay */}

            {/* Mobile filters Sidebar - Estrutura e Classes para o Design Padronizado */}
            <div
                className={`fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ${
                    isMobileFilterOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
                onClick={e => e.stopPropagation()} // Impede que cliques dentro do sidebar fechem o overlay
            >
                {/* Header do filtro mobile */}
                <div className="p-5 border-b flex justify-between items-center">
                    <h2 className="text-lg font-medium text-neutral-900">Filtros</h2>
                    <button onClick={toggleMobileFilter} className="text-neutral-500 hover:text-neutral-700"><X size={24} /></button>
                </div>

                <div className="p-5 flex flex-col space-y-6 overflow-y-auto h-[calc(100%-70px)]"> {/* Altura ajustada para o header */}
                    {/* Botão Limpar Filtros Mobile */}
                    <button
                        onClick={() => { handleClearFilters(); toggleMobileFilter(); }} // Limpa e fecha
                        className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors w-full text-right"
                    >
                        Limpar Filtros
                    </button>

                    {/* Categorias Mobile - AGORA NAVEGAM */}
                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-neutral-900 mb-3">Categorias</h3>
                        <ul className="space-y-3">
                            <li>
                                <button
                                    onClick={() => handleCategorySelectAndNavigate(null)} // Leva para /catalogo
                                    // Destaque a categoria "Todas os Produtos" se a rota atual for /catalogo
                                    className={`text-sm w-full text-left transition-colors ${
                                         location.pathname === '/catalogo' // Verifica se a rota é exatamente /catalogo
                                        ? 'text-primary-600 font-medium'
                                        : 'text-neutral-700 hover:text-primary-600'
                                    }`}
                                >
                                    Todos os Produtos
                                </button>
                            </li>
                            {displayCategories.map(category => (
                                <li key={category.pathSuffix}>
                                    <button
                                        onClick={() => handleCategorySelectAndNavigate(category.pathSuffix)}
                                        // Destaque se a rota atual corresponder a esta categoria específica
                                        className={`text-sm w-full text-left transition-colors ${
                                             location.pathname === `/categorias/${category.pathSuffix}` // Verifica se a rota corresponde à categoria
                                            ? 'text-primary-600 font-medium'
                                            : 'text-neutral-700 hover:text-primary-600'
                                        }`}
                                    >
                                        {category.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Price range mobile - Estrutura e Classes para o Design Padronizado */}
                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-neutral-900 mb-3">Preço</h3>
                        <div className="flex items-center space-x-3">
                            <input
                                type="number"
                                 placeholder="0" // Placeholder adicionado
                                value={priceRange[0]}
                                onChange={(e) => handlePriceChange(e, 0)}
                                className="w-1/2 px-2 py-1 border rounded text-sm"
                                min="0"
                            />
                            <span>-</span>
                            <input
                                type="number"
                                 placeholder="5000" // Placeholder adicionado
                                value={priceRange[1]}
                                onChange={(e) => handlePriceChange(e, 1)}
                                className="w-1/2 px-2 py-1 border rounded text-sm"
                                min="0"
                            />
                        </div>
                         <p className="text-xs text-neutral-500 mt-1">Atual: R${priceRange[0].toFixed(2)} - R${priceRange[1].toFixed(2)}</p>
                    </div>
                    {/* Outros filtros mobile podem ir aqui */}
                </div>
            </div>

        </div>
    );
};

export default CatalogPage;