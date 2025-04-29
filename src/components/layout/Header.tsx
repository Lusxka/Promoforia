import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Heart, Search, Menu, X, ShoppingBag } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { getCartCount } = useCart();
  const { wishlist } = useWishlist();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Fechar menu mobile quando a rota mudar
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirecionar para página de busca
      window.location.href = `/catalogo?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container-custom flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <ShoppingBag size={28} className="text-primary-600 mr-2" />
          <span className="text-xl font-bold text-primary-800">WebCash</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-neutral-700 hover:text-primary-600 font-medium">
            Início
          </Link>
          <Link to="/catalogo" className="text-neutral-700 hover:text-primary-600 font-medium">
            Produtos
          </Link>
          <div className="group relative">
            <button className="text-neutral-700 hover:text-primary-600 font-medium flex items-center">
              Categorias
            </button>
            <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
              <Link to="/catalogo?categoria=eletronicos" className="block px-4 py-2 text-neutral-700 hover:bg-primary-50 hover:text-primary-600">
                Eletrônicos
              </Link>
              <Link to="/catalogo?categoria=moda" className="block px-4 py-2 text-neutral-700 hover:bg-primary-50 hover:text-primary-600">
                Moda
              </Link>
              <Link to="/catalogo?categoria=casa" className="block px-4 py-2 text-neutral-700 hover:bg-primary-50 hover:text-primary-600">
                Casa e Decoração
              </Link>
              <Link to="/catalogo?categoria=beleza" className="block px-4 py-2 text-neutral-700 hover:bg-primary-50 hover:text-primary-600">
                Beleza
              </Link>
              <Link to="/catalogo?categoria=esportes" className="block px-4 py-2 text-neutral-700 hover:bg-primary-50 hover:text-primary-600">
                Esportes
              </Link>
            </div>
          </div>
        </nav>

        {/* Search Form Desktop */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex relative mx-4 flex-grow max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar produtos..."
            className="w-full px-4 py-2 rounded-full border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
          />
          <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-primary-600">
            <Search size={18} />
          </button>
        </form>

        {/* Desktop Icons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/favoritos" className="relative p-2 text-neutral-700 hover:text-primary-600 transition-colors">
            <Heart size={22} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-secondary-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {wishlist.length}
              </span>
            )}
          </Link>
          <Link to="/carrinho" className="relative p-2 text-neutral-700 hover:text-primary-600 transition-colors">
            <ShoppingCart size={22} />
            {getCartCount() > 0 && (
              <span className="absolute -top-1 -right-1 bg-secondary-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {getCartCount()}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center space-x-3">
          <Link to="/carrinho" className="relative p-2 text-neutral-700">
            <ShoppingCart size={20} />
            {getCartCount() > 0 && (
              <span className="absolute -top-1 -right-1 bg-secondary-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {getCartCount()}
              </span>
            )}
          </Link>
          <button
            onClick={toggleMobileMenu}
            className="p-2 text-neutral-700 focus:outline-none"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white absolute w-full shadow-md transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100 visible max-h-screen' : 'opacity-0 invisible max-h-0'
        } overflow-hidden`}
      >
        <div className="container-custom py-4 flex flex-col space-y-4">
          {/* Search Form Mobile */}
          <form onSubmit={handleSearchSubmit} className="flex relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar produtos..."
              className="w-full px-4 py-2 rounded-full border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
            <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500">
              <Search size={18} />
            </button>
          </form>

          {/* Mobile Navigation */}
          <nav className="flex flex-col space-y-3">
            <Link to="/" className="text-neutral-700 py-2 border-b border-neutral-100">
              Início
            </Link>
            <Link to="/catalogo" className="text-neutral-700 py-2 border-b border-neutral-100">
              Produtos
            </Link>
            <Link to="/catalogo?categoria=eletronicos" className="text-neutral-700 py-2 border-b border-neutral-100 pl-4">
              Eletrônicos
            </Link>
            <Link to="/catalogo?categoria=moda" className="text-neutral-700 py-2 border-b border-neutral-100 pl-4">
              Moda
            </Link>
            <Link to="/catalogo?categoria=casa" className="text-neutral-700 py-2 border-b border-neutral-100 pl-4">
              Casa e Decoração
            </Link>
            <Link to="/catalogo?categoria=beleza" className="text-neutral-700 py-2 border-b border-neutral-100 pl-4">
              Beleza
            </Link>
            <Link to="/catalogo?categoria=esportes" className="text-neutral-700 py-2 border-b border-neutral-100 pl-4">
              Esportes
            </Link>
            <Link to="/favoritos" className="text-neutral-700 py-2 border-b border-neutral-100">
              Favoritos ({wishlist.length})
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;