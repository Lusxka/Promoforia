import React from 'react';

interface ProductGridSkeletonProps {
  count?: number;
}

const ProductGridSkeleton: React.FC<ProductGridSkeletonProps> = ({ count = 8 }) => {
  return (
    // A classe 'product-grid' vinda do componente pai já define o layout
    <div className="product-grid">
      {Array.from({ length: count }).map((_, index) => (
        // CORREÇÃO DARK MODE: Fundo do card e dos elementos placeholder
        <div key={index} className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm overflow-hidden animate-pulse">
          <div className="relative pb-[100%] overflow-hidden bg-neutral-200 dark:bg-neutral-700" />
          <div className="p-4">
            <div className="flex mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-4 h-4 rounded-full bg-neutral-200 dark:bg-neutral-700 mr-1" />
              ))}
              <div className="w-8 h-4 bg-neutral-200 dark:bg-neutral-700 rounded ml-1" />
            </div>
            <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 mb-2" />
            <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2 mb-3" />
            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full mb-1" />
            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full mb-1" />
            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3 mb-3" />
            <div className="flex items-center mb-3">
              <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3" />
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/4 ml-2" />
            </div>
            <div className="h-10 bg-neutral-200 dark:bg-neutral-700 rounded w-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGridSkeleton;