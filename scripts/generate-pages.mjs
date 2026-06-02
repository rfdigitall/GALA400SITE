/**
 * Genera sito Gala 400 — design premium, SEO locale, geo Verona
 * npm run generate
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SITE, SERVIZI, MARCHE, QUARTIERI, CALDAIA_TIPI } from './site-data.mjs';
import * as content from './content.mjs';
import * as L from './layout.mjs';
import * as I from './icons.mjs';
import { HOME_FEATURES } from './icons.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(ROOT, '..');
const urls = [];

function write(file, html) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html, 'utf8');
}

function pageUrl(parts) {
  return `${SITE.domain}/${parts.filter(Boolean).join('/')}`;
}

function businessGeo(extra = {}) {
  return L.businessSchema({
    areaServed: [
      { '@type': 'City', name: 'Verona' },
      { '@type': 'AdministrativeArea', name: 'Provincia di Verona' },
      ...QUARTIERI.slice(0, 20).map((q) => ({
        '@type': 'Place',
        name: `${q.name}, Verona`,
      })),
    ],
    ...extra,
  });
}

// ——— SERVIZIO ———
function genServizio(svc) {
  const file = `servizi/${svc.slug}-verona.html`;
  const url = pageUrl([file]);
  const title = svc.urgent
    ? `${svc.name} Urgente Verona ☎ ${SITE.phone} | H24`
    : `${svc.name} Verona | ${SITE.phone} | Gala 400`;
  const desc = svc.urgent
    ? `${svc.name} urgente a Verona ☎ ${SITE.phone}. ${svc.short} Arrivo ~${SITE.arrivalMin} min, h24. Chiama ora!`
    : `${svc.name} a Verona: ${svc.short} Chiama ${SITE.phone} — preventivo chiaro.`;

  const schema = L.schemaGraph([
    businessGeo(),
    {
      '@type': 'Service',
      name: `${svc.name} Verona`,
      description: svc.short,
      url,
      provider: { '@id': `${SITE.domain}/#business` },
      areaServed: 'Verona',
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE.domain}/` },
        { '@type': 'ListItem', position: 2, name: 'Servizi', item: `${SITE.domain}/servizi/` },
        { '@type': 'ListItem', position: 3, name: svc.name, item: url },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: content.faqServizio(svc).map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ]);

  const relatedZones = QUARTIERI.slice(0, 9).map((q) => ({
    href: `../quartieri/idraulico-${q.slug}.html`,
    title: `${svc.name} — ${q.name}`,
    desc: 'Intervento in zona',
    icon: I.iconQuartiere(q.slug, q.type),
  }));

  const marcheLinks = MARCHE.slice(0, 9).map((m) => ({
    href: `../marche/${m.slug}-verona.html`,
    title: `Caldaie ${m.name}`,
    desc: 'Assistenza · Manutenzione · Riparazione',
    icon: I.iconMarca(m.slug),
  }));

  const body = `
<section class="hero${svc.urgent ? ' hero-urgent' : ''}">
  <div class="container hero-grid">
    <div class="hero-copy">
      ${L.heroEyebrow(svc.urgent)}
      <h1>${L.esc(svc.name)} <span class="text-accent">Verona</span></h1>
      <p class="hero-lead">${L.esc(svc.short)}</p>
      ${L.checkList(content.servizioBullets(svc))}
    </div>
    <div class="hero-aside">
      ${L.heroVisual(I.heroEmojiForServizio(svc.slug), svc.name)}
      ${L.ctaBlock(svc.name.toLowerCase(), 'hero')}
    </div>
  </div>
</section>
${L.trustBar()}
${svc.urgent ? L.midCta(`Serve ${svc.name.toLowerCase()} adesso?`) : ''}
<section class="section">
  <div class="container prose">
    ${L.sectionTitle(`${svc.name} a Verona: come lavoriamo`, I.iconServizio(svc.slug), true)}
    ${content.servizioBody(svc)}
    ${L.stepsRow()}
  </div>
</section>
<section class="section section-alt">
  <div class="container">
    ${L.sectionTitle('Zone servite', I.ICON.location)}
    <p class="section-intro">Interveniamo rapidamente nei principali quartieri di Verona e in provincia.</p>
    ${L.cardGrid(relatedZones, 3)}
    <p class="text-center mt"><a class="link-more" href="../quartieri/index.html">Tutte le zone di Verona →</a></p>
  </div>
</section>
${svc.category === 'caldaie' ? `<section class="section"><div class="container">
  ${L.sectionTitle('Marche caldaie assistite', I.ICON.boiler)}
  <p class="section-intro">Assistenza, manutenzione e riparazione sulle principali marche installate in Italia.</p>
  ${L.cardGrid(marcheLinks, 3)}
  <p class="text-center mt"><a class="link-more" href="../marche/index.html">Vedi tutte le marche →</a></p>
</div></section>` : ''}
${content.faqServizio(svc).length ? L.faqSection(content.faqServizio(svc)) : ''}
<section class="section cta-section"><div class="container container-narrow">
  <h2 class="section-title">Richiedi intervento</h2>
  <p class="section-intro">Per ${L.esc(svc.name.toLowerCase())} a Verona siamo disponibili h24.</p>
  ${L.ctaBlock(svc.name, 'footer')}
</div></section>`;

  const html = L.shell({
    depth: 1,
    headHtml: L.head({ title, description: desc, canonical: url, depth: 1 }),
    schema,
    breadcrumbHtml: L.breadcrumb([
      { name: 'Home', href: '../index.html' },
      { name: 'Servizi', href: 'index.html' },
      { name: svc.name, href: '#' },
    ]),
    body,
    activeNav: 'servizi',
  });

  write(path.join(OUT, file), html);
  urls.push({ loc: url, priority: svc.urgent ? 0.92 : 0.85 });
}

// ——— QUARTIERE ———
function genQuartiere(q) {
  const file = `quartieri/idraulico-${q.slug}.html`;
  const url = pageUrl([file]);
  const label = q.type === 'comune' ? 'Comune' : 'Quartiere';
  const title = `Idraulico ${q.name} Verona | ${SITE.phone}`;
  const desc = `Idraulico a ${q.name}: pronto intervento, caldaie, perdite acqua e spurghi. ${SITE.phone} — Gala 400, ${q.highlight}.`;

  const schema = L.schemaGraph([
    businessGeo(),
    {
      '@type': 'WebPage',
      name: title,
      description: desc,
      url,
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE.domain}/` },
        { '@type': 'ListItem', position: 2, name: 'Zone Verona', item: `${SITE.domain}/quartieri/` },
        { '@type': 'ListItem', position: 3, name: q.name, item: url },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: content.faqQuartiere(q).map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ]);

  const serviziLinks = SERVIZI.map((s) => ({
    href: `../servizi/${s.slug}-verona.html`,
    title: s.name,
    desc: s.short.slice(0, 55) + (s.short.length > 55 ? '…' : ''),
    icon: I.iconServizio(s.slug),
  }));

  const marcheLinks = MARCHE.slice(0, 12).map((m) => ({
    href: `../marche/${m.slug}-verona.html`,
    title: m.name,
    desc: 'Assistenza · Manutenzione · Riparazione',
    icon: I.iconMarca(m.slug),
  }));

  const nearby = QUARTIERI.filter((x) => x.slug !== q.slug)
    .slice(0, 6)
    .map((x) => ({
      href: `idraulico-${x.slug}.html`,
      title: `Idraulico ${x.name}`,
      desc: x.highlight,
      icon: I.iconQuartiere(x.slug, x.type),
    }));

  const body = `
<section class="hero hero-urgent hero-local">
  <div class="container hero-grid">
    <div class="hero-copy">
      ${L.heroEyebrow(true)}
      <p class="eyebrow-zone">${label} · ${L.esc(q.name)}</p>
      <h1>Idraulico urgente <span class="text-accent">${L.esc(q.name)}</span></h1>
      <p class="hero-lead">Servizio idraulico e termico in ${L.esc(q.highlight)}. Emergenze e manutenzione con tecnici qualificati.</p>
    </div>
    <div class="hero-aside">
      ${L.heroVisual(I.heroEmojiForQuartiere(q.slug, q.type), q.name)}
      ${L.ctaBlock(`idraulico ${q.name}`, 'hero')}
    </div>
  </div>
</section>
${L.trustBar()}
${L.midCta(`Idraulico urgente a ${q.name}?`)}
<section class="section">
  <div class="container prose">
    ${L.sectionTitle(`Idraulico a ${q.name}`, I.iconQuartiere(q.slug, q.type), true)}
    ${content.quartiereIntro(q)}
    ${content.quartiereLocal(q)}
    <h3>${I.ICON.services} Servizi disponibili in zona</h3>
    ${L.inlineTags(['Perdite acqua', 'Caldaie', 'Spurghi', 'Gas', 'Condomini', 'Scaldabagni'].map((label) => ({ label, icon: I.iconTag(label) })))}
  </div>
</section>
<section class="section section-alt">
  <div class="container">
    ${L.sectionTitle('Servizi idraulici', I.ICON.services)}
    ${L.cardGrid(serviziLinks, 3)}
  </div>
</section>
<section class="section">
  <div class="container">
    ${L.sectionTitle('Assistenza caldaie — marche principali', I.ICON.boiler)}
    <p class="section-intro">Manutenzione, assistenza e riparazione sulle caldaie più installate in Italia.</p>
    ${L.cardGrid(marcheLinks, 4)}
    <p class="text-center mt"><a class="link-more" href="../marche/index.html">Elenco completo marche →</a></p>
  </div>
</section>
<section class="section section-alt">
  <div class="container">
    ${L.sectionTitle('Zone vicine', I.ICON.location)}
    ${L.cardGrid(nearby, 3)}
    <p class="text-center mt"><a class="link-more" href="index.html">Tutte le zone →</a></p>
  </div>
</section>
${L.faqSection(content.faqQuartiere(q))}
<section class="section cta-section"><div class="container container-narrow">
  <h2 class="section-title">Chiama l'idraulico a ${L.esc(q.name)}</h2>
  ${L.ctaBlock(`idraulico ${q.name}`, 'footer')}
</div></section>`;

  const html = L.shell({
    depth: 1,
    headHtml: L.head({ title, description: desc, canonical: url, depth: 1 }),
    schema,
    breadcrumbHtml: L.breadcrumb([
      { name: 'Home', href: '../index.html' },
      { name: 'Zone Verona', href: 'index.html' },
      { name: q.name, href: '#' },
    ]),
    body,
    activeNav: 'quartieri',
  });

  write(path.join(OUT, file), html);
  urls.push({ loc: url, priority: 0.9 });
}

// ——— MARCA ———
function genMarca(m) {
  const file = `marche/${m.slug}-verona.html`;
  const url = pageUrl([file]);
  const title = `Assistenza ${m.name} Verona | Manutenzione e Riparazione`;
  const desc = `Assistenza, manutenzione e riparazione caldaie ${m.name} a Verona. Tecnici qualificati. Chiama ${SITE.phone}.`;

  const schema = L.schemaGraph([
    businessGeo(),
    {
      '@type': 'Service',
      name: `Assistenza caldaie ${m.name} Verona`,
      url,
      provider: { '@id': `${SITE.domain}/#business` },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE.domain}/` },
        { '@type': 'ListItem', position: 2, name: 'Marche caldaie', item: `${SITE.domain}/marche/` },
        { '@type': 'ListItem', position: 3, name: m.name, item: url },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: content.faqMarca(m).map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ]);

  const tipoBlocks = CALDAIA_TIPI.map(
    (tipo) => `
<article class="service-block">
  <h3><span class="block-ico" aria-hidden="true">${I.iconCaldaiaTipo(tipo.slug)}</span> ${L.esc(tipo.name)} caldaie ${L.esc(m.name)}</h3>
  <p>${content.marcaServizioBlock(m, tipo)}</p>
  <a class="link-arrow" href="../servizi/${tipo.verb}-caldaia-verona.html">${L.esc(tipo.name)} caldaie Verona →</a>
</article>`
  ).join('');

  const altre = MARCHE.filter((x) => x.slug !== m.slug)
    .slice(0, 8)
    .map((x) => ({
      href: `${x.slug}-verona.html`,
      title: x.name,
      desc: 'Assistenza completa',
      icon: I.iconMarca(x.slug),
    }));

  const body = `
<section class="hero hero-urgent">
  <div class="container hero-grid">
    <div class="hero-copy">
      ${L.heroEyebrow(true)}
      <p class="eyebrow-zone">Caldaie ${L.esc(m.name)}</p>
      <h1>Assistenza <span class="text-accent">${L.esc(m.name)}</span> Verona</h1>
      <p class="hero-lead">Manutenzione, assistenza urgente e riparazione con tecnici esperti su impianti ${L.esc(m.name)}.</p>
    </div>
    <div class="hero-aside">
      ${L.heroVisual(I.heroEmojiForMarca(m.slug), `Caldaie ${m.name}`)}
      ${L.ctaBlock(`caldaia ${m.name}`, 'hero')}
    </div>
  </div>
</section>
${L.trustBar()}
${L.midCta(`Caldaia ${m.name} in blocco?`)}
<section class="section">
  <div class="container prose">
    ${L.sectionTitle(`Assistenza ${m.name} a Verona`, I.iconMarca(m.slug), true)}
    ${content.marcaIntro(m)}
    <div class="service-blocks">${tipoBlocks}</div>
  </div>
</section>
<section class="section section-alt">
  <div class="container">
    ${L.sectionTitle('Altre marche assistite', I.ICON.boiler)}
    ${L.cardGrid(altre, 4)}
    <p class="text-center mt"><a class="link-more" href="index.html">Tutte le marche →</a></p>
  </div>
</section>
${L.faqSection(content.faqMarca(m))}
<section class="section cta-section"><div class="container container-narrow">
  <h2 class="section-title">Caldaia ${L.esc(m.name)} da controllare?</h2>
  ${L.ctaBlock(`assistenza ${m.name}`, 'footer')}
</div></section>`;

  const html = L.shell({
    depth: 1,
    headHtml: L.head({ title, description: desc, canonical: url, depth: 1 }),
    schema,
    breadcrumbHtml: L.breadcrumb([
      { name: 'Home', href: '../index.html' },
      { name: 'Marche caldaie', href: 'index.html' },
      { name: m.name, href: '#' },
    ]),
    body,
    activeNav: 'marche',
  });

  write(path.join(OUT, file), html);
  urls.push({ loc: url, priority: 0.88 });
}

// ——— HUB ———
function hubIcon(folder, file) {
  const base = file.replace(/-verona\.html$/, '').replace(/^idraulico-/, '');
  if (folder === 'servizi') return I.iconServizio(base);
  if (folder === 'quartieri') return I.iconQuartiere(base, 'quartiere');
  if (folder === 'marche') return I.iconMarca(base);
  return I.ICON.default;
}

function genHub(folder, title, desc, items, activeNav) {
  const hubEmoji = folder === 'servizi' ? I.ICON.services : folder === 'quartieri' ? I.ICON.zones : I.ICON.boiler;
  const links = items.map((it) => ({
    href: it.file,
    title: it.title,
    desc: it.desc,
    icon: hubIcon(folder, it.file),
  }));

  const body = `
<section class="hero hero-compact">
  <div class="container hero-grid hero-grid-compact">
    <div class="hero-copy">
      <h1><span class="hero-title-ico" aria-hidden="true">${hubEmoji}</span> ${L.esc(title)}</h1>
      <p class="hero-lead">${L.esc(desc)}</p>
    </div>
    <div class="hero-aside">${L.ctaBlock('idraulico Verona', 'hub')}</div>
  </div>
</section>
${L.trustBar()}
<section class="section">
  <div class="container">
    ${L.cardGrid(links, 3)}
  </div>
</section>`;

  const url = pageUrl([folder, '']);
  const html = L.shell({
    depth: 1,
    headHtml: L.head({
      title: `${title} | Gala 400 Verona`,
      description: desc,
      canonical: url,
      depth: 1,
    }),
    schema: L.schemaGraph([businessGeo()]),
    breadcrumbHtml: L.breadcrumb([
      { name: 'Home', href: '../index.html' },
      { name: title, href: '#' },
    ]),
    body,
    activeNav,
  });

  write(path.join(OUT, folder, 'index.html'), html);
  urls.push({ loc: url, priority: 0.91 });
}

// ——— HOME ———
function genHome() {
  const url = `${SITE.domain}/`;
  const title = `Idraulico Urgente Verona ${SITE.phone} | Pronto Intervento H24`;
  const desc = `Idraulico urgente Verona ☎ ${SITE.phone} — Pronto intervento h24, arrivo ~${SITE.arrivalMin} min. Perdite acqua, caldaie, gas, spurghi. Chiama ora!`;

  const schema = L.schemaGraph([
    businessGeo({
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Servizi idraulici Verona',
        itemListElement: SERVIZI.map((s, i) => ({
          '@type': 'Offer',
          position: i + 1,
          itemOffered: { '@type': 'Service', name: `${s.name} Verona` },
        })),
      },
    }),
    {
      '@type': 'WebSite',
      url: SITE.domain,
      name: SITE.businessName,
      publisher: { '@id': `${SITE.domain}/#business` },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { q: 'Quanto tempo per arrivare a Verona?', a: `Circa ${SITE.arrivalMin} minuti per urgenze, h24 inclusi festivi.` },
        { q: 'Qual è il numero idraulico urgente?', a: `Chiama ${SITE.phone} per pronto intervento immediato.` },
        { q: 'Il preventivo è gratuito?', a: 'Sì, comunicato prima di iniziare ogni lavoro.' },
      ].map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ]);

  const serviziTop = SERVIZI.slice(0, 8).map((s) => ({
    href: `servizi/${s.slug}-verona.html`,
    title: s.name,
    desc: s.short,
    icon: I.iconServizio(s.slug),
  }));

  const zoneTop = QUARTIERI.slice(0, 12).map((q) => ({
    href: `quartieri/idraulico-${q.slug}.html`,
    title: `Idraulico ${q.name}`,
    desc: q.highlight,
    icon: I.iconQuartiere(q.slug, q.type),
  }));

  const marcheTop = MARCHE.slice(0, 12).map((m) => ({
    href: `marche/${m.slug}-verona.html`,
    title: m.name,
    desc: 'Assistenza · Manutenzione · Riparazione',
    icon: I.iconMarca(m.slug),
  }));

  const body = `
<section class="hero hero-home hero-urgent">
  <div class="container hero-grid">
    <div class="hero-copy">
      ${L.heroEyebrow(true)}
      <h1>Idraulico urgente <span class="text-accent">Verona</span><br>Pronto intervento h24</h1>
      <p class="hero-lead">Perdite d'acqua, caldaie spente, gas, spurghi e allagamenti. <strong>Chiama ora</strong> — arrivo medio in ${SITE.arrivalMin} minuti, preventivo prima di iniziare.</p>
      ${L.checkList([
        { icon: I.ICON.urgent, text: 'Disponibili ora — anche notte e festivi' },
        { icon: I.ICON.water, text: 'Perdite acqua · Caldaie · Emergenza gas' },
        { icon: I.ICON.location, text: 'Tutti i quartieri di Verona e provincia' },
      ])}
    </div>
    <div class="hero-aside">
      ${L.heroVisual('🚰', 'Pronto intervento Verona')}
      ${L.ctaBlock('idraulico urgente Verona', 'hero')}
    </div>
  </div>
</section>
${L.trustBar()}
${L.featureStrip(HOME_FEATURES)}
${L.midCta('Hai un\'emergenza idraulica adesso?')}
<section class="section" id="servizi">
  <div class="container">
    ${L.sectionTitle('Servizi idraulici e termici', I.ICON.services)}
    <p class="section-intro">Soluzioni complete per casa, attività commerciali e condomini a Verona.</p>
    ${L.cardGrid(serviziTop, 2)}
    <p class="text-center mt"><a class="link-more" href="servizi/pronto-intervento-idraulico-verona.html">Pronto intervento urgente →</a> · <a class="link-more" href="servizi/index.html">Tutti i servizi</a></p>
  </div>
</section>
${L.midCta('Perdita d\'acqua o caldaia spenta?')}
<section class="section section-alt" id="zone">
  <div class="container">
    ${L.sectionTitle('Idraulico per quartiere e comune', I.ICON.zones)}
    <p class="section-intro">Ogni zona di Verona ha una pagina dedicata con servizi e tempi di intervento.</p>
    ${L.cardGrid(zoneTop, 3)}
    <p class="text-center mt"><a class="link-more" href="quartieri/index.html">Tutte le ${QUARTIERI.length} zone →</a></p>
  </div>
</section>
<section class="section" id="caldaie">
  <div class="container">
    ${L.sectionTitle('Caldaie — marche più diffuse in Italia', I.ICON.boiler)}
    <p class="section-intro">Assistenza, manutenzione e riparazione su Vaillant, Baxi, Ariston, Beretta, Immergas e altre.</p>
    ${L.cardGrid(marcheTop, 4)}
    <p class="text-center mt"><a class="link-more" href="marche/index.html">Tutte le ${MARCHE.length} marche →</a></p>
  </div>
</section>
${L.callbackForm(0)}
${L.homeFaq()}
<section class="section gbp-row"><div class="container text-center">
  <a class="gbp-link" href="${SITE.gbp}" rel="noopener" target="_blank">${I.ICON.google} ${I.ICON.star} Recensioni su Google — Gala 400</a>
</section>
<section class="section cta-section"><div class="container container-narrow">
  <h2 class="section-title">Chiama l'idraulico urgente a Verona</h2>
  <p class="section-intro">Siamo in linea adesso per emergenze acqua, gas e caldaie.</p>
  ${L.ctaBlock('emergenza Verona', 'footer')}
</div></section>`;

  const html = `${L.head({ title, description: desc, canonical: url, depth: 0 })}
<meta name="keywords" content="idraulico urgente verona, pronto intervento idraulico verona, idraulico verona, perdite acqua verona, caldaie verona, spurgo verona">
<link rel="sitemap" type="application/xml" href="/sitemap.xml">
${schema}
</head>
<body>
${L.urgencyStrip()}
${L.header(0)}
${L.navMain(0, 'home')}
<main>${body}</main>
${L.footer(0)}
${L.callGateModal()}
${L.cookieBanner(0)}
<script src="js/site-ui.js" defer></script>
</body>
</html>`;

  write(path.join(OUT, 'index.html'), html);
  urls.push({ loc: url, priority: 1 });
}

// ——— SITEMAP ———
function writeSitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const extra = [
    { loc: `${SITE.domain}/privacy-policy.html`, priority: 0.2 },
    { loc: `${SITE.domain}/cookie-policy.html`, priority: 0.2 },
  ];
  [...urls, ...extra].sort((a, b) => b.priority - a.priority);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...urls, ...extra]
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.priority >= 0.9 ? 'weekly' : 'monthly'}</changefreq>
    <priority>${u.priority.toFixed(2)}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;
  fs.writeFileSync(path.join(OUT, 'sitemap.xml'), xml, 'utf8');
}

// ——— RUN ———
genHome();
SERVIZI.forEach(genServizio);
QUARTIERI.forEach(genQuartiere);
MARCHE.forEach(genMarca);

genHub(
  'servizi',
  'Servizi idraulici Verona',
  'Pronto intervento, caldaie, perdite, spurghi e manutenzione impianti.',
  SERVIZI.map((s) => ({
    file: `${s.slug}-verona.html`,
    title: s.name,
    desc: s.short,
  })),
  'servizi'
);

genHub(
  'quartieri',
  'Zone servite a Verona',
  'Idraulico urgente per ogni quartiere e comune della provincia.',
  QUARTIERI.map((q) => ({
    file: `idraulico-${q.slug}.html`,
    title: `Idraulico ${q.name}`,
    desc: q.highlight,
  })),
  'quartieri'
);

genHub(
  'marche',
  'Marche caldaie assistite',
  'Assistenza, manutenzione e riparazione sulle caldaie più installate in Italia.',
  MARCHE.map((m) => ({
    file: `${m.slug}-verona.html`,
    title: m.name,
    desc: `Assistenza · Manutenzione · Riparazione`,
  })),
  'marche'
);

writeSitemap();

// Rimuovi vecchie pagine marche (URL assistenza-*-verona)
const marcheDir = path.join(OUT, 'marche');
if (fs.existsSync(marcheDir)) {
  for (const f of fs.readdirSync(marcheDir)) {
    if (f.startsWith('assistenza-') && f.endsWith('.html')) {
      fs.unlinkSync(path.join(marcheDir, f));
    }
  }
}

console.log('Sito generato:');
console.log(`  Home: 1`);
console.log(`  Servizi: ${SERVIZI.length} + hub`);
console.log(`  Quartieri: ${QUARTIERI.length} + hub`);
console.log(`  Marche: ${MARCHE.length} + hub`);
console.log(`  URL sitemap: ${urls.length + 2}`);
