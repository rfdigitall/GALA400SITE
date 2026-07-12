#!/usr/bin/env node
/**
 * Gala 400 — migrate OLD site pages to V2 design.
 * Run from gala400-site: node scripts/migrate-gala400.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const NEW_ROOT = path.resolve(__dirname, '..');
const OLD_ROOT = path.resolve(NEW_ROOT, '..', '..', 'GALA400SITE');
const OLD_REF = path.resolve(NEW_ROOT, '..', 'GALA400SITE-old-ref');
const GITHUB_OLD = 'https://raw.githubusercontent.com/rfdigitall/GALA400SITE/3d55dd8';
const TEMPLATE = path.join(NEW_ROOT, 'servizi', 'pronto-intervento-idraulico-verona.html');
const SEO_ONLY_STYLE = `<style>.seo-only{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;white-space:nowrap!important;border:0!important}</style>`;
const PHONE = '+393494208551';
const PHONE_DISPLAY = '349 420 8551';
const LASTMOD = '2026-07-11';

const TICKER_ZONES = [
  'Verona Centro', 'Borgo Trento', 'Borgo Roma', 'San Zeno', 'Veronetta',
  'Golosine', 'Santa Lucia', 'Montorio', 'Borgo Milano', 'San Paolo',
  'Chievo', 'Valdonega', 'Cittadella', 'Filippini', 'Stadio',
];

const TICKER_SVG = `<svg class="sc2-ico" viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="14" y="7" width="16" height="7" rx="1.5"/><rect x="18" y="14" width="8" height="10" rx="1"/><rect x="10" y="24" width="24" height="7" rx="1.5"/><line x1="6" y1="26" x2="10" y2="26"/><line x1="6" y1="29" x2="10" y2="29"/><line x1="34" y1="26" x2="38" y2="26"/><line x1="34" y1="29" x2="38" y2="29"/><path d="M22 31 L20 35.5 Q20 38.5 22 38.5 Q24 38.5 24 35.5 Z" stroke-width="1.3"/></svg>`;

const FAQ_ICO = `<svg class="ico" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2s7 8.5 7 13a7 7 0 11-14 0c0-4.5 7-13 7-13z"/></svg>`;
const TICK2 = `<span class="tick2"><svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg></span>`;

const errors = [];
let generated = 0;

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, 'utf8');
}

function stripTags(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function extractBetween(html, startRe, endMarker) {
  const m = html.match(startRe);
  if (!m) return '';
  const start = m.index;
  const rest = html.slice(start);
  const endIdx = rest.indexOf(endMarker, m[0].length);
  if (endIdx === -1) return '';
  return rest.slice(0, endIdx + endMarker.length);
}

function metaContent(html, name) {
  const re = new RegExp(`<meta\\s+name="${name}"\\s+content="([^"]*)"`, 'i');
  const m = html.match(re);
  return m ? m[1] : '';
}

function metaProperty(html, prop) {
  const re = new RegExp(`<meta\\s+property="${prop}"\\s+content="([^"]*)"`, 'i');
  const m = html.match(re);
  return m ? m[1] : '';
}

function canonical(html) {
  const m = html.match(/<link\s+rel="canonical"\s+href="([^"]*)"/i);
  return m ? m[1] : '';
}

function ldJson(html) {
  const m = html.match(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/i);
  return m ? m[1].trim() : '';
}

function fixLdJson(raw) {
  if (!raw) return '';
  let fixed = raw
    .replace(/"item"\s*:\s*"https:\/\/gala400\.it\/index\.html"/g, '"item":"https://gala400.it/"')
    .replace(/"item"\s*:\s*"https:\/\/gala400\.it\/"/g, '"item":"https://gala400.it/"');
  return fixed;
}

function parseH1(html) {
  const m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  return m ? stripTags(m[1]) : '';
}

function parseHeroLead(html) {
  const m = html.match(/<p\s+class="hero-lead[^"]*"[^>]*>([\s\S]*?)<\/p>/i);
  return m ? stripTags(m[1]) : '';
}

function parseCheckList(html) {
  const items = [];
  const block = html.match(/<ul\s+class="check-list"[^>]*>([\s\S]*?)<\/ul>/i);
  if (!block) return items;
  for (const m of block[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)) {
    const text = stripTags(m[1]);
    if (text) items.push(text);
  }
  return items;
}

function parseProseParagraphs(html) {
  const paras = [];
  for (const m of html.matchAll(/<div\s+class="[^"]*\bprose\b[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/gi)) {
    const block = m[1];
    for (const p of block.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)) {
      let inner = p[1].trim();
      if (!inner || inner.startsWith('<h')) continue;
      if (/<\/h2>/i.test(inner) || /<\/svg>/i.test(inner)) continue;
      paras.push(inner);
    }
  }
  if (paras.length === 0) {
    for (const m of html.matchAll(/<section[^>]*>\s*<div[^>]*class="[^"]*\bprose\b[^"]*"[^>]*>([\s\S]*?)<\/section>/gi)) {
      for (const p of m[1].matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)) {
        let inner = p[1].trim();
        if (!inner || inner.startsWith('<h')) continue;
        if (/<\/h2>/i.test(inner) || /<\/svg>/i.test(inner)) continue;
        paras.push(inner);
      }
    }
  }
  for (const h2 of html.matchAll(/<h2[^>]*class="[^"]*section-title[^"]*"[^>]*>([\s\S]*?)<\/h2>/gi)) {
    const t = stripTags(h2[1]);
    if (t && !paras.some((p) => stripTags(p) === t)) paras.unshift(`<strong>${t}</strong>`);
  }
  return paras.slice(0, 8);
}

function parseCardLinks(html) {
  const links = [];
  for (const m of html.matchAll(/<a\s+class="card-link"\s+href="([^"]+)"[\s\S]*?<span\s+class="card-link-title">([\s\S]*?)<\/span>(?:[\s\S]*?<span\s+class="card-link-desc">([\s\S]*?)<\/span>)?/gi)) {
    links.push({ href: m[1], title: stripTags(m[2]), desc: m[3] ? stripTags(m[3]) : '' });
  }
  return links;
}

async function ensureOldFile(section, file) {
  for (const base of [OLD_ROOT, OLD_REF]) {
    const local = path.join(base, section, file);
    if (fs.existsSync(local)) return local;
  }
  const local = path.join(OLD_REF, section, file);
  fs.mkdirSync(path.dirname(local), { recursive: true });
  const url = `${GITHUB_OLD}/${section}/${encodeURIComponent(file).replace(/%2F/g, '/')}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Old file not found: ${section}/${file}`);
  write(local, await res.text());
  return local;
}

function normalizeCardHref(href) {
  return href.replace(/^\.\.\//, '../');
}

function cardLinkLabel(title) {
  return title
    .replace(/^Idraulico\s+(urgente\s+)?/i, '')
    .replace(/\s*—.*$/, '')
    .trim() || title;
}

function buildLinkGridSection(label, h2, links, ice = false) {
  if (!links.length) return '';
  const items = links.map((c) => {
    const href = normalizeCardHref(c.href);
    const name = cardLinkLabel(c.title);
    return `<a class="zc2" href="${href}"><span class="zdot2"></span><span class="zname2">${name}</span></a>`;
  }).join('');
  const cls = ice ? 'sec2 sec2-ice' : 'sec2';
  return `<section class="${cls}">
  <div class="lbl2">${label}</div>
  <h2>${h2}</h2>
  <div class="zone2-grid">${items}</div>
</section>`;
}

function buildExtraLinkSections(cardLinks) {
  const servizi = cardLinks.filter((c) => c.href.includes('/servizi/'));
  const marche = cardLinks.filter((c) => c.href.includes('/marche/'));
  const quartieri = cardLinks.filter((c) => c.href.includes('/quartieri/'));
  return [
    buildLinkGridSection('Servizi', 'Servizi idraulici<br>in zona.', servizi),
    buildLinkGridSection('Caldaie', 'Assistenza caldaie<br>marche principali.', marche, true),
    buildLinkGridSection('Zone', 'Zone vicine.', quartieri),
  ].join('\n');
}

function parseFaqFromHtml(html) {
  const faqs = [];
  for (const m of html.matchAll(/<details\s+class="faq"[^>]*>\s*<summary[^>]*>([\s\S]*?)<\/summary>\s*<div\s+class="faq-a"[^>]*>([\s\S]*?)<\/div>\s*<\/details>/gi)) {
    const q = stripTags(m[1]);
    const a = stripTags(m[2]);
    if (q && a) faqs.push({ q, a });
  }
  return faqs;
}

function parseFaqFromLd(jsonStr) {
  if (!jsonStr) return [];
  try {
    const data = JSON.parse(jsonStr);
    const graph = data['@graph'] || [data];
    for (const node of graph) {
      if (node['@type'] === 'FAQPage' && node.mainEntity) {
        return node.mainEntity.map((item) => ({
          q: item.name || '',
          a: item.acceptedAnswer?.text || '',
        })).filter((f) => f.q && f.a);
      }
    }
    if (data.mainEntity) {
      return data.mainEntity.map((item) => ({
        q: item.name || '',
        a: item.acceptedAnswer?.text || '',
      })).filter((f) => f.q && f.a);
    }
  } catch {
    /* ignore */
  }
  return [];
}

