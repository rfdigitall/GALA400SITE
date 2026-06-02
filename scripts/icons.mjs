/** Emoji / pictograme per UI — sostituto immagini, mobile-first */
export const ICON = {
  brand: '🔧',
  phone: '📞',
  whatsapp: '💬',
  urgent: '🚨',
  location: '📍',
  clock: '⏱️',
  h24: '🕐',
  star: '⭐',
  check: '✅',
  faq: '❓',
  home: '🏠',
  services: '🛠️',
  zones: '🗺️',
  boiler: '🔥',
  callback: '📲',
  google: '🔍',
  promo: '🎁',
  shield: '🛡️',
  water: '💧',
  gas: '⛽',
  flood: '🌊',
  pipe: '🚰',
  condo: '🏢',
  default: '🔧',
};

const SERVIZIO_ICONS = {
  'pronto-intervento-idraulico': '🚨',
  'perdite-acqua-urgenti': '💧',
  'ricerca-perdite-acqua': '🔍',
  'ricerca-perdite-gas': '⛽',
  'emergenza-gas': '⚠️',
  allagamento: '🌊',
  'spurgo-urgente': '🚽',
  'wc-intasato-urgente': '🚽',
  'assistenza-caldaia': '🔥',
  'riparazione-caldaia': '🔧',
  'manutenzione-caldaia': '📋',
  'installazione-caldaia': '🏗️',
  scaldabagno: '🚿',
  'manutenzione-impianti': '🔩',
  'rubinetteria-sanitari': '🚰',
  'idraulico-condominio': '🏢',
};

const QUARTIERE_ICONS = {
  'verona-centro': '🏛️',
  'borgo-trento': '🏥',
  'borgo-roma': '🎓',
  'san-zeno': '⛪',
  valdonega: '🏔️',
  cittadella: '🏟️',
  filippini: '🏘️',
  stadio: '⚽',
  'quadrante-europa': '🏬',
  'san-michele': '🛣️',
  golosine: '🛒',
  parona: '🏡',
  chievo: '🌿',
  'san-paolo': '🏘️',
  mizzole: '🏗️',
  montorio: '⛰️',
  'san-massimo': '🏠',
  'ca-di-david': '🏡',
  'santa-lucia': '🛣️',
  pindemonte: '🌳',
  'borgo-venezia': '🛍️',
  'borgo-milano': '🏘️',
  veronetta: '🌉',
  'san-pancrazio': '🏘️',
  'croce-bianca': '🏘️',
  palazzolo: '🏘️',
  'santa-croce': '🏘️',
  castelnuovo: '🌾',
  bussolengo: '🎢',
  'villafranca-di-verona': '✈️',
  'san-giovanni-lupatoto': '🏭',
  sommacampagna: '🏡',
  pescantina: '🍷',
  'san-martino-buon-albergo': '🏘️',
  legnago: '🏛️',
  negrar: '🍇',
};

const MARCA_ICONS = {
  vaillant: '🇩🇪',
  baxi: '🇮🇹',
  ariston: '🇮🇹',
  beretta: '🇮🇹',
  immergas: '🇮🇹',
  'bosch-junkers': '🇩🇪',
  riello: '🇮🇹',
  ferroli: '🇮🇹',
  'saunier-duval': '🇫🇷',
  viessmann: '🇩🇪',
  chaffoteaux: '🇫🇷',
  'de-dietrich': '🇫🇷',
  sime: '🇮🇹',
  lamborghini: '🇮🇹',
  sylber: '🇮🇹',
  hermann: '🇮🇹',
  unical: '🇮🇹',
  biasi: '🇮🇹',
  fondital: '🇮🇹',
  thermorossi: '🇮🇹',
  italtherm: '🇮🇹',
  cosmogas: '🇮🇹',
  hoval: '🇨🇭',
  'nova-florida': '🇮🇹',
  ideal: '🇬🇧',
  westen: '🇮🇹',
  fer: '🇮🇹',
  protherm: '🇨🇿',
  pensotti: '🇮🇹',
  ecosolar: '♻️',
};

const BULLET_ICONS = {
  urgenze: ['⚡', '🛠️', '🌙', '📄'],
  caldaie: ['🔥', '🔧', '⛽', '📅'],
  termico: ['🚿', '⚡', '✅', '💡'],
  manutenzione: ['🏢', '🛡️', '📋', '💶'],
};

const TAG_ICONS = {
  'Perdite acqua': '💧',
  Caldaie: '🔥',
  Spurghi: '🚽',
  Gas: '⛽',
  Condomini: '🏢',
  Scaldabagni: '🚿',
};

const CALDAIA_TIPO_ICONS = {
  assistenza: '🆘',
  manutenzione: '📋',
  riparazione: '🔧',
};

export const STEPS = [
  { icon: '📞', text: 'Chiamata o WhatsApp' },
  { icon: '🔍', text: 'Diagnosi e preventivo' },
  { icon: '🚗', text: 'Intervento in zona' },
  { icon: '✅', text: 'Collaudo e garanzia' },
];

export function iconServizio(slug) {
  return SERVIZIO_ICONS[slug] || ICON.default;
}

export function iconQuartiere(slug, type) {
  if (QUARTIERE_ICONS[slug]) return QUARTIERE_ICONS[slug];
  return type === 'comune' ? '🏙️' : '📍';
}

export function iconMarca(slug) {
  return MARCA_ICONS[slug] || '🔥';
}

export function iconBullets(category) {
  return BULLET_ICONS[category] || BULLET_ICONS.manutenzione;
}

export function iconTag(label) {
  return TAG_ICONS[label] || '•';
}

export function iconCaldaiaTipo(slug) {
  return CALDAIA_TIPO_ICONS[slug] || '🔥';
}

export function heroEmojiForServizio(slug) {
  return SERVIZIO_ICONS[slug] || '🚰';
}

export function heroEmojiForQuartiere(slug, type) {
  return iconQuartiere(slug, type);
}

export function heroEmojiForMarca(slug) {
  return iconMarca(slug);
}

export const TRUST_ITEMS = [
  { icon: '⏱️', strong: null, span: 'Arrivo medio urgenze', key: 'arrival' },
  { icon: '🕐', strong: '24/7', span: 'Pronto intervento' },
  { icon: '⭐', strong: '15+ anni', span: 'Esperienza locale' },
  { icon: '💶', strong: 'Preventivo', span: 'Prima di iniziare' },
];

export const NAV_ICONS = {
  home: '🏠',
  servizi: '🛠️',
  quartieri: '📍',
  marche: '🔥',
};

export const HOME_FEATURES = [
  { icon: '🚨', title: 'Urgenze h24', desc: 'Perdite, gas, allagamenti' },
  { icon: '🔥', title: 'Caldaie', desc: 'Tutte le marche principali' },
  { icon: '📍', title: '36 zone', desc: 'Verona e provincia' },
  { icon: '💶', title: 'Prezzo chiaro', desc: 'Preventivo prima dei lavori' },
];
