import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SITE, QUARTIERI } from './site-data.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
export const CUSTOMER_ID_FILE = path.join(ROOT, 'google-ads', 'customer-id.txt');

const CAMPAIGN_URGENT = 'PI-Urgente-Verona';
const CAMPAIGN_TOP = 'PI-Quartieri-Top8';

const PRIORITY_SLUGS = [
  'verona-centro',
  'borgo-trento',
  'borgo-roma',
  'san-zeno',
  'valdonega',
  'veronetta',
  'san-paolo',
  'golosine',
];

const URGENT_KEYWORDS = [
  { kw: 'idraulico vicino a me verona', slug: 'pronto-intervento-idraulico' },
  { kw: 'idraulico vicino a te verona', slug: 'pronto-intervento-idraulico' },
  { kw: 'idraulico verona vicino a me', slug: 'pronto-intervento-idraulico' },
  { kw: 'idraulico zona mia verona', slug: 'pronto-intervento-idraulico' },
  { kw: 'idraulico di zona verona', slug: 'pronto-intervento-idraulico' },
  { kw: 'pronto intervento idraulico verona', slug: 'pronto-intervento-idraulico' },
  { kw: 'idraulico urgente verona', slug: 'pronto-intervento-idraulico' },
  { kw: 'emergenza idraulico verona', slug: 'pronto-intervento-idraulico' },
  { kw: 'idraulico h24 verona', slug: 'pronto-intervento-idraulico' },
  { kw: 'perdita acqua urgente verona', slug: 'perdite-acqua-urgenti' },
  { kw: 'perdite acqua verona urgente', slug: 'perdite-acqua-urgenti' },
  { kw: 'emergenza gas verona', slug: 'emergenza-gas' },
  { kw: 'spurgo urgente verona', slug: 'spurgo-urgente' },
  { kw: 'idraulico verona urgente', slug: 'pronto-intervento-idraulico' },
  { kw: 'sos idraulico verona', slug: 'pronto-intervento-idraulico' },
];

const LEAN_CAMPAIGNS = [
  { name: CAMPAIGN_URGENT, budget: '28.00' },
  { name: CAMPAIGN_TOP, budget: '12.00' },
];

export function csvEscape(val) {
  const s = String(val ?? '');
  if (/[",\n\r\t]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function toDelimited(rows, delimiter = ',') {
  return rows.map((row) => row.map(csvEscape).join(delimiter)).join('\r\n');
}

/** Fara ghilimele — mai compatibil cu Google Ads Editor */
export function toDelimitedRaw(rows, delimiter = '\t') {
  return rows.map((row) => row.map((c) => String(c ?? '')).join(delimiter)).join('\r\n');
}

/** Google Ads Editor (Windows): UTF-16 LE + BOM + CRLF */
export function writeEditorUnicodeFile(filePath, rows, delimiter = ',') {
  const { header, rows: body } = withCustomerId(rows[0], rows.slice(1));
  const content = toDelimitedRaw([header, ...body], delimiter);
  const bodyBuf = Buffer.from(content, 'utf16le');
  const buf = Buffer.concat([Buffer.from([0xff, 0xfe]), bodyBuf]);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, buf);
}

export function writeEditorUnicodeFileIt(filePath, rows, delimiter = ',') {
  const cid = readCustomerId();
  const header = cid ? ['ID cliente', ...rows[0]] : rows[0];
  const body = cid ? rows.slice(1).map((r) => [cid, ...r]) : rows.slice(1);
  const content = toDelimitedRaw([header, ...body], delimiter);
  const bodyBuf = Buffer.from(content, 'utf16le');
  const buf = Buffer.concat([Buffer.from([0xff, 0xfe]), bodyBuf]);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, buf);
}

