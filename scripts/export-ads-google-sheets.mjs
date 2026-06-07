/**
 * Export Excel pentru Google Sheets — campanii budget 40€
 *   npm run ads:sheets
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';
import {
  toDelimited,
  readCustomerId,
  withCustomerId,
  buildCampaignsRows,
  buildAdGroupsRows,
  buildKeywordsRows,
  buildRsaRows,
  buildCombinedImportRows,
  buildManualSummaryRows,
  SITE,
  CAMPAIGN_URGENT,
  CAMPAIGN_TOP,
} from './google-ads-budget-data.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'google-ads', 'budget-40euro');
const SHEETS_DIR = path.join(OUT, 'google-sheets');

function writeUtf8Bom(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, '\uFEFF' + content, { encoding: 'utf8' });
}

function prependCustomer(rows) {
  const { header, rows: body } = withCustomerId(rows[0], rows.slice(1));
  return [header, ...body];
}

function buildReadmeRows() {
  return [
    ['GALA 400 — Google Ads (40€/zi) — Ghid Google Sheets'],
    [''],
    ['PAS 1 — Deschide fișierul în Google Sheets'],
    ['  • Mergi pe drive.google.com → Încarcă → GALA400-Google-Ads-40euro.xlsx'],
    ['  • Click dreapta → Deschidere cu → Google Foi de calcul'],
    ['  • Vei vedea 5 file: Campaigns, Ad groups, Keywords, Ads RSA, Manuale'],
    [''],
    ['PAS 2 — Creează campaniile (cel mai simplu, fără Editor)'],
    ['  1. ads.google.com → Campanii → + Nouă → Rețea de căutare'],
    ['  2. Tab «Manuale»: copiază keyword + URL + titluri în anunț'],
    ['  3. Buget: PI-Urgente-Verona = 28€/zi, PI-Quartieri-Top8 = 12€/zi'],
    ['  4. Locație: Verona + provincia | Limbă: Italiano'],
    ['  5. Extensie apel: ' + SITE.phone],
    [''],
    ['PAS 3 — Dacă tot vrei Google Ads Editor'],
    ['  • NU exporta din Sheets (strică encoding-ul)'],
    ['  • Rulează: npm run ads:editor'],
    ['  • Importă: budget-40euro/IMPORT-TUTTO.txt'],
    [''],
    ['Date generate:', new Date().toISOString().slice(0, 10)],
    ['Site:', SITE.domain, '| Tel:', SITE.phone],
  ];
}

function addSheet(wb, name, rows) {
  const ws = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, name.slice(0, 31));
}

const wb = XLSX.utils.book_new();
addSheet(wb, '0 README', buildReadmeRows());
addSheet(wb, '1 Campaigns', prependCustomer(buildCampaignsRows()));
addSheet(wb, '2 Ad groups', prependCustomer(buildAdGroupsRows()));
addSheet(wb, '3 Keywords', prependCustomer(buildKeywordsRows()));
addSheet(wb, '4 Ads RSA', prependCustomer(buildRsaRows()));
addSheet(wb, '5 Manuale', buildManualSummaryRows());

const xlsxPath = path.join(OUT, 'GALA400-Google-Ads-40euro.xlsx');
XLSX.writeFile(wb, xlsxPath);
console.log(`  ${xlsxPath}`);

const csvExports = [
  { file: 'NU-PENTRU-EDITOR-01-Campaigns.csv', rows: buildCampaignsRows() },
  { file: 'NU-PENTRU-EDITOR-02-Ad-groups.csv', rows: buildAdGroupsRows() },
  { file: 'NU-PENTRU-EDITOR-03-Keywords.csv', rows: buildKeywordsRows() },
  { file: 'NU-PENTRU-EDITOR-04-Ads-RSA.csv', rows: buildRsaRows() },
  { file: '05-Manuale-copy-paste.csv', rows: buildManualSummaryRows() },
  { file: 'NU-PENTRU-EDITOR-IMPORT-combinat.csv', rows: buildCombinedImportRows() },
];

for (const old of [
  '01-Campaigns.csv',
  '02-Ad-groups.csv',
  '03-Keywords.csv',
  '04-Ads-RSA.csv',
  'IMPORT-combinat.csv',
  'NU-PENTRU-EDITOR-IMPORT-combinat.csv',
]) {
  const p = path.join(SHEETS_DIR, old);
  if (fs.existsSync(p)) fs.unlinkSync(p);
}

for (const { file, rows } of csvExports) {
  const p = path.join(SHEETS_DIR, file);
  writeUtf8Bom(p, toDelimited(rows, ','));
  console.log(`  ${p}`);
}

writeUtf8Bom(
  path.join(SHEETS_DIR, '!!!-NU-IMPORTA-CSV-IN-EDITOR.txt'),
  'Aceste CSV sunt doar pentru Google Sheets.\r\nPentru Google Ads Editor: npm run ads:editor\r\nApoi importa: ..\\EDITOR-IMPORT\\IMPORTA-IN-EDITOR.txt\r\n'
);

const cid = readCustomerId();
fs.writeFileSync(
  path.join(OUT, 'FOGLI-GOOGLE.md'),
  `# Google Sheets — GALA 400 Ads (40€/zi)

## Generare

\`\`\`powershell
cd C:\\Users\\utente\\Desktop\\GALA400SITE
npm run ads:sheets
\`\`\`

## Fișier principal (recomandat)

**\`google-ads/budget-40euro/GALA400-Google-Ads-40euro.xlsx\`**

### Cum îl deschizi în Google Sheets

1. [drive.google.com](https://drive.google.com) → **Nuovo** → **Caricamento file**
2. Alege \`GALA400-Google-Ads-40euro.xlsx\`
3. După upload: click dreapta pe fișier → **Apri con** → **Google Fogli**
4. Vei avea file separate în partea de jos: Campaigns, Ad groups, Keywords, Ads RSA, **Manuale**

## Metoda care funcționează sigur (fără import Editor)

Editorul dă adesea erori de encoding. **Cel mai rapid:**

1. Deschide tab-ul **\`5 Manuale\`** (sau CSV \`05-Manuale-copy-paste.csv\`)
2. Mergi pe [ads.google.com](https://ads.google.com)
3. Creează campania **${CAMPAIGN_URGENT}** (buget **28 €/zi**, doar Ricerca Google)
4. Pentru fiecare rând din Manuale: grup de anunțuri + cuvânt cheie **Exact** + URL + titluri din tab **Ads RSA**
5. Repetă pentru **${CAMPAIGN_TOP}** (buget **12 €/zi**)

Setări obligatorii:
- Zonă: Verona + provincia
- Limbă: Italiano
- Extensie apel: **${SITE.phone}**
- Obiectiv: Apeluri / Lead

## CSV separate (alternativă)

Folder: \`google-ads/budget-40euro/google-sheets/\`

În Sheets: **File → Importa** → încarcă fiecare CSV → **Inserisci nuovo foglio**

## Nu importa CSV în Google Ads Editor

Fișierele din acest folder sunt **doar pentru Google Sheets**.
Editorul respinge CSV-ul cu «Nessuna riga di intestazione».

Pentru Editor: \`npm run ads:editor\` → \`EDITOR-IMPORT/IMPORTA-IN-EDITOR.txt\`

${cid ? `**Customer ID** (MCC): \`${cid}\` — coloana e deja în Excel.` : '**Customer ID**: dacă ești pe cont Manager, pune ID în \`google-ads/customer-id.txt\` și rulează din nou \`npm run ads:sheets\`.'}

Vezi și: \`MANUAL-5MIN.md\`, \`STRATEGIA-BUDGET-40E.md\`
`,
  'utf8'
);

console.log(`  ${path.join(OUT, 'FOGLI-GOOGLE.md')}`);
console.log('\nGata! Încarcă GALA400-Google-Ads-40euro.xlsx pe Google Drive → Deschide cu Google Sheets');
