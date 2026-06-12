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
  const seo = content.servizioSeo(svc);
  const title = seo.title;
  const desc = svc.urgent
    ? `${seo.h1} a Verona ☎ ${SITE.phone}. ${svc.short} Arrivo ~${SITE.arrivalMin} min. Gala 400 Srls — chiama ora.`
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
<section class="hero${svc.urgent ? ' hero-urgent hero-convert' : ''}">
  <div class="container">
    ${svc.urgent ? L.heroPhonePrimary('hero') : ''}
    <div class="hero-grid${svc.urgent ? ' hero-grid-compact' : ''}">
    <div class="hero-copy">
      ${L.heroEyebrow(svc.urgent)}
      <h1>${L.esc(seo.h1)} <span class="text-accent">${L.esc(seo.accent)}</span></h1>
      <p class="hero-lead">${seo.lead}</p>
      ${L.checkList(content.servizioBullets(svc))}
    </div>
    <div class="hero-aside">
      ${svc.urgent ? L.heroProof() : L.heroVisual(I.iconServizio(svc.slug), svc.name)}
      ${L.ctaBlock(svc.name.toLowerCase(), 'hero')}
    </div>
    </div>
  </div>
</section>
${L.trustBar()}
${svc.urgent ? content.urgentIntentSection(svc) : ''}
${svc.urgent ? L.midCta(`Emergenza a Verona? Chiama ${SITE.phone}`) : ''}
<section class="section section-compact">
  <div class="container prose">
    ${L.sectionTitle(`${seo.h1} a Verona`, I.ICON.services, true)}
    ${content.servizioBody(svc)}
    ${L.stepsRow()}
  </div>
</section>
${svc.urgent
    ? `<section class="section section-alt section-compact">
  <div class="container">
    ${L.sectionTitle('Zone coperte — Verona', I.ICON.location)}
    ${L.cardGrid(relatedZones.slice(0, 6), 2)}
    <p class="text-center mt"><a class="link-more" href="../quartieri/index.html">Tutte le zone →</a></p>
  </div>
</section>`
    : `<section class="section section-alt">
  <div class="container">
    ${L.sectionTitle('Zone servite', I.ICON.location)}
    <p class="section-intro">Interveniamo rapidamente nei principali quartieri di Verona e in provincia.</p>
    ${L.cardGrid(relatedZones, 3)}
    <p class="text-center mt"><a class="link-more" href="../quartieri/index.html">Tutte le zone di Verona →</a></p>
  </div>
</section>`}
${svc.category === 'caldaie' && !svc.urgent ? `<section class="section"><div class="container">
  ${L.sectionTitle('Marche caldaie assistite', I.ICON.boiler)}
  <p class="section-intro">Assistenza, manutenzione e riparazione sulle principali marche installate in Italia.</p>
  ${L.cardGrid(marcheLinks, 3)}
  <p class="text-center mt"><a class="link-more" href="../marche/index.html">Vedi tutte le marche →</a></p>
</div></section>` : ''}
${content.faqServizio(svc).length ? L.faqSection(content.faqServizio(svc)) : ''}
${svc.urgent ? '' : L.callbackForm(1, svc.slug)}
<section class="section cta-section"><div class="container container-narrow">
  <h2 class="section-title">${svc.urgent ? `Chiama per ${L.esc(seo.h1.toLowerCase())}` : 'Richiedi intervento'}</h2>
  <p class="section-intro">${svc.urgent ? `Linea diretta h24 · ${SITE.legalName}` : `Per ${L.esc(svc.name.toLowerCase())} a Verona siamo disponibili.`}</p>
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
<section class="hero hero-urgent hero-convert">
  <div class="container">
    ${L.heroPhonePrimary('hero')}
    <div class="hero-grid hero-grid-compact">
    <div class="hero-copy">
      ${L.heroEyebrow(true)}
      <p class="eyebrow-zone">${label} · ${L.esc(q.name)}</p>
      <h1>Idraulico urgente <span class="text-accent">${L.esc(q.name)}</span></h1>
      <p class="hero-lead">Servizio idraulico e termico in ${L.esc(q.highlight)}. Per urgenze chiama il numero in alto.</p>
    </div>
    <div class="hero-aside">
      ${L.ctaBlock(`idraulico ${q.name}`, 'hero')}
    </div>
    </div>
  </div>
