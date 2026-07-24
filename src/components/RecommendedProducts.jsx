import React, { useEffect, useState } from 'react';
import { Sparkles, Eye } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { useCart } from '../context/CartContext';

const STORAGE_KEY = 'mf_viewed_categories';
const MAX_HISTORY = 10;

// Track a view in localStorage
export function trackProductView(product) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const history = raw ? JSON.parse(raw) : [];
    // Store category + id to rank
    history.unshift({ cat: product.category, id: product.id });
    const trimmed = history.slice(0, MAX_HISTORY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {}
}

// Score products based on view history
function getScoredRecommendations(excludeId) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const history = raw ? JSON.parse(raw) : [];
    if (!history.length) return PRODUCTS.filter(p => p.isFeatured && p.id !== excludeId).slice(0, 4);

    // Count category frequency
    const catScore = {};
    history.forEach((item, idx) => {
      catScore[item.cat] = (catScore[item.cat] || 0) + (MAX_HISTORY - idx);
    });

    const viewedIds = new Set(history.map(i => i.id));
    viewedIds.add(excludeId);

    return PRODUCTS
      .filter(p => !viewedIds.has(p.id))
      .map(p => ({ ...p, _score: (catScore[p.category] || 0) + (p.isFeatured ? 5 : 0) + p.rating }))
      .sort((a, b) => b._score - a._score)
      .slice(0, 4);
  } catch {
    return PRODUCTS.filter(p => p.isFeatured).slice(0, 4);
  }
}

export default function RecommendedProducts({ currentProductId }) {
  const { setSelectedProductDetail } = useCart();
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    setRecommendations(getScoredRecommendations(currentProductId));
  }, [currentProductId]);

  if (!recommendations.length) return null;

  const formatCurrency = (val) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <section className="py-12 border-t border-aurum-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-aurum-gold" />
              <span className="text-xs font-bold uppercase tracking-widest text-aurum-gold">Só para você</span>
            </div>
            <h2 className="text-2xl font-bold text-white font-serif">Recomendados com Base no Seu Gosto</h2>
          </div>
          <div className="hidden sm:block text-[10px] text-gray-500 italic text-right">
            Personalizado com base<br />no seu histórico de navegação
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recommendations.map((product) => (
            <div
              key={product.id}
              className="group relative bg-aurum-card rounded-xl overflow-hidden border border-aurum-border hover:border-aurum-gold/50 transition-all duration-300 cursor-pointer hover:-translate-y-1"
              onClick={() => setSelectedProductDetail(product)}
            >
              {/* Image */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-aurum-bg/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                  <div className="flex items-center gap-1.5 px-4 py-2 bg-aurum-gold/90 rounded-full text-black text-[10px] font-bold uppercase tracking-wider">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Ver Detalhes</span>
                  </div>
                </div>

                {/* Badge */}
                {product.badge && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-aurum-gold text-black text-[9px] font-bold uppercase">
                    {product.badge}
                  </div>
                )}

                {/* Recommendation tag */}
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-aurum-bg/80 border border-aurum-gold/30 text-aurum-gold text-[9px] font-semibold backdrop-blur-sm">
                  ✦ Para você
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="text-[10px] text-aurum-gold uppercase font-semibold tracking-wider mb-1">
                  {product.category}
                </p>
                <p className="text-xs font-semibold text-white line-clamp-2 mb-2">{product.name}</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-aurum-gold-champagne">{formatCurrency(product.price)}</p>
                  <div className="flex items-center gap-0.5">
                    <span className="text-yellow-400 text-[10px]">★</span>
                    <span className="text-[10px] text-gray-400">{product.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
