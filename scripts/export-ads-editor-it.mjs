/**
 * Google Ads Editor — UTF-16, delimitator VIRGOLA (fix 46 errori TAB)
 *   npm run ads:editor
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import {
  writeEditorUnicodeFile,
  writeEditorUnicodeFileIt,
  buildCampaignsRows,
  buildAdGroupsRows,
  buildKeywordsRows,
  buildRsaRows,
  buildCombinedImportRows,
  buildCombinedImportRowsIt,
} from './google-ads-budget-data.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'google-ads', 'budget-40euro');
const EDITOR = path.join(OUT, 'EDITOR-IMPORT');

const D = ','; // virgola — Editor IT spesso legge TAB come 1 colonna = 46 errori
const combinedEn = buildCombinedImportRows();
const combinedIt = buildCombinedImportRowsIt();

function buildReadmeRows() {
  return [
    ['=== FIX 46 ERRORI: importa file cu VIRGOLA (UTF-16) ==='],
    [''],
    ['Problema: IMPORT-combinat.txt (TAB) = Editor vede 1 colonna, 46 fogli senza intestazione'],
    [''],
    ['ORDINE (un import alla volta, poi Posteaza):'],
    ['  1) 01-campaigns-VIRGOLA.txt     (solo 2 campagne — PROVA PRIMA)'],
    ['  2) 02-ad-groups-VIRGOLA.txt'],
    ['  3) 03-keywords-VIRGOLA.txt'],
    ['  4) 04-ads-rsa-VIRGOLA.txt'],
    [''],
    ['Solo se 01-04 funzionano:'],
    ['  IMPORT-combinat-VIRGOLA.txt'],
    [''],
    ['In Editor: Cont -> Importa -> Da file'],
    ['  Tipo: Tutti i file (*.*)'],
    ['  Se chiede delimitatore: scegli VIRGOLA / Comma'],
    [''],
    ['NU usare: IMPORT-combinat.txt (TAB) — 46 errori'],
    ['NU usare: nessun file .csv UTF-8'],
    [''],
    ['Se anche VIRGOLA fallisce: MANUAL-5MIN.md sau ads.google.com'],
  ];
}

const files = [
  { name: '!!!-CITESTE-MA-INTAI.txt', rows: buildReadmeRows() },
  { name: '01-campaigns-VIRGOLA.txt', rows: buildCampaignsRows() },
  { name: '02-ad-groups-VIRGOLA.txt', rows: buildAdGroupsRows() },
  { name: '03-keywords-VIRGOLA.txt', rows: buildKeywordsRows() },
  { name: '04-ads-rsa-VIRGOLA.txt', rows: buildRsaRows() },
  { name: 'IMPORT-combinat-VIRGOLA.txt', rows: combinedEn },
  { name: 'IMPORT-combinat-IT-VIRGOLA.txt', rows: combinedIt, it: true },
  { name: 'IMPORT-combinat-PUNTOVIRGOLA.txt', rows: combinedEn, d: ';' },
];

for (const f of files) {
  const del = f.d || D;
  const p = path.join(EDITOR, f.name);
  if (f.it) writeEditorUnicodeFileIt(p, f.rows, del);
  else writeEditorUnicodeFile(p, f.rows, del);
  console.log(`  ${f.name} (UTF-16, delim=${del === ',' ? 'virgola' : del})`);
}

try {
  execSync(
    `powershell -NoProfile -ExecutionPolicy Bypass -File "${path.join(OUT, 'GENEREAZA-IMPORT-WINDOWS.ps1')}"`,
    { cwd: OUT, stdio: 'inherit' }
  );
} catch {
  /* optional */
}

const bat = `@echo off
echo IMPORTA IN ORDINE (virgola UTF-16):
echo   1. 01-campaigns-VIRGOLA.txt
echo   2. 02-ad-groups-VIRGOLA.txt  -^> Posteaza
echo   3. 03-keywords-VIRGOLA.txt   -^> Posteaza
echo   4. 04-ads-rsa-VIRGOLA.txt
echo.
echo NU usare IMPORT-combinat.txt (TAB = 46 errori)
explorer "%~dp0EDITOR-IMPORT"
pause
`;
fs.writeFileSync(path.join(OUT, 'DESCHIDE-FOLDER-IMPORT.bat'), bat, 'utf8');

for (const obsolete of [
  'IMPORT-combinat.txt',
  'IMPORTA-IN-EDITOR.txt',
  'IMPORT-combinat-EN.txt',
  'IMPORT-combinat-IT.txt',
  '01-campaigns.txt',
  '02-ad-groups.txt',
  '03-keywords.txt',
  '04-ads-rsa.txt',
]) {
  const p = path.join(EDITOR, obsolete);
  if (fs.existsSync(p)) fs.unlinkSync(p);
}

writeEditorUnicodeFile(
  path.join(EDITOR, 'NON-USARE-IMPORT-combinat-TAB.txt'),
  [
    ['USA invece: 01-campaigns-VIRGOLA.txt poi 02 03 04'],
    ['Oppure: IMPORT-combinat-VIRGOLA.txt'],
    ['Il file TAB dava 46 errori Nessuna riga di intestazione'],
  ],
  ','
);

console.log('\n>>> Importa PRIMA: EDITOR-IMPORT/01-campaigns-VIRGOLA.txt (2 campagne)');
