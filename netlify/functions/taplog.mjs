// Gala400 — tap log reader for RF DIGITAL. Protected by env TAPLOG_KEY (never in git).
// GET /api/taplog?key=KEY[&from=YYYY-MM-DD][&to=YYYY-MM-DD][&format=csv|json][&test=0|1|all]
// POST /api/taplog?key=KEY&purge=test[&from=..&to=..]  -> deletes test events only
import { getStore } from '@netlify/blobs';
import { timingSafeEqual, createHash } from 'node:crypto';

const COLS = ['day', 'time_rome', 'path', 'btn', 'cta', 'num', 'ads', 'ads_id', 'campaign', 'landing', 'dev', 'ref', 'test', 'ts'];
const H = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' };
const dig = (s) => createHash('sha256').update(String(s)).digest();
const romeDay = (d) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
const isDay = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s || '');
let fails = 0, failMin = 0;

function days(from, to) {
  const out = []; let d = new Date(from + 'T12:00:00Z'); const end = new Date(to + 'T12:00:00Z');
  while (d <= end && out.length < 93) { out.push(d.toISOString().slice(0, 10)); d = new Date(d.getTime() + 86400000); }
  return out;
}
const csvCell = (v) => { const s = String(v ?? ''); return /[",\n;]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };

export default async (req) => {
  const secret = process.env.TAPLOG_KEY || '';
  if (secret.length < 24) return new Response('Not configured', { status: 503, headers: H });
  const url = new URL(req.url);
  const auth = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  const given = url.searchParams.get('key') || auth;
  const m = Math.floor(Date.now() / 60000); if (m !== failMin) { failMin = m; fails = 0; }
  if (fails > 30) return new Response('Too Many Requests', { status: 429, headers: H });
  if (!given || !timingSafeEqual(dig(given), dig(secret))) { fails++; return new Response('Unauthorized', { status: 401, headers: H }); }

  const today = romeDay(new Date());
  const from = isDay(url.searchParams.get('from')) ? url.searchParams.get('from') : today;
  const to = isDay(url.searchParams.get('to')) ? url.searchParams.get('to') : from;
  const store = getStore('taplog');

  if (req.method === 'POST' && url.searchParams.get('purge') === 'test') {
    let n = 0;
    for (const d of days(from, to)) {
      const { blobs } = await store.list({ prefix: d + '/' });
      for (const b of blobs) if (b.key.endsWith('-test')) { await store.delete(b.key); n++; }
    }
    return Response.json({ deleted_test_events: n, from, to }, { headers: H });
  }
  if (req.method !== 'GET') return new Response('Method Not Allowed', { status: 405, headers: H });

  const want = url.searchParams.get('test') || '0';
  const rows = [];
  for (const d of days(from, to)) {
    const { blobs } = await store.list({ prefix: d + '/' });
    const keys = blobs.map((b) => b.key).filter((k) => want === 'all' || (want === '1') === k.endsWith('-test')).sort();
    for (let i = 0; i < keys.length; i += 50) {
      const part = await Promise.all(keys.slice(i, i + 50).map((k) => store.get(k, { type: 'json' }).catch(() => null)));
      part.forEach((e) => e && rows.push(e));
    }
  }
  if ((url.searchParams.get('format') || 'json') === 'csv') {
    const body = [COLS.join(';')].concat(rows.map((e) => COLS.map((c) => csvCell(e[c])).join(';'))).join('\n') + '\n';
    return new Response('\ufeff' + body, { headers: { ...H, 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `inline; filename="gala400-taplog-${from}_${to}.csv"` } });
  }
  const summary = { total: rows.length, from_ads: rows.filter((e) => e.ads).length, by_btn: {}, by_day: {} };
  rows.forEach((e) => { summary.by_btn[e.btn] = (summary.by_btn[e.btn] || 0) + 1; summary.by_day[e.day] = (summary.by_day[e.day] || 0) + 1; });
  return Response.json({ from, to, summary, events: rows }, { headers: H });
};

export const config = { path: '/api/taplog' };
