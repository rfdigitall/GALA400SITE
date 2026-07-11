import fs from 'fs';
import path from 'path';

const OLD = 'c:/Users/utente/Desktop/SITE URI OFICIALE/GALA400SITE';
const NEW = 'c:/Users/utente/Desktop/SITE URI OFICIALE/Gala400_V2/gala400-site';

function listHtml(dir, p = '') {
  const out = [];
  for (const e of fs.readdirSync(path.join(dir, p), { withFileTypes: true })) {
    const rel = path.join(p, e.name).replace(/\\/g, '/');
    if (e.isDirectory()) out.push(...listHtml(dir, rel));
    else if (e.name.endsWith('.html') && !['index.html', 'privacy-policy.html', 'cookie-policy.html'].includes(rel))
      out.push(rel);
  }
  return out.sort();
}

function meta(file, dir) {
  const h = fs.readFileSync(path.join(dir, file), 'utf8');
  const pick = (re) => (h.match(re) || [])[1] || '';
  return {
    t: pick(/<title>([^<]*)<\/title>/i),
    d: pick(/name="description"\s+content="([^"]*)"/i),
    c: pick(/rel="canonical"\s+href="([^"]*)"/i),
    hreflang: pick(/hreflang="it-IT"\s+href="([^"]*)"/i),
    h1: pick(/<h1[^>]*>([\s\S]*?)<\/h1>/i).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(),
    robots: pick(/name="robots"\s+content="([^"]*)"/i),
    hasHreflang: /hreflang="it-IT"/i.test(h),
  };
}

const sections = ['servizi/', 'quartieri/', 'marche/'];
const oldF = listHtml(OLD).filter((f) => sections.some((s) => f.startsWith(s)));
const newF = listHtml(NEW).filter((f) => sections.some((s) => f.startsWith(s)));

console.log('URL parity:', oldF.length, 'old vs', newF.length, 'new');
console.log('Missing in new:', oldF.filter((f) => !newF.includes(f)));
console.log('Extra in new:', newF.filter((f) => !oldF.includes(f)));

const diffs = { canon: [], title: [], h1: [], desc: [], noHreflang: [] };
for (const f of oldF) {
  if (!newF.includes(f)) continue;
  const o = meta(f, OLD);
  const n = meta(f, NEW);
  if (o.c !== n.c) diffs.canon.push({ f, o: o.c, n: n.c });
  if (o.t !== n.t) diffs.title.push(f);
  if (o.h1 !== n.h1) diffs.h1.push({ f, o: o.h1, n: n.h1 });
  if (o.d !== n.d) diffs.desc.push(f);
  if (!n.hasHreflang) diffs.noHreflang.push(f);
}

console.log('\nCanonical mismatches:', diffs.canon.length);
diffs.canon.slice(0, 3).forEach((x) => console.log(' ', x.f, x.o, '->', x.n));
console.log('Title mismatches:', diffs.title.length, diffs.title.slice(0, 5));
console.log('H1 mismatches:', diffs.h1.length);
diffs.h1.slice(0, 5).forEach((x) => console.log(' ', x.f, '|', x.o, '->', x.n));
console.log('Desc mismatches:', diffs.desc.length);
console.log('Missing hreflang on new:', diffs.noHreflang.length);
