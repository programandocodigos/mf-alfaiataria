import React, { useState, useRef } from 'react';
import { X, ShirtIcon, Sparkles, Upload, User, Zap, Check, Info } from 'lucide-react';

// Steps definitions
const GARMENTS = [
  { id: 'terno', label: 'Terno Completo', emoji: '🤵', color: '#1A1F2E' },
  { id: 'blazer', label: 'Blazer', emoji: '🧥', color: '#2D2416' },
  { id: 'camisa', label: 'Camisa Social', emoji: '👔', color: '#E2E8F0' },
];

export default function VirtualTryOnModal({ isOpen, onClose }) {
  const [step, setStep] = useState('garment'); // garment | photo | result
  const [selectedGarment, setSelectedGarment] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    setPhotoPreview(url);
  };

  const handleTryOn = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setStep('result');
    }, 3500);
  };

  const handleClose = () => {
    setStep('garment');
    setSelectedGarment(null);
    setPhotoPreview(null);
    setProcessing(false);
    onClose();
  };

  const handleReset = () => {
    setStep('garment');
    setSelectedGarment(null);
    setPhotoPreview(null);
    setProcessing(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-aurum-card rounded-2xl border border-aurum-gold/30 shadow-gold-glow overflow-hidden animate-fadeIn">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-aurum-border/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-aurum-gold/10 border border-aurum-gold/30 flex items-center justify-center text-xl">
              🧍
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-serif">Provador Virtual</h2>
              <p className="text-[11px] text-gray-400">Veja como a peça fica em você</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full text-gray-500 hover:text-white hover:bg-aurum-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-0 px-6 py-3 border-b border-aurum-border/40 bg-aurum-bg/40">
          {[
            { key: 'garment', label: '1. Escolha a Peça' },
            { key: 'photo', label: '2. Sua Foto' },
            { key: 'result', label: '3. Resultado' },
          ].map((s, idx) => (
            <React.Fragment key={s.key}>
              <div className={`flex items-center gap-1.5 ${step === s.key ? 'text-aurum-gold' : (
                (step === 'photo' && idx === 0) || (step === 'result') ? 'text-emerald-400' : 'text-gray-600'
              )}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                  step === s.key ? 'border-aurum-gold bg-aurum-gold/20 text-aurum-gold' :
                  (step === 'photo' && idx === 0) || (step === 'result' && idx < 2) ? 'border-emerald-400 bg-emerald-400/20 text-emerald-400' :
                  step === 'result' && idx === 2 ? 'border-aurum-gold bg-aurum-gold/20 text-aurum-gold' :
                  'border-gray-700 text-gray-600'
                }`}>
                  {((step === 'photo' && idx === 0) || (step === 'result' && idx < 2)) ? <Check className="w-3 h-3" /> : idx + 1}
                </div>
                <span className="text-[10px] font-medium hidden sm:block">{s.label}</span>
              </div>
              {idx < 2 && <div className={`flex-1 h-px mx-2 ${step !== 'garment' && idx === 0 ? 'bg-emerald-400/40' : 'bg-aurum-border/40'}`}></div>}
            </React.Fragment>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* AI Notice */}
          <div className="px-4 py-3 rounded-xl bg-aurum-gold/5 border border-aurum-gold/20 flex items-start gap-3">
            <Zap className="w-4 h-4 text-aurum-gold flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-gray-400 leading-relaxed">
              <span className="text-aurum-gold font-semibold">Funcionalidade Beta</span> — O Provador Virtual completo requer integração com IA de visão computacional (Snap AR, Banuba SDK ou API customizada). Esta versão apresenta a experiência de fluxo e interface.
            </p>
          </div>

          {/* Step 1: Garment Selection */}
          {step === 'garment' && (
            <div className="space-y-4">
              <p className="text-xs font-semibold text-gray-300">Qual peça deseja experimentar?</p>
              <div className="grid grid-cols-3 gap-3">
                {GARMENTS.map(g => (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGarment(g)}
                    className={`flex flex-col items-center gap-3 p-4 rounded-xl border transition-all ${
                      selectedGarment?.id === g.id
                        ? 'border-aurum-gold bg-aurum-gold/10 shadow-gold-sm'
                        : 'border-aurum-border hover:border-aurum-gold/40 bg-aurum-surface'
                    }`}
                  >
                    <span className="text-3xl">{g.emoji}</span>
                    <span className="text-[10px] font-semibold text-gray-300 text-center leading-tight">{g.label}</span>
                    {selectedGarment?.id === g.id && (
                      <div className="w-4 h-4 rounded-full bg-aurum-gold flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-black" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <button
                disabled={!selectedGarment}
                onClick={() => setStep('photo')}
                className="w-full py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-aurum-gold-dark to-aurum-gold text-black disabled:opacity-40 hover:brightness-110 transition-all"
              >
                Continuar →
              </button>
            </div>
          )}

          {/* Step 2: Upload Photo */}
          {step === 'photo' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-300">
                  Envie uma foto sua de corpo inteiro
                </p>
                <span className="text-[10px] text-aurum-gold bg-aurum-gold/10 px-2 py-1 rounded-full">
                  {selectedGarment?.emoji} {selectedGarment?.label}
                </span>
              </div>

              {/* Upload Zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative border-2 border-dashed border-aurum-border/60 hover:border-aurum-gold/50 rounded-2xl p-8 flex flex-col items-center gap-4 cursor-pointer hover:bg-aurum-surface/30 transition-all"
              >
                {photoPreview ? (
                  <div className="relative">
                    <img src={photoPreview} alt="preview" className="w-28 h-40 object-cover rounded-xl border border-aurum-gold/30" />
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-full bg-aurum-gold/10 border border-aurum-gold/30 flex items-center justify-center">
                      <User className="w-7 h-7 text-aurum-gold" />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-semibold text-white">Clique para enviar sua foto</p>
                      <p className="text-[10px] text-gray-500 mt-1">Foto de frente, boa iluminação</p>
                    </div>
                  </>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
              </div>

              {/* Tips */}
              <div className="flex items-start gap-2 p-3 rounded-lg bg-aurum-surface/50 border border-aurum-border/40">
                <Info className="w-4 h-4 text-aurum-gold/70 flex-shrink-0 mt-0.5" />
                <div className="text-[10px] text-gray-400 space-y-0.5">
                  <p>✓ Foto de frente, corpo inteiro</p>
                  <p>✓ Fundo simples, boa iluminação</p>
                  <p>✓ Roupas justas para melhor resultado</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('garment')}
                  className="flex-1 py-2.5 rounded-xl text-xs text-gray-400 border border-aurum-border hover:border-aurum-gold/40 hover:text-aurum-gold transition-colors"
                >
                  ← Voltar
                </button>
                <button
                  disabled={!photoPreview || processing}
                  onClick={handleTryOn}
                  className="flex-1 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-aurum-gold-dark to-aurum-gold text-black disabled:opacity-40 hover:brightness-110 transition-all flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <span className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                      Processando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Experimentar
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Result */}
          {step === 'result' && (
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden border border-aurum-gold/30 bg-aurum-surface/50">
                {/* Simulated Try-On Visual */}
                <div className="relative aspect-[3/4] bg-gradient-to-b from-aurum-surface to-aurum-card flex items-center justify-center">
                  {photoPreview && (
                    <img src={photoPreview} alt="você" className="absolute inset-0 w-full h-full object-cover object-top opacity-40" />
                  )}
                  {/* Overlay with garment silhouette */}
                  <div className="relative z-10 flex flex-col items-center gap-4 text-center p-6">
                    <span className="text-7xl drop-shadow-lg">{selectedGarment?.emoji}</span>
                    <div className="bg-aurum-bg/80 backdrop-blur-md px-5 py-3 rounded-xl border border-aurum-gold/30">
                      <p className="text-xs font-bold text-aurum-gold mb-1">Simulação Visual</p>
                      <p className="text-[10px] text-gray-300">
                        {selectedGarment?.label} MF Alfaiataria<br />
                        Integração IA em breve disponível
                      </p>
                    </div>
                  </div>
                </div>

                {/* AI Badge */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-aurum-gold/90 text-black text-[9px] font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  IA Beta
                </div>
              </div>

              {/* Evaluation Buttons */}
              <div className="text-center space-y-2">
                <p className="text-[11px] text-gray-400">O que achou do look?</p>
                <div className="flex gap-2 justify-center">
                  {['😍 Amei', '👍 Gostei', '🤔 Talvez'].map(label => (
                    <button key={label} className="px-3 py-1.5 rounded-full text-[10px] bg-aurum-surface border border-aurum-border hover:border-aurum-gold/40 text-gray-300 hover:text-aurum-gold transition-colors">
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 py-2.5 rounded-xl text-xs text-gray-400 border border-aurum-border hover:border-aurum-gold/40 hover:text-aurum-gold transition-colors"
                >
                  Experimentar outra peça
                </button>
                <button
                  onClick={handleClose}
                  className="flex-1 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-aurum-gold-dark to-aurum-gold text-black hover:brightness-110 transition-all"
                >
                  Ir ao Catálogo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
