// Gala400 — first-party anonymous tap log (write). RF DIGITAL internal statistics.
// Stores NO IP, NO cookies, NO fingerprint: only time, page path, button, ad-visit flag, device class, referrer domain.
import { getStore } from '@netlify/blobs';

const ALLOWED = new Set(['gala400.it', 'www.gala400.it']);
const MAX_BODY = 1024;
const PER_IP_MIN = 20;      // per client per minute (IP kept only in memory, hashed, never stored)
const GLOBAL_MIN = 300;     // per function instance per minute
const GLOBAL_MIN_ALL = 120; // whole site per minute (a real plumber site never gets near this)
const hits = new Map();
let gMin = 0, gCount = 0;

const clip = (v, n, re) => (typeof v === 'string' ? v.slice(0, n).replace(re || /[^\w\-\/.%~]/g, '') : '');
const romeParts = (d) => {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Rome', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).formatToParts(d).map((x) => [x.type, x.value]));
  return { day: `${p.year}-${p.month}-${p.day}`, time: `${p.hour}:${p.minute}:${p.second}` };
};
const hostOf = (u) => { try { return new URL(u).hostname.toLowerCase(); } catch { return ''; } };
const allowedHost = (h) => ALLOWED.has(h) || (process.env.TAPLOG_DEV === '1' && (h === 'localhost' || h === '127.0.0.1'));
const ok = () => new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });

function limited(req, context) {
  const now = Math.floor(Date.now() / 60000);
  if (now !== gMin) { gMin = now; gCount = 0; hits.clear(); }
  if (++gCount > GLOBAL_MIN) return true;
  const ip = (context && context.ip) || req.headers.get('x-nf-client-connection-ip') || 'x';
  let h = 0; for (let i = 0; i < ip.length; i++) h = (h * 31 + ip.charCodeAt(i)) | 0;  // in-memory only
  const n = (hits.get(h) || 0) + 1; hits.set(h, n);
  return n > PER_IP_MIN;
}

export default async (req, context) => {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } });
  const origin = hostOf(req.headers.get('origin') || '') || hostOf(req.headers.get('referer') || '');
  if (!allowedHost(origin)) return new Response('Forbidden', { status: 403 });
  if (Number(req.headers.get('content-length') || 0) > MAX_BODY) return new Response('Too Large', { status: 413 });
  if (limited(req, context)) return new Response('Too Many Requests', { status: 429 });
  const store = getStore('taplog');
  try {  // soft global cap shared by all instances (counter per minute, auto-pruned keys under rl/)
    const mk = 'rl/' + Math.floor(Date.now() / 60000);
    const n = Number((await store.get(mk)) || 0) + 1;
    if (n > GLOBAL_MIN_ALL) return new Response('Too Many Requests', { status: 429 });
    await store.set(mk, String(n));
    if (n === 1) store.delete('rl/' + (Math.floor(Date.now() / 60000) - 2)).catch(() => {});
  } catch (e) {}
  let raw;
  try { raw = await req.text(); } catch { return new Response('Bad Request', { status: 400 }); }
  if (raw.length > MAX_BODY) return new Response('Too Large', { status: 413 });
  let b; try { b = JSON.parse(raw); } catch { return new Response('Bad Request', { status: 400 }); }
  if (!b || typeof b !== 'object' || Array.isArray(b)) return new Response('Bad Request', { status: 400 });

  const BTN = ['header', 'hero', 'sticky', 'float', 'form', 'other'];
  const DEV = ['mobile', 'tablet', 'desktop'];
  const now = new Date(), r = romeParts(now);
  const ev = {
    ts: now.toISOString(),
    day: r.day,
    time_rome: r.time,
    path: clip(b.path, 160) || '/',
    btn: BTN.includes(b.btn) ? b.btn : 'other',
    cta: clip(b.cta, 40, /[^a-z0-9\-_]/gi),
    num: clip(b.num, 16, /[^\d+]/g),
    ads: b.ads === true,
    ads_id: ['gclid', 'gbraid', 'wbraid'].includes(b.ads_id) ? b.ads_id : '',
    campaign: clip(b.campaign, 60, /[^\w\-. ]/g),
    landing: clip(b.landing, 160),
    dev: DEV.includes(b.dev) ? b.dev : 'mobile',
    ref: clip(b.ref, 80, /[^a-z0-9.\-]/gi).toLowerCase(),
    test: b.test === true,
  };
  const key = `${ev.day}/${r.time.replace(/:/g, '')}-${now.getMilliseconds().toString().padStart(3, '0')}-${Math.random().toString(36).slice(2, 8)}${ev.test ? '-test' : ''}`;
  try { await store.setJSON(key, ev); } catch (e) { console.error('taplog store error', String(e).slice(0, 200)); }
  return ok();
};

export const config = { path: '/api/ev' };