/** Import combinat — anteturi italiane (Editor UI in italiano) */
export function buildCombinedImportRowsIt() {
  const header = [
    'Campagna',
    'Stato campagna',
    'Tipo campagna',
    'Reti',
    'Budget giornaliero campagna',
    'Tipo strategia offerte',
    'Gruppo di annunci',
    'Stato gruppo di annunci',
    'CPC max rete di ricerca',
    'Parola chiave',
    'Tipo di corrispondenza',
    'URL finale',
    'Stato parola chiave',
  ];
  const rows = [header];

  rows.push([
    CAMPAIGN_URGENT,
    'Attivata',
    'Rete di ricerca',
    'Ricerca Google',
    '28.00',
    'CPC manuali',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
  ]);
  rows.push([
    CAMPAIGN_URGENT,
    '',
    '',
    '',
    '',
    '',
    'AG - Urgente Verona',
    'Attivato',
    '2.80',
    '',
    '',
    '',
    '',
  ]);
  for (const { kw, slug } of URGENT_KEYWORDS) {
    const url = `${SITE.domain}/servizi/${slug}-verona.html`;
    rows.push([
      CAMPAIGN_URGENT,
      '',
      '',
      '',
      '',
      '',
      'AG - Urgente Verona',
      '',
      '',
      kw,
      'Corrispondenza esatta',
      url,
      'Attivata',
    ]);
  }

  rows.push([
    CAMPAIGN_TOP,
    'Attivata',
    'Rete di ricerca',
    'Ricerca Google',
    '12.00',
    'CPC manuali',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
  ]);
  for (const q of priorityQuartieri()) {
    const ag = `AG - ${q.name}`;
    rows.push([CAMPAIGN_TOP, '', '', '', '', '', ag, 'Attivato', '2.80', '', '', '', '']);
    const url = `${SITE.domain}/quartieri/idraulico-${q.slug}.html`;
    for (const kw of leanKeywordsForZone(q)) {
      rows.push([
        CAMPAIGN_TOP,
        '',
        '',
        '',
        '',
        '',
        ag,
        '',
        '',
        kw,
        'Corrispondenza esatta',
        url,
        'Attivata',
      ]);
    }
  }
  return rows;
}

export function readCustomerId() {
  const fromSite = String(SITE.googleAdsCustomerId || '').replace(/\D/g, '');
  if (fromSite.length >= 10) return fromSite;
  if (!fs.existsSync(CUSTOMER_ID_FILE)) return '';
  const line = fs
    .readFileSync(CUSTOMER_ID_FILE, 'utf8')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .find((l) => l && !l.startsWith('#'));
  if (!line) return '';
  const id = line.replace(/\D/g, '');
  return id.length >= 10 ? id : '';
}

export function withCustomerId(header, rows) {
  const cid = readCustomerId();
  if (!cid) return { header, rows };
  return {
    header: ['Customer ID', ...header],
    rows: rows.map((r) => [cid, ...r]),
  };
}

function priorityQuartieri() {
  return PRIORITY_SLUGS.map((s) => QUARTIERI.find((q) => q.slug === s)).filter(Boolean);
}

