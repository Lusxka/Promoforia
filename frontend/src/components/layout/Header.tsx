// src/components/layout/Header.tsx

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, ShoppingCart, Flame } from 'lucide-react'; // Certifique-se que 'Flame' está importado
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import ThemeToggle from '../common/ThemeToggle';
import logoClaro from './img/logo_branco.png';
import logoEscuro from './img/logo_preto.png';

const headerCategories = [
  { name: 'Relâmpago', path: '/categorias/relampago' },
  { name: 'Ofertas', path: '/categorias/ofertas' },
  { name: 'Menos de R$100', path: '/categorias/menos-de-100' },
  { name: 'Compra do Mês', path: '/categorias/compra-do-mes' },
  { name: 'Moda', path: '/categorias/moda' },
];

type ToastData =
  | { context: 'cart' | 'wishlist'; action: 'added' | 'removed' }
  | null;

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<ToastData>(null);

  const { getCartCount } = useCart();
  const { wishlist } = useWishlist();

  const location = useLocation();
  const navigate = useNavigate();

  const [prevCartCount, setPrevCartCount] = useState<number | null>(null);
  const [prevWishlistCount, setPrevWishlistCount] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setIsMobileMenuOpen(false), [location.pathname]);

  const cartCount = getCartCount();
  useEffect(() => {
    if (prevCartCount !== null && cartCount !== prevCartCount) {
      setToast({ context: 'cart', action: cartCount > prevCartCount ? 'added' : 'removed' });
      setTimeout(() => setToast(null), 3000);
    }
    setPrevCartCount(cartCount);
  }, [cartCount, prevCartCount]);

  const wishlistCount = wishlist.length;
  useEffect(() => {
    if (prevWishlistCount !== null && wishlistCount !== prevWishlistCount) {
      setToast({
        context: 'wishlist',
        action: wishlistCount > prevWishlistCount ? 'added' : 'removed',
      });
      setTimeout(() => setToast(null), 3000);
    }
    setPrevWishlistCount(wishlistCount);
  }, [wishlistCount, prevWishlistCount]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalogo?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      if (isMobileMenuOpen) setIsMobileMenuOpen(false);
    }
  };

  const useDark = isScrolled || location.pathname !== '/';
  const textColor = useDark ? 'text-neutral-700 dark:text-neutral-200' : 'text-white';
  const iconColor = useDark ? 'text-neutral-700 dark:text-neutral-200' : 'text-white';
  const hoverText = useDark
    ? 'hover:text-primary-600 dark:hover:text-primary-400'
    : 'hover:text-neutral-300';

  const renderToast = () => {
    if (!toast) return null;
    const isAdd = toast.action === 'added';
    const bgColor = isAdd ? 'bg-green-600' : 'bg-red-600';
    const message =
      toast.context === 'cart'
        ? isAdd
          ? 'Adicionado ao carrinho!'
          : 'Removido do carrinho!'
        : isAdd
          ? 'Adicionado aos favoritos!'
          : 'Removido dos favoritos!';
    const Icon = toast.context === 'cart' ? ShoppingCart : Flame; // Ícone de 'Flame' para favoritos no toast
    return (
      <div
        className={`fixed top-4 right-4 ${bgColor} text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2 animate-toast z-[9999]`}
      >
        <Icon size={16} />
        <span className="text-sm font-medium">{message}</span>
      </div>
    );
  };

  return (
    <>
      {renderToast()}

      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          useDark ? 'bg-white dark:bg-neutral-900 shadow-md py-2' : 'bg-transparent py-4'
        }`}
      >
        <div className="container-custom flex items-center justify-between">
          <Link to="/" className="flex items-center ml-4">
            <img
              src={useDark ? logoEscuro : logoClaro}
              alt="Promoforia Logo"
              className="h-[72px] w-auto transition-opacity duration-300"
            />
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className={`${textColor} ${hoverText} font-medium transition-colors`}>
              Início
            </Link>
            <Link
              to="/catalogo"
              className={`${textColor} ${hoverText} font-medium transition-colors`}
            >
              Promo Day
            </Link>

            <div className="group relative">
              <button className={`${textColor} ${hoverText} font-medium flex items-center`}>
                Categorias
              </button>
              <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-neutral-800 rounded-md shadow-lg overflow-hidden z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                {headerCategories.map((c) => (
                  <Link
                    key={c.name}
                    to={c.path}
                    className="block px-4 py-3 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {c.name}
                  </Link>
                ))}
                <Link
                  to="/catalogo"
                  className="block px-4 py-3 text-sm font-medium text-primary-600 dark:text-primary-400 bg-neutral-50 dark:bg-neutral-700 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-700 dark:hover:text-primary-300 transition-colors border-t border-neutral-200 dark:border-neutral-600"
                >
                  Ver Todos os Produtos
                </Link>
              </div>
            </div>
          </nav>

          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex relative mx-4 flex-grow max-w-md"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar produtos..."
              className="w-full px-4 py-2 rounded-full border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500 text-neutral-700 dark:text-neutral-200 placeholder-neutral-500 dark:placeholder-neutral-400"
            />
            <button
              type="submit"
              className={`absolute right-3 top-1/2 -translate-y-1/2 ${iconColor} ${hoverText}`}
            >
              <Search size={18} />
            </button>
          </form>

          {/* ---------- Ícones desktop ---------- */}
          <div className="hidden md:flex items-center space-x-2">
            <ThemeToggle className={`${iconColor} ${hoverText}`} />

            <Link to="/favoritos" className={`relative p-2 ${iconColor} ${hoverText}`}>
              <Flame size={22} />
              {wishlistCount > 0 && (
                // ALTERADO: Bolinha de favoritos AGORA VERMELHA
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link to="/carrinho" className={`relative p-2 ${iconColor} ${hoverText}`}>
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                // REVERTIDO: Bolinha do carrinho permanece AMARELA (secondary-500)
                <span className="absolute -top-1 -right-1 bg-secondary-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* ---------- Ícones mobile ---------- */}
          <div className="flex md:hidden items-center space-x-1">
            <ThemeToggle className={`${iconColor} ${hoverText}`} />

            <Link to="/carrinho" className={`relative p-2 ${iconColor} ${hoverText}`}>
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                // REVERTIDO: Bolinha do carrinho mobile permanece AMARELA (secondary-500)
                <span className="absolute -top-1 -right-1 bg-secondary-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={toggleMobileMenu}
              className={`p-2 ${iconColor} focus:outline-none transition-colors`}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* ---------- Menu mobile ---------- */}
        <div
          className={`md:hidden bg-white dark:bg-neutral-900 absolute w-full shadow-md transition-all duration-300 ${
            isMobileMenuOpen ? 'opacity-100 visible max-h-screen' : 'opacity-0 invisible max-h-0'
          } overflow-hidden`}
        >
          <div className="container-custom py-4 flex flex-col space-y-4">
            <form onSubmit={handleSearchSubmit} className="flex relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar produtos..."
                className="w-full px-4 py-2 rounded-full border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-300 text-neutral-700 dark:text-neutral-200 placeholder-neutral-500 dark:placeholder-400"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
              >
                <Search size={18} />
              </button>
            </form>

            <nav className="flex flex-col space-y-1">
              <Link
                to="/"
                className="text-neutral-700 dark:text-neutral-200 py-3 border-b border-neutral-100 dark:border-neutral-700 text-base hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                onClick={toggleMobileMenu}
              >
                Início
              </Link>
              <Link
                to="/catalogo"
                className="text-neutral-700 dark:text-neutral-200 py-3 border-b border-neutral-100 dark:border-neutral-700 text-base hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                onClick={toggleMobileMenu}
              >
                Promo Day
              </Link>
              {headerCategories.map((c) => (
                <Link
                  key={c.name}
                  to={c.path}
                  className="pl-4 text-neutral-700 dark:text-neutral-200 py-3 border-b border-neutral-100 dark:border-neutral-700 text-base hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  onClick={toggleMobileMenu}
                >
                  {c.name}
                </Link>
              ))}
              <Link
                to="/favoritos"
                className="text-neutral-700 dark:text-neutral-200 py-3 border-b border-neutral-100 dark:border-neutral-700 text-base hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                onClick={toggleMobileMenu}
              >
                Favoritos ({wishlistCount})
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Animação toast */}
      <style>{`
        @keyframes toast {
          0% {
            opacity: 0;
            transform: translateX(100%) scale(0.95);
          }
          15% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
          85% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateX(100%) scale(0.95);
          }
        }
        .animate-toast {
          animation: toast 3s ease-in-out forwards;
        }
      `}</style>
    </>
  );
};

export default Header;