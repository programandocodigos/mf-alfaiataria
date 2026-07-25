import React, { useState, useEffect } from 'react';
import { X, Star, ShoppingBag, Ruler, CheckCircle2, Shield, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import LookBuilder from './LookBuilder';
import { trackProductView } from './RecommendedProducts';

export default function ProductDetailModal() {
  const { selectedProductDetail, setSelectedProductDetail, addToCart, setIsSizeGuideOpen } = useCart();
  
  if (!selectedProductDetail) return null;

  const product = selectedProductDetail;
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || '');
  const [quantity, setQuantity] = useState(1);

  // Track product view for personalized recommendations
  useEffect(() => {
    trackProductView(product);
  }, [product.id]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity);
    setSelectedProductDetail(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      {/* Click outside backdrop */}
      <div 
        className="fixed inset-0 cursor-pointer" 
        onClick={() => setSelectedProductDetail(null)}
      ></div>

      {/* Modal Card Container */}
      <div className="relative w-full max-w-5xl bg-aurum-surface rounded-2xl border border-aurum-gold/30 shadow-gold-glow overflow-hidden z-10 my-8 flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedProductDetail(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-aurum-bg/80 hover:bg-aurum-gold text-gray-300 hover:text-black transition-colors border border-aurum-gold/20 cursor-pointer"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Split Area: Gallery (Left) & Specs/Actions (Right) */}
        <div className="flex flex-col lg:flex-row">
          
          {/* Left Column: Image Gallery */}
          <div className="lg:w-1/2 p-6 bg-aurum-card flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-aurum-border/60">
            {/* Main Large Image */}
            <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-aurum-bg border border-aurum-border">
              <img 
                src={(product.images && product.images[activeImageIndex]) || product.imageUrl || product.images?.[0]} 
                alt={product.name}
                className="w-full h-full object-cover object-center transition-all duration-500"
              />
              {product.badge && (
                <span className="absolute top-4 left-4 bg-aurum-gold text-black text-xs uppercase font-bold tracking-widest px-3 py-1 rounded-full shadow-gold-sm">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {Array.isArray(product.images) && product.images.length > 1 && (
              <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-1 no-scrollbar">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx 
                        ? 'border-aurum-gold scale-105 shadow-gold-sm' 
                        : 'border-aurum-border opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Info & Buy Actions */}
          <div className="lg:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs text-aurum-gold uppercase tracking-wider font-semibold mb-2">
                <span>{product.category}</span>
                <div className="flex items-center gap-1.5 bg-aurum-card px-2.5 py-1 rounded-full border border-aurum-border">
                  <Star className="w-3.5 h-3.5 fill-aurum-gold text-aurum-gold" />
                  <span className="text-white font-bold">{product.rating || 5.0}</span>
                  <span className="text-gray-400 font-normal">({product.reviewsCount || 1} avaliações)</span>
                </div>
              </div>

              {/* Product Title */}
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-3 leading-snug">
                {product.name}
              </h2>

              {/* Price Banner */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-2xl sm:text-3xl font-bold text-aurum-gold">
                  {formatCurrency(product.price)}
                </span>
                {product.oldPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatCurrency(product.oldPrice)}
                  </span>
                )}
                <span className="text-xs text-aurum-gold-champagne bg-aurum-gold/10 px-2.5 py-1 rounded-full border border-aurum-gold/20">
                  10x de {formatCurrency(product.price / 10)} sem juros
                </span>
              </div>

              {/* Detailed Description */}
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-6 font-light">
                {product.description}
              </p>

              {/* Technical Specs */}
              <div className="space-y-2 mb-6 text-xs">
                <div className="bg-aurum-card/80 p-3 rounded-xl border border-aurum-border/60 flex items-start gap-2.5">
                  <strong className="text-aurum-gold font-semibold uppercase tracking-wider min-w-[85px]">Tecido:</strong>
                  <span className="text-gray-200">{product.fabric}</span>
                </div>

                <div className="bg-aurum-card/80 p-3 rounded-xl border border-aurum-border/60 flex items-start gap-2.5">
                  <strong className="text-aurum-gold font-semibold uppercase tracking-wider min-w-[85px]">Corte:</strong>
                  <span className="text-gray-200">{product.fit}</span>
                </div>

                <div className="bg-aurum-card/80 p-3 rounded-xl border border-aurum-border/60 flex items-start gap-2.5">
                  <strong className="text-aurum-gold font-semibold uppercase tracking-wider min-w-[85px]">Ocasião:</strong>
                  <span className="text-gray-200">{product.occasion}</span>
                </div>
              </div>

              {/* Sizes Selector */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold text-white uppercase tracking-wider">
                    Selecione o Tamanho: <span className="text-aurum-gold">{selectedSize}</span>
                  </label>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-xs text-aurum-gold hover:underline flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Guia de Medidas</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(product.sizes) ? product.sizes : ['Tamanho Único']).map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                        selectedSize === sz
                          ? 'bg-aurum-gold text-black border-aurum-gold shadow-gold-sm scale-105'
                          : 'bg-aurum-card text-gray-300 border-aurum-border hover:border-aurum-gold/50 hover:text-white'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Counter */}
              <div className="flex items-center gap-4 mb-6">
                <label className="text-xs font-bold text-white uppercase tracking-wider">Quantidade:</label>
                <div className="flex items-center bg-aurum-card rounded-lg border border-aurum-border">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-sm font-bold text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Product Feature Bullets */}
              {Array.isArray(product.details) && (
                <div className="mb-6 pt-4 border-t border-aurum-border/40">
                  <h4 className="text-xs font-bold text-aurum-gold uppercase tracking-wider mb-2">Destaques Construtivos:</h4>
                  <ul className="grid grid-cols-1 gap-1 text-xs text-gray-300">
                    {product.details.map((dt, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-aurum-gold flex-shrink-0" />
                        <span>{dt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-aurum-border/60 space-y-3">
              <button
                onClick={handleAddToCart}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-aurum-gold-dark via-aurum-gold to-aurum-gold-light text-black font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-gold-glow hover:brightness-110 active:scale-98 transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Adicionar ao Carrinho — {formatCurrency(product.price * quantity)}</span>
              </button>

              <div className="flex items-center justify-center gap-6 text-[11px] text-gray-400 pt-2">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-aurum-gold" /> Frete Express
                </span>
                <span className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-aurum-gold" /> Garantia MF Alfaiataria
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Full-Width Section: Complete o Look (Products from complementary categories) */}
        <div className="px-6 pb-6 bg-aurum-card/60">
          <LookBuilder currentProduct={product} />
        </div>

      </div>
    </div>
  );
}
