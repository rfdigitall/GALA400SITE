/**
 * Deep uniquify Garda pages: unique section order/copy, contact, process, services focus.
 * Keeps brand CSS (same design as site) — unique text/structure for indexing.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "quartieri");

const tick = (t) =>
  `<li><span class="tick2"><svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg></span>${t}</li>`;

const cities = {
  "idraulico-peschiera-del-garda.html": {
    name: "Peschiera del Garda",
    wa: "Peschiera%20del%20Garda",
    zonaContact: "Peschiera del Garda e sponda VR",
    procTitle: "Dal porto<br>al rubinetto.",
    procLbl: "Metodo Peschiera",
    proc: [
      ["01", "Mi chiami dal lago", "Mi dici se sei al porto, in centro o verso Castelnuovo. Capisco subito il guasto."],
      ["02", "Parto verso Peschiera", "Tempo tipico ~25–40 min dalla sponda veronese. Ti aggiorno se c’è coda sul Garda."],
      ["03", "Preventivo e lavoro", "Vedi il costo prima. Ideale per case vacanze e perdite che allagano."],
    ],
    whenTitle: "Emergenza<br>a Peschiera.",
    whenLbl: "Cosa sistemo qui",
    servicesTitle: "Servizi urgenti<br>a Peschiera.",
    servicesLbl: "Focus lago",
    services: [
      ["../servizi/pronto-intervento-idraulico-verona.html", "Pronto Intervento"],
      ["../servizi/perdite-acqua-urgenti-verona.html", "Perdite Acqua"],
      ["../servizi/allagamento-verona.html", "Allagamento"],
      ["../servizi/wc-intasato-urgente-verona.html", "WC Intasato"],
      ["../servizi/spurgo-urgente-verona.html", "Spurgo"],
      ["../servizi/assistenza-caldaia-verona.html", "Caldaia Urgente"],
      ["../servizi/ricerca-perdite-acqua-verona.html", "Ricerca Perdite"],
      ["../servizi/scaldabagno-verona.html", "Scaldabagno"],
    ],
    caldaieTitle: "Caldaie<br>a Peschiera.",
    caldaieLbl: "Riscaldamento",
    localNote:
      "<section class=\"sec2 sec2-ice\"><div class=\"lbl2\">Nota locale</div><h2>Porto, fortezza,<br>case vacanze.</h2><p style=\"max-width:38rem;color:var(--text-soft);margin-top:1rem;line-height:1.7\">A Peschiera molti interventi sono su <strong>secondi case</strong> e appartamenti turistici: perdita sotto lavello, WC intasato dopo il weekend, caldaia che non riparte all’arrivo degli ospiti. Meglio chiamare subito — l’acqua sul pavimento costa più dell’intervento.</p></section>",
    contactSub:
      "Emergenza a Peschiera? Tocca e chiama. Per non urgenti, lascia il numero — ti richiamo io.",
  },
  "idraulico-lazise.html": {
    name: "Lazise",
    wa: "Lazise",
    zonaContact: "Lazise, Colà, Pacengo",
    procTitle: "Tre passi<br>a Lazise.",
    procLbl: "Come lavoro",
    proc: [
      ["01", "Chiamata diretta", "Niente centralino. Mi spieghi se sei in centro, a Colà o Pacengo."],
      ["02", "Arrivo in zona", "~30 min tipici. In alta stagione ti dico se il lungolago è intasato."],
      ["03", "Decidi tu", "Preventivo prima di iniziare. Poi sistemo perdita, scarico o caldaia."],
    ],
    whenTitle: "Quando<br>chiamarmi a Lazise.",
    whenLbl: "Urgenze tipiche",
    servicesTitle: "Cosa faccio<br>a Lazise.",
    servicesLbl: "Servizi",
    services: [
      ["../servizi/assistenza-caldaia-verona.html", "Assistenza Caldaia"],
      ["../servizi/pronto-intervento-idraulico-verona.html", "Pronto Intervento"],
      ["../servizi/spurgo-urgente-verona.html", "Spurgo Urgente"],
      ["../servizi/perdite-acqua-urgenti-verona.html", "Perdite"],
      ["../servizi/wc-intasato-urgente-verona.html", "WC / Scarico"],
      ["../servizi/riparazione-caldaia-verona.html", "Riparazione Caldaia"],
      ["../servizi/manutenzione-caldaia-verona.html", "Manutenzione Caldaia"],
      ["../servizi/idraulico-condominio-verona.html", "Condominio"],
    ],
    caldaieTitle: "Centrali e caldaie<br>a Lazise.",
    caldaieLbl: "Termico",
    localNote:
      "<section class=\"sec2\"><div class=\"lbl2\">Lazise reale</div><h2>Centro, collina,<br>alta stagione.</h2><p style=\"max-width:38rem;color:var(--text-soft);margin-top:1rem;line-height:1.7\">Tra luglio e agosto il paese è pieno: scarichi sotto stress, caldaie spente in affitti, perdite che bagnano il piano sotto. Intervento H24 sullo stesso <strong>349 420 8551</strong> — anche di sera e nei weekend.</p></section>",
    contactSub:
      "A Lazise il telefono è la via più veloce. Scrivi WhatsApp solo se non puoi parlare.",
  },
  "idraulico-bardolino.html": {
    name: "Bardolino",
    wa: "Bardolino",
    zonaContact: "Bardolino e Cisano",
    procTitle: "Intervento<br>a Bardolino.",
    procLbl: "Flusso",
    proc: [
      ["01", "Mi racconti il guasto", "Perdita, scarico o caldaia? Sei sul lungolago o a Cisano?"],
      ["02", "Vengo io", "Arrivo tipico ~35 min. Attrezzatura per la maggior parte delle urgenze."],
      ["03", "Lavoro solo se ok", "Preventivo chiaro. Niente sorprese in fattura."],
    ],
    whenTitle: "Problemi tipici<br>a Bardolino.",
    whenLbl: "Perché chiamare",
    servicesTitle: "Servizi<br>Bardolino / Cisano.",
    servicesLbl: "Lista",
    services: [
      ["../servizi/perdite-acqua-urgenti-verona.html", "Perdite Urgenti"],
      ["../servizi/pronto-intervento-idraulico-verona.html", "Pronto Intervento"],
      ["../servizi/assistenza-caldaia-verona.html", "Caldaia"],
      ["../servizi/spurgo-urgente-verona.html", "Spurgo"],
      ["../servizi/ricerca-perdite-acqua-verona.html", "Ricerca Perdite"],
      ["../servizi/allagamento-verona.html", "Allagamento"],
      ["../servizi/rubinetteria-verona.html", "Rubinetteria"],
      ["../servizi/scaldabagno-verona.html", "Scaldabagno"],
    ],
    caldaieTitle: "Marche caldaie<br>sul Garda.",
    caldaieLbl: "Assistenza",
    localNote:
      "<section class=\"sec2 sec2-ice\"><div class=\"lbl2\">Bardolino</div><h2>Lungolago e<br>attività aperte.</h2><p style=\"max-width:38rem;color:var(--text-soft);margin-top:1rem;line-height:1.7\">Oltre alle case, intervengo spesso su <strong>locali e B&amp;B</strong>: scarico cucina bloccato o perdita che ferma il servizio. Priorità a rimettere l’acqua in funzione in fretta.</p></section>",
    contactSub:
      "Bardolino o Cisano in emergenza? Chiama ora — poi se serve ti mando il preventivo WhatsApp.",
  },
  "idraulico-garda.html": {
    name: "Garda",
    wa: "Garda%20VR",
    zonaContact: "Comune di Garda (VR)",
    procTitle: "Così lavoro<br>a Garda paese.",
    procLbl: "Passi",
    proc: [
      ["01", "Confermi il comune", "Garda paese (VR), non solo “lago”. Mi dai via e civico."],
      ["02", "Parto", "~35 min tipici verso Garda / Bardolino. Ti dico l’ora di arrivo."],
      ["03", "Sistemo e chiudo", "Preventivo prima. Poi perdita, spurgo o caldaia."],
    ],
    whenTitle: "Urgenze nel<br>comune di Garda.",
    whenLbl: "Segnali",
    servicesTitle: "Servizi a Garda<br>(comune VR).",
    servicesLbl: "Offerta",
    services: [
      ["../servizi/pronto-intervento-idraulico-verona.html", "Pronto Intervento"],
      ["../servizi/assistenza-caldaia-verona.html", "Caldaia H24"],
      ["../servizi/perdite-acqua-urgenti-verona.html", "Perdite"],
      ["../servizi/wc-intasato-urgente-verona.html", "WC Intasato"],
      ["../servizi/spurgo-urgente-verona.html", "Spurgo"],
      ["../servizi/manutenzione-caldaia-verona.html", "Manutenzione"],
      ["../servizi/ricerca-perdite-gas-verona.html", "Perdite Gas"],
      ["../servizi/emergenza-gas-verona.html", "Emergenza Gas"],
    ],
    caldaieTitle: "Caldaie a Garda<br>paese.",
    caldaieLbl: "Riscaldamento",
    localNote:
      "<section class=\"sec2\"><div class=\"lbl2\">Chiarezza</div><h2>Garda = comune,<br>non tutto il lago.</h2><p style=\"max-width:38rem;color:var(--text-soft);margin-top:1rem;line-height:1.7\">Questa pagina è per il <strong>comune di Garda (VR)</strong>. Se sei a Peschiera, Lazise o Malcesine usa la pagina della tua città — oppure chiama comunque: ti indirizzo io.</p></section>",
    contactSub:
      "Sei nel comune di Garda? Chiama 349 — ti confermo se parto subito.",
  },
  "idraulico-sirmione.html": {
    name: "Sirmione",
    wa: "Sirmione",
    zonaContact: "Sirmione VR (non Desenzano BS)",
    procTitle: "Accesso penisola<br>e intervento.",
    procLbl: "Sirmione",
    proc: [
      ["01", "Dove sei esattamente", "Centro storico, Colombare o fuori porta? Serve per l’accesso."],
      ["02", "Organizzo l’arrivo", "~40 min tipici. In centro storico mi organizzo sul punto di scarico."],
      ["03", "Intervento mirato", "Perdite, scarichi, caldaie. Preventivo prima di iniziare."],
    ],
    whenTitle: "Emergenze tipiche<br>a Sirmione.",
    whenLbl: "Penisola",
    servicesTitle: "Servizi<br>a Sirmione VR.",
    servicesLbl: "Urgenze",
    services: [
      ["../servizi/perdite-acqua-urgenti-verona.html", "Perdite"],
      ["../servizi/allagamento-verona.html", "Allagamento"],
      ["../servizi/pronto-intervento-idraulico-verona.html", "Pronto Intervento"],
      ["../servizi/wc-intasato-urgente-verona.html", "WC Intasato"],
      ["../servizi/assistenza-caldaia-verona.html", "Caldaia"],
      ["../servizi/spurgo-urgente-verona.html", "Spurgo"],
      ["../servizi/scaldabagno-verona.html", "Scaldabagno"],
      ["../servizi/idraulico-condominio-verona.html", "Condominio / Hotel"],
    ],
    caldaieTitle: "Caldaie<br>a Sirmione.",
    caldaieLbl: "Termico",
    localNote:
      "<section class=\"sec2 sec2-ice\"><div class=\"lbl2\">Zona</div><h2>Solo Sirmione VR.<br>Non Desenzano.</h2><p style=\"max-width:38rem;color:var(--text-soft);margin-top:1rem;line-height:1.7\">Operiamo sulla <strong>provincia di Verona</strong>. Sirmione sì; Desenzano (Brescia) no. Se sei in dubbio sul comune, chiamaci: in 10 secondi ti diciamo se siamo in zona.</p></section>",
    contactSub:
      "Sirmione in emergenza (VR)? Chiama ora. Desenzano BS = fuori zona.",
  },
  "idraulico-malcesine.html": {
    name: "Malcesine",
    wa: "Malcesine",
    zonaContact: "Malcesine e alto Garda VR",
    procTitle: "Dall’alto lago<br>alla riparazione.",
    procLbl: "Malcesine",
    proc: [
      ["01", "Mi chiami", "Via e frazione. Ti dico subito se l’arrivo è 45 o 70 minuti."],
      ["02", "Parto verso nord lago", "Trasparenza sui tempi: meglio onesti che promesse false."],
      ["03", "Sistemo il guasto", "Perdita, spurgo o caldaia. Preventivo prima del lavoro."],
    ],
    whenTitle: "Quando serve<br>l’idraulico a Malcesine.",
    whenLbl: "Alto Garda",
    servicesTitle: "Servizi<br>Malcesine.",
    servicesLbl: "Cosa offro",
    services: [
      ["../servizi/assistenza-caldaia-verona.html", "Caldaia / Freddo"],
      ["../servizi/pronto-intervento-idraulico-verona.html", "Pronto Intervento"],
      ["../servizi/perdite-acqua-urgenti-verona.html", "Perdite"],
      ["../servizi/spurgo-urgente-verona.html", "Spurgo"],
      ["../servizi/riparazione-caldaia-verona.html", "Riparazione Caldaia"],
      ["../servizi/wc-intasato-urgente-verona.html", "WC Intasato"],
      ["../servizi/manutenzione-caldaia-verona.html", "Manutenzione"],
      ["../servizi/allagamento-verona.html", "Allagamento"],
    ],
    caldaieTitle: "Caldaie sull’alto<br>lago.",
    caldaieLbl: "Inverno",
    localNote:
      "<section class=\"sec2\"><div class=\"lbl2\">Tempi onesti</div><h2>Malcesine non è<br>Verona centro.</h2><p style=\"max-width:38rem;color:var(--text-soft);margin-top:1rem;line-height:1.7\">Diciamo i tempi reali: spesso <strong>45–70 minuti</strong>. Se serve prima un tecnico più vicino, te lo diciamo. Se partiamo noi, resti aggiornato fino all’arrivo.</p></section>",
    contactSub:
      "Malcesine / alto Garda VR: chiama — ti dico subito l’ora di arrivo reale.",
  },
};

const marche = [
  ["vaillant", "Vaillant"],
  ["baxi", "Baxi"],
  ["ariston", "Ariston"],
  ["beretta", "Beretta"],
  ["immergas", "Immergas"],
  ["bosch-junkers", "Bosch"],
  ["riello", "Riello"],
  ["ferroli", "Ferroli"],
];

function zc(href, name) {
  return `<a class="zc2" href="${href}"><span class="zdot2"></span><span class="zname2">${name}</span></a>`;
}

for (const [file, c] of Object.entries(cities)) {
  const fp = path.join(dir, file);
  let html = fs.readFileSync(fp, "utf8");

  // WA links city-specific
  html = html.replace(
    /wa\.me\/393494208551\?text=[^"]+/g,
    `wa.me/393494208551?text=Emergenza%20idraulico%20${c.wa}%20-%20chiamo%20dal%20sito`
  );

  // Process section
  const procInner = c.proc
    .map(
      ([n, t, d]) =>
        `<div class="ps2"><div class="ps2-n">${n}</div><div class="ps2-title">${t}</div><p class="ps2-desc">${d}</p></div>`
    )
    .join("");
  html = html.replace(
    /<section class="sec2 sec2-ice">\s*<div class="lbl2">Come intervengo<\/div>[\s\S]*?<\/section>\s*<section class="chi2">/,
    `<section class="sec2 sec2-ice">
  <div class="lbl2">${c.procLbl}</div>
  <h2>${c.procTitle}</h2>
  <div class="proc-grid">${procInner}</div>
</section>
<section class="chi2">`
  );

  // When section titles
  html = html.replace(
    /<section class="sec2">\s*<div class="lbl2">Quando chiamarmi<\/div>\s*<h2>Non aspettare<br>che peggiori\.<\/h2>/,
    `<section class="sec2">
  <div class="lbl2">${c.whenLbl}</div>
  <h2>${c.whenTitle}</h2>`
  );

  // Services block — slim unique
  const serv = c.services.map(([h, n]) => zc(h, n)).join("");
  html = html.replace(
    /<section class="sec2">\s*<div class="lbl2">Servizi<\/div>\s*<h2>Servizi idraulici<br>in zona\.<\/h2>\s*<div class="zone2-grid zone2-c16">[\s\S]*?<\/div>\s*<\/section>/,
    `<section class="sec2">
  <div class="lbl2">${c.servicesLbl}</div>
  <h2>${c.servicesTitle}</h2>
  <div class="zone2-grid zone2-c8">${serv}</div>
</section>`
  );

  // Caldaie titles + fewer brands (same links, shorter unique heading)
  const mar = marche.map(([s, n]) => zc(`../marche/${s}-verona.html`, `${n}`)).join("");
  html = html.replace(
    /<section class="sec2 sec2-ice">\s*<div class="lbl2">Caldaie<\/div>\s*<h2>Assistenza caldaie<br>marche principali\.<\/h2>\s*<div class="zone2-grid zone2-c12">[\s\S]*?<\/div>\s*<\/section>/,
    `<section class="sec2 sec2-ice">
  <div class="lbl2">${c.caldaieLbl}</div>
  <h2>${c.caldaieTitle}</h2>
  <div class="zone2-grid zone2-c8">${mar}</div>
</section>`
  );

  // Insert local note before FAQ if not present
  if (!html.includes("Nota locale") && !html.includes("Lazise reale") && !html.includes("Chiarezza") && !html.includes("Tempi onesti") && !html.includes(">Zona</div>") && !html.includes("Bardolino</div>")) {
    // use unique marker from localNote
  }
  if (!html.includes(c.localNote.slice(0, 40))) {
    html = html.replace(
      /<section class="section section-alt">/,
      `${c.localNote}\n<section class="section section-alt">`
    );
  }

  // Contact
  html = html.replace(
    /<p class="ct2-sub">[^<]*<\/p>/,
    `<p class="ct2-sub">${c.contactSub}</p>`
  );
  html = html.replace(
    /<div class="ct2-row"><div class="ct2-rlbl">Zona di intervento<\/div><span class="ct2-rval" style="font-size:1.1rem">[^<]*<\/span><\/div>/,
    `<div class="ct2-row"><div class="ct2-rlbl">Zona di intervento</div><span class="ct2-rval" style="font-size:1.1rem">${c.zonaContact}</span></div>`
  );

  // FAQPage JSON if missing - inject before </head> unique
  if (!html.includes('"@type": "FAQPage"') && !html.includes('"@type":"FAQPage"')) {
    // pull FAQ from page
    const faqs = [...html.matchAll(/<summary>[\s\S]*?<\/svg><\/span>([^<]+)<\/summary><div class="faq-a"><p>([^<]+)<\/p>/g)];
    if (faqs.length) {
      const ents = faqs
        .map(
          (m) =>
            `{"@type":"Question","name":${JSON.stringify(m[1])},"acceptedAnswer":{"@type":"Answer","text":${JSON.stringify(m[2])}}}`
        )
        .join(",");
      const block = `<script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[${ents}]}</script>`;
      html = html.replace("</head>", `${block}\n</head>`);
    }
  }

  fs.writeFileSync(fp, html);
  console.log("deep", file);
}
