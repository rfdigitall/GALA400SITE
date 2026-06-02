/** Testi professionali per pagine generate */
import { SITE } from './site-data.mjs';
import { iconBullets } from './icons.mjs';

function pick(arr, seed) {
  return arr[Math.abs(seed.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % arr.length];
}

export function servizioBody(svc) {
  const urg = svc.urgent
    ? `Per le emergenze offriamo pronto intervento attivo 24 ore su 24, con arrivo medio in circa ${SITE.arrivalMin} minuti a Verona e provincia.`
    : `Organizziamo interventi programmati con tempi concordati e preventivo scritto prima dell'avvio dei lavori.`;

  return `
    <p><strong>${svc.name}</strong> a Verona richiede tecnici competenti, attrezzatura adeguata e massima trasparenza sui costi. Gala 400 opera da anni sul territorio con soluzioni mirate per abitazioni private, studi professionali e condomini.</p>
    <p>${svc.short} ${urg}</p>
    <p>Prima di iniziare qualsiasi lavoro comunichiamo costi e tempi stimati. Su richiesta rilasciamo garanzia su materiali e manodopera. ${SITE.promo} — valida su interventi prenotati entro i termini indicati.</p>`;
}

export function servizioBullets(svc) {
  const map = {
    urgenze: ['Arrivo rapido in zona', 'Attrezzatura professionale', 'Intervento notturno e festivo', 'Report per assicurazione'],
    caldaie: ['Tutte le marche principali', 'Diagnosi e ricambi', 'Sicurezza impianto gas', 'Manutenzione programmata'],
    termico: ['Scaldabagni gas ed elettrici', 'Sostituzione rapida', 'Collaudo e messa in servizio', 'Consiglio modello efficiente'],
    manutenzione: ['Contratti condominio', 'Prevenzione guasti', 'Rapporto tecnico', 'Prezzi chiari'],
  };
  const texts = map[svc.category] || map.manutenzione;
  const icons = iconBullets(svc.category);
  return texts.map((text, i) => ({ text, icon: icons[i] || '✅' }));
}

export function quartiereIntro(q) {
  const tipo = q.type === 'comune' ? 'nel comune di' : 'nel quartiere';
  const intros = [
    `<p>Se cerchi un idraulico affidabile ${tipo} <strong>${q.name}</strong>, Gala 400 è la scelta concreta per urgenze e lavori programmati. Conosciamo le dinamiche di ${q.highlight} e interveniamo con squadre attrezzate.</p>`,
    `<p>A <strong>${q.name}</strong> gestiamo ogni giorno richieste di pronto intervento e manutenzione impianti. La nostra copertura include ${q.highlight}, con tempi di arrivo ottimizzati per la zona.</p>`,
    `<p>Gala 400 serve abitazioni e condomini ${tipo} <strong>${q.name}</strong> con un approccio professionale: diagnosi precisa, preventivo chiaro e tecnici abilitati per impianti idraulici e termici.</p>`,
  ];
  return pick(intros, q.slug);
}

export function quartiereLocal(q) {
  return `
    <p>Nella zona di <strong>${q.name}</strong> interveniamo regolarmente su perdite d'acqua, caldaie, scarichi intasati, rubinetteria e centrali termiche condominiali. Per le emergenze consigliamo di contattarci subito al <a href="tel:${SITE.phoneTel}" class="link-accent">${SITE.phone}</a>: ogni minuto conta quando si tratta di acqua o gas.</p>
    <p>Per interventi non urgenti possiamo fissare un appuntamento in fascia oraria dedicata, evitando attese lunghe e garantendo la presenza del tecnico giusto per il tipo di lavoro.</p>`;
}

export function marcaIntro(m) {
  return `
    <p>La caldaia <strong>${m.name}</strong> è tra le più installate in Italia${m.country ? ` (marchio ${m.country})` : ''}. Gala 400 offre assistenza completa a Verona: ripristino guasti, manutenzione ordinaria e sostituzione impianto quando non è più conveniente riparare.</p>
    <p>Lavoriamo su modelli murali, a condensazione, tradizionali e sistemi ibridi collegati ad accumulatori e produzione ACS.</p>`;
}

export function marcaServizioBlock(m, tipo) {
  const texts = {
    assistenza: `Intervento su caldaie <strong>${m.name}</strong> con caldaia spenta, codice errore, mancanza di fiamma o acqua calda assente. Diagnosi in loco e ripristino rapido con ricambi compatibili.`,
    manutenzione: `Controllo periodico caldaie <strong>${m.name}</strong>: pulizia bruciatore, verifica tiraggio e combustione, controllo pressione circuito e valvole di sicurezza. Documentazione utile per garanzia e conformità.`,
    riparazione: `Riparazione mirata su componenti <strong>${m.name}</strong>: circolatori, sonde, scambiatori, valvole gas, scheda e display. Preventivo prima di sostituire parti e test finale obbligatorio.`,
  };
  return texts[tipo.slug] || texts.assistenza;
}

export function faqServizio(svc) {
  return [
    {
      q: `Quanto tempo per ${svc.name.toLowerCase()} a Verona?`,
      a: svc.urgent
        ? `Per le urgenze puntiamo ad arrivare in circa ${SITE.arrivalMin} minuti, h24 inclusi festivi, salvo condizioni traffiche eccezionali.`
        : `Per interventi programmati concordiamo data e fascia oraria, di solito entro 24–48 ore lavorative.`,
    },
    {
      q: 'Il preventivo è gratuito?',
      a: 'Sì, comunichiamo il costo stimato prima di avviare il lavoro. Nessun addebito nascosto.',
    },
    {
      q: 'Coprite anche la provincia di Verona?',
      a: 'Sì, operiamo su Verona città e sui principali comuni limitrofi della provincia.',
    },
  ];
}

export function faqQuartiere(q) {
  return [
    {
      q: `Intervenite subito a ${q.name}?`,
      a: `Sì, il pronto intervento è attivo 24/7. Chiama il ${SITE.phone} e indica la via precisa per ridurre i tempi di arrivo.`,
    },
    {
      q: 'Fate anche manutenzione caldaie in zona?',
      a: 'Sì, manutenzione, assistenza e riparazione su tutte le marche principali, con rapporto intervento.',
    },
    {
      q: 'Lavorate con i condomini?',
      a: 'Sì, collaboriamo con amministratori per colonne idriche, fognature e centrali termiche.',
    },
  ];
}

export function faqMarca(m) {
  return [
    {
      q: `Riparate tutte le caldaie ${m.name}?`,
      a: `Interveniamo sui modelli più diffusi ${m.name} presenti a Verona. In caso di ricambio raro lo ordiniamo con tempi comunicati in anticipo.`,
    },
    {
      q: 'La manutenzione è obbligatoria?',
      a: 'Sì, la manutenzione periodica è richiesta dalla normativa e mantiene valida la garanzia del produttore.',
    },
    {
      q: 'Cosa fare se compare un codice errore?',
      a: `Annota il codice sul display e chiama il ${SITE.phone}: spesso possiamo guidarti alla messa in sicurezza prima dell'arrivo del tecnico.`,
    },
  ];
}
