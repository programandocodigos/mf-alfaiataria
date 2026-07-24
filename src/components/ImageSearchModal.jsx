import React, { useState, useRef } from 'react';
import { X, Camera, Search, Sparkles, Upload, Eye, ShoppingBag, Zap } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { useCart } from '../context/CartContext';

// Simulated "visual search" picks 3 products matching the uploaded image
function simulateImageSearch(file) {
  // In production: send to Google Vision API / AWS Rekognition / custom ML model
  // Simulate a smart result by picking 3 random featured products
  const featured = PRODUCTS.filter(p => p.isFeatured);
  const shuffled = featured.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
}

export default function ImageSearchModal({ isOpen, onClose }) {
  const { setSelectedProductDetail, addToCart } = useCart();
  const [stage, setStage] = useState('upload'); // upload | analyzing | results
  const [preview, setPreview] = useState(null);
  const [results, setResults] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setStage('analyzing');

    // Simulate processing delay
    setTimeout(() => {
      setResults(simulateImageSearch(file));
      setStage('results');
    }, 2800);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleClose = () => {
    setStage('upload');
    setPreview(null);
    setResults([]);
    onClose();
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-aurum-card rounded-2xl border border-aurum-gold/30 shadow-gold-glow overflow-hidden animate-fadeIn">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-aurum-border/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-aurum-gold/10 border border-aurum-gold/30 flex items-center justify-center">
              <Camera className="w-5 h-5 text-aurum-gold" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-serif">Busca por Imagem</h2>
              <p className="text-[11px] text-gray-400">Envie uma foto e encontramos o look ideal</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full text-gray-500 hover:text-white hover:bg-aurum-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* AI Notice Banner */}
          <div className="mb-5 px-4 py-3 rounded-xl bg-aurum-gold/5 border border-aurum-gold/20 flex items-start gap-3">
            <Zap className="w-4 h-4 text-aurum-gold flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-gray-400 leading-relaxed">
              <span className="text-aurum-gold font-semibold">Tecnologia IA Visual</span> — Esta funcionalidade simula a busca inteligente por imagem. 
              Para ativação com IA real (Google Vision / AWS Rekognition), entre em contato com nossa equipe.
            </p>
          </div>

          {/* Upload Stage */}
          {stage === 'upload' && (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all ${
                dragOver 
                  ? 'border-aurum-gold bg-aurum-gold/10' 
                  : 'border-aurum-border/60 hover:border-aurum-gold/50 hover:bg-aurum-surface/50'
              }`}
            >
              <div className="w-16 h-16 rounded-full bg-aurum-gold/10 border border-aurum-gold/30 flex items-center justify-center">
                <Upload className="w-8 h-8 text-aurum-gold" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-white mb-1">Arraste ou clique para enviar</p>
                <p className="text-xs text-gray-500">PNG, JPG ou WEBP — máx. 10MB</p>
              </div>
              <div className="flex gap-2 flex-wrap justify-center">
                {['Foto de revista', 'Print de rede social', 'Foto de roupa', 'Printscreen de site'].map(ex => (
                  <span key={ex} className="px-2 py-1 rounded-full text-[10px] bg-aurum-surface border border-aurum-border text-gray-400">
                    {ex}
                  </span>
                ))}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
            </div>
          )}

          {/* Analyzing Stage */}
          {stage === 'analyzing' && (
            <div className="flex flex-col items-center gap-6 py-8">
              {preview && (
                <div className="relative">
                  <img src={preview} alt="preview" className="w-32 h-32 rounded-xl object-cover border border-aurum-gold/30" />
                  <div className="absolute inset-0 rounded-xl border-2 border-aurum-gold animate-ping opacity-30"></div>
                </div>
              )}
              <div className="flex flex-col items-center gap-3">
                <div className="flex gap-2">
                  {['Detectando estilo...', 'Analisando tecidos...', 'Buscando produtos...'].map((step, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full bg-aurum-gold animate-bounce`} style={{ animationDelay: `${idx * 200}ms` }}></span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-aurum-gold font-medium animate-pulse">
                  Analisando sua imagem com IA...
                </p>
                <p className="text-xs text-gray-500">Detectando estilo, cor e tipo de peça</p>
              </div>
              {/* Progress bar */}
              <div className="w-48 h-1 bg-aurum-surface rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-aurum-gold-dark to-aurum-gold animate-[shimmer_1.5s_infinite]" style={{ width: '70%' }}></div>
              </div>
            </div>
          )}

          {/* Results Stage */}
          {stage === 'results' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-aurum-gold" />
                <p className="text-sm font-semibold text-white">Produtos similares encontrados</p>
              </div>

              {results.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-3 bg-aurum-surface rounded-xl border border-aurum-border hover:border-aurum-gold/40 transition-all"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-20 h-24 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex flex-col justify-between flex-1 min-w-0">
                    <div>
                      <p className="text-[10px] text-aurum-gold uppercase font-semibold tracking-wider">{product.category}</p>
                      <p className="text-xs font-semibold text-white line-clamp-2 mt-0.5">{product.name}</p>
                      <p className="text-[10px] text-gray-400 mt-1 line-clamp-2">{product.fabric}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-sm font-bold text-aurum-gold-champagne">{formatCurrency(product.price)}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedProductDetail(product)}
                          className="p-1.5 rounded-lg bg-aurum-card border border-aurum-border hover:border-aurum-gold/40 text-gray-400 hover:text-aurum-gold transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => addToCart(product, product.sizes[0], 1)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-aurum-gold/20 border border-aurum-gold/40 text-aurum-gold text-[10px] font-bold hover:bg-aurum-gold/30 transition-colors"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Adicionar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={() => { setStage('upload'); setPreview(null); setResults([]); }}
                className="w-full py-2.5 text-xs text-gray-400 hover:text-aurum-gold border border-aurum-border hover:border-aurum-gold/40 rounded-xl transition-colors"
              >
                Enviar outra imagem
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