</section>
${L.trustBar()}
${L.midCta(`Idraulico urgente a ${q.name}?`)}
<section class="section">
  <div class="container prose">
    ${L.sectionTitle(`Idraulico a ${q.name}`, I.ICON.location, true)}
    ${content.quartiereIntro(q)}
    ${content.quartiereLocal(q)}
    <h3>Servizi disponibili in zona</h3>
    ${L.inlineTags(['Perdite acqua', 'Caldaie', 'Spurghi', 'Gas', 'Condomini', 'Scaldabagni'])}
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
${L.callbackForm(1, q.slug)}
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
  <h3><span class="block-mono" aria-hidden="true">${I.iconCaldaiaTipo(tipo.slug)}</span> ${L.esc(tipo.name)} caldaie ${L.esc(m.name)}</h3>
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
<section class="hero hero-urgent hero-convert">
  <div class="container">
    ${L.heroPhonePrimary('hero')}
    <div class="hero-grid hero-grid-compact">
    <div class="hero-copy">
      ${L.heroEyebrow(true)}
      <p class="eyebrow-zone">Caldaie ${L.esc(m.name)}</p>
      <h1>Assistenza <span class="text-accent">${L.esc(m.name)}</span> Verona</h1>
      <p class="hero-lead">Manutenzione, assistenza urgente e riparazione su impianti ${L.esc(m.name)}.</p>
    </div>
    <div class="hero-aside">
      ${L.ctaBlock(`caldaia ${m.name}`, 'hero')}
    </div>
    </div>
  </div>
</section>
${L.trustBar()}
${L.midCta(`Caldaia ${m.name} in blocco?`)}
<section class="section">
  <div class="container prose">
    ${L.sectionTitle(`Assistenza ${m.name} a Verona`, I.ICON.boiler, true)}
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
${L.callbackForm(1, m.slug)}
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
</section>
${L.callbackForm(1, folder)}`;

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
  const title = `Idraulico vicino a te Verona ${SITE.phone} | Pronto intervento h24`;
  const desc = `Idraulico vicino a te a Verona ☎ ${SITE.phone}. Pronto intervento h24, arrivo ~${SITE.arrivalMin} min. ${SITE.legalName} P.IVA ${SITE.piva}. Chiama ora.`;

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
<section class="hero hero-home hero-urgent hero-convert">
  <div class="container">
    ${L.heroPhonePrimary('hero')}
    <div class="hero-grid hero-grid-convert">
      <div class="hero-copy">
        ${L.heroEyebrow(true)}
        <h1>Idraulico a Verona<br><span class="text-accent">pronto intervento h24</span></h1>
        <p class="hero-lead">Perdite d'acqua, caldaia spenta, gas o scarico intasato: <strong>chiama il numero sopra</strong>. Tecnico in zona, arrivo medio ~${SITE.arrivalMin} minuti.</p>
        ${L.checkList([
          'Intervento in tutta Verona e provincia',
          'Preventivo comunicato prima di iniziare',
          'Disponibili notte, domenica e festivi',
        ])}
      </div>
      <div class="hero-aside">
        ${L.heroProof()}
        ${L.ctaBlock('idraulico urgente Verona', 'hero-sidebar')}
      </div>
    </div>
  </div>
</section>
${L.trustBar()}
${L.midCta('Emergenza adesso? Chiama subito')}
<section class="section section-compact" id="servizi">
  <div class="container">
    ${L.sectionTitle('Cosa risolviamo più spesso', I.ICON.services)}
    ${L.cardGrid(serviziTop.slice(0, 4), 2)}
    <p class="text-center mt"><a class="link-more" href="servizi/pronto-intervento-idraulico-verona.html">Pronto intervento urgente →</a></p>
  </div>
</section>
<section class="section section-alt section-compact" id="zone">
  <div class="container">
    ${L.sectionTitle('Zone coperte a Verona', I.ICON.zones)}
    ${L.cardGrid(zoneTop.slice(0, 4), 2)}
    <p class="text-center mt"><a class="link-more" href="quartieri/index.html">Tutte le zone →</a></p>
  </div>
</section>
${L.homeFaq()}
${L.callbackForm(0, 'home')}
<section class="section gbp-row section-compact"><div class="container text-center">
  <a class="gbp-link" href="${SITE.gbp}" rel="noopener" target="_blank">Recensioni Google — Gala 400 Verona</a>
</section>
<section class="section cta-section"><div class="container container-narrow">
  <h2 class="section-title">Linea diretta idraulico Verona</h2>
  <p class="section-intro">Nessun call center · ${SITE.legalName} · P.IVA ${SITE.piva}</p>
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
