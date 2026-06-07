/** Icone SVG + etichette — niente emoji (look professionale locale) */

export const ICON = {
  brand: 'G4',
  phone: svg('M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011-.24 11.36 11.36 0 003.54.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.54 1 1 0 01-.24 1l-2.21 2.25z'),
  whatsapp: svg('M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.884 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z', '0 0 24 24'),
  urgent: svg('M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z'),
  location: svg('M12 21s7-4.5 7-10a7 7 0 10-14 0c0 5.5 7 10 7 10zm0-8a2 2 0 110-4 2 2 0 010 4z'),
  clock: svg('M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'),
  check: svg('M5 13l4 4L19 7'),
  faq: svg('M8 10h.01M12 10h.01M16 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'),
  callback: svg('M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'),
  boiler: svg('M12 3v3m0 12v3M4.22 4.22l2.12 2.12m11.32 11.32l2.12 2.12M3 12h3m12 0h3M4.22 19.78l2.12-2.12m11.32-11.32l2.12-2.12'),
  services: svg('M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z'),
  arrow: svg('M5 12h14m-6-6l6 6-6 6'),
  zones: svg('M12 21s7-4.5 7-10a7 7 0 10-14 0c0 5.5 7 10 7 10zm0-8a2 2 0 110-4 2 2 0 010 4z'),
  default: svg('M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z'),
};

function svg(d, viewBox = '0 0 24 24') {
  return `<svg class="ico" width="20" height="20" viewBox="${viewBox}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
}

const SERVIZIO_LETTERS = {
  'pronto-intervento-idraulico': 'PI',
  'perdite-acqua-urgenti': 'PA',
  'ricerca-perdite-acqua': 'RP',
  'ricerca-perdite-gas': 'G',
  'emergenza-gas': 'G',
  allagamento: 'AL',
  'spurgo-urgente': 'SP',
  'wc-intasato-urgente': 'WC',
  'assistenza-caldaia': 'CA',
  'riparazione-caldaia': 'CR',
  'manutenzione-caldaia': 'MC',
  'installazione-caldaia': 'IC',
  scaldabagno: 'SB',
  'manutenzione-impianti-idraulici': 'MI',
  rubinetteria: 'RU',
  'idraulico-condominio': 'CO',
};

export const STEPS = [
  { text: 'Chiami il numero diretto' },
  { text: 'Preventivo prima dei lavori' },
  { text: 'Tecnico in zona Verona' },
  { text: 'Intervento e collaudo' },
];

export function iconServizio(slug) {
  return SERVIZIO_LETTERS[slug] || 'ID';
}

export function iconQuartiere(slug) {
  return slug.slice(0, 2).replace(/[^a-z]/gi, '').toUpperCase() || 'VR';
}

export function iconMarca(slug) {
  const map = {
    vaillant: 'V',
    baxi: 'B',
    ariston: 'A',
    beretta: 'BE',
    immergas: 'I',
    'bosch-junkers': 'J',
    riello: 'R',
    ferroli: 'F',
    'saunier-duval': 'SD',
    viessmann: 'VI',
    sime: 'SI',
    hermann: 'H',
  };
  return map[slug] || slug.slice(0, 2).toUpperCase();
}

export function iconBullets(category) {
  return category;
}

export function iconTag() {
  return '';
}

export function iconCaldaiaTipo(slug) {
  return slug === 'assistenza' ? 'A' : slug === 'manutenzione' ? 'M' : 'R';
}

export function heroEmojiForServizio(slug) {
  return iconServizio(slug);
}

export function heroEmojiForQuartiere(slug) {
  return iconQuartiere(slug);
}

export function heroEmojiForMarca(slug) {
  return iconMarca(slug);
}

export const TRUST_ITEMS = [
  { strong: null, span: 'Arrivo medio urgenze', key: 'arrival' },
  { strong: 'H24', span: 'Anche notte e festivi' },
  { strong: '2010', span: 'Operativi a Verona' },
  { strong: 'Preventivo', span: 'Prima di iniziare' },
];

export const HOME_FEATURES = [
  { title: 'Urgenze', desc: 'Perdite, gas, allagamenti' },
  { title: 'Caldaie', desc: 'Riparazione e assistenza' },
  { title: '36 zone', desc: 'Verona e provincia' },
  { title: 'Prezzo chiaro', desc: 'Nessun costo nascosto' },
];

export function cardMonogram(label) {
  const t = String(label || 'G4').trim();
  const parts = t.split(/\s+/);
  const mono = parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : t.slice(0, 2).toUpperCase();
  return `<span class="card-mono" aria-hidden="true">${mono}</span>`;
}
