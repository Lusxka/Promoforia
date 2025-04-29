// src/components/products/ProductGridSkeleton.tsx
import React from 'react';

interface ProductGridSkeletonProps {
  count?: number;
}

const ProductGridSkeleton: React.FC<ProductGridSkeletonProps> = ({ count = 8 }) => { // Default to 8 to match featured products
  // Assumes 'product-grid' class provides the grid layout
  return (
    <div className="product-grid">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
          {/* Product Image Placeholder */}
          <div className="relative pb-[100%] overflow-hidden bg-neutral-200" />

          {/* Product Content Placeholder */}
          <div className="p-4">
            {/* Stars Placeholder */}
            <div className="flex mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-4 h-4 rounded-full bg-neutral-200 mr-1 bg-neutral-200" />
              ))}
              <div className="w-8 h-4 bg-neutral-200 rounded ml-1 bg-neutral-200" /> {/* Review Count Placeholder */}
            </div>

            {/* Name Placeholder */}
            <div className="h-5 bg-neutral-200 rounded w-3/4 mb-2 bg-neutral-200" />
            <div className="h-5 bg-neutral-200 rounded w-1/2 mb-3 bg-neutral-200" />

            {/* Description Placeholder */}
            <div className="h-4 bg-neutral-200 rounded w-full mb-1 bg-neutral-200" />
            <div className="h-4 bg-neutral-200 rounded w-full mb-1 bg-neutral-200" />
            <div className="h-4 bg-neutral-200 rounded w-2/3 mb-3 bg-neutral-200" />

            {/* Price Placeholder */}
            <div className="flex items-center mb-3">
              <div className="h-6 bg-neutral-200 rounded w-1/3 bg-neutral-200" />
              <div className="h-4 bg-neutral-200 rounded w-1/4 ml-2 bg-neutral-200" />
            </div>

            {/* Button Placeholder */}
            <div className="h-10 bg-neutral-200 rounded w-full bg-neutral-200" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGridSkeleton;