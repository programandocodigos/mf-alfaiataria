import React, { useMemo } from 'react';
import { Sparkles, ShoppingBag, Eye, ArrowRight } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { useCart } from '../context/CartContext';

// Curated look combinations: category of anchor → suggested companion categories
const LOOK_RULES = {
  ternos: ['camisas', 'acessorios', 'sapatos'],
  blazers: ['camisas', 'calcas', 'acessorios'],
  camisas: ['calcas', 'acessorios', 'blazers'],
  calcas: ['camisas', 'blazers', 'sapatos'],
  acessorios: ['ternos', 'camisas'],
  sapatos: ['calcas', 'ternos'],
};

const LABEL_MAP = {
  ternos: 'Terno',
  blazers: 'Blazer',
  camisas: 'Camisa',
  calcas: 'Calça',
  acessorios: 'Acessório',
  sapatos: 'Sapato',
};

export default function LookBuilder({ currentProduct }) {
  const { addToCart, setSelectedProductDetail } = useCart();

  const suggestions = useMemo(() => {
    if (!currentProduct) return [];
    const cats = LOOK_RULES[currentProduct.category] || [];
    // Pick 1 product per suggested category, excluding the current product
    return cats.map(cat => {
      return PRODUCTS.find(p => p.category === cat && p.id !== currentProduct.id && p.isFeatured) 
        || PRODUCTS.find(p => p.category === cat && p.id !== currentProduct.id);
    }).filter(Boolean);
  }, [currentProduct]);

  if (!suggestions.length) return null;

  const formatCurrency = (val) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const totalLook = suggestions.reduce((acc, p) => acc + p.price, currentProduct.price);

  const handleAddAll = () => {
    suggestions.forEach(p => addToCart(p, p.sizes[0], 1));
  };

  return (
    <div className="mt-6 pt-6 border-t border-aurum-border/60">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-aurum-gold" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-aurum-gold">
            Complete o Look
          </h3>
        </div>
        <span className="text-[10px] text-gray-400 italic">Sugestão do Alfaiate MF</span>
      </div>

      {/* Visual Look Strip */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {suggestions.slice(0, 3).map((product, idx) => (
          <div
            key={product.id}
            className="group relative bg-aurum-card rounded-lg overflow-hidden border border-aurum-border hover:border-aurum-gold/60 transition-all cursor-pointer"
            onClick={() => setSelectedProductDetail(product)}
          >
            {/* Product Image */}
            <div className="aspect-[3/4] w-full overflow-hidden">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Label Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-[10px] font-bold text-aurum-gold uppercase tracking-wider">
                {LABEL_MAP[product.category]}
              </p>
              <p className="text-[10px] text-white font-semibold line-clamp-1">{product.name}</p>
              <p className="text-[10px] text-aurum-gold-champagne mt-0.5">{formatCurrency(product.price)}</p>
            </div>

            {/* Quick View Eye on hover */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="p-1.5 bg-aurum-bg/80 rounded-full border border-aurum-gold/30 text-aurum-gold">
                <Eye className="w-3 h-3" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total Price & Add All Button */}
      <div className="flex items-center justify-between gap-3 bg-aurum-card/60 p-3 rounded-lg border border-aurum-border/60">
        <div className="text-xs text-gray-400">
          Look Completo:
          <span className="text-aurum-gold font-bold text-sm ml-1">{formatCurrency(totalLook)}</span>
        </div>
        <button
          onClick={handleAddAll}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-aurum-gold/20 hover:bg-aurum-gold/30 border border-aurum-gold/40 text-aurum-gold text-[10px] font-bold uppercase tracking-wider transition-all"
        >
          <ShoppingBag className="w-3 h-3" />
          <span>Adicionar Look</span>
        </button>
      </div>
    </div>
  );
}
