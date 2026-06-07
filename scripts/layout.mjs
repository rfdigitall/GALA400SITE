import { SITE } from './site-data.mjs';
import { ICON, TRUST_ITEMS, STEPS } from './icons.mjs';

export function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function waLink(text) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
}

export function rel(depth) {
  return depth ? '../'.repeat(depth) : '';
}

export function head({ title, description, canonical, depth = 0 }) {
  const r = rel(depth);
  return `<!DOCTYPE html>
<html lang="it-IT">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="robots" content="index, follow, max-snippet:-1">
  <meta name="geo.region" content="IT-VR">
  <meta name="geo.placename" content="Verona">
  <meta name="geo.position" content="${SITE.geo.lat};${SITE.geo.lng}">
  <meta name="ICBM" content="${SITE.geo.lat}, ${SITE.geo.lng}">
  <meta name="format-detection" content="telephone=yes">
  <link rel="canonical" href="${esc(canonical)}">
  <link rel="alternate" hreflang="it-IT" href="${esc(canonical)}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="it_IT">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${esc(canonical)}">
  <meta property="og:site_name" content="${esc(SITE.businessName)}">
  <meta name="theme-color" content="#0c1f33">
  <link rel="preload" href="${r}css/site.css" as="style">
  <link rel="icon" href="${r}favicon.ico" sizes="32x32">
  <link rel="icon" type="image/png" sizes="48x48" href="${r}assets/favicon-48.png">
  <link rel="icon" type="image/png" sizes="96x96" href="${r}assets/favicon-96.png">
  <link rel="icon" type="image/png" sizes="192x192" href="${r}assets/favicon-192.png">
  <link rel="icon" href="${r}assets/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" sizes="180x180" href="${r}assets/apple-touch-icon.png">
  <link rel="manifest" href="${r}site.webmanifest">
  <link rel="stylesheet" href="${r}css/site.css">
  <!-- Google tag (gtag.js) — AW-18106797178 -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=${SITE.gtag}"></script>
  <script>
    window.dataLayer=window.dataLayer||[];
    function gtag(){dataLayer.push(arguments);}
    gtag('js',new Date());
    gtag('config','${SITE.gtag}',{'phone_conversion_number':'${SITE.phone}'});
  </script>
  <script src="${r}js/phone-conversion.js" defer></script>
  <script>
    function gtag_report_conversion(url){
      var cb=function(){if(typeof url!=='undefined')window.location.href=url;};
      gtag('event','conversion',{send_to:'${SITE.conversion}',event_callback:cb});
      return false;
    }
  </script>`;
}

/** Fascia urgenza — tap diretto al telefono */
export function urgencyStrip() {
  return `<a href="tel:${SITE.phoneTel}" class="urgency-strip" role="status" data-cta="strip-call">
  <div class="container urgency-strip-inner">
    <span class="live-dot" aria-hidden="true"></span>
    <span class="urgency-strip-text"><strong>Pronto intervento attivo</strong> — Verona · ~${SITE.arrivalMin} min</span>
    <span class="urgency-strip-phone">${SITE.phone}</span>
  </div>
</a>`;
}

/** Blocco telefono hero — primo elemento su mobile */
export function heroPhonePrimary(id = 'hero-top') {
  return `<a href="tel:${SITE.phoneTel}" class="hero-phone-tap" data-cta="${id}-call">
  <span class="hero-phone-status"><span class="live-dot"></span> Disponibile ora · Verona e provincia</span>
  <span class="hero-phone-label">Emergenza idraulica — tocca per chiamare</span>
  <span class="hero-phone-num">${SITE.phone}</span>
  <span class="hero-phone-meta">${SITE.legalName} · P.IVA ${SITE.piva}</span>
</a>`;
}

export function heroEyebrow(urgent = true) {
  if (!urgent) return `<p class="eyebrow">Gala 400 · Idraulici a Verona dal ${SITE.sinceYear}</p>`;
  return `<p class="eyebrow eyebrow-urgent"><span class="live-dot"></span> Tecnico disponibile ora · Verona e provincia</p>`;
}

export function heroProof() {
  return `<div class="hero-proof" aria-label="Perché scegliere Gala 400">
  <p class="hero-proof-kicker">Idraulico vicino a te · zona Verona VR</p>
  <ul class="hero-proof-list">
    <li><strong>~${SITE.arrivalMin} min</strong> arrivo medio in città</li>
    <li><strong>${SITE.legalName}</strong> · P.IVA ${SITE.piva}</li>
    <li><strong>H24</strong> perdite acqua, gas, caldaie, spurghi</li>
  </ul>
  <p class="hero-proof-note">Parli direttamente con un tecnico — niente centralino estero.</p>
</div>`;
}

