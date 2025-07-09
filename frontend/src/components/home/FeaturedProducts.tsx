// src/components/home/FeaturedProducts.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useProducts } from '../../contexts/ProductContext';
import ProductGrid from '../products/ProductGrid';

const FeaturedProducts: React.FC = () => {
    const { featuredProducts, loading, error } = useProducts();

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
                            Produtos Mais Bem Avaliados
                        </h2>
                        <p className="text-neutral-600 max-w-2xl mx-auto">
                            Confira nossa seleção dos 10 melhores produtos com as maiores avaliações dos clientes.
                        </p>
                    </div>
                </motion.div>

                <ProductGrid products={featuredProducts} loading={loading} emptyMessage="Nenhum produto bem avaliado encontrado." />

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