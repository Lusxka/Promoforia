// src/App.tsx
import React from 'react';
// Importe apenas Routes e Route daqui, não o BrowserRouter/Router
import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header'; // Ensure path is correct
import Footer from './components/layout/Footer'; // Ensure path is correct

// Import your pages - ensure paths are correct
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import NotFoundPage from './pages/NotFoundPage';

// Import your contexts - ensure paths are correct
import { ProductProvider } from './contexts/ProductContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';


function App() {
  // REMOVIDO o <Router> que envolvia tudo aqui
  return (
    // Os Providers devem envolver a parte da aplicação que precisa do contexto
    // Geralmente, envolvem as rotas ou a estrutura principal do layout
    <ProductProvider>
      <CartProvider>
        <WishlistProvider>
          <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-grow">
              {/* Routes deve estar dentro dos Providers, mas não precisa de outro Router */}
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/catalogo" element={<CatalogPage />} />
                {/* Ensure ProductDetailPage uses getProductById from context */}
                <Route path="/produto/:id" element={<ProductDetailPage />} />
                <Route path="/carrinho" element={<CartPage />} />
                <Route path="/favoritos" element={<WishlistPage />} />
                <Route path="*" element={<NotFoundPage />} /> {/* Catch-all for 404 */}
              </Routes>
            </main>
            <Footer />
          </div>
        </WishlistProvider>
      </CartProvider>
    </ProductProvider>
  );
}

export default App;