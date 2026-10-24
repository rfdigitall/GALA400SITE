#!/usr/bin/env python3
"""BIP site fix 24/10/2026 for gala400.it — deterministic transform of the static site.
Run from repo root on a PRISTINE checkout:  python3 scripts/bip_build.py
Reads js/src/gala-config.js (single config spot) and writes the HTML, CSS/JS bundles, sitemap, robots, llms.txt."""
import re, os, glob, json, hashlib, html, io, base64, datetime, shutil
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
os.chdir(ROOT)
TODAY = '2026-10-24'
SITE = 'https://gala400.it'
CFG = json.loads(re.search(r'window\.GALA_CONFIG\s*=\s*(\{.*?\});', open('js/src/gala-config.js', encoding='utf-8').read(), re.S).group(1))
CITY = json.loads(re.search(r'window\.GALA_CITY_DATA=(\{.*\});', open('js/src/gala-city-data.js', encoding='utf-8').read(), re.S).group(1))
HS, HL = CFG['hoursShort'], CFG['hoursLong']
HLP = CFG.get('hoursPhrase', HL.lower())
SPAN_HS = f'<span data-hours="short">{HS}</span>'
SPAN_HL = f'<span data-hours="long">{HL}</span>'
PHONE = CFG['phoneDisplay']
BRAND = 'Gala400'
LEGAL = 'Gala 400 Srls'
FONT_PRELOAD = '<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/barlow-condensed-800-latin.woff2" crossorigin>\n  <link rel="preload" as="font" type="font/woff2" href="/assets/fonts/inter-latin.woff2" crossorigin>'
COSTO = 'Costo di uscita e preventivo comunicati al telefono prima dell\'intervento.'
LOG = []

GAS_PAGES = {'servizi/emergenza-gas-verona.html', 'servizi/ricerca-perdite-gas-verona.html'}
OUT_OF_AREA = {'quartieri/idraulico-sirmione.html'}
# Province towns with own page (kept indexable); Verona-city districts are near-duplicates -> noindex
TOWN_PAGES = {  # file slug -> (display name, comune slug in whitelist)
 'bardolino': ('Bardolino', 'bardolino'), 'garda': ('Garda', 'garda'), 'lazise': ('Lazise', 'lazise'),
 'malcesine': ('Malcesine', 'malcesine'), 'peschiera-del-garda': ('Peschiera del Garda', 'peschiera-del-garda'),
 'bussolengo': ('Bussolengo', 'bussolengo'), 'castelnuovo': ('Castelnuovo del Garda', 'castelnuovo-del-garda'),
 'legnago': ('Legnago', 'legnago'), 'negrar': ('Negrar di Valpolicella', 'negrar-di-valpolicella'),
 'pescantina': ('Pescantina', 'pescantina'), 'san-giovanni-lupatoto': ('San Giovanni Lupatoto', 'san-giovanni-lupatoto'),
 'san-martino-buon-albergo': ('San Martino Buon Albergo', 'san-martino-buon-albergo'),
 'sommacampagna': ('Sommacampagna', 'sommacampagna'), 'villafranca-di-verona': ('Villafranca di Verona', 'villafranca-di-verona'),
 'verona-centro': ('Verona', 'verona'), 'palazzolo': ('Palazzolo di Sona', 'sona'),
}
GARDA_UNIQUE = {'bardolino', 'garda', 'lazise', 'malcesine', 'peschiera-del-garda'}  # already hand-written unique copy
COMUNI_INFO = {c['nome']: c for c in json.load(open(os.environ.get('GALA_COMUNI', '/workspace/gala-audit/comuni_vr_istat.json'), encoding='utf-8'))} if os.path.exists(os.environ.get('GALA_COMUNI', '/workspace/gala-audit/comuni_vr_istat.json')) else {}

def kind(f):
    if f == 'index.html': return 'home'
    if f in ('privacy-policy.html', 'cookie-policy.html'): return 'legal'
    if f.endswith('/index.html'): return 'hub'
    if f in GAS_PAGES: return 'gas'
    if f.startswith('servizi/'): return 'service'
    if f.startswith('marche/'): return 'brand'
    if f.startswith('quartieri/'): return 'town'
    return 'other'

def town_slug(f): return f.split('idraulico-', 1)[1][:-5] if 'idraulico-' in f else None

def is_district(f):
    return kind(f) == 'town' and f not in OUT_OF_AREA and town_slug(f) not in TOWN_PAGES

def url_of(f):
    if f == 'index.html': return SITE + '/'
    if f.endswith('/index.html'): return SITE + '/' + f[:-10]
    return SITE + '/' + f

def indexable(f):
    return not (kind(f) in ('legal', 'gas') or f in OUT_OF_AREA or is_district(f))

# ---------------------------------------------------------------- assets
def write_hashed(name, ext, data):
    os.makedirs('assets/build', exist_ok=True)
    for old in glob.glob(f'assets/build/{name}.*.{ext}'): os.remove(old)
    h = hashlib.sha1(data.encode('utf-8')).hexdigest()[:10]
    p = f'assets/build/{name}.{h}.{ext}'
    open(p, 'w', encoding='utf-8').write(data)
    return '/' + p

def make_images(sample_html):
    os.makedirs('assets/img', exist_ok=True)
    b = re.search(r'data:image/png;base64,([A-Za-z0-9+/=]+)', sample_html).group(1)
    im = Image.open(io.BytesIO(base64.b64decode(b))).convert('RGBA')
    im.save('assets/img/logo-160.webp', 'WEBP', quality=88, method=6)
    big = Image.open('assets/logo.png').convert('RGBA')
    big.resize((512, 512), Image.LANCZOS).save('assets/img/logo-512.png', optimize=True)
    for jpg in glob.glob('assets/lavori/*.jpg'):
        Image.open(jpg).convert('RGB').save(jpg[:-4] + '.webp', 'WEBP', quality=78, method=6)
    fav = Image.open('assets/favicon-512.png').convert('RGBA')
    fav.save('assets/favicon-512.png', optimize=True)
    LOG.append('images: logo-160.webp, logo-512.png, lavori/*.webp, favicon-512 re-optimised')

# ---------------------------------------------------------------- text policy
def sub_all(s, pairs, flags=0):
    for a, b in pairs:
        s = re.sub(a, b, s, flags=flags)
    return s

