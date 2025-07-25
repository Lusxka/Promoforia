import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { Product } from '../../types/Product';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { formatCurrency } from '../../utils/formatters';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const { cartItems = [], addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isInCart = cartItems.some(item => item._id === product._id);
  const inWishlist = isInWishlist(product._id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInCart) return;
    addToCart(product, 1);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.05,
      }
    }
  };

  const renderStars = () => {
    const stars = [];
    const rating = Math.round(product.rating || 0);
    const maxStars = 5;
    for (let i = 1; i <= maxStars; i++) {
      stars.push(
        <Star
          key={i}
          size={16}
          // CORREÇÃO DARK MODE: Cor da estrela vazia
          className={`inline-block mr-0.5 ${i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-300 dark:text-neutral-600 fill-transparent'}`}
        />
      );
    }
    return stars;
  };

  const imageUrl = product.images && product.images.length > 0 ? product.images[0] : null;
  const displayPrice = product.price !== undefined ? formatCurrency(product.price) : 'N/A';
  const displayOriginalPrice = product.originalPrice !== undefined ? formatCurrency(product.originalPrice) : undefined;
  const productLink = product._id ? `/produto/${product._id}` : '#';

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      className={clsx(
        // CORREÇÃO DARK MODE: Fundo do card
        "product-card group flex flex-col rounded-lg shadow-sm overflow-hidden bg-white dark:bg-neutral-800 transition-all duration-300",
        {
          'border-2 border-emerald-500 shadow-lg': isInCart,
          'hover:shadow-md': !isInCart,
        }
      )}
    >
      <Link to={productLink} className="block h-full flex flex-col">
        {/* Image Section */}
        {/* CORREÇÃO DARK MODE: Fundo da imagem e ícone placeholder */}
        <div className="relative pb-[100%] overflow-hidden rounded-t-lg bg-neutral-100 dark:bg-neutral-700 flex-shrink-0">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 w-full h-full flex items-center justify-center text-neutral-400 dark:text-neutral-500">
              <ImageIcon size={48} />
            </div>
          )}

          {/* Dynamic Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {product.discountPercentage !== undefined && product.discountPercentage > 0 && (
              <span className="bg-error-500 text-white text-xs font-medium px-2 py-1 rounded">
                -{Math.round(product.discountPercentage)}%
              </span>
            )}
            {product.isNew && (
              <span className="bg-primary-600 text-white text-xs font-medium px-2 py-1 rounded">
                Novo
              </span>
            )}
            {product.isBestseller && (
              <span className="bg-secondary-500 text-white text-xs font-medium px-2 py-1 rounded">
                Mais Vendido
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          {/* CORREÇÃO DARK MODE: Botão de favoritos */}
          <button
            onClick={handleToggleWishlist}
            className="absolute bottom-2 right-2 p-2 bg-white dark:bg-neutral-700 rounded-full shadow-md hover:bg-neutral-100 dark:hover:bg-neutral-600 transition-colors duration-200 z-10"
            aria-label={inWishlist ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            <Heart
              size={18}
              className={inWishlist ? 'text-error-500 fill-error-500' : 'text-neutral-400 dark:text-neutral-400'}
            />
          </button>
        </div>

        {/* Content Section */}
        {/* CORREÇÃO DARK MODE: Cores dos textos de conteúdo */}
        <div className="p-4 flex flex-col flex-grow">
          <div className="mb-1 flex items-center">
            <div className="flex items-center">{renderStars()}</div>
            <span className="text-xs text-neutral-500 dark:text-neutral-400 ml-1">({product.reviewCount !== undefined ? product.reviewCount : 0})</span>
          </div>

          <h3 className="font-medium text-neutral-800 dark:text-neutral-100 mb-1 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
            {product.name}
          </h3>

          <p className="text-neutral-600 dark:text-neutral-300 text-sm mb-3 line-clamp-2 flex-grow">
            {product.description || 'Sem descrição disponível.'}
          </p>

          <div className="mt-auto">
            <div className="flex items-baseline mb-3">
              <span className="text-lg font-semibold text-neutral-900 dark:text-white">
                {displayPrice}
              </span>
              {displayOriginalPrice && (
                <span className="ml-2 text-sm text-neutral-500 dark:text-neutral-400 line-through">
                  {displayOriginalPrice}
                </span>
              )}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleAddToCart}
                disabled={isInCart}
                className={clsx(
                  "button-primary w-full text-center", // A classe 'button-primary' deve ser tratada no CSS global
                  {
                    'bg-emerald-600 hover:bg-emerald-600 cursor-not-allowed': isInCart,
                  }
                )}
              >
                {isInCart ? 'Adicionado' : 'Comprar'}
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;