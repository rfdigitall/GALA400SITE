/**
 * Genera CSV per Google Ads Editor — campagne per quartiere/comune
 * npm run ads
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SITE, QUARTIERI } from './site-data.mjs';

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'google-ads');
const OUT_LEAN = path.join(OUT, 'budget-40euro');
const CAMPAIGN = 'PI Verona Quartieri';
const CAMPAIGN_SERVIZI = 'PI Verona Servizi Urgenti';
const CAMPAIGN_URGENT = 'PI-Urgente-Verona';
const CAMPAIGN_TOP = 'PI-Quartieri-Top8';

/** Con 40€/giorno: max 8 zone + urgenze (non tutte le 36) */
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

function csvEscape(val) {
  const s = String(val ?? '');
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function toCsv(rows, delimiter = ',') {
  return rows.map((row) => row.map(csvEscape).join(delimiter)).join('\r\n');
}

function writeCsvFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
}

/** Google Ads Editor (Windows/IT): formato ufficiale = Testo Unicode UTF-16 + TAB */
function toTsv(rows) {
  return rows.map((row) => row.map(csvEscape).join('\t')).join('\r\n');
}

function writeUnicodeText(filePath, content) {
  const buf = Buffer.from('\ufeff' + content, 'utf16le');
  fs.writeFileSync(filePath, buf);
}

