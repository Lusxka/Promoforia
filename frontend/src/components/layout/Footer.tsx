// src/components/layout/Footer.tsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Instagram, Facebook, Twitter, Youtube, Mail, Phone, MapPin, Send } from 'lucide-react'; // Adicionado Send icon

// Importe o logo claro do mesmo local que o Header
// VERIFIQUE SE ESTE CAMINHO ESTÁ CORRETO PARA SEU PROJETO
import logoClaro from './img/logo_branco.png'; // Certifique-se de ter o logo branco aqui

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  // Estado para os campos do formulário de comentário
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState(''); // Para mensagens de feedback ao usuário
  const [isLoading, setIsLoading] = useState(false); // Para desabilitar o botão durante o envio

  const handleSubmitComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Previne o reload da página

    if (!name || !email || !comment) {
      setMessage('Por favor, preencha todos os campos.');
      return;
    }

    setIsLoading(true); // Inicia o estado de carregamento
    setMessage(''); // Limpa mensagens anteriores

    try {
      // **CORREÇÃO:** Definir a URL base do backend.
      // Em desenvolvimento, geralmente é localhost:PORTA_DO_BACKEND.
      // Em produção, pode ser apenas uma string vazia (se o frontend/backend estiverem no mesmo servidor/proxy)
      // ou a URL completa do backend se estiverem separados.
      // Ajuste a porta 4000 se o seu backend roda em outra.
      const backendBaseUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:4000' // <-- AJUSTE ESTA PORTA SE NECESSÁRIO
        : ''; // Em produção, configure a URL base corretamente

      // Endpoint no seu backend para receber comentários usando a URL completa
      const response = await fetch(`${backendBaseUrl}/api/submit-comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, comment }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Comentário enviado com sucesso! Obrigado pela sua opinião.');
        // Limpa os campos do formulário após o envio bem-sucedido
        setName('');
        setEmail('');
        setComment('');
      } else {
        // Exibe a mensagem de erro do backend, se disponível, ou uma mensagem genérica
        setMessage(data.message || 'Ocorreu um erro ao enviar seu comentário.');
        console.error('Erro do backend:', data); // Logar o erro do backend para depuração
      }
    } catch (error) {
      console.error('Erro ao enviar comentário:', error);
      // Esta mensagem é exibida quando o frontend não consegue nem fazer a requisição (ex: servidor offline, URL incorreta)
      setMessage('Ocorreu um erro ao conectar com o servidor. Verifique se o backend está rodando e se a URL está correta.');
    } finally {
      setIsLoading(false); // Finaliza o estado de carregamento
    }
  };

  return (
    <footer className="bg-neutral-900 text-white pt-16 pb-8">
      <div className="container-custom">

        {/* Seção de Comentário - AGORA EM PRIMEIRO */}
        {/* Mantém a estrutura interna e o mx-auto para centralizar */}
        {/* Ajuste de padding/margin conforme necessário - mantendo original por enquanto */}
        {/* Removido border-t para que a borda fique ANTES da grade abaixo */}
        <div className="pt-8 pb-6 mb-6">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-lg font-semibold mb-2">Deixe seu Comentário</h3>
            <p className="text-neutral-400 mb-6">
              Sua opinião é muito importante para nós. Deixe um comentário sobre sua experiência.
            </p>
            <form onSubmit={handleSubmitComment} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="px-4 py-2 rounded-md bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-secondary-500"
                required // Adiciona validação HTML básica
              />
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-2 rounded-md bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-secondary-500"
                required // Adiciona validação HTML básica
              />
              <textarea
                placeholder="Seu comentário ou feedback"
                rows={4} // Define o número inicial de linhas visíveis
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="px-4 py-2 rounded-md bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-secondary-500 resize-y" // resize-y permite redimensionar verticalmente
                required // Adiciona validação HTML básica
              ></textarea>
              <button
                type="submit"
                className="button-secondary flex items-center justify-center" // Adiciona classes para centralizar conteúdo
                disabled={isLoading} // Desabilita o botão durante o envio
              >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l2.03-2.647z"></path>
                        </svg>
                        Enviando...
                    </>
                ) : (
                    <>
                        <Send size={20} className="mr-2" />
                        Enviar Comentário
                    </>
                )}
              </button>
            </form>
            {/* Exibe a mensagem de feedback */}
            {message && (
              <p className={`mt-4 text-sm ${message.includes('sucesso') ? 'text-green-500' : 'text-red-500'}`}>
                {message}
              </p>
            )}
          </div>
        </div>


        {/* GRID PRINCIPAL - AGORA DEPOIS DA SEÇÃO DE COMENTÁRIO */}
        {/* Adiciona borda no topo para separar da seção de comentário */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 border-t border-neutral-800 pt-8">
          {/* Logo e Sobre */}
          <div>
            <Link to="/" className="flex items-center mb-4">
              {/* Usando a logo branca importada */}
              <img src={logoClaro} alt="Promoforia Logo" className="h-[72px] w-auto" /> {/* Ajuste o tamanho conforme necessário */}
            </Link>
            <p className="text-neutral-400 mb-4">
              Sua plataforma de compras online com os melhores produtos e ofertas exclusivas para você.
            </p>
            <div className="flex space-x-4">
              {/* Links sociais (remover '#' em produção ou usar URLs reais) */}
              <a href="#" className="text-neutral-400 hover:text-secondary-500 transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-secondary-500 transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-secondary-500 transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-secondary-500 transition-colors" aria-label="Youtube">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-neutral-400 hover:text-secondary-500 transition-colors">
                  Página Inicial
                </Link>
              </li>
              <li>
                <Link to="/catalogo" className="text-neutral-400 hover:text-secondary-500 transition-colors">
                  Catálogo de Produtos
                </Link>
              </li>
              <li>
                <Link to="/favoritos" className="text-neutral-400 hover:text-secondary-500 transition-colors">
                  Meus Favoritos
                </Link>
              </li>
              <li>
                <Link to="/carrinho" className="text-neutral-400 hover:text-secondary-500 transition-colors">
                  Carrinho de Compras
                </Link>
              </li>
            </ul>
          </div>

          {/* Categorias */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categorias</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/catalogo?categoria=eletronicos" className="text-neutral-400 hover:text-secondary-500 transition-colors">
                  Eletrônicos
                </Link>
              </li>
              <li>
                <Link to="/catalogo?categoria=moda" className="text-neutral-400 hover:text-secondary-500 transition-colors">
                  Moda
                </Link>
              </li>
              <li>
                <Link to="/catalogo?categoria=casa" className="text-neutral-400 hover:text-secondary-500 transition-colors">
                  Casa e Decoração
                </Link>
              </li>
              <li>
                <Link to="/catalogo?categoria=beleza" className="text-neutral-400 hover:text-secondary-500 transition-colors">
                  Beleza
                </Link>
              </li>
              <li>
                <Link to="/catalogo?categoria=esportes" className="text-neutral-400 hover:text-secondary-500 transition-colors">
                  Esportes
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={18} className="text-secondary-500 mr-2 mt-1 flex-shrink-0" />
                <span className="text-neutral-400">Av. Paulista, 1000 - São Paulo, SP</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="text-secondary-500 mr-2 flex-shrink-0" />
                <span className="text-neutral-400">(11) 99999-9999</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="text-secondary-500 mr-2 flex-shrink-0" />
                <span className="text-neutral-400">suportwebcash@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-neutral-800 pt-6 text-center text-neutral-500 text-sm">
          <p>
            &copy; {currentYear} Promoforia | Todos os direitos reservados. Plataforma de Marketing de Afiliados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;