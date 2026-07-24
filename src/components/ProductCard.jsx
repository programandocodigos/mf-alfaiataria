import React from 'react';
import { Star, Eye, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart, setSelectedProductDetail } = useCart();

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    // Default to the first available size
    addToCart(product, product.sizes[0]);
  };

  return (
    <div 
      onClick={() => setSelectedProductDetail(product)}
      className="group relative bg-aurum-card rounded-lg overflow-hidden border border-aurum-border/60 hover:border-aurum-gold/60 transition-all duration-300 shadow-card-dark hover:shadow-gold-glow flex flex-col cursor-pointer"
    >
      {/* Image Container with Hover Zoom & Badge */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-aurum-surface">
        <img 
          src={product.images[0]} 
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
        />
        
        {/* Dark Vignette Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-aurum-bg via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>

        {/* Badge Tag */}
        {product.badge && (
          <div className="absolute top-3 left-3 bg-aurum-bg/90 border border-aurum-gold/40 text-aurum-gold-light text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-sm shadow-md backdrop-blur-md">
            {product.badge}
          </div>
        )}

        {/* Quick Action Overlay (Eye & ShoppingBag) */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProductDetail(product);
            }}
            className="flex-1 py-2.5 px-3 rounded bg-aurum-surface/90 hover:bg-aurum-surface text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 border border-aurum-gold/30 backdrop-blur-md hover:border-aurum-gold transition-colors"
          >
            <Eye className="w-4 h-4 text-aurum-gold" />
            <span>Ver Detalhes</span>
          </button>

          <button
            onClick={handleQuickAdd}
            title="Adicionar ao carrinho"
            className="py-2.5 px-3.5 rounded bg-gradient-to-r from-aurum-gold-dark via-aurum-gold to-aurum-gold-light hover:brightness-110 text-black font-bold flex items-center justify-center shadow-gold-sm transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Card Info Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category & Fabric snippet */}
          <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-aurum-gold-champagne font-medium mb-1">
            <span>{product.category}</span>
            <div className="flex items-center gap-1 text-aurum-gold">
              <Star className="w-3 h-3 fill-aurum-gold" />
              <span className="text-gray-200 font-semibold">{product.rating}</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="font-serif text-base font-semibold text-white group-hover:text-aurum-gold-light transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* Fabric Line Preview */}
          <p className="text-xs text-gray-400 mt-1 line-clamp-1 italic font-light">
            {product.fabric}
          </p>
        </div>

        {/* Price & Sizes */}
        <div className="pt-3 border-t border-aurum-border/40 flex items-end justify-between">
          <div>
            {product.oldPrice && (
              <span className="text-xs text-gray-500 line-through block">
                {formatCurrency(product.oldPrice)}
              </span>
            )}
            <span className="text-lg font-bold text-aurum-gold tracking-tight">
              {formatCurrency(product.price)}
            </span>
          </div>

          <div className="text-[10px] text-gray-400 bg-aurum-surface px-2 py-1 rounded border border-aurum-border">
            {product.sizes.length} tamanhos
          </div>
        </div>
      </div>

    </div>
  );
}
