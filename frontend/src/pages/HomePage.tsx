// frontend/src/pages/HomePage.tsx

import React, { useState, useEffect } from 'react';
import HeroSection from '../components/home/HeroSection';
import FeaturedProducts from '../components/home/FeaturedProducts';
import CategoriesSection from '../components/home/CategoriesSection';
import Modal from '../components/home/Modal';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, Headphones, RefreshCw, CheckCircle, Star, Gift, Zap, Award } from 'lucide-react';

const HomePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalContent, setModalContent] = useState<'form' | 'success'>('form');

  useEffect(() => {
    const timer = setTimeout(() => {
      const hasSeenModal = localStorage.getItem('hasSeenNewsletterModal');
      if (!hasSeenModal) {
        setIsModalOpen(true);
        setModalContent('form'); 
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    localStorage.setItem('hasSeenNewsletterModal', 'true');
    setTimeout(() => setModalContent('form'), 10000);
  };

  const handleNewsletterSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const emailInput = form.elements.namedItem('email') as HTMLInputElement | null;
    const email = emailInput?.value;

    if (!email) {
      alert("Por favor, insira um endereço de e-mail válido.");
      return;
    }

    setIsSubmitting(true);

    try {
      const backendUrl = process.env.NODE_ENV === 'production'
        ? 'https://sua-api-em-producao.com/api/newsletter-subscribe'
        : 'http://localhost:4000/api/newsletter-subscribe';

      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Inscrição bem-sucedida:', data.message);
        setModalContent('success');
        setTimeout(() => {
            handleCloseModal();
        }, 5000);
      } else {
        console.error('Erro na submissão:', data.message);
        alert(`Não foi possível processar sua inscrição: ${data.message || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro ao enviar a requisição para o back-end:', error);
      alert('Ocorreu um erro ao tentar se inscrever. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Dados dos benefícios com melhor hierarquia visual
  const benefits = [
    {
      icon: <Truck size={28} />,
      title: "Entrega Expressa",
      description: "Receba seus produtos em casa com rapidez e segurança",
      gradient: "from-amber-400 to-orange-500"
    },
    {
      icon: <ShieldCheck size={28} />,
      title: "Compra Protegida",
      description: "Transações 100% seguras com dados criptografados",
      gradient: "from-emerald-400 to-teal-500"
    },
    {
      icon: <RefreshCw size={28} />,
      title: "Troca Garantida",
      description: "30 dias para troca ou devolução sem custos adicionais",
      gradient: "from-blue-400 to-indigo-500"
    },
    {
      icon: <Headphones size={28} />,
      title: "Suporte Premium",
      description: "Atendimento especializado 24/7 para nossos clientes",
      gradient: "from-purple-400 to-pink-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-amber-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-amber-950/20">
      {/* Hero Section */}
      <HeroSection />

      {/* Seção de Benefícios Redesenhada */}
      <section className="py-20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-100/50 via-transparent to-orange-100/50 dark:from-amber-900/20 dark:via-transparent dark:to-orange-900/20"></div>
        
        <div className="container-custom relative z-10">
          {/* Header da Seção */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent font-semibold text-sm uppercase tracking-wider mb-4">
              <Award size={20} className="text-amber-500" />
              Vantagens Exclusivas
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-6">
              Por que escolher o
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent"> Promoforia?</span>
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed">
              Oferecemos a melhor experiência de compra com benefícios únicos pensados especialmente para você
            </p>
          </motion.div>

          {/* Grid de Benefícios */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
                className="group relative"
              >
                <div className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-neutral-200/50 dark:border-neutral-700/50 h-full">
                  {/* Ícone com Gradiente */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${benefit.gradient} shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">
                      {benefit.icon}
                    </div>
                  </div>
                  
                  {/* Conteúdo */}
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    {benefit.description}
                  </p>
                  
                  {/* Decoração */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-2 h-2 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção de Produtos em Destaque */}
      <FeaturedProducts />

      {/* Seção de Categorias */}
      <CategoriesSection />

      {/* Seção de Cupom de Desconto Redesenhada */}
      <section className="py-20 relative overflow-hidden">
        {/* Background Animado */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-white/5 bg-opacity-5" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
              <Gift size={20} />
              <span className="font-semibold text-sm uppercase tracking-wider">Oferta Especial</span>
            </div>
            
            {/* Título Principal */}
            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Desconto Exclusivo para
              <br />
              <span className="text-yellow-200">Novos Clientes</span>
            </h2>
            
            {/* Descrição */}
            <p className="text-xl text-amber-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Aproveite nossa promoção de boas-vindas e ganhe 
              <span className="font-bold text-yellow-200"> 15% OFF </span>
              na sua primeira compra! Use o cupom abaixo:
            </p>
            
            {/* Cupom Destacado */}
            <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20">
              <div className="text-3xl">🎁</div>
              <div className="text-left">
                <div className="text-sm text-amber-100 font-medium uppercase tracking-wider mb-1">Código do Cupom</div>
                <div className="text-3xl font-bold text-yellow-200 tracking-wider">PROMOFORIA15</div>
              </div>
              <button className="ml-4 bg-white/20 hover:bg-white/30 transition-colors rounded-lg px-4 py-2 text-sm font-medium">
                Copiar
              </button>
            </div>
            
            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href="/catalogo?promocao=true" 
                className="group inline-flex items-center gap-3 bg-white text-amber-600 hover:bg-amber-50 transition-all duration-300 rounded-2xl px-8 py-4 font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Zap size={24} />
                Ver Ofertas Exclusivas
                <div className="w-2 h-2 bg-amber-600 rounded-full group-hover:animate-pulse"></div>
              </a>
              <div className="text-amber-100 text-sm">
                *Válido apenas para primeira compra
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modal Redesenhado */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={modalContent === 'form' ? "🌟 Bem-vindo ao Promoforia!" : "✨ Inscrição Confirmada!"}
      >
        {modalContent === 'form' ? (
          <div className="text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                Junte-se ao nosso clube VIP!
              </h3>
              <p className="text-neutral-600 dark:text-neutral-300">
                Seja o primeiro a saber das melhores ofertas e promoções exclusivas.
              </p>
            </div>
            
            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="Seu melhor e-mail"
                  className="w-full p-4 border-2 border-neutral-200 dark:border-neutral-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-neutral-700 dark:text-white dark:placeholder-neutral-400 transition-all duration-300"
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Enviando...
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    <Gift size={20} />
                    Quero Receber Ofertas!
                  </span>
                )}
              </button>
            </form>
            
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-4">
              Ao se inscrever, você aceita receber e-mails promocionais. Pode cancelar a qualquer momento.
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-8"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
              Perfeito! Você está dentro!
            </h3>
            <p className="text-neutral-600 dark:text-neutral-300 mb-6">
              Agora você receberá as melhores ofertas e promoções exclusivas diretamente na sua caixa de entrada.
            </p>
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4">
              <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">
                🎁 Fique atento! Sua primeira oferta exclusiva chegará em breve!
              </p>
            </div>
          </motion.div>
        )}
      </Modal>
    </div>
  );
};

export default HomePage;