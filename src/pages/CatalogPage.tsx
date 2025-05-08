// src/pages/CatalogPage.tsx

// Certifique-se que useState está importado do React
import React, { useState, useEffect, useMemo } from 'react'; // useMemo pode ser útil para lógica de filtragem/ordenação otimizada
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProducts } from '../contexts/ProductContext';
import ProductGrid from '../components/products/ProductGrid';
import { ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react'; // Importe os ícones necessários

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
    // Certifique-se que 'products' do contexto é sempre um array (já ajustamos isso)
    const { products: allProductsFromContext, loading, error } = useProducts();

    // --- ESTADOS LOCAIS PARA FILTROS E UI ---
    const [searchQuery, setSearchQuery] = useState('');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]); // Exemplo de range inicial
    const [sortBy, setSortBy] = useState('relevance');
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false); // Estado para o filtro mobile
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
        if (queryParam) {
            setSearchQuery(queryParam);
        } else {
            // Opcional: Limpar busca local se o parâmetro 'q' for removido da URL
             setSearchQuery('');
        }

        // A lógica de CATEGORIA AGORA É BASEADA NA ROTA (/catalogo vs /categorias/:slug)
        // Você pode querer ler a rota aqui para destacar a categoria selecionada na UI, se necessário.
        // Ex: const pathSegments = location.pathname.split('/').filter(Boolean);
        // const currentCategorySlug = pathSegments[1] === 'categorias' ? pathSegments[2] : null;
        // setAlgumEstadoParaCategoriaAtiva(currentCategorySlug);

    }, [location.search, location.pathname]); // Depende de location.search e location.pathname

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
            case 'price-desc': sorted.sort((a, b) => b.price - a.price); break; // Corrigido b.price - b.price para b.price - a.price
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


        // Se o sortBy for 'relevance' ou não corresponder a nenhum case, retorna o array filtrado original
        // Caso contrário, retorna o array ordenado
         return sortBy === 'relevance' ? filtered : sorted;

    }, [allProductsFromContext, searchQuery, priceRange, sortBy]); // Dependências do useMemo


    // Limpar todos os filtros locais
    const handleClearFilters = () => {
        setSearchQuery('');
        setPriceRange([0, 5000]); // Reset para o range padrão
        setSortBy('relevance');
        // Opcional: Remover query params da URL ao limpar filtros
        // navigate('/catalogo', { replace: true });
    };

    // Esta função agora NAVEGA para a página de categoria
    const handleCategorySelectAndNavigate = (categoryPathSuffix: string | null) => {
        if (categoryPathSuffix) {
            // Navega para a rota específica da categoria
            navigate(`/categorias/${categoryPathSuffix}`);
        } else {
            // Navega para a página geral de catálogo e limpa filtros locais
            navigate('/catalogo');
            handleClearFilters(); // Limpa filtros quando volta para "Todas os Produtos"
        }
        // Fecha o filtro mobile após a seleção
        if (isMobileFilterOpen) toggleMobileFilter();
    };

    // Lógica para lidar com a busca global (provavelmente já definida em outro lugar, mas aqui como exemplo)
    const handleSearchSubmit = (e: React.FormEvent) => {
         e.preventDefault();
         // Atualiza a URL com o query param 'q' (a useEffect acima vai ler e atualizar o estado searchQuery)
         navigate(`/catalogo?q=${encodeURIComponent(searchQuery)}`);
         // Se estiver no filtro mobile, fecha ele
         if (isMobileFilterOpen) toggleMobileFilter();
    };

    // Lógica para lidar com a mudança no input de busca
     const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
         setSearchQuery(e.target.value);
     };

     // Lógica para lidar com a mudança no input de range de preço
      const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: 0 | 1) => {
          const newValue = Number(e.target.value);
          const newRange: [number, number] = [...priceRange];
          newRange[index] = newValue;
          setPriceRange(newRange);
      };

      // Lógica para lidar com a mudança na ordenação
       const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
           setSortBy(e.target.value);
       };

    // --- RENDERIZAÇÃO ---

    // Estado de Loading Global (busca inicial de todos os produtos)
    if (loading) {
        return <div className="container-custom py-16 text-center">Carregando todos os produtos...</div>;
    }
    // Estado de Erro Global
    if (error) {
        return <div className="container-custom py-16 text-center text-red-500">Erro ao carregar produtos: {error}</div>;
    }


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
                {/* Contagem de produtos encontrados */}
                <p className="text-neutral-600 mb-8">
                    {filteredProducts.length} {filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
                </p>
            </motion.div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Desktop filters Sidebar */}
                {/* Removido motion.aside pois a visibilidade é controlada por CSS classes */}
                 <aside className="hidden lg:block w-64 flex-shrink-0"> {/* Use classes Tailwind para mostrar/esconder em desktop */}
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
                                              location.pathname === '/catalogo'
                                              ? 'text-primary-600 font-medium'
                                              : 'text-neutral-700 hover:text-primary-600'
                                          }`}
                                     >
                                         Todas os Produtos
                                     </button>
                                 </li>
                                 {displayCategories.map(category => (
                                     <li key={category.pathSuffix}>
                                         <button
                                             onClick={() => handleCategorySelectAndNavigate(category.pathSuffix)}
                                              // Destaque se a rota atual corresponder a esta categoria específica
                                              className={`text-sm w-full text-left transition-colors ${
                                                  location.pathname === `/categorias/${category.pathSuffix}`
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

                         {/* Price range desktop */}
                         <div className="mb-6">
                             <h3 className="text-sm font-medium text-neutral-900 mb-3">Preço</h3>
                             <div className="flex items-center space-x-3">
                                 <input
                                     type="number"
                                     value={priceRange[0]}
                                     onChange={(e) => handlePriceChange(e, 0)}
                                     className="w-1/2 px-2 py-1 border rounded text-sm"
                                     min="0"
                                 />
                                 <span>-</span>
                                 <input
                                     type="number"
                                     value={priceRange[1]}
                                     onChange={(e) => handlePriceChange(e, 1)}
                                     className="w-1/2 px-2 py-1 border rounded text-sm"
                                     min="0"
                                 />
                             </div>
                             {/* Opcional: Exibir range atual abaixo dos inputs */}
                             <p className="text-xs text-neutral-500 mt-1">Atual: R${priceRange[0].toFixed(2)} - R${priceRange[1].toFixed(2)}</p>
                         </div>

                         {/* Outros filtros podem ir aqui */}
                     </div>
                 </aside>

                {/* Main content area */}
                <div className="flex-1">
                    {/* Controls bar (Mobile Filter Toggle, Sort) */}
                    <div className="flex justify-between items-center mb-6">
                        {/* Botão para abrir filtro mobile */}
                        <button
                            onClick={toggleMobileFilter} // Chame a função aqui
                            className="lg:hidden flex items-center text-neutral-700 hover:text-primary-600 transition-colors"
                        >
                            <SlidersHorizontal size={20} className="mr-2" />
                            Filtrar
                        </button>

                        {/* Select de Ordenação */}
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
                            </select>
                        </div>
                    </div>

                    {/* Grade de Produtos */}
                    {/* Passa os produtos FILTRADOS e o estado de loading */}
                    {/* O componente ProductGrid já lida com loading e empty state internamente */}
                    <ProductGrid products={filteredProducts} loading={loading} emptyMessage="Nenhum produto encontrado com os filtros atuais." />
                </div>
            </div>

            {/* Mobile filters Sidebar Overlay */}
             <div
                 className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
                    isMobileFilterOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                 }`}
                 onClick={toggleMobileFilter} // Clicar no overlay fecha o filtro
             ></div> {/* Overlay */}

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
                                          location.pathname === '/catalogo'
                                          ? 'text-primary-600 font-medium'
                                          : 'text-neutral-700 hover:text-primary-600'
                                      }`}
                                 >
                                     Todas os Produtos
                                 </button>
                             </li>
                             {displayCategories.map(category => (
                                 <li key={category.pathSuffix}>
                                     <button
                                         onClick={() => handleCategorySelectAndNavigate(category.pathSuffix)}
                                          // Destaque se a rota atual corresponder a esta categoria específica
                                          className={`text-sm w-full text-left transition-colors ${
                                              location.pathname === `/categorias/${category.pathSuffix}`
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

                     {/* Price range mobile */}
                     <div className="mb-6">
                         <h3 className="text-sm font-medium text-neutral-900 mb-3">Preço</h3>
                         <div className="flex items-center space-x-3">
                             <input
                                 type="number"
                                 value={priceRange[0]}
                                 onChange={(e) => handlePriceChange(e, 0)}
                                 className="w-1/2 px-2 py-1 border rounded text-sm"
                                 min="0"
                             />
                             <span>-</span>
                             <input
                                 type="number"
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