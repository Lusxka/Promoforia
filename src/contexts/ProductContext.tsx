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

const API_BASE_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:4000';

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

    const getTopRatedProducts = useCallback((products: Product[]): Product[] => {
        const seen = new Set<string>();
        return (
            products
                .filter(p => p.rating > 0 && p.reviewCount >= 5) // Filtra produtos com pelo menos 5 avaliações
                .sort((a, b) => {
                    const scoreA = a.rating * Math.log(a.reviewCount + 1); // Pondera nota e quantidade de avaliações
                    const scoreB = b.rating * Math.log(b.reviewCount + 1);
                    return scoreB - scoreA; // Ordem decrescente
                })
                .filter(p => {
                    const key = `${p.name}-${p.sellerName}`;
                    if (seen.has(key)) return false;
                    seen.add(key);
                    return true;
                })
                .slice(0, 10)
        );
    }, []);

    const fetchInitialProducts = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/api/products/all-collections`);
            if (!response.ok) throw new Error(`Falha ao buscar todos os produtos. Status: ${response.status}`);

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
            const response = await fetch(`${API_BASE_URL}/api/products/collection/${actualCollectionName}`);
            if (!response.ok) throw new Error(`Falha ao buscar coleção ${actualCollectionName}`);

            const data = await response.json();
            return Array.isArray(data) ? data.map(processBackendProduct).filter(Boolean) as Product[] : [];
        } catch (err) {
            console.error(`Erro na busca da coleção ${actualCollectionName}:`, err);
            return [];
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