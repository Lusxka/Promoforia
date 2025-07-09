import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { formatCurrency } from '../utils/formatters';
import ProductGrid from '../components/products/ProductGrid';
import { Heart, ShoppingCart } from 'lucide-react';

const WishlistPage: React.FC = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleRemoveFromWishlist = (productId: string) => {
    removeFromWishlist(productId);
  };

  const handleAddToCart = (productId: string) => {
    const product = wishlist.find(item => item._id === productId);
    if (product) {
      addToCart(product, 1);
      // Opcional: remover da wishlist após adicionar ao carrinho
      // removeFromWishlist(productId);
    }
  };

  if (wishlist.length === 0) {
    return (
      <div className="container-custom py-16 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-md"
        >
          <div className="mb-6 w-20 h-20 mt-20 mx-auto bg-neutral-100 rounded-full flex items-center justify-center">
            <Heart size={32} className="text-neutral-400" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-3">Sua lista de favoritos está vazia</h1>
          <p className="text-neutral-600 mb-8">
            Adicione produtos à sua lista de favoritos enquanto navega pela loja para encontrá-los facilmente depois.
          </p>
          <Link to="/catalogo" className="button-primary px-6 py-3">
            Explorar Produtos
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container-custom py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-2xl md:text-3xl mt-20 font-bold text-neutral-900 mb-2">
          Meus Favoritos
        </h1>
        <p className="text-neutral-600">
          {wishlist.length} {wishlist.length === 1 ? 'produto' : 'produtos'} na sua lista de desejos
        </p>
      </motion.div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <ul className="divide-y divide-neutral-200">
          <AnimatePresence>
            {wishlist.map((product) => (
              <motion.li
                key={product._id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="py-4 first:pt-0 last:pb-0"
              >
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  {/* Imagem do produto */}
                  <Link to={`/produto/${product._id}`} className="w-20 h-20 flex-shrink-0">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </Link>
                  
                  {/* Detalhes do produto */}
                  <div className="flex-1">
                    <Link to={`/produto/${product._id}`} className="block">
                      <h3 className="text-lg font-medium text-neutral-900 hover:text-primary-600 transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    
                    <p className="text-sm text-neutral-600 line-clamp-1 mt-1 mb-2">
                      {product.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-3 mt-3">
                      <button
                        onClick={() => handleAddToCart(product._id)}
                        className="button-outline text-sm py-1.5 px-3 flex items-center"
                      >
                        <ShoppingCart size={16} className="mr-1" />
                        Adicionar ao Carrinho
                      </button>
                      <button
                        onClick={() => handleRemoveFromWishlist(product._id)}
                        className="text-neutral-600 hover:text-error-500 transition-colors text-sm py-1.5 px-3 border border-neutral-300 rounded-md hover:border-error-300 flex items-center"
                      >
                        <Heart size={16} className="mr-1 fill-error-500 text-error-500" />
                        Remover
                      </button>
                    </div>
                  </div>
                  
                  {/* Preço */}
                  <div className="text-right">
                    <p className="text-lg font-semibold text-neutral-900">
                      {formatCurrency(product.price)}
                    </p>
                    {product.originalPrice && (
                      <p className="text-sm text-neutral-500 line-through">
                        {formatCurrency(product.originalPrice)}
                      </p>
                    )}
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>

      {/* Produtos recomendados baseados nos favoritos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-neutral-900 mb-2">
            Você Também Pode Gostar
          </h2>
          <p className="text-neutral-600">
            Baseado nos seus produtos favoritos
          </p>
        </div>
        
        <ProductGrid 
          products={wishlist} 
          loading={false} 
        />
      </motion.div>
    </div>
  );
};

export default WishlistPage;