// src/contexts/ProductContext.tsx

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { Product } from '../types/Product'; // Sua definição de tipo Frontend
// Supondo que você tenha um tipo BackendProduct para os dados brutos da API
// import { BackendProduct } from '../types/BackendProduct'; // Você precisaria criar este tipo se quisesse tipagem mais forte para dados brutos

// Defina os nomes das coleções aqui para consistência
// Estes nomes devem CORRESPONDER EXATAMENTE aos nomes usados no backend/routes/productRoutes.js COLLECTIONS e no MongoDB
const COLLECTION_MAP = {
    RELAMPAGO: "mercado_livre_relampago",
    OFERTAS: "mercado_livre_todas", // No backend, você mapeou TODAS para "mercado_livre_todas", mantendo aqui para consistência
    MENOS_DE_100: "mercado_livre_menos_100",
    COMPRA_DO_MES: "mercado_livre_compra_mes",
    MODA: "mercado_livre_moda"
    // Certifique-se que todos os nomes de coleção relevantes estão aqui
};

interface ProductContextType {
    products: Product[]; // Produtos processados para o frontend (geralmente de all-collections ou da coleção específica)
    // allRawProducts: any[]; // Pode remover se não for usar diretamente
    loading: boolean;
    error: string | null;
    fetchInitialProducts: () => Promise<void>; // Para a página principal /catalogo
    fetchProductsByCollectionName: (collectionNameKey: keyof typeof COLLECTION_MAP) => Promise<Product[]>; // Para páginas de categoria
    getProductById: (id: string) => Product | undefined;
    // ...outras funções que você já tem ou precisa
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Defina a URL base da API usando import.meta.env (padrão Vite)
// Use um fallback para 'http://localhost:4000' para desenvolvimento local se a variável não estiver definida
// Certifique-se que VITE_APP_API_URL está definido em um arquivo .env na raiz do projeto, se aplicável
const API_BASE_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:4000';


// --- Funções Auxiliares para Parsing Robusto ---
// Converte strings de preço como "R$ 1.234,56" ou "1,234.56" para number
const parsePrice = (priceStr: any): number => {
    if (typeof priceStr !== 'string') return parseFloat(priceStr) || 0;
    // Remove "R$", remove pontos de milhar, substitui vírgula por ponto decimal
    const cleaned = priceStr.replace('R$', '').replace('.', '').replace(',', '.').trim();
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed; // Retorna 0 se não for um número válido
};

// Converte strings de porcentagem como "50%" para number
const parsePercentage = (percentageStr: any): number | undefined => {
    if (typeof percentageStr !== 'string') return parseFloat(percentageStr) || undefined;
    const cleaned = percentageStr.replace('%', '').trim();
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? undefined : parsed; // Retorna undefined se não for um número válido
};

// Converte strings gerais para number
const parseNumber = (numStr: any): number | undefined => {
     if (typeof numStr !== 'string') return parseFloat(numStr) || undefined;
    const parsed = parseFloat(numStr.trim());
    return isNaN(parsed) ? undefined : parsed;
};

// Converte strings gerais para integer
const parseInteger = (intStr: any): number | undefined => {
     if (typeof intStr !== 'string') return parseInt(intStr, 10) || undefined;
    const parsed = parseInt(intStr.trim(), 10);
     return isNaN(parsed) ? undefined : parsed;
};

// --- Fim Funções Auxiliares ---


export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // O estado principal de produtos que os componentes consumirãodisponíveis
    // Inicializa como array vazio.
    const [processedProducts, setProcessedProducts] = useState<Product[]>([]);

