import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useProducts } from '../../contexts/ProductContext';
import ProductCarousel from '../products/ProductCarousel';

const FeaturedProducts: React.FC = () => {
  const { featuredProducts, loading, error } = useProducts();

  if (error) {
    return (
      <section className="section-padding bg-white dark:bg-neutral-900">
        <div className="container-custom text-center text-error-500">
          <p>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-white dark:bg-neutral-900">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              Mais produtos que você pode gostar
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Descubra mais itens que combinam com o seu estilo.
            </p>
          </div>
        </motion.div>

        {/* Carrossel único de produtos */}
        <ProductCarousel
          products={featuredProducts}
          title=""               // título já está acima
          autoplayDelay={4000}
          transitionSpeed={1500}
          slidesPerViewDesktop={5}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
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
