import React from 'react';
import { Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function NotificationToast() {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-24 right-6 z-50 animate-bounceIn max-w-sm pointer-events-none">
      <div className="bg-aurum-surface/95 border border-aurum-gold/60 text-white p-4 rounded-lg shadow-gold-glow backdrop-blur-md flex items-center gap-3">
        <div className="p-2 rounded-full bg-aurum-gold/20 text-aurum-gold flex-shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="flex-1 text-xs">
          <p className="font-semibold text-aurum-gold-light">{toastMessage}</p>
        </div>
      </div>
    </div>
  );
}
