// src/components/products/ProductGrid.tsx

import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '../../types/Product';
import ProductGridSkeleton from './ProductGridSkeleton';

interface ProductGridProps {
  products: Product[]; // Continua esperando um array como prop, mas verifica se é nulo/indefinido
  loading?: boolean;
  emptyMessage?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading = false,
  emptyMessage = "Nenhum produto encontrado."
}) => {
  if (loading) {
    return <ProductGridSkeleton count={8} />;
  }

  // >>> ADIÇÃO PARA CORRIGIR TypeError: Verifica se products é um array válido antes de verificar o length
  // Se products for undefined, null, ou não for um array, considera como vazio
  if (!products || !Array.isArray(products) || products.length === 0) {
    // O componente só chega aqui se não estiver loading (verificação acima)
    return (
      <div className="text-center py-12">
        <p className="text-neutral-600">{emptyMessage}</p>
      </div>
    );
  }

  // Agora é seguro usar products.map porque garantimos que products é um array com items
  return (
    <div className="product-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6"> {/* Exemplo de classes grid, ajuste conforme seu CSS */}
      {products.map((product, index) => (
        // É uma boa prática adicionar uma verificação básica para garantir que o product em si não é nulo/indefinido
        product ? <ProductCard key={product._id} product={product} index={index} /> : null
      ))}
    </div>
  );
};

export default ProductGrid;