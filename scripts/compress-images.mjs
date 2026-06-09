import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname } from 'path';

const MEDIA_DIR = './public/media';
const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 80;
const PNG_QUALITY = 80;

const SUPPORTED = new Set(['.jpg', '.jpeg', '.png']);

async function compress(filePath) {
  const ext = extname(filePath).toLowerCase();
  if (!SUPPORTED.has(ext)) return null;

  const before = (await stat(filePath)).size;

  const image = sharp(filePath).resize(MAX_DIMENSION, MAX_DIMENSION, {
    fit: 'inside',
    withoutEnlargement: true,
  });

  let output;
  if (ext === '.png') {
    output = image.png({ quality: PNG_QUALITY, compressionLevel: 8 });
  } else {
    output = image.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
  }

  const buffer = await output.toBuffer();
  await import('fs').then(fs => fs.promises.writeFile(filePath, buffer));

  const after = buffer.length;
  const saved = ((1 - after / before) * 100).toFixed(1);
  return { before, after, saved };
}

const files = await readdir(MEDIA_DIR);
let totalBefore = 0;
let totalAfter = 0;

for (const file of files) {
  const filePath = join(MEDIA_DIR, file);
  const result = await compress(filePath);
  if (!result) continue;

  totalBefore += result.before;
  totalAfter += result.after;

  const beforeKB = (result.before / 1024).toFixed(0);
  const afterKB = (result.after / 1024).toFixed(0);
  console.log(`${file}: ${beforeKB}KB → ${afterKB}KB (−${result.saved}%)`);
}

const totalSavedMB = ((totalBefore - totalAfter) / 1024 / 1024).toFixed(1);
const totalBeforeMB = (totalBefore / 1024 / 1024).toFixed(1);
const totalAfterMB = (totalAfter / 1024 / 1024).toFixed(1);
console.log(`\nTotal: ${totalBeforeMB}MB → ${totalAfterMB}MB (saved ${totalSavedMB}MB)`);
