import React, { useState } from 'react';
import { X, Send, CheckCircle2, MapPin, User, Phone, FileText, ShoppingBag, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export default function CheckoutModal() {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    cartSubtotal, 
    clearCart 
  } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    cep: '',
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: 'SP',
    notes: '',
    paymentPreference: 'PIX (5% de Desconto)'
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isCheckoutOpen) return null;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.street) {
      alert('Por favor, preencha o Nome, Telefone e Endereço de entrega.');
      return;
    }

    setSubmitting(true);

    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#F5E6AD', '#AA8518', '#6B1D2F']
      });
    } catch (e) {
      console.log('Confetti effect executed');
    }

    // Build Formatted WhatsApp Message
    const targetPhoneNumber = "5511963497168"; // MF Alfaiataria Store WhatsApp
    
    let messageText = `👑 *PEDIDO MF ALFAIATARIA*\n`;
    messageText += `-------------------------------------------\n`;
    messageText += `👤 *CLIENTE:* ${formData.name}\n`;
    messageText += `📱 *WHATSAPP:* ${formData.phone}\n`;
    messageText += `📍 *ENDEREÇO:* ${formData.street}, Nº ${formData.number} ${formData.neighborhood ? '- ' + formData.neighborhood : ''} (${formData.city}/${formData.state}) CEP: ${formData.cep || 'N/I'}\n`;
    messageText += `💳 *PAGAMENTO:* ${formData.paymentPreference}\n`;
    
    if (formData.notes) {
      messageText += `✏️ *AJUSTES/OBSERVAÇÕES:* ${formData.notes}\n`;
    }

    messageText += `-------------------------------------------\n`;
    messageText += `👔 *ITENS DO PEDIDO:*\n`;

    cart.forEach((item, index) => {
      messageText += `${index + 1}. *${item.name}*\n`;
      messageText += `   • Tam: *${item.size}* | Qtd: ${item.quantity}x | Preço: ${formatCurrency(item.price * item.quantity)}\n`;
    });

    messageText += `-------------------------------------------\n`;
    messageText += `💰 *VALOR TOTAL:* *${formatCurrency(cartSubtotal)}*\n`;
    messageText += `-------------------------------------------\n`;
    messageText += `Gostaria de confirmar a disponibilidade e prazos de entrega deste pedido. Obrigado!`;

    // Build Order Payload for Firestore (Ensuring NO undefined values)
    const orderItems = cart.map(item => ({
      productId: String(item.id || item.cartItemId || 'N/A'),
      name: String(item.name || 'Produto'),
      size: String(item.size || 'Tamanho Único'),
      quantity: Number(item.quantity) || 1,
      price: Number(item.price) || 0,
      costPrice: Number(item.costPrice) || (Number(item.price || 0) * 0.45)
    }));

    const orderPayload = {
      items: orderItems,
      totalAmount: Number(cartSubtotal) || 0,
      customer: {
        name: String(formData.name || '').trim(),
        phone: String(formData.phone || '').trim(),
        cep: String(formData.cep || '').trim(),
        street: String(formData.street || '').trim(),
        number: String(formData.number || '').trim(),
        neighborhood: String(formData.neighborhood || '').trim(),
        city: String(formData.city || '').trim(),
        state: String(formData.state || 'SP'),
        notes: String(formData.notes || '').trim()
      },
      paymentPreference: String(formData.paymentPreference || 'PIX'),
      status: 'pendente',
      createdAt: serverTimestamp()
    };

    // Await Order Document creation in Firestore
    try {
      const docRef = await addDoc(collection(db, 'pedidos'), orderPayload);
      console.log("✅ Pedido registrado no Firestore com ID:", docRef.id);
    } catch (err) {
      console.error("❌ Erro ao registrar pedido no Firestore:", err);
    } finally {
      setSubmitting(false);
    }

    const encodedMessage = encodeURIComponent(messageText);
    const waUrl = `https://wa.me/${targetPhoneNumber}?text=${encodedMessage}`;

    setWhatsappUrl(waUrl);
    setIsSuccess(true);

    // Open WhatsApp in a new tab
    window.open(waUrl, '_blank');
  };

  const handleFinish = () => {
    clearCart();
    setIsSuccess(false);
    setIsCheckoutOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      
      {/* Background Backdrop */}
      <div 
        className="fixed inset-0 cursor-pointer"
        onClick={() => !isSuccess && setIsCheckoutOpen(false)}
      ></div>

      <div className="relative w-full max-w-2xl bg-aurum-card border border-aurum-gold/40 rounded-2xl shadow-gold-glow overflow-hidden z-10 animate-scaleUp my-8">
        
        {/* Header */}
        <div className="bg-aurum-surface px-6 py-4 border-b border-aurum-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-aurum-gold/10 border border-aurum-gold/30 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-aurum-gold" />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-white">Finalizar Pedido VIP</h2>
              <p className="text-xs text-gray-400">Atendimento personalizado direto com o Alfaiate</p>
            </div>
          </div>
          <button 
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-aurum-hover transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSuccess ? (
            /* Success State */
            <div className="text-center py-8 space-y-6 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-aurum-gold/20 border-2 border-aurum-gold flex items-center justify-center mx-auto text-aurum-gold shadow-gold-glow">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-xl font-serif font-bold text-white mb-2">Pedido Enviado com Sucesso!</h3>
                <p className="text-xs text-gray-300 max-w-md mx-auto leading-relaxed">
                  Seu pedido foi registrado em nosso sistema e o WhatsApp da loja foi aberto em uma nova aba com o resumo da compra formatado.
                </p>
              </div>

              <div className="bg-aurum-surface/80 p-4 rounded-xl border border-aurum-gold/30 max-w-md mx-auto text-left space-y-2">
                <div className="flex justify-between text-xs text-gray-400 border-b border-aurum-border pb-2">
                  <span>Status do Pedido:</span>
                  <span className="text-amber-400 font-semibold uppercase">Pendente de Confirmação</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Valor Total:</span>
                  <span className="text-aurum-gold font-bold">{formatCurrency(cartSubtotal)}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Reabrir WhatsApp (+55 11 96349-7168)</span>
                </a>
                <button
                  onClick={handleFinish}
                  className="px-6 py-3 rounded-md bg-aurum-surface hover:bg-aurum-hover border border-aurum-gold/40 text-aurum-gold font-bold uppercase tracking-wider text-xs transition-all"
                >
                  Concluir & Voltar à Loja
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              
              {/* Delivery Address Section */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-aurum-gold uppercase tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>1. Dados de Contato e Entrega</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-gray-300 font-semibold mb-1">Nome Completo *</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Ex: Carlos Eduardo Silva"
                      className="w-full bg-aurum-surface border border-aurum-border rounded-md px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-aurum-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-gray-300 font-semibold mb-1">Telefone / WhatsApp *</label>
                    <input 
                      type="tel" 
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Ex: (11) 99887-6655"
                      className="w-full bg-aurum-surface border border-aurum-border rounded-md px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-aurum-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-gray-300 font-semibold mb-1">CEP</label>
                    <input 
                      type="text" 
                      name="cep"
                      value={formData.cep}
                      onChange={handleChange}
                      placeholder="00000-000"
                      className="w-full bg-aurum-surface border border-aurum-border rounded-md px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-aurum-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-gray-300 font-semibold mb-1">Endereço (Rua / Av) *</label>
                    <input 
                      type="text" 
                      name="street"
                      required
                      value={formData.street}
                      onChange={handleChange}
                      placeholder="Rua das Camélias"
                      className="w-full bg-aurum-surface border border-aurum-border rounded-md px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-aurum-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-gray-300 font-semibold mb-1">Número</label>
                    <input 
                      type="text" 
                      name="number"
                      value={formData.number}
                      onChange={handleChange}
                      placeholder="123"
                      className="w-full bg-aurum-surface border border-aurum-border rounded-md px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-aurum-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-gray-300 font-semibold mb-1">Bairro</label>
                    <input 
                      type="text" 
                      name="neighborhood"
                      value={formData.neighborhood}
                      onChange={handleChange}
                      placeholder="Jardins"
                      className="w-full bg-aurum-surface border border-aurum-border rounded-md px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-aurum-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-gray-300 font-semibold mb-1">Cidade</label>
                    <input 
                      type="text" 
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="São Paulo"
                      className="w-full bg-aurum-surface border border-aurum-border rounded-md px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-aurum-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-gray-300 font-semibold mb-1">Estado</label>
                    <select 
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full bg-aurum-surface border border-aurum-border rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-aurum-gold cursor-pointer"
                    >
                      <option value="SP">São Paulo (SP)</option>
                      <option value="RJ">Rio de Janeiro (RJ)</option>
                      <option value="MG">Minas Gerais (MG)</option>
                      <option value="PR">Paraná (PR)</option>
                      <option value="RS">Rio Grande do Sul (RS)</option>
                      <option value="SC">Santa Catarina (SC)</option>
                      <option value="DF">Distrito Federal (DF)</option>
                      <option value="OUTRO">Outro Estado</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment & Observations Section */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-aurum-gold uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>2. Preferência de Pagamento & Ajustes</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-gray-300 font-semibold mb-1">Forma de Pagamento Preferencial</label>
                    <select
                      name="paymentPreference"
                      value={formData.paymentPreference}
                      onChange={handleChange}
                      className="w-full bg-aurum-surface border border-aurum-border rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-aurum-gold cursor-pointer"
                    >
                      <option value="PIX (5% de Desconto)">PIX (5% de Desconto À Vista)</option>
                      <option value="Cartão de Crédito (até 10x)">Cartão de Crédito (até 10x sem juros)</option>
                      <option value="Boleto Bancário">Boleto Bancário (3% Desconto)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-gray-300 font-semibold mb-1">Ajustes de Barra / Observações <span className="text-gray-500 font-normal">(Opcional)</span></label>
                    <input 
                      type="text" 
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Ex: Gostaria da barra com sobra de 4cm"
                      className="w-full bg-aurum-surface border border-aurum-border rounded-md px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-aurum-gold"
                    />
                  </div>
                </div>
              </div>

              {/* Order Summary Box */}
              <div className="bg-aurum-surface/50 p-4 rounded-xl border border-aurum-border/60 space-y-2">
                <div className="flex justify-between text-xs text-gray-300">
                  <span>Itens no Carrinho:</span>
                  <span className="font-semibold">{cart.length} produto(s)</span>
                </div>
                <div className="flex justify-between text-xs text-gray-300">
                  <span>Frete para o endereço:</span>
                  <span className="text-emerald-400 font-semibold">
                    {cartSubtotal >= 1500 ? 'GRÁTIS (Pedido VIP)' : 'A calcular no WhatsApp'}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white border-t border-aurum-border/60 pt-2">
                  <span>Valor Total Estimado:</span>
                  <span className="text-aurum-gold text-base">{formatCurrency(cartSubtotal)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="px-5 py-3 rounded-md border border-aurum-border hover:border-aurum-gold text-gray-300 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 rounded-md bg-gradient-to-r from-aurum-gold-dark via-aurum-gold to-aurum-gold-light text-black font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-gold-glow hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (
                    <span>Registrando Pedido...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Enviar Pedido via WhatsApp</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}