POLICY = [
    (r'<li><span class="tick2">(?:(?!</li>).)*?</span>(?:Gas a [^<]*|Nessun anticipo richiesto|Arrivo medio ~20 minuti in città)</li>', ''),
    (r"Perdite d'acqua, caldaie, scarichi e emergenze gas", "Perdite d'acqua, spurgo, scarichi e caldaie"),
    (r'<div class="cn2-v">RC Prof\.</div><div class="cn2-l">[^<]*</div>', '<div class="cn2-v">Diretto</div><div class="cn2-l">Senza centralino</div>'),
    (r'<div class="gi2">(?:(?!<div class="gi2">).)*?Copertura assicurativa RC Professionale.*?</p></div></div>', ''),
    (r'<details class="faq"><summary><span class="faq-ico" aria-hidden="true">(?:<svg(?:(?!</details>).)*?</svg>)?</span>Siete assicurati per eventuali danni durante l\'intervento\?</summary>.*?</details>', ''),
    (r"ogni giorno dell'anno", HLP),
    (r'hanno priorità assoluta, a qualsiasi ora\.', 'hanno la precedenza, ' + HLP + '.'),
    (r'Vedi il costo prima che inizi qualsiasi lavoro, sempre per iscritto\.', 'Ti comunico il costo prima di iniziare qualsiasi lavoro.'),
    (r'con tecnici qualificati Gala 400', 'con il tecnico Gala400'), (r'con tecnici qualificati', 'con il tecnico'),
    (r'con preventivo scritto prima di ogni lavoro', 'con costo di uscita e preventivo comunicati al telefono'),
    (r'preventivo scritto prima di iniziare', 'preventivo comunicato prima di iniziare'),
    (r"preventivo scritto prima dell'avvio", "preventivo comunicato prima dell'avvio"),
    (r'(https://wa\.me/[^"]*?)%20[Hh]24', r'\1'),
    (r"(?:H24|h24|24/7), tutti i giorni dell'anno", HLP),
    (r'Sicurezza impianto gas', 'Controlli di sicurezza caldaia'),
    (r'<li><span class="tick2">(?:(?!</li>).)*?</span>Scaldabagno a gas</li>', ''),
    (r'scaldabagni a Verona</strong> gas ed elettrici con collaudo e messa in servizio\.', 'scaldabagni a Verona</strong> con collaudo e messa in servizio. Per scaldabagni a gas chiedi al telefono.'),
    (r'Diciamo i tempi reali: spesso <strong>45–70 minuti</strong>\.', 'Diciamo i tempi reali al telefono, in base a traffico e stagione.'),
    # --- arrival-time / minute guarantees
    (r'Arrivo garantito in circa 20 minuti in città', 'Tecnico disponibile in zona, tempi comunicati al telefono'),
    (r'\s*In città arrivo medio ~20 minuti\.', ' Tecnico disponibile in zona.'),
    (r'Pronto intervento attivo 24 ore su 24, arrivo medio ~20 minuti a Verona e provincia\.', 'Pronto intervento ' + HLP + ', a Verona e provincia.'),
    (r'arrivo medio ~20 minuti a Verona e provincia', 'tecnico disponibile in zona a Verona e provincia'),
    (r'Arrivo medio ~20 minuti\.', 'Intervento rapido, tempi comunicati al telefono.'),
    (r'Arrivo in ~20 minuti, preventivo gratuito\.', 'Intervento rapido. ' + COSTO),
    (r'Arrivo ~20 min\.', 'Intervento rapido.'),
    (r'Tecnico in zona, arrivo medio ~…', 'Tecnico disponibile in zona.'),
    (r'Linea diretta h24 a Verona — arrivo medio ~20 minuti, preventivo comunicato prima di iniziare\.', 'Rispondiamo ' + HLP + ' — ' + COSTO[0].lower() + COSTO[1:]),
    (r'guasta di notte o nel weekend\?', 'guasta, anche nel weekend?'),
    (r'Per urgenze arrivo medio ~20 minuti a Verona, h24 inclusi festivi\.', 'Dipende dalla zona e dal traffico: al telefono ti comunichiamo un orario di arrivo realistico. Rispondiamo ' + HLP + '.'),
    (r'Il tempo medio è di circa 20 minuti in città per le urgenze, h24 inclusi festivi\.', 'Dipende dalla zona e dal traffico: al telefono ti comunichiamo un orario di arrivo realistico.'),
    (r'In città il tempo medio è di circa 20 minuti per le urgenze\.', 'Dipende dalla zona e dal traffico.'),
    (r'Per le urgenze sì, tempo medio di arrivo circa 20 minuti in città\.', 'Sì, per le urgenze ti comunichiamo al telefono un orario di arrivo realistico.'),
    (r"Tempo medio ~20 minuti in città, con l'attrezzatura", "Al telefono ti diciamo i tempi reali per la tua zona; arriviamo con l'attrezzatura"),
    (r'Disponibile ora · ', 'Aperti 7/7 · '),
    (r'Mi racconti il problema in 2 minuti\.', 'Mi racconti il problema in poche parole.'),
    (r'mi racconti il problema in 2 minuti\.', 'mi racconti il problema in poche parole.'),
    (r'Mi racconti il guasto in 2 minuti — rispondiamo subito\.', 'Mi racconti il guasto — rispondiamo noi, senza centralino.'),
    (r'Ti rispondo subito e mi', 'Ti rispondo io e mi'),
    (r'Nella maggior parte dei casi individuo il guasto entro 20-30 minuti dal mio arrivo\.', 'Sul posto individuo il guasto e ti spiego cosa serve prima di procedere.'),
    # Garda-specific typical times -> no numbers
    (r'Tempo tipico ~25–40 min dalla sponda veronese\.', 'I tempi dipendono dalla sponda e dal traffico.'),
    (r'Dalla sponda veronese di solito entro 25–40 minuti, dipende dal traffico sul lago\.', 'Dipende dal traffico sul lago.'),
    (r'~35 min tipici verso Garda / Bardolino\.', 'Tempi variabili verso Garda / Bardolino.'),
    (r'Arrivo tipico ~35 min\.', 'Tempi comunicati al telefono.'),
    (r'~30 min tipici\.', 'Tempi variabili.'),
    (r'~40 min tipici\.', 'Tempi variabili.'),
    (r'Ti dico subito se l’arrivo è 45 o 70 minuti\.', 'Ti dico subito un orario di arrivo realistico.'),
    (r'In genere 45–70 minuti secondo traffico e stagione\.', 'Dipende da traffico e stagione.'),
    (r'<div class="cn2-v">~?\d+(?:[–-]\d+)? min</div><div class="cn2-l">(?:Arrivo medio|Arrivo tipico)</div>', '<div class="cn2-v">In zona</div><div class="cn2-l">Tecnico disponibile</div>'),
    (r'<div class="cn2-v">100%</div><div class="cn2-l">Preventivo (?:prima|comunicato prima)</div>', '<div class="cn2-v">Chiaro</div><div class="cn2-l">Uscita e preventivo al telefono</div>'),
    (r'<div class="cn2-v">(?:H24|8–24)</div><div class="cn2-l">(?:Reperibilità|Pronto intervento|Ogni giorno)</div>', '<div class="cn2-v">7/7</div><div class="cn2-l">Aperti anche sabato e domenica</div>'),
    (r'<div class="cn2-l">Marca assistita</div>', '<div class="cn2-l">Marca trattata</div>'),
    # --- free quote / call-out (client charges a call-out fee)
    (r'<summary><span class="faq-ico" aria-hidden="true">(?:<svg(?:(?!</details>).)*?</svg>)?</span>Il preventivo è (?:davvero )?gratuito\?</summary><div class="faq-a"><p>[^<]*</p>',
     '<summary><span class="faq-ico" aria-hidden="true"></span>Quanto costa l’uscita?</summary><div class="faq-a"><p>L’uscita ha un costo. ' + COSTO + ' Nessun costo nascosto.</p>'),
    (r'Preventivo gratuito e scritto prima di ogni lavoro', 'Uscita e preventivo comunicati prima dell’intervento'),
    (r'[Pp]reventivo gratuito prima dei lavori\.', COSTO),
    (r'Preventivo gratuito\.', COSTO),
    (r'(?i)preventivo gratuito', 'preventivo prima dell’intervento'),
    (r'(?i)\bgratuit[oaie]\b|\bgratis\b', 'chiaro'),
    # --- superlatives / unverifiable
    (r'Intervento Immediato', 'Intervento Rapido'), (r'Intervento immediato', 'Intervento rapido'), (r'intervento immediato', 'intervento rapido'),
    (r'Richiamata immediata', 'Richiedi una richiamata'),
    (r'Intervengo subito, anche nei casi più difficili\.', 'Intervengo in tempi rapidi, anche nei casi complessi.'),
    (r'Reperibilità reale, anche di notte e nei festivi', 'Rispondiamo ' + HLP),
    (r'rispondiamo subito', 'rispondiamo noi'),
    (r'Preferiamo intervento immediato', 'Preferiamo intervenire rapidamente'),
    (r'<h2>Verona, dal 2010\.</h2>', '<h2>Idraulico a Verona e provincia.</h2>'),
    (r'Tecnici qualificati\.', 'Tecnico indipendente.'),
    # --- night / 24h claims
    (r'Disotturazione urgente a Verona, anche di notte\.', 'Disotturazione urgente a Verona, ' + HLP + '.'),
    (r'Sì, reperibilità H24\. Di notte e nei weekend rispondiamo sullo stesso numero 349 420 8551', 'Rispondiamo ' + HLP + ' sullo stesso numero 349 420 8551'),
    (r'Intervieni anche di notte per un allagamento\?', 'In che orari intervieni per un allagamento?'),
    (r'H24, tutti i giorni, festivi inclusi\. Se chiami, rispondiamo noi — senza centralino\.', HL + '. Se chiami, rispondiamo noi — senza centralino.'),
    (r'Sì, rispondo tutti i giorni, festivi compresi\.', 'Sì: ' + HLP + '.'),
    (r'H24, festivi inclusi', HL), (r'h24 inclusi festivi', HLP), (r'h24 anche festivi', HLP),
    (r'rispondiamo noi, H24, festivi inclusi', 'rispondiamo noi, ' + HLP),
    (r'Attivo 24/7 · Tutti i giorni', SPAN_HL), (r'Pronto Intervento 24/7', 'Pronto Intervento ' + HS),
    (r'24 ore su 24', HLP),
    (r'tecnico reperibile h24 con intervento prioritario', 'tecnico disponibile ' + HS),
    (r'(?i)\bdi notte\b', 'in orario serale'),
]
H24_TEXT = [  # applied to visible text + attributes after POLICY
    (r'Disponibile H24', 'Disponibile ' + SPAN_HS),
    (r'\b[Hh]24\b', HS),
    (r'\b24/7\b', HS),
    (r'(?<![\d:])8\s?[–-]\s?24(?![\d:])', HS),  # t38u: no visible clock hours
]
BRAND_FIX = [
    (r'Gala 400 Srls(?! — P\.IVA 05180000233 — REA)', BRAND),
    (r'GALA 400', BRAND), (r'Gala 400(?! Srls)', BRAND),
    (r'Gala400 Srls?\b', BRAND),
]

