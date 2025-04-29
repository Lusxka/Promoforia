// src/components/products/ProductCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '../../types/Product'; // Ensure this imports the updated frontend Product type
import { useCart } from '../../contexts/CartContext'; // Your existing context
import { useWishlist } from '../../contexts/WishlistContext'; // Your existing context
import { formatCurrency } from '../../utils/formatters'; // Your existing formatter

interface ProductCardProps {
  product: Product; // Use the frontend Product type
  index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  // Assuming useCart and useWishlist correctly use product._id
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const inWishlist = isInWishlist(product._id); // Use the frontend product ID (_id)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1); // Pass the full product object or necessary info
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product); // Pass the full product object
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.05, // Slightly reduced delay for tighter grid animation
      }
    }
  };

  const renderStars = () => {
    const stars = [];
    // Round the rating to the nearest whole number for display
    const rating = Math.round(product.rating || 0); // Use product.rating (frontend type), default to 0
    const maxStars = 5;

    for (let i = 1; i <= maxStars; i++) {
      stars.push(
        <Star
          key={i}
          size={16}
          className={`inline-block mr-0.5 ${i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-300 fill-transparent'}`}
        />
      );
    }

    return stars;
  };

  // Fallback image or default handling if images array is empty or null
  const imageUrl = product.images && product.images.length > 0 ? product.images[0] : null;
  // Use the price from the processed product data
  const displayPrice = product.price !== undefined ? formatCurrency(product.price) : 'N/A';
   const displayOriginalPrice = product.originalPrice !== undefined ? formatCurrency(product.originalPrice) : undefined;


  // Ensure product has a valid _id for the link
  const productLink = product._id ? `/produto/${product._id}` : '#'; // Fallback link


  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      className="product-card group flex flex-col rounded-lg shadow-sm overflow-hidden bg-white hover:shadow-md transition-shadow duration-300"
    >
      {/* Use productLink for safe navigation */}
      <Link to={productLink} className="block h-full flex flex-col">
        {/* Image Section */}
        <div className="relative pb-[100%] overflow-hidden rounded-t-lg bg-neutral-100 flex-shrink-0"> {/* Fixed aspect ratio */}
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 w-full h-full flex items-center justify-center text-neutral-400">
              <ImageIcon size={48} />
            </div>
          )}

          {/* Dynamic Badges based on processed data */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10"> {/* Added z-10 */}
               {/* Use the actual calculated discount from processed product */}
               {product.discount !== undefined && product.discount > 0 && (
                  <span className="bg-error-500 text-white text-xs font-medium px-2 py-1 rounded">
                    -{Math.round(product.discount)}% {/* Round discount for display */}
                  </span>
                )}
               {/* Use processed boolean flags */}
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

          {/* Wishlist Button */}
          {/* Ensure button is above image using z-index if needed */}
          <button
            onClick={handleToggleWishlist}
            className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-neutral-100 transition-colors duration-200 z-10"
            aria-label={inWishlist ? "Remover dos favoritos" : "Adicionar aos favoritos"} // Accessibility
          >
            <Heart
              size={18}
              className={inWishlist ? 'text-error-500 fill-error-500' : 'text-neutral-400'}
            />
          </button>
        </div>

        {/* Content Section */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Rating and Review Count */}
          <div className="mb-1 flex items-center">
            <div className="flex items-center">{renderStars()}</div> {/* Container for stars */}
            {/* Use product.reviewCount (frontend type) */}
            <span className="text-xs text-neutral-500 ml-1">({product.reviewCount !== undefined ? product.reviewCount : 0})</span>
          </div>

          {/* Product Name */}
          {/* Use product.name (frontend type) */}
          <h3 className="font-medium text-neutral-800 mb-1 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
            {product.name}
          </h3>

          {/* Product Description */}
           {/* Use product.description (frontend type) or a fallback */}
           <p className="text-neutral-600 text-sm mb-3 line-clamp-2 flex-grow">
              {product.description || 'Sem descrição disponível.'}
           </p>

          {/* Price Section */}
          <div className="mt-auto"> {/* Pushes the price and button to the bottom */}
            <div className="flex items-baseline mb-3">
              {/* Use the formatted price */}
              <span className="text-lg font-semibold text-neutral-900">
                {displayPrice}
              </span>

              {/* Use the formatted original price if available */}
              {displayOriginalPrice && (
                <span className="ml-2 text-sm text-neutral-500 line-through">
                  {displayOriginalPrice}
                </span>
              )}
            </div>

            {/* Add to Cart Button */}
            <div className="flex space-x-2">
              {/* Button functionality remains the same, acting on the processed product */}
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