    // Você pode querer estados separados para loading/error da busca inicial vs busca por coleção
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Função para processar dados brutos do backend para o formato do frontend `Product`
    // Esta função mapeia os campos da estrutura REAL do backend (como no Product.js)
    // para a estrutura `Product` definida em src/types/Product.ts
    const processBackendProduct = useCallback((rawProduct: any): Product => {
        // >>> Mapeamento e Conversão Robustos <<<
        // Baseado na estrutura do seu backend/models/Product.js

        // Derivar categorySlug e frontendCategory
        let frontendCategory = "Geral"; // Default
        let categorySlug = "geral"; // Default slug

         // Tenta mapear source_collection (adicionado no backend route) para o nome da categoria do frontend
        if (rawProduct.source_collection) {
            const categoryKey = Object.keys(COLLECTION_MAP).find(
                key => COLLECTION_MAP[key as keyof typeof COLLECTION_MAP] === rawProduct.source_collection
            );
            if (categoryKey) {
                 // Mapeia a chave do COLLECTIONS_MAP para um nome amigável (ajuste conforme necessário)
                 frontendCategory = categoryKey.replace(/_/g, ' '); // Ex: MENOS_DE_100 -> MENOS DE 100
                 // Capitaliza a primeira letra de cada palavra para o título
                 frontendCategory = frontendCategory.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                 categorySlug = categoryKey.toLowerCase().replace(/_/g, '-'); // Ex: MENOS_DE_100 -> menos-de-100
            } else if (rawProduct.categoria) {
                 // Fallback: usa rawProduct.categoria se source_collection não mapear
                 frontendCategory = rawProduct.categoria;
                 categorySlug = rawProduct.categoria.toLowerCase().replace(/\s+/g, '-');
            }
        } else if (rawProduct.categoria) {
             // Fallback: apenas usa rawProduct.categoria se source_collection não existir
             frontendCategory = rawProduct.categoria;
             categorySlug = rawProduct.categoria.toLowerCase().replace(/\s+/g, '-');
        }


        return {
            // Use _id ou link_afiliado como ID único. link_afiliado é uma boa opção se for unique no DB.
            _id: rawProduct._id || rawProduct.link_afiliado || Date.now().toString(), // Garanta um _id/identificador único
            name: rawProduct.nome || "Produto sem nome",
            description: rawProduct.descricao_curta || rawProduct.descricao || "Sem descrição detalhada.", // Use descricao ou descricao_curta
            price: parsePrice(rawProduct.preco_para), // Use a função de parsing
            originalPrice: rawProduct.preco_de ? parsePrice(rawProduct.preco_de) : undefined, // Use a função de parsing
            discount: parsePercentage(rawProduct.desconto), // Use a função de parsing
            // >>> Trata o campo de imagem: imagem (singular, string) no backend para images (plural, string[]) no frontend
            images: typeof rawProduct.imagem === 'string' && rawProduct.imagem ? [rawProduct.imagem] : [], // Converte string para array se existir
            categorySlug: categorySlug, // Slug derivado
            backendCategory: rawProduct.categoria, // Categoria original do backend
            tags: Array.isArray(rawProduct.tags) ? rawProduct.tags : (typeof rawProduct.tags === 'string' ? rawProduct.tags.split(',').map((tag: string) => tag.trim()) : []), // Tenta tratar tags como array ou string separada por vírgula
            rating: parseNumber(rawProduct.avaliacao) || 0, // Use a função de parsing
            reviewCount: parseInteger(rawProduct.numero_avaliacoes) || 0, // Use a função de parsing
            stockQuantity: parseInteger(rawProduct.estoque) || 10, // Use a função de parsing
            sellerName: rawProduct.vendedor || "Vendedor Padrão",
            affiliateLink: rawProduct.link_afiliado || "#",
            new: rawProduct.is_new || false, // Supondo que exista no rawProduct
            bestseller: rawProduct.is_bestseller || false, // Supondo que exista no rawProduct
            frete: rawProduct.frete,
            parcelas: rawProduct.parcelas,
            tempo_restante: rawProduct.tempo_restante,
            porcentagem_vendida: parsePercentage(rawProduct.porcentagem_vendida), // Use a função de parsing
            preco_exterior: parsePrice(rawProduct.preco_exterior), // Use a função de parsing
            ultima_verificacao: rawProduct.ultima_verificacao ? new Date(rawProduct.ultima_verificacao) : undefined, // Converte para Date
             // Adicione outros campos se necessário, mapeando de rawProduct para Product
        };
    }, []); // processBackendProduct não depende de nada externo que mude, então array vazio OK

    // Busca inicial de produtos (geralmente para /catalogo)
    const fetchInitialProducts = useCallback(async () => {
        setLoading(true);
        setError(null); // Limpa erros anteriores
        try {
            console.log(`[ProductContext] Buscando todos os produtos de: ${API_BASE_URL}/api/products/all-collections`);
            const response = await fetch(`${API_BASE_URL}/api/products/all-collections`);

            if (!response.ok) {
                 // Melhor log de erro para ajudar a depurar o backend
                console.error(`[ProductContext] Erro HTTP ${response.status} ao buscar ${response.url}`);
                 // Lança um erro com mais detalhes
                throw new Error(`Falha ao buscar todos os produtos. Status: ${response.status} (${response.statusText})`);
            }

            const data = await response.json();
            console.log(`[ProductContext] Dados recebidos (${data.length} items):`, data); // Loga os dados recebidos para inspeção

            // Processa os dados recebidos
            const processed = Array.isArray(data) ? data.map(processBackendProduct) : []; // Garante que data é um array antes de mapear
            console.log(`[ProductContext] Produtos processados (${processed.length} items):`, processed); // Loga os produtos processados

            // Atualiza o estado global de produtos
            setProcessedProducts(processed);

        } catch (err) {
            // Captura e loga qualquer erro que ocorra durante o fetch ou processamento
            const errorMessage = err instanceof Error ? err.message : `Erro desconhecido: ${String(err)}`;
            setError(errorMessage);
            console.error("[ProductContext] Erro ao buscar ou processar produtos iniciais:", err);

            // Em caso de erro, defina os produtos como um array vazio
            setProcessedProducts([]);

        } finally {
            // Este bloco sempre executa após try/catch
            setLoading(false);
        }
    }, [processBackendProduct]); // Depende apenas da função de processamento

