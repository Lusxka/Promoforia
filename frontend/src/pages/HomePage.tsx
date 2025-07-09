// frontend/src/pages/HomePage.tsx

// ✅ CORRIGIDO: Use 'from' em vez de '=>' ✅
import React, { useState, useEffect } from 'react';
import HeroSection from '../components/home/HeroSection';
import FeaturedProducts from '../components/home/FeaturedProducts';
import CategoriesSection from '../components/home/CategoriesSection';
import Modal from '../components/home/Modal';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, Headphones, RefreshCw, CheckCircle } from 'lucide-react'; // ✅ Importe CheckCircle ou outro ícone de sucesso ✅

const HomePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // ✅ Novo estado para controlar o conteúdo do modal: 'form' ou 'success' ✅
  const [modalContent, setModalContent] = useState<'form' | 'success'>('form');


  useEffect(() => {
    const timer = setTimeout(() => {
      const hasSeenModal = localStorage.getItem('hasSeenNewsletterModal');
      if (!hasSeenModal) {
         setIsModalOpen(true);
         setModalContent('form'); // Garante que o conteúdo inicial é o formulário
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    localStorage.setItem('hasSeenNewsletterModal', 'true');
    // ✅ Resetar o conteúdo para 'form' quando o modal fechar completamente,
    // para que o formulário apareça se ele for aberto novamente manualmente
    // (embora neste caso ele só abra uma vez via useEffect) ✅
    // Uma pequena demora pode ser útil para a animação de saída
    setTimeout(() => setModalContent('form'), 10000); // Ajuste o delay conforme a animação de saída do modal
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
        ? 'https://sua-api-em-producao.com/api/newsletter-subscribe' // <<< SUBSTITUA PELA URL DA SUA API EM PRODUÇÃO
        : 'http://localhost:4000/api/newsletter-subscribe'; // <<< Use a porta que seu back-end está rodando localmente

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
        // ✅ Em vez de alert(), mude o conteúdo do modal para sucesso ✅
        setModalContent('success');
        // Opcional: Fechar a modal automaticamente após alguns segundos na tela de sucesso
        setTimeout(() => {
            handleCloseModal();
        }, 5000); // Fecha após 5 segundos exibindo a mensagem de sucesso

      } else {
        console.error('Erro na submissão:', data.message);
        alert(`Não foi possível processar sua inscrição: ${data.message || 'Erro desconhecido'}`);
        // Em caso de erro, geralmente o formulário permanece
      }

    } catch (error) {
      console.error('Erro ao enviar a requisição para o back-end:', error);
      alert('Ocorreu um erro ao tentar se inscrever. Por favor, tente novamente.');
      // Em caso de erro, geralmente o formulário permanece
    } finally {
      setIsSubmitting(false);
      // Não limpamos o campo de email em caso de erro, apenas sucesso.
      // if(emailInput && modalContent === 'success') emailInput.value = ''; // Isso não é necessário se o modal fechar
    }
  };


  return (
    <div>
       <HeroSection />
       <section className="py-10 bg-neutral-50">
         <div className="container-custom">
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
             <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0 }} className="flex items-start p-4">
               <div className="p-2 rounded-full bg-primary-100 text-primary-600 mr-4"><Truck size={24} /></div>
               <div><h3 className="font-medium text-neutral-800 mb-1">Entrega Rápida</h3><p className="text-sm text-neutral-600">Receba seus produtos em casa com rapidez e segurança</p></div>
             </motion.div>
             <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} className="flex items-start p-4">
               <div className="p-2 rounded-full bg-primary-100 text-primary-600 mr-4"><ShieldCheck size={24} /></div>
               <div><h3 className="font-medium text-neutral-800 mb-1">Compra Segura</h3><p className="text-sm text-neutral-600">Transações protegidas e dados criptografados</p></div>
             </motion.div>
             <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} className="flex items-start p-4">
               <div className="p-2 rounded-full bg-primary-100 text-primary-600 mr-4"><RefreshCw size={24} /></div>
               <div><h3 className="font-medium text-neutral-800 mb-1">Devolução Gratuita</h3><p className="text-sm text-neutral-600">30 dias para troca ou devolução sem custos</p></div>
             </motion.div>
             <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }} className="flex items-start p-4">
               <div className="p-2 rounded-full bg-primary-100 text-primary-600 mr-4"><Headphones size={24} /></div>
               <div><h3 className="font-medium text-neutral-800 mb-1">Suporte 24/7</h3><p className="text-sm text-neutral-600">Atendimento exclusivo para nossos clientes</p></div>
             </motion.div>
           </div>
         </div>
       </section>
       <FeaturedProducts />
       <CategoriesSection />

       {/* Container do Cupom de Desconto (opcional) ⬇ */}
       {/* <section className="py-16 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 text-white">
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
       </section> */}


      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        // O título pode mudar dependendo do conteúdo
        title={modalContent === 'form' ? "Bem Vindo ao Promoforia ! Seja um seguidor" : "Inscrição Confirmada!"}
      >
        {/* ✅ Conteúdo do Modal Condicional: Formulário OU Mensagem de Sucesso ✅ */}
        {modalContent === 'form' ? (
          // Conteúdo do Formulário
          <div className="text-center">
            <p className="text-neutral-600 mb-6">
              Receba as melhores ofertas e novidades diretamente no seu e-mail.
            </p>
            <form onSubmit={handleNewsletterSubmit}>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  name="email"
                  placeholder="Seu melhor e-mail"
                  className="flex-1 p-3 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  className="button-primary px-6 py-3"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Enviando...' : 'Inscrever-se'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          // Conteúdo de Sucesso
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-8" // Adiciona padding vertical
          >
            <CheckCircle size={48} className="text-success-500 mx-auto mb-4" /> {/* Ícone de sucesso */}
            <h3 className="text-2xl font-bold text-neutral-900 mb-3">Obrigado por se inscrever!</h3>
            <p className="text-neutral-600">
              Você agora receberá as melhores ofertas diretamente na sua caixa de entrada.
            </p>
          </motion.div>
        )}
      </Modal>

    </div>
  );
};

export default HomePage;