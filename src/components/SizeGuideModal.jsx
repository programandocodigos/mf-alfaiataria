import React from 'react';
import { X, Ruler, Info } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function SizeGuideModal() {
  const { isSizeGuideOpen, setIsSizeGuideOpen } = useCart();

  if (!isSizeGuideOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      
      <div 
        className="fixed inset-0 cursor-pointer"
        onClick={() => setIsSizeGuideOpen(false)}
      ></div>

      <div className="relative w-full max-w-3xl bg-aurum-surface rounded-xl border border-aurum-gold/40 shadow-card-dark overflow-hidden z-10 p-6 sm:p-8 my-8">
        
        <button
          onClick={() => setIsSizeGuideOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-white bg-aurum-bg/80 border border-aurum-gold/20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-aurum-border/60">
          <div className="p-2.5 rounded-lg bg-aurum-card border border-aurum-gold/30 text-aurum-gold">
            <Ruler className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-white">Guia de Medidas &amp; Caimento</h2>
            <p className="text-xs text-gray-400">Tabela de correspondência oficial de alfaiataria sartorial europeia e nacional.</p>
          </div>
        </div>

        <div className="space-y-6 overflow-y-auto max-h-[70vh] pr-2">
          
          {/* Suits & Blazers Table */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-aurum-gold mb-3">
              1. Ternos Completos, Costumes &amp; Blazers (Paletó)
            </h3>
            <div className="overflow-x-auto rounded border border-aurum-border">
              <table className="w-full text-xs text-left text-gray-300">
                <thead className="bg-aurum-card text-aurum-gold uppercase text-[10px] font-bold border-b border-aurum-border">
                  <tr>
                    <th className="p-3">Tam. Brasil</th>
                    <th className="p-3">Tam. Europa/IT</th>
                    <th className="p-3">Tórax (cm)</th>
                    <th className="p-3">Cintura (cm)</th>
                    <th className="p-3">Ombro a Ombro (cm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-aurum-border/40 bg-aurum-surface">
                  <tr className="hover:bg-aurum-card/50">
                    <td className="p-3 font-bold text-white">46 (PP)</td>
                    <td className="p-3">46 IT</td>
                    <td className="p-3">92 - 95</td>
                    <td className="p-3">78 - 81</td>
                    <td className="p-3">43 cm</td>
                  </tr>
                  <tr className="hover:bg-aurum-card/50">
                    <td className="p-3 font-bold text-white">48 (P)</td>
                    <td className="p-3">48 IT</td>
                    <td className="p-3">96 - 99</td>
                    <td className="p-3">82 - 85</td>
                    <td className="p-3">44.5 cm</td>
                  </tr>
                  <tr className="hover:bg-aurum-card/50">
                    <td className="p-3 font-bold text-white">50 (M)</td>
                    <td className="p-3">50 IT</td>
                    <td className="p-3">100 - 103</td>
                    <td className="p-3">86 - 89</td>
                    <td className="p-3">46 cm</td>
                  </tr>
                  <tr className="hover:bg-aurum-card/50">
                    <td className="p-3 font-bold text-white">52 (G)</td>
                    <td className="p-3">52 IT</td>
                    <td className="p-3">104 - 107</td>
                    <td className="p-3">90 - 93</td>
                    <td className="p-3">47.5 cm</td>
                  </tr>
                  <tr className="hover:bg-aurum-card/50">
                    <td className="p-3 font-bold text-white">54 (GG)</td>
                    <td className="p-3">54 IT</td>
                    <td className="p-3">108 - 111</td>
                    <td className="p-3">94 - 98</td>
                    <td className="p-3">49 cm</td>
                  </tr>
                  <tr className="hover:bg-aurum-card/50">
                    <td className="p-3 font-bold text-white">56 (XG)</td>
                    <td className="p-3">56 IT</td>
                    <td className="p-3">112 - 116</td>
                    <td className="p-3">99 - 104</td>
                    <td className="p-3">50.5 cm</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Shirts Table */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-aurum-gold mb-3">
              2. Camisas Sociais (Colarinho &amp; Tórax)
            </h3>
            <div className="overflow-x-auto rounded border border-aurum-border">
              <table className="w-full text-xs text-left text-gray-300">
                <thead className="bg-aurum-card text-aurum-gold uppercase text-[10px] font-bold border-b border-aurum-border">
                  <tr>
                    <th className="p-3">Tamanho</th>
                    <th className="p-3">Colarinho (cm)</th>
                    <th className="p-3">Manga (cm)</th>
                    <th className="p-3">Tórax (cm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-aurum-border/40 bg-aurum-surface">
                  <tr className="hover:bg-aurum-card/50">
                    <td className="p-3 font-bold text-white">38 (P)</td>
                    <td className="p-3">38 cm</td>
                    <td className="p-3">64 cm</td>
                    <td className="p-3">96 cm</td>
                  </tr>
                  <tr className="hover:bg-aurum-card/50">
                    <td className="p-3 font-bold text-white">40 (M)</td>
                    <td className="p-3">40 cm</td>
                    <td className="p-3">65 cm</td>
                    <td className="p-3">102 cm</td>
                  </tr>
                  <tr className="hover:bg-aurum-card/50">
                    <td className="p-3 font-bold text-white">42 (G)</td>
                    <td className="p-3">42 cm</td>
                    <td className="p-3">66 cm</td>
                    <td className="p-3">108 cm</td>
                  </tr>
                  <tr className="hover:bg-aurum-card/50">
                    <td className="p-3 font-bold text-white">44 (GG)</td>
                    <td className="p-3">44 cm</td>
                    <td className="p-3">67 cm</td>
                    <td className="p-3">114 cm</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Measuring Tips Box */}
          <div className="bg-aurum-card p-4 rounded-lg border border-aurum-gold/20 flex items-start gap-3">
            <Info className="w-5 h-5 text-aurum-gold flex-shrink-0 mt-0.5" />
            <div className="text-xs text-gray-300 space-y-1">
              <h4 className="font-bold text-white">Serviço de Ajuste Personalizado MF Alfaiataria</h4>
              <p>
                Todos os nossos ternos acompanham barra aberta (sem bainha pronta) com folga interna de até 6cm, permitindo que a calça seja perfeitamente ajustada à sua altura e tipo de sapato preferido.
              </p>
            </div>
          </div>

        </div>

        <div className="mt-6 pt-4 border-t border-aurum-border/60 flex justify-end">
          <button
            onClick={() => setIsSizeGuideOpen(false)}
            className="px-6 py-2.5 rounded bg-aurum-gold text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
}
