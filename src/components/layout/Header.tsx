import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Heart, Search, Menu, X } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';

// IMPORTAR SUAS IMAGENS DE LOGO AQUI
// >>>>>> VERIFIQUE CUIDADOSAMENTE ESTES CAMINHOS <<<<<<
// Assumindo que Header.tsx está em `src/components/layout/`, os caminhos relativos são estes:
import logoClaro from './img/logo_branco.png'; // Logo para fundo transparente/escuro (Home topo)
import logoEscuro from './img/logo_preto.png';  // Logo para fundo branco (rolado ou outras páginas)
// Se Header.tsx estiver em outro lugar, ajuste o caminho relativo (`./img/...` ou `../layout/img/...`)

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { getCartCount } = useCart();
  const { wishlist } = useWishlist();
  const location = useLocation();

  // Define se a página atual é a Home
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      // Verifica se rolou mais de 10px
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuMenuOpen(false);
  }, [location.pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuMenuOpen(!isMobileMenuOpen);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/catalogo?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  // --- Lógica para CORES dos OUTROS elementos (links, ícones) - JÁ ESTAVA OK ---
  const useDarkColorsForOtherElements = isScrolled || !isHomePage;
  const textColorClass = useDarkColorsForOtherElements ? 'text-neutral-700' : 'text-white';
   const iconColorClass = useDarkColorsForOtherElements ? 'text-neutral-700' : 'text-white';
   const hoverTextColorClass = !useDarkColorsForOtherElements ? 'hover:text-neutral-300' : 'hover:text-primary-600';
  // --------------------------------------------------------------------

  // --- Lógica para qual IMAGEM de Logo usar - JÁ ESTAVA OK ---
  const useDarkLogoImage = isScrolled || !isHomePage;
  // ------------------------------------------


  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container-custom flex items-center justify-between">
        {/* Logo com Imagem Dinâmica */}
        {/* ml-4 mantém o afastamento da esquerda. Ajuste este valor se precisar. */}
        <Link to="/" className="flex items-center ml-4">
          {useDarkLogoImage ? (
            // Renderiza a imagem do logo escuro
            <img
              src={logoEscuro} // Use a variável importada
              alt="Promoforia Logo"
              // >>>>>> VERSÃO 2: Tamanho h-[72px] <<<<<<
              className="h-[72px] w-auto transition-opacity duration-300" // <-- h-14 mudado para h-[72px]
            />
          ) : (
            // Renderiza a imagem do logo claro
            <img
              src={logoClaro} // Use a variável importada
              alt="Promoforia Logo"
               // >>>>>> VERSÃO 2: Tamanho h-[72px] <<<<<<
              className="h-[72px] w-auto transition-opacity duration-300" // <-- h-14 mudado para h-[72px]
            />
          )}
        </Link>

        {/* Desktop Navigation - USA AS CORES DINÂMICAS */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className={`${textColorClass} ${hoverTextColorClass} font-medium`}>
            Início
          </Link>
          <Link to="/catalogo" className={`${textColorClass} ${hoverTextColorClass} font-medium`}>
            Produtos
          </Link>
          <div className="group relative">
            <button className={`${textColorClass} ${hoverTextColorClass} font-medium flex items-center`}>
              Categorias
            </button>
            {/* Dropdown permanece fixo */}
            <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
              <Link to="/catalogo?categoria=eletronicos" className="block px-4 py-2 text-neutral-700 hover:bg-primary-50 hover:text-primary-600">Eletrônicos</Link>
              <Link to="/catalogo?categoria=moda" className="block px-4 py-2 text-neutral-700 hover:bg-primary-50 hover:text-primary-600">Moda</Link>
              <Link to="/catalogo?categoria=casa" className="block px-4 py-2 text-neutral-700 hover:bg-primary-50 hover:text-primary-600">Casa e Decoração</Link>
              <Link to="/catalogo?categoria=beleza" className="block px-4 py-2 text-neutral-700 hover:bg-primary-50 hover:text-primary-600">Beleza</Link>
              <Link to="/catalogo?categoria=esportes" className="block px-4 py-2 text-neutral-700 hover:bg-primary-50 hover:text-primary-600">Esportes</Link>
            </div>
          </div>
        </nav>

        {/* Search Form Desktop - Input fixo, ícone dinâmico */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex relative mx-4 flex-grow max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar produtos..."
            className="w-full px-4 py-2 rounded-full border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500 text-neutral-700"
          />
          <button type="submit" className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${iconColorClass} ${hoverTextColorClass}`}>
            <Search size={18} />
          </button>
        </form>

        {/* Desktop Icons - USAM CORES DINÂMICAS */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/favoritos" className={`relative p-2 ${iconColorClass} ${hoverTextColorClass} transition-colors`}>
            <Heart size={22} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-secondary-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {wishlist.length}
              </span>
            )}
          </Link>
          <Link to="/carrinho" className={`relative p-2 ${iconColorClass} ${hoverTextColorClass} transition-colors`}>
            <ShoppingCart size={22} />
            {getCartCount() > 0 && (
              <span className="absolute -top-1 -right-1 bg-secondary-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {getCartCount()}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Menu Button - USA COR DINÂMICA */}
        <div className="flex md:hidden items-center space-x-3">
          <Link to="/carrinho" className={`relative p-2 ${iconColorClass}`}>
            <ShoppingCart size={20} />
            {getCartCount() > 0 && (
              <span className="absolute -top-1 -right-1 bg-secondary-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {getCartCount()}
              </span>
            )}
          </Link>
          <button
            onClick={toggleMobileMenu}
            className={`p-2 ${iconColorClass} focus:outline-none`}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Permanece fixo */}
      <div
        className={`md:hidden bg-white absolute w-full shadow-md transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100 visible max-h-screen' : 'opacity-0 invisible max-h-0'
        } overflow-hidden`}
      >
        <div className="container-custom py-4 flex flex-col space-y-4">
           {/* Search Form Mobile - Input fixo, ícone fixo */}
           <form onSubmit={handleSearchSubmit} className="flex relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar produtos..."
              className="w-full px-4 py-2 rounded-full border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-300 text-neutral-700"
            />
            <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500">
              <Search size={18} />
            </button>
          </form>

          {/* Mobile Navigation - Links fixos */}
          <nav className="flex flex-col space-y-3">
            <Link to="/" className="text-neutral-700 py-2 border-b border-neutral-100">Início</Link>
            <Link to="/catalogo" className="text-neutral-700 py-2 border-b border-neutral-100">Produtos</Link>
            <Link to="/catalogo?categoria=eletronicos" className="text-neutral-700 py-2 border-b border-neutral-100 pl-4">Eletrônicos</Link>
            <Link to="/catalogo?categoria=moda" className="text-neutral-700 py-2 border-b border-neutral-100 pl-4">Moda</Link>
            <Link to="/catalogo?categoria=casa" className="text-neutral-700 py-2 border-b border-neutral-100 pl-4">Casa e Decoração</Link>
            <Link to="/catalogo?categoria=beleza" className="text-neutral-700 py-2 border-b border-neutral-100 pl-4">Beleza</Link>
            <Link to="/catalogo?categoria=esportes" className="text-neutral-700 py-2 border-b border-neutral-100 pl-4">Esportes</Link>
            <Link to="/favoritos" className="text-neutral-700 py-2 border-b border-neutral-100">Favoritos ({wishlist.length})</Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;