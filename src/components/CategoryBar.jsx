import React from 'react';
import { Filter, ArrowUpDown, Bot, Sparkles, X } from 'lucide-react';
import { CATEGORIES } from '../data/products';
import { useCart } from '../context/CartContext';

export default function CategoryBar({ 
  selectedCategory, 
  onSelectCategory, 
  sortBy, 
  onSortChange, 
  totalResults 
}) {
  const { botSuggestions, setBotSuggestions } = useCart();
  const hasBotSuggestions = botSuggestions && botSuggestions.length > 0;

  const handleClearBotSuggestions = (e) => {
    e.stopPropagation();
    setBotSuggestions([]);
    if (selectedCategory === 'bot-sugestao') {
      onSelectCategory('todos');
    }
  };

  return (
    <div id="catalogo-section" className="bg-aurum-card/90 border-y border-aurum-gold/20 py-6 px-4 sm:px-8 mb-8 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
          <div className="flex items-center gap-2 pr-2 text-aurum-gold text-xs font-semibold uppercase tracking-wider hidden sm:flex flex-shrink-0">
            <Filter className="w-4 h-4" />
            <span>Coleção:</span>
          </div>

          {/* Standard categories */}
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-2 border flex-shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-aurum-gold-dark via-aurum-gold to-aurum-gold-light text-black font-bold border-aurum-gold shadow-gold-sm scale-105'
                    : 'bg-aurum-surface/80 text-gray-300 border-aurum-border/60 hover:border-aurum-gold/40 hover:text-white'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}

          {/* ✦ Bot Suggestion Tab — only when bot has made suggestions */}
          {hasBotSuggestions && (
            <button
              onClick={() => onSelectCategory('bot-sugestao')}
              className={`relative whitespace-nowrap pl-3 pr-2 py-2 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 border flex-shrink-0 animate-fadeIn ${
                selectedCategory === 'bot-sugestao'
                  ? 'bg-gradient-to-r from-purple-900 via-purple-700 to-aurum-gold text-white border-aurum-gold shadow-[0_0_18px_rgba(196,160,60,0.5)] scale-105'
                  : 'bg-gradient-to-r from-purple-900/60 to-aurum-gold/20 text-aurum-gold border-aurum-gold/60 hover:border-aurum-gold hover:scale-105'
              }`}
            >
              {/* Animated sparkle dot */}
              <span className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-aurum-gold border-2 border-aurum-bg flex items-center justify-center animate-bounce">
                <Sparkles className="w-1.5 h-1.5 text-black" />
              </span>
              <Bot className="w-3.5 h-3.5" />
              <span>✦ Sugestão do Alfredo</span>
              <span className="px-1.5 py-0.5 rounded-full bg-aurum-gold text-black text-[10px] font-black">
                {botSuggestions.length}
              </span>
              {/* Clear button */}
              <span
                role="button"
                onClick={handleClearBotSuggestions}
                className="ml-0.5 p-0.5 rounded-full hover:bg-white/20 text-current transition-colors"
                title="Remover sugestões"
              >
                <X className="w-3 h-3" />
              </span>
            </button>
          )}
        </div>

        {/* Results Counter & Sort Selector */}
        <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto border-t border-aurum-border/40 md:border-t-0 pt-4 md:pt-0">
          <div className="flex flex-col items-start gap-0.5">
            <span className="text-xs text-gray-400">
              Exibindo <strong className="text-aurum-gold font-semibold">{totalResults}</strong> peças formais
            </span>
            {selectedCategory === 'bot-sugestao' && (
              <span className="text-[10px] text-purple-400 flex items-center gap-1">
                <Bot className="w-2.5 h-2.5" />
                Seleção personalizada pelo Alfredo
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 bg-aurum-surface px-3 py-1.5 rounded-md border border-aurum-border">
            <ArrowUpDown className="w-3.5 h-3.5 text-aurum-gold" />
            <span className="text-xs text-gray-400 hidden sm:inline">Ordenar:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-transparent text-xs text-white focus:outline-none cursor-pointer font-medium"
            >
              <option value="destaque" className="bg-aurum-surface text-white">Destaques MF</option>
              <option value="preco-asc" className="bg-aurum-surface text-white">Menor Preço</option>
              <option value="preco-desc" className="bg-aurum-surface text-white">Maior Preço</option>
              <option value="avaliacao" className="bg-aurum-surface text-white">Melhor Avaliados</option>
            </select>
          </div>
        </div>

      </div>
    </div>
  );
}
