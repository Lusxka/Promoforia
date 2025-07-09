import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProducts } from '../contexts/ProductContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { formatCurrency } from '../utils/formatters';
import { Star, Heart, ShoppingCart, Share2, TruckIcon, ShieldCheck, RotateCcw, ChevronRight } from 'lucide-react';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProductById, loading } = useProducts();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  
  // A lógica de estado permanece idêntica.
  const [product, setProduct] = useState(getProductById(id || ''));
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isInWishlistState, setIsInWishlistState] = useState(false);

  useEffect(() => {
    if (!loading) {
      const foundProduct = getProductById(id || '');
      if (foundProduct) {
        setProduct(foundProduct);
        setIsInWishlistState(isInWishlist(foundProduct._id));
        window.scrollTo(0, 0);
      } else {
        navigate('/404');
      }
    }
  }, [id, loading, getProductById, navigate, isInWishlist]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (product?.stockQuantity || 10)) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      // Feedback visual poderia ser adicionado aqui
    }
  };

  const handleToggleWishlist = () => {
    if (product) {
      toggleWishlist(product);
      setIsInWishlistState(!isInWishlistState);
    }
  };

  if (loading || !product) {
    return (
      <div className="container-custom py-20">
        {/* CORREÇÃO DARK MODE: Cor do skeleton */}
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-neutral-200 dark:bg-neutral-700 rounded-lg h-96"></div>
            <div>
              <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2 mb-6"></div>
              <div className="h-20 bg-neutral-200 dark:bg-neutral-700 rounded w-full mb-6"></div>
              <div className="h-10 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3 mb-4"></div>
              <div className="h-12 bg-neutral-200 dark:bg-neutral-700 rounded w-full mb-4"></div>
              <div className="h-12 bg-neutral-200 dark:bg-neutral-700 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const savings = product.originalPrice 
    ? (product.originalPrice - product.price).toFixed(2) 
    : 0;

  const renderStars = () => {
    const stars = [];
    const rating = Math.round(product.rating);
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i}
          size={20}
          // CORREÇÃO DARK MODE: Cor da estrela vazia
          className={i <= rating ? 'text-secondary-500 fill-secondary-500' : 'text-neutral-300 dark:text-neutral-600'}
        />
      );
    }
    
    return stars;
  };

  return (
    <div className="container-custom py-16">
      {/* CORREÇÃO DARK MODE: Cores do breadcrumb */}
      <div className="mb-6 flex items-center text-sm text-neutral-500 dark:text-neutral-400">
        <Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Início</Link>
        <ChevronRight size={16} className="mx-2" />
        <Link to="/catalogo" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Produtos</Link>
        <ChevronRight size={16} className="mx-2" />
        <Link to={`/catalogo?categoria=${product.category}`} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
          {product.category}
        </Link>
        <ChevronRight size={16} className="mx-2" />
        <span className="text-neutral-700 dark:text-neutral-200 truncate">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* CORREÇÃO DARK MODE: Fundo e borda da imagem principal */}
          <div className="relative pb-[100%] bg-white dark:bg-neutral-800 border border-transparent dark:border-neutral-700 rounded-lg overflow-hidden shadow-sm mb-4">
            <img 
              src={product.images[selectedImage]} 
              alt={product.name} 
              className="absolute inset-0 w-full h-full object-contain p-4"
            />
            
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.discount && product.discount > 0 && (
                <span className="bg-error-500 text-white text-xs font-medium px-2 py-1 rounded">
                  -{product.discount}%
                </span>
              )}
              {product.new && (
                <span className="bg-primary-600 text-white text-xs font-medium px-2 py-1 rounded">
                  Novo
                </span>
              )}
              {product.bestseller && (
                <span className="bg-secondary-500 text-white text-xs font-medium px-2 py-1 rounded">
                  Mais Vendido
                </span>
              )}
            </div>
          </div>
          
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  // CORREÇÃO DARK MODE: Borda da thumbnail
                  className={`relative min-w-16 h-16 border rounded ${
                    selectedImage === index 
                      ? 'border-primary-600' 
                      : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-500'
                  } overflow-hidden`}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} - ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* CORREÇÃO DARK MODE: Cores dos textos de detalhes */}
          <div className="mb-2">
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              Vendido por <span className="font-medium text-primary-700 dark:text-primary-400">{product.seller.name}</span>
            </span>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-3">
            {product.name}
          </h1>
          
          <div className="flex items-center mb-4">
            <div className="flex mr-3">
              {renderStars()}
            </div>
            <span className="text-sm text-neutral-600 dark:text-neutral-300">
              {product.rating} ({product.reviewCount} avaliações)
            </span>
          </div>
          
          <div className="mb-6">
            <div className="flex items-baseline mb-1">
              <span className="text-3xl font-bold text-neutral-900 dark:text-white mr-3">
                {formatCurrency(product.price)}
              </span>
              
              {product.originalPrice && (
                <span className="text-lg text-neutral-500 dark:text-neutral-400 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            
            {parseFloat(savings.toString()) > 0 && (
              <div className="text-success-500 dark:text-success-400 text-sm font-medium">
                Economia de {formatCurrency(parseFloat(savings.toString()))}
              </div>
            )}
          </div>
          
          <p className="text-neutral-700 dark:text-neutral-300 mb-6 leading-relaxed">
            {product.description}
          </p>
          
          {/* CORREÇÃO DARK MODE: Seletor de quantidade */}
          <div className="mb-6">
            <label htmlFor="quantity" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2">
              Quantidade
            </label>
            <div className="flex items-center">
              <button 
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-l-md bg-neutral-50 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-600"
              >
                -
              </button>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={handleQuantityChange}
                min="1"
                max={product.stockQuantity}
                className="w-16 text-center py-2 border-t border-b border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-0"
              />
              <button 
                onClick={() => quantity < product.stockQuantity && setQuantity(quantity + 1)}
                className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-r-md bg-neutral-50 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-600"
              >
                +
              </button>
              <span className="ml-3 text-sm text-neutral-500 dark:text-neutral-400">
                {product.stockQuantity} disponíveis
              </span>
            </div>
          </div>
          
          {/* CORREÇÃO DARK MODE: Botões de ação */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <button 
              onClick={handleAddToCart}
              className="button-primary flex-1 flex items-center justify-center py-3"
            >
              <ShoppingCart size={20} className="mr-2" />
              Adicionar ao Carrinho
            </button>
            
            <button 
              onClick={handleToggleWishlist}
              className={`${
                isInWishlistState
                  ? 'bg-error-50 text-error-500 border-error-300 hover:bg-error-100 dark:bg-error-500/10 dark:text-error-400 dark:border-error-500/30 dark:hover:bg-error-500/20'
                  : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50 dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-600 dark:hover:bg-neutral-700'
              } border rounded-md p-3 transition-colors`}
            >
              <Heart 
                size={20} 
                className={isInWishlistState ? 'fill-error-500' : ''} 
              />
            </button>
            
            <button className="bg-white text-neutral-700 border border-neutral-300 rounded-md p-3 hover:bg-neutral-50 transition-colors dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-600 dark:hover:bg-neutral-700">
              <Share2 size={20} />
            </button>
          </div>
          
          {/* CORREÇÃO DARK MODE: Seção de benefícios */}
          <div className="space-y-3 mb-6">
            <div className="flex items-start">
              <TruckIcon size={18} className="text-primary-600 dark:text-primary-400 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                <span className="font-medium text-neutral-800 dark:text-neutral-100">Envio rápido:</span> Receba em até 7 dias úteis
              </p>
            </div>
            <div className="flex items-start">
              <ShieldCheck size={18} className="text-primary-600 dark:text-primary-400 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                <span className="font-medium text-neutral-800 dark:text-neutral-100">Garantia:</span> 30 dias direto com a loja
              </p>
            </div>
            <div className="flex items-start">
              <RotateCcw size={18} className="text-primary-600 dark:text-primary-400 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                <span className="font-medium text-neutral-800 dark:text-neutral-100">Devolução gratuita:</span> 7 dias para devolução
              </p>
            </div>
          </div>
          
          {/* CORREÇÃO DARK MODE: Tags */}
          <div className="flex flex-wrap gap-2">
            {product.tags.map(tag => (
              <Link 
                key={tag} 
                to={`/catalogo?tag=${tag}`}
                className="text-xs bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 px-3 py-1 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetailPage;