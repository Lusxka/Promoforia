import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useProducts } from '../../contexts/ProductContext';
import ProductGrid from '../products/ProductGrid'; // <-- ADICIONADO: Import do ProductGrid
import ProductCarousel from '../products/ProductCarousel'; // Import do ProductCarousel (já estava, mas mantenho)

const FeaturedProducts: React.FC = () => {
    const { featuredProducts, loading, error } = useProducts();

    // Limita a exibição a 8 produtos para um layout mais limpo e focado.
    const displayedProducts = featuredProducts.slice(0, 8);
    // Para o carrossel, você pode usar todos os produtos em destaque ou uma seleção diferente
    const productsForCarousel = featuredProducts; // Ex: usando todos os produtos em destaque para o carrossel

    if (error) {
        return (
            <section className="section-padding bg-white dark:bg-neutral-900"> {/* Adicionado dark mode class */}
                <div className="container-custom text-center text-error-500">
                    <p>{error}</p>
                </div>
            </section>
        );
    }

    return (
        <> {/* Fragment para envolver múltiplas seções */}
            <section className="section-padding bg-white dark:bg-neutral-900"> {/* Adicionado dark mode class */}
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4"> {/* Adicionado dark mode class */}
                                Nossos Produtos em Destaque
                            </h2>
                            <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto"> {/* Adicionado dark mode class */}
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

            {/* --- SEÇÃO DO CARROSSEL DINÂMICO --- */}
            {/* Esta seção foi adicionada de volta para que o carrossel funcione como solicitado */}
            <div className="mt-12"> {/* Adicionei uma margem superior para separá-lo da seção acima */}
                <ProductCarousel
                    products={productsForCarousel} // Use a lista de produtos que você deseja no carrossel
                    title="Mais produtos que você pode gostar"
                    autoplayDelay={4000} // Atraso de 4 segundos por slide
                    transitionSpeed={1500} // Transição de 1.5 segundos
                    slidesPerViewDesktop={5} // 5 slides visíveis no desktop
                />
            </div>
            {/* --- FIM DA SEÇÃO DO CARROSSEL --- */}
        </>
    );
};

export default FeaturedProducts;