function zoneNameFromFile(filename) {
  return filename
    .replace(/^idraulico-/, '')
    .replace(/\.html$/, '')
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
    .replace(/Ca Di David/i, "Ca' di David")
    .replace(/San /g, 'San ');
}

function loadTemplate() {
  const html = read(TEMPLATE);
  const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
  const style = styleMatch ? `<style>${styleMatch[1]}</style>` : '';
  const logoMatch = html.match(/<nav class="nav2"[\s\S]*?<img src="(data:image\/png;base64,[^"]+)"/);
  const logoBase64 = logoMatch ? logoMatch[1] : '';
  const contact2 = extractBetween(html, /<section class="contact2"/, '</section>');
  const footerTail = html.slice(html.indexOf('<footer class="foot-pro">'));
  const gtagStart = html.indexOf('<script>\n    window.dataLayer');
  const ldIdx = html.indexOf('<script type="application/ld+json">');
  const gtagBlock = gtagStart >= 0 && ldIdx > gtagStart
    ? html.slice(gtagStart, ldIdx).trim()
    : '';
  const faviconMatch = html.match(/<link rel="icon" href="(data:image[^"]+)"/);
  const favicon = faviconMatch ? faviconMatch[1] : '';
  return { style, logoBase64, contact2, footerTail, gtagBlock, favicon };
}

