import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Award, Ruler, UserCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Hero({ onExploreClick }) {
  const { setIsSizeGuideOpen, setIsFitFinderOpen } = useCart();

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden border-b border-aurum-gold/20">
      {/* Background Image Overlay with Gradients */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=2000&q=85" 
          alt="Alfaiataria Masculina Premium" 
          className="w-full h-full object-cover object-center scale-105 filter brightness-50 contrast-115 transform transition-transform duration-10000 hover:scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-aurum-bg via-aurum-bg/75 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-aurum-bg via-aurum-bg/60 to-transparent"></div>
      </div>

      {/* Decorative Golden Ambient Lighting */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-aurum-gold/10 rounded-full filter blur-[120px] pointer-events-none"></div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center flex flex-col items-center">
        
        {/* Luxury Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-aurum-surface/80 border border-aurum-gold/40 text-aurum-gold-light text-xs font-semibold tracking-widest uppercase mb-6 shadow-gold-sm backdrop-blur-md animate-bounce-slow">
          <Sparkles className="w-3.5 h-3.5 text-aurum-gold" />
          <span>Coleção Sartorial Italian 2026</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold text-white tracking-tight leading-none mb-6">
          A Nobreza da <br className="hidden sm:inline" />
          <span className="gold-gradient-text italic font-normal">Alfaiataria de Luxo</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl text-base sm:text-xl text-gray-300 font-light leading-relaxed mb-10">
          Ternos em Lã Fria Super 140s, blazers italianos e camisas em Algodão Egípcio 200 fios. 
          Corte sob medida com o prestígio e a precisão da tradição sartorial.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto px-8 py-4 rounded-md bg-gradient-to-r from-aurum-gold-dark via-aurum-gold to-aurum-gold-light text-black font-bold tracking-wider uppercase text-xs flex items-center justify-center gap-3 shadow-gold-glow hover:brightness-110 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <span>Explorar Catálogo</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsFitFinderOpen(true)}
            className="w-full sm:w-auto px-8 py-4 rounded-md bg-gradient-to-r from-aurum-gold/20 to-aurum-surface/90 hover:from-aurum-gold/30 border border-aurum-gold/50 text-aurum-gold-light font-semibold tracking-wider uppercase text-xs flex items-center justify-center gap-2 transition-all duration-300 backdrop-blur-md hover:border-aurum-gold shadow-gold-sm"
          >
            <UserCheck className="w-4 h-4 text-aurum-gold" />
            <span>Fit Finder (Medidas)</span>
            <Sparkles className="w-3.5 h-3.5 text-aurum-gold" />
          </button>

          <button
            onClick={() => setIsSizeGuideOpen(true)}
            className="w-full sm:w-auto px-8 py-4 rounded-md bg-aurum-surface/90 hover:bg-aurum-surface border border-aurum-gold/30 text-aurum-gold-light font-semibold tracking-wider uppercase text-xs flex items-center justify-center gap-2 transition-all duration-300 backdrop-blur-md hover:border-aurum-gold"
          >
            <Ruler className="w-4 h-4 text-aurum-gold" />
            <span>Guia de Medidas</span>
          </button>
        </div>

        {/* Value Proposition Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 pt-10 border-t border-aurum-gold/15 w-full max-w-4xl text-left">
          <div className="flex items-start gap-3 bg-aurum-surface/40 p-4 rounded-lg border border-aurum-border/40">
            <Award className="w-6 h-6 text-aurum-gold flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-white">Lã Fria Italiana</h4>
              <p className="text-xs text-gray-400 mt-0.5">Fios nobres de Lã Super 120s a 140s para caimento fluido e térmico.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-aurum-surface/40 p-4 rounded-lg border border-aurum-border/40">
            <Ruler className="w-6 h-6 text-aurum-gold flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-white">Ajustes Inclusos</h4>
              <p className="text-xs text-gray-400 mt-0.5">Bainha e ajuste de cintura gratuitos nos ateliês parceiros.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-aurum-surface/40 p-4 rounded-lg border border-aurum-border/40">
            <ShieldCheck className="w-6 h-6 text-aurum-gold flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-white">Envio Seguro VIP</h4>
              <p className="text-xs text-gray-400 mt-0.5">Embalagem especial em capa de linho e cabide de madeira maciça.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
