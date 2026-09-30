import fs from 'node:fs';
import assert from 'node:assert/strict';
import sharp from 'sharp';
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const products = read('src/data/hanatour-products.json');
const curation = read('data/imports/hanatour-photo-curation-2026-09-30.json');
const concepts = read('data/imports/destination-images-2026-09-30.json');
const conceptPaths = new Set(concepts.map(x => x.output));
assert.equal(concepts.length, 13);
for (const c of concepts) {
  const m = await sharp(`public${c.output}`).metadata();
  assert(m.width >= 1536 && m.height >= 1024, c.slug);
  assert(c.generated && c.prompt, c.slug);
}
let count = 0;
const limited = [];
for (const p of products) {
  const photos = curation[p.slug].photos;
  assert(!conceptPaths.has(p.thumb), `Generated product thumbnail: ${p.slug}`);
  assert(p.photoPending || ['course', 'clubhouse'].includes(photos[0]?.subject), `Wrong primary photo: ${p.slug}`);
  for (const photo of photos) {
    const m = await sharp(`public${photo.path}`).metadata();
    assert(m.width <= photo.sourceWidth && m.height <= photo.sourceHeight, `Upscaled: ${p.slug}`);
    assert(['course', 'clubhouse', 'hotel', 'facility'].includes(photo.subject), `Wrong photo subject: ${p.slug}`);
    assert(!conceptPaths.has(photo.path), `Generated gallery image: ${p.slug}`);
    count++;
  }
  if (!p.photoPending && photos.length && photos[0].sourceWidth < 800) limited.push(`${p.title}: ${photos[0].sourceWidth}px`);
}
console.log(`PASS: 13 labeled destination concepts; ${count} source-bound product photo placements; no upscaling`);
console.log('Native source size limitations:', limited);
