export const CATEGORIES = [
  { id: 'todos', label: 'Todos os Produtos', count: 12 },
  { id: 'ternos', label: 'Ternos Completos', count: 4 },
  { id: 'blazers', label: 'Blazers & Costumes', count: 3 },
  { id: 'camisas', label: 'Camisas Sociais', count: 3 },
  { id: 'calcas', label: 'Calças Alfaiataria', count: 2 },
  { id: 'acessorios', label: 'Gravatas & Acessórios', count: 3 },
  { id: 'sapatos', label: 'Sapatos Social', count: 2 },
];

export const PRODUCTS = [
  {
    id: 'terno-lombardia-navy',
    name: 'Terno Completo Lombardia Navy Super 140s',
    category: 'ternos',
    price: 2890.00,
    oldPrice: 3200.00,
    rating: 4.9,
    reviewsCount: 28,
    isFeatured: true,
    badge: 'Lã Super 140s',
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1000&q=80'
    ],
    fabric: '100% Lã Fria Australiana Super 140s com Forro em Bemberg®',
    fit: 'Slim Sartorial (Ombros estruturados e cintura ajustada)',
    occasion: 'Casamentos Nobres, Formaturas, Reuniões de Conselho & Eventos Noturnos',
    description: 'Confeccionado com lã italiana de finura extraordinária, o Terno Lombardia Navy alia a sofisticação da alfaiataria de Milão com o conforto do caimento moderno. Possui paletó com entretela em crina de cavalo meia-tela (half-canvas) que molda-se perfeitamente ao corpo.',
    sizes: ['46 (PP)', '48 (P)', '50 (M)', '52 (G)', '54 (GG)', '56 (XG)'],
    details: [
      'Paletó de 2 botões de chifre genuíno',
      'Lapela de bico (Peak Lapel) de 8.5cm',
      'Fenda dupla traseira para liberdade de movimento',
      'Calça com ajuste lateral por fivela e bolso faca',
      'Acompanha cabide de madeira e capa protetora MF Alfaiataria'
    ]
  },
  {
    id: 'terno-onyx-black-tie',
    name: 'Smoking Tuxedo Önyx Black-Tie',
    category: 'ternos',
    price: 3450.00,
    oldPrice: null,
    rating: 5.0,
    reviewsCount: 14,
    isFeatured: true,
    badge: 'Exclusivo',
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1598808503746-f34c53b9323e?auto=format&fit=crop&w=1000&q=80'
    ],
    fabric: 'Lã Fria Italiana com Detalhes em Seda Pura de Como',
    fit: 'Classic Tailored Elegance',
    occasion: 'Gala Black-Tie, Premiações, Jantares de Estado & Noivados',
    description: 'O ápice da elegância masculina formal. Este Smoking Tuxedo apresenta lapela em cetim de seda negra e botões encapados, transmitindo o máximo prestígio das tradições de gala europeias.',
    sizes: ['46 (PP)', '48 (P)', '50 (M)', '52 (G)', '54 (GG)', '56 (XG)'],
    details: [
      'Lapela Xale (Shawl Collar) em 100% Seda Pura',
      'Fechamento por 1 botão encapado em seda',
      'Calça com galão lateral de cetim de seda',
      'Forro interno em jacquard com monograma MF Alfaiataria gold'
    ]
  },
  {
    id: 'blazer-roma-burgundy',
    name: 'Blazer Alfaiataria Roma Veludo Borgonha',
    category: 'blazers',
    price: 1890.00,
    oldPrice: 2150.00,
    rating: 4.8,
    reviewsCount: 19,
    isFeatured: false,
    badge: 'Inverno Premium',
    images: [
      'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1000&q=80'
    ],
    fabric: 'Veludo de Algodão Egípcio com Acabamento Acetinado',
    fit: 'Modern Italian Fit',
    occasion: 'Jantares Especiais, Vernissages, Festas Exclusivas',
    description: 'Um blazer de impacto magnético em tom vinho profundo. Toque ultrassuave e brilho discreto sob luzes noturnas, ideal para homens de estilo arrojado e refinado.',
    sizes: ['48 (P)', '50 (M)', '52 (G)', '54 (GG)'],
    details: [
      'Bolsos de debrum sem aba',
      'Botões vintage em latão envelhecido',
      'Estrutura leve (soft shoulder)'
    ]
  },
  {
    id: 'terno-firenze-charcoal',
    name: 'Terno Firenze Cinza Chumbo Lã 120s',
    category: 'ternos',
    price: 2490.00,
    oldPrice: 2790.00,
    rating: 4.9,
    reviewsCount: 32,
    isFeatured: false,
    badge: 'Mais Vendido',
    images: [
      'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80'
    ],
    fabric: 'Lã Fria 100% Super 120s Tassel',
    fit: 'Modern Executive Fit',
    occasion: 'Reuniões de Negócios, Viagens Executivas & Eventos Corporativos',
    description: 'Discreto, imponente e altamente resistente a vincos. O Terno Firenze em tom cinza chumbo é a peça essencial do guarda-roupa executivo de alto padrão.',
    sizes: ['46 (PP)', '48 (P)', '50 (M)', '52 (G)', '54 (GG)', '56 (XG)', '58 (XXG)'],
    details: [
      'Resistente a dobras e vincos naturais',
      'Paletó com 2 botões e lapela notch de 7.5cm',
      'Forro com tecnologia respirável'
    ]
  },
  {
    id: 'camisa-milano-white',
    name: 'Camisa Social Milano Algodão Egípcio 200 fios',
    category: 'camisas',
    price: 540.00,
    oldPrice: null,
    rating: 4.9,
    reviewsCount: 45,
    isFeatured: true,
    badge: '200 Fios',
    images: [
      'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80'
    ],
    fabric: '100% Algodão Egípcio Maquinetado 200 Fios',
    fit: 'Custom Tailored Fit',
    occasion: 'Uso com Ternos de Alta Costura ou Blazers',
    description: 'Tecida com fios de algodão egípcio de fibra extra longa, a camisa Milano oferece maciez incomparável, toque sedoso e colarinho semi-italiano perfeitamente estruturado para gravatas.',
    sizes: ['38 (P)', '40 (M)', '42 (G)', '44 (GG)', '46 (XG)'],
    details: [
      'Botões em madrepérola australiana natural',
      'Punho duplo para abotoadeiras',
      'Costura de alta precisão (7 pontos por cm)',
      'Fácil passadoria (Easy Care natural)'
    ]
  },
  {
    id: 'camisa-siena-blue',
    name: 'Camisa Social Siena Azul Ceilão Piquet',
    category: 'camisas',
    price: 490.00,
    oldPrice: 560.00,
    rating: 4.7,
    reviewsCount: 22,
    isFeatured: false,
    badge: 'Nova Cor',
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?auto=format&fit=crop&w=1000&q=80'
    ],
    fabric: '100% Algodão Pima Peruano',
    fit: 'Slim Fit',
    occasion: 'Business Casual Elegante, Almoços de Negócios',
    description: 'Tom azul suave refinado com trama sutil piquet. Proporciona um visual moderno, fresco e aristocrático sob paletós azuis ou cinzas.',
    sizes: ['38 (P)', '40 (M)', '42 (G)', '44 (GG)'],
    details: [
      'Colarinho francês reforçado',
      'Punho simples ajustável por 2 botões'
    ]
  },
  {
    id: 'blazer-venezia-linen',
    name: 'Blazer Venezia Linho Puro & Seda Areia',
    category: 'blazers',
    price: 1980.00,
    oldPrice: null,
    rating: 4.9,
    reviewsCount: 16,
    isFeatured: false,
    badge: 'Verão de Luxo',
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=1000&q=80'
    ],
    fabric: '65% Linho Italiano + 35% Seda Pura',
    fit: 'Unconstructed Summer Fit',
    occasion: 'Casamentos de Dia na Praia/Campo, Eventos náuticos e de Verão',
    description: 'Leveza absoluta sem abrir mão da estrutura de alta alfaiataria. Tecido respirável com textura natural em tom areia champanhe.',
    sizes: ['48 (P)', '50 (M)', '52 (G)', '54 (GG)'],
    details: [
      'Sem forro (Unlined) para frescor máximo',
      'Bolsos aplicados estilo patch pocket italiano'
    ]
  },
  {
    id: 'calca-verona-wool',
    name: 'Calça Alfaiataria Verona Lã Fria Grafite',
    category: 'calcas',
    price: 790.00,
    oldPrice: 890.00,
    rating: 4.8,
    reviewsCount: 30,
    isFeatured: false,
    badge: 'Fivela Lateral',
    images: [
      'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80'
    ],
    fabric: '100% Lã Fria Tropical Super 130s',
    fit: 'Tailored Tapered Leg',
    occasion: 'Combinações com Blazer ou Camisas Finas',
    description: 'Calça de alfaiataria sem passadores de cinto, com sistema gurkha de fivelas laterais prateadas (side adjusters) que proporcionam o caimento limpo e sob medida.',
    sizes: ['38', '40', '42', '44', '46', '48', '50'],
    details: [
      'Side-adjusters laterais ajustáveis',
      'Barra simples com sobram de 5cm para ajustes',
      'Vincos permanentes prensados a quente'
    ]
  },
  {
    id: 'gravata-seda-gold',
    name: 'Gravata de Seda Italiana MF Gold Jacquard 8cm',
    category: 'acessorios',
    price: 320.00,
    oldPrice: null,
    rating: 5.0,
    reviewsCount: 38,
    isFeatured: true,
    badge: '100% Seda de Como',
    images: [
      'https://images.unsplash.com/photo-1589756823695-278bc923f962?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1000&q=80'
    ],
    fabric: '100% Seda Pura Italiana Weaved em Como',
    fit: 'Largura clássica de 8cm',
    occasion: 'Casamentos, Eventos Corporativos de Gala',
    description: 'Gravata tecida no tradicional distrito da seda em Como, Itália. Apresenta padrão micro-jacquard geométrico com reflexos dourados e fundo azul-noite.',
    sizes: ['Tamanho Único'],
    details: [
      'Confeccionada à mão com 7 dobras',
      'Forro interno em lã macia para nó firme',
      'Caixa de presente aveludada inclusa'
    ]
  },
  {
    id: 'sapato-oxford-como',
    name: 'Sapato Oxford Torino Couro Bovino Full Grain Preto',
    category: 'sapatos',
    price: 1290.00,
    oldPrice: 1450.00,
    rating: 4.9,
    reviewsCount: 26,
    isFeatured: true,
    badge: 'Goodyear Welted',
    images: [
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=80'
    ],
    fabric: 'Couro Bovino Integral de Curtume Italiano + Sola em Couro Rígido',
    fit: 'Forma Clássica Europeia',
    occasion: 'Black-Tie, Ternos de Alta Costura, Reuniões Formais',
    description: 'O clássico Oxford de costura fechada. Produzido no método construtivo Goodyear Welted, oferecendo durabilidade para toda a vida e acabamento polido manualmente.',
    sizes: ['38', '39', '40', '41', '42', '43', '44'],
    details: [
      'Construção Goodyear Welted artesanal',
      'Solado de couro bovino com salto de borracha natural',
      'Pintura e pátina finalizadas à mão'
    ]
  },
  {
    id: 'abotoadeiras-aurum-gold',
    name: 'Par de Abotoadeiras MF Royal Gold & Ônix',
    category: 'acessorios',
    price: 390.00,
    oldPrice: null,
    rating: 4.9,
    reviewsCount: 19,
    isFeatured: false,
    badge: 'Banhado a Ouro 18k',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1589756823695-278bc923f962?auto=format&fit=crop&w=1000&q=80'
    ],
    fabric: 'Metal Nobre Banhado a Ouro 18k com Pedra Ônix Natural',
    fit: 'Tamanho universal para punhos duplos',
    occasion: 'Smokings, Camisas de Gala',
    description: 'Um toque final sutil e poderoso para os punhos de sua camisa social. A fusão do banho de ouro 18k com a pedra de ônix negra polida.',
    sizes: ['Tamanho Único'],
    details: [
      'Trava de fixação torcional de segurança',
      'Acompanha estojo de couro artesanal'
    ]
  },
  {
    id: 'terno-florenca-pinstripe',
    name: 'Terno Florença Azul Risca de Giz Super 130s',
    category: 'ternos',
    price: 2790.00,
    oldPrice: 3100.00,
    rating: 4.8,
    reviewsCount: 21,
    isFeatured: false,
    badge: 'Risca de Giz',
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80'
    ],
    fabric: 'Lã Fria Australiana Super 130s com Risca de Giz Dourada Sutil',
    fit: 'Sartorial Double Breasted (Abotoamento Duplo)',
    occasion: 'Negócios de Grande Porte, Advocacia & Eventos Formais',
    description: 'Imponência atemporal. O modelo com abotoamento duplo (6x2) e listras em risca de giz evoca a presença dos grandes patronos de estilo internacional.',
    sizes: ['48 (P)', '50 (M)', '52 (G)', '54 (GG)', '56 (XG)'],
    details: [
      'Abotoamento duplo 6x2',
      'Lapela larga de bico 9.5cm',
      'Bolsos flap com bolso de lenço superior'
    ]
  }
];
