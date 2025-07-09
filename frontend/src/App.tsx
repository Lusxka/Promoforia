// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import NotFoundPage from './pages/NotFoundPage';
import ConcreteCategoryPage from './pages/ConcreteCategoryPage';

// Importações dos Providers
import { ThemeProvider } from './contexts/ThemeContext'; // <<< ADIÇÃO NECESSÁRIA
import { ProductProvider } from './contexts/ProductContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';

// O código de mapeamento permanece o mesmo.
const categoryRouteConfig = {
    "relampago": { displayName: "Relâmpago", collectionKey: "RELAMPAGO" as keyof typeof COLLECTION_MAP },
    "ofertas": { displayName: "Ofertas", collectionKey: "OFERTAS" as keyof typeof COLLECTION_MAP },
    "menos-de-100": { displayName: "Menos de R$100", collectionKey: "MENOS_DE_100" as keyof typeof COLLECTION_MAP },
    "compra-do-mes": { displayName: "Compra do Mês", collectionKey: "COMPRA_DO_MES" as keyof typeof COLLECTION_MAP },
    "moda": { displayName: "Moda", collectionKey: "MODA" as keyof typeof COLLECTION_MAP },
};
const COLLECTION_MAP = {
    RELAMPAGO: "mercado_livre_relampago",
    OFERTAS: "mercado_livre_todas",
    MENOS_DE_100: "mercado_livre_menos_100",
    COMPRA_DO_MES: "mercado_livre_compra_mes",
    MODA: "mercado_livre_moda"
};

function App() {
  return (
    // CORREÇÃO: Adicionado o ThemeProvider para habilitar o modo escuro em toda a aplicação.
    <ThemeProvider>
      <ProductProvider>
        <CartProvider>
          <WishlistProvider>
            {/* CORREÇÃO: Cor de fundo principal para o modo claro e escuro. */}
            <div className="flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-900">
              <Header />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/catalogo" element={<CatalogPage />} />
                  
                  {Object.entries(categoryRouteConfig).map(([pathSuffix, config]) => (
                    <Route
                      key={pathSuffix}
                      path={`/categorias/${pathSuffix}`}
                      element={
                        <ConcreteCategoryPage
                          categoryPageTitle={config.displayName}
                          collectionKey={config.collectionKey}
                        />
                      }
                    />
                  ))}

                  <Route path="/produto/:id" element={<ProductDetailPage />} />
                  <Route path="/carrinho" element={<CartPage />} />
                  <Route path="/favoritos" element={<WishlistPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </WishlistProvider>
        </CartProvider>
      </ProductProvider>
    </ThemeProvider>
  );
}

export default App;