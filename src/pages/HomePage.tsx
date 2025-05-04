import React, { useState, useEffect } from 'react'; // Importe useState e useEffect
import HeroSection from '../components/home/HeroSection';
import FeaturedProducts from '../components/home/FeaturedProducts';
import CategoriesSection from '../components/home/CategoriesSection';
import Modal from '../components/Modal'; // Importe o componente Modal que você criou
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, Headphones, RefreshCw } from 'lucide-react';

const HomePage: React.FC = () => {
  // 1. Estado para controlar a visibilidade do modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 2. useEffect para exibir o modal ao carregar a página
  useEffect(() => {
    // Adicione um pequeno delay (ex: 2 segundos) para melhor UX
    const timer = setTimeout(() => {
      // ✅ Lógica para mostrar o modal apenas uma vez por sessão/visita ✅
      // Verifica se o usuário já viu o modal antes (usando localStorage)
      const hasSeenModal = localStorage.getItem('hasSeenNewsletterModal');
      if (!hasSeenModal) {
         setIsModalOpen(true); // Define o estado para true para abrir o modal
      }
    }, 2000); // Atraso de 2000ms (2 segundos)

    // Função de limpeza: cancela o timer se o componente for desmontado antes de disparar
    return () => clearTimeout(timer);

  }, []); // O array de dependências vazio [] garante que este useEffect rode apenas uma vez ao montar

  // 3. Função para fechar o modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    // ✅ Salva no localStorage que o usuário viu o modal ao fechá-lo ✅
    localStorage.setItem('hasSeenNewsletterModal', 'true');
  };

  // 4. Lógica placeholder para o envio do formulário de newsletter
  const handleNewsletterSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // TODO: Implementar a lógica real de envio do email para o seu serviço de newsletter
    console.log("Formulário de newsletter enviado!");

    // Aqui você faria a chamada para sua API ou serviço de email.
    // Após o sucesso (ou falha tratada), você geralmente fecharia o modal.
    alert("Obrigado por se inscrever!"); // Mensagem de sucesso temporária
    handleCloseModal(); // Fecha o modal após a submissão (ou tentativa)
  };


  return (
    <div>
      {/* Conteúdo normal da sua página */}
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

      {/* ✅ 5. Renderizando o Componente Modal ✅ */}
      <Modal
        isOpen={isModalOpen} // Passa o estado de abertura
        onClose={handleCloseModal} // Passa a função para fechar
        title="Inscreva-se em nossa Newsletter" // Título do modal
      >
        {/* ✅ 6. Conteúdo do Formulário de Newsletter (baseado na sua imagem) ✅ */}
        <div className="text-center">
          <p className="text-neutral-600 mb-6">
            Receba as melhores ofertas e novidades diretamente no seu e-mail.
          </p>
          <form onSubmit={handleNewsletterSubmit}> {/* Chama a função ao enviar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                className="flex-1 p-3 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                required // Torna o campo obrigatório
              />
              <button
                type="submit"
                className="button-primary px-6 py-3" // Suas classes de botão
              >
                Inscrever-se
              </button>
            </div>
          </form>
        </div>
      </Modal>

    </div>
  );
};

export default HomePage;