function normSearch(name) {
  return name
    .toLowerCase()
    .replace(/'/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function keywordsForZone(q) {
  const n = normSearch(q.name);
  const base = [
    `idraulico ${n}`,
    `idraulico urgente ${n}`,
    `pronto intervento idraulico ${n}`,
    `idraulico h24 ${n}`,
    `emergenza idraulico ${n}`,
  ];
  if (q.type === 'comune') {
    base.push(`idraulico ${n} verona`, `pronto intervento ${n}`);
  }
  return [...new Set(base)];
}

function rsaForZone(q) {
  const url = `${SITE.domain}/quartieri/idraulico-${q.slug}.html`;
  const ag = `AG - ${q.name}`;
  return {
    campaign: CAMPAIGN,
    adGroup: ag,
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

function buildKeywordsCsv() {
  const header = ['Campaign', 'Ad Group', 'Keyword', 'Criterion Type', 'Final URL', 'Status'];
  const rows = [header];
  for (const q of QUARTIERI) {
    const ag = `AG - ${q.name}`;
    const url = `${SITE.domain}/quartieri/idraulico-${q.slug}.html`;
    for (const kw of keywordsForZone(q)) {
      rows.push([CAMPAIGN, ag, kw, 'Phrase', url, 'Enabled']);
      rows.push([CAMPAIGN, ag, kw, 'Exact', url, 'Enabled']);
    }
  }
  return toCsv(rows);
}

function buildRsaCsv() {
  const header = [
    'Campaign',
    'Ad Group',
    'Ad type',
    'Final URL',
    'Path 1',
    'Path 2',
    ...Array.from({ length: 15 }, (_, i) => `Headline ${i + 1}`),
    ...Array.from({ length: 4 }, (_, i) => `Description ${i + 1}`),
    'Status',
  ];
  const rows = [header];
  for (const q of QUARTIERI) {
    const rsa = rsaForZone(q);
    rows.push([
      rsa.campaign,
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
  return toCsv(rows);
}

function buildNegativesCsv() {
  const header = ['Campaign', 'Negative keyword', 'Criterion Type'];
  const rows = [header];
  const negatives = [
    'lavoro',
    'offerte di lavoro',
    'corso',
    'corsi',
    'fai da te',
    'tutorial',
    'gratis',
    'stage',
    'tirocinio',
    'assumere',
    'vendita',
    'usato',
    'amazon',
    'leroy merlin',
    'bricoman',
  ];
  for (const n of negatives) {
    rows.push([CAMPAIGN, n, 'Broad']);
    rows.push([CAMPAIGN_SERVIZI, n, 'Broad']);
  }
  return toCsv(rows);
}

function buildCampaignSettingsTxt() {
  return `# Impostazioni consigliate — Google Ads (non import CSV)
Campagna: ${CAMPAIGN}
Obiettivo: Lead / Chiamate (se disponibile) oppure Traffico verso sito + conversione click-to-call
Rete: Solo Ricerca Google (disattiva Display per iniziare)
Località: Verona + Provincia di Verona (raggio 25–35 km) — NON allargare tutta Italia
Lingua: Italiano
Offerta: Massimizza conversioni (dopo 15–30 conversioni) oppure CPC manuale iniziale
Budget: definisci tu (es. 20–50€/giorno per test quartieri)

Estensioni obbligatorie (inserisci a mano in Google Ads):
- Chiamata: ${SITE.phone}
- Ubicazione: collega Google Business Profile
- Sitelink: Servizi | Zone Verona | Caldaie | Chiama ora
- Snippet: Pronto intervento h24; Arrivo ~${SITE.arrivalMin} min; Preventivo chiaro

URL finale ogni quartiere: ${SITE.domain}/quartieri/idraulico-[slug].html
Conversione: click su tel: (già su sito) + chiamate da annuncio
`;
}

function priorityQuartieri() {
  return PRIORITY_SLUGS.map((s) => QUARTIERI.find((q) => q.slug === s)).filter(Boolean);
}

function leanKeywordsForZone(q) {
  const n = normSearch(q.name);
  return [
    `idraulico ${n}`,
    `idraulico urgente ${n}`,
    `pronto intervento idraulico ${n}`,
  ];
}

const LEAN_CAMPAIGNS = [
  { name: CAMPAIGN_URGENT, budget: '28.00' },
  { name: CAMPAIGN_TOP, budget: '12.00' },
];

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

function leanAdGroupNames() {
  const groups = [{ campaign: CAMPAIGN_URGENT, name: 'AG - Urgente Verona' }];
  for (const q of priorityQuartieri()) {
    groups.push({ campaign: CAMPAIGN_TOP, name: `AG - ${q.name}` });
  }
  return groups;
}

/** Passo 1 — anteturi standard Google Ads Editor (engleză, fără BOM) */
function buildLeanCampaignsCsv(delimiter = ',') {
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
  return toCsv(rows, delimiter);
}

/** Passo 2 — gruppi di annunci */
function buildLeanAdGroupsCsv(delimiter = ',') {
  const header = ['Campaign', 'Ad group', 'Ad group status', 'Max CPC'];
  const rows = [header];
  for (const g of leanAdGroupNames()) {
    rows.push([g.campaign, g.name, 'Enabled', '2.80']);
  }
  return toCsv(rows, delimiter);
}

/** Passo 3 — parole chiave (DUPĂ 1+2). Fără „Campaign ID”. */
function buildLeanKeywordsCsv(delimiter = ',') {
  const kwRows = leanKeywordRows();
  const header = ['Campaign', 'Ad group', 'Keyword', 'Criterion type', 'Final URL', 'Keyword status'];
  const rows = [header];
  for (const [camp, ag, kw, url] of kwRows) {
    rows.push([camp, ag, kw, 'Exact', url, 'Enabled']);
  }
  return toCsv(rows, delimiter);
}

function buildCombinedImportRows() {
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

function buildCombinedImportTsv() {
  return toTsv(buildCombinedImportRows());
}

function buildManualGuideRo() {
  return `# Creare campaniile MANUAL în Google Ads Editor (5 min) — fără import CSV

Dacă importul dă mereu „Nessuna riga di intestazione”, folosește această metodă (100% sigură).

## Campania 1: PI-Urgente-Verona (28€/zi)

1. Deschide **Google Ads Editor** → conectat la cont → **Scarica**
2. Click **+** lângă **Campagne** → **Aggiungi campagna**
3. Nume: \`PI-Urgente-Verona\`
4. Tipo: **Rete di ricerca** (solo Google Search, fără Display/Partner)
5. Budget giornaliero: **28** EUR
6. Strategia offerte: **CPC manuali** (max 2,80€)
7. Salvează

### Gruppo annunci
8. În campanie → **+ Gruppo di annunci** → nume: \`AG - Urgente Verona\`
9. CPC max: **2,80**

### Parole chiave (Exact)
Adaugă (una per riga, corrispondenza **Esatta**):
- pronto intervento idraulico verona → ${SITE.domain}/servizi/pronto-intervento-idraulico-verona.html
- idraulico urgente verona
- emergenza idraulico verona
- idraulico h24 verona
- perdita acqua urgente verona
- perdite acqua verona urgente
- emergenza gas verona
- spurgo urgente verona
- idraulico verona urgente
- sos idraulico verona

(URL finale per fiecare = pagina serviciu corespunzătoare pe gala400.it)

## Campania 2: PI-Quartieri-Top8 (12€/zi)

Repetă cu budget **12€**, apoi 8 gruppi:
- AG - Verona Centro, Borgo Trento, Borgo Roma, San Zeno, Valdonega, Veronetta, San Paolo, Golosine
- 3 keyword Exact per gruppo: idraulico [zona], idraulico urgente [zona], pronto intervento idraulico [zona]
- URL = /quartieri/idraulico-[slug].html

## După creare

1. **Postează** în Editor
2. În Google Ads online: **Località** Verona + provincia, **Estensione chiamata** ${SITE.phone}
3. Obiettivo: **Lead / Chiamate**

## Import alternativ (un singur fișier)

Încearcă **\`IMPORT-TUTTO.txt\`** (UTF-16, format Google oficial):
Cont → Importa → Da file → selectează \`IMPORT-TUTTO.txt\`
`;
}

function buildImportGuideRo() {
  return `# Import Google Ads — fix „Nessuna riga di intestazione”

## Cauza reală (documentație Google)

Google Ads Editor pe **Windows / Excel Italia** cere:
- Codificare: **Testo Unicode (UTF-16)** — NU CSV UTF-8
- Salvare: **Salva con nome → Testo Unicode** (extensie .txt)

Fișierele \`.csv\` UTF-8 dau adesea: *Nessuna riga di intestazione trovata in questo foglio* (și 3 „fogli” vuoti).

---

## SOLUȚIA 1 — Un singur fișier (încearcă prima dată)

1. În folder: \`IMPORT-TUTTO.txt\`
2. Editor → **Cont → Importa → Da file**
3. Alege \`IMPORT-TUTTO.txt\` (tip: tutti i file / *.txt)
4. Verifică previzualizarea → **Importa** → **Postează**

Conține: campanii + gruppi + parole chiave (format TAB + UTF-16).

---

## SOLUȚIA 2 — Fișiere separate (.txt Unicode)

Ordine:
1. \`01-campaigns.txt\`
2. \`02-ad-groups.txt\`
3. **Postează**
4. \`03-keywords.txt\`
5. **Postează**

⚠️ **NU** deschide în Excel înainte de import.

---

## SOLUȚIA 3 — Manual (fără CSV)

Citește \`MANUAL-5MIN.md\` — creezi 2 campanii direct în Editor (5–10 min, zero erori).

---

## Fix „Valore mancante in ID campagna” (keywords separate)

## De ce apare eroarea?

Ai importat doar \`keywords.csv\` / \`03-parole-chiave.csv\` **înainte** ca campaniile să existe în cont.

Google Ads Editor (interfață italiană) cere **ID campanie** doar când **actualizezi** campanii existente.
Pentru campanii **noi**, trebuie importate **în ordine**, fără coloana ID.

**Nu mapa** coloana „Campagna” la câmpul „ID campagna” în wizard!

---

## Fix „Nessuna riga di intestazione trovata”

Cauze frecvente:
1. **UTF-8 cu BOM** — fișierele noi sunt **fără BOM**
2. **Anteturi în italiană** — folosește fișierele **fără sufix -IT** (anteturi engleze standard Editor)
3. **Deschis în Excel și resalvato** — poate strica CSV-ul; importă direct fișierul generat

Dacă tot nu merge: încearcă **\`01-campaigns-semicolon.csv\`** (virgulă → punct și virgulă, Excel Italia).

## Ordinea corectă (Google Ads Editor)

1. **Google Ads Editor** → cont conectat → **Scarica**
2. **Cont → Importa → Da file** → \`01-campaigns.csv\`
3. La mapare coloane: lasă anteturile **Campaign**, **Campaign status**, etc.
4. **Importa** → apoi \`02-ad-groups.csv\` → **Postează**
5. **Scarica** (recomandat)
6. \`03-keywords.csv\` → \`04-ads-rsa.csv\` → \`05-negative-keywords.csv\`
7. **Postează** tot

⚠️ Nu folosi \`01-campagne-IT.csv\` (deprecat) — anteturi greșite pentru Editor.

### După import (manual în Google Ads)

- **Località:** Verona + Provincia di Verona (non in CSV)
- **Lingua:** Italiano
- **Estensione chiamata:** ${SITE.phone}
- **Obiettivo:** Lead / Chiamate
- Verifică buget: **28€** pe ${CAMPAIGN_URGENT}, **12€** pe ${CAMPAIGN_TOP}

---

## Dacă ai deja campania veche activă

- **Opțiunea A:** Pauză campania veche → importă fișierele 01–05 (nume noi: ${CAMPAIGN_URGENT})
- **Opțiunea B:** În Editor, exportă campania existentă → copiază **ID campanie** în CSV (avansat)

---

## Fișiere în acest folder

| Pas | Fișier principal | Alternativă (Excel IT) |
|-----|------------------|------------------------|
| 1 | \`01-campaigns.csv\` | \`01-campaigns-semicolon.csv\` |
| 2 | \`02-ad-groups.csv\` | \`02-ad-groups-semicolon.csv\` |
| 3 | \`03-keywords.csv\` | \`03-keywords-semicolon.csv\` |
| 4 | \`04-ads-rsa.csv\` | — |
| 5 | \`05-negative-keywords.csv\` | — |

Regenerează: \`npm run ads\`
`;
}

function buildLeanRsaCsvLang(lang = 'en') {
  const base = buildLeanRsaCsv();
  if (lang === 'en') return base;
  return base
    .replace(/^Campaign,/m, 'Campagna,')
    .replace(/,Ad Group,/g, ',Gruppo di annunci,')
    .replace(/,Ad type,/g, ',Tipo di annuncio,')
    .replace(/,Final URL,/g, ',URL finale,')
    .replace(/,Path 1,/g, ',Percorso 1,')
    .replace(/,Path 2,/g, ',Percorso 2,')
    .replace(/,Headline /g, ',Titolo ')
    .replace(/,Description /g, ',Descrizione ')
    .replace(/,Status$/m, ',Stato annuncio')
    .replace(/,Enabled$/gm, ',Abilitato');
}

function buildLeanNegativesCsvStd(delimiter = ',') {
  return toCsv([['Campaign', 'Negative keyword', 'Criterion type'], ...buildLeanNegativesRows()], delimiter);
}

function buildLeanRsaCsv() {
  const header = [
    'Campaign',
    'Ad Group',
    'Ad type',
    'Final URL',
    'Path 1',
    'Path 2',
    ...Array.from({ length: 15 }, (_, i) => `Headline ${i + 1}`),
    ...Array.from({ length: 4 }, (_, i) => `Description ${i + 1}`),
    'Status',
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
    `Pronto Intervento H24`,
    `Idraulico Urgente Verona`,
    `Chiama ${SITE.phone}`,
    `Arrivo ~${SITE.arrivalMin} Minuti`,
    `Perdite Acqua e Gas`,
    `Tecnico Disponibile Ora`,
    `Emergenza Idraulica`,
    `Gala 400 Verona`,
    `Preventivo Prima Lavori`,
    SITE.promo.replace('Promo ', ''),
    `SOS Idraulico`,
    `Intervento Immediato`,
    `Caldaie e Spurghi`,
    `Servizio Locale Verona`,
    `Idraulico Professionale`,
    `Pronto intervento idraulico a Verona h24. Chiama ${SITE.phone} — tecnico in arrivo.`,
    `Perdite, gas, allagamenti, spurghi. Preventivo chiaro. Verona e provincia.`,
    `Emergenza? Non aspettare. Chiama ora ${SITE.phone}. Gala 400 — interventi urgenti.`,
    `Idraulico urgente Verona: copertura rapida. Clicca per chiamare o visita il sito.`,
    'Enabled',
  ]);
  for (const q of priorityQuartieri()) {
    const rsa = rsaForZone(q);
    rsa.campaign = CAMPAIGN_TOP;
    rows.push([
      rsa.campaign,
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
  return toCsv(rows);
}

function buildStrategy40Md() {
  const clicks = Math.floor(40 / 3);
  return `# Strategia Google Ads — 40€/zi, obiettivo TELEFONO

## Matematica realistica (onestà prima di tutto)

| Voce | Valore |
|------|--------|
| Budget giornaliero | **40 €** |
| CPC medio (tuo) | **~3 €** |
| Click massimi/giorno | **~13** (40÷3) |
| Chiamate realistiche | **2–5/giorno** se sito + annuncio sono ok |
| "Telefon încontinuu" | **Non realistic** con 40€ — servono 80–120€/giorno per volume alto |

Un intervento idraulico paga spesso 150–400€+ → anche **1 lavoro al giorno** da Ads può essere profittevole.

## Metoda quartieri: OK o altceva mai bună?

**Paginile per quartiere = BUNE** (pertinenza, Quality Score, chi cerca "idraulico Borgo Trento" vede quella zona).

**MAI** con 40€/zi **NON importa tutte le 36 zone** — Google sparge bugetul su troppi gruppi e non impara.

### ✅ Ce să folosești ACUM (folder \`budget-40euro/\`)

1. **Campania PI-Urgente-Verona** — budget **28 €/zi** (~70%)
   - Keyword solo **Exact**: pronto intervento, urgente, perdite, gas, spurgo
   - Landing: pagini \`/servizi/...-verona.html\`

2. **Campania PI-Quartieri-Top8** — budget **12 €/zi** (~30%)
   - 8 zone cu cel mai mult trafic: Centro, Borgo Trento, Borgo Roma, San Zeno, Valdonega, Veronetta, San Paolo, Golosine
   - Solo **Exact** (meno sprechi)

3. **Dopo 2–4 săptămâni** cu date: adaugă alte quartieri DOAR dacă primele campanii au CPA bun.

### 🔥 Mai bun decât "doar sito" pentru apeluri

| Prioritate | Acțiune |
|------------|---------|
| 1 | Obiettivo campanie: **Lead / Chiamate** (nu solo traffico) |
| 2 | **Estensione chiamata** ${SITE.phone} + "Usa numero inserzionista" |
| 3 | **Annunci call-only** su mobile (opzionale, test 5€/giorno) |
| 4 | Programma annunci: **06:00–23:00** (urgenze notturne costano di più) |
| 5 | Disattiva **Rete Display** e **Partner di ricerca** all'inizio |
| 6 | Offerta: **Massimizza conversioni** DOPO 15+ chiamate registrate; prima settimana **CPC manuale max 2,80€** |
| 7 | **Google Business Profile**: recensioni + categoria Idraulico — gratis e porta chiamate |

## Setup conversioni (obbligatorio)

In Google Ads → Strumenti → Conversioni:

- **Chiamata da annuncio** (durata min 60 sec)
- **Chiamata dal sito** (tag già: AW-18106797178 + phone_conversion_number)

Senza conversioni tracciate, Google non ottimizza per il telefono.

## KPI da monitorare (settimana 1–2)

- CTR annuncio > 5% = buono
- CPC < 3,50€
- **Costo per chiamata** target: **15–25€** (accettabile per idraulico)
- Se costo/chiamata > 35€ → pausa keyword larghe, solo Exact

## Import file (ordine obbligatorio!)

Vedi **\`IMPORT-RO.md\`** — importa 01 → 02 → postează → 03 → 04 → 05.

**Non importare solo \`keywords.csv\`** (errore ID campagna).

## Risposta diretta

- **Modalitatea quartieri + sito = corectă și aduce rezultati**, ma a 40€ va **concentrata**, non espansa.
- **Alternativa mai bună per telefon**: urgenze Exact + estensione chiamata + GBP, non alt tip di "file magic".
- **Așteptare**: 2–5 apeluri/zi qualificate è un buon inizio; scala budget quando CPA è sotto controllo.
`;
}

function buildReadmeIt() {
  return `# Google Ads — Campagne per quartiere (non solo "Verona")

Sì: puoi mostrare annunci quando qualcuno cerca **idraulico + nome quartiere/comune**
(es. "idraulico borgo trento", "idraulico urgente san zeno").

Ogni gruppo di annunci punta alla **pagina dedicata** sul sito → migliore pertinenza e più chiamate.

## File generati

| File | Uso |
|------|-----|
| \`keywords-quartieri.csv\` | Parole chiave Phrase + Exact per ogni zona |
| \`rsa-quartieri.csv\` | Annunci RSA (titoli + descrizioni) |
| \`negative-keywords.csv\` | Parole negative comuni |
| \`impostazioni-campagna.txt\` | Target geografico e estensioni |

## Come importare (Google Ads Editor)

1. Scarica [Google Ads Editor](https://ads.google.com/home/tools/ads-editor/)
2. Accedi all'account Google Ads
3. **Account → Importa → Da file**
4. Importa prima \`keywords-quartieri.csv\`
5. Poi importa \`rsa-quartieri.csv\`
6. Poi \`negative-keywords.csv\`
7. Controlla anteprima → **Pubblica**

Se Editor segnala colonne mancanti, mappa: Campaign, Ad Group, Keyword, Criterion Type, Final URL.

## Struttura campagna

- **1 campagna:** \`${CAMPAIGN}\`
- **${QUARTIERI.length} gruppi di annunci:** uno per quartiere/comune (es. AG - Borgo Trento)
- **Keyword:** idraulico [zona], idraulico urgente [zona], pronto intervento idraulico [zona]
- **Landing page:** pagina quartiere corrispondente su gala400.it

## Importante

- **Località annuncio:** resta Verona e provincia (non puoi targettare solo un quartiere in Google Ads), ma le **keyword** catturano chi cerca il quartiere specifico.
- Usa **corrispondenza a frase ed esatta** per evitare sprechi.
- Collega **numero ${SITE.phone}** come estensione chiamata.
- Per test A/B: duplica 3–5 quartieri con più ricerche (Centro, Borgo Trento, Borgo Roma, San Zeno).

## Rigenerare i file

\`\`\`bash
npm run ads
\`\`\`

Dopo ogni modifica ai quartieri in \`scripts/site-data.mjs\`.
`;
}

function buildLeanNegativesCsv() {
  const header = ['Campaign', 'Negative keyword', 'Criterion Type'];
  const rows = [header];
  const negatives = [
    'lavoro',
    'corso',
    'fai da te',
    'gratis',
    'stage',
    'vendita',
    'usato',
    'amazon',
    'preventivo online',
    'quanto costa',
    'media',
  ];
  for (const n of negatives) {
    rows.push([CAMPAIGN_URGENT, n, 'Broad']);
    rows.push([CAMPAIGN_TOP, n, 'Broad']);
  }
  return toCsv(rows);
}

fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(OUT_LEAN, { recursive: true });
fs.writeFileSync(path.join(OUT, 'keywords-quartieri.csv'), '\uFEFF' + buildKeywordsCsv(), 'utf8');
fs.writeFileSync(path.join(OUT, 'rsa-quartieri.csv'), '\uFEFF' + buildRsaCsv(), 'utf8');
fs.writeFileSync(path.join(OUT, 'negative-keywords.csv'), '\uFEFF' + buildNegativesCsv(), 'utf8');
fs.writeFileSync(path.join(OUT, 'impostazioni-campagna.txt'), buildCampaignSettingsTxt(), 'utf8');
fs.writeFileSync(path.join(OUT, 'README.md'), buildReadmeIt(), 'utf8');
function buildLeanNegativesRows() {
  const negatives = [
    'lavoro',
    'corso',
    'fai da te',
    'gratis',
    'stage',
    'vendita',
    'usato',
    'amazon',
    'preventivo online',
    'quanto costa',
    'media',
  ];
  const rows = [];
  for (const n of negatives) {
    rows.push([CAMPAIGN_URGENT, n, 'Broad']);
    rows.push([CAMPAIGN_TOP, n, 'Broad']);
  }
  return rows;
}

function buildLeanRsaRows() {
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
    `Pronto Intervento H24`,
    `Idraulico Urgente Verona`,
    `Chiama ${SITE.phone}`,
    `Arrivo ~${SITE.arrivalMin} Minuti`,
    `Perdite Acqua e Gas`,
    `Tecnico Disponibile Ora`,
    `Emergenza Idraulica`,
    `Gala 400 Verona`,
    `Preventivo Prima Lavori`,
    SITE.promo.replace('Promo ', ''),
    `SOS Idraulico`,
    `Intervento Immediato`,
    `Caldaie e Spurghi`,
    `Servizio Locale Verona`,
    `Idraulico Professionale`,
    `Pronto intervento idraulico a Verona h24. Chiama ${SITE.phone} — tecnico in arrivo.`,
    `Perdite, gas, allagamenti, spurghi. Preventivo chiaro. Verona e provincia.`,
    `Emergenza? Non aspettare. Chiama ora ${SITE.phone}. Gala 400 — interventi urgenti.`,
    `Idraulico urgente Verona: copertura rapida. Clicca per chiamare o visita il sito.`,
    'Enabled',
  ]);
  for (const q of priorityQuartieri()) {
    const rsa = rsaForZone(q);
    rsa.campaign = CAMPAIGN_TOP;
    rows.push([
      rsa.campaign,
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

/* === FORMAT PRINCIPAL: UTF-16 Testo Unicode (.txt) — Google Ads Editor IT === */
writeUnicodeText(path.join(OUT_LEAN, 'IMPORT-TUTTO.txt'), buildCombinedImportTsv());
writeUnicodeText(
  path.join(OUT_LEAN, '01-campaigns.txt'),
  toTsv([
    ['Campaign', 'Campaign status', 'Campaign type', 'Networks', 'Campaign daily budget', 'Bid strategy type'],
    ...LEAN_CAMPAIGNS.map((c) => [c.name, 'Enabled', 'Search', 'Google search', c.budget, 'Manual CPC']),
  ])
);
writeUnicodeText(
  path.join(OUT_LEAN, '02-ad-groups.txt'),
  toTsv([
    ['Campaign', 'Ad group', 'Ad group status', 'Max CPC'],
    ...leanAdGroupNames().map((g) => [g.campaign, g.name, 'Enabled', '2.80']),
  ])
);
writeUnicodeText(
  path.join(OUT_LEAN, '03-keywords.txt'),
  toTsv([
    ['Campaign', 'Ad group', 'Keyword', 'Criterion type', 'Final URL', 'Keyword status'],
    ...leanKeywordRows().map(([camp, ag, kw, url]) => [camp, ag, kw, 'Exact', url, 'Enabled']),
  ])
);
writeUnicodeText(path.join(OUT_LEAN, '04-ads-rsa.txt'), toTsv(buildLeanRsaRows()));
writeUnicodeText(
  path.join(OUT_LEAN, '05-negative-keywords.txt'),
  toTsv([['Campaign', 'Negative keyword', 'Criterion type'], ...buildLeanNegativesRows()])
);
writeCsvFile(path.join(OUT_LEAN, 'IMPORT-RO.md'), buildImportGuideRo());
writeCsvFile(path.join(OUT_LEAN, 'MANUAL-5MIN.md'), buildManualGuideRo());
writeCsvFile(
  path.join(OUT_LEAN, 'LEGGIMI-IMPORT.txt'),
  `GOOGLE ADS EDITOR — CITESTE ASTA
================================
Eroare "Nessuna riga di intestazione" = fisier CSV UTF-8 gresit.

FOLOSESTE:
  >>> IMPORT-TUTTO.txt <<<  (UTF-16, format Google oficial)

Sau: MANUAL-5MIN.md (fara import, 5 minute in Editor)

NU folosi .csv daca Editor da eroare la toate.
Cont -> Importa -> Da file -> IMPORT-TUTTO.txt
`
);
/* CSV UTF-8 (backup) */
writeCsvFile(path.join(OUT_LEAN, '01-campaigns.csv'), buildLeanCampaignsCsv());
writeCsvFile(path.join(OUT_LEAN, '02-ad-groups.csv'), buildLeanAdGroupsCsv());
writeCsvFile(path.join(OUT_LEAN, '03-keywords.csv'), buildLeanKeywordsCsv());
writeCsvFile(path.join(OUT_LEAN, '04-ads-rsa.csv'), buildLeanRsaCsv());
writeCsvFile(path.join(OUT_LEAN, '05-negative-keywords.csv'), buildLeanNegativesCsvStd());
fs.writeFileSync(path.join(OUT_LEAN, 'STRATEGIA-BUDGET-40E.md'), buildStrategy40Md(), 'utf8');

console.log(`Creato in google-ads/:`);
console.log(`  - keywords-quartieri.csv (${QUARTIERI.length} zone)`);
console.log(`  - rsa-quartieri.csv (${QUARTIERI.length} annunci RSA)`);
console.log(`  - negative-keywords.csv`);
console.log(`  - README.md + impostazioni-campagna.txt`);
console.log(`Creato in google-ads/budget-40euro/:`);
console.log(`  >>> IMPORT-TUTTO.txt (UTF-16 — FOLOSESTE ASTA)`);
console.log(`  - 01..05 *.txt Unicode + MANUAL-5MIN.md`);
