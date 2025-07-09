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
        <div className="product-grid grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {products.map((product, index) => (
                product ? <ProductCard key={product._id || index} product={product} index={index} /> : null
            ))}
        </div>
    );
};

export default ProductGrid;