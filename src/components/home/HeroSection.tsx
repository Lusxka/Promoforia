import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 text-white pt-24 pb-16 md:pt-32 md:pb-24">
      {/* Overlay pattern */}
      <div className="absolute inset-0 opacity-10" style={{ 
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
      }} />

      <div className="container-custom relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              As melhores ofertas para você em um só lugar
            </h1>
            <p className="text-lg md:text-xl text-neutral-200 mb-8 max-w-xl">
              Encontre produtos exclusivos, com descontos incríveis e ganhe bônus em todas as suas compras.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/catalogo" className="button-secondary text-center">
                Ver Produtos
              </Link>
              <Link to="/catalogo?promocao=true" className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-medium py-2 px-4 rounded-md transition-colors duration-200 text-center">
                Ofertas Especiais
              </Link>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden md:block"
          >
            <div className="relative bg-white/10 p-2 rounded-lg backdrop-blur-sm rotate-3 shadow-xl">
              <img 
                src="https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Produtos em destaque" 
                className="w-full h-auto rounded"
              />
              <div className="absolute -bottom-4 -left-4 bg-secondary-500 text-white px-4 py-2 rounded-lg shadow-lg">
                <p className="text-sm font-semibold">Até 40% OFF</p>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -right-6 bg-white/10 p-2 rounded-lg backdrop-blur-sm -rotate-3 shadow-xl">
              <img 
                src="https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Ofertas especiais" 
                className="w-48 h-auto rounded"
              />
              <div className="absolute -top-4 -right-4 bg-primary-600 text-white px-4 py-2 rounded-lg shadow-lg">
                <p className="text-sm font-semibold">Novidades</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-16 md:mt-24 text-center"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <p className="text-3xl md:text-4xl font-bold text-secondary-300">1000+</p>
            <p className="text-sm md:text-base text-neutral-200">Produtos</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <p className="text-3xl md:text-4xl font-bold text-secondary-300">15k+</p>
            <p className="text-sm md:text-base text-neutral-200">Clientes Satisfeitos</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <p className="text-3xl md:text-4xl font-bold text-secondary-300">24h</p>
            <p className="text-sm md:text-base text-neutral-200">Suporte</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <p className="text-3xl md:text-4xl font-bold text-secondary-300">50+</p>
            <p className="text-sm md:text-base text-neutral-200">Marcas Parceiras</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;