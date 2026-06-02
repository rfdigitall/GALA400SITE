# Google Ads — Campagne per quartiere (non solo "Verona")

Sì: puoi mostrare annunci quando qualcuno cerca **idraulico + nome quartiere/comune**
(es. "idraulico borgo trento", "idraulico urgente san zeno").

Ogni gruppo di annunci punta alla **pagina dedicata** sul sito → migliore pertinenza e più chiamate.

## File generati

| File | Uso |
|------|-----|
| `keywords-quartieri.csv` | Parole chiave Phrase + Exact per ogni zona |
| `rsa-quartieri.csv` | Annunci RSA (titoli + descrizioni) |
| `negative-keywords.csv` | Parole negative comuni |
| `impostazioni-campagna.txt` | Target geografico e estensioni |

## Come importare (Google Ads Editor)

1. Scarica [Google Ads Editor](https://ads.google.com/home/tools/ads-editor/)
2. Accedi all'account Google Ads
3. **Account → Importa → Da file**
4. Importa prima `keywords-quartieri.csv`
5. Poi importa `rsa-quartieri.csv`
6. Poi `negative-keywords.csv`
7. Controlla anteprima → **Pubblica**

Se Editor segnala colonne mancanti, mappa: Campaign, Ad Group, Keyword, Criterion Type, Final URL.

## Struttura campagna

- **1 campagna:** `PI Verona Quartieri`
- **36 gruppi di annunci:** uno per quartiere/comune (es. AG - Borgo Trento)
- **Keyword:** idraulico [zona], idraulico urgente [zona], pronto intervento idraulico [zona]
- **Landing page:** pagina quartiere corrispondente su gala400.it

## Importante

- **Località annuncio:** resta Verona e provincia (non puoi targettare solo un quartiere in Google Ads), ma le **keyword** catturano chi cerca il quartiere specifico.
- Usa **corrispondenza a frase ed esatta** per evitare sprechi.
- Collega **numero 349 420 8551** come estensione chiamata.
- Per test A/B: duplica 3–5 quartieri con più ricerche (Centro, Borgo Trento, Borgo Roma, San Zeno).

## Rigenerare i file

```bash
npm run ads
```

Dopo ogni modifica ai quartieri in `scripts/site-data.mjs`.
