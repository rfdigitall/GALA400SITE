import { SITE } from './site-data.mjs';
import { ICON, TRUST_ITEMS, NAV_ICONS, STEPS } from './icons.mjs';

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
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap" rel="stylesheet">
  <link rel="icon" href="${r}assets/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="${r}assets/favicon.svg">
  <link rel="stylesheet" href="${r}css/site.css">
  <script async src="https://www.googletagmanager.com/gtag/js?id=${SITE.gtag}"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${SITE.gtag}',{'phone_conversion_number':'${SITE.phone}'});</script>
  <script src="${r}js/phone-conversion.js" defer></script>
  <script>
    function gtag_report_conversion(url){
      var cb=function(){if(typeof url!=='undefined')window.location.href=url;};
      if(typeof gtag==='function')gtag('event','conversion',{send_to:'${SITE.conversion}',event_callback:cb});
      return false;
    }
  </script>`;
}

/** Fascia urgenza — visibile, non invasiva */
export function urgencyStrip() {
  return `<div class="urgency-strip" role="status">
  <div class="container urgency-strip-inner">
    <span class="live-dot" aria-hidden="true"></span>
    <span>${ICON.urgent} <strong>Pronto intervento attivo</strong> — Verona · ~${SITE.arrivalMin} min</span>
    <a href="tel:${SITE.phoneTel}" class="urgency-strip-phone">${ICON.phone} ${SITE.phone}</a>
  </div>
</div>`;
}

export function heroEyebrow(urgent = true) {
  if (!urgent) return `<p class="eyebrow">Gala 400 · Verona e provincia</p>`;
  return `<p class="eyebrow eyebrow-urgent"><span class="live-dot"></span> ${ICON.urgent} Disponibili ora · Pronto intervento h24</p>`;
}

export function heroVisual(emoji, caption = 'Gala 400 · Verona') {
  return `<div class="hero-visual" aria-hidden="true">
  <div class="hero-visual-frame">
    <span class="hero-visual-emoji">${emoji}</span>
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
  <span class="step-ico" aria-hidden="true">${s.icon}</span>
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
    <span class="feature-ico" aria-hidden="true">${f.icon}</span>
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
      <span class="topbar-phone-label">${ICON.phone} Pronto intervento h24</span>
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
  const links = items
    .map(
      (i) =>
        `<a href="${i.href}"${active === i.id ? ' class="is-active"' : ''}><span class="nav-ico" aria-hidden="true">${NAV_ICONS[i.id] || ''}</span>${i.label}</a>`
    )
    .join('');
  return `<nav class="nav-main" aria-label="Menu principale"><div class="container">${links}</div></nav>`;
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
  <a href="tel:${SITE.phoneTel}" class="btn btn-primary btn-block" data-cta="${id}-call">
    <span class="btn-sub">${ICON.phone} Chiama ora — risposta immediata</span>
    <span class="btn-phone">${SITE.phone}</span>
  </a>
  <a href="${waLink(`Richiesta ${context} a Verona`)}" class="btn btn-secondary btn-block" rel="noopener" target="_blank" data-cta="${id}-wa"><span class="btn-wa-ico" aria-hidden="true">${ICON.whatsapp}</span> Scrivi su WhatsApp</a>
  <p class="cta-meta">${ICON.promo} ${SITE.promo} · ${ICON.shield} Preventivo chiaro · Tecnici qualificati</p>
</div>`;
}

export function trustBar() {
  const items = TRUST_ITEMS.map((t) => {
    const strong = t.key === 'arrival' ? `${SITE.arrivalMin} min` : t.strong;
    return `<div class="trust-item">
    <span class="trust-ico" aria-hidden="true">${t.icon}</span>
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
  ${l.icon ? `<span class="card-link-icon" aria-hidden="true">${l.icon}</span>` : ''}
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
      <p class="mid-cta-title">${ICON.urgent} ${esc(text)}</p>
      <p class="mid-cta-sub">${ICON.clock} Tecnico in arrivo in ~${SITE.arrivalMin} minuti</p>
    </div>
    <a href="tel:${SITE.phoneTel}" class="btn btn-primary btn-cta-inline" data-cta="mid-call">
      <span class="btn-phone">${ICON.phone} ${SITE.phone}</span>
    </a>
  </div>
</section>`;
}

export function callbackForm(depth) {
  const r = rel(depth);
  return `<section class="section section-callback" id="richiamata">
  <div class="container container-narrow">
    ${sectionTitle('Richiamata immediata', ICON.callback)}
    <p class="section-intro">Lascia numero e zona: ti richiamiamo al più presto. Per urgenze ${ICON.phone} <a href="tel:${SITE.phoneTel}" class="link-accent">${SITE.phone}</a>.</p>
    <form name="richiamata" method="POST" data-netlify="true" netlify-honeypot="bot-field" action="${r}index.html?ok=1#richiamata" class="callback-form">
      <input type="hidden" name="form-name" value="richiamata">
      <p class="sr-only"><label>Non compilare <input name="bot-field"></label></p>
      <label class="field-label" for="tel-cb"><span aria-hidden="true">${ICON.phone}</span> Telefono</label>
      <input id="tel-cb" name="telefono" type="tel" inputmode="tel" autocomplete="tel" required placeholder="349 123 4567">
      <label class="field-label" for="zona-cb"><span aria-hidden="true">${ICON.location}</span> Zona a Verona</label>
      <input id="zona-cb" name="zona" type="text" required placeholder="Es. Borgo Trento">
      <button type="submit">${ICON.callback} Richiedi richiamata</button>
      <p id="richiamata-ok" class="form-ok" hidden>Grazie. Per urgenze chiama <a href="tel:${SITE.phoneTel}">${SITE.phone}</a>.</p>
    </form>
  </div>
</section>`;
}

export function stickyMobileCta() {
  return `<div class="sticky-mobile" role="complementary" aria-label="Chiama ora">
  <a href="tel:${SITE.phoneTel}" class="sticky-call" data-cta="sticky-call">
    <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
    Chiama ${SITE.phone}
  </a>
  <a href="${waLink('Urgente idraulico Verona')}" class="sticky-wa" rel="noopener" target="_blank" data-cta="sticky-wa" aria-label="WhatsApp"><span aria-hidden="true">${ICON.whatsapp}</span> WA</a>
</div>`;
}

export function callGateModal() {
  return `<div id="call-gate" class="call-gate is-hidden" role="dialog" aria-modal="true" aria-label="Emergenza idraulica">
  <div class="call-gate-card">
    <p class="call-gate-emoji" aria-hidden="true">${ICON.urgent}</p>
    <p class="call-gate-title">Emergenza idraulica a Verona?</p>
    <p class="call-gate-text">Siamo disponibili ora. Chiama per intervento immediato e preventivo chiaro.</p>
    <a href="tel:${SITE.phoneTel}" class="call-gate-btn" data-cta="gate-call">${ICON.phone} Chiama ${SITE.phone}</a>
    <button type="button" class="call-gate-dismiss" id="call-gate-close">Più tardi</button>
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
      <p class="footer-brand">${ICON.brand} ${SITE.businessName}</p>
      <p class="footer-tel"><a href="tel:${SITE.phoneTel}">${ICON.phone} ${SITE.phone}</a></p>
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
  <p class="footer-copy container">© ${new Date().getFullYear()} ${SITE.legalName}</p>
</footer>
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