def text_only(s, fn):
    """apply fn to text nodes only (not tags, scripts, styles)"""
    parts = re.split(r'(<script\b.*?</script>|<style\b.*?</style>|<[^>]+>)', s, flags=re.S)
    return ''.join(p if (p.startswith('<')) else fn(p) for p in parts)

def attrs_fn(s, fn, names=('content', 'alt', 'title', 'aria-label')):
    return re.sub(r'\b(' + '|'.join(names) + r')="([^"]*)"', lambda m: m.group(1) + '="' + fn(m.group(2)) + '"', s)

# ---------------------------------------------------------------- head / tracking
HEAD_TRACK = f"""<script>
    window.dataLayer=window.dataLayer||[];
    function gtag(){{dataLayer.push(arguments);}}
    /* Consent Mode v2 — advanced: everything denied by default, cookieless pings allowed */
    gtag('consent','default',{{'ad_storage':'denied','ad_user_data':'denied','ad_personalization':'denied','analytics_storage':'denied','wait_for_update':500}});
    gtag('set','ads_data_redaction',true);
    gtag('set','url_passthrough',true);
    /* returning visitor: restore saved choice (cookieconsent v3 cookie) before tags fire */
    (function(){{try{{var m=document.cookie.match(/(?:^|; )cc_cookie=([^;]*)/);if(!m)return;var c=JSON.parse(decodeURIComponent(m[1])).categories||[];var a=c.indexOf('ads')>-1,n=c.indexOf('analytics')>-1;gtag('consent','update',{{'analytics_storage':n?'granted':'denied','ad_storage':a?'granted':'denied','ad_user_data':a?'granted':'denied','ad_personalization':a?'granted':'denied'}});}}catch(e){{}}}})();
    /* Google call-tracking debug only (#google-wcc-debug in URL, used by the advertiser to test) */
    if(location.hash==='#google-wcc-debug'){{gtag('consent','update',{{'ad_storage':'granted','ad_user_data':'granted','ad_personalization':'granted','analytics_storage':'granted'}});}}
  </script>
  <script async src="https://www.googletagmanager.com/gtag/js?id={CFG['adsId']}"></script>
  <script>
    gtag('js',new Date());
    gtag('config','{CFG['adsId']}');
    gtag('config','{CFG['ga4Id']}');
    /* Website call conversion "Chiamata (349 420 8551)": Google forwarding number swap on all tel: links + visible numbers */
    gtag('config','{CFG['callConversion']}',{{'phone_conversion_number':'{PHONE}'}});
  </script>"""

OLD_HEAD_RE = re.compile(r'<script>\s*window\.dataLayer=window\.dataLayer\|\|\[\];.*?</script>\s*<script async src="https://www\.googletagmanager\.com/gtag/js\?id=AW-18106797178"></script>\s*<script>.*?</script>', re.S)

# ---------------------------------------------------------------- snippets
def rel(f, target):
    depth = f.count('/')
    return ('../' * depth) + target if depth else target

SERVICE_NAMES = {
 'pronto-intervento-idraulico-verona': 'Pronto intervento idraulico', 'perdite-acqua-urgenti-verona': 'Perdite d’acqua urgenti',
 'spurgo-urgente-verona': 'Spurgo e autospurgo', 'wc-intasato-urgente-verona': 'WC e scarichi intasati',
 'allagamento-verona': 'Allagamenti', 'ricerca-perdite-acqua-verona': 'Ricerca perdite acqua',
 'assistenza-caldaia-verona': 'Assistenza caldaia', 'riparazione-caldaia-verona': 'Riparazione caldaia',
 'manutenzione-caldaia-verona': 'Manutenzione caldaia', 'installazione-caldaia-verona': 'Installazione caldaia',
 'scaldabagno-verona': 'Scaldabagno', 'rubinetteria-verona': 'Rubinetteria e sanitari',
 'idraulico-condominio-verona': 'Idraulico per condomini', 'manutenzione-impianti-idraulici-verona': 'Manutenzione impianti idraulici',
}
MAIN_SERVICES = ['pronto-intervento-idraulico-verona', 'spurgo-urgente-verona', 'perdite-acqua-urgenti-verona', 'wc-intasato-urgente-verona',
                 'riparazione-caldaia-verona', 'assistenza-caldaia-verona', 'allagamento-verona', 'scaldabagno-verona']

def in_breve(f):
    return f"""<section class="sec2" id="in-breve">
  <div class="lbl2">In breve</div>
  <h2>{BRAND}: chi siamo.</h2>
  <dl class="facts">
    <dt>Chi</dt><dd>{BRAND}, impresa idraulica di Verona (P.IVA 05180000233): risponde direttamente il tecnico, senza centralino.</dd>
    <dt>Cosa</dt><dd>Pronto intervento idraulico, perdite d’acqua, spurgo e autospurgo, WC e scarichi intasati, caldaie (riparazione, manutenzione, installazione), scaldabagni, rubinetteria, condomini.</dd>
    <dt>Dove</dt><dd>Verona città e tutti i comuni della provincia di Verona.</dd>
    <dt>Orari</dt><dd>{SPAN_HL}.</dd>
    <dt>Costi</dt><dd>{COSTO} Nessun costo nascosto.</dd>
    <dt>Telefono</dt><dd><a href="tel:+393494208551" data-cta="in-breve-tel">{PHONE}</a> — risponde direttamente il tecnico.</dd>
  </dl>
</section>
"""

def zones_block(f):
    links = ''.join(f'<a class="zc2" href="{rel(f, "quartieri/idraulico-" + s + ".html")}"><span class="zdot2"></span><span class="zname2">Idraulico {n}</span></a>'
                    for s, (n, _) in TOWN_PAGES.items())
    return f"""<section class="sec2" id="zone-servite">
  <div class="lbl2">Zone servite</div>
  <h2>Verona e provincia.</h2>
  <p>Interveniamo a Verona e in tutti i 98 comuni della provincia. Pagine dedicate:</p>
  <div class="zone2-grid zone2-c16">{links}</div>
  <p style="margin-top:1rem"><a class="link-more" href="{rel(f, 'quartieri/')}">Tutte le zone →</a></p>
</section>
"""

def services_block(f, town):
    links = ''.join(f'<a class="zc2" href="{rel(f, "servizi/" + s + ".html")}"><span class="zdot2"></span><span class="zname2">{SERVICE_NAMES[s]}</span></a>' for s in MAIN_SERVICES)
    return f"""<section class="sec2" id="servizi-zona">
  <div class="lbl2">Servizi</div>
  <h2>Servizi a {html.escape(town)}.</h2>
  <div class="zone2-grid zone2-c8">{links}</div>
</section>
"""

