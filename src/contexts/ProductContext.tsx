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

// --- Funções Auxiliares de Parsing Robusto ---
// Converte strings de preço como "R$ 1.234,56" ou "1,234.56" para number
const parsePrice = (priceStr: any): number | undefined => { // Retorna number ou undefined
    if (priceStr === null || priceStr === undefined || typeof priceStr === 'boolean') return undefined; // Trata null, undefined e boolean
    if (typeof priceStr === 'number') return priceStr; // Já é um número

    // Remove "R$", remove pontos de milhar, substitui vírgula por ponto decimal
    const cleaned = String(priceStr).replace('R$', '').replace('.', '').replace(',', '.').trim();
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? undefined : parsed; // Retorna undefined se não for um número válido
};

// Converte strings de porcentagem como "50%" para number (0-100)
const parsePercentage = (percentageStr: any): number | undefined => {
    if (percentageStr === null || percentageStr === undefined || typeof percentageStr === 'boolean') return undefined; // Trata null, undefined e boolean
     if (typeof percentageStr === 'number') return percentageStr; // Já é um número (assumindo que seja entre 0-100)


    const cleaned = String(percentageStr).replace('%', '').trim();
    const parsed = parseFloat(cleaned);
     // Retorna undefined se não for um número válido, ou se for negativo/maior que 100 (fora do range de %)
    return isNaN(parsed) || parsed < 0 || parsed > 100 ? undefined : parsed;
};

// Converte strings gerais para number
const parseNumber = (numStr: any): number | undefined => {
    if (numStr === null || numStr === undefined || typeof numStr === 'boolean') return undefined; // Trata null, undefined e boolean
     if (typeof numStr === 'number') return numStr; // Já é um número

    const parsed = parseFloat(String(numStr).trim());
    return isNaN(parsed) ? undefined : parsed;
};

// Converte strings gerais para integer
const parseInteger = (intStr: any): number | undefined => {
     if (intStr === null || intStr === undefined || typeof intStr === 'boolean') return undefined; // Trata null, undefined e boolean
     if (typeof intStr === 'number') return Math.round(intStr); // Já é um número, arredonda para int

    const parsed = parseInt(String(intStr).trim(), 10);
    // Retorna undefined se não for um número válido
    return isNaN(parsed) ? undefined : parsed;
};

// --- Fim Funções Auxiliares ---