export function heroVisual(mono, caption = 'Gala 400 · Verona') {
  const label = esc(String(mono || 'G4').slice(0, 3).toUpperCase());
  return `<div class="hero-visual" aria-hidden="true">
  <div class="hero-visual-frame">
    <span class="hero-visual-mono">${label}</span>
    <span class="hero-visual-cap">${esc(caption)}</span>
  </div>
</div>`;
}

export function checkList(items) {
  const lis = items
    .map((item) => {
      if (typeof item === 'string') {
        return `<li><span class="check-ico" aria-hidden="true">${ICON.check}</span>${esc(item)}</li>`;
      }
      return `<li><span class="check-ico" aria-hidden="true">${item.icon || ICON.check}</span>${esc(item.text)}</li>`;
    })
    .join('');
  return `<ul class="check-list">${lis}</ul>`;
}

export function sectionTitle(text, icon = '', left = false) {
  const ico = icon ? `<span class="section-title-ico" aria-hidden="true">${icon}</span>` : '';
  const cls = left ? 'section-title left' : 'section-title';
  return `<h2 class="${cls}">${ico}${esc(text)}</h2>`;
}

export function stepsRow() {
  return `<div class="steps-row">${STEPS.map(
    (s, i) => `<div class="step-card">
  <span class="step-num">${i + 1}</span>
  <p>${esc(s.text)}</p>
</div>`
  ).join('')}</div>`;
}

export function featureStrip(items) {
  return `<div class="feature-strip">
  <div class="container feature-grid">${items
    .map(
      (f) => `<div class="feature-card">
    <strong>${esc(f.title)}</strong>
    <span>${esc(f.desc)}</span>
  </div>`
    )
    .join('')}</div>
</div>`;
}

export function inlineTags(tags) {
  return `<ul class="inline-tags">${tags
    .map((t) => {
      const label = typeof t === 'string' ? t : t.label;
      const icon = typeof t === 'string' ? null : t.icon;
      const ico = icon ? `<span aria-hidden="true">${icon}</span> ` : '';
      return `<li>${ico}${esc(label)}</li>`;
    })
    .join('')}</ul>`;
}

export function schemaGraph(graph) {
  return `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 0)}</script>`;
}

export function businessSchema(extra = {}) {
  return {
    '@type': ['Plumber', 'LocalBusiness'],
    '@id': `${SITE.domain}/#business`,
    name: SITE.businessName,
    legalName: SITE.legalName,
    taxID: SITE.piva,
    telephone: SITE.phoneE164,
    url: SITE.domain,
    priceRange: '€€',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Verona',
      addressRegion: 'VR',
      postalCode: '37100',
      addressCountry: 'IT',
    },
    geo: { '@type': 'GeoCoordinates', latitude: SITE.geo.lat, longitude: SITE.geo.lng },
    areaServed: { '@type': 'City', name: 'Verona' },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
    ...extra,
  };
}

export function header(depth) {
  const r = rel(depth);
  return `<header class="topbar">
  <div class="container topbar-inner">
    <a class="brand" href="${r}index.html">
      <span class="brand-mark" aria-hidden="true">${ICON.brand}</span>
      <span class="brand-text">
        <span class="brand-name">Gala 400</span>
        <span class="brand-tag">Idraulico · Verona</span>
      </span>
    </a>
    <a class="topbar-phone" href="tel:${SITE.phoneTel}" data-cta="header-tel">
      <span class="topbar-phone-label">Pronto intervento h24</span>
      <span class="topbar-phone-num">${SITE.phone}</span>
    </a>
  </div>
</header>`;
}

export function navMain(depth, active = '') {
  const r = rel(depth);
  const items = [
    { href: `${r}index.html`, label: 'Home', id: 'home' },
    { href: `${r}servizi/index.html`, label: 'Servizi', id: 'servizi' },
    { href: `${r}quartieri/index.html`, label: 'Zone', id: 'quartieri' },
    { href: `${r}marche/index.html`, label: 'Caldaie', id: 'marche' },
  ];
  const callHref = `tel:${SITE.phoneTel}`;
  const callLink = `<a href="${callHref}" class="nav-call" data-cta="nav-call">${SITE.phone}</a>`;
  const links = items
    .map(
      (i) =>
        `<a href="${i.href}"${active === i.id ? ' class="is-active"' : ''}>${i.label}</a>`
    )
    .join('');
  return `<nav class="nav-main" aria-label="Menu principale"><div class="container nav-inner">${links}${callLink}</div></nav>`;
}

export function breadcrumb(items) {
  const li = items
    .map((it, i) => {
      if (i === items.length - 1) return `<li aria-current="page">${esc(it.name)}</li>`;
      return `<li><a href="${esc(it.href)}">${esc(it.name)}</a></li>`;
    })
    .join('');
  return `<nav class="breadcrumb" aria-label="Breadcrumb"><div class="container"><ol>${li}</ol></div></nav>`;
}

