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
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-neutral-200 rounded-lg h-96"></div>
            <div>
              <div className="h-8 bg-neutral-200 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-neutral-200 rounded w-1/2 mb-6"></div>
              <div className="h-20 bg-neutral-200 rounded w-full mb-6"></div>
              <div className="h-10 bg-neutral-200 rounded w-1/3 mb-4"></div>
              <div className="h-12 bg-neutral-200 rounded w-full mb-4"></div>
              <div className="h-12 bg-neutral-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calcular a economia
  const savings = product.originalPrice 
    ? (product.originalPrice - product.price).toFixed(2) 
    : 0;

  // Renderizar estrelas de avaliação
  const renderStars = () => {
    const stars = [];
    const rating = Math.round(product.rating);
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i}
          size={20}
          className={i <= rating ? 'text-secondary-500 fill-secondary-500' : 'text-neutral-300'}
        />
      );
    }
    
    return stars;
  };

  return (
    <div className="container-custom py-16">
      {/* Breadcrumbs */}
      <div className="mb-6 flex items-center text-sm text-neutral-500">
        <Link to="/" className="hover:text-primary-600 transition-colors">Início</Link>
        <ChevronRight size={16} className="mx-2" />
        <Link to="/catalogo" className="hover:text-primary-600 transition-colors">Produtos</Link>
        <ChevronRight size={16} className="mx-2" />
        <Link to={`/catalogo?categoria=${product.category}`} className="hover:text-primary-600 transition-colors">
          {product.category}
        </Link>
        <ChevronRight size={16} className="mx-2" />
        <span className="text-neutral-700 truncate">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Galeria de imagens */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative pb-[100%] bg-white rounded-lg overflow-hidden shadow-sm mb-4">
            <img 
              src={product.images[selectedImage]} 
              alt={product.name} 
              className="absolute inset-0 w-full h-full object-contain p-4"
            />
            
            {/* Badges */}
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
          
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative min-w-16 h-16 border rounded ${
                    selectedImage === index 
                      ? 'border-primary-600' 
                      : 'border-neutral-200 hover:border-neutral-300'
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

        {/* Detalhes do produto */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Vendedor */}
          <div className="mb-2">
            <span className="text-sm text-neutral-500">
              Vendido por <span className="font-medium text-primary-700">{product.seller.name}</span>
            </span>
          </div>
          
          {/* Nome e rating */}
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-3">
            {product.name}
          </h1>
          
          <div className="flex items-center mb-4">
            <div className="flex mr-3">
              {renderStars()}
            </div>
            <span className="text-sm text-neutral-600">
              {product.rating} ({product.reviewCount} avaliações)
            </span>
          </div>
          
          {/* Preço */}
          <div className="mb-6">
            <div className="flex items-baseline mb-1">
              <span className="text-3xl font-bold text-neutral-900 mr-3">
                {formatCurrency(product.price)}
              </span>
              
              {product.originalPrice && (
                <span className="text-lg text-neutral-500 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            
            {parseFloat(savings.toString()) > 0 && (
              <div className="text-success-500 text-sm font-medium">
                Economia de {formatCurrency(parseFloat(savings.toString()))}
              </div>
            )}
          </div>
          
          {/* Descrição curta */}
          <p className="text-neutral-700 mb-6 leading-relaxed">
            {product.description}
          </p>
          
          {/* Quantidade */}
          <div className="mb-6">
            <label htmlFor="quantity" className="block text-sm font-medium text-neutral-700 mb-2">
              Quantidade
            </label>
            <div className="flex items-center">
              <button 
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                className="px-3 py-2 border border-neutral-300 rounded-l-md bg-neutral-50 text-neutral-600 hover:bg-neutral-100"
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
                className="w-16 text-center py-2 border-t border-b border-neutral-300 focus:outline-none focus:ring-0 focus:border-neutral-300"
              />
              <button 
                onClick={() => quantity < product.stockQuantity && setQuantity(quantity + 1)}
                className="px-3 py-2 border border-neutral-300 rounded-r-md bg-neutral-50 text-neutral-600 hover:bg-neutral-100"
              >
                +
              </button>
              <span className="ml-3 text-sm text-neutral-500">
                {product.stockQuantity} disponíveis
              </span>
            </div>
          </div>
          
          {/* Botões de ação */}
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
                  ? 'bg-error-50 text-error-500 border-error-300 hover:bg-error-100'
                  : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
              } border rounded-md p-3 transition-colors`}
            >
              <Heart 
                size={20} 
                className={isInWishlistState ? 'fill-error-500' : ''} 
              />
            </button>
            
            <button className="bg-white text-neutral-700 border border-neutral-300 rounded-md p-3 hover:bg-neutral-50 transition-colors">
              <Share2 size={20} />
            </button>
          </div>
          
          {/* Benefícios */}
          <div className="space-y-3 mb-6">
            <div className="flex items-start">
              <TruckIcon size={18} className="text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-neutral-700">
                <span className="font-medium">Envio rápido:</span> Receba em até 7 dias úteis
              </p>
            </div>
            <div className="flex items-start">
              <ShieldCheck size={18} className="text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-neutral-700">
                <span className="font-medium">Garantia:</span> 30 dias direto com a loja
              </p>
            </div>
            <div className="flex items-start">
              <RotateCcw size={18} className="text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-neutral-700">
                <span className="font-medium">Devolução gratuita:</span> 7 dias para devolução
              </p>
            </div>
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {product.tags.map(tag => (
              <Link 
                key={tag} 
                to={`/catalogo?tag=${tag}`}
                className="text-xs bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full hover:bg-neutral-200 transition-colors"
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