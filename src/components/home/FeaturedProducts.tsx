// src/components/home/FeaturedProducts.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useProducts } from '../../contexts/ProductContext'; // Use the main data context hook
import ProductGrid from '../products/ProductGrid'; // Ensure this path is correct

const FeaturedProducts: React.FC = () => {
  // Get featuredProducts and loading/error states from the ProductContext
  const { featuredProducts, loading, error } = useProducts(); // Note: loading/error apply to the entire data fetch

   // Handle error state for the entire data fetch
   if (error) {
      return (
         <section className="section-padding bg-white">
            <div className="container-custom text-center text-error-500">
               <p>{error}</p>
            </div>
         </section>
      );
   }

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-4">
              Produtos em Destaque
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Conheça nossa seleção de produtos mais populares com as melhores avaliações
              e condições exclusivas para você.
            </p>
          </div>
        </motion.div>

        {/* Pass processed featured products and loading state to ProductGrid */}
        {/* ProductGrid internally handles the skeleton when loading is true */}
        {/* The emptyMessage will be shown if loading is false and featuredProducts is empty */}
        <ProductGrid products={featuredProducts} loading={loading} emptyMessage="Nenhum produto em destaque encontrado." />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-10"
        >
          <Link to="/catalogo" className="button-outline">
            Ver Todos os Produtos
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;