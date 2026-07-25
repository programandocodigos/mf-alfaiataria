import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

import { CartProvider, useCart } from './context/CartContext';
import Header from './components/Header';
import Hero from './components/Hero';
import CategoryBar from './components/CategoryBar';
import ProductGrid from './components/ProductGrid';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import SizeGuideModal from './components/SizeGuideModal';
import FitFinderModal from './components/FitFinderModal';
import ImageSearchModal from './components/ImageSearchModal';
import RecommendedProducts from './components/RecommendedProducts';
import NotificationToast from './components/NotificationToast';
import InstagramFloatButton from './components/InstagramFloatButton';
import ChatbotWidget from './components/ChatbotWidget';
import Footer from './components/Footer';

import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

import { PRODUCTS as DEFAULT_PRODUCTS } from './data/products';

function PublicStore() {
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('destaque');
  const [firestoreProducts, setFirestoreProducts] = useState([]);
  const [loadingDb, setLoadingDb] = useState(true);

  const {
    isImageSearchOpen, setIsImageSearchOpen,
    botSuggestions,
  } = useCart();

  // Listen to Firestore 'produtos' collection in real-time
  useEffect(() => {
    const colRef = collection(db, 'produtos');
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      if (!snapshot.empty) {
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setFirestoreProducts(docs);
      } else {
        // Fallback to initial mock products if Firestore collection is empty
        setFirestoreProducts(DEFAULT_PRODUCTS);
      }
      setLoadingDb(false);
    }, (error) => {
      console.error("Erro ao escutar produtos do Firestore:", error);
      setFirestoreProducts(DEFAULT_PRODUCTS);
      setLoadingDb(false);
    });

    return () => unsubscribe();
  }, []);

  const activeProductsSource = firestoreProducts.length > 0 ? firestoreProducts : DEFAULT_PRODUCTS;

  const filteredProducts = useMemo(() => {
    let base;

    // If bot-sugestao category: use only the bot's curated list
    if (selectedCategory === 'bot-sugestao' && botSuggestions.length > 0) {
      base = botSuggestions;
    } else {
      base = activeProductsSource.filter((product) => {
        const matchesCategory = selectedCategory === 'todos' || product.category === selectedCategory;
        const query = searchQuery.trim().toLowerCase();
        const matchesSearch = !query || (
          (product.name && product.name.toLowerCase().includes(query)) ||
          (product.fabric && product.fabric.toLowerCase().includes(query)) ||
          (product.description && product.description.toLowerCase().includes(query)) ||
          (product.category && product.category.toLowerCase().includes(query))
        );
        return matchesCategory && matchesSearch;
      });
    }

    return [...base].sort((a, b) => {
      if (sortBy === 'preco-asc') return a.price - b.price;
      if (sortBy === 'preco-desc') return b.price - a.price;
      if (sortBy === 'avaliacao') return (b.rating || 5) - (a.rating || 5);
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [selectedCategory, searchQuery, sortBy, botSuggestions, activeProductsSource]);

  const handleResetFilters = () => {
    setSelectedCategory('todos');
    setSearchQuery('');
    setSortBy('destaque');
  };

  const handleExploreClick = () => {
    const el = document.getElementById('catalogo-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Auto-scroll to catalog when bot suggestion tab is activated
  useEffect(() => {
    if (selectedCategory === 'bot-sugestao') {
      setTimeout(() => {
        const el = document.getElementById('catalogo-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-aurum-bg text-gray-100 flex flex-col font-sans selection:bg-aurum-gold/30 selection:text-aurum-gold-light">
      
      <Header 
        selectedCategory={selectedCategory} 
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="flex-1">
        {selectedCategory === 'todos' && (
          <div className="animate-fadeIn">
            <Hero onExploreClick={handleExploreClick} />
          </div>
        )}

        {/* Bot suggestion banner */}
        {selectedCategory === 'bot-sugestao' && (
          <div className="animate-fadeIn bg-gradient-to-r from-purple-900/30 via-aurum-bg to-aurum-gold/10 border-b border-aurum-gold/20 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-aurum-gold/20 border border-aurum-gold/40 flex items-center justify-center flex-shrink-0">
                <span className="text-xl">🤵</span>
              </div>
              <div>
                <p className="text-sm font-bold text-aurum-gold">Seleção Personalizada pelo Alfredo</p>
                <p className="text-xs text-gray-400">Estes {filteredProducts.length} produtos foram escolhidos especialmente para você com base no seu perfil de estilo.</p>
              </div>
            </div>
          </div>
        )}

        <CategoryBar 
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalResults={filteredProducts.length}
        />

        {loadingDb ? (
          <div className="py-16 text-center text-aurum-gold flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-aurum-gold/20 border-t-aurum-gold animate-spin"></div>
            <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Sincronizando Catálogo com o Firestore...</p>
          </div>
        ) : (
          <ProductGrid 
            products={filteredProducts} 
            onResetFilters={handleResetFilters}
          />
        )}

        {/* Personalized Recommendations Section */}
        <RecommendedProducts />
      </main>

      <Footer onSelectCategory={setSelectedCategory} />

      {/* Global Modals & Drawers */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <SizeGuideModal />
      <FitFinderModal />
      <ImageSearchModal isOpen={isImageSearchOpen} onClose={() => setIsImageSearchOpen(false)} />
      <NotificationToast />

      {/* Floating Action Buttons */}
      <InstagramFloatButton />
      <ChatbotWidget />

    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          {/* Public Storefront Route */}
          <Route path="/" element={<PublicStore />} />

          {/* Admin Login Route (Secret, not in navigation) */}
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* Protected Admin Dashboard Route */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Catch-all fallback to Home */}
          <Route path="*" element={<PublicStore />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}
