import fs from 'fs';
import path from 'path';

const ROOT = path.resolve('..');
const dirs = ['servizi', 'quartieri', 'marche'];
let n = 0;

for (const d of dirs) {
  for (const f of fs.readdirSync(path.join(ROOT, d)).filter((x) => x.endsWith('.html'))) {
    const fp = path.join(ROOT, d, f);
    let h = fs.readFileSync(fp, 'utf8');
    if (/hreflang="it-IT"/i.test(h)) continue;
    const m = h.match(/rel="canonical"\s+href="([^"]+)"/i);
    if (!m) continue;
    h = h.replace(
      /(<link rel="canonical"\s+href="[^"]+">)/i,
      `$1\n  <link rel="alternate" hreflang="it-IT" href="${m[1]}">`
    );
    fs.writeFileSync(fp, h);
    n++;
  }
}
console.log('Added hreflang to', n, 'files');