function buildTicker() {
  const items = [...TICKER_ZONES, ...TICKER_ZONES].map(
    (z) => `<span class="t-item">${z} <span class="t-dot">✦</span></span>`,
  );
  return `<div class="ticker"><div class="ticker-track">${items.join('')}</div></div>`;
}

function buildNav(logoBase64, prefix = '') {
  const home = prefix ? '/' : '/';
  return `<nav class="nav2">
  <a class="nav2-logo" href="${home}"><img src="${logoBase64}" alt="Gala 400 logo"><span>GALA 400</span></a>
  <ul class="nav2-links">
    <li><a href="/#servizi">Servizi</a></li>
    <li><a href="/servizi/">Tutti i servizi</a></li>
    <li><a href="/quartieri/">Zone</a></li>
    <li><a href="/marche/">Caldaie</a></li>
    <li><a href="tel:${PHONE}" class="nav2-cta">${PHONE_DISPLAY}</a></li>
  </ul>
  <button class="hbg2" id="hbg2" aria-label="Menu"><span></span><span></span><span></span></button>
</nav>
<div class="nav2-mobile" id="nav2mobile">
  <a href="/#servizi">Servizi</a>
  <a href="/servizi/">Tutti i servizi</a>
  <a href="/quartieri/">Zone</a>
  <a href="/marche/">Caldaie</a>
  <a href="tel:${PHONE}">${PHONE_DISPLAY}</a>
</div>`;
}

