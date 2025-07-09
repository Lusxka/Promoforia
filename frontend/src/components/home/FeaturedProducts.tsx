import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useProducts } from '../../contexts/ProductContext';
import ProductCarousel from '../products/ProductCarousel';

const FeaturedProducts: React.FC = () => {
    const { featuredProducts, loading, error } = useProducts();

    const productsForCarousel = featuredProducts; 

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
                            Nossos Produtos em Destaque
                        </h2>
                        <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                            Descubra os produtos preferidos de nossos clientes. Uma seleção especial com as melhores avaliações.
                        </p>
                    </div>
                </motion.div>

                {/* --- SEÇÃO DO CARROSSEL DINÂMICO --- */}
                <div className="mb-12">
                    <ProductCarousel
                        products={productsForCarousel}
                        title="" // Removido o comentário inline que estava causando o erro
                        autoplayDelay={4000}
                        transitionSpeed={1500}
                        slidesPerViewDesktop={5}
                    />
                </div>
                {/* --- FIM DA SEÇÃO DO CARROSSEL --- */}

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