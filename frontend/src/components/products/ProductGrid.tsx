import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '../../types/Product';
import ProductGridSkeleton from './ProductGridSkeleton';

interface ProductGridProps {
    products: Product[];
    loading?: boolean;
    emptyMessage?: string;
    count?: number;
}

const ProductGrid: React.FC<ProductGridProps> = ({
    products,
    loading = false,
    emptyMessage = "Nenhum produto encontrado.",
    count
}) => {
    if (loading) {
        return <ProductGridSkeleton count={count || 40} />;
    }

    if (!products || !Array.isArray(products) || products.length === 0) {
        return (
            // CORREÇÃO DARK MODE: Cor do texto para mensagem vazia
            <div className="text-center py-12">
                <p className="text-neutral-600 dark:text-neutral-300">{emptyMessage}</p>
            </div>
        );
    }

    return (
<<<<<<< HEAD
        <div className="product-grid grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
=======
        // --- CLASSES AJUSTADAS AQUI para mais colunas e espaçamento ligeiramente menor ---
        // grid-cols-2: 2 colunas em telas pequenas (padrão)
        // sm:grid-cols-3: 3 colunas em telas sm (640px)
        // md:grid-cols-4: 4 colunas em telas md (768px)
        // lg:grid-cols-5: 5 colunas em telas lg (1024px)
        // xl:grid-cols-6: 6 colunas em telas xl (1280px)
        // gap-x-4 gap-y-6: espaçamento entre itens (ajustado para ser um pouco mais compacto na vertical)
        <div className="product-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-6">
>>>>>>> 142ecb79c444fcb7f012c33773db345c62915b46
            {products.map((product, index) => (
                product ? <ProductCard key={product._id || index} product={product} index={index} /> : null
            ))}
        </div>
    );
};

export default ProductGrid;