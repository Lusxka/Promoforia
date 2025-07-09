// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage'; // Página principal de todos os produtos
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import NotFoundPage from './pages/NotFoundPage';
import ConcreteCategoryPage from './pages/ConcreteCategoryPage'; // NOVA PÁGINA PARA CATEGORIAS

import { ProductProvider } from './contexts/ProductContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';

// Mapeamento para passar para ConcreteCategoryPage
const categoryRouteConfig = {
    "relampago": { displayName: "Relâmpago", collectionKey: "RELAMPAGO" as keyof typeof COLLECTION_MAP },
    "ofertas": { displayName: "Ofertas", collectionKey: "OFERTAS" as keyof typeof COLLECTION_MAP },
    "menos-de-100": { displayName: "Menos de R$100", collectionKey: "MENOS_DE_100" as keyof typeof COLLECTION_MAP },
    "compra-do-mes": { displayName: "Compra do Mês", collectionKey: "COMPRA_DO_MES" as keyof typeof COLLECTION_MAP },
    "moda": { displayName: "Moda", collectionKey: "MODA" as keyof typeof COLLECTION_MAP },
};
// Defina COLLECTION_MAP como no ProductContext ou importe-o se exportado
const COLLECTION_MAP = { // Repetido aqui para clareza, idealmente importar/compartilhar
    RELAMPAGO: "mercado_livre_relampago",
    OFERTAS: "mercado_livre_todas",
    MENOS_DE_100: "mercado_livre_menos_100",
    COMPRA_DO_MES: "mercado_livre_compra_mes",
    MODA: "mercado_livre_moda"
};


function App() {
  return (
    <ProductProvider>
      <CartProvider>
        <WishlistProvider>
          <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                {/* Esta rota agora mostra TODOS os produtos de all-collections */}
                <Route path="/catalogo" element={<CatalogPage />} />
                
                {/* Novas Rotas de Categoria */}
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
  );
}

export default App;