def town_facts(f):
    s = town_slug(f); name, cs = TOWN_PAGES.get(s, (None, None))
    if not name: return ''
    info = COMUNI_INFO.get(CITY['n'].get(cs, ''), {})
    caps = ', '.join(info.get('cap', [])) if info else ''
    pop = info.get('popolazione') if info else None
    bits = [f'<dt>Comune</dt><dd>{html.escape(CITY["n"][cs])} (VR), Veneto</dd>']
    if caps: bits.append(f'<dt>CAP</dt><dd>{caps}</dd>')
    if pop: bits.append(f'<dt>Abitanti</dt><dd>circa {pop:,}'.replace(',', '.') + ' (ISTAT)</dd>')
    bits.append(f'<dt>Orari</dt><dd>{SPAN_HL}</dd>')
    bits.append(f'<dt>Costi</dt><dd>{COSTO}</dd>')
    bits.append('<dt>Cosa dire al telefono</dt><dd>Via, numero civico, frazione e cosa vedi (acqua che esce, scarico fermo, codice errore caldaia).</dd>')
    return f"""<section class="sec2 sec2-ice" id="info-zona">
  <div class="lbl2">Info utili</div>
  <h2>Idraulico a {html.escape(name)}: in breve.</h2>
  <dl class="facts">{''.join(bits)}</dl>
</section>
"""

GAS_SAFETY = """<div class="safety-box" role="note"><strong>Senti odore di gas?</strong> Non accendere luci o interruttori, non usare fiamme, apri le finestre, chiudi il rubinetto del contatore se raggiungibile ed esci. Poi chiama subito il <a href="tel:112">112</a> (Numero Unico di Emergenza) oppure il <strong>pronto intervento gas del tuo distributore</strong> (numero verde indicato in bolletta). """ + BRAND + """ <strong>non offre un servizio di emergenza gas</strong>.</div>"""

def brand_disclaimer(brand):
    return f'<p class="hero-disc">Tecnico indipendente, non centro assistenza autorizzato {html.escape(brand)}.</p>'

GENERIC_DISCLAIMER = '<p class="hero-disc">Tecnico indipendente, non centro assistenza autorizzato. Caldaie di tutte le marche.</p>'

TAGLINES = {  # t40u: short, punchy hero copy (cost line lives in the badge under the CTA)
 'index.html': "Perdite d'acqua, scarichi bloccati, spurgo con autospurgo, caldaie ferme — intervengo a Verona e provincia. Risponde il tecnico, senza centralino.",
 'servizi/pronto-intervento-idraulico-verona.html': "Tubo rotto, perdita d'acqua, WC intasato? Pronto intervento idraulico a Verona e provincia. Tocca e chiama: risponde il tecnico.",
 'servizi/perdite-acqua-urgenti-verona.html': "Perdita d'acqua o tubo rotto a Verona e provincia? Chiudi la valvola e chiama 349 420 8551: risponde il tecnico.",
 'servizi/spurgo-urgente-verona.html': "Spurgo urgente a Verona e provincia con autospurgo: fognature, pozzi neri, scarichi bloccati. Chiama 349 420 8551.",
 'servizi/wc-intasato-urgente-verona.html': "WC intasato o scarico otturato a Verona e provincia? Tocca e chiama 349 420 8551: risponde il tecnico, senza centralino.",
 'servizi/riparazione-caldaia-verona.html': "Caldaia rotta o in blocco a Verona e provincia? Riparazione urgente, caldaie di tutte le marche. Chiama 349 420 8551.",
 'servizi/assistenza-caldaia-verona.html': "Caldaia spenta o senza acqua calda a Verona e provincia? Assistenza caldaie di tutte le marche. Chiama 349 420 8551.",
}

def town_stat(f, s):
    """t40u: full town name in the stat box (was truncated to 8 chars / last word)"""
    ts = town_slug(f)
    if not ts: return s
    if ts in TOWN_PAGES: name = TOWN_PAGES[ts][0]
    else: name = h1_text(s).replace('Idraulico urgente ', '').strip() or ts.replace('-', ' ').title()
    def rep(m):
        lbl = m.group(1)
        if lbl != 'Zona lago':
            lbl = 'Frazione di Sona' if ts == 'palazzolo' else ('Comune' if ts in TOWN_PAGES and ts != 'verona-centro' else 'Quartiere')
        cls = 'cn2-v cn2-name' + (' cn2-long' if len(name) > 12 else '')
        return f'<div class="{cls}">{html.escape(name)}</div><div class="cn2-l">{lbl}</div>'
    return re.sub(r'<div class="cn2-v">[^<]*</div><div class="cn2-l">(Quartiere|Zona lago)</div>', rep, s, count=1)

# ---------------------------------------------------------------- JSON-LD
def area_served():
    a = [{"@type": "AdministrativeArea", "name": "Provincia di Verona"}]
    a += [{"@type": "City", "name": n} for n in sorted(CITY['n'].values())]
    return a

BUSINESS = {
    "@type": "Plumber", "@id": SITE + "/#business", "name": BRAND, "legalName": LEGAL,
    "taxID": "05180000233", "vatID": "IT05180000233", "telephone": "+393494208551", "url": SITE + "/",
    "logo": SITE + "/assets/img/logo-512.png", "image": SITE + "/assets/img/logo-512.png",
    "address": {"@type": "PostalAddress", "addressLocality": "Verona", "addressRegion": "VR", "addressCountry": "IT"},
    "areaServed": None,
    "openingHoursSpecification": [{"@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": CFG['opens'], "closes": CFG['closes']}],
    "knowsAbout": ["pronto intervento idraulico", "spurgo e autospurgo", "perdite d'acqua", "disostruzione scarichi", "riparazione caldaie", "scaldabagni"],
}

