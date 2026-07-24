import React, { useState } from 'react';
import { X, Send, CheckCircle2, MapPin, User } from 'lucide-react';
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

  if (!isCheckoutOpen) return null;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.street) {
      alert('Por favor, preencha o Nome, Telefone e Endereço de entrega.');
      return;
    }

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
    const targetPhoneNumber = "5511999999999"; // Ateliê Store WhatsApp
    
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

    // Build Order Payload for Firestore
    const orderItems = cart.map(item => ({
      productId: item.id || null,
      name: item.name,
      size: item.size,
      quantity: item.quantity,
      price: item.price,
      costPrice: item.costPrice || (item.price * 0.45) // fallback estimated 45% cost if undefined
    }));

    const orderPayload = {
      items: orderItems,
      totalAmount: cartSubtotal,
      customer: {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        cep: formData.cep.trim(),
        street: formData.street.trim(),
        number: formData.number.trim(),
        neighborhood: formData.neighborhood.trim(),
        city: formData.city.trim(),
        state: formData.state,
        notes: formData.notes.trim()
      },
      paymentPreference: formData.paymentPreference,
      status: 'pendente',
      createdAt: serverTimestamp()
    };

    // Save Order asynchronously to Firestore
    try {
      addDoc(collection(db, 'pedidos'), orderPayload).catch(err => {
        console.error("Erro assíncrono ao salvar pedido no Firestore:", err);
      });
    } catch (err) {
      console.error("Erro ao registrar pedido:", err);
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

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-aurum-surface rounded-xl border border-aurum-gold/40 shadow-card-dark overflow-hidden z-10 p-6 sm:p-8 my-8">
        
        <button
          onClick={() => setIsCheckoutOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-white bg-aurum-bg/80 border border-aurum-gold/20"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          /* SUCCESS SCREEN */
          <div className="text-center py-8 space-y-6 animate-fadeIn">
            <div className="w-20 h-20 mx-auto rounded-full bg-aurum-gold/20 border-2 border-aurum-gold flex items-center justify-center text-aurum-gold shadow-gold-glow">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div>
              <h3 className="font-serif text-3xl font-bold text-white mb-2">Pedido Enviado com Sucesso!</h3>
              <p className="text-gray-300 text-sm max-w-md mx-auto leading-relaxed">
                Seu resumo de pedido foi gerado e o WhatsApp da MF Alfaiataria foi aberto para finalizar o atendimento exclusivo.
              </p>
            </div>

            <div className="bg-aurum-card p-4 rounded-lg border border-aurum-border max-w-md mx-auto text-left text-xs space-y-2 text-gray-300">
              <div className="flex justify-between border-b border-aurum-border/40 pb-2">
                <span className="text-gray-400">Cliente:</span>
                <span className="font-bold text-white">{formData.name}</span>
              </div>
              <div className="flex justify-between border-b border-aurum-border/40 pb-2">
                <span className="text-gray-400">Itens:</span>
                <span className="font-bold text-aurum-gold">{cart.length} produto(s)</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-gray-400">Total:</span>
                <span className="font-bold text-aurum-gold text-sm">{formatCurrency(cartSubtotal)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-6 py-3 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Reabrir WhatsApp</span>
                </a>
              )}

              <button
                onClick={handleFinish}
                className="w-full sm:w-auto px-8 py-3 rounded bg-aurum-gold hover:brightness-110 text-black font-bold text-xs uppercase tracking-wider transition-all"
              >
                Voltar à Loja
              </button>
            </div>
          </div>
        ) : (
          /* CHECKOUT FORM */
          <div>
            <div className="mb-6 pb-4 border-b border-aurum-border/60">
              <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                <span>Finalizar Pedido — MF Alfaiataria WhatsApp</span>
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Preencha seus dados para montarmos a ordem de pedido e encaminharmos diretamente ao consultor da MF Alfaiataria.
              </p>
            </div>

            <form onSubmit={handleSubmitOrder} className="space-y-6">
              
              {/* Customer Info Section */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-aurum-gold flex items-center gap-1.5">
                  <User className="w-4 h-4" /> Dados Pessoais
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Nome Completo *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Ex: Gabriel Siqueira"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-aurum-card text-white text-xs px-3.5 py-2.5 rounded border border-aurum-border focus:outline-none focus:border-aurum-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">WhatsApp / Telefone *</label>
                    <input
                      type="text"
                      name="phone"
                      required
                      placeholder="Ex: (11) 99887-6655"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-aurum-card text-white text-xs px-3.5 py-2.5 rounded border border-aurum-border focus:outline-none focus:border-aurum-gold"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address Section */}
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-aurum-gold flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> Endereço de Entrega
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-300 mb-1">Rua / Avenida *</label>
                    <input
                      type="text"
                      name="street"
                      required
                      placeholder="Ex: Av. Brigadeiro Faria Lima"
                      value={formData.street}
                      onChange={handleChange}
                      className="w-full bg-aurum-card text-white text-xs px-3.5 py-2.5 rounded border border-aurum-border focus:outline-none focus:border-aurum-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Número *</label>
                    <input
                      type="text"
                      name="number"
                      required
                      placeholder="Ex: 1450, Apt 12"
                      value={formData.number}
                      onChange={handleChange}
                      className="w-full bg-aurum-card text-white text-xs px-3.5 py-2.5 rounded border border-aurum-border focus:outline-none focus:border-aurum-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Bairro</label>
                    <input
                      type="text"
                      name="neighborhood"
                      placeholder="Ex: Itaim Bibi"
                      value={formData.neighborhood}
                      onChange={handleChange}
                      className="w-full bg-aurum-card text-white text-xs px-3.5 py-2.5 rounded border border-aurum-border focus:outline-none focus:border-aurum-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Cidade</label>
                    <input
                      type="text"
                      name="city"
                      placeholder="Ex: São Paulo"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full bg-aurum-card text-white text-xs px-3.5 py-2.5 rounded border border-aurum-border focus:outline-none focus:border-aurum-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">CEP</label>
                    <input
                      type="text"
                      name="cep"
                      placeholder="Ex: 01452-002"
                      value={formData.cep}
                      onChange={handleChange}
                      className="w-full bg-aurum-card text-white text-xs px-3.5 py-2.5 rounded border border-aurum-border focus:outline-none focus:border-aurum-gold"
                    />
                  </div>
                </div>
              </div>

              {/* Special Instructions / Notes */}
              <div className="pt-2">
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Observações de Ajustes ou Preferências de Horário:
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  placeholder="Ex: Gostaria de solicitar bainha com 104cm de comprimento e abotoadura de reserva."
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full bg-aurum-card text-white text-xs p-3 rounded border border-aurum-border focus:outline-none focus:border-aurum-gold"
                ></textarea>
              </div>

              {/* Order Items Recap */}
              <div className="bg-aurum-card p-4 rounded-lg border border-aurum-border/60">
                <div className="flex items-center justify-between text-xs font-bold text-white mb-2">
                  <span>Resumo do Pedido ({cart.length} itens)</span>
                  <span className="text-aurum-gold text-sm font-extrabold">{formatCurrency(cartSubtotal)}</span>
                </div>
                <div className="max-h-24 overflow-y-auto space-y-1.5 text-xs text-gray-300 pr-2">
                  {cart.map(item => (
                    <div key={item.cartItemId} className="flex justify-between items-center text-[11px]">
                      <span className="truncate max-w-[240px]">{item.quantity}x {item.name} ({item.size})</span>
                      <span className="font-semibold text-aurum-gold-champagne">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 rounded bg-gradient-to-r from-aurum-gold-dark via-aurum-gold to-aurum-gold-light text-black font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-gold-glow hover:brightness-110 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Confirmar &amp; Enviar Pedido no WhatsApp</span>
              </button>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}
