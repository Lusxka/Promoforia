import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Home, Search } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="container-custom py-20 flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-lg"
      >
        <ShoppingBag size={60} className="mx-auto text-primary-300 mb-6" />
        
        <h1 className="text-5xl font-bold text-neutral-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-neutral-800 mb-4">Página não encontrada</h2>
        
        <p className="text-neutral-600 mb-8">
          Parece que a página que você está procurando não existe ou foi movida.
          Vamos ajudá-lo a encontrar o que precisa.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link to="/" className="button-primary flex items-center justify-center">
            <Home size={18} className="mr-2" />
            Voltar para o Início
          </Link>
          <Link to="/catalogo" className="button-outline flex items-center justify-center">
            <Search size={18} className="mr-2" />
            Explorar Produtos
          </Link>
        </div>
        
        <div className="bg-neutral-50 p-6 rounded-lg">
          <h3 className="font-medium text-neutral-800 mb-3">Você pode estar procurando por:</h3>
          <ul className="space-y-2 text-left">
            <li>
              <Link to="/catalogo" className="text-primary-600 hover:underline flex items-center">
                <ChevronRight size={16} className="mr-1" />
                Catálogo completo de produtos
              </Link>
            </li>
            <li>
              <Link to="/catalogo?categoria=eletronicos" className="text-primary-600 hover:underline flex items-center">
                <ChevronRight size={16} className="mr-1" />
                Produtos eletrônicos
              </Link>
            </li>
            <li>
              <Link to="/carrinho" className="text-primary-600 hover:underline flex items-center">
                <ChevronRight size={16} className="mr-1" />
                Seu carrinho de compras
              </Link>
            </li>
            <li>
              <Link to="/favoritos" className="text-primary-600 hover:underline flex items-center">
                <ChevronRight size={16} className="mr-1" />
                Lista de favoritos
              </Link>
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;