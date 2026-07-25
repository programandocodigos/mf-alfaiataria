import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, X, Crown, PhoneCall, Sparkles, Camera, UserCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CATEGORIES } from '../data/products';
import logoImg from '../assets/logo.jpg';

export default function Header({ selectedCategory, onSelectCategory, searchQuery, onSearchChange }) {
  const { cartTotalCount, setIsCartOpen, setIsFitFinderOpen, setIsImageSearchOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Top Banner Bar */}
      <div className="bg-gradient-to-r from-aurum-burgundy-dark via-aurum-bg to-aurum-burgundy-dark text-aurum-gold-light text-xs py-2 px-4 border-b border-aurum-gold/20 text-center font-medium tracking-wide">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-2 text-aurum-gold/90">
            <Crown className="w-3.5 h-3.5" />
            <span>MF Alfaiataria Sartorial</span>
          </div>
          <p className="flex-1 text-center truncate">
            ✨ <strong className="text-aurum-gold">Frete Grátis</strong> em compras acima de R$ 1.500 | Ateliê com Ajustes Inclusos
          </p>
          <div className="hidden md:flex items-center gap-4 text-gray-400">
            <button 
              onClick={() => setIsFitFinderOpen(true)} 
              className="hover:text-aurum-gold transition-colors flex items-center gap-1 font-semibold text-aurum-gold-light"
            >
              <Sparkles className="w-3.5 h-3.5 text-aurum-gold" />
              <span>Fit Finder</span>
            </button>
            <button 
              onClick={() => setIsImageSearchOpen(true)} 
              className="hover:text-aurum-gold transition-colors flex items-center gap-1"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Busca por Imagem</span>
            </button>
            <a href="https://wa.me/5511963497168" target="_blank" rel="noreferrer" className="hover:text-aurum-gold transition-colors flex items-center gap-1">
              <PhoneCall className="w-3 h-3 text-aurum-gold" />
              <span>Atendimento Privativo</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Glass Navbar */}
      <nav className="glass-panel border-b border-aurum-border/60 px-4 sm:px-8 py-3 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-gray-300 hover:text-aurum-gold p-1 transition-colors"
            aria-label="Abrir menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Official Brand Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group py-1 flex-shrink-0" 
            onClick={() => onSelectCategory('todos')}
          >
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex-shrink-0 aspect-square p-[2px] bg-gradient-to-tr from-aurum-gold-dark via-aurum-gold to-aurum-gold-light shadow-gold-sm group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
              <img 
                src={logoImg} 
                alt="MF Alfaiataria Logo" 
                className="w-full h-full aspect-square rounded-full object-contain bg-aurum-bg border border-aurum-bg"
              />
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-serif font-bold text-xl sm:text-2xl tracking-widest text-white block uppercase leading-none group-hover:text-aurum-gold-light transition-colors whitespace-nowrap">
                MF <span className="text-aurum-gold font-light">ALFAIATARIA</span>
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-[0.25em] text-aurum-gold/80 block uppercase font-semibold mt-1 whitespace-nowrap">
                EXCLUSIVIDADE &amp; ALTA COSTURA
              </span>
            </div>
          </div>

          {/* Desktop Category Navigation */}
          <div className="hidden lg:flex items-center space-x-6 text-sm font-medium">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`transition-all duration-200 py-1 border-b-2 font-medium tracking-wide ${
                  selectedCategory === cat.id
                    ? 'border-aurum-gold text-aurum-gold shadow-gold-sm'
                    : 'border-transparent text-gray-300 hover:text-aurum-gold-light hover:border-aurum-gold/40'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search & Cart Actions */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Inline Search Bar */}
            <div className="relative">
              <div className={`flex items-center rounded-full border transition-all duration-300 ${
                isSearchExpanded 
                  ? 'bg-aurum-surface border-aurum-gold w-48 sm:w-64 px-3 py-1.5' 
                  : 'border-transparent bg-transparent'
              }`}>
                <Search 
                  onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                  className="w-5 h-5 text-gray-400 hover:text-aurum-gold cursor-pointer transition-colors flex-shrink-0" 
                />
                <input
                  type="text"
                  placeholder="Buscar terno, blazer, tecido..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className={`bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none ml-2 w-full ${
                    isSearchExpanded ? 'block' : 'hidden md:block md:w-36 md:bg-aurum-surface/50 md:px-2 md:py-1 md:rounded-md md:border md:border-aurum-border'
                  }`}
                />
                {searchQuery && (
                  <X 
                    onClick={() => onSearchChange('')} 
                    className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer ml-1"
                  />
                )}
              </div>
            </div>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full text-gray-200 hover:text-aurum-gold hover:bg-aurum-surface/80 transition-all border border-aurum-gold/20"
              aria-label="Abrir carrinho"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartTotalCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-aurum-gold via-aurum-gold-light to-aurum-gold-dark text-black font-bold text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-gold-sm border border-aurum-bg animate-pulse">
                  {cartTotalCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-aurum-border/60 space-y-2 animate-fadeIn">
            <div className="mb-3 px-2">
              <input
                type="text"
                placeholder="Buscar ternos, gravatas..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-aurum-surface text-sm text-white px-3 py-2 rounded-md border border-aurum-gold/30 focus:outline-none focus:border-aurum-gold"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory(cat.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-left px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-aurum-gold/20 text-aurum-gold border border-aurum-gold/30'
                      : 'text-gray-300 hover:bg-aurum-surface hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
