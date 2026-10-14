/**
 * Rewrite Garda city pages with unique copy (anti-duplicate for indexing).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, "..", "quartieri");

const cities = [
  {
    file: "idraulico-peschiera-del-garda.html",
    name: "Peschiera del Garda",
    slug: "peschiera-del-garda",
    badge: "Emergenza lago · porto e fortezza",
    h1: "Idraulico Peschiera del Garda H24",
    tagline:
      "Perdite, scarichi e caldaie sul porto, in centro e verso Madonna del Frassino. Arrivo rapido dalla sponda veronese — un solo numero, senza centralino.",
    meta:
      "Idraulico urgente a Peschiera del Garda H24: perdite, WC intasato, caldaie. Intervento sul porto e centro. Chiama 349 420 8551 — Gala 400.",
    title: "Idraulico Urgente Peschiera del Garda H24 | 349 420 8551",
    checks: [
      "Tubo rotto o perdita sotto lavello al porto / centro storico",
      "Caldaia in blocco in appartamento o casa vacanze",
      "WC o scarico intasato — intervento senza attese",
      "Allagamento garage o cantina vicino al lago",
    ],
    body1:
      "A <strong>Peschiera del Garda</strong> interveniamo su urgenze idrauliche e termiche: dal porto fortificato alle vie del centro, fino alle zone residenziali verso Castelnuovo. Parli con noi, non con un call center.",
    body2:
      "Turisti e residenti: se hai una <strong>perdita</strong>, uno <strong>scarico bloccato</strong> o la <strong>caldaia spenta</strong>, chiama <a href=\"tel:+393494208551\" class=\"link-accent\">349 420 8551</a>. Ti confermo tempi e preventivo prima di iniziare.",
    list: [
      "Pronto intervento idraulico al porto e in centro",
      "Assistenza caldaie (Ariston, Baxi, Vaillant, Immergas…)",
      "Spurghi e WC intasati in giornata",
      "Ricerca perdite e allagamenti",
    ],
    faq: [
      {
        q: "Quanto impiegate ad arrivare a Peschiera?",
        a: "Dalla sponda veronese di solito entro 25–40 minuti, dipende dal traffico sul lago. Al telefono ti do un’ora di arrivo realistica.",
      },
      {
        q: "Fate anche secondi case e affitti turistici?",
        a: "Sì: perdite, scarichi e caldaie in appartamenti e case vacanze. Preferiamo intervento immediato per limitare danni all’immobile.",
      },
      {
        q: "Lavorate su centrali termiche / caldaie?",
        a: "Sì, riparazione e riavvio caldaie e impianti di riscaldamento. Per condominio o centrale, indica il tipo di guasto al telefono.",
      },
    ],
    nearby: [
      ["idraulico-lazise.html", "Lazise"],
      ["idraulico-castelnuovo.html", "Castelnuovo"],
      ["idraulico-sirmione.html", "Sirmione"],
      ["idraulico-bussolengo.html", "Bussolengo"],
      ["idraulico-bardolino.html", "Bardolino"],
      ["idraulico-garda.html", "Garda"],
    ],
    ticker: ["Peschiera porto", "Centro storico", "Madonna del Frassino", "Castelnuovo", "Lazise", "Sirmione"],
    statLabel: "Peschiera",
    eta: "~30 min",
  },
  {
    file: "idraulico-lazise.html",
    name: "Lazise",
    slug: "lazise",
    badge: "Emergenza lago · centro e collina",
    h1: "Idraulico Lazise H24 — lago di Garda",
    tagline:
      "Urgenze idrauliche a Lazise paese, Colà e verso Pacengo: perdite, spurgo, caldaia ferma. Rispondiamo noi al 349.",
    meta:
      "Idraulico a Lazise H24: pronto intervento perdite, scarichi, caldaie. Centro, Colà, Pacengo. Chiama 349 420 8551 — Gala 400 Verona.",
    title: "Idraulico Urgente Lazise Garda H24 | 349 420 8551",
    checks: [
      "Perdita acqua in centro Lazise o in collina",
      "Caldaia in errore / niente acqua calda",
      "Scarico cucina o bagno otturato",
      "Intervento rapido anche in alta stagione",
    ],
    body1:
      "A <strong>Lazise</strong> copriamo il centro storico sul lago, le zone residenziali e le frazioni verso Bardolino e Castelnuovo. Emergenze idrauliche e assistenza caldaie senza centralino.",
    body2:
      "Se l’acqua non scende, c’è una <strong>fuga</strong> o la <strong>centrale / caldaia</strong> non riparte, chiama <a href=\"tel:+393494208551\" class=\"link-accent\">349 420 8551</a>. Preventivo chiaro prima del lavoro.",
    list: [
      "Idraulico urgente Lazise e Colà",
      "Caldaie e impianti di riscaldamento",
      "Spurgo WC e scarichi domestici",
      "Allagamenti e perdite sotto pavimento",
    ],
    faq: [
      {
        q: "Intervenite a Lazise anche di sera?",
        a: "Sì, reperibilità H24. Di notte e nei weekend rispondiamo sullo stesso numero 349 420 8551.",
      },
      {
        q: "Coprite anche Pacengo / Colà?",
        a: "Sì, tutta Lazise e le frazioni sulla sponda veronese. Specifica la via al telefono per stimare i tempi.",
      },
      {
        q: "Sistemate caldaie e centrali termiche?",
        a: "Sì: blocco display, pressione bassa, rumori, mancanza acqua calda. Marche principali in zona Garda.",
      },
    ],
    nearby: [
      ["idraulico-bardolino.html", "Bardolino"],
      ["idraulico-peschiera-del-garda.html", "Peschiera"],
      ["idraulico-garda.html", "Garda"],
      ["idraulico-castelnuovo.html", "Castelnuovo"],
      ["idraulico-bussolengo.html", "Bussolengo"],
      ["idraulico-sirmione.html", "Sirmione"],
    ],
    ticker: ["Lazise centro", "Colà", "Pacengo", "Bardolino", "Peschiera", "Garda"],
    statLabel: "Lazise",
    eta: "~30 min",
  },
  {
    file: "idraulico-bardolino.html",
    name: "Bardolino",
    slug: "bardolino",
    badge: "Emergenza Garda · paese e cantine",
    h1: "Idraulico Bardolino H24",
    tagline:
      "Pronto intervento a Bardolino, Cisano e lungo la sponda: perdite, scarichi bloccati, caldaie. Un tecnico, un numero.",
    meta:
      "Idraulico urgente Bardolino H24: perdite acqua, spurgo, caldaie. Cisano e lungolago. Chiama 349 420 8551 — Gala 400.",
    title: "Idraulico Urgente Bardolino Garda H24 | 349 420 8551",
    checks: [
      "Perdita in abitazione o attività sul lungolago",
      "Caldaia / riscaldamento fuori servizio",
      "WC intasato o scarico che non defluisce",
      "Emergenza anche nei weekend di punta",
    ],
    body1:
      "<strong>Bardolino</strong> e Cisano: interveniamo su impianti idraulici e termici di case, condomini e locali. Dalla riva alle colline verso Garda e Lazise.",
    body2:
      "Per un’emergenza idraulica o una <strong>caldaia in blocco</strong> chiama <a href=\"tel:+393494208551\" class=\"link-accent\">349 420 8551</a>. Ti dico subito se posso partire e quanto tempo ci metto.",
    list: [
      "Pronto intervento Bardolino e Cisano",
      "Riparazione caldaie e scaldabagni",
      "Spurghi e disotturazioni",
      "Ricerca perdite occulte",
    ],
    faq: [
      {
        q: "Siete idraulici anche per attività commerciali a Bardolino?",
        a: "Sì, urgenze su scarichi e perdite in negozi, ristoranti e B&B. Priorità a limitare il fermo attività.",
      },
      {
        q: "Quanto costa un intervento urgente?",
        a: "Dipende dal guasto. Il preventivo lo comunico sul posto prima di iniziare: decidi tu se procedere.",
      },
      {
        q: "Fate manutenzione caldaie / centrali?",
        a: "Sì, oltre all’emergenza: riavvio, pressione, errori display e assistenza marche diffuse sul Garda.",
      },
    ],
    nearby: [
      ["idraulico-garda.html", "Garda"],
      ["idraulico-lazise.html", "Lazise"],
      ["idraulico-malcesine.html", "Malcesine"],
      ["idraulico-peschiera-del-garda.html", "Peschiera"],
      ["idraulico-sirmione.html", "Sirmione"],
      ["idraulico-bussolengo.html", "Bussolengo"],
    ],
    ticker: ["Bardolino", "Cisano", "Lungolago", "Garda", "Lazise", "Malcesine"],
    statLabel: "Bardolino",
    eta: "~35 min",
  },
  {
    file: "idraulico-garda.html",
    name: "Garda",
    slug: "garda",
    badge: "Emergenza · paese di Garda",
    h1: "Idraulico Garda (VR) H24",
    tagline:
      "Servizio urgente nel comune di Garda: perdite, allagamenti, caldaie. Sponda veronese del lago — chiama e parti con noi.",
    meta:
      "Idraulico a Garda VR H24: pronto intervento perdite, scarichi, caldaie sul lago. Chiama 349 420 8551 — Gala 400 Verona.",
    title: "Idraulico Urgente Garda VR H24 | 349 420 8551",
    checks: [
      "Perdita o allagamento in paese",
      "Caldaia spenta / errore in display",
      "Scarico o WC bloccato",
      "Intervento H24 anche in stagione turistica",
    ],
    body1:
      "Nel comune di <strong>Garda</strong> (non confondere con “lago” generico) siamo il riferimento per pronto intervento idraulico e termico: centro, collina e zone verso Bardolino e Torri.",
    body2:
      "Emergenza? Chiama <a href=\"tel:+393494208551\" class=\"link-accent\">349 420 8551</a> e indica via e civico a Garda. Rispondiamo noi per perdite, spurgo e <strong>centrale / caldaia</strong>.",
    list: [
      "Idraulico urgente comune di Garda",
      "Caldaie e impianti di riscaldamento",
      "Spurghi e disotturazioni",
      "Perdite e piccoli allagamenti",
    ],
    faq: [
      {
        q: "Siete a Garda paese o solo Verona città?",
        a: "Operiamo su Verona e tutta la sponda veronese del lago, incluso il comune di Garda. Partiamo non appena confermi l’indirizzo.",
      },
      {
        q: "Fate anche Torri del Benaco?",
        a: "Sì, zone vicine sulla stessa sponda. Al telefono ti confermo tempi di arrivo.",
      },
      {
        q: "Intervenite su caldaie e riscaldamento?",
        a: "Sì: blocco, pressione, acqua calda sanitaria e assistenza marche comuni in zona lago.",
      },
    ],
    nearby: [
      ["idraulico-bardolino.html", "Bardolino"],
      ["idraulico-malcesine.html", "Malcesine"],
      ["idraulico-lazise.html", "Lazise"],
      ["idraulico-peschiera-del-garda.html", "Peschiera"],
      ["idraulico-sirmione.html", "Sirmione"],
      ["idraulico-negrar.html", "Negrar"],
    ],
    ticker: ["Garda paese", "Bardolino", "Torri", "Malcesine", "Lazise", "Peschiera"],
    statLabel: "Garda",
    eta: "~35 min",
  },
  {
    file: "idraulico-sirmione.html",
    name: "Sirmione",
    slug: "sirmione",
    badge: "Emergenza penisola · sponda VR",
    h1: "Idraulico Sirmione H24",
    tagline:
      "Pronto intervento sulla penisola di Sirmione (provincia di Verona): perdite, scarichi, caldaie. Accesso centro storico e Colombare.",
    meta:
      "Idraulico urgente Sirmione H24 (VR): perdite, WC intasato, caldaie su penisola e Colombare. Chiama 349 420 8551 — Gala 400.",
    title: "Idraulico Urgente Sirmione H24 | 349 420 8551",
    checks: [
      "Perdita in centro storico o Colombare",
      "Caldaia / scaldabagno fuori uso",
      "Scarico bloccato in appartamento o hotel",
      "Urgenza anche con traffico in penisola",
    ],
    body1:
      "A <strong>Sirmione</strong> (solo sponda / comune in provincia di Verona) gestiamo emergenze idrauliche tipiche della penisola: accessi stretti, secondi case e strutture ricettive. Non copriamo Desenzano (BS).",
    body2:
      "Se hai un’emergenza a Sirmione chiama <a href=\"tel:+393494208551\" class=\"link-accent\">349 420 8551</a>. Ti dico se posso entrare in centro storico e in quanto.",
    list: [
      "Idraulico Sirmione centro e Colombare",
      "Caldaie e acqua calda sanitaria",
      "Spurghi urgenti",
      "Perdite e contenimento allagamenti",
    ],
    faq: [
      {
        q: "Entrate anche nel centro storico di Sirmione?",
        a: "Sì, quando l’accesso lo consente. Al telefono chiediamo via e punti di riferimento per organizzare l’arrivo.",
      },
      {
        q: "Venite anche da Desenzano?",
        a: "No: operiamo sulla provincia di Verona (Sirmione VR). Desenzano è Brescia — fuori zona.",
      },
      {
        q: "Caldaie e centrali termiche a Sirmione?",
        a: "Sì, urgenze e riavvii su caldaie domestiche e piccoli impianti. Specifica marca e codice errore se visibile.",
      },
    ],
    nearby: [
      ["idraulico-peschiera-del-garda.html", "Peschiera"],
      ["idraulico-lazise.html", "Lazise"],
      ["idraulico-castelnuovo.html", "Castelnuovo"],
      ["idraulico-bardolino.html", "Bardolino"],
      ["idraulico-garda.html", "Garda"],
      ["idraulico-bussolengo.html", "Bussolengo"],
    ],
    ticker: ["Sirmione", "Colombare", "Penisola", "Peschiera", "Lazise", "Castelnuovo"],
    statLabel: "Sirmione",
    eta: "~40 min",
  },
  {
    file: "idraulico-malcesine.html",
    name: "Malcesine",
    slug: "malcesine",
    badge: "Emergenza alto lago · castello",
    h1: "Idraulico Malcesine H24",
    tagline:
      "Urgenze idrauliche a Malcesine e frazioni dell’alto Garda veronese: perdite, spurgo, caldaie. Chiami, partiamo.",
    meta:
      "Idraulico urgente Malcesine H24: perdite, scarichi, caldaie sull’alto lago di Garda. Chiama 349 420 8551 — Gala 400 Verona.",
    title: "Idraulico Urgente Malcesine Garda H24 | 349 420 8551",
    checks: [
      "Perdita o allagamento in paese / frazioni",
      "Caldaia ferma con il freddo del lago",
      "WC o scarico intasato",
      "Intervento anche fuori stagione",
    ],
    body1:
      "A <strong>Malcesine</strong> serviamo il centro, le zone verso il castello e le frazioni dell’alto lago veronese. Tempi di arrivo più lunghi rispetto a Peschiera: te li dico subito al telefono.",
    body2:
      "Per perdite, scarichi o <strong>caldaia / riscaldamento</strong> chiama <a href=\"tel:+393494208551\" class=\"link-accent\">349 420 8551</a>. Nessun centralino — parli con chi interviene.",
    list: [
      "Pronto intervento Malcesine e alto Garda VR",
      "Assistenza caldaie in emergenza",
      "Spurghi e disotturazioni",
      "Perdite acqua e piccoli allagamenti",
    ],
    faq: [
      {
        q: "Quanto ci mettete da Verona a Malcesine?",
        a: "In genere 45–70 minuti secondo traffico e stagione. Ti comunico un’ora di arrivo prima di partire.",
      },
      {
        q: "Coprite anche Brenzone / Torri?",
        a: "Sì, sponda veronese dell’alto lago. Conferma il comune al telefono.",
      },
      {
        q: "Fate centrali termiche e caldaie?",
        a: "Sì, urgenze su caldaie domestiche e impianti di riscaldamento. Porta a portata di mano marca e messaggio di errore.",
      },
    ],
    nearby: [
      ["idraulico-garda.html", "Garda"],
      ["idraulico-bardolino.html", "Bardolino"],
      ["idraulico-lazise.html", "Lazise"],
      ["idraulico-peschiera-del-garda.html", "Peschiera"],
      ["idraulico-negrar.html", "Negrar"],
      ["idraulico-bussolengo.html", "Bussolengo"],
    ],
    ticker: ["Malcesine", "Alto Garda", "Castello", "Garda", "Bardolino", "Torri"],
    statLabel: "Malcesine",
    eta: "~55 min",
  },
];

function esc(s) {
  return s.replace(/&/g, "&amp;");
}

function tickItem(t) {
  return `<span class="t-item">${t} <span class="t-dot">✦</span></span>`;
}

function checkLi(text) {
  return `<li><span class="tick2"><svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg></span>${text}</li>`;
}

function nearbyHtml(nearby) {
  return nearby
    .map(
      ([href, label]) =>
        `<a class="zc2" href="${href}"><span class="zdot2"></span><span class="zname2">${label}</span></a>`
    )
    .join("");
}

function faqHtml(faq) {
  return faq
    .map(
      (f) =>
        `<details class="faq"><summary><span class="faq-ico" aria-hidden="true"><svg class="ico" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2s7 8.5 7 13a7 7 0 11-14 0c0-4.5 7-13 7-13z"/></svg></span>${f.q}</summary><div class="faq-a"><p>${f.a}</p></div></details>`
    )
    .join("");
}

for (const c of cities) {
  const fp = path.join(dir, c.file);
  let html = fs.readFileSync(fp, "utf8");

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${c.title}</title>`);
  html = html.replace(
    /<meta name="description" content="[^"]*">/,
    `<meta name="description" content="${c.meta}">`
  );
  html = html.replace(
    /<meta property="og:title" content="[^"]*">/,
    `<meta property="og:title" content="${c.title}">`
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*">/,
    `<meta property="og:description" content="${c.meta}">`
  );

  html = html.replace(
    /<div class="hero2-badge">[\s\S]*?<\/div>/,
    `<div class="hero2-badge"><span class="live-dot" aria-hidden="true"></span>${c.badge}</div>`
  );
  html = html.replace(/<h1 class="hero2-h1">[^<]*<\/h1>/, `<h1 class="hero2-h1">${c.h1}</h1>`);
  html = html.replace(
    /<p class="hero2-tagline">[\s\S]*?<\/p>/,
    `<p class="hero2-tagline">${c.tagline}</p>`
  );

  const ticker =
    c.ticker.map(tickItem).join("") + c.ticker.map(tickItem).join("");
  html = html.replace(
    /<div class="ticker"><div class="ticker-track">[\s\S]*?<\/div><\/div>/,
    `<div class="ticker"><div class="ticker-track">${ticker}</div></div>`
  );

  html = html.replace(
    /<ul class="chk-list" style="margin-top:1\.6rem;max-width:38rem">[\s\S]*?<\/ul>/,
    `<ul class="chk-list" style="margin-top:1.6rem;max-width:38rem">${c.checks.map(checkLi).join("")}</ul>`
  );

  html = html.replace(
    /<h2>[^<]*<\/h2>\s*<p class="chi2-body">[\s\S]*?<\/p>\s*<p class="chi2-body">[\s\S]*?<\/p>\s*<ul class="chi2-list">[\s\S]*?<\/ul>/,
    `<h2>${c.name}.</h2>
      <p class="chi2-body">${c.body1}</p>
      <p class="chi2-body">${c.body2}</p>
      <ul class="chi2-list">${c.list.map(checkLi).join("")}</ul>`
  );

  html = html.replace(
    /<div class="cn2"><div class="cn2-v">20 min<\/div><div class="cn2-l">Arrivo medio<\/div><\/div>\s*<div class="cn2"><div class="cn2-v">[^<]*<\/div><div class="cn2-l">Quartiere<\/div><\/div>/,
    `<div class="cn2"><div class="cn2-v">${c.eta}</div><div class="cn2-l">Arrivo tipico</div></div>
      <div class="cn2"><div class="cn2-v">${c.statLabel.slice(0, 8)}</div><div class="cn2-l">Zona lago</div></div>`
  );

  html = html.replace(
    /<div class="faq-list">[\s\S]*?<\/div>\s*<\/div><\/section>\s*<section class="contact2"/,
    `<div class="faq-list">${faqHtml(c.faq)}</div>
</div></section>
<section class="contact2"`
  );

  html = html.replace(
    /<h2>Zone vicine\.<\/h2>\s*<div class="zone2-grid zone2-c6">[\s\S]*?<\/div>/,
    `<h2>Zone vicine.</h2>
      <div class="zone2-grid zone2-c6">${nearbyHtml(c.nearby)}</div>`
  );

  // geo placename
  html = html.replace(
    /<meta name="geo\.placename" content="[^"]*">/,
    `<meta name="geo.placename" content="${c.name}">`
  );

  fs.writeFileSync(fp, html);
  console.log("unique", c.file);
}
