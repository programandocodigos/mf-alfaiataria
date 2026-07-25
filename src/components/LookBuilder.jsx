import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, ShoppingBag, Eye, Plus } from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { PRODUCTS as DEFAULT_PRODUCTS } from '../data/products';
import { useCart } from '../context/CartContext';

// Curated complementary category rules: anchor category → list of preferred companion categories
const COMPLEMENTARY_RULES = {
  ternos: ['camisas', 'acessorios', 'sapatos', 'blazers'],
  blazers: ['camisas', 'calcas', 'acessorios', 'sapatos'],
  camisas: ['calcas', 'blazers', 'acessorios', 'sapatos'],
  calcas: ['camisas', 'blazers', 'sapatos', 'acessorios'],
  acessorios: ['ternos', 'camisas', 'blazers', 'sapatos'],
  sapatos: ['calcas', 'ternos', 'blazers', 'acessorios'],
};

const LABEL_MAP = {
  ternos: 'Terno Completo',
  blazers: 'Blazer',
  camisas: 'Camisa Social',
  calcas: 'Calça Alfaiataria',
  acessorios: 'Acessório',
  sapatos: 'Sapato Social',
};

export default function LookBuilder({ currentProduct }) {
  const { addToCart, setSelectedProductDetail } = useCart();
  const [firestoreProducts, setFirestoreProducts] = useState([]);

  // Fetch all active products from Firestore in real-time
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
        setFirestoreProducts(DEFAULT_PRODUCTS);
      }
    }, () => {
      setFirestoreProducts(DEFAULT_PRODUCTS);
    });

    return () => unsubscribe();
  }, []);

  const activeProducts = firestoreProducts.length > 0 ? firestoreProducts : DEFAULT_PRODUCTS;

  // Build complementary suggestions: 3 to 4 products from DIFFERENT categories than currentProduct
  const suggestions = useMemo(() => {
    if (!currentProduct) return [];

    const currentCat = (currentProduct.category || '').toLowerCase();
    const preferredCats = COMPLEMENTARY_RULES[currentCat] || ['camisas', 'calcas', 'acessorios', 'sapatos'];

    // Available candidate products excluding current product and current product's category
    const candidates = activeProducts.filter(p => {
      const pCat = (p.category || '').toLowerCase();
      const pId = p.id || p.cartItemId;
      const curId = currentProduct.id || currentProduct.cartItemId;
      return pCat !== currentCat && pId !== curId;
    });

    if (candidates.length === 0) return [];

    const selected = [];
    const usedCategories = new Set();

    // 1. First pass: try to pick 1 item per preferred complementary category
    preferredCats.forEach(cat => {
      if (selected.length < 4) {
        const match = candidates.find(p => (p.category || '').toLowerCase() === cat && !usedCategories.has((p.category || '').toLowerCase()));
        if (match) {
          selected.push(match);
          usedCategories.add((match.category || '').toLowerCase());
        }
      }
    });

    // 2. Second pass: if we still have fewer than 3-4 items, fill from remaining candidates from any different category
    if (selected.length < 3) {
      candidates.forEach(p => {
        const pId = p.id || p.cartItemId;
        if (selected.length < 4 && !selected.some(s => (s.id || s.cartItemId) === pId)) {
          selected.push(p);
        }
      });
    }

    return selected.slice(0, 4);
  }, [currentProduct, activeProducts]);

  if (!currentProduct || suggestions.length === 0) return null;

  const formatCurrency = (val) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const totalLookPrice = suggestions.reduce((acc, p) => acc + (p.price || 0), currentProduct.price || 0);

  const handleAddAllToCart = () => {
    suggestions.forEach(p => {
      const size = (Array.isArray(p.sizes) && p.sizes[0]) ? p.sizes[0] : 'Tamanho Único';
      addToCart(p, size, 1);
    });
  };

  return (
    <section className="mt-8 pt-6 border-t border-aurum-border/60 animate-fadeIn">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-aurum-gold" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-aurum-gold font-serif">
              Complete o Look
            </h3>
          </div>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Sugestões de peças complementares da coleção MF Alfaiataria
          </p>
        </div>

        <button
          onClick={handleAddAllToCart}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-aurum-gold/20 hover:bg-aurum-gold/30 border border-aurum-gold/40 text-aurum-gold text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Adicionar Combinação</span>
        </button>
      </div>

      {/* Cards Display: Mobile Carousel (horizontal scroll) / Desktop Grid (3-4 cols) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 overflow-x-auto no-scrollbar snap-x pb-2">
        {suggestions.map((product) => {
          const imgUrl = (Array.isArray(product.images) && product.images[0]) ? product.images[0] : product.imageUrl;
          const catLabel = LABEL_MAP[product.category] || product.category;

          return (
            <div
              key={product.id || product.name}
              className="group relative bg-aurum-card rounded-xl overflow-hidden border border-aurum-border hover:border-aurum-gold/60 transition-all duration-300 cursor-pointer flex flex-col justify-between snap-start hover:-translate-y-1 shadow-md"
              onClick={() => setSelectedProductDetail(product)}
            >
              {/* Product Image */}
              <div className="aspect-[3/4] w-full overflow-hidden relative bg-aurum-bg">
                {imgUrl ? (
                  <img
                    src={imgUrl}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">Sem foto</div>
                )}

                {/* Quick View Icon */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="p-1.5 bg-aurum-bg/90 rounded-full border border-aurum-gold/40 text-aurum-gold">
                    <Eye className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Category Badge */}
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/75 backdrop-blur-sm border border-aurum-gold/30 text-[9px] font-bold text-aurum-gold uppercase tracking-wider">
                  {catLabel}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-2.5 flex flex-col justify-between flex-1">
                <p className="text-xs font-semibold text-white line-clamp-1 group-hover:text-aurum-gold transition-colors">
                  {product.name}
                </p>
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-aurum-border/40">
                  <p className="text-xs font-bold text-aurum-gold-champagne">
                    {formatCurrency(product.price)}
                  </p>
                  <span className="text-[10px] text-aurum-gold flex items-center gap-0.5 font-semibold">
                    <Plus className="w-3 h-3" /> Ver
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile Add Combination Bar */}
      <div className="sm:hidden mt-3 flex items-center justify-between gap-3 bg-aurum-card/90 p-3 rounded-xl border border-aurum-border/60">
        <div className="text-xs text-gray-300">
          Combinação Completa:
          <span className="text-aurum-gold font-bold text-sm ml-1">{formatCurrency(totalLookPrice)}</span>
        </div>
        <button
          onClick={handleAddAllToCart}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-aurum-gold/20 border border-aurum-gold/40 text-aurum-gold text-[10px] font-bold uppercase tracking-wider"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Adicionar Tudo</span>
        </button>
      </div>
    </section>
  );
}
