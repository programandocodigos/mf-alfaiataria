import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Bot, User, ChevronDown, Sparkles, ShoppingBag } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { useCart } from '../context/CartContext';

// ──────────────────────────────────────────────────────────────
// PRODUTO MATCHER — combina gostos com o catálogo real
// ──────────────────────────────────────────────────────────────
function matchProducts({ occasion, style, color, budget }) {
  let scored = PRODUCTS.map(p => {
    let score = 0;
    const occ = (p.occasion || '').toLowerCase();
    const fab = (p.fabric || '').toLowerCase();
    const fit = (p.fit || '').toLowerCase();
    const name = (p.name || '').toLowerCase();

    // Pontuação por ocasião
    if (occasion === 'casamento') {
      if (occ.includes('casamento') || occ.includes('noivado') || occ.includes('gala')) score += 4;
      if (p.category === 'ternos' || p.category === 'blazers') score += 2;
    }
    if (occasion === 'trabalho') {
      if (occ.includes('executivo') || occ.includes('corporativo') || occ.includes('negócios') || occ.includes('negocios')) score += 4;
      if (p.category === 'ternos' || p.category === 'camisas' || p.category === 'calcas') score += 2;
    }
    if (occasion === 'evento') {
      if (occ.includes('jantar') || occ.includes('evento') || occ.includes('noturno')) score += 4;
      if (p.category === 'blazers' || p.category === 'ternos') score += 2;
    }
    if (occasion === 'formatura') {
      if (occ.includes('formatura') || occ.includes('gala') || occ.includes('premiação') || occ.includes('premiacao')) score += 4;
      if (p.category === 'ternos' || p.category === 'acessorios') score += 2;
    }
    if (occasion === 'casual') {
      if (occ.includes('casual') || occ.includes('verão') || occ.includes('verao') || occ.includes('náutico')) score += 4;
      if (p.category === 'blazers' || p.category === 'camisas') score += 2;
    }

    // Pontuação por estilo
    if (style === 'classico') {
      if (fit.includes('classic') || fit.includes('clássic') || fit.includes('tradicional')) score += 3;
      if (name.includes('oxford') || name.includes('black-tie') || name.includes('firenze')) score += 2;
    }
    if (style === 'moderno') {
      if (fit.includes('slim') || fit.includes('modern')) score += 3;
      if (name.includes('slim') || name.includes('lombardia')) score += 2;
    }
    if (style === 'sartorial') {
      if (fit.includes('sartorial') || fit.includes('italian')) score += 3;
      if (fab.includes('lã') || fab.includes('super 1')) score += 2;
    }

    // Pontuação por cor
    if (color === 'azul') {
      if (name.includes('navy') || name.includes('azul') || name.includes('blue') || name.includes('ceilão')) score += 3;
    }
    if (color === 'cinza') {
      if (name.includes('cinza') || name.includes('charcoal') || name.includes('grafite') || name.includes('chumbo')) score += 3;
    }
    if (color === 'preto') {
      if (name.includes('preto') || name.includes('black') || name.includes('ônix') || name.includes('onyx')) score += 3;
    }
    if (color === 'claro') {
      if (name.includes('areia') || name.includes('bege') || name.includes('linho') || name.includes('branco') || name.includes('white')) score += 3;
    }

    // Pontuação por orçamento
    if (budget === 'ate1000' && p.price <= 1000) score += 2;
    if (budget === 'ate2000' && p.price <= 2000) score += 2;
    if (budget === 'acima2000' && p.price > 2000) score += 1;
    if (budget === 'qualquer') score += 0.5;

    // Bônus rating + destaque
    score += p.rating * 0.3;
    if (p.isFeatured) score += 1;

    return { ...p, _score: score };
  });

  // Filtra score mínimo e ordena, retorna top 4
  return scored
    .filter(p => p._score > 2)
    .sort((a, b) => b._score - a._score)
    .slice(0, 4);
}

