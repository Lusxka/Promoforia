// src/contexts/ProductContext.tsx
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { Product } from '../types/Product';

const COLLECTION_MAP = {
    RELAMPAGO: "mercado_livre_relampago",
    OFERTAS: "mercado_livre_todas",
    MENOS_DE_100: "mercado_livre_menos_100",
    COMPRA_DO_MES: "mercado_livre_compra_mes",
    MODA: "mercado_livre_moda"
};

const parsePrice = (priceStr: any): number | undefined => {
    if (priceStr === null || priceStr === undefined || typeof priceStr === 'boolean') return undefined;
    if (typeof priceStr === 'number') return priceStr;
    const cleaned = String(priceStr).replace('R$', '').replace('.', '').replace(',', '.').trim();
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? undefined : parsed;
};

const parsePercentage = (percentageStr: any): number | undefined => {
    if (percentageStr === null || percentageStr === undefined || typeof percentageStr === 'boolean') return undefined;
    if (typeof percentageStr === 'number') return percentageStr;
    const cleaned = String(percentageStr).replace('%', '').trim();
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) || parsed < 0 || parsed > 100 ? undefined : parsed;
};

const parseNumber = (numStr: any): number | undefined => {
    if (numStr === null || numStr === undefined || typeof numStr === 'boolean') return undefined;
    if (typeof numStr === 'number') return numStr;
    const parsed = parseFloat(String(numStr).trim());
    return isNaN(parsed) ? undefined : parsed;
};

const parseInteger = (intStr: any): number | undefined => {
    if (intStr === null || intStr === undefined || typeof intStr === 'boolean') return undefined;
    if (typeof intStr === 'number') return Math.round(intStr);
    const parsed = parseInt(String(intStr).trim(), 10);
    return isNaN(parsed) ? undefined : parsed;
};

interface ProductContextType {
    products: Product[];
    featuredProducts: Product[];
    loading: boolean;
    error: string | null;
    fetchInitialProducts: () => Promise<void>;
    fetchProductsByCollectionName: (collectionNameKey: keyof typeof COLLECTION_MAP) => Promise<Product[]>;
    getProductById: (id: string) => Product | undefined;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);
