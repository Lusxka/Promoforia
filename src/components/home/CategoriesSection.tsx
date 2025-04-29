// src/components/home/CategoriesSection.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
// Icons are provided by the context, no need to import here
// import { Smartphone, Tv, ShoppingBag, Home, Brush, Dumbbell } from 'lucide-react';
import { useProducts } from '../../contexts/ProductContext'; // Use the main data context hook

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
      {/* Link to catalog page, filter by category slug */}
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

const CategoriesSection: React.FC = () => {
  // Get categories, loading, error, and getCategoryIcon from the ProductContext
  const { categories, loading, error, getCategoryIcon } = useProducts();

  // Handle loading state for the entire data fetch
  if (loading) {
    return (
      <section className="section-padding bg-neutral-50">
         <div className="container-custom text-center">
            <p className="text-neutral-600">Carregando categorias...</p>
            {/* Optional: Add a simple skeleton UI specifically for categories */}
         </div>
      </section>
    );
  }

  // Handle error state for the entire data fetch
  if (error) {
    return (
      <section className="section-padding bg-neutral-50">
         <div className="container-custom text-center text-error-500">
            <p>{error}</p>
         </div>
      </section>
    );
  }

  // Display message if no categories were derived (implies no products were fetched or processed)
  if (categories.length === 0) {
     return (
       <section className="section-padding bg-neutral-50">
          <div className="container-custom text-center text-neutral-600">
             <p>Nenhuma categoria encontrada.</p>
          </div>
       </section>
     );
  }

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
              key={category.id} // Use the derived category ID (slug)
              icon={getCategoryIcon(category.slug)} // Get icon from context helper
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