function buildHero2(h1, tagline, waText) {
  const wa = encodeURIComponent(waText || 'Richiesta idraulico urgente Verona');
  return `<section class="hero2">
  <div class="hero2-glow"></div>
  <div class="hero2-fade"></div>
  <div class="hero2-content">
    <div class="hero2-left">
      <div class="hero2-badge"><span class="live-dot" aria-hidden="true"></span>Disponibile ora · Verona e provincia</div>
      <h1 class="hero2-h1">${h1}</h1>
      <p class="hero2-tagline">${tagline || `Intervento idraulico h24 a Verona e provincia. Chiama ${PHONE_DISPLAY} — arrivo medio ~20 minuti, preventivo prima dei lavori.`}</p>
      <div class="hero2-btns">
        <a href="tel:${PHONE}" class="hbtn hbtn-solid" data-cta="hero2-call">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.69 12 19.79 19.79 0 011.61 3.41 2 2 0 013.6 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.91 8.6a16 16 0 006 6l.96-.96a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
          ${PHONE_DISPLAY}
        </a>
        <a href="https://wa.me/393494208551?text=${wa}" class="hbtn hbtn-ghost" rel="noopener" target="_blank" data-cta="hero2-wa-secondary">Scrivi su WhatsApp</a>
      </div>
    </div>
    <div class="hero2-contact">
      <p class="hc-label">Emergenza idraulica</p>
      <a href="tel:${PHONE}" class="hc-phone" data-cta="hero2-contact-call">${PHONE_DISPLAY}</a>
      <p class="hc-meta">Gala 400 Srls · P.IVA 05180000233 · H24</p>
      <a href="https://wa.me/393494208551?text=${wa}" class="hc-wa" rel="noopener" target="_blank" data-cta="hero2-wa">
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51-.17 0-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.08 4.49.7.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35"/><path d="M12 2a10 10 0 00-8.5 15.2L2 22l4.9-1.5A10 10 0 1012 2z"/></svg>
        WhatsApp
      </a>
    </div>
  </div>
</section>`;
}

function buildCheckSection(items, title = 'Quando chiamarmi', subtitle = 'Non aspettare<br>che peggiori.') {
  if (!items.length) {
    items = [
      'Perdite d\'acqua da tubature, rubinetti o sanitari',
      'Scarichi e WC bloccati',
      'Caldaie spente o guasti termici',
      'Emergenze gas — intervento h24',
    ];
  }
  const lis = items.map((t) => `<li>${TICK2}${t}</li>`).join('');
  return `<section class="sec2">
  <div class="lbl2">${title}</div>
  <h2>${subtitle}</h2>
  <ul class="chk-list" style="margin-top:1.6rem;max-width:38rem">${lis}</ul>
</section>`;
}

function buildProcessSection() {
  return `<section class="sec2 sec2-ice">
  <div class="lbl2">Come intervengo</div>
  <h2>Tre passaggi.<br>Nessuna sorpresa.</h2>
  <div class="proc-grid"><div class="ps2"><div class="ps2-n">01</div><div class="ps2-title">Mi chiami</div><p class="ps2-desc">Parli direttamente con me. Mi racconti il problema in 2 minuti.</p></div><div class="ps2"><div class="ps2-n">02</div><div class="ps2-title">Arrivo sul posto</div><p class="ps2-desc">Tempo medio ~20 minuti in città, con l'attrezzatura per la maggior parte dei guasti comuni.</p></div><div class="ps2"><div class="ps2-n">03</div><div class="ps2-title">Preventivo prima di iniziare</div><p class="ps2-desc">Vedi il costo prima che inizi a lavorare. Nessuna sorpresa in fattura.</p></div></div>
</section>`;
}

function buildProseSection(paras) {
  if (!paras.length) return '';
  const ps = paras.map((p) => `<p>${p}</p>`).join('\n    ');
  return `<section class="sec2">
  <div class="lbl2">Informazioni</div>
  <div class="prose2" style="max-width:44rem;margin-top:1.2rem;font-size:.95rem;color:var(--text-soft);line-height:1.75">
    ${ps}
  </div>
</section>`;
}

