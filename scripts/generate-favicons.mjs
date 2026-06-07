/**
 * Generează PNG + ICO pentru Google Search (min. 48×48)
 * npm run icons
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SVG = path.join(ROOT, 'assets', 'favicon.svg');

async function main() {
  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch {
    console.warn('Rulează: npm install sharp --save-dev');
    process.exit(1);
  }

  const svg = fs.readFileSync(SVG);
  const sizes = [
    { file: 'assets/favicon-48.png', size: 48 },
    { file: 'assets/favicon-96.png', size: 96 },
    { file: 'assets/favicon-192.png', size: 192 },
    { file: 'assets/apple-touch-icon.png', size: 180 },
    { file: 'favicon.png', size: 48 },
  ];

  for (const { file, size } of sizes) {
    const out = path.join(ROOT, file);
    await sharp(svg).resize(size, size).png().toFile(out);
    console.log(`  ${file} (${size}×${size})`);
  }

  await sharp(svg).resize(32, 32).png().toFile(path.join(ROOT, 'favicon.ico'));
  console.log('  favicon.ico (32×32 PNG format)');

  console.log('\nFavicon gata pentru Google Search (48px+).');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
