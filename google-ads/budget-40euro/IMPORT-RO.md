# Import Google Ads — fix „Nessuna riga di intestazione”

## Cauza reală (documentație Google)

Google Ads Editor pe **Windows / Excel Italia** cere:
- Codificare: **Testo Unicode (UTF-16)** — NU CSV UTF-8
- Salvare: **Salva con nome → Testo Unicode** (extensie .txt)

Fișierele `.csv` UTF-8 dau adesea: *Nessuna riga di intestazione trovata in questo foglio* (și 3 „fogli” vuoti).

---

## SOLUȚIA 1 — Un singur fișier (încearcă prima dată)

1. În folder: `IMPORT-TUTTO.txt`
2. Editor → **Cont → Importa → Da file**
3. Alege `IMPORT-TUTTO.txt` (tip: tutti i file / *.txt)
4. Verifică previzualizarea → **Importa** → **Postează**

Conține: campanii + gruppi + parole chiave (format TAB + UTF-16).

---

## SOLUȚIA 2 — Fișiere separate (.txt Unicode)

Ordine:
1. `01-campaigns.txt`
2. `02-ad-groups.txt`
3. **Postează**
4. `03-keywords.txt`
5. **Postează**

⚠️ **NU** deschide în Excel înainte de import.

---

## SOLUȚIA 3 — Manual (fără CSV)

Citește `MANUAL-5MIN.md` — creezi 2 campanii direct în Editor (5–10 min, zero erori).

---

## Fix „Valore mancante in ID campagna” (keywords separate)

## De ce apare eroarea?

Ai importat doar `keywords.csv` / `03-parole-chiave.csv` **înainte** ca campaniile să existe în cont.

Google Ads Editor (interfață italiană) cere **ID campanie** doar când **actualizezi** campanii existente.
Pentru campanii **noi**, trebuie importate **în ordine**, fără coloana ID.

**Nu mapa** coloana „Campagna” la câmpul „ID campagna” în wizard!

---

## Fix „Nessuna riga di intestazione trovata”

Cauze frecvente:
1. **UTF-8 cu BOM** — fișierele noi sunt **fără BOM**
2. **Anteturi în italiană** — folosește fișierele **fără sufix -IT** (anteturi engleze standard Editor)
3. **Deschis în Excel și resalvato** — poate strica CSV-ul; importă direct fișierul generat

Dacă tot nu merge: încearcă **`01-campaigns-semicolon.csv`** (virgulă → punct și virgulă, Excel Italia).

## Ordinea corectă (Google Ads Editor)

1. **Google Ads Editor** → cont conectat → **Scarica**
2. **Cont → Importa → Da file** → `01-campaigns.csv`
3. La mapare coloane: lasă anteturile **Campaign**, **Campaign status**, etc.
4. **Importa** → apoi `02-ad-groups.csv` → **Postează**
5. **Scarica** (recomandat)
6. `03-keywords.csv` → `04-ads-rsa.csv` → `05-negative-keywords.csv`
7. **Postează** tot

⚠️ Nu folosi `01-campagne-IT.csv` (deprecat) — anteturi greșite pentru Editor.

### După import (manual în Google Ads)

- **Località:** Verona + Provincia di Verona (non in CSV)
- **Lingua:** Italiano
- **Estensione chiamata:** 349 420 8551
- **Obiettivo:** Lead / Chiamate
- Verifică buget: **28€** pe PI-Urgente-Verona, **12€** pe PI-Quartieri-Top8

---

## Dacă ai deja campania veche activă

- **Opțiunea A:** Pauză campania veche → importă fișierele 01–05 (nume noi: PI-Urgente-Verona)
- **Opțiunea B:** În Editor, exportă campania existentă → copiază **ID campanie** în CSV (avansat)

---

## Fișiere în acest folder

| Pas | Fișier principal | Alternativă (Excel IT) |
|-----|------------------|------------------------|
| 1 | `01-campaigns.csv` | `01-campaigns-semicolon.csv` |
| 2 | `02-ad-groups.csv` | `02-ad-groups-semicolon.csv` |
| 3 | `03-keywords.csv` | `03-keywords-semicolon.csv` |
| 4 | `04-ads-rsa.csv` | — |
| 5 | `05-negative-keywords.csv` | — |

Regenerează: `npm run ads`
