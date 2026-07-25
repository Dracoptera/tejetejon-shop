import sharp from 'sharp';
import { stat, writeFile } from 'fs/promises';
import { execSync } from 'child_process';

const staged = execSync('git diff --cached --name-only')
  .toString()
  .split('\n')
  .filter(f => /^public\/media\/.*\.(jpg|jpeg|png)$/i.test(f.trim()))
  .map(f => f.trim())
  .filter(Boolean);

if (!staged.length) process.exit(0);

const MAX = 1600;
const SKIP_BELOW_KB = 100;

console.log('Comprimiendo imágenes staged...');

for (const file of staged) {
  let before;
  try {
    before = (await stat(file)).size;
  } catch {
    continue; // archivo eliminado, ignorar
  }

  if (before < SKIP_BELOW_KB * 1024) {
    console.log(`  ${file}: ya es pequeño, omitido`);
    continue;
  }

  const ext = file.split('.').pop().toLowerCase();
  const img = sharp(file).resize(MAX, MAX, { fit: 'inside', withoutEnlargement: true });
  const buf = ext === 'png'
    ? await img.png({ quality: 80, compressionLevel: 8 }).toBuffer()
    : await img.jpeg({ quality: 80, mozjpeg: true }).toBuffer();

  await writeFile(file, buf);

  const saved = ((1 - buf.length / before) * 100).toFixed(1);
  console.log(`  ${file}: ${Math.round(before / 1024)}KB → ${Math.round(buf.length / 1024)}KB (−${saved}%)`);
}

execSync(`git add ${staged.map(f => `"${f}"`).join(' ')}`);