def faq_from_page(s):
    qa = []
    for m in re.finditer(r'<details class="faq"><summary>(.*?)</summary><div class="faq-a">(.*?)</div></details>', s, re.S):
        q = html.unescape(re.sub(r'<[^>]+>', '', m.group(1))).strip()
        a = html.unescape(re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', m.group(2)))).strip()
        if q and a: qa.append({"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}})
    return qa

def h1_text(s):
    m = re.search(r'<h1[^>]*>(.*?)</h1>', s, re.S)
    return html.unescape(re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', m.group(1)))).strip() if m else ''

def crumbs(f, s):
    k = kind(f); items = [("Home", SITE + "/")]
    if k in ('service', 'gas'): items.append(("Servizi", SITE + "/servizi/"))
    if k == 'brand': items.append(("Caldaie per marca", SITE + "/marche/"))
    if k == 'town': items.append(("Zone", SITE + "/quartieri/"))
    if f != 'index.html':
        t = re.search(r'<title>(.*?)</title>', s).group(1).split('|')[0].split('☎')[0].strip()
        items.append((h1_text(s) or t, url_of(f)))
    return items

def build_ld(f, s, old_nodes):
    k = kind(f)
    biz = dict(BUSINESS); biz['areaServed'] = area_served()
    graph = [biz]
    title = html.unescape(re.search(r'<title>(.*?)</title>', s).group(1))
    dm = re.search(r'<meta name="description" content="([^"]*)"', s)
    graph.append({"@type": "WebSite", "@id": SITE + "/#website", "url": SITE + "/", "name": BRAND, "inLanguage": "it-IT", "publisher": {"@id": SITE + "/#business"}})
    graph.append({"@type": "WebPage", "@id": url_of(f) + "#webpage", "url": url_of(f), "name": title, "description": html.unescape(dm.group(1)) if dm else "",
                  "inLanguage": "it-IT", "isPartOf": {"@id": SITE + "/#website"}, "about": {"@id": SITE + "/#business"}, "dateModified": TODAY})
    if k in ('service', 'brand', 'town') and f not in OUT_OF_AREA:
        name = h1_text(s)
        svc = {"@type": "Service", "name": name, "serviceType": SERVICE_NAMES.get(os.path.basename(f)[:-5], name),
               "provider": {"@id": SITE + "/#business"}, "url": url_of(f)}
        if k == 'town':
            ts = town_slug(f); tn = TOWN_PAGES.get(ts, (None, None))
            svc['serviceType'] = 'Pronto intervento idraulico'
            svc['areaServed'] = {"@type": "City", "name": CITY['n'][tn[1]]} if tn[1] else {"@type": "Place", "name": name.replace('Idraulico urgente ', '')}
        else:
            svc['areaServed'] = {"@type": "AdministrativeArea", "name": "Provincia di Verona"}
        graph.append(svc)
    if f != 'index.html':
        graph.append({"@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": i + 1, "name": n, "item": u} for i, (n, u) in enumerate(crumbs(f, s))]})
    qa = faq_from_page(s)
    if qa and k != 'gas': graph.append({"@type": "FAQPage", "mainEntity": qa})
    return '<script type="application/ld+json">' + json.dumps({"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False) + '</script>'

def visible_crumbs(f, s):
    items = crumbs(f, s)
    if len(items) < 2: return ''
    li = []
    for i, (n, u) in enumerate(items):
        if i == len(items) - 1: li.append(f'<li aria-current="page">{html.escape(n)}</li>')
        else: li.append(f'<li><a href="{u.replace(SITE, "")}">{html.escape(n)}</a></li>')
    return '<nav class="crumbs" aria-label="Breadcrumb"><ol>' + ''.join(li) + '</ol></nav>\n'

# ---------------------------------------------------------------- per-page transform
def city_spans(f, s):
    """dynamic city spans in hero (home + service pages only)"""
    A = '<span data-city="a">a Verona e provincia</span>'
    N = '<span data-city="name">Verona e provincia</span>'
    hero_end = s.find('</section>', s.find('<section class="hero2"'))
    hero, rest = s[:hero_end], s[hero_end:]
    def h1fix(m):
        t = m.group(2)
        if f == 'index.html':
            t = 'Idraulico ' + N + '<br><em>Pronto intervento.</em>'
        else:
            t = re.sub(r'\s*(?:H24|h24|' + re.escape(HS) + r')\b', '', t)
            t = re.sub(r'^(.*?) Verona urgente$', r'\1 urgente Verona', t.strip())
            t2 = re.sub(r'\s+(?:a|di) Verona\b', ' ' + A, t, count=1)
            if t2 == t: t2 = re.sub(r'\s+Verona\b', ' ' + A, t, count=1)
            t = t2
        return m.group(1) + t + m.group(3)
    hero = re.sub(r'(<h1 class="hero2-h1">)(.*?)(</h1>)', h1fix, hero, count=1, flags=re.S)
    hero = re.sub(r'(<div class="hero2-badge"><span class="live-dot" aria-hidden="true"></span>)[^<]*', lambda m: m.group(1) + '<span>Aperti 7/7 · ' + N + '</span>', hero, count=1)
    def tag(m):
        p = m.group(0)
        p = re.sub(r'\ba Verona e sulla sponda veronese del lago di Garda\b', A, p)
        p = re.sub(r'\ba Verona(?: e (?:provincia|lago di Garda))?\b(?![^<]*</span>)', A, p, count=1)
        return p
    hero = re.sub(r'<p class="hero2-tagline"[^>]*>.*?</p>', tag, hero, count=1, flags=re.S)
    s = hero + rest
    s = s.replace('<span class="sticky-call-label">Emergenza idraulica Verona</span>', '<span class="sticky-call-label">Idraulico <span data-city="name">Verona e provincia</span></span>')
    return s

def transform(f, s, css_href, core_href):
    k = kind(f)
    # ---- head tracking
    s, n = OLD_HEAD_RE.subn(HEAD_TRACK, s)
    assert n == 1, (f, 'head tracking block', n)
    # ---- CSS: inline -> external hashed file (legal pages keep tiny inline CSS)
    if k != 'legal':
        s = re.sub(r'\s*<style>\.seo-only\{.*?</style>', '', s, count=1, flags=re.S)
        s, n = re.subn(r'<style>.*?</style>', f'<link rel="stylesheet" href="{css_href}">', s, count=1, flags=re.S)
        assert n == 1, f
    # ---- CLS: web fonts only if ready in time (no late swap of the hero)
    s = re.sub(r'\s*<link rel="preconnect" href="https://fonts\.g(?:oogleapis|static)\.com"[^>]*>', '', s)
    s = re.sub(r'\s*<link rel="(?:preload|stylesheet)"[^>]*href="https://fonts\.googleapis\.com/[^"]*"[^>]*>', '', s)
    s = re.sub(r'\s*<noscript><link[^>]*fonts\.googleapis\.com[^>]*></noscript>', '', s)
    s = s.replace('<meta name="viewport"', FONT_PRELOAD + '\n  <meta name="viewport"', 1)
    # ---- preload logo
    s = s.replace('<meta name="viewport"', '<link rel="preload" as="image" href="/assets/img/logo-160.webp" type="image/webp" fetchpriority="high">\n  <meta name="viewport"', 1)
    # ---- logos base64 -> webp file
    imgs = list(re.finditer(r'<img src="data:image/png;base64,[A-Za-z0-9+/=]+"', s))
    for i, m in reversed(list(enumerate(imgs))):
        if i == 0: rep = '<img src="/assets/img/logo-160.webp" width="60" height="60" fetchpriority="high" decoding="async"'
        else: rep = '<img src="/assets/img/logo-160.webp" width="72" height="72" loading="lazy" decoding="async"'
        s = s[:m.start()] + rep + s[m.end():]
    # ---- gallery jpg -> picture/webp
    s = re.sub(r'<img src="((?:\.\./)?assets/lavori/[^"]+)\.jpg"', r'<picture><source type="image/webp" srcset="/\1.webp"><img src="/\1.jpg"', s)
    s = re.sub(r'(<picture><source[^>]*><img [^>]*>)', r'\1</picture>', s)
    s = s.replace('srcset="/../', 'srcset="/').replace('src="/../', 'src="/')
    # ---- policy text (whole document, incl. meta + JSON-LD which is rebuilt anyway)
    s = sub_all(s, POLICY, re.S)
    s = re.sub(r'(<h1[^>]*>)(.*?)(</h1>)', lambda m: m.group(1) + re.sub(r'\s+(?:[Hh]24|24/7)\b', '', m.group(2)) + m.group(3), s, count=1, flags=re.S)
    if f in OUT_OF_AREA:
        s = sub_all(s, [(r'Sirmione VR', 'Sirmione (BS)'), (r'Sirmione (?:[Hh]24|8–24) \(VR\)', 'Sirmione (BS)'), (r'Sirmione in emergenza \(VR\)\?', 'Sirmione (BS)?'),
                        (r'Sirmione \(provincia di Verona\)', 'Sirmione (provincia di Brescia)'), (r'\(provincia di Verona\)', '(provincia di Brescia)'),
                        (r'Operiamo sulla <strong>provincia di Verona</strong>\. Sirmione sì; Desenzano \(Brescia\) no\.', 'Operiamo sulla <strong>provincia di Verona</strong>. Sirmione e Desenzano sono in provincia di Brescia: disponibilità da verificare.'),
                        (r'No: operiamo sulla provincia di Verona \(Sirmione \(BS\)\)\. Desenzano è Brescia — fuori zona\.', 'Operiamo sulla provincia di Verona; Desenzano (BS) è fuori zona.'),
                        (r'Solo Sirmione \(BS\)\.', 'Sirmione è fuori dalla nostra zona principale.')])
    else:
        s = re.sub(r'<a [^>]*href="[^"]*idraulico-sirmione\.html"[^>]*>.*?</a>', '', s, flags=re.S)
        s = s.replace('Peschiera, Lazise, Bardolino, Sirmione, Malcesine', 'Peschiera, Lazise, Bardolino, Garda, Malcesine')
        s = s.replace(', Malcesine, Sirmione</li>', ', Malcesine</li>')
        s = re.sub(r'<span class="t-item">Sirmione <span class="t-dot">✦</span></span>', '', s)
    def h24(t): return sub_all(t, H24_TEXT)
    head_end = s.find('</head>')
    head, body = s[:head_end], s[head_end:]
    head = re.sub(r'<title>(.*?)</title>', lambda m: '<title>' + h24(m.group(1)) + '</title>', head)
    head = attrs_fn(head, h24)
    body = text_only(body, h24); body = attrs_fn(body, h24)
    # brand name: visible text + attributes (not URLs)
    body = text_only(body, lambda t: sub_all(t, BRAND_FIX)) if k != 'legal' else body
    head = re.sub(r'<title>(.*?)</title>', lambda m: '<title>' + sub_all(m.group(1), BRAND_FIX) + '</title>', head)
    head = attrs_fn(head, lambda t: sub_all(t, BRAND_FIX), names=('content',))
    body = attrs_fn(body, lambda t: sub_all(t, BRAND_FIX), names=('alt', 'aria-label'))
    s = head + body
    s = s.replace('Gala400 — Idraulico Verona', BRAND)  # og:site_name etc.
    # ---- gas links removed everywhere (pages not advertised)
    s = re.sub(r'<div class="sc2">(?:(?!<div class="sc2">).)*?href="[^"]*(?:emergenza-gas|ricerca-perdite-gas)-verona\.html"[^>]*>[^<]*</a>\s*</div>', '', s, flags=re.S)
    _n = iter(range(1, 100)); s = re.sub(r'<div class="sc2-num">\d+</div>', lambda m: '<div class="sc2-num">%02d</div>' % next(_n), s)
    s = re.sub(r'<li><a [^>]*href="[^"]*(?:emergenza-gas|ricerca-perdite-gas)-verona\.html"[^>]*>.*?</a></li>', '', s, flags=re.S)
    s = re.sub(r'<a [^>]*href="[^"]*(?:emergenza-gas|ricerca-perdite-gas)-verona\.html"[^>]*>.*?</a>', '', s, flags=re.S)
    s = re.sub(r'<li><span class="tick2"></span>Gas a [^<]*</li>', '', s)
    s = s.replace('caldaia o gas: chiama', 'caldaia: chiama')
    # ---- hidden SEO text: show useful prose, drop hidden duplicate grids
    s = re.sub(r'<section class="seo-only" aria-hidden="true">.*?</section>\s*', '', s, flags=re.S)  # short duplicate prose, replaced by "In breve" 
    s = re.sub(r'<section class="sec2 seo-only"[^>]*>.*?</section>\s*', '', s, flags=re.S)  # t40u: no hidden text, no long town grid
    # ---- nav: header phone on every page + Spurgo link
    if 'class="nav2-phone"' not in s:
        s = s.replace('<nav class="nav2">', '<nav class="nav2">\n  <a href="tel:+393494208551" class="nav2-phone" data-cta="nav2-phone">' + PHONE + '</a>', 1)
    s = s.replace('<li><a href="/marche/">Caldaie</a></li>', '<li><a href="/servizi/spurgo-urgente-verona.html">Spurgo</a></li>\n    <li><a href="/marche/">Caldaie</a></li>', 1)
    s = s.replace('<a href="/marche/">Caldaie</a>\n  <a href="tel:', '<a href="/servizi/spurgo-urgente-verona.html">Spurgo</a>\n  <a href="/marche/">Caldaie</a>\n  <a href="tel:', 1)
    # ---- above-the-fold CTA wording
    s = re.sub(r'(<a href="tel:\+393494208551" class="hbtn hbtn-solid" data-cta="hero2-call">\s*(?:<svg.*?</svg>)?\s*)349 420 8551(\s*</a>)', r'\1Chiama ora · 349 420 8551\2', s, count=1, flags=re.S)
    s = re.sub(r'<p class="hc-meta">[^<]*P\.IVA[^<]*</p>', '<p class="hc-meta">Risponde il tecnico · ' + SPAN_HS + '</p>', s)
    s = re.sub(r'<div class="ct2-row"><div class="ct2-rlbl">[^<]*</div><span class="ct2-rval"[^>]*>P\.IVA[^<]*</span></div>\s*', '', s)
    # ---- page-type specific
    if f in TAGLINES:
        s = re.sub(r'(<p class="hero2-tagline"[^>]*>).*?(</p>)', lambda m: m.group(1) + TAGLINES[f] + m.group(2), s, count=1, flags=re.S)
    s = re.sub(r'(<p class="hero2-tagline"[^>]*>)(.*?)(</p>)', lambda m: m.group(1) + m.group(2).replace(' ' + COSTO, '').replace(COSTO + ' ', '').replace(', con costo di uscita e preventivo comunicati al telefono.', '.') + m.group(3), s, count=1, flags=re.S)
    if k in ('home', 'service'):
        s = city_spans(f, s)
    if k in ('home', 'service', 'town', 'brand') and f not in OUT_OF_AREA:
        s = s.replace('</div>\n    <div class="hero2-contact">', '  <p class="hero-cta-note"><span class="cost-badge">' + COSTO.rstrip('.') + '</span></p>\n    </div>\n    <div class="hero2-contact">', 1)
    if k == 'home':
        s = s.replace('Perdite d\'acqua, scarichi bloccati, caldaie ferme, allagamenti — intervengo',
                      'Perdite d\'acqua, scarichi bloccati, spurgo con autospurgo, caldaie ferme, allagamenti — intervengo', 1)
    if k == 'brand' or f == 'marche/index.html':
        b = h1_text(s).replace('Assistenza ', '').replace(' Verona', '').strip() if k == 'brand' else None
        if b: s = re.sub(r'<h1 class="hero2-h1">Assistenza (.+?) Verona</h1>', r'<h1 class="hero2-h1">Riparazione caldaie \1 a Verona</h1>', s, count=1)
        disc = brand_disclaimer(b) if b else GENERIC_DISCLAIMER
        s = re.sub(r'(<p class="hero2-tagline">.*?</p>)', lambda m: m.group(1) + '\n      ' + disc, s, count=1, flags=re.S)
        if b:
            s = re.sub(r'<title>Assistenza ([^|<]+?) Verona \| Manutenzione e Riparazione</title>', r'<title>Riparazione caldaie \1 Verona | Gala400</title>', s)
            s = re.sub(r'(<meta name="description" content=")([^"]*)', lambda m: m.group(1) + m.group(2).replace('Tecnico indipendente.', 'Tecnico indipendente, non centro assistenza autorizzato.'), s, count=1)
    if f in ('servizi/assistenza-caldaia-verona.html', 'servizi/riparazione-caldaia-verona.html', 'servizi/manutenzione-caldaia-verona.html', 'servizi/installazione-caldaia-verona.html'):
        s = re.sub(r'(<p class="hero2-tagline">.*?</p>)', lambda m: m.group(1) + '\n      ' + GENERIC_DISCLAIMER, s, count=1, flags=re.S)
    if k == 'gas':
        s = gas_page(f, s)
    if f in OUT_OF_AREA:
        s = re.sub(r'(<p class="hero2-tagline">.*?</p>)', lambda m: m.group(1) + '\n      <p class="hero-disc">Sirmione è in provincia di Brescia, fuori dalla nostra zona principale: chiama per verificare.</p>', s, count=1, flags=re.S)
    s = s.replace('<span class="sticky-call-label">Emergenza idraulica Verona</span>', '<span class="sticky-call-label">Chiama il tecnico</span>')
    # ---- service pages titles/meta: province-generic
    if k in ('service', 'home'):
        s = re.sub(r'<title>(.*?)</title>', lambda m: '<title>' + service_title(f, m.group(1)) + '</title>', s, count=1)
        s = re.sub(r'(<meta (?:name="description"|property="og:description") content=")([^"]*)', lambda m: m.group(1) + m.group(2).replace('a Verona e lago di Garda', 'a Verona e provincia').replace('Verona e lago di Garda', 'Verona e provincia'), s)
        s = re.sub(r'(<meta property="og:title" content=")[^"]*', lambda m: m.group(1) + re.search(r'<title>(.*?)</title>', s).group(1), s, count=1)
    # Sirmione is Brescia: drop from landing FAQ/keywords
    s = s.replace(', Malcesine, Sirmione. Non Desenzano e non Salò.', ', Malcesine. Sirmione, Desenzano e Salò sono in provincia di Brescia.')
    s = s.replace(', idraulico sirmione', '')
    # ---- internal linking + facts (GEO)
    main_end = s.find('<section class="contact2"')
    if main_end < 0: main_end = s.find('</main>')
    faq_pos = s.find('<section class="section section-alt"><div class="container container-narrow">')
    insert_at = faq_pos if 0 < faq_pos < main_end else main_end
    # t40u: no visible 'In breve' / info blocks (facts stay in JSON-LD + llms.txt); breadcrumbs only in JSON-LD
    if kind(f) == 'town': s = town_stat(f, s)
    # ---- robots meta
    if not indexable(f):
        s = re.sub(r'<meta name="robots" content="[^"]*">', '<meta name="robots" content="noindex, follow">', s, count=1)
    # ---- JSON-LD rebuild
    lds = re.findall(r'<script type="application/ld\+json">(.*?)</script>', s, re.S)
    old_nodes = []
    for j in lds:
        d = json.loads(j); old_nodes += d.get('@graph', [d])
    s = re.sub(r'\s*<script type="application/ld\+json">.*?</script>', '', s, flags=re.S)
    if k != 'legal':
        s = s.replace('</head>', '  ' + build_ld(f, s, old_nodes) + '\n</head>', 1)
    # ---- footer: cookie preferences link
    s = s.replace('<a href="../cookie-policy.html">Cookie Policy</a>', '<a href="/cookie-policy.html">Cookie Policy</a>\n      <button type="button" class="btn-cc-prefs" data-cc-open>Preferenze cookie</button>')
    s = s.replace('<a href="cookie-policy.html">Cookie Policy</a>\n    </div>', '<a href="cookie-policy.html">Cookie Policy</a>\n      <button type="button" class="btn-cc-prefs" data-cc-open>Preferenze cookie</button>\n    </div>')
    # ---- body scripts: replace inline UI/consent scripts + old tracking with one deferred bundle
    s = re.sub(r'<script>\(function \(\) \{\s*var hbg = document\.getElementById\(\'hbg2\'\);.*?</script>\s*', '', s, flags=re.S)
    s = re.sub(r'<script>\s*function gala400UpdateConsent\(.*?</script>\s*', '', s, flags=re.S)
    s = re.sub(r'<script>\s*\(function\(\)\{\s*function on\(\)\{var t=document\.querySelector\(\'\.ticker\'\).*?</script>\s*', '', s, flags=re.S)
    s = re.sub(r'<script defer src="(?:\.\./)?js/gala400-tracking\.js"></script>\s*', '', s)
    s = re.sub(r'<script (?:defer )?src="(?:\.\./)?js/site-ui\.js"></script>\s*', '', s)
    assert '<script>' not in s.split('</head>', 1)[1], (f, 'leftover inline body script')
    s = s.replace('</body>', f'<script defer src="{core_href}"></script>\n</body>', 1)
    if k == 'hub':  # pre-existing bug: relative 'quartieri/x.html' from /quartieri/ resolved to /quartieri/quartieri/x.html
        s = re.sub(r'href="(servizi|quartieri|marche)/', r'href="/\1/', s)
        s = re.sub(r'(https://gala400\.it/(?:servizi|quartieri|marche))(")', r'\1/\2', s)
    # ---- links to redirecting index.html
    s = re.sub(r'href="((?:\.\./)?(?:servizi|quartieri|marche))/index\.html"', r'href="/\1/"', s).replace('href="/../', 'href="/')
    return s

def service_title(f, t):
    if f == 'index.html': return 'Idraulico Verona e provincia – Pronto intervento | ' + PHONE
    base = SERVICE_NAMES.get(os.path.basename(f)[:-5]) or h1_text_from_title(t)
    return base + ' – Verona e provincia | ' + PHONE

def h1_text_from_title(t):
    t = re.split(r'\s[|☎]\s?', t)[0]
    t = re.sub(r'\s*(?:a |di )?Verona\b.*$', '', t).strip(' —-')
    return t

def gas_page(f, s):
    is_em = 'emergenza' in f
    h1 = 'Odore di gas in casa: cosa fare' if is_em else 'Sospetta perdita di gas: cosa fare'
    s = re.sub(r'<title>.*?</title>', f'<title>{h1} | {BRAND}</title>', s, count=1)
    s = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="Indicazioni di sicurezza: in caso di odore di gas chiama il 112 o il pronto intervento del distributore indicato in bolletta. {BRAND} non offre un servizio di emergenza gas' + ('.' if is_em else ' né ricerca perdite gas.') + '">', s, count=1)
    s = re.sub(r'(<meta property="og:title" content=")[^"]*', r'\g<1>' + h1, s, count=1)
    s = re.sub(r'(<meta property="og:description" content=")[^"]*', r'\g<1>In caso di odore di gas chiama il 112 o il distributore.', s, count=1)
    s = re.sub(r'<meta name="keywords" content="[^"]*">\s*', '', s, count=1)
    # hero
    s = re.sub(r'<h1 class="hero2-h1">.*?</h1>', f'<h1 class="hero2-h1">{h1}</h1>', s, count=1, flags=re.S)
    s = re.sub(r'<p class="hero2-tagline">.*?</p>', '<p class="hero2-tagline">Pagina informativa di sicurezza.</p>\n      ' + GAS_SAFETY, s, count=1, flags=re.S)
    s = re.sub(r'(<div class="hero2-badge"><span class="live-dot" aria-hidden="true"></span>)[^<]*', r'\1Informazioni di sicurezza', s, count=1)
    s = re.sub(r'<div class="hero2-btns">.*?</div>\s*</div>\s*<div class="hero2-contact">.*?</div>\s*</div>\s*</section>',
               '<div class="hero2-btns"><a href="tel:112" class="hbtn hbtn-solid" data-cta="gas-112">Emergenza: chiama il 112</a></div>\n    </div>\n  </div>\n</section>', s, count=1, flags=re.S)
    # main content after hero: keep only safety + links to plumbing services
    hero_end = s.find('</section>', s.find('<section class="hero2"')) + 10
    main_end = s.find('</main>')
    body = f"""
<section class="sec2">
  <div class="lbl2">Sicurezza</div>
  <h2>Cosa fare se senti odore di gas.</h2>
  <ol class="chk-list" style="margin-top:1.2rem;max-width:42rem;padding-left:1.2rem">
    <li>Non accendere né spegnere luci, elettrodomestici o interruttori; non usare fiamme o accendini.</li>
    <li>Apri porte e finestre per arieggiare.</li>
    <li>Se puoi farlo in sicurezza, chiudi il rubinetto generale del gas (vicino al contatore).</li>
    <li>Esci dall’abitazione e telefona da fuori: <a href="tel:112">112</a> oppure il pronto intervento gas del distributore (numero verde in bolletta).</li>
    <li>Non rientrare finché i tecnici del distributore o i Vigili del Fuoco non hanno messo in sicurezza l’impianto.</li>
  </ol>
  <p style="margin-top:1rem;max-width:42rem">{BRAND} è un’impresa idraulica: <strong>non gestiamo emergenze gas</strong>. Per problemi idraulici (perdite d’acqua, scarichi, caldaie, scaldabagni) chiama {PHONE}, {HLP}.</p>
  <p style="margin-top:1rem"><a class="link-more" href="/servizi/riparazione-caldaia-verona.html">Riparazione caldaia →</a> · <a class="link-more" href="/servizi/pronto-intervento-idraulico-verona.html">Pronto intervento idraulico →</a></p>
</section>
"""
    s = s[:hero_end] + body + s[main_end:]
    return s

# ---------------------------------------------------------------- legal pages
def legal_extra(f, s, core_href):
    s = s.replace('| Gala 400 Srls — Idraulico Verona</title>', '| Gala400 — Idraulico Verona</title>')
    sticky = f'<div class="sticky-mobile-lite"><a href="tel:+393494208551" data-cta="sticky-call">Chiama {PHONE}</a></div>'
    css = '.sticky-mobile-lite{position:fixed;left:0;right:0;bottom:0;padding:.6rem;background:#fff;border-top:1px solid #e2e8f0}.sticky-mobile-lite a{display:block;text-align:center;background:#1259b0;color:#fff;font-weight:700;padding:.8rem;border-radius:10px;text-decoration:none}@media(min-width:681px){.sticky-mobile-lite{display:none}}body{padding-bottom:5rem}.btn-cc-prefs{background:none;border:0;color:#1259b0;text-decoration:underline;cursor:pointer;font:inherit;padding:0}'
    s = s.replace('</style>', css + '\n</style>', 1)
    s = s.replace('</body>', sticky + '\n</body>', 1)
    if f == 'privacy-policy.html':
        s = s.replace('<h2>8. Comunicazione a terzi</h2>', """<h2>7-bis. Misurazione delle chiamate (Google Ads)</h2>
  <p>Quando arrivi su questo sito da un annuncio Google, il numero di telefono mostrato può essere sostituito da un <strong>numero di inoltro Google</strong> che inoltra la chiamata al nostro numero 349 420 8551. Google registra data e ora, durata, esito (risposta/persa) e prefisso del chiamante, per misurare le chiamate generate dagli annunci. Il contenuto della chiamata non viene registrato. In assenza di consenso ai cookie pubblicitari, Google Consent Mode può inviare segnali anonimi senza cookie.</p>

  <h2>8. Comunicazione a terzi</h2>""")
        s = s.replace('dati di navigazione (indirizzo IP, tipo di browser, pagine visitate), raccolti solo se l\'utente presta consenso ai cookie di analisi;',
                      'dati di navigazione (indirizzo IP, tipo di browser, pagine visitate): con il consenso ai cookie di analisi tramite Google Analytics; senza consenso solo segnali anonimi senza cookie (Consent Mode avanzato);')
        s = s.replace('vengono attivati solo dopo che l\'utente presta consenso esplicito tramite il banner cookie.',
                      'vengono attivati solo dopo che l\'utente presta consenso esplicito tramite il banner cookie. Senza consenso, i tag Google possono inviare segnali anonimi senza cookie (cookieless ping) usati da Google in forma aggregata.')
        s = s.replace('dal link "Preferenze cookie" in fondo al sito', 'dal pulsante "Preferenze cookie" in fondo a ogni pagina')
    s = s.replace('</body>', f'<script defer src="https://cdn.jsdelivr.net/gh/orestbida/cookieconsent@3.0.1/dist/cookieconsent.umd.js"></script>\n<script defer src="{core_href}"></script>\n</body>', 1) if 'cookieconsent.umd.js' not in s else s.replace('</body>', f'<script defer src="{core_href}"></script>\n</body>', 1)
    s = re.sub(r'<p style="margin-top:2rem">(.*?)</p>', r'<p style="margin-top:2rem">\1 · <button type="button" class="btn-cc-prefs" data-cc-open>Preferenze cookie</button></p>', s, count=1, flags=re.S)
    return s

# ---------------------------------------------------------------- main
def main():
    files = sorted(glob.glob('*.html') + glob.glob('*/*.html'))
    src = {f: open(f, encoding='utf-8').read() for f in files}
    make_images(src['index.html'])
    extra = open('css/gala-extra.css', encoding='utf-8').read()
    # CSS variants -> hashed external files
    variants = {}
    for f in files:
        if kind(f) == 'legal': continue
        css = re.search(r'<style>(.*?)</style>', src[f], re.S).group(1)
        variants.setdefault(css, []).append(f)
    names = {}
    for css, fl in variants.items():
        nm = 'gala-home' if 'index.html' in fl else 'gala-hub' if any(x.endswith('/index.html') for x in fl) else 'gala-landing' if 'servizi/pronto-intervento-idraulico-verona.html' in fl else 'gala-main'
        names[css] = write_hashed(nm, 'css', css.strip() + '\n' + extra)
    core = '\n'.join(open(p, encoding='utf-8').read() for p in ('js/src/gala-config.js', 'js/src/gala-city-data.js', 'js/src/gala-core.js'))
    core_href = write_hashed('gala-core', 'js', core)
    for f in files:
        s = src[f]
        if kind(f) == 'legal':
            s, n = OLD_HEAD_RE.subn(HEAD_TRACK, s); assert n == 1, f
            s = legal_extra(f, s, core_href)
        else:
            css = re.search(r'<style>(.*?)</style>', s, re.S).group(1)
            s = transform(f, s, names[css], core_href)
        open(f, 'w', encoding='utf-8').write(s)
    # old JS no longer referenced
    for old in ('js/gala400-tracking.js', 'js/site-ui.js'):
        if os.path.exists(old): os.remove(old)
    write_sitemap(files)
    write_robots(); write_llms(files)
    print('\n'.join(LOG)); print('pages', len(files), 'css', sorted(set(names.values())), 'core', core_href)

def write_sitemap(files):
    pri = lambda f: '1.0' if f == 'index.html' else '0.9' if kind(f) == 'service' else '0.7' if kind(f) in ('town', 'hub') else '0.5'
    rows = [f'  <url><loc>{url_of(f)}</loc><lastmod>{TODAY}</lastmod><priority>{pri(f)}</priority></url>' for f in files if indexable(f)]
    open('sitemap.xml', 'w', encoding='utf-8').write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + '\n'.join(rows) + '\n</urlset>\n')
    LOG.append(f'sitemap: {len(rows)} URLs')

def write_robots():
    bots = ['Googlebot', 'Bingbot', 'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'Google-Extended', 'ClaudeBot']
    out = ''.join(f'User-agent: {b}\nAllow: /\n\n' for b in bots) + 'User-agent: *\nAllow: /\n\nSitemap: https://gala400.it/sitemap.xml\n'
    open('robots.txt', 'w').write(out)

def write_llms(files):
    def t(f):
        s = open(f, encoding='utf-8').read(); return html.unescape(re.search(r'<title>(.*?)</title>', s).group(1))
    svc = [f for f in files if kind(f) == 'service']
    towns = [f for f in files if kind(f) == 'town' and indexable(f) and not f.endswith('index.html')]
    L = [f'# {BRAND}', '',
         f'> {BRAND} (P.IVA 05180000233) è un’impresa idraulica di Verona: pronto intervento idraulico, spurgo e autospurgo, perdite d’acqua, scarichi e WC intasati, caldaie (riparazione, manutenzione, installazione) e scaldabagni a Verona e in tutti i comuni della provincia di Verona.', '',
         f'- Telefono: {PHONE} (+39 349 420 8551), risponde direttamente il tecnico, nessun centralino',
         f'- Orari: {HL} (08:00–24:00)',
         f'- Zona: Verona città e provincia di Verona (Veneto, Italia); attività senza sede aperta al pubblico',
         f'- Costi: {COSTO}',
         '- Non offre un servizio di emergenza gas: per odore di gas chiamare il 112 o il distributore.',
         '- Caldaie: tecnico indipendente, non centro assistenza autorizzato di alcun marchio.', '',
         '## Pagine principali', f'- [Home]({SITE}/): panoramica dei servizi e contatti', f'- [Tutti i servizi]({SITE}/servizi/)']
    L += [f'- [{t(f).split("|")[0].strip()}]({url_of(f)})' for f in svc]
    L += ['', '## Zone', f'- [Tutte le zone]({SITE}/quartieri/)'] + [f'- [{t(f).split("|")[0].strip()}]({url_of(f)})' for f in towns]
    L += ['', '## Informazioni legali', f'- [Privacy Policy]({SITE}/privacy-policy.html)', f'- [Cookie Policy]({SITE}/cookie-policy.html)', '']
    open('llms.txt', 'w', encoding='utf-8').write('\n'.join(L))

if __name__ == '__main__':
    main()
