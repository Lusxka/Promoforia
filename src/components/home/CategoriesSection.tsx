import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Smartphone, Tv, ShoppingBag, Home, Brush, Dumbbell } from 'lucide-react';

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
      <Link 
        to={`/catalogo?categoria=${slug}`}
        className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 group"
      >
        <div className="p-3 rounded-full bg-primary-50 text-primary-600 mb-4 group-hover:bg-primary-100 transition-colors duration-300">
          {icon}
        </div>
        <h3 className="text-lg font-medium text-neutral-800 mb-1 group-hover:text-primary-600 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-sm text-neutral-500">
          {count} produtos
        </p>
      </Link>
    </motion.div>
  );
};

const CategoriesSection: React.FC = () => {
  const categories = [
    { icon: <Smartphone size={28} />, title: 'Eletrônicos', count: 148, slug: 'eletronicos' },
    { icon: <ShoppingBag size={28} />, title: 'Moda', count: 237, slug: 'moda' },
    { icon: <Home size={28} />, title: 'Casa e Decoração', count: 92, slug: 'casa' },
    { icon: <Brush size={28} />, title: 'Beleza', count: 74, slug: 'beleza' },
    { icon: <Dumbbell size={28} />, title: 'Esportes', count: 56, slug: 'esportes' },
    { icon: <Tv size={28} />, title: 'Entretenimento', count: 83, slug: 'entretenimento' },
  ];

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
          {categories.map((category, index) => (
            <CategoryCard 
              key={category.slug}
              icon={category.icon}
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