    // Busca produtos por nome de coleção (para rotas /categorias/:slug)
    const fetchProductsByCollectionName = useCallback(async (collectionNameKey: keyof typeof COLLECTION_MAP): Promise<Product[]> => {
        const actualCollectionName = COLLECTION_MAP[collectionNameKey];
        // Você pode querer um estado de loading/error separado para esta busca se a UI precisar disso
        // setLoading(true); // Cuidado para não interferir com o estado global de loading da busca inicial
        // setError(null); // Cuidado para não limpar o erro da busca inicial prematuramente

         let processed: Product[] = []; // Inicializa array vazio para o resultado desta busca

        try {
             console.log(`[ProductContext] Buscando produtos da coleção '${collectionNameKey}' de: ${API_BASE_URL}/api/products/collection/${actualCollectionName}`);
            const response = await fetch(`${API_BASE_URL}/api/products/collection/${actualCollectionName}`);

            if (!response.ok) {
                 console.error(`[ProductContext] Erro HTTP ${response.status} ao buscar coleção ${actualCollectionName} em ${response.url}`);
                throw new Error(`Falha ao buscar produtos da coleção ${actualCollectionName}. Status: ${response.status} (${response.statusText})`);
            }

            const data = await response.json();
             console.log(`[ProductContext] Dados recebidos para coleção '${actualCollectionName}' (${data.length} items):`, data);

            processed = Array.isArray(data) ? data.map(processBackendProduct) : []; // Processa os dados
            console.log(`[ProductContext] Produtos processados para coleção '${actualCollectionName}' (${processed.length} items):`, processed);

            // DECISÃO: Esta função apenas RETORNA os produtos da coleção.
            // A página que a chama (ex: CategoryPage) deve gerenciar o estado local dela
            // com esses produtos. Ela NÃO atualiza o estado 'processedProducts' global.
            // setProcessedProducts(processed); // Removido para não sobrescrever a lista 'all-collections' no estado global

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : `Erro desconhecido: ${String(err)}`;
            console.error(`[ProductContext] Erro ao buscar ou processar produtos da coleção ${actualCollectionName}:`, err);
             // Você pode querer definir um erro específico para esta busca se necessário na UI
             // setError(errorMessage);
             processed = []; // Garante array vazio em caso de erro nesta busca
        } finally {
            // setLoading(false); // Cuidado com o estado global de loading
        }

        return processed; // Retorna os produtos processados (ou array vazio em caso de erro)
    }, [processBackendProduct]); // Depende apenas da função de processamento


    // Efeito para carregar os produtos iniciais na montagem do Provider
    useEffect(() => {
        // Carrega os produtos iniciais (todos) quando o provider é montado
        // Isso alimentará a página /catalogo principal
        fetchInitialProducts();

        // Limpeza: Opcional, se necessário desabilitar algo ao desmontar
        // return () => { ... };
    }, [fetchInitialProducts]); // Depende de fetchInitialProducts (que é useCallback)


    // Função para obter um produto por ID dos produtos carregados
    const getProductById = useCallback((id: string): Product | undefined => {
        // Busca nos produtos processados que estão no estado (geralmente de all-collections)
        // Note que se você navegar para uma página de categoria, o estado global 'products' NÃO é atualizado por fetchProductsByCollectionName.
        // Isso pode ser um problema se getProductById for chamado em uma página de detalhe de produto acessada a partir de uma página de categoria.
        // Se você precisa buscar por ID em qualquer situação, pode adicionar uma chamada à API específica por ID aqui:
        // Ex: fetch(`${API_BASE_URL}/api/products/${id}`);
        return processedProducts.find(p => p._id === id);
    }, [processedProducts]);


    return (
        <ProductContext.Provider value={{
            products: processedProducts, // Fornece a lista atual de produtos processados
            // allRawProducts, // Removido do value se não for usado
            loading, // Estado de loading da busca inicial
            error, // Estado de erro da busca inicial
            fetchInitialProducts, // Função para recarregar todos (para /catalogo)
            fetchProductsByCollectionName, // Função para buscar por coleção (para /categorias/:slug)
            getProductById
        }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = (): ProductContextType => {
    const context = useContext(ProductContext);
    if (context === undefined) {
        // Melhor mensagem de erro se o hook for usado fora do provider
        throw new Error('useProducts deve ser usado dentro de um ProductProvider.');
    }
    return context;
};