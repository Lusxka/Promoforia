import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Smartphone, Tv, ShoppingBag, Home, Brush, Dumbbell, Layers, Star, Heart, Tag, ShoppingCart } from 'lucide-react';
import { useProducts } from '../../contexts/ProductContext';

interface CategoryCardProps {
    icon: React.ReactNode;
    title: string;
    count: number;
    slug: string;
    delay?: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ icon, title, count, slug, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: delay }}
        >
            {/* CORREÇÃO DARK MODE: Estilo do card de categoria */}
            <Link
                to={`/catalogo?categoria=${slug}`}
                className="flex flex-col items-center p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 group h-full"
            >
                <div className="p-3 rounded-full bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 mb-4 group-hover:bg-primary-100 dark:group-hover:bg-primary-500/20 transition-colors duration-300">
                    {icon}
                </div>
                <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-100 mb-1 line-clamp-1 text-center group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                    {title}
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center">
                    {count} produtos
                </p>
            </Link>
        </motion.div>
    );
};

const getCategoryIcon = (slug: string): React.ReactNode => {
    switch (slug) {
        case 'relampago': return <Star size={30} />;
        case 'ofertas': return <Tag size={30} />;
        case 'menos-de-100': return <ShoppingCart size={30} />;
        case 'compra-do-mes': return <Home size={30} />;
        case 'moda': return <Brush size={30} />;
        default: return <Layers size={30} />;
    }
};

const CategoriesSection: React.FC = () => {
    const { products, loading, error } = useProducts();

    const categoriesData = useMemo(() => {
        if (!products || !Array.isArray(products)) {
            return [];
        }
        const categoryMap = new Map<string, { title: string, count: number }>();
        products.forEach(product => {
            const slug = product.categorySlug;
            if (!slug) {
                return;
            }
            const title = slug
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            if (categoryMap.has(slug)) {
                categoryMap.get(slug)!.count++;
            } else {
                categoryMap.set(slug, { title, count: 1 });
            }
        });
        const sortedCategories = Array.from(categoryMap.entries())
            .map(([slug, { title, count }]) => ({ id: slug, slug, title, count }))
            .sort((a, b) => a.title.localeCompare(b.title));
        return sortedCategories;
    }, [products]);

    if (loading) {
        return (
            // CORREÇÃO DARK MODE: Fundo e cor do texto de carregamento
            <section className="section-padding bg-neutral-50 dark:bg-neutral-900">
                <div className="container-custom text-center">
                    <p className="text-neutral-600 dark:text-neutral-300">Carregando categorias...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            // CORREÇÃO DARK MODE: Fundo e cor do texto de erro
            <section className="section-padding bg-neutral-50 dark:bg-neutral-900">
                <div className="container-custom text-center text-error-500 dark:text-error-400">
                    <p>Erro ao carregar categorias: {error}</p>
                </div>
            </section>
        );
    }

    if (!categoriesData || !Array.isArray(categoriesData) || categoriesData.length === 0) {
        return (
            // CORREÇÃO DARK MODE: Fundo e cor do texto
            <section className="section-padding bg-neutral-50 dark:bg-neutral-900">
                <div className="container-custom text-center text-neutral-600 dark:text-neutral-300">
                    <p>Nenhuma categoria encontrada.</p>
                </div>
            </section>
        );
    }

    return (
        // CORREÇÃO DARK MODE: Fundo da seção e cores dos textos
        <section className="section-padding bg-neutral-50 dark:bg-neutral-900">
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-4">
                            Navegue por Categorias
                        </h2>
                        <p className="text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
                            Encontre o que você precisa de maneira rápida e fácil através das nossas categorias principais
                        </p>
                    </div>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
                    {categoriesData.map((category, index) => (
                        <CategoryCard
                            key={category.id}
                            icon={getCategoryIcon(category.slug)}
                            title={category.title}
                            count={category.count}
                            slug={category.slug}
                            delay={index * 0.1}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoriesSection;