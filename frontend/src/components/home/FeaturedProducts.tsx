import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useProducts } from '../../contexts/ProductContext';
import ProductGrid from '../products/ProductGrid';

const FeaturedProducts: React.FC = () => {
    const { featuredProducts, loading, error } = useProducts();
    const displayedProducts = featuredProducts.slice(0, 8);

    if (error) {
        return (
            // CORREÇÃO DARK MODE: Fundo e cor do texto de erro
            <section className="section-padding bg-white dark:bg-neutral-900">
                <div className="container-custom text-center text-error-500 dark:text-error-400">
                    <p>{error}</p>
                </div>
            </section>
        );
    }

    return (
        // CORREÇÃO DARK MODE: Fundo da seção e cores dos textos
        <section className="section-padding bg-white dark:bg-neutral-900">
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-4">
                            Nossos Produtos em Destaque
                        </h2>
                        <p className="text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
                            Descubra os produtos preferidos de nossos clientes. Uma seleção especial com as melhores avaliações.
                        </p>
                    </div>
                </motion.div>

                <ProductGrid products={displayedProducts} loading={loading} emptyMessage="Nenhum produto em destaque encontrado." />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-center mt-12"
                >
                    {/* O botão usa a classe 'button-outline', que já deve ter sido corrigida no seu CSS global. */}
                    <Link to="/catalogo" className="button-outline">
                        Ver Todos os Produtos
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default FeaturedProducts;