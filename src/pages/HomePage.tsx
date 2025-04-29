import React from 'react';
import HeroSection from '../components/home/HeroSection';
import FeaturedProducts from '../components/home/FeaturedProducts';
import CategoriesSection from '../components/home/CategoriesSection';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, Headphones, RefreshCw } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div>
      <HeroSection />
      
      {/* Vantagens */}
      <section className="py-10 bg-neutral-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0 }}
              className="flex items-start p-4"
            >
              <div className="p-2 rounded-full bg-primary-100 text-primary-600 mr-4">
                <Truck size={24} />
              </div>
              <div>
                <h3 className="font-medium text-neutral-800 mb-1">Entrega Rápida</h3>
                <p className="text-sm text-neutral-600">Receba seus produtos em casa com rapidez e segurança</p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-start p-4"
            >
              <div className="p-2 rounded-full bg-primary-100 text-primary-600 mr-4">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="font-medium text-neutral-800 mb-1">Compra Segura</h3>
                <p className="text-sm text-neutral-600">Transações protegidas e dados criptografados</p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-start p-4"
            >
              <div className="p-2 rounded-full bg-primary-100 text-primary-600 mr-4">
                <RefreshCw size={24} />
              </div>
              <div>
                <h3 className="font-medium text-neutral-800 mb-1">Devolução Gratuita</h3>
                <p className="text-sm text-neutral-600">30 dias para troca ou devolução sem custos</p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-start p-4"
            >
              <div className="p-2 rounded-full bg-primary-100 text-primary-600 mr-4">
                <Headphones size={24} />
              </div>
              <div>
                <h3 className="font-medium text-neutral-800 mb-1">Suporte 24/7</h3>
                <p className="text-sm text-neutral-600">Atendimento exclusivo para nossos clientes</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      <FeaturedProducts />
      <CategoriesSection />
      
      {/* Banner promocional */}
      <section className="py-16 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 text-white">
        <div className="container-custom">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ofertas Especiais para Novos Clientes</h2>
            <p className="text-lg text-neutral-200 mb-8 max-w-2xl mx-auto">
              Ganhe 10% de desconto na sua primeira compra! Use o cupom <span className="font-semibold bg-white/20 px-2 py-1 rounded">BEMVINDO10</span>
            </p>
            <a href="/catalogo?promocao=true" className="button-secondary">
              Ver Ofertas Exclusivas
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;