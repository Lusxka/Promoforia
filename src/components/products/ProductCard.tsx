import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '../../types/Product';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { formatCurrency } from '../../utils/formatters';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  
  const inWishlist = isInWishlist(product._id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
        delay: index * 0.1,
      }
    }
  };

  const renderStars = () => {
    const stars = [];
    const rating = Math.round(product.rating);
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i}
          size={16}
          className={i <= rating ? 'star-filled' : 'star-empty'}
          fill={i <= rating ? 'currentColor' : 'none'}
        />
      );
    }
    
    return stars;
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      className="product-card group"
    >
      <Link to={`/produto/${product._id}`} className="block h-full">
        <div className="relative pb-[100%] overflow-hidden rounded-t-lg bg-neutral-100">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 w-full h-full flex items-center justify-center text-neutral-400">
              <ImageIcon size={48} />
            </div>
          )}
          
          {product.discount && product.discount > 0 && (
            <div className="absolute top-2 left-2 bg-error-500 text-white text-xs font-medium px-2 py-1 rounded">
              -{product.discount}%
            </div>
          )}
          
          <div className="absolute top-2 right-2 flex flex-col gap-1">
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

          <button
            onClick={handleToggleWishlist}
            className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-neutral-100 transition-colors duration-200"
          >
            <Heart 
              size={18} 
              className={inWishlist ? 'text-error-500 fill-error-500' : 'text-neutral-400'} 
            />
          </button>
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <div className="mb-1 flex items-center">
            <div className="stars-container">{renderStars()}</div>
            <span className="text-xs text-neutral-500 ml-1">({product.reviewCount})</span>
          </div>

          <h3 className="font-medium text-neutral-800 mb-1 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
            {product.name}
          </h3>

          <p className="text-neutral-600 text-sm mb-3 line-clamp-2 flex-grow">
            {(product.description || '').substring(0, 80)}...
          </p>

          <div className="mt-auto">
            <div className="flex items-baseline mb-3">
              <span className="text-lg font-semibold text-neutral-900">
                {formatCurrency(product.price)}
              </span>
              
              {product.originalPrice && (
                <span className="ml-2 text-sm text-neutral-500 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleAddToCart}
                className="button-primary w-full text-center"
              >
                Comprar
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;