// src/components/products/ProductGrid.tsx

import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '../../types/Product';
import ProductGridSkeleton from './ProductGridSkeleton';

interface ProductGridProps {
    products: Product[];
    loading?: boolean;
    emptyMessage?: string;
    count?: number; // Adicionado para o esqueleto
}

const ProductGrid: React.FC<ProductGridProps> = ({
    products,
    loading = false,
    emptyMessage = "Nenhum produto encontrado.",
    count // Recebe a contagem para o esqueleto
}) => {
    if (loading) {
        // Usar o count para o esqueleto, padrão 8 ou a contagem de produtos por página se relevante
        return <ProductGridSkeleton count={count || 40} />; // Padrão 40 se count não for passado
    }

    // Verifica se products é um array válido antes de verificar o length
    if (!products || !Array.isArray(products) || products.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-neutral-600">{emptyMessage}</p>
            </div>
        );
    }

    // Agora é seguro usar products.map porque garantimos que products é um array com items
    return (
        // --- Classes ajustadas para 3 colunas em telas médias e maiores ---
        // grid-cols-2: 2 colunas em telas pequenas
        // md:grid-cols-3: 3 colunas em telas médias (md) e maiores
        <div className="product-grid grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {products.map((product, index) => (
                product ? <ProductCard key={product._id || index} product={product} index={index} /> : null // Usar _id ou index como fallback para key
            ))}
        </div>
    );
};

export default ProductGrid;