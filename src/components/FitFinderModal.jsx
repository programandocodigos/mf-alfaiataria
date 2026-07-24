import React, { useState } from 'react';
import { X, Sparkles, Ruler, CheckCircle2, ArrowRight, RefreshCw, UserCheck, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function FitFinderModal() {
  const { isFitFinderOpen, setIsFitFinderOpen, setSelectedProductDetail } = useCart();

  const [step, setStep] = useState(1);
  const [height, setHeight] = useState(178); // in cm
  const [weight, setWeight] = useState(78);  // in kg
  const [bodyType, setBodyType] = useState('atletico'); // 'esbelto' | 'atletico' | 'tradicional'
  const [fitPreference, setFitPreference] = useState('slim'); // 'slim' | 'regulare'

  if (!isFitFinderOpen) return null;

  // Calculation Logic for Suit & Shirt sizing
  const calculateRecommendation = () => {
    // Base sizing algorithm based on Height, Weight & Body Type
    let suitSize = 50; // default M (50 IT)
    let pantSize = 42;
    let shirtSize = "40 (M)";
    let fitAdvice = "";

    // Height/Weight BMI estimate
    const bmi = weight / ((height / 100) * (height / 100));

    if (bmi < 21) {
      suitSize = height > 182 ? 48 : 46;
      pantSize = 38;
      shirtSize = "38 (P)";
    } else if (bmi >= 21 && bmi < 24.5) {
      if (weight < 74) {
        suitSize = 48;
        pantSize = 40;
        shirtSize = "38 (P)";
      } else {
        suitSize = 50;
        pantSize = 42;
        shirtSize = "40 (M)";
      }
    } else if (bmi >= 24.5 && bmi < 28) {
      suitSize = weight > 86 ? 54 : 52;
      pantSize = weight > 86 ? 46 : 44;
      shirtSize = weight > 86 ? "44 (GG)" : "42 (G)";
    } else {
      suitSize = weight > 100 ? 58 : 56;
      pantSize = weight > 100 ? 50 : 48;
      shirtSize = "46 (XG)";
    }

    // Body type adjustment
    if (bodyType === 'atletico') {
      fitAdvice = "Seus ombros são bem definidos. O corte Slim Sartorial irá abraçar o tórax mantendo caimento limpo na cintura.";
    } else if (bodyType === 'esbelto') {
      fitAdvice = "Recomendamos modelagem Slim Fit com leve acinturamento para evitar sobra de tecido nas costas.";
    } else {
      fitAdvice = "Modelagem Classic Tailored proporcionará conforto e liberdade nos movimentos com caimento refinado.";
    }

    return {
      suitSize: `${suitSize} (BR/IT)`,
      pantSize: `${pantSize} BR`,
      shirtSize,
      fitAdvice,
      hemAdvice: `Estimativa de comprimento de calça: ${Math.round(height * 0.58)} cm com barra aberta.`
    };
  };

  const recommendation = calculateRecommendation();

  const handleReset = () => {
    setStep(1);
    setHeight(178);
    setWeight(78);
    setBodyType('atletico');
    setFitPreference('slim');
  };

  const handleClose = () => {
    setIsFitFinderOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      {/* Background Overlay */}
      <div className="fixed inset-0 cursor-pointer" onClick={handleClose}></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-aurum-surface rounded-xl border border-aurum-gold/40 shadow-card-dark overflow-hidden z-10 p-6 sm:p-8 my-8">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-white bg-aurum-bg/80 border border-aurum-gold/20 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-aurum-border/60">
          <div className="p-2.5 rounded-lg bg-aurum-card border border-aurum-gold/30 text-aurum-gold">
            <Ruler className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-aurum-gold/10 border border-aurum-gold/30 text-aurum-gold text-[10px] font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3" /> Provador Virtual Sartorial
            </div>
            <h2 className="font-serif text-2xl font-bold text-white">Descubra seu Tamanho Ideal</h2>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8 px-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step === s 
                  ? 'bg-aurum-gold text-black shadow-gold-sm scale-110' 
                  : step > s 
                    ? 'bg-aurum-gold/30 text-aurum-gold border border-aurum-gold/50' 
                    : 'bg-aurum-card text-gray-500 border border-aurum-border'
              }`}>
                {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
              </div>
              <span className={`text-xs font-medium hidden sm:inline ${step === s ? 'text-white font-bold' : 'text-gray-400'}`}>
                {s === 1 ? 'Altura e Peso' : s === 2 ? 'Biotipo Físico' : 'Resultado'}
              </span>
              {s < 3 && <div className={`flex-1 h-0.5 mx-2 ${step > s ? 'bg-aurum-gold/60' : 'bg-aurum-border'}`}></div>}
            </div>
          ))}
        </div>

        {/* STEP 1: Height & Weight Sliders */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            {/* Height Slider */}
            <div className="bg-aurum-card p-5 rounded-lg border border-aurum-border">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-300">Sua Altura:</label>
                <span className="text-xl font-bold text-aurum-gold font-serif">{height} cm <span className="text-xs text-gray-400 font-normal">({(height/100).toFixed(2)}m)</span></span>
              </div>
              <input
                type="range"
                min="160"
                max="205"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full h-2 bg-aurum-surface rounded-lg appearance-none cursor-pointer accent-aurum-gold"
              />
              <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                <span>1,60 m</span>
                <span>1,80 m</span>
                <span>2,05 m</span>
              </div>
            </div>

            {/* Weight Slider */}
            <div className="bg-aurum-card p-5 rounded-lg border border-aurum-border">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-300">Seu Peso:</label>
                <span className="text-xl font-bold text-aurum-gold font-serif">{weight} kg</span>
              </div>
              <input
                type="range"
                min="55"
                max="125"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full h-2 bg-aurum-surface rounded-lg appearance-none cursor-pointer accent-aurum-gold"
              />
              <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                <span>55 kg</span>
                <span>85 kg</span>
                <span>125 kg</span>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-4 rounded bg-gradient-to-r from-aurum-gold-dark via-aurum-gold to-aurum-gold-light text-black font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-gold-glow hover:brightness-110 transition-all mt-4"
            >
              <span>Próximo Passo: Biotipo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: Body Type Selector */}
        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-xs font-bold uppercase tracking-wider text-aurum-gold mb-3">Selecione o seu formato de corpo:</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => setBodyType('esbelto')}
                className={`p-4 rounded-lg border text-left transition-all ${
                  bodyType === 'esbelto'
                    ? 'bg-aurum-card border-aurum-gold text-white shadow-gold-sm scale-105'
                    : 'bg-aurum-card/60 border-aurum-border text-gray-400 hover:border-aurum-gold/40'
                }`}
              >
                <UserCheck className={`w-6 h-6 mb-2 ${bodyType === 'esbelto' ? 'text-aurum-gold' : 'text-gray-500'}`} />
                <h4 className="font-bold text-sm text-white mb-1">Esbelto / Slim</h4>
                <p className="text-[11px] leading-relaxed">Tórax e cintura alinhados. Busca caimento bem ajustado ao corpo.</p>
              </button>

              <button
                onClick={() => setBodyType('atletico')}
                className={`p-4 rounded-lg border text-left transition-all ${
                  bodyType === 'atletico'
                    ? 'bg-aurum-card border-aurum-gold text-white shadow-gold-sm scale-105'
                    : 'bg-aurum-card/60 border-aurum-border text-gray-400 hover:border-aurum-gold/40'
                }`}
              >
                <UserCheck className={`w-6 h-6 mb-2 ${bodyType === 'atletico' ? 'text-aurum-gold' : 'text-gray-500'}`} />
                <h4 className="font-bold text-sm text-white mb-1">Atlético</h4>
                <p className="text-[11px] leading-relaxed">Ombros e peitoral largos com cintura mais fina. Necessita estrutura no paletó.</p>
              </button>

              <button
                onClick={() => setBodyType('tradicional')}
                className={`p-4 rounded-lg border text-left transition-all ${
                  bodyType === 'tradicional'
                    ? 'bg-aurum-card border-aurum-gold text-white shadow-gold-sm scale-105'
                    : 'bg-aurum-card/60 border-aurum-border text-gray-400 hover:border-aurum-gold/40'
                }`}
              >
                <UserCheck className={`w-6 h-6 mb-2 ${bodyType === 'tradicional' ? 'text-aurum-gold' : 'text-gray-500'}`} />
                <h4 className="font-bold text-sm text-white mb-1">Tradicional</h4>
                <p className="text-[11px] leading-relaxed">Porte mais robusto ou busca o máximo de conforto e amplitude nos movimentos.</p>
              </button>
            </div>

            <div className="flex gap-4 pt-2">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 py-3 rounded bg-aurum-card border border-aurum-border text-gray-300 font-bold text-xs uppercase hover:bg-aurum-surface"
              >
                Voltar
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-2/3 py-3 rounded bg-gradient-to-r from-aurum-gold-dark via-aurum-gold to-aurum-gold-light text-black font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-gold-glow hover:brightness-110"
              >
                <span>Calcular Meu Tamanho</span>
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Results Recommendation Screen */}
        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-aurum-card p-6 rounded-lg border border-aurum-gold/40 shadow-gold-sm text-center space-y-4">
              <span className="text-xs font-bold text-aurum-gold uppercase tracking-widest block">
                Resultado do Provador Virtual
              </span>

              <div className="grid grid-cols-3 gap-3 py-2 border-y border-aurum-border/60">
                <div className="p-3 bg-aurum-surface rounded border border-aurum-border">
                  <span className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">Terno / Paletó</span>
                  <span className="text-xl font-bold text-aurum-gold font-serif block">{recommendation.suitSize}</span>
                </div>

                <div className="p-3 bg-aurum-surface rounded border border-aurum-border">
                  <span className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">Calça Social</span>
                  <span className="text-xl font-bold text-aurum-gold font-serif block">{recommendation.pantSize}</span>
                </div>

                <div className="p-3 bg-aurum-surface rounded border border-aurum-border">
                  <span className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">Camisa Social</span>
                  <span className="text-xl font-bold text-aurum-gold font-serif block">{recommendation.shirtSize}</span>
                </div>
              </div>

              <div className="text-left text-xs space-y-2 pt-1 text-gray-300">
                <p className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-aurum-gold flex-shrink-0 mt-0.5" />
                  <span><strong>Caimento Sugerido:</strong> {recommendation.fitAdvice}</span>
                </p>
                <p className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-aurum-gold flex-shrink-0 mt-0.5" />
                  <span><strong>Dica de Alfaiate:</strong> {recommendation.hemAdvice} Cortesia de bainha inclusa nos ateliês MF Alfaiataria.</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleReset}
                className="py-3 px-4 rounded bg-aurum-card border border-aurum-border text-gray-300 font-bold text-xs uppercase flex items-center justify-center gap-2 hover:bg-aurum-surface"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refazer Teste</span>
              </button>

              <button
                onClick={handleClose}
                className="flex-1 py-3 px-6 rounded bg-gradient-to-r from-aurum-gold-dark via-aurum-gold to-aurum-gold-light text-black font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-gold-glow hover:brightness-110"
              >
                <span>Ver Peças Recomendadas</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
