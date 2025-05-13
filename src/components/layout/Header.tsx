// Update the imports section to include ThemeToggle
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import ThemeToggle from '../common/ThemeToggle';
import logoClaro from './img/logo_branco.png';
import logoEscuro from './img/logo_preto.png';

const headerCategories = [
    { name: "Relâmpago", path: "/categorias/relampago" },
    { name: "Ofertas", path: "/categorias/ofertas" },
    { name: "Menos de R$100", path: "/categorias/menos-de-100" },
    { name: "Compra do Mês", path: "/categorias/compra-do-mes" },
    { name: "Moda", path: "/categorias/moda" },
];

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { getCartCount } = useCart();
  const { wishlist } = useWishlist();

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalogo?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      if (isMobileMenuOpen) setIsMobileMenuOpen(false);
    }
  };

  const useDarkColorsForOtherElements = isScrolled || location.pathname !== '/';
  const textColorClass = useDarkColorsForOtherElements ? 'text-neutral-700' : 'text-white';
  const iconColorClass = useDarkColorsForOtherElements ? 'text-neutral-700' : 'text-white';
  const hoverTextColorClass = !useDarkColorsForOtherElements ? 'hover:text-neutral-300' : 'hover:text-primary-600';
  const useDarkLogoImage = isScrolled || location.pathname !== '/';

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${useDarkColorsForOtherElements ? 'bg-white dark:bg-neutral-900 shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container-custom flex items-center justify-between">
        <Link to="/" className="flex items-center ml-4">
          <img src={useDarkLogoImage ? logoEscuro : logoClaro} alt="Promoforia Logo" className="h-[72px] w-auto transition-opacity duration-300" />
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className={`${textColorClass} ${hoverTextColorClass} font-medium`}>Início</Link>
          <Link to="/catalogo" className={`${textColorClass} ${hoverTextColorClass} font-medium`}>Produtos</Link>

          <div className="group relative">
            <button className={`${textColorClass} ${hoverTextColorClass} font-medium flex items-center`}>
              Categorias
            </button>
            <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg overflow-hidden z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
              {headerCategories.map(category => (
                <Link
                  key={category.name}
                  to={category.path}
                  className="block px-4 py-3 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                >
                  {category.name}
                </Link>
              ))}
              <Link
                  to="/catalogo"
                  className="block px-4 py-3 text-sm font-medium text-primary-600 bg-neutral-50 hover:bg-primary-50 hover:text-primary-700 transition-colors border-t border-neutral-200"
                >
                  Ver Todos os Produtos
                </Link>
            </div>
          </div>
        </nav>

        <form onSubmit={handleSearchSubmit} className="hidden md:flex relative mx-4 flex-grow max-w-md">
           <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Buscar produtos..." className="w-full px-4 py-2 rounded-full border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500 text-neutral-700"/>
           <button type="submit" className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${iconColorClass} ${hoverTextColorClass}`}> <Search size={18} /> </button>
        </form>

        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
          <Link to="/favoritos" className={`relative p-2 ${iconColorClass} ${hoverTextColorClass} transition-colors`}>
            <Heart size={22} />
            {wishlist.length > 0 && <span className="absolute -top-1 -right-1 bg-secondary-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">{wishlist.length}</span>}
          </Link>
          <Link to="/carrinho" className={`relative p-2 ${iconColorClass} ${hoverTextColorClass} transition-colors`}>
            <ShoppingCart size={22} />
            {getCartCount() > 0 && <span className="absolute -top-1 -right-1 bg-secondary-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">{getCartCount()}</span>}
          </Link>
        </div>

        <div className="flex md:hidden items-center space-x-3">
          <ThemeToggle />
          <Link to="/carrinho" className={`relative p-2 ${iconColorClass} ${hoverTextColorClass} transition-colors`}>
            <ShoppingCart size={24} />
            {getCartCount() > 0 && <span className="absolute -top-1 -right-1 bg-secondary-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">{getCartCount()}</span>}
          </Link>
          <button onClick={toggleMobileMenu} className={`p-2 ${iconColorClass} focus:outline-none`}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div className={`md:hidden bg-white absolute w-full shadow-md transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 visible max-h-screen' : 'opacity-0 invisible max-h-0'} overflow-hidden`}>
        <div className="container-custom py-4 flex flex-col space-y-4">
            <form onSubmit={handleSearchSubmit} className="flex relative">
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Buscar produtos..." className="w-full px-4 py-2 rounded-full border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-300 text-neutral-700"/>
                <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500"> <Search size={18} /> </button>
            </form>

            <nav className="flex flex-col space-y-1">
              <>
                <Link to="/" className="text-neutral-700 py-3 border-b border-neutral-100 text-base" onClick={toggleMobileMenu}>Início</Link>
                <Link to="/catalogo" className="text-neutral-700 py-3 border-b border-neutral-100 text-base" onClick={toggleMobileMenu}>Todos os Produtos</Link>
                {headerCategories.map(category => (
                    <Link key={category.name} to={category.path} className="text-neutral-700 py-3 border-b border-neutral-100 text-base pl-4" onClick={toggleMobileMenu}>{category.name}</Link>
                ))}
                <Link to="/favoritos" className="text-neutral-700 py-3 border-b border-neutral-100 text-base" onClick={toggleMobileMenu}>Favoritos ({wishlist.length})</Link>
              </>
            </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;