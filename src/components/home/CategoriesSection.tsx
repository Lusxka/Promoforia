// src/components/home/CategoriesSection.tsx

import React, { useMemo } from 'react'; // Importe useMemo
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
// Importe os ícones que você usará. Exemplo com lucide-react:
// >>> ADICIONADO ShoppingCart à lista de imports <<<
import { Smartphone, Tv, ShoppingBag, Home, Brush, Dumbbell, Layers, Star, Heart, Tag, ShoppingCart } from 'lucide-react'; // Adicione/remova conforme suas categorias

import { useProducts } from '../../contexts/ProductContext'; // Use o hook principal do contexto

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
            {/* Link para a página de catálogo, filtrar por slug da categoria */}
            <Link
                to={`/catalogo?categoria=${slug}`}
                className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 group h-full" // Added h-full for consistent height
            >
                <div className="p-3 rounded-full bg-primary-50 text-primary-600 mb-4 group-hover:bg-primary-100 transition-colors duration-300">
                    {icon}
                </div>
                <h3 className="text-lg font-medium text-neutral-800 mb-1 line-clamp-1 text-center group-hover:text-primary-600 transition-colors duration-300">
                    {title}
                </h3>
                <p className="text-sm text-neutral-500 text-center">
                    {count} produtos
                </p>
            </Link>
        </motion.div>
    );
};

// Mapeia slugs de categoria para ícones
const getCategoryIcon = (slug: string): React.ReactNode => {
    switch (slug) {
        case 'relampago': return <Star size={30} />; // Exemplo
        case 'ofertas': return <Tag size={30} />; // Exemplo
        case 'menos-de-100': return <ShoppingCart size={30} />; // >>> AGORA ShoppingCart ESTÁ IMPORTADO <<<
        case 'compra-do-mes': return <Home size={30} />; // Exemplo
        case 'moda': return <Brush size={30} />; // Exemplo
        // Adicione mais cases para outras categorias
        default: return <Layers size={30} />; // Ícone padrão se o slug não for reconhecido
    }
};


const CategoriesSection: React.FC = () => {
    // Obtenha APENAS products, loading e error do ProductContext
    const { products, loading, error } = useProducts();

    // --- DERIVAR DADOS DAS CATEGORIAS A PARTIR DOS PRODUTOS ---
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


    // --- FIM DA DERIVAÇÃO ---


    // Trata o estado de loading da busca inicial de produtos
    if (loading) {
        return (
            <section className="section-padding bg-neutral-50">
                <div className="container-custom text-center">
                    <p className="text-neutral-600">Carregando categorias...</p>
                </div>
            </section>
        );
    }

    // Trata o estado de erro da busca inicial de produtos
    if (error) {
        return (
            <section className="section-padding bg-neutral-50">
                <div className="container-custom text-center text-error-500">
                    <p>Erro ao carregar categorias: {error}</p>
                </div>
            </section>
        );
    }

    // Exibe mensagem se nenhuma categoria foi derivada
    if (!categoriesData || !Array.isArray(categoriesData) || categoriesData.length === 0) {
        return (
            <section className="section-padding bg-neutral-50">
                <div className="container-custom text-center text-neutral-600">
                    <p>Nenhuma categoria encontrada.</p>
                </div>
            </section>
        );
    }

    // Se chegou aqui, temos categorias para exibir
    return (
        <section className="section-padding bg-neutral-50">
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-4">
                            Navegue por Categorias
                        </h2>
                        <p className="text-neutral-600 max-w-2xl mx-auto">
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