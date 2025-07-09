import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../contexts/CartContext'; // Importe useCart
import { formatCurrency } from '../utils/formatters';
import { MinusCircle, PlusCircle, Trash2, ChevronLeft, ShoppingBag } from 'lucide-react';

const CartPage: React.FC = () => {
  // Importe finalizePurchase do hook useCart
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal, finalizePurchase } = useCart();

  const handleQuantityChange = (productId: string, quantity: number) => {
    updateQuantity(productId, quantity);
  };

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
  };

  // ✨ REMOVA ESTA FUNÇÃO handleCheckout LOCAL ✨
  // const handleCheckout = () => {
  //   const externalLinks = cart.map(item => item.product.externalLink).filter(Boolean);
  //   if (externalLinks.length > 0) {
  //     window.open(externalLinks[0], '_blank');
  //     // Para abrir todos os links: externalLinks.forEach(link => window.open(link, '_blank'));
  //   } else {
  //     alert('Nenhum link de compra encontrado.');
  //   }
  // };

  if (cart.length === 0) {
    return (
      <div className="container-custom py-16 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-md"
        >
          <div className="mb-6 w-20 h-20 mt-20 mx-auto bg-neutral-100 rounded-full flex items-center justify-center">
            <ShoppingBag size={32} className="text-neutral-400" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-3">Seu carrinho está vazio</h1>
          <p className="text-neutral-600 mb-8">
            Os produtos que você adicionar ao carrinho aparecerão aqui. Continue navegando para encontrar produtos incríveis!
          </p>
          <Link to="/catalogo" className="button-primary px-6 py-3">
            Continuar Comprando
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
      >
        <h1 className="text-2xl md:text-3xl mt-20 font-bold text-neutral-900 mb-2">
          Carrinho de Compras
        </h1>
        <p className="text-neutral-600 mb-8">
          {cart.length} {cart.length === 1 ? 'item' : 'itens'} no seu carrinho
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de produtos */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2"
        >
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <ul className="divide-y divide-neutral-200">
              <AnimatePresence>
                {cart.map(item => (
                  <motion.li
                    key={item.product._id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 sm:p-6"
                  >
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      {/* Imagem do produto */}
                      <Link to={`/produto/${item.product._id}`} className="w-24 h-24 flex-shrink-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </Link>

                      {/* Detalhes do produto */}
                      <div className="flex-1">
                        <Link to={`/produto/${item.product._id}`} className="block">
                          <h3 className="text-lg font-medium text-neutral-900 hover:text-primary-600 transition-colors">
                            {item.product.name}
                          </h3>
                        </Link>

                        {item.product.seller && (
                          <p className="text-sm text-neutral-500 mb-2">
                            Vendido por: {item.product.seller.name}
                          </p>
                        )}

                        <div className="flex items-center gap-3 mt-4">
                          {/* Controle de quantidade */}
                          <div className="flex items-center">
                            <button
                              onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                              className="text-neutral-500 hover:text-primary-600 transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <MinusCircle size={20} className={item.quantity <= 1 ? "text-neutral-300" : ""} />
                            </button>
                            <span className="mx-3 w-8 text-center text-neutral-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                              className="text-neutral-500 hover:text-primary-600 transition-colors"
                            >
                              <PlusCircle size={20} />
                            </button>
                          </div>

                          {/* Remover item */}
                          <button
                            onClick={() => handleRemoveItem(item.product._id)}
                            className="text-neutral-500 hover:text-error-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>

                      {/* Preço */}
                      <div className="text-right">
                        <p className="text-lg font-semibold text-neutral-900">
                          {formatCurrency(item.product.price * item.quantity)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-sm text-neutral-500">
                            {formatCurrency(item.product.price)} cada
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            <div className="p-4 sm:p-6 border-t border-neutral-200 bg-neutral-50 flex justify-between items-center">
              <Link to="/catalogo" className="flex items-center text-primary-600 hover:text-primary-700 transition-colors">
                <ChevronLeft size={18} className="mr-1" />
                Continuar Comprando
              </Link>
              <button
                onClick={clearCart}
                className="text-neutral-600 hover:text-error-500 transition-colors text-sm"
              >
                Limpar Carrinho
              </button>
            </div>
          </div>
        </motion.div>

        {/* Resumo do pedido */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
            <h2 className="text-xl font-bold text-neutral-900 mb-6">
              Resumo do Pedido
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-neutral-600">Subtotal</span>
                <span className="text-neutral-900 font-medium">{formatCurrency(getCartTotal())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Frete</span>
                <span className="text-neutral-900 font-medium">Grátis</span> {/* Assumindo frete grátis por agora */}
              </div>
              <div className="border-t border-neutral-200 pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="text-neutral-900 font-medium">Total</span>
                  <span className="text-xl font-bold text-neutral-900">{formatCurrency(getCartTotal())}</span>
                </div>
              </div>
            </div>

            {/* Código de cupom */}
            <div className="mb-6">
              <label htmlFor="coupon" className="block text-sm font-medium text-neutral-700 mb-2">
                Cupom de desconto
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="coupon"
                  placeholder="Digite seu cupom"
                  className="flex-1 p-2 text-sm border border-neutral-300 rounded-l focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                <button className="bg-neutral-100 border border-neutral-300 border-l-0 rounded-r px-4 text-neutral-700 hover:bg-neutral-200 transition-colors">
                  Aplicar
                </button>
              </div>
            </div>

            {/* Botão de finalizar compra */}
            <button
              // ✨ CHAME A FUNÇÃO finalizePurchase DO CONTEXTO ✨
              onClick={finalizePurchase}
              className="button-secondary w-full py-3 text-center block"
            >
              Finalizar Compra
            </button>

            <p className="text-xs text-neutral-500 text-center mt-4">
              Ao finalizar, você será redirecionado para o site do vendedor para concluir sua compra.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CartPage;