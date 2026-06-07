# Gala 400 — Site static (gala400.it)

## De ce nu urci tot site-ul pe GitHub?

Proiectul generează **~90 pagini HTML** (servizi, quartieri, marche).  
Interfața web GitHub („Upload files”) acceptă doar **~100 fișiere** odată — de aceea „sunt prea multe”.

**Soluția:** pe GitHub pui doar **sursa** (~25 fișiere). **Netlify** rulează `npm run build` și publică tot site-ul.

## Ce merge pe GitHub

| Da | Nu (generat la build) |
|----|------------------------|
| `scripts/` | `servizi/*.html` |
| `css/`, `js/`, `assets/` | `quartieri/*.html` |
| `netlify.toml`, `package.json` | `marche/*.html` |
| `privacy-policy.html`, `cookie-policy.html` | `index.html`, `sitemap.xml` |
| `robots.txt`, `google-ads/` | `node_modules/` |

## Comenzi (prima dată pe GitHub)

```bash
cd Desktop/GALA400SITE
git add .
git status
git commit -m "Sursa site Gala 400 — pagini generate pe Netlify"
git branch -M main
git remote add origin https://github.com/rusescunfabian-svg/GALA400SITE.git
git push -u origin master
```

Repo GitHub: **https://github.com/rusescunfabian-svg/GALA400SITE** (proiect Gala 400 / gala400.it)

## Netlify

1. [app.netlify.com](https://app.netlify.com) → Add site → Import from Git
2. Alege repo-ul GitHub
3. Build: `npm run build` (deja în `netlify.toml`)
4. Publish: `.`

La fiecare push, Netlify regenerează toate paginile.

## Local

```bash
npm run build
npm run ads
```

Deschide `index.html` în browser după build.