function normSearch(name) {
  return name
    .toLowerCase()
    .replace(/'/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function leanKeywordsForZone(q) {
  const n = normSearch(q.name);
  return [
    `idraulico ${n}`,
    `idraulico urgente ${n}`,
    `pronto intervento idraulico ${n}`,
  ];
}

function leanAdGroupNames() {
  const groups = [{ campaign: CAMPAIGN_URGENT, name: 'AG - Urgente Verona' }];
  for (const q of priorityQuartieri()) {
    groups.push({ campaign: CAMPAIGN_TOP, name: `AG - ${q.name}` });
  }
  return groups;
}

function leanKeywordRows() {
  const rows = [];
  const agUrgent = 'AG - Urgente Verona';
  for (const { kw, slug } of URGENT_KEYWORDS) {
    const url = `${SITE.domain}/servizi/${slug}-verona.html`;
    rows.push([CAMPAIGN_URGENT, agUrgent, kw, url]);
  }
  for (const q of priorityQuartieri()) {
    const ag = `AG - ${q.name}`;
    const url = `${SITE.domain}/quartieri/idraulico-${q.slug}.html`;
    for (const kw of leanKeywordsForZone(q)) {
      rows.push([CAMPAIGN_TOP, ag, kw, url]);
    }
  }
  return rows;
}

function rsaForZone(q) {
  const url = `${SITE.domain}/quartieri/idraulico-${q.slug}.html`;
  return {
    adGroup: `AG - ${q.name}`,
    finalUrl: url,
    path1: 'urgente',
    path2: q.slug.slice(0, 15).replace(/-/g, ''),
    headlines: [
      `Idraulico Urgente ${q.name}`,
      `Pronto Intervento H24`,
      `Arrivo ~${SITE.arrivalMin} Minuti`,
      `Chiama ${SITE.phone}`,
      `Idraulico ${q.name} Verona`,
      `Emergenza Acqua e Gas`,
      `Tecnico Disponibile Ora`,
      `Perdite e Caldaie`,
      `Gala 400 Verona`,
      `Preventivo Chiaro`,
      SITE.promo.replace('Promo ', ''),
      `Servizio Locale ${q.name}`,
      `Intervento Immediato`,
      `Idraulico Professionale`,
      `SOS Idraulico Verona`,
    ],
    descriptions: [
      `Idraulico urgente a ${q.name}: pronto intervento h24. Chiama ${SITE.phone} — arrivo rapido.`,
      `Perdite acqua, caldaie, spurghi ed emergenze gas a ${q.name}. Preventivo prima dei lavori.`,
      `Gala 400: idraulico a Verona e ${q.name}. Tecnici qualificati, intervento anche notturno.`,
      `Emergenza idraulica? Chiama ora ${SITE.phone}. Copertura ${q.name} e provincia di Verona.`,
    ],
  };
}

export function buildCampaignsRows() {
  const header = [
    'Campaign',
    'Campaign status',
    'Campaign type',
    'Networks',
    'Campaign daily budget',
    'Bid strategy type',
  ];
  const rows = [header];
  for (const c of LEAN_CAMPAIGNS) {
    rows.push([c.name, 'Enabled', 'Search', 'Google search', c.budget, 'Manual CPC']);
  }
  return rows;
}

export function buildAdGroupsRows() {
  const header = ['Campaign', 'Ad group', 'Ad group status', 'Max CPC'];
  const rows = [header];
  for (const g of leanAdGroupNames()) {
    rows.push([g.campaign, g.name, 'Enabled', '2.80']);
  }
  return rows;
}

export function buildKeywordsRows() {
  const header = [
    'Campaign',
    'Ad group',
    'Keyword',
    'Criterion type',
    'Final URL',
    'Keyword status',
  ];
  const rows = [header];
  for (const [camp, ag, kw, url] of leanKeywordRows()) {
    rows.push([camp, ag, kw, 'Exact', url, 'Enabled']);
  }
  return rows;
}

export function buildRsaRows() {
  const header = [
    'Campaign',
    'Ad group',
    'Ad type',
    'Final URL',
    'Path 1',
    'Path 2',
    ...Array.from({ length: 15 }, (_, i) => `Headline ${i + 1}`),
    ...Array.from({ length: 4 }, (_, i) => `Description ${i + 1}`),
    'Ad status',
  ];
  const rows = [header];
  const urgentUrl = `${SITE.domain}/servizi/pronto-intervento-idraulico-verona.html`;
  rows.push([
    CAMPAIGN_URGENT,
    'AG - Urgente Verona',
    'Responsive search ad',
    urgentUrl,
    'urgente',
    'h24',
    'Pronto Intervento H24',
    'Idraulico Vicino a Te Verona',
    `Chiama ${SITE.phone}`,
    `Arrivo ~${SITE.arrivalMin} Minuti`,
    'Tecnico in Zona Ora',
    'Perdite Acqua e Gas',
    'Gala 400 Srls Verona',
    'Preventivo Prima Lavori',
    'Emergenza Idraulica VR',
    SITE.promo.replace('Promo ', ''),
    'Idraulico di Zona Verona',
    'Intervento Immediato',
    'Niente Call Center',
    'Parli col Tecnico',
    'SOS Idraulico Verona',
    `Pronto intervento idraulico vicino a te a Verona. Chiama ${SITE.phone} — tecnico locale, arrivo rapido.`,
    `Perdite, gas, caldaie. ${SITE.legalName} · P.IVA ${SITE.piva}. Preventivo chiaro prima dei lavori.`,
    `Emergenza? Chiama ora ${SITE.phone}. Copertura Verona centro e provincia.`,
    `Idraulico h24 a Verona: intervento in giornata. Clicca per chiamare subito.`,
    'Enabled',
  ]);
  for (const q of priorityQuartieri()) {
    const rsa = rsaForZone(q);
    rows.push([
      CAMPAIGN_TOP,
      rsa.adGroup,
      'Responsive search ad',
      rsa.finalUrl,
      rsa.path1,
      rsa.path2,
      ...rsa.headlines,
      ...rsa.descriptions,
      'Enabled',
    ]);
  }
  return rows;
}

export function buildCombinedImportRows() {
  const header = [
    'Campaign',
    'Campaign status',
    'Campaign type',
    'Networks',
    'Campaign daily budget',
    'Bid strategy type',
    'Ad group',
    'Ad group status',
    'Max CPC',
    'Keyword',
    'Criterion type',
    'Final URL',
    'Keyword status',
  ];
  const rows = [header];

  rows.push([
    CAMPAIGN_URGENT,
    'Enabled',
    'Search',
    'Google search',
    '28.00',
    'Manual CPC',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
  ]);
  rows.push([
    CAMPAIGN_URGENT,
    '',
    '',
    '',
    '',
    '',
    'AG - Urgente Verona',
    'Enabled',
    '2.80',
    '',
    '',
    '',
    '',
  ]);
  for (const { kw, slug } of URGENT_KEYWORDS) {
    const url = `${SITE.domain}/servizi/${slug}-verona.html`;
    rows.push([
      CAMPAIGN_URGENT,
      '',
      '',
      '',
      '',
      '',
      'AG - Urgente Verona',
      '',
      '',
      kw,
      'Exact',
      url,
      'Enabled',
    ]);
  }

  rows.push([
    CAMPAIGN_TOP,
    'Enabled',
    'Search',
    'Google search',
    '12.00',
    'Manual CPC',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
  ]);
  for (const q of priorityQuartieri()) {
    const ag = `AG - ${q.name}`;
    rows.push([CAMPAIGN_TOP, '', '', '', '', '', ag, 'Enabled', '2.80', '', '', '', '']);
    const url = `${SITE.domain}/quartieri/idraulico-${q.slug}.html`;
    for (const kw of leanKeywordsForZone(q)) {
      rows.push([CAMPAIGN_TOP, '', '', '', '', '', ag, '', '', kw, 'Exact', url, 'Enabled']);
    }
  }
  return rows;
}

/** Riepilogo semplice per inserimento manuale in ads.google.com */
export function buildManualSummaryRows() {
  const header = [
    'Campaign',
    'Budget €/zi',
    'Ad group',
    'Keyword (Exact)',
    'Landing page URL',
    'Titolo annuncio 1',
    'Descrizione 1',
    'Telefono',
  ];
  const rows = [header];
  for (const [camp, ag, kw, url] of leanKeywordRows()) {
    const budget = camp === CAMPAIGN_URGENT ? '28' : '12';
    rows.push([camp, budget, ag, kw, url, 'Pronto Intervento H24 Verona', `Chiama ${SITE.phone} — Gala 400`, SITE.phone]);
  }
  return rows;
}

export { SITE, CAMPAIGN_URGENT, CAMPAIGN_TOP, LEAN_CAMPAIGNS };