const API_BASE_URL = '/api';

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [processedProducts, setProcessedProducts] = useState<Product[]>([]);
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const processBackendProduct = useCallback((rawProduct: any): Product | null => {
        try {
            const price = parsePrice(rawProduct.preco_para);
            const originalPrice = parsePrice(rawProduct.preco_de);

            let discountPercentage = parsePercentage(rawProduct.desconto);
            if (discountPercentage === undefined && price !== undefined && originalPrice !== undefined && originalPrice > 0) {
                const calculatedDiscount = ((originalPrice - price) / originalPrice) * 100;
                if (calculatedDiscount > 0) {
                    discountPercentage = calculatedDiscount;
                }
            }

            let frontendCategory = "Geral";
            let categorySlug = "geral";
            if (rawProduct.source_collection) {
                const categoryKey = Object.keys(COLLECTION_MAP).find(
                    key => COLLECTION_MAP[key as keyof typeof COLLECTION_MAP] === rawProduct.source_collection
                );
                if (categoryKey) {
                    frontendCategory = categoryKey.replace(/_/g, ' ').toLowerCase().split(' ')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                    categorySlug = categoryKey.toLowerCase().replace(/_/g, '-');
                } else if (rawProduct.categoria) {
                    frontendCategory = rawProduct.categoria;
                    categorySlug = rawProduct.categoria.toLowerCase().replace(/\s+/g, '-');
                }
            } else if (rawProduct.categoria) {
                frontendCategory = rawProduct.categoria;
                categorySlug = rawProduct.categoria.toLowerCase().replace(/\s+/g, '-');
            }

            let images: string[] = [];
            if (Array.isArray(rawProduct.imagem)) {
                images = rawProduct.imagem.filter((img: any) => typeof img === 'string' && img !== '');
            } else if (typeof rawProduct.imagem === 'string' && rawProduct.imagem !== '') {
                images = [rawProduct.imagem];
            } else if (Array.isArray(rawProduct.images)) {
                images = rawProduct.images.filter((img: any) => typeof img === 'string' && img !== '');
            }

            const rating = parseNumber(rawProduct.avaliacao) || 0;
            const reviewCount = parseInteger(rawProduct.numero_avaliacoes) || 0;
            const stockQuantity = parseInteger(rawProduct.estoque);
            const percentageSold = parsePercentage(rawProduct.porcentagem_vendida);
            const exteriorPrice = parsePrice(rawProduct.preco_exterior);
            const lastChecked = rawProduct.ultima_verificacao ? new Date(rawProduct.ultima_verificacao) : undefined;

            const isNew = Boolean(rawProduct.is_new || rawProduct.novo);
            const isBestseller = Boolean(rawProduct.is_bestseller || rawProduct.mais_vendido);
            const isFlashSale = Boolean(rawProduct.is_flash_sale || rawProduct.oferta_relampago || rawProduct.tempo_restante);

            let tags: string[] = [];
            if (Array.isArray(rawProduct.tags)) {
                tags = rawProduct.tags.map((tag: any) => String(tag).trim()).filter((tag: string) => tag !== '');
            } else if (typeof rawProduct.tags === 'string' && rawProduct.tags.trim() !== '') {
                tags = rawProduct.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag !== '');
            }

            return {
                _id: rawProduct._id || rawProduct.link_afiliado || rawProduct.url || Date.now().toString(),
                name: String(rawProduct.nome || rawProduct.title || "Produto sem nome").trim(),
                description: String(rawProduct.descricao_curta || rawProduct.descricao || rawProduct.description || "Sem descrição detalhada.").trim(),
                price: price !== undefined ? price : 0,
                originalPrice,
                discountPercentage,
                images: images.length > 0 ? images : ['/placeholder-image.png'],
                categorySlug,
                backendCategory: String(rawProduct.categoria || rawProduct.category || "Desconhecida").trim(),
                tags,
                rating,
                reviewCount,
                stockQuantity,
                sellerName: String(rawProduct.vendedor || rawProduct.seller || "Vendedor Padrão").trim(),
                affiliateLink: String(rawProduct.link_afiliado || rawProduct.url || "#").trim(),
                isNew,
                isBestseller,
                isFlashSale,
                shippingInfo: String(rawProduct.frete || "").trim(),
                installments: String(rawProduct.parcelas || "").trim(),
                timeRemaining: String(rawProduct.tempo_restante || "").trim(),
                percentageSold,
                exteriorPrice,
                lastChecked,
            };
        } catch (err) {
            console.error("[ProductContext] Erro ao processar produto:", err);
            return null;
        }
    }, []);

    const getProductCategory = useCallback((product: Product): string => {
        const name = product.name.toLowerCase();
        const category = product.backendCategory.toLowerCase();
        const tags = product.tags.join(' ').toLowerCase();
        const fullText = `${name} ${category} ${tags}`;

        // Categorias de suplementos/nutrição
        if (fullText.includes('creatina')) return 'creatina';
        if (fullText.includes('whey') || fullText.includes('proteína') || fullText.includes('protein')) return 'proteina';
        if (fullText.includes('bcaa') || fullText.includes('aminoácido') || fullText.includes('glutamina')) return 'aminoacidos';
        if (fullText.includes('pré-treino') || fullText.includes('pre treino') || fullText.includes('cafeína')) return 'pre-treino';
        if (fullText.includes('vitamina') || fullText.includes('multivitamínico') || fullText.includes('suplemento')) return 'vitaminas';
        
        // Categorias de tecnologia
        if (fullText.includes('celular') || fullText.includes('smartphone') || fullText.includes('iphone') || fullText.includes('samsung')) return 'celulares';
        if (fullText.includes('notebook') || fullText.includes('laptop') || fullText.includes('computador')) return 'informatica';
        if (fullText.includes('fone') || fullText.includes('headphone') || fullText.includes('earphone')) return 'audio';
        if (fullText.includes('tv') || fullText.includes('televisão') || fullText.includes('smart tv')) return 'tv';
        
        // Categorias de casa
        if (fullText.includes('cozinha') || fullText.includes('panela') || fullText.includes('frigideira')) return 'cozinha';
        if (fullText.includes('cama') || fullText.includes('travesseiro') || fullText.includes('lençol')) return 'quarto';
        if (fullText.includes('sofá') || fullText.includes('mesa') || fullText.includes('cadeira')) return 'moveis';
        
        // Categorias de moda
        if (fullText.includes('camiseta') || fullText.includes('camisa') || fullText.includes('blusa')) return 'roupas';
        if (fullText.includes('tênis') || fullText.includes('sapato') || fullText.includes('sandália')) return 'calcados';
        if (fullText.includes('relógio') || fullText.includes('óculos') || fullText.includes('bolsa')) return 'acessorios';
        
        // Categoria padrão baseada na categoria do backend
        return product.categorySlug || 'outros';
    }, []);

    const getTopRatedProducts = useCallback((products: Product[]): Product[] => {
        const seen = new Set<string>();
        const categoryCount = new Map<string, number>();
        const maxPerCategory = 2;

        return (
            products
                .filter(p => p.rating > 0 && p.reviewCount >= 5)
                .sort((a, b) => {
                    const scoreA = a.rating * Math.log(a.reviewCount + 1);
                    const scoreB = b.rating * Math.log(b.reviewCount + 1);
                    return scoreB - scoreA;
                })
                .filter(p => {
                    // Filtro por nome similar para evitar duplicatas
                    const nameKey = p.name.toLowerCase().split(' ').slice(0, 2).join(' ');
                    if (seen.has(nameKey)) return false;
                    seen.add(nameKey);

                    // Filtro por categoria para diversificar
                    const category = getProductCategory(p);
                    const currentCount = categoryCount.get(category) || 0;
                    
                    if (currentCount >= maxPerCategory) return false;
                    
                    categoryCount.set(category, currentCount + 1);
                    return true;
                })
                .slice(0, 10)
        );
    }, [getProductCategory]);

    const fetchInitialProducts = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/products/all-collections`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (!Array.isArray(data)) {
                throw new Error("Resposta da API não é um array");
            }

            const processed = data.map(processBackendProduct).filter(Boolean) as Product[];
            setProcessedProducts(processed);
            setFeaturedProducts(getTopRatedProducts(processed));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Erro desconhecido ao carregar produtos.";
            setError(errorMessage);
            console.error("Erro ao carregar produtos:", err);
        } finally {
            setLoading(false);
        }
    }, [processBackendProduct, getTopRatedProducts]);

    const fetchProductsByCollectionName = useCallback(async (collectionNameKey: keyof typeof COLLECTION_MAP): Promise<Product[]> => {
        const actualCollectionName = COLLECTION_MAP[collectionNameKey];
        try {
            const response = await fetch(`${API_BASE_URL}/products/collection/${actualCollectionName}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (!Array.isArray(data)) {
                throw new Error("Resposta da API não é um array");
            }

            return data.map(processBackendProduct).filter(Boolean) as Product[];
        } catch (err) {
            console.error(`Erro na busca da coleção ${actualCollectionName}:`, err);
            throw new Error(`Falha ao buscar produtos da coleção ${actualCollectionName}`);
        }
    }, [processBackendProduct]);

    const getProductById = useCallback((id: string): Product | undefined => {
        return processedProducts.find(p => p._id === id);
    }, [processedProducts]);

    useEffect(() => {
        fetchInitialProducts();
    }, [fetchInitialProducts]);

    return (
        <ProductContext.Provider value={{
            products: processedProducts,
            featuredProducts,
            loading,
            error,
            fetchInitialProducts,
            fetchProductsByCollectionName,
            getProductById
        }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = (): ProductContextType => {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error('useProducts deve ser usado dentro de um ProductProvider.');
    }
    return context;
};