// src/components/home/HeroSection.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

const HeroSection: React.FC = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className="relative text-white pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Vídeo de fundo com looping infinito */}
      {/* Removemos o overlay azul para o vídeo ficar visível */}
      <div className="absolute inset-0 z-0">
        <video
          key={isDarkMode ? 'dark' : 'light'}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-1000" // Aumentamos a opacidade para o vídeo ser mais visível
          src={isDarkMode ? "src/components/layout/img/fundoDark.mp4" : "src/components/layout/img/fundo.mp4"}
        >
          Seu navegador não suporta vídeo em HTML5.
        </video>
      </div>

      {/* Removemos este overlay de cor que criava o fundo azul
      <div className="absolute inset-0 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 opacity-80 z-10" />
      */}

      <div className="container-custom relative z-20"> {/* Conteúdo acima do vídeo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            As ofertas imperdíveis que você procura, reunidas em um só lugar
            </h1>
            <p className="text-lg md:text-xl text-neutral-200 mb-8 max-w-xl">
              Encontre produtos exclusivos, com descontos incríveis e ganhe descontos em todas as suas compras.
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
                src= "src/components/layout/img/banner.png"
                alt="Produtos em destaque"
                className="w-full h-auto rounded"
              />
              <div className="absolute -bottom-4 -left-4 bg-secondary-500 text-white px-4 py-2 rounded-lg shadow-lg">
                <p className="text-sm font-semibold">Frete Grátis</p>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-6 bg-white/10 p-2 rounded-lg backdrop-blur-sm -rotate-3 shadow-xl">
              <img
                src="src\components\layout\img\banner_2.png"
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