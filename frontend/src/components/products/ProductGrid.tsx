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
        // --- CLASSES AJUSTADAS AQUI para mais colunas e espaçamento ligeiramente menor ---
        // grid-cols-2: 2 colunas em telas pequenas (padrão)
        // sm:grid-cols-3: 3 colunas em telas sm (640px)
        // md:grid-cols-4: 4 colunas em telas md (768px)
        // lg:grid-cols-5: 5 colunas em telas lg (1024px)
        // xl:grid-cols-6: 6 colunas em telas xl (1280px)
        // gap-x-4 gap-y-6: espaçamento entre itens (ajustado para ser um pouco mais compacto na vertical)
        <div className="product-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-6">
            {products.map((product, index) => (
                product ? <ProductCard key={product._id || index} product={product} index={index} /> : null
            ))}
        </div>
    );
};

export default ProductGrid;