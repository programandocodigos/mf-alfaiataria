import React from 'react';
import ProductCard from './ProductCard';
import { Sparkles, PackageSearch } from 'lucide-react';

export default function ProductGrid({ products, onResetFilters }) {
  if (products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="inline-flex p-4 rounded-full bg-aurum-surface border border-aurum-gold/20 mb-4 text-aurum-gold">
          <PackageSearch className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-serif font-bold text-white mb-2">Nenhuma peça encontrada</h3>
        <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
          Não encontramos nenhum item correspondente aos seus critérios de busca ou filtro selecionado.
        </p>
        <button
          onClick={onResetFilters}
          className="px-6 py-2.5 rounded bg-aurum-gold text-black font-semibold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-gold-sm"
        >
          Limpar Filtros &amp; Ver Todo o Catálogo
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