function buildZoneGrid(cardLinks, sectionDir) {
  const zoneLinks = cardLinks.filter((c) => c.href.includes('/quartieri/'));
  if (!zoneLinks.length) return '';
  const items = zoneLinks.map((c) => {
    const href = c.href.replace(/^\.\.\//, '../');
    const name = c.title.replace(/^.*?—\s*/, '').trim() || stripTags(c.title);
    return `<a class="zc2" href="${href}"><span class="zdot2"></span><span class="zname2">${name}</span></a>`;
  }).join('');
  return `<section class="sec2 seo-only" aria-hidden="true">
  <div class="lbl2">Zone coperte</div>
  <h2>Intervento<br>in zona.</h2>
  <div class="zone2-grid">${items}</div>
  <p style="margin-top:1.2rem"><a href="../quartieri/index.html" class="link-more">Tutte le zone Verona →</a></p>
</section>`;
}

function buildFaqSection(faqs) {
  if (!faqs.length) return '';
  const details = faqs.map((f) =>
    `<details class="faq"><summary><span class="faq-ico" aria-hidden="true">${FAQ_ICO}</span>${f.q}</summary><div class="faq-a"><p>${f.a}</p></div></details>`,
  ).join('');
  return `<section class="section section-alt"><div class="container container-narrow">
  <h2 class="section-title"><span class="section-title-ico" aria-hidden="true">${FAQ_ICO.replace('width="18"', 'width="22"')}</span>Domande frequenti</h2>
  <div class="faq-list">${details}</div>
</div></section>`;
}

function buildHead(meta, tpl, prefix) {
  const p = prefix || '';
  const canon = meta.canonical || `https://gala400.it/${meta.sectionDir}/${meta.filename}`;
  const ld = meta.ldJson ? `\n  <script type="application/ld+json">${fixLdJson(meta.ldJson)}</script>` : '';
  const keywords = meta.keywords ? `\n  <meta name="keywords" content="${meta.keywords}">` : '';
  const ogImage = meta.ogImage || 'https://gala400.it/assets/lavori/spurgo-08-autospurgo.jpg';
  return `<!DOCTYPE html>
<html lang="it-IT">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${meta.title}</title>
  <meta name="description" content="${meta.description.replace(/"/g, '&quot;')}">
  <meta name="robots" content="index, follow, max-snippet:-1">
  <meta name="geo.region" content="IT-VR">
  <meta name="geo.placename" content="Verona">
  <meta name="geo.position" content="45.4384;10.9916">
  <meta name="format-detection" content="telephone=yes">
  <link rel="canonical" href="${canon}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="it_IT">
  <meta property="og:title" content="${meta.ogTitle || meta.title}">
  <meta property="og:description" content="${(meta.ogDescription || meta.description).replace(/"/g, '&quot;')}">
  <meta property="og:url" content="${meta.ogUrl || canon}">
  <meta property="og:site_name" content="Gala 400 — Idraulico Verona">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:image:width" content="640">
  <meta property="og:image:height" content="480">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#0d2038">
  <link rel="manifest" href="${p}site.webmanifest">
  <link rel="icon" href="${tpl.favicon}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,700;0,800;0,900;1,900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">${keywords}
  ${tpl.style}
  ${SEO_ONLY_STYLE}
  ${tpl.gtagBlock}
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orestbida/cookieconsent@3.0.1/dist/cookieconsent.css">
  <script defer src="https://cdn.jsdelivr.net/gh/orestbida/cookieconsent@3.0.1/dist/cookieconsent.umd.js"></script>${ld}
</head>`;
}

async function generatePage(oldPath, outPath, sectionDir, tpl) {
  try {
    const html = read(oldPath);
    const filename = path.basename(oldPath);
    const h1 = parseH1(html) || metaContent(html, 'description').slice(0, 80);
    const heroLead = parseHeroLead(html) || metaContent(html, 'description');
    const checkList = parseCheckList(html);
    const prose = parseProseParagraphs(html);
    const cardLinks = parseCardLinks(html);
    const ldRaw = ldJson(html);
    let faqs = parseFaqFromLd(ldRaw);
    if (!faqs.length) faqs = parseFaqFromHtml(html);

    const meta = {
      title: html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() || h1,
      description: metaContent(html, 'description'),
      keywords: metaContent(html, 'keywords'),
      canonical: canonical(html),
      ogTitle: metaProperty(html, 'og:title'),
      ogDescription: metaProperty(html, 'og:description'),
      ogUrl: metaProperty(html, 'og:url'),
      ogImage: metaProperty(html, 'og:image'),
      ldJson: ldRaw,
      filename,
      sectionDir,
    };

    const waText = `Richiesta idraulico ${stripTags(h1).slice(0, 60)} Verona`;
    const body = `${buildNav(tpl.logoBase64, '../')}
<main>
${buildHero2(h1, heroLead, waText)}
${buildTicker()}
${buildCheckSection(checkList)}
${buildProcessSection()}
${buildProseSection(prose)}
${buildExtraLinkSections(cardLinks)}
${buildZoneGrid(cardLinks, sectionDir)}
${buildFaqSection(faqs)}
${tpl.contact2}
</main>
${tpl.footerTail}`;

    const page = `${buildHead(meta, tpl, '../')}
<body class="home-v2">
${body}`;
    write(outPath, page);
    generated++;
    return { h1, filename, heroLead };
  } catch (e) {
    errors.push(`${oldPath}: ${e.message}`);
    return null;
  }
}

async function migrateSection(section, tpl) {
  const newDir = path.join(NEW_ROOT, section);
  if (!fs.existsSync(newDir)) {
    errors.push(`Missing new dir: ${newDir}`);
    return [];
  }
  const files = fs.readdirSync(newDir).filter((f) => f.endsWith('.html') && f !== 'index.html').sort();
  const results = [];
  for (const file of files) {
    let oldPath;
    try {
      oldPath = await ensureOldFile(section, file);
    } catch (e) {
      errors.push(`${section}/${file}: ${e.message}`);
      continue;
    }
    const info = await generatePage(oldPath, path.join(newDir, file), section, tpl);
    if (info) results.push(info);
  }
  return results;
}

function insertBeforeContact(html, block) {
  const marker = '<section class="contact2"';
  const idx = html.indexOf(marker);
  if (idx === -1) return html;
  return `${html.slice(0, idx)}${block}\n${html.slice(idx)}`;
}

function fixIndexListingPages() {
  fixServiziIndexPage();
  fixQuartieriIndexPage();
  fixMarcheIndexPage();
}

function fixServiziIndexPage() {
  const indexPath = path.join(NEW_ROOT, 'servizi', 'index.html');
  if (!fs.existsSync(indexPath)) return;
  let html = read(indexPath);
  const servizi = parseServiziForIndex();
  const gridHtml = buildSrv2Grid(servizi);
  const block = `<section class="sec2">
  <div class="lbl2">Elenco servizi</div>
  <h2>Tutti i servizi<br>a Verona.</h2>
  <div class="srv2-grid">${gridHtml}</div>
</section>

`;
  html = html.replace(
    /<section class="sec2">\s*<div class="lbl2">Elenco servizi[\s\S]*?<\/section>\s*\n\s*\n/,
    '',
  );
  html = insertBeforeContact(html, block);
  if (!html.includes(SEO_ONLY_STYLE)) {
    html = html.replace('</head>', `  ${SEO_ONLY_STYLE}\n</head>`);
  }
  write(indexPath, html);
}

function fixQuartieriIndexPage() {
  const indexPath = path.join(NEW_ROOT, 'quartieri', 'index.html');
  if (!fs.existsSync(indexPath)) return;
  let html = read(indexPath);
  const zoneGrid = buildZone2GridHome();
  const block = `<section class="sec2">
  <div class="lbl2">Zone coperte</div>
  <h2>Verona.<br>Ogni quartiere.</h2>
  <div class="zone2-grid">${zoneGrid}</div>
</section>

`;
  html = html.replace(
    /<section class="sec2">\s*<div class="lbl2">Zone coperte[\s\S]*?<\/section>\s*\n\s*\n/,
    '',
  );
  html = insertBeforeContact(html, block);
  if (!html.includes(SEO_ONLY_STYLE)) {
    html = html.replace('</head>', `  ${SEO_ONLY_STYLE}\n</head>`);
  }
  write(indexPath, html);
}

function fixMarcheIndexPage() {
  const indexPath = path.join(NEW_ROOT, 'marche', 'index.html');
  if (!fs.existsSync(indexPath)) return;
  let html = read(indexPath);
  const dir = path.join(NEW_ROOT, 'marche');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.html') && f !== 'index.html').sort();
  const items = files.map((file) => {
    const page = read(path.join(dir, file));
    const h1 = parseH1(page);
    let name = h1.replace(/Assistenza caldaia\s*/i, '').replace(/Verona.*$/i, '').trim();
    if (!name) name = file.replace(/-verona\.html$/, '').replace(/-/g, ' ');
    name = name.charAt(0).toUpperCase() + name.slice(1);
    return `<a class="zc2" href="${file}"><span class="zdot2"></span><span class="zname2">${name}</span></a>`;
  }).join('');
  const block = `<section class="sec2">
  <div class="lbl2">Marche caldaie</div>
  <h2>Assistenza<br>caldaie Verona.</h2>
  <div class="zone2-grid">${items}</div>
</section>

`;
  html = html.replace(
    /<section class="sec2">\s*<div class="lbl2">Marche caldaie[\s\S]*?<\/section>\s*\n\s*\n/,
    '',
  );
  html = insertBeforeContact(html, block);
  if (!html.includes(SEO_ONLY_STYLE)) {
    html = html.replace('</head>', `  ${SEO_ONLY_STYLE}\n</head>`);
  }
  write(indexPath, html);
}

function updateSitemap() {
  const src = path.join(OLD_ROOT, 'sitemap.xml');
  if (!fs.existsSync(src)) {
    errors.push('sitemap.xml not found in OLD site');
    return;
  }
  let xml = read(src);
  xml = xml.replace(/<lastmod>[^<]*<\/lastmod>/g, `<lastmod>${LASTMOD}</lastmod>`);
  write(path.join(NEW_ROOT, 'sitemap.xml'), xml);
}

function parseServiziForIndex() {
  const dir = path.join(NEW_ROOT, 'servizi');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.html') && f !== 'index.html').sort();
  return files.map((file, i) => {
    const html = read(path.join(dir, file));
    const h1 = parseH1(html);
    const desc = parseHeroLead(html) || metaContent(html, 'description');
    const title = h1 || file.replace(/\.html$/, '').replace(/-/g, ' ');
    const num = String(i + 1).padStart(2, '0');
    return { file, title, desc, num };
  });
}

function buildSrv2Grid(cards) {
  return cards.map((c) => `<div class="sc2">
  <div class="sc2-num">${c.num}</div>
  ${TICKER_SVG}
  <div class="sc2-title">${c.title}</div>
  <p class="sc2-desc">${c.desc.slice(0, 140)}${c.desc.length > 140 ? '…' : ''}</p>
  <a class="sc2-link" href="servizi/${c.file}">Scopri di più →</a>
</div>`).join('');
}

function buildZone2GridHome() {
  const dir = path.join(NEW_ROOT, 'quartieri');
  const files = fs.readdirSync(dir).filter((f) => f.startsWith('idraulico-') && f.endsWith('.html')).sort();
  return files.map((file) => {
    const html = read(path.join(dir, file));
    const h1 = parseH1(html);
    let name = h1.replace(/Idraulico urgente\s*/i, '').replace(/Idraulico\s*/i, '').trim();
    if (!name) name = zoneNameFromFile(file);
    name = name.replace(/\s*Verona.*$/i, '').trim() || zoneNameFromFile(file);
    return `<a class="zc2" href="quartieri/${file}"><span class="zdot2"></span><span class="zname2">${name}</span></a>`;
  }).join('');
}

function updateIndex() {
  const indexPath = path.join(NEW_ROOT, 'index.html');
  let html = read(indexPath);

  // Nav links
  const navInsert = `<li><a href="/servizi/">Tutti i servizi</a></li>
    <li><a href="/quartieri/">Zone</a></li>
    <li><a href="/marche/">Caldaie</a></li>`;
  if (!html.includes('href="/servizi/"')) {
    html = html.replace(
      /(<ul class="nav2-links">\s*\n\s*<li><a href="#servizi">Servizi<\/a><\/li>)/,
      `$1\n    ${navInsert}`,
    );
  }
  if (!html.includes('nav2mobile') || !html.match(/nav2mobile[\s\S]*href="\/servizi\/"/)) {
    html = html.replace(
      /(<div class="nav2-mobile" id="nav2mobile">\s*\n\s*<a href="#servizi">Servizi<\/a>)/,
      `$1\n  <a href="/servizi/">Tutti i servizi</a>\n  <a href="/quartieri/">Zone</a>\n  <a href="/marche/">Caldaie</a>`,
    );
  }

  // srv2-grid
  const servizi = parseServiziForIndex();
  const gridHtml = buildSrv2Grid(servizi);
  html = html.replace(
    /<div class="srv2-grid">[\s\S]*?<\/div>\s*\n<\/section>\s*\n\s*<section class="sec2 sec2-ice" id="come-lavoro">/,
    `<div class="srv2-grid">${gridHtml}</div>\n  <p style="margin-top:1.2rem"><a href="servizi/index.html" class="link-more">Tutti i servizi →</a></p>\n</section>\n\n<section class="sec2 sec2-ice" id="come-lavoro">`,
  );

  // zone2-grid — nascosto visivamente, resta nel codice per SEO
  const zoneGrid = buildZone2GridHome();
  html = html.replace(
    /<section class="sec2" id="zone">/,
    '<section class="sec2 seo-only" id="zone" aria-hidden="true">',
  );
  html = html.replace(
    /<div class="zone2-grid">[\s\S]*?<\/div>\s*\n<\/section>\s*\n\s*<section class="sec2 sec2-ice">\s*\n\s*<div class="lbl2">Perché chiamarmi/,
    `<div class="zone2-grid">${zoneGrid}</div>\n  <p style="margin-top:1.2rem"><a href="quartieri/index.html" class="link-more">Tutte le zone Verona →</a> · <a href="marche/index.html" class="link-more">Marche caldaie →</a></p>\n</section>\n\n<section class="sec2 sec2-ice">\n  <div class="lbl2">Perché chiamarmi`,
  );
  if (!html.includes(SEO_ONLY_STYLE)) {
    html = html.replace('</head>', `  ${SEO_ONLY_STYLE}\n</head>`);
  }

  write(indexPath, html);
}

async function main() {
  console.log('Gala 400 migration — OLD → V2');
  console.log(`OLD ref: ${OLD_REF} (GitHub ${GITHUB_OLD})`);
  console.log(`NEW: ${NEW_ROOT}`);

  if (!fs.existsSync(TEMPLATE)) {
    console.error('Template not found:', TEMPLATE);
    process.exit(1);
  }

  const tpl = loadTemplate();
  console.log('Template loaded (style, nav logo, contact2, footer, gtag).');

  for (const section of ['servizi', 'quartieri', 'marche']) {
    const n = await migrateSection(section, tpl);
    console.log(`  ${section}: ${n.length} pages`);
  }

  fixIndexListingPages();
  console.log('  index listing pages updated (servizi, quartieri, marche)');

  if (fs.existsSync(path.join(OLD_ROOT, 'sitemap.xml'))) {
    updateSitemap();
    console.log('  sitemap.xml updated');
  }

  updateIndex();
  console.log('  index.html updated');

  console.log(`\nDone. Generated ${generated} HTML files.`);
  if (errors.length) {
    console.log(`Errors (${errors.length}):`);
    errors.forEach((e) => console.log('  -', e));
  }
}

main();
