import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Smartphone, Tv, ShoppingBag, Home, Brush, Dumbbell, Layers, Star, Gift, Tag, ShoppingCart, TrendingUp, Sparkles, Zap, Flame } from 'lucide-react'; // Import Flame

import { useProducts } from '../../contexts/ProductContext';

interface CategoryCardProps {
    icon: React.ReactNode;
    title: string;
    count: number;
    slug: string;
    delay?: number;
    gradient?: string;
    isSpecial?: boolean;
}

// Card de Categoria Individual com o tema "Fiery Red"
const CategoryCard: React.FC<CategoryCardProps> = ({ icon, title, count, slug, delay = 0, gradient, isSpecial = false }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ 
                duration: 0.6, 
                delay: delay,
                type: "spring",
                stiffness: 100
            }}
            whileHover={{ 
                scale: 1.05, 
                transition: { duration: 0.2 } 
            }}
            className="h-full"
        >
            <Link
                to={`/catalogo?categoria=${slug}`}
                className={`relative group flex flex-col items-center p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 h-full overflow-hidden ${
                    isSpecial 
                        ? 'bg-gradient-to-br from-red-600 via-orange-500 to-yellow-400 text-white' 
                        : 'bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                }`}
            >
                {/* Conditional background overlay for special cards vs. regular */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                    isSpecial 
                        ? 'bg-gradient-to-br from-red-900/20 to-orange-900/20' // Darker overlay for special card on hover
                        : gradient || 'bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20' // Existing or default gradient for regular
                }`} />
                <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-yellow-300/30 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Icon container styling adjusted for special cards */}
                <div className={`relative z-10 p-4 rounded-2xl mb-4 transition-all duration-300 group-hover:scale-110 ${
                    isSpecial 
                        ? 'bg-white/20 backdrop-blur-sm' 
                        : 'bg-gradient-to-br from-red-500 to-orange-500 text-white group-hover:from-red-600 group-hover:to-orange-600'
                }`}>
                    {icon}
                </div>
                
                {/* Title styling adjusted for special cards */}
                <h3 className={`relative z-10 text-lg font-bold mb-2 line-clamp-1 text-center transition-all duration-300 ${
                    isSpecial 
                        ? 'text-white' 
                        : 'text-neutral-800 dark:text-neutral-100 group-hover:text-red-600 dark:group-hover:text-orange-400'
                }`}>
                    {title}
                </h3>
                
                {/* Count styling adjusted for special cards */}
                <div className={`relative z-10 px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                    isSpecial 
                        ? 'bg-white/20 text-white backdrop-blur-sm' 
                        : 'bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 text-red-700 dark:text-orange-300 group-hover:from-red-200 group-hover:to-orange-200'
                }`}>
                    {count > 0 ? `${count} produtos` : 'Em breve'}
                </div>
                
                {isSpecial && (
                    <div className="absolute top-3 right-3 w-3 h-3 bg-yellow-300 rounded-full animate-pulse" />
                )}
            </Link>
        </motion.div>
    );
};

// CATEGORIAS REVERTIDAS PARA O ORIGINAL
const staticCategories = [
    { name: 'Promo Day', slug: 'promo-day', isSpecial: true }, // Keep Promo Day as special
    { name: 'Relâmpago', slug: 'relampago', isSpecial: false }, // CHANGED: Relâmpago is now NOT special
    { name: 'Ofertas', slug: 'ofertas' },
    { name: 'Menos de R$100', slug: 'menos-de-100' },
    { name: 'Compra do Mês', slug: 'compra-do-mes' },
    { name: 'Moda', slug: 'moda' },
];

// ÍCONES REVERTIDOS PARA O ORIGINAL
const getCategoryIcon = (slug: string): React.ReactNode => {
    const iconProps = { size: 32, strokeWidth: 2 };
    
    switch (slug) {
        case 'promo-day': return <Flame {...iconProps} />; // CHANGED: Flame icon for Promo Day
        case 'relampago': return <Zap {...iconProps} />; // Keep Zap icon for Relâmpago
        case 'ofertas': return <Gift {...iconProps} />;
        case 'menos-de-100': return <Tag {...iconProps} />;
        case 'compra-do-mes': return <TrendingUp {...iconProps} />;
        case 'moda': return <Brush {...iconProps} />;
        case 'tecnologia': return <Smartphone {...iconProps} />;
        case 'casa': return <Home {...iconProps} />;
        case 'esportes': return <Dumbbell {...iconProps} />;
        case 'tv': return <Tv {...iconProps} />;
        case 'shopping': return <ShoppingBag {...iconProps} />;
        default: return <Layers {...iconProps} />;
    }
};

const getCategoryGradient = (slug: string): string => {
    switch (slug) {
        // We'll rely on the CategoryCard's internal logic for isSpecial.
        // For non-special cards, these gradients are used for the hover overlay.
        case 'relampago': return 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30';
        case 'promo-day': return 'bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-900/40 dark:via-orange-900/40 dark:to-yellow-900/40';
        default: return 'bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20';
    }
};

const CategoriesSection: React.FC = () => {
    const { products, loading, error } = useProducts();

    const categoriesData = useMemo(() => {
        if (!products || !Array.isArray(products)) {
            return [];
        }
        const categoryMap = new Map<string, { title: string, count: number, isSpecial: boolean }>();

        staticCategories.forEach(cat => {
            categoryMap.set(cat.slug, { title: cat.name, count: 0, isSpecial: cat.isSpecial || false });
        });

        products.forEach(product => {
            const slug = product.categorySlug;
            if (!slug) return;
            
            const existing = categoryMap.get(slug);
            if (existing) {
                existing.count++;
            } else {
                const title = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                // Ensure new categories also inherit isSpecial property if defined
                categoryMap.set(slug, { title, count: 1, isSpecial: staticCategories.find(c => c.slug === slug)?.isSpecial || false });
            }
        });

        return Array.from(categoryMap.entries())
            .map(([slug, { title, count, isSpecial }]) => ({ id: slug, slug, title, count, isSpecial }))
            .sort((a, b) => {
                // Ensure special categories like 'promo-day' remain at the top if desired,
                // otherwise sort by count
                if (a.isSpecial && !b.isSpecial) return -1;
                if (!a.isSpecial && b.isSpecial) return 1;
                if (a.slug === 'promo-day' && b.slug !== 'promo-day') return -1; // Keep promo-day first if special
                if (b.slug === 'promo-day' && a.slug !== 'promo-day') return 1;
                return b.count - a.count; // Default sort by count
            });
    }, [products]);

    // **FUNDO ALTERADO PARA COR SÓLIDA PROFISSIONAL**
    const sectionClasses = "section-padding bg-neutral-100 dark:bg-neutral-900 relative overflow-hidden";

    if (loading) {
        return (
            <section className={sectionClasses}>
                <div className="container-custom text-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-neutral-600 dark:text-neutral-300 text-lg">Carregando as melhores ofertas...</p>
                    </div>
                </div>
            </section>
        );
    }
    
    // Error state
    if (error) {
        return (
            <section className={sectionClasses}>
                <div className="container-custom text-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <p className="text-red-600 dark:text-red-400 text-lg">Ocorreu um erro ao carregar as categorias: {error}</p>
                    </div>
                </div>
            </section>
        );
    }

    // No categories found state
    if (!categoriesData || categoriesData.length === 0) {
        return (
            <section className={sectionClasses}>
                <div className="container-custom text-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700/50 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <p className="text-neutral-600 dark:text-neutral-300 text-lg">Nenhuma categoria encontrada no momento.</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className={sectionClasses}>
            {/* Background decorativo mantido para dar profundidade */}
            <div className="absolute inset-0 opacity-20 dark:opacity-30">
                <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-red-400 to-orange-400 dark:from-red-600 dark:to-orange-600 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-400 to-yellow-400 dark:from-orange-600 dark:to-yellow-600 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="container-custom relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500/10 to-orange-500/10 dark:from-red-400/10 dark:to-orange-400/10 rounded-full mb-6">
                        <Flame className="w-5 h-5 text-red-600 dark:text-orange-400" />
                        <span className="text-sm font-medium text-red-700 dark:text-orange-300">Navegue pelas Ofertas</span>
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-neutral-800 via-red-600 to-orange-500 dark:from-neutral-100 dark:via-red-500 dark:to-orange-400 bg-clip-text text-transparent mb-6">
                        Encontre o que Procura
                    </h2>
                    
                    <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto leading-relaxed">
                        Explore departamentos repletos de promoções imperdíveis. 
                        <span className="text-red-600 dark:text-orange-400 font-semibold"> Preços que pegam fogo</span>, esperando por você!
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                    {categoriesData.map((category, index) => (
                        <CategoryCard
                            key={category.id}
                            icon={getCategoryIcon(category.slug)}
                            title={category.title}
                            count={category.count}
                            slug={category.slug}
                            delay={index * 0.1}
                            gradient={getCategoryGradient(category.slug)}
                            isSpecial={category.isSpecial}
                        />
                    ))}
                </div>
                
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-center mt-16"
                >
                    <Link to="/catalogo" className="inline-block">
                            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-red-500/20">
                                <ShoppingBag className="w-5 h-5" />
                                <span>Ver Todos os Produtos</span>
                            </div>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default CategoriesSection;