// ──────────────────────────────────────────────────────────────
// GERADOR DE RESPOSTAS NATURAIS
// ──────────────────────────────────────────────────────────────
const GREETINGS_TRIGGERS = ['oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'hey', 'hello', 'tudo bem', 'tudo bom', 'e aí', 'e ai'];
const SIZE_TRIGGERS = ['tamanho', 'tam', 'medida', 'terno', 'numeração', 'numeracao', 'size'];
const DELIVERY_TRIGGERS = ['prazo', 'entrega', 'frete', 'envio', 'demora', 'quando chega', 'quanto tempo'];
const EXCHANGE_TRIGGERS = ['troca', 'devolução', 'devolucao', 'trocar', 'devolver', 'arrependimento'];
const PAYMENT_TRIGGERS = ['preço', 'preco', 'custa', 'valor', 'quanto', 'desconto', 'pix', 'parcel', 'pagamento'];
const WHATSAPP_TRIGGERS = ['whatsapp', 'zap', 'telefone', 'atendente', 'falar com', 'humano', 'pessoa'];
const COMBO_TRIGGERS = ['combinar', 'combina', 'look', 'conjunto', 'sugestão de look', 'outfit'];
const POPULAR_TRIGGERS = ['popular', 'mais vendido', 'top', 'melhor', 'favorito', 'destaque'];
const FABRIC_TRIGGERS = ['tecido', 'material', 'lã', 'seda', 'linho', 'algodão', 'composição'];
const SUGGEST_TRIGGERS = ['sugerir', 'sugestão', 'sugestao', 'recomendar', 'recomendação', 'recomendacao', 'indicar', 'ajuda', 'ajudar', 'quero', 'me mostre', 'procurando'];

function detectIntent(text) {
  const t = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (GREETINGS_TRIGGERS.some(x => t.includes(x))) return 'greeting';
  if (SIZE_TRIGGERS.some(x => t.includes(x))) return 'size';
  if (DELIVERY_TRIGGERS.some(x => t.includes(x))) return 'delivery';
  if (EXCHANGE_TRIGGERS.some(x => t.includes(x))) return 'exchange';
  if (PAYMENT_TRIGGERS.some(x => t.includes(x))) return 'payment';
  if (WHATSAPP_TRIGGERS.some(x => t.includes(x))) return 'whatsapp';
  if (COMBO_TRIGGERS.some(x => t.includes(x))) return 'combo';
  if (POPULAR_TRIGGERS.some(x => t.includes(x))) return 'popular';
  if (FABRIC_TRIGGERS.some(x => t.includes(x))) return 'fabric';
  if (SUGGEST_TRIGGERS.some(x => t.includes(x))) return 'suggest';
  return 'fallback';
}

const STATIC_RESPONSES = {
  greeting: [
    'Olá! Que bom ter você aqui na MF Alfaiataria! 😊 Posso te ajudar a encontrar o traje ideal, tirar dúvidas sobre tamanhos, prazos ou até montar um look especial. Como posso te atender hoje?',
    'Bem-vindo(a)! Sou o assistente virtual da MF Alfaiataria. Estou aqui para tornar sua experiência ainda mais exclusiva. Quer que eu te ajude a encontrar o traje perfeito para uma ocasião específica?',
  ],
  size: '📏 Para encontrar o tamanho ideal, recomendo usar nosso **Fit Finder** (botão na barra do site). Como guia rápido:\n\n• **Terno/Paletó**: meça seu tórax (cm) e divida por 2. Ex: 100cm → tamanho 50.\n• **Calça**: meça o quadril e consulte nossa tabela de medidas.\n• **Camisa Social**: meça a circunferência do colarinho em cm.\n\nTodos os nossos ternos são enviados com barra aberta para ajuste gratuito no ateliê! ✂️',
  delivery: '🚚 **Prazos de entrega:**\n\n• São Paulo capital: 1 a 3 dias úteis\n• Rio de Janeiro e demais capitais: 4 a 6 dias úteis\n• Interior e regiões remotas: 7 a 12 dias úteis\n\n✨ Frete VIP **gratuito** em compras acima de R$1.500! Envio em embalagem premium com cabide de madeira e capa de linho protetora.',
  exchange: '🔄 **Nossa política de trocas:**\n\n• Prazo de até **7 dias corridos** após o recebimento (CDC).\n• A peça precisa estar sem uso, com etiqueta original e na embalagem.\n• Trocas de tamanho são gratuitas na primeira solicitação.\n• Basta entrar em contato pelo WhatsApp com foto da peça e número do pedido.\n\nFazemos tudo de forma simples e sem burocracia! 😊',
  payment: '💰 **Formas de pagamento:**\n\n• **PIX**: 5% de desconto automático — o jeito mais vantajoso!\n• **Cartão de crédito**: até 10x sem juros nos principais cartões.\n• **Boleto bancário**: 3% de desconto, prazo 3 dias úteis.\n\nNossos preços variam de R$320 (acessórios) a R$3.450 (smoking exclusivo). Cada peça inclui embalagem premium e consultor disponível.',
  whatsapp: '📲 **Fale com um consultor de alfaiataria:**\n\n• **WhatsApp**: (11) 96349-7168\n• **E-mail**: contato@mfalfaiataria.com.br\n• **Horário**: Seg–Sáb, 10h às 21h | Dom: mediante agendamento\n\nNossos consultores são especialistas em moda masculina e vão te atender com toda atenção que você merece! 👔',
  combo: '👔 **Sugestões de combinação:**\n\n• **Terno Navy + Camisa Branca + Gravata Gold + Oxford Preto** → Clássico impecável para casamentos.\n• **Blazer Veludo Borgonha + Calça Grafite + Camisa Branca** → Elegância arrojada para jantares.\n• **Blazer de Linho Areia + Calça Creme + Mocassim** → Sofisticação relaxada para eventos diurnos.\n\n💡 Ao abrir qualquer produto no catálogo, veja a seção **"Complete o Look"** com sugestões automáticas!',
  popular: '⭐ **Os mais desejados da temporada:**\n\n🥇 **Terno Firenze Cinza Chumbo** — O preferido dos executivos, resistente a vincos.\n🥈 **Camisa Milano Algodão Egípcio** — A favorita dos noivos, maciez inesquecível.\n🥉 **Smoking Önyx Black-Tie** — Para quem quer o máximo da elegância formal.\n🏅 **Oxford Torino Goodyear Welted** — O sapato que dura para sempre.\n\nPosso te mostrar algum deles em detalhes?',
  fabric: '🧵 **Nossos principais tecidos:**\n\n• **Lã Super 120s/130s/140s** — Tecido italiano premium, levíssimo e resistente a vincos. Ideal para ternos completos.\n• **Algodão Egípcio 200 fios** — Fio extra-longo, maciez de seda. Exclusivo para nossas camisas.\n• **Seda Pura de Como (Itália)** — Gravatas e detalhes de smokings.\n• **Linho + Seda** — Blazers de verão, estrutura leve e respirável.\n\nCada tecido é selecionado diretamente em feiras europeias para garantir qualidade acima do padrão.',
  fallback: [
    'Entendi! Para garantir que te ajude da melhor forma, poderia me contar um pouco mais sobre o que está procurando? Por exemplo, é para uma ocasião especial, uso no trabalho ou um presente? 😊',
    'Boa pergunta! Sou especializado em moda masculina de alfaiataria. Posso te ajudar com sugestões de trajes, dúvidas sobre tamanhos, prazos de entrega ou montagem de look. O que precisa?',
    'Claro, estou aqui! Me conta um pouco mais sobre o que está buscando — assim posso te dar a orientação mais certeira possível. 👔',
  ],
};

function getStaticResponse(intent) {
  const r = STATIC_RESPONSES[intent] || STATIC_RESPONSES.fallback;
  if (Array.isArray(r)) return r[Math.floor(Math.random() * r.length)];
  return r;
}

// ──────────────────────────────────────────────────────────────
// ESTADOS DA CONVERSA DE DESCOBERTA
// ──────────────────────────────────────────────────────────────
const DISCOVERY_STATES = {
  idle: null,
  askOccasion: 'askOccasion',
  askStyle: 'askStyle',
  askColor: 'askColor',
  askBudget: 'askBudget',
  readyToSuggest: 'readyToSuggest',
  suggested: 'suggested',
};

const OCCASION_OPTIONS = [
  { label: '💍 Casamento / Noivado', value: 'casamento' },
  { label: '💼 Trabalho Executivo', value: 'trabalho' },
  { label: '🥂 Evento Social / Jantar', value: 'evento' },
  { label: '🎓 Formatura / Premiação', value: 'formatura' },
  { label: '🌴 Casual / Verão', value: 'casual' },
];
const STYLE_OPTIONS = [
  { label: '🏛️ Clássico Tradicional', value: 'classico' },
  { label: '✂️ Moderno / Slim Fit', value: 'moderno' },
  { label: '🇮🇹 Sartorial Italiano', value: 'sartorial' },
  { label: '🤷 Sem preferência', value: 'qualquer_estilo' },
];
const COLOR_OPTIONS = [
  { label: '🌊 Azul Marinho', value: 'azul' },
  { label: '🪨 Cinza / Grafite', value: 'cinza' },
  { label: '🖤 Preto Clássico', value: 'preto' },
  { label: '☀️ Tons Claros / Areia', value: 'claro' },
  { label: '🎨 Me surpreenda!', value: 'qualquer_cor' },
];
const BUDGET_OPTIONS = [
  { label: '💚 Até R$ 1.000', value: 'ate1000' },
  { label: '💛 Até R$ 2.000', value: 'ate2000' },
  { label: '💎 Acima de R$ 2.000', value: 'acima2000' },
  { label: '🤍 Sem restrição', value: 'qualquer' },
];

// ──────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ──────────────────────────────────────────────────────────────
export default function ChatbotWidget() {
  const { setBotSuggestions, setSelectedCategory } = useCart();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 0, from: 'bot',
      text: 'Olá! Sou o **Alfredo**, assistente virtual da MF Alfaiataria. 👔\n\nPosso te ajudar a encontrar o traje ideal, tirar dúvidas ou montar um look incrível. Como posso te atender?',
      quickOptions: ['✨ Quero uma sugestão personalizada', '📏 Ajuda com tamanhos', '🚚 Prazo de entrega', '🔄 Política de trocas', '⭐ Ver mais populares'],
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  // Discovery flow state
  const [discoveryState, setDiscoveryState] = useState(DISCOVERY_STATES.idle);
  const [profile, setProfile] = useState({ occasion: null, style: null, color: null, budget: null });
  const [pendingSuggestions, setPendingSuggestions] = useState([]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const addBotMessage = useCallback((text, quickOptions = null, delay = 800 + Math.random() * 600) => {
    setIsTyping(true);
    return new Promise(resolve => {
      setTimeout(() => {
        setMessages(prev => [...prev, { id: Date.now(), from: 'bot', text, quickOptions }]);
        setIsTyping(false);
        resolve();
      }, delay);
    });
  }, []);

  const addUserMessage = useCallback((text) => {
    setMessages(prev => [...prev, { id: Date.now(), from: 'user', text }]);
  }, []);

  // ── PROCESSAMENTO DA MENSAGEM ──
  const processMessage = useCallback(async (text) => {
    const lower = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // ── FLUXO DE DESCOBERTA ATIVO ──
    if (discoveryState === DISCOVERY_STATES.askOccasion) {
      const opt = OCCASION_OPTIONS.find(o => text.includes(o.label) || lower.includes(o.value));
      if (opt) {
        setProfile(p => ({ ...p, occasion: opt.value }));
        setDiscoveryState(DISCOVERY_STATES.askStyle);
        await addBotMessage(
          `Ótima escolha! ${opt.label.split(' ')[0]} para ${opt.value === 'casamento' ? 'um grande dia' : opt.value === 'trabalho' ? 'o dia a dia executivo' : 'uma noite especial'}.\n\nAgora me conta — qual estilo te representa melhor?`,
          STYLE_OPTIONS.map(o => o.label)
        );
      } else {
        await addBotMessage('Por favor, escolha uma das opções abaixo para eu poder te ajudar da melhor forma! 😊', OCCASION_OPTIONS.map(o => o.label));
      }
      return;
    }

    if (discoveryState === DISCOVERY_STATES.askStyle) {
      const opt = STYLE_OPTIONS.find(o => text.includes(o.label) || lower.includes(o.value) || (o.value === 'qualquer_estilo' && (lower.includes('qualquer') || lower.includes('sem preferencia'))));
      if (opt) {
        setProfile(p => ({ ...p, style: opt.value }));
        setDiscoveryState(DISCOVERY_STATES.askColor);
        const styleComment = opt.value === 'classico' ? 'Atemporal e elegante — uma escolha impecável!'
          : opt.value === 'moderno' ? 'Moderno e arrojado — você vai arrasar!'
          : opt.value === 'sartorial' ? 'O estilo italiano é o ápice da alfaiataria!'
          : 'Perfeito, deixa a seleção por minha conta!';
        await addBotMessage(
          `${styleComment} 👌\n\nE para as cores — o que te agrada mais?`,
          COLOR_OPTIONS.map(o => o.label)
        );
      } else {
        await addBotMessage('Qual desses estilos combina mais com você?', STYLE_OPTIONS.map(o => o.label));
      }
      return;
    }

    if (discoveryState === DISCOVERY_STATES.askColor) {
      const opt = COLOR_OPTIONS.find(o => text.includes(o.label) || lower.includes(o.value) || (o.value === 'qualquer_cor' && lower.includes('surpreenda')));
      if (opt) {
        setProfile(p => ({ ...p, color: opt.value }));
        setDiscoveryState(DISCOVERY_STATES.askBudget);
        await addBotMessage(
          `Excelente gosto! ${opt.label} é uma escolha muito elegante. 😍\n\nÚltima pergunta — qual faixa de investimento está considerando?`,
          BUDGET_OPTIONS.map(o => o.label)
        );
      } else {
        await addBotMessage('Qual tom você prefere?', COLOR_OPTIONS.map(o => o.label));
      }
      return;
    }

    if (discoveryState === DISCOVERY_STATES.askBudget) {
      const opt = BUDGET_OPTIONS.find(o => text.includes(o.label) || lower.includes(o.value) || (o.value === 'qualquer' && (lower.includes('qualquer') || lower.includes('sem restricao') || lower.includes('livre'))));
      if (opt) {
        const finalProfile = { ...profile, budget: opt.value };
        setProfile(finalProfile);
        setDiscoveryState(DISCOVERY_STATES.readyToSuggest);

        const matched = matchProducts(finalProfile);
        setPendingSuggestions(matched);

        if (matched.length === 0) {
          await addBotMessage(
            'Hmm, com esses filtros específicos o catálogo ficou sem resultados exatos. Mas posso te mostrar nossos destaques gerais — com certeza tem algo perfeito para você!',
            ['✅ Sim, me mostre os destaques!', '🔄 Tentar novamente']
          );
        } else {
          await addBotMessage(
            `Perfeito! Analisei todo o catálogo e encontrei **${matched.length} peça${matched.length > 1 ? 's' : ''}** que combinam exatamente com o que você descreveu. 🎯\n\nPosso te mostrar a seleção especial?`,
            ['✅ Sim, quero ver!', '🔄 Prefiro ajustar o perfil']
          );
        }
      } else {
        await addBotMessage('Qual faixa de investimento funciona para você?', BUDGET_OPTIONS.map(o => o.label));
      }
      return;
    }

    if (discoveryState === DISCOVERY_STATES.readyToSuggest) {
      if (lower.includes('sim') || lower.includes('quero ver') || lower.includes('mostre') || lower.includes('destaques') || lower.includes('yes')) {
        const toShow = pendingSuggestions.length > 0 ? pendingSuggestions : PRODUCTS.filter(p => p.isFeatured).slice(0, 4);
        setBotSuggestions(toShow);
        setSelectedCategory('bot-sugestao');
        setDiscoveryState(DISCOVERY_STATES.suggested);
        await addBotMessage(
          `Pronto! ✨ Ativei a aba **"✦ Sugestão do Alfredo"** no catálogo com ${toShow.length} peças selecionadas exclusivamente para você!\n\nDeslize até o catálogo para conferir. Se quiser adicionar ao carrinho ou ver os detalhes de alguma peça, é só clicar nela. Posso ajudar com mais alguma coisa? 😊`,
          ['👔 Ver mais sugestões', '📏 Ajuda com tamanhos', '📲 Falar com consultor']
        );
      } else if (lower.includes('ajustar') || lower.includes('tentar') || lower.includes('não') || lower.includes('nao')) {
        setDiscoveryState(DISCOVERY_STATES.askOccasion);
        setProfile({ occasion: null, style: null, color: null, budget: null });
        await addBotMessage(
          'Sem problemas! Vamos recomeçar. 😊\n\nPara qual ocasião você está procurando o traje?',
          OCCASION_OPTIONS.map(o => o.label)
        );
      } else {
        await addBotMessage('Posso te mostrar a seleção personalizada?', ['✅ Sim, quero ver!', '🔄 Ajustar preferências']);
      }
      return;
    }

    if (discoveryState === DISCOVERY_STATES.suggested) {
      if (lower.includes('mais sugest') || lower.includes('ver mais') || lower.includes('outra sugest')) {
        setDiscoveryState(DISCOVERY_STATES.askOccasion);
        setProfile({ occasion: null, style: null, color: null, budget: null });
        await addBotMessage(
          'Vamos montar uma nova seleção! Para qual ocasião desta vez?',
          OCCASION_OPTIONS.map(o => o.label)
        );
        return;
      }
    }

    // ── INTENÇÕES LIVRES (fora do fluxo de descoberta) ──
    const intent = detectIntent(text);

    if (intent === 'suggest' || (lower.includes('quero uma sugest') || lower.includes('personalizada') || lower.includes('ajuda escolher'))) {
      setDiscoveryState(DISCOVERY_STATES.askOccasion);
      setProfile({ occasion: null, style: null, color: null, budget: null });
      await addBotMessage(
        'Com prazer! Vou te ajudar a encontrar o traje perfeito. 🎯\n\nPara começar — para qual ocasião você está buscando o look?',
        OCCASION_OPTIONS.map(o => o.label)
      );
      return;
    }

    await addBotMessage(getStaticResponse(intent));
  }, [discoveryState, profile, pendingSuggestions, addBotMessage, setBotSuggestions, setSelectedCategory]);

  const sendMessage = (text) => {
    if (!text.trim() || isTyping) return;
    addUserMessage(text.trim());
    setInputValue('');
    processMessage(text.trim());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  // Renderiza texto com **bold**
  const renderText = (text) =>
    text.split('**').map((part, i) =>
      i % 2 === 1
        ? <strong key={i} className="text-white font-semibold">{part}</strong>
        : <span key={i}>{part}</span>
    );

  const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  return (
    <>
      {/* ── PAINEL DE CHAT ── */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 flex flex-col rounded-2xl overflow-hidden border border-aurum-gold/40 shadow-gold-glow animate-fadeIn"
          style={{ maxHeight: 'calc(100vh - 120px)' }}>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-aurum-card via-aurum-surface to-aurum-card border-b border-aurum-border/60 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-aurum-gold-dark via-aurum-gold to-aurum-gold-light flex items-center justify-center shadow-gold-sm">
                <Bot className="w-4 h-4 text-black" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Alfredo — Consultor MF</p>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  Online agora
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-aurum-hover transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-aurum-bg/95 backdrop-blur-md">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2 ${msg.from === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 ${
                  msg.from === 'bot' ? 'bg-aurum-gold/20 border border-aurum-gold/30 text-aurum-gold' : 'bg-aurum-surface border border-aurum-border text-gray-300'
                }`}>
                  {msg.from === 'bot' ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                </div>
                <div className="flex flex-col gap-2 max-w-[85%]">
                  <div className={`px-3 py-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                    msg.from === 'bot'
                      ? 'bg-aurum-surface border border-aurum-border text-gray-200 rounded-tl-none'
                      : 'bg-gradient-to-r from-aurum-gold-dark to-aurum-gold text-black font-medium rounded-tr-none'
                  }`}>
                    {renderText(msg.text)}
                  </div>
                  {/* Quick Options */}
                  {msg.from === 'bot' && msg.quickOptions && (
                    <div className="flex flex-wrap gap-1.5">
                      {msg.quickOptions.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => sendMessage(opt)}
                          disabled={isTyping}
                          className="text-[10px] px-2.5 py-1.5 rounded-full bg-aurum-surface border border-aurum-gold/30 text-aurum-gold hover:bg-aurum-gold/10 hover:border-aurum-gold transition-all disabled:opacity-50"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-2 items-center">
                <div className="w-6 h-6 rounded-full bg-aurum-gold/20 border border-aurum-gold/30 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 text-aurum-gold" />
                </div>
                <div className="bg-aurum-surface border border-aurum-border rounded-2xl rounded-tl-none px-4 py-2.5 flex gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-aurum-gold animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-aurum-gold animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-aurum-gold animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 px-3 py-3 bg-aurum-card border-t border-aurum-border/60 flex-shrink-0">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isTyping ? 'Alfredo está digitando...' : 'Digite sua mensagem...'}
              disabled={isTyping}
              className="flex-1 bg-aurum-surface border border-aurum-border rounded-full px-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-aurum-gold disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="w-8 h-8 rounded-full bg-gradient-to-r from-aurum-gold-dark to-aurum-gold flex items-center justify-center text-black disabled:opacity-40 hover:brightness-110 transition-all shadow-gold-sm"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* ── FAB BUTTON ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Abrir chat de atendimento"
        className={`fixed bottom-6 right-24 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-gold-glow hover:scale-110 transition-all duration-300 border border-aurum-gold/40 ${
          isOpen ? 'bg-aurum-surface text-aurum-gold' : 'bg-gradient-to-tr from-aurum-gold-dark via-aurum-gold to-aurum-gold-light text-black'
        }`}
      >
        {isOpen ? <ChevronDown className="w-6 h-6" /> : <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />}
        {!isOpen && hasUnread && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center border border-aurum-bg">
            1
          </span>
        )}
      </button>
    </>
  );
}
