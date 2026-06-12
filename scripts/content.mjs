/** Testi professionali per pagine generate — allineati a keyword Ads */
import { SITE } from './site-data.mjs';

function pick(arr, seed) {
  return arr[Math.abs(seed.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % arr.length];
}

/** Meta e H1 ottimizzati per Quality Score (keyword = landing) */
const URGENT_SEO = {
  'pronto-intervento-idraulico': {
    title: `Pronto intervento idraulico Verona ☎ ${SITE.phone} | H24`,
    h1: 'Pronto intervento idraulico',
    accent: 'Verona h24',
    lead: `Hai un'emergenza idraulica a Verona? Perdita d'acqua, scarico intasato, caldaia o gas: <strong>chiama ${SITE.phone}</strong>. Tecnico in zona, arrivo medio ~${SITE.arrivalMin} minuti, anche di notte e festivi.`,
    intents: [
      'Perdita d\'acqua urgente in casa o condominio',
      'WC, lavandino o doccia intasati',
      'Caldaia spenta o blocco impianto',
      'Odore gas o sospetta perdita',
    ],
    bodyIntro:
      'Il <strong>pronto intervento idraulico a Verona</strong> di Gala 400 è pensato per chi cerca un tecnico subito: niente call center, risposta diretta e preventivo prima di iniziare.',
  },
  'perdite-acqua-urgenti': {
    title: `Perdita acqua urgente Verona ☎ ${SITE.phone} | H24`,
    h1: 'Perdita acqua urgente',
    accent: 'Verona h24',
    lead: `Tubo rotto, rubinetto che perde, allagamento? <strong>Chiama ${SITE.phone}</strong> per riparazione perdite acqua a Verona. Intervento rapido h24.`,
    intents: ['Perdita da tubo o rubinetto', 'Allagamento bagno o cucina', 'Perdita condominio', 'Acqua dal soffitto'],
    bodyIntro:
      'Interveniamo su <strong>perdite acqua urgenti a Verona</strong> con attrezzatura per isolare la perdita e ridurre i danni fino alla riparazione definitiva.',
  },
  'ricerca-perdite-acqua': {
    title: `Ricerca perdite acqua Verona ☎ ${SITE.phone}`,
    h1: 'Ricerca perdite acqua',
    accent: 'Verona',
    lead: `Sospetti una perdita occulta? <strong>Chiama ${SITE.phone}</strong> per ricerca perdite acqua a Verona con strumentazione professionale.`,
    intents: ['Perdita occulta in muratura', 'Macchie umidità', 'Contatore che gira a vuoto', 'Perdite impianto condominiale'],
    bodyIntro:
      'La <strong>ricerca perdite acqua a Verona</strong> permette di individuare infiltrazioni senza demolizioni inutili, con report per assicurazione se necessario.',
  },
  'ricerca-perdite-gas': {
    title: `Ricerca perdite gas Verona ☎ ${SITE.phone} | Emergenza`,
    h1: 'Ricerca perdite gas',
    accent: 'Verona',
    lead: `Odore gas o sospetta perdita? <strong>Chiama subito ${SITE.phone}</strong>. Ricerca perdite gas e messa in sicurezza a Verona.`,
    intents: ['Odore gas in casa', 'Verifica impianto', 'Collaudo dopo lavori', 'Certificazione sicurezza'],
    bodyIntro: 'Per la <strong>ricerca perdite gas a Verona</strong> interveniamo con strumentazione certificata e messa in sicurezza immediata.',
  },
  'emergenza-gas': {
    title: `Emergenza gas Verona ☎ ${SITE.phone} | H24`,
    h1: 'Emergenza gas',
    accent: 'Verona h24',
    lead: `Emergenza gas a Verona? <strong>Chiama ${SITE.phone}</strong> ora. Chiusura valvola, verifica impianto e ripristino in sicurezza.`,
    intents: ['Odore gas improvviso', 'Valvola da chiudere', 'Perdita su tubazione', 'Impianto da mettere in sicurezza'],
    bodyIntro: 'In caso di <strong>emergenza gas a Verona</strong> ogni minuto conta: tecnico reperibile h24 con intervento prioritario.',
  },
  allagamento: {
    title: `Allagamento idraulico Verona ☎ ${SITE.phone} | Urgente`,
    h1: 'Riparazione allagamenti',
    accent: 'Verona urgente',
    lead: `Allagamento in casa? <strong>Chiama ${SITE.phone}</strong>. Chiudiamo la perdita e ripristiniamo l'impianto a Verona.`,
    intents: ['Allagamento da perdita', 'Acqua dal piano superiore', 'Tubo scoppiato', 'Ripristino impianto'],
    bodyIntro: 'Gestiamo <strong>allagamenti idraulici a Verona</strong> con priorità: stop perdita, asciugatura danni e collaudo impianto.',
  },
  'spurgo-urgente': {
    title: `Scarico intasato Verona ☎ ${SITE.phone} | Spurgo urgente`,
    h1: 'Spurgo e disostruzione',
    accent: 'Verona h24',
    lead: `Scarico intasato, fogna o lavandino otturato? <strong>Chiama ${SITE.phone}</strong> per spurgo urgente a Verona.`,
    intents: ['Scarico cucina intasato', 'Fogna ostruita', 'Lavandino che non scarica', 'WC intasato'],
    bodyIntro: 'Lo <strong>spurgo urgente a Verona</strong> risolve ostruzioni in scarichi, fognature e colonne condominiali con attrezzatura professionale.',
  },
  'wc-intasato-urgente': {
    title: `WC intasato Verona ☎ ${SITE.phone} | Pronto intervento`,
    h1: 'WC e scarichi intasati',
    accent: 'Verona h24',
    lead: `WC bloccato o lavandino otturato? <strong>Chiama ${SITE.phone}</strong>. Disotturazione urgente a Verona, anche di notte.`,
    intents: ['WC intasato', 'Lavandino otturato', 'Doccia che non scarica', 'Scarico lavatrice bloccato'],
    bodyIntro: 'Per <strong>WC intasati a Verona</strong> interveniamo in giornata con disostruzione meccanica o idrodinamica, senza danni ai sanitari.',
  },
  'assistenza-caldaia': {
    title: `Intervento caldaia Verona ☎ ${SITE.phone} | Assistenza h24`,
    h1: 'Assistenza caldaia urgente',
    accent: 'Verona h24',
    lead: `Caldaia spenta, codice errore o niente acqua calda? <strong>Chiama ${SITE.phone}</strong> per intervento caldaia a Verona.`,
    intents: ['Caldaia non si accende', 'Codice errore display', 'Manca acqua calda', 'Pressione impianto bassa'],
    bodyIntro: 'L\'<strong>assistenza caldaia a Verona</strong> copre guasti urgenti su tutte le marche principali — non solo manutenzione programmata.',
  },
  'riparazione-caldaia': {
    title: `Riparazione caldaia Verona ☎ ${SITE.phone} | Urgente`,
    h1: 'Riparazione caldaia',
    accent: 'Verona',
    lead: `Guasto caldaia a Verona? <strong>Chiama ${SITE.phone}</strong> per diagnosi e riparazione con ricambi compatibili.`,
    intents: ['Valvola o circolatore', 'Bruciatore', 'Perdita acqua caldaia', 'Scheda elettronica'],
    bodyIntro: 'La <strong>riparazione caldaia a Verona</strong> include test finale obbligatorio e preventivo prima di sostituire componenti.',
  },
  scaldabagno: {
    title: `Riparazione scaldabagno Verona ☎ ${SITE.phone}`,
    h1: 'Scaldabagno',
    accent: 'Verona urgente',
    lead: `Scaldabagno guasto o perde acqua? <strong>Chiama ${SITE.phone}</strong> per riparazione o sostituzione a Verona.`,
    intents: ['Niente acqua calda', 'Perdita dal serbatoio', 'Sostituzione rapida', 'Scaldabagno a gas'],
    bodyIntro: 'Interveniamo su <strong>scaldabagni a Verona</strong> gas ed elettrici con collaudo e messa in servizio.',
  },
  rubinetteria: {
    title: `Riparazione rubinetti Verona ☎ ${SITE.phone}`,
    h1: 'Rubinetteria e sanitari',
    accent: 'Verona',
    lead: `Rubinetto che perde o miscelatore rotto? <strong>Chiama ${SITE.phone}</strong> per intervento rapido a Verona.`,
    intents: ['Rubinetto che gocciola', 'Miscelatore da sostituire', 'Sanitari e box doccia', 'Perdita sotto lavandino'],
    bodyIntro: 'Riparazione e sostituzione <strong>rubinetteria a Verona</strong> con preventivo chiaro prima dei lavori.',
  },
  'idraulico-condominio': {
    title: `Idraulico condominio Verona ☎ ${SITE.phone}`,
    h1: 'Idraulico per condomini',
    accent: 'Verona',
    lead: `Colonna idrica, perdita o spurgo condominiale? <strong>Chiama ${SITE.phone}</strong> — interventi per amministratori a Verona.`,
    intents: ['Colonne idriche', 'Perdite condominiali', 'Centrali termiche', 'Scarichi comuni'],
    bodyIntro: 'Servizio <strong>idraulico per condomini a Verona</strong> con rapporto tecnico per l\'amministratore.',
  },
};

export function servizioSeo(svc) {
  if (svc.urgent && URGENT_SEO[svc.slug]) {
    return URGENT_SEO[svc.slug];
  }
  return {
    title: `${svc.name} Verona | ${SITE.phone} | Gala 400`,
    h1: svc.name,
    accent: 'Verona',
    lead: `${svc.short} Chiama <strong>${SITE.phone}</strong> per preventivo chiaro a Verona.`,
    intents: [],
    bodyIntro: `${svc.name} a Verona con tecnici qualificati Gala 400 Srls.`,
  };
}

export function servizioBody(svc) {
  const seo = servizioSeo(svc);
  const urg = svc.urgent
    ? `Pronto intervento attivo 24 ore su 24, arrivo medio ~${SITE.arrivalMin} minuti a Verona e provincia.`
    : `Interventi programmati con tempi concordati e preventivo scritto prima dell'avvio.`;

  return `
    <p>${seo.bodyIntro}</p>
    <p>${svc.short} ${urg}</p>
    <p>Prima di iniziare comunichiamo costi e tempi. ${SITE.legalName} · P.IVA ${SITE.piva}. Preventivo prima dei lavori, nessun costo nascosto.</p>`;
}

export function servizioBullets(svc) {
  const seo = servizioSeo(svc);
  if (seo.intents.length) {
    return seo.intents;
  }
  const map = {
    urgenze: ['Arrivo rapido in zona', 'Attrezzatura professionale', 'Intervento notturno e festivo', 'Preventivo prima dei lavori'],
    caldaie: ['Tutte le marche principali', 'Diagnosi e ricambi', 'Sicurezza impianto gas', 'Manutenzione programmata'],
    termico: ['Scaldabagni gas ed elettrici', 'Sostituzione rapida', 'Collaudo e messa in servizio', 'Prezzi chiari'],
    manutenzione: ['Contratti condominio', 'Prevenzione guasti', 'Rapporto tecnico', 'Prezzi chiari'],
  };
  return map[svc.category] || map.manutenzione;
}

export function urgentIntentSection(svc) {
  const seo = servizioSeo(svc);
  if (!svc.urgent || !seo.intents.length) return '';
  const items = seo.intents.map((t) => `<li>${t}</li>`).join('');
  return `<section class="section section-emergency section-compact">
  <div class="container">
    <h2 class="section-title left">Emergenze che risolviamo a Verona</h2>
    <p class="section-intro left">Se la tua situazione è tra queste, chiama subito <a href="tel:${SITE.phoneTel}" class="link-accent link-tel" data-cta="intent-tel">${SITE.phone}</a> — intervento prioritario.</p>
    <ul class="emergency-list">${items}</ul>
    <p class="emergency-call"><a href="tel:${SITE.phoneTel}" class="btn btn-primary btn-block btn-call-hero btn-pulse" data-cta="intent-call"><span class="btn-sub">Emergenza ora</span><span class="btn-phone">${SITE.phone}</span></a></p>
  </div>
</section>`;
}

export function quartiereIntro(q) {
  const tipo = q.type === 'comune' ? 'nel comune di' : 'nel quartiere';
  const intros = [
    `<p>Idraulico urgente ${tipo} <strong>${q.name}</strong>: Gala 400 interviene su ${q.highlight} con pronto intervento h24. Per emergenze chiama <a href="tel:${SITE.phoneTel}" class="link-accent">${SITE.phone}</a>.</p>`,
    `<p>A <strong>${q.name}</strong> copriamo ${q.highlight}. Perdite acqua, caldaie, spurghi — tecnico in zona Verona.</p>`,
  ];
  return pick(intros, q.slug);
}

export function quartiereLocal(q) {
  return `
    <p>Nella zona di <strong>${q.name}</strong> interveniamo su perdite d'acqua, caldaie, scarichi intasati e rubinetteria. Emergenza: <a href="tel:${SITE.phoneTel}" class="link-accent">${SITE.phone}</a>.</p>`;
}

export function marcaIntro(m) {
  return `
    <p>Assistenza caldaie <strong>${m.name}</strong> a Verona${m.country ? ` (${m.country})` : ''}: guasti urgenti, manutenzione e riparazione. Emergenza caldaia: <a href="tel:${SITE.phoneTel}" class="link-accent">${SITE.phone}</a>.</p>
    <p>Modelli murali, a condensazione e sistemi ibridi.</p>`;
}

export function marcaServizioBlock(m, tipo) {
  const texts = {
    assistenza: `Caldaia <strong>${m.name}</strong> spenta o codice errore? Intervento urgente a Verona con diagnosi in loco.`,
    manutenzione: `Manutenzione caldaie <strong>${m.name}</strong>: controllo fumi, pulizia bruciatore, documentazione conformità.`,
    riparazione: `Riparazione <strong>${m.name}</strong>: circolatori, valvole, schede. Preventivo prima di sostituire.`,
  };
  return texts[tipo.slug] || texts.assistenza;
}

export function faqServizio(svc) {
  const seo = servizioSeo(svc);
  const base = [
    {
      q: svc.urgent ? `Quanto tempo per ${seo.h1.toLowerCase()} a Verona?` : `Quanto tempo per ${svc.name.toLowerCase()}?`,
      a: svc.urgent
        ? `Per urgenze arrivo medio ~${SITE.arrivalMin} minuti a Verona, h24 inclusi festivi.`
        : `Interventi programmati entro 24–48 ore lavorative.`,
    },
    {
      q: 'Il preventivo è gratuito?',
      a: 'Sì, costo comunicato prima di iniziare. Nessun addebito nascosto.',
    },
    {
      q: `Qual è il numero per ${svc.urgent ? 'urgenze' : 'richieste'} a Verona?`,
      a: `Chiama ${SITE.phone} — linea diretta Gala 400, niente call center.`,
    },
  ];
  if (svc.slug === 'pronto-intervento-idraulico') {
    base.unshift({
      q: 'Cosa include il pronto intervento idraulico a Verona?',
      a: 'Perdite acqua, scarichi intasati, caldaie, gas, rubinetteria e allagamenti. Tecnico h24 con preventivo prima dei lavori.',
    });
  }
  return base;
}

export function faqQuartiere(q) {
  return [
    {
      q: `Idraulico urgente a ${q.name}?`,
      a: `Sì, h24. Chiama ${SITE.phone} e indica via e numero civico.`,
    },
    {
      q: 'Fate caldaie in zona?',
      a: 'Sì, assistenza e riparazione su tutte le marche principali.',
    },
    {
      q: 'Lavorate con condomini?',
      a: 'Sì, colonne idriche, fognature e centrali termiche.',
    },
  ];
}

export function faqMarca(m) {
  return [
    {
      q: `Caldaia ${m.name} guasta a Verona?`,
      a: `Chiama ${SITE.phone} per intervento urgente su caldaie ${m.name}.`,
    },
    {
      q: 'Manutenzione obbligatoria?',
      a: 'Sì, richiesta dalla normativa. Documentazione per garanzia.',
    },
    {
      q: 'Codice errore sul display?',
      a: `Annota il codice e chiama ${SITE.phone} per messa in sicurezza.`,
    },
  ];
}