interface ProductContextType {
    products: Product[]; // Produtos processados para o frontend (geralmente de all-collections ou da coleção específica)
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


export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [processedProducts, setProcessedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Função para processar dados brutos do backend para o formato do frontend `Product`
    const processBackendProduct = useCallback((rawProduct: any): Product => {
        // >>> Mapeamento e Conversão Robusta Baseado na estrutura do SEU backend/models/Product.js <<<

        // 1. Preços
        const price = parsePrice(rawProduct.preco_para);
        const originalPrice = parsePrice(rawProduct.preco_de);

        // 2. Cálculo da Porcentagem de Desconto (Mais Robusto)
        let discountPercentage: number | undefined = parsePercentage(rawProduct.desconto); // Tenta parsear o campo 'desconto' primeiro

        // Se 'desconto' não for um número válido ou não existir, tenta calcular a partir dos preços
        if (discountPercentage === undefined && price !== undefined && originalPrice !== undefined && originalPrice > 0) {
            const calculatedDiscount = ((originalPrice - price) / originalPrice) * 100;
            // Só usa o desconto calculado se ele for positivo (houve desconto)
            if (calculatedDiscount > 0) {
                 discountPercentage = calculatedDiscount;
            }
        }


        // 3. Categoria e Slug (Lógica mantida, garante um fallback)
        let frontendCategory = "Geral"; // Default
        let categorySlug = "geral"; // Default slug

        if (rawProduct.source_collection) {
            const categoryKey = Object.keys(COLLECTION_MAP).find(
                key => COLLECTION_MAP[key as keyof typeof COLLECTION_MAP] === rawProduct.source_collection
            );
            if (categoryKey) {
                frontendCategory = categoryKey.replace(/_/g, ' ').toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                categorySlug = categoryKey.toLowerCase().replace(/_/g, '-');
            } else if (rawProduct.categoria) {
                frontendCategory = rawProduct.categoria;
                categorySlug = rawProduct.categoria.toLowerCase().replace(/\s+/g, '-');
            }
        } else if (rawProduct.categoria) {
            frontendCategory = rawProduct.categoria;
            categorySlug = rawProduct.categoria.toLowerCase().replace(/\s+/g, '-');
        }

         // 4. Imagens (Trata string ou array)
         let images: string[] = [];
         if (Array.isArray(rawProduct.imagem)) { // Se 'imagem' já for um array (ex: do Scrapy ou outra fonte)
             images = rawProduct.imagem.filter((img: any) => typeof img === 'string' && img !== ''); // Filtra por strings não vazias
         } else if (typeof rawProduct.imagem === 'string' && rawProduct.imagem !== '') { // Se for uma string não vazia
             images = [rawProduct.imagem];
         } else if (Array.isArray(rawProduct.images)) { // Verifica se existe um campo 'images' plural (algumas APIs usam)
              images = rawProduct.images.filter((img: any) => typeof img === 'string' && img !== '');
         }


        // 5. Outros Campos (usando funções de parsing robustas)
        const rating = parseNumber(rawProduct.avaliacao) || 0; // Default para 0 se não puder parsear
        const reviewCount = parseInteger(rawProduct.numero_avaliacoes) || 0; // Default para 0
        const stockQuantity = parseInteger(rawProduct.estoque); // Pode ser undefined se não existir/parsear
        const percentageSold = parsePercentage(rawProduct.porcentagem_vendida); // Pode ser undefined
        const exteriorPrice = parsePrice(rawProduct.preco_exterior); // Pode ser undefined
        const lastChecked = rawProduct.ultima_verificacao ? new Date(rawProduct.ultima_verificacao) : undefined; // Converte para Date

        // 6. Flags (new, bestseller, etc. - assumindo que vêm como boolean ou string que pode ser convertida)
        const isNew = Boolean(rawProduct.is_new || rawProduct.novo); // Converte para boolean de forma segura
        const isBestseller = Boolean(rawProduct.is_bestseller || rawProduct.mais_vendido); // Converte para boolean
        const isFlashSale = Boolean(rawProduct.is_flash_sale || rawProduct.oferta_relampago || rawProduct.tempo_restante); // Exemplo

         // 7. Tags (Trata array ou string separada por vírgula)
         let tags: string[] = [];
         if (Array.isArray(rawProduct.tags)) {
             tags = rawProduct.tags.map((tag: any) => String(tag).trim()).filter((tag: string) => tag !== '');
         } else if (typeof rawProduct.tags === 'string' && rawProduct.tags.trim() !== '') {
              tags = rawProduct.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag !== '');
         }


        return {
            // Garanta um _id/identificador único. _id do MongoDB é o ideal se existir. link_afiliado é um bom fallback.
            _id: rawProduct._id || rawProduct.link_afiliado || rawProduct.url || Date.now().toString() + Math.random().toString(36).substring(2, 15), // Adiciona random para maior unicidade se _id e link_afiliado faltarem
            name: String(rawProduct.nome || rawProduct.title || "Produto sem nome").trim(), // Usa nome ou title, garante string
            description: String(rawProduct.descricao_curta || rawProduct.descricao || rawProduct.description || "Sem descrição detalhada.").trim(), // Usa curta, longa ou description, garante string
            price: price !== undefined ? price : 0, // Default para 0 se preço principal não for válido
            originalPrice: originalPrice, // Pode ser undefined
            discountPercentage: discountPercentage, // Pode ser undefined
            images: images.length > 0 ? images : ['/placeholder-image.png'], // Usa imagens encontradas ou placeholder
            categorySlug: categorySlug,
            backendCategory: String(rawProduct.categoria || rawProduct.category || "Desconhecida").trim(), // Categoria original do backend
            tags: tags, // Array de tags processadas
            rating: rating,
            reviewCount: reviewCount,
            stockQuantity: stockQuantity, // Pode ser undefined
            sellerName: String(rawProduct.vendedor || rawProduct.seller || "Vendedor Padrão").trim(), // Garante string
            affiliateLink: String(rawProduct.link_afiliado || rawProduct.url || "#").trim(), // Garante string, fallback para #
            isNew: isNew,
            isBestseller: isBestseller,
            isFlashSale: isFlashSale, // Adicionado
            shippingInfo: String(rawProduct.frete || "").trim(), // Mapeia frete para um nome mais genérico se necessário
            installments: String(rawProduct.parcelas || "").trim(), // Mapeia parcelas
            timeRemaining: String(rawProduct.tempo_restante || "").trim(), // Mapeia tempo_restante
            percentageSold: percentageSold, // Pode ser undefined
            exteriorPrice: exteriorPrice, // Pode ser undefined
            lastChecked: lastChecked, // Pode ser undefined
             // Mapear outros campos do backend para o frontend conforme necessário
             // ex: rawProduct.brand -> brand: String(rawProduct.brand || "").trim(),
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
                console.error(`[ProductContext] Erro HTTP ${response.status} ao buscar ${response.url}`);
                let errorDetail = `Falha ao buscar todos os produtos. Status: ${response.status} (${response.statusText}).`;
                try {
                    const errorBody = await response.json();
                    if (errorBody.message) {
                        errorDetail += ` Detalhe: ${errorBody.message}`;
                    }
                } catch (jsonError) {
                    console.error("[ProductContext] Não foi possível parsear o corpo do erro como JSON:", jsonError);
                }
                 throw new Error(errorDetail);
            }

            const data = await response.json();
            console.log(`[ProductContext] Dados brutos recebidos (${Array.isArray(data) ? data.length : 0} items):`, data); // Loga os dados brutos recebidos

            // Processa os dados recebidos
            const processed = Array.isArray(data) ? data.map(processBackendProduct).filter(p => p !== null) : []; // Garante que data é um array e filtra resultados nulos se processBackendProduct retornar null em algum caso
            console.log(`[ProductContext] Produtos processados (${processed.length} items):`, processed); // Loga os produtos processados

            // Atualiza o estado global de produtos
            setProcessedProducts(processed);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : `Erro desconhecido: ${String(err)}`;
            setError(errorMessage);
            console.error("[ProductContext] Erro ao buscar ou processar produtos iniciais:", err);
            setProcessedProducts([]); // Em caso de erro, defina os produtos como um array vazio
        } finally {
            setLoading(false);
        }
    }, [processBackendProduct]); // Depende de processBackendProduct (que é useCallback)

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
                 let errorDetail = `Falha ao buscar produtos da coleção ${actualCollectionName}. Status: ${response.status} (${response.statusText}).`;
                 try {
                     const errorBody = await response.json();
                     if (errorBody.message) {
                         errorDetail += ` Detalhe: ${errorBody.message}`;
                     }
                 } catch (jsonError) {
                      console.error("[ProductContext] Não foi possível parsear o corpo do erro da coleção como JSON:", jsonError);
                 }
                 throw new Error(errorDetail);
            }

            const data = await response.json();
             console.log(`[ProductContext] Dados brutos recebidos para coleção '${actualCollectionName}' (${Array.isArray(data) ? data.length : 0} items):`, data);

            processed = Array.isArray(data) ? data.map(processBackendProduct).filter(p => p !== null) : []; // Processa os dados e filtra nulos
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


    // Função para obter um produto por ID dos produtos carregados globalmente
    const getProductById = useCallback((id: string): Product | undefined => {
        // Busca nos produtos processados que estão no estado global (geralmente de all-collections)
        // IMPORTANTE: Se a página de detalhe for acessada diretamente em uma rota de categoria (/categorias/:slug/:id)
        // sem carregar a página /catalogo antes, processedProducts pode estar vazio.
        // Uma solução mais robusta para a página de detalhe seria:
        // 1. Tentar buscar no estado processedProducts.
        // 2. Se não encontrar, fazer uma CHAMADA ADICIONAL À API para buscar o produto por ID.
        // Esta implementação atual SÓ encontrará produtos se eles já estiverem no estado global.
        return processedProducts.find(p => p._id === id);
    }, [processedProducts]);


    return (
        <ProductContext.Provider value={{
            products: processedProducts, // Fornece a lista atual de produtos processados (all-collections)
            loading, // Estado de loading da busca inicial (all-collections)
            error, // Estado de erro da busca inicial (all-collections)
            fetchInitialProducts, // Função para recarregar todos (para /catalogo)
            fetchProductsByCollectionName, // Função para buscar por coleção (para /categorias/:slug)
            getProductById // Função para buscar produto por ID
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

// Exporta o COLLECTION_MAP se precisar dele em outros lugares (opcional)
// export { COLLECTION_MAP };