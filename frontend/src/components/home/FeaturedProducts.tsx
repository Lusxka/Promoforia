import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useProducts } from '../../contexts/ProductContext';
import ProductCarousel from '../products/ProductCarousel';

const FeaturedProducts: React.FC = () => {
    const { featuredProducts, loading, error } = useProducts();

    // Limita a exibição a 8 produtos para um layout mais limpo e focado.
    const displayedProducts = featuredProducts.slice(0, 8);

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
                            Nossos Produtos em Destaque
                        </h2>
                        <p className="text-neutral-600 max-w-2xl mx-auto">
                            Descubra os produtos preferidos de nossos clientes. Uma seleção especial com as melhores avaliações.
                        </p>
                    </div>
                </motion.div>

                {/* Passa a lista limitada de produtos para o grid */}
                <ProductGrid products={displayedProducts} loading={loading} emptyMessage="Nenhum produto em destaque encontrado." />

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
