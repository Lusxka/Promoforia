import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Instagram, Facebook, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-neutral-900 text-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo e Sobre */}
          <div>
            <Link to="/" className="flex items-center mb-4">
              <ShoppingBag size={28} className="text-secondary-500 mr-2" />
              <span className="text-xl font-bold text-white">WebCash</span>
            </Link>
            <p className="text-neutral-400 mb-4">
              Sua plataforma de compras online com os melhores produtos e ofertas exclusivas para você.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-secondary-500 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-secondary-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-secondary-500 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-secondary-500 transition-colors">
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
                <span className="text-neutral-400">contato@webcash.com.br</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-neutral-800 pt-8 pb-6 mb-6">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-lg font-semibold mb-2">Inscreva-se em nossa newsletter</h3>
            <p className="text-neutral-400 mb-4">
              Receba as melhores ofertas e novidades diretamente no seu e-mail.
            </p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                className="flex-grow px-4 py-2 rounded-md bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-secondary-500"
              />
              <button className="button-secondary whitespace-nowrap">
                Inscrever-se
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-neutral-800 pt-6 text-center text-neutral-500 text-sm">
          <p>
            &copy; {currentYear} WebCash. Todos os direitos reservados. Plataforma de Marketing de Afiliados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;