export function ctaBlock(context, id = 'cta') {
  return `<div class="cta-panel" id="${id}">
  <a href="tel:${SITE.phoneTel}" class="btn btn-primary btn-block btn-call-hero btn-pulse" data-cta="${id}-call">
    <span class="btn-sub">Emergenza? Tocca per chiamare</span>
    <span class="btn-phone">${SITE.phone}</span>
  </a>
  <p class="cta-trust">Risposta diretta · niente call center · preventivo prima dei lavori</p>
  <a href="${waLink(`Richiesta ${context} a Verona`)}" class="btn btn-secondary btn-block btn-wa-quiet" rel="noopener" target="_blank" data-cta="${id}-wa">Scrivi su WhatsApp</a>
  <p class="cta-meta">${SITE.promo} · ${SITE.legalName}</p>
</div>`;
}

export function trustBar() {
  const items = TRUST_ITEMS.map((t, i) => {
    const strong = t.key === 'arrival' ? `${SITE.arrivalMin} min` : t.strong;
    return `<div class="trust-item">
    <span class="trust-num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
    <strong>${strong}</strong><span>${t.span}</span>
  </div>`;
  });
  return `<div class="trust-bar">
  <div class="container trust-grid">${items.join('')}</div>
</div>`;
}

export function faqSection(faqs) {
  const items = faqs
    .map(
      (f) => `<details class="faq"><summary><span class="faq-ico" aria-hidden="true">${ICON.faq}</span>${esc(f.q)}</summary><div class="faq-a"><p>${f.a}</p></div></details>`
    )
    .join('');
  return `<section class="section section-alt"><div class="container container-narrow">
  ${sectionTitle('Domande frequenti', ICON.faq)}
  <div class="faq-list">${items}</div>
</div></section>`;
}

export function cardGrid(links, cols = 3) {
  const items = links
    .map(
      (l) => `<a class="card-link" href="${l.href}">
  ${l.icon ? `<span class="card-link-icon" aria-hidden="true"><span class="card-mono">${esc(String(l.icon))}</span></span>` : ''}
  <span class="card-link-body">
    <span class="card-link-title">${esc(l.title)}</span>
    ${l.desc ? `<span class="card-link-desc">${esc(l.desc)}</span>` : ''}
  </span>
  <span class="card-link-arrow" aria-hidden="true">→</span>
</a>`
    )
    .join('');
  return `<div class="card-grid cols-${cols}">${items}</div>`;
}

export function midCta(text = 'Emergenza idraulica a Verona?') {
  return `<section class="mid-cta">
  <div class="container mid-cta-inner">
    <div>
      <p class="mid-cta-title">${esc(text)}</p>
      <p class="mid-cta-sub">Tecnico in arrivo in ~${SITE.arrivalMin} minuti · Verona VR</p>
    </div>
    <a href="tel:${SITE.phoneTel}" class="btn btn-primary btn-cta-inline btn-pulse" data-cta="mid-call">
      <span class="btn-phone">${SITE.phone}</span>
    </a>
  </div>
</section>`;
}

export function callbackForm(depth, idSuffix = 'main') {
  const r = rel(depth);
  const sid = esc(idSuffix);
  return `<section class="section section-callback" id="richiamata">
  <div class="container container-narrow">
    ${sectionTitle('Richiamata immediata', ICON.callback)}
    <p class="section-intro">Per urgenze chiama subito <a href="tel:${SITE.phoneTel}" class="link-accent link-tel" data-cta="richiamata-tel">${SITE.phone}</a>. Il form sotto è per richiamata non urgente.</p>
    <form name="richiamata" method="POST" data-netlify="true" data-ads-track="richiamata" netlify-honeypot="bot-field" action="${r}index.html?ok=1#richiamata" class="callback-form">
      <input type="hidden" name="form-name" value="richiamata">
      <p class="sr-only"><label>Non compilare <input name="bot-field"></label></p>
      <label class="field-label" for="tel-cb-${sid}">Telefono</label>
      <input id="tel-cb-${sid}" name="telefono" type="tel" inputmode="tel" autocomplete="tel" required placeholder="349 123 4567">
      <label class="field-label" for="zona-cb-${sid}">Zona a Verona</label>
      <input id="zona-cb-${sid}" name="zona" type="text" required placeholder="Es. Borgo Trento">
      <button type="submit" class="btn-callback" data-cta="richiamata-invio">Richiedi richiamata</button>
      <p id="richiamata-ok" class="form-ok" hidden>Grazie. Per urgenze chiama <a href="tel:${SITE.phoneTel}">${SITE.phone}</a>.</p>
    </form>
  </div>
</section>`;
}

