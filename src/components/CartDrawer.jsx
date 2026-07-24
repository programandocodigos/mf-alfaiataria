import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    updateQuantity, 
    removeFromCart, 
    cartSubtotal, 
    cartTotalCount,
    freeShippingThreshold,
    freeShippingProgress,
    setIsCheckoutOpen
  } = useCart();

  if (!isCartOpen) return null;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark Overlay */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-fadeIn cursor-pointer"
        onClick={() => setIsCartOpen(false)}
      ></div>

      {/* Slide-Over Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-aurum-surface border-l border-aurum-gold/30 shadow-card-dark flex flex-col justify-between z-10 animate-slideLeft">
          
          {/* Header */}
          <div className="p-6 border-b border-aurum-border/60 flex items-center justify-between bg-aurum-card">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-aurum-surface border border-aurum-gold/30 text-aurum-gold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider">Seu Carrinho</h3>
                <span className="text-xs text-gray-400">{cartTotalCount} {cartTotalCount === 1 ? 'item selecionado' : 'itens selecionados'}</span>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-aurum-surface transition-colors"
              aria-label="Fechar"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-aurum-bg p-4 border-b border-aurum-border/40 text-xs">
            <div className="flex items-center justify-between mb-1.5 font-medium">
              <span className="text-gray-300 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-aurum-gold" />
                {remainingForFreeShipping > 0 ? (
                  <span>Faltam <strong className="text-aurum-gold">{formatCurrency(remainingForFreeShipping)}</strong> para <strong>Frete Grátis VIP</strong></span>
                ) : (
                  <span className="text-emerald-400 font-bold">🎉 Você ganhou Frete Grátis VIP!</span>
                )}
              </span>
              <span className="text-aurum-gold font-bold">{Math.round(freeShippingProgress)}%</span>
            </div>
            <div className="w-full h-2 bg-aurum-surface rounded-full overflow-hidden border border-aurum-border">
              <div 
                className="h-full bg-gradient-to-r from-aurum-gold-dark via-aurum-gold to-aurum-gold-light transition-all duration-500 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              ></div>
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 space-y-4 py-12">
                <div className="w-16 h-16 rounded-full bg-aurum-card flex items-center justify-center border border-aurum-border text-aurum-gold">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <div>
                  <h4 className="font-serif text-lg text-white font-bold mb-1">Carrinho Vazio</h4>
                  <p className="text-xs text-gray-400 max-w-xs">Explore nosso catálogo e selecione ternos, blazers ou acessórios para montar seu pedido.</p>
                </div>
              </div>
            ) : (
              cart.map((item) => (
                <div 
                  key={item.cartItemId} 
                  className="bg-aurum-card p-4 rounded-lg border border-aurum-border/60 flex gap-4 relative group"
                >
                  {/* Item Image */}
                  <div className="w-20 aspect-[3/4] rounded bg-aurum-bg overflow-hidden flex-shrink-0 border border-aurum-border">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif text-sm font-semibold text-white line-clamp-1">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-gray-500 hover:text-red-400 p-1 transition-colors"
                          title="Remover item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="inline-block bg-aurum-surface text-[10px] text-aurum-gold font-bold px-2 py-0.5 rounded border border-aurum-border mt-1">
                        Tamanho: {item.size}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-aurum-border/40">
                      {/* Quantity Controls */}
                      <div className="flex items-center bg-aurum-surface rounded border border-aurum-border">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, -1)}
                          className="px-2 py-0.5 text-xs text-gray-400 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, 1)}
                          className="px-2 py-0.5 text-xs text-gray-400 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Subtotal */}
                      <span className="text-sm font-bold text-aurum-gold">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-aurum-border/80 bg-aurum-card space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal:</span>
                  <span className="text-gray-200">{formatCurrency(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Frete:</span>
                  <span className={remainingForFreeShipping === 0 ? "text-emerald-400 font-bold" : "text-gray-200"}>
                    {remainingForFreeShipping === 0 ? 'Grátis VIP' : 'Calculado no Checkout'}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-aurum-border/40">
                  <span>Total do Pedido:</span>
                  <span className="text-aurum-gold text-xl">{formatCurrency(cartSubtotal)}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full py-4 rounded bg-gradient-to-r from-aurum-gold-dark via-aurum-gold to-aurum-gold-light text-black font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-gold-glow hover:brightness-110 transition-all"
              >
                <span>Finalizar Pedido via WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-center text-gray-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-aurum-gold" />
                <span>Atendimento prioritário com especialista de alfaiataria</span>
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