export function stickyMobileCta() {
  return `<div class="sticky-mobile" role="complementary" aria-label="Chiama ora">
  <a href="tel:${SITE.phoneTel}" class="sticky-call btn-pulse" data-cta="sticky-call">
    <span class="sticky-call-label">Emergenza idraulica Verona</span>
    <span class="sticky-call-num">${SITE.phone}</span>
  </a>
</div>`;
}

export function floatCallDesktop() {
  return `<a href="tel:${SITE.phoneTel}" class="float-call" data-cta="float-call" aria-label="Chiama ${SITE.phone}">
  ${ICON.phone}
  <span class="float-call-tip">Chiama ora</span>
</a>`;
}

export function callGateModal() {
  return `<div id="call-gate" class="call-gate is-hidden" role="dialog" aria-modal="true" aria-label="Emergenza idraulica">
  <div class="call-gate-card">
    <p class="call-gate-kicker"><span class="live-dot"></span> Tecnico disponibile</p>
    <p class="call-gate-title">Hai un'emergenza idraulica?</p>
    <p class="call-gate-text">Perdita d'acqua, caldaia o scarico? Chiama ora — ${SITE.legalName}, Verona.</p>
    <a href="tel:${SITE.phoneTel}" class="call-gate-btn btn-pulse" data-cta="gate-call">${SITE.phone}</a>
    <p class="call-gate-sub">Tocca il numero · risposta diretta · preventivo prima dei lavori</p>
    <button type="button" class="call-gate-dismiss" id="call-gate-close">No, continuo a guardare</button>
  </div>
</div>`;
}

export function cookieBanner(depth) {
  const r = rel(depth);
  return `<div id="cookie-banner" class="cookie-banner is-hidden" role="dialog" aria-label="Cookie">
  <p>Cookie tecnici. <a href="${r}cookie-policy.html">Policy</a> · <a href="${r}privacy-policy.html">Privacy</a></p>
  <button type="button" class="cookie-accept" id="cookie-accept">OK</button>
</div>`;
}

export function footer(depth) {
  const r = rel(depth);
  return `<footer class="site-footer">
  <div class="container footer-grid">
    <div>
      <p class="footer-brand">${SITE.businessName}</p>
      <p class="footer-tel"><a href="tel:${SITE.phoneTel}">${SITE.phone}</a></p>
      <p class="footer-legal">${SITE.legalName} · P.IVA ${SITE.piva} · REA ${SITE.rea}</p>
    </div>
    <nav class="footer-nav" aria-label="Footer">
      <a href="${r}servizi/index.html">Servizi</a>
      <a href="${r}quartieri/index.html">Zone Verona</a>
      <a href="${r}marche/index.html">Marche caldaie</a>
      <a href="${r}privacy-policy.html">Privacy</a>
      <a href="${r}cookie-policy.html">Cookie</a>
    </nav>
  </div>
  <div class="footer-bottom container">
    <p class="footer-copy">© ${new Date().getFullYear()} ${SITE.legalName}</p>
    <p class="footer-credit">
      <span class="footer-credit-label">Sito realizzato da</span>
      <a href="${SITE.webAgency.url}" class="footer-credit-brand" rel="noopener noreferrer" target="_blank">${SITE.webAgency.name}</a>
    </p>
  </div>
</footer>
${floatCallDesktop()}
${stickyMobileCta()}`;
}

export function homeFaq() {
  return faqSection([
    {
      q: 'Quanto tempo per arrivare a Verona?',
      a: `Per urgenze il tempo medio è circa ${SITE.arrivalMin} minuti in città, h24 inclusi festivi.`,
    },
    {
      q: 'Quanto costa un intervento urgente?',
      a: 'Comunichiamo il preventivo prima di iniziare. Nessun costo nascosto.',
    },
    {
      q: 'Fate pronto intervento di notte?',
      a: 'Sì, 24 ore su 24, 7 giorni su 7, anche notte e festivi.',
    },
    {
      q: 'Qual è il numero da chiamare?',
      a: `Per emergenze chiama subito ${SITE.phone}.`,
    },
  ]);
}

export function pageEnd({ depth, schema }) {
  return `${schema || ''}
</head>
<body>`;
}

export function shell({ depth, headHtml, schema, breadcrumbHtml, body, activeNav, scripts = '' }) {
  const r = rel(depth);
  const uiScript = scripts || `<script src="${r}js/site-ui.js" defer></script>`;
  return `${headHtml}
${schema || ''}
</head>
<body>
${urgencyStrip()}
${header(depth)}
${navMain(depth, activeNav)}
${breadcrumbHtml || ''}
<main>${body}</main>
${footer(depth)}
${callGateModal()}
${cookieBanner(depth)}
${uiScript}
</body>
</html>`;
}
