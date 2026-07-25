import { createInterface } from 'readline/promises';
import { rename, readFile, writeFile } from 'fs/promises';
import { execSync } from 'child_process';
import path from 'path';

const rl = createInterface({ input: process.stdin, output: process.stdout });
const ask = async (q) => (await rl.question(q)).trim();

function slugify(str) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

function getUntrackedImages() {
  return execSync('git status --short')
    .toString().split('\n')
    .filter(l => l.startsWith('??') && /public\/media\/.*\.(png|jpg|jpeg)$/i.test(l))
    .map(l => l.replace(/^\?\? /, '').trim());
}

function existingIds() {
  try {
    const content = execSync('grep -E \'^ {2}id:\' src/data/products.ts').toString();
    return content.split('\n').map(l => l.replace(/.*"(.*)".*/, '$1').trim()).filter(Boolean);
  } catch { return []; }
}

console.log('\n— Producto nuevo —\n');

const nombre = await ask('Nombre: ');
const suggestedId = slugify(nombre);
const idInput = await ask(`ID [${suggestedId}]: `);
const id = idInput || suggestedId;

if (existingIds().includes(id)) {
  console.error(`\nError: el id "${id}" ya existe en products.ts`);
  rl.close();
  process.exit(1);
}

const precio = await ask('Precio (ej. $1200): ');
const tamaño = await ask('Tamaño: ');
const materiales = await ask('Materiales: ');

const untracked = getUntrackedImages();
const images = [];

if (untracked.length === 0) {
  console.log('\nNo hay imágenes nuevas sin asignar.');
} else {
  console.log('\nImágenes disponibles:');
  untracked.forEach((f, i) => console.log(`  [${i + 1}] ${path.basename(f)}`));
  const sel = await ask('Elegí los números en orden (ej. 2 1 3), o Enter para omitir: ');

  if (sel) {
    const indices = sel.split(/\s+/)
      .map(n => parseInt(n) - 1)
      .filter(n => !isNaN(n) && n >= 0 && n < untracked.length);

    console.log('');
    for (let i = 0; i < indices.length; i++) {
      const src = untracked[indices[i]];
      const ext = path.extname(src);
      const dest = `public/media/${id}-${i + 1}${ext}`;
      await rename(src, dest);
      images.push(`/media/${id}-${i + 1}${ext}`);
      console.log(`  ${path.basename(src)} → ${path.basename(dest)}`);
    }
  }
}

const imagesStr = images.length
  ? `[\n${images.map(img => `      "${img}",`).join('\n')}\n    ]`
  : `[]`;

const entry = `  {
    id: "${id}",
    nombre: "${nombre}",
    precio: "${precio}",
    images: ${imagesStr},
    tamaño: "${tamaño}",
    materiales: "${materiales}",
  },`;

const productsPath = 'src/data/products.ts';
const content = await readFile(productsPath, 'utf8');
const updated = content.replace(
  /(export const productos: Producto\[\] = \[)/,
  `$1\n${entry}`
);
await writeFile(productsPath, updated);

console.log(`\n✓ "${nombre}" agregado a products.ts`);
console.log(`  Revisá el archivo, luego: git add . && git commit -m "add ${id}"`);
console.log(`  (las imágenes se comprimen automáticamente al hacer commit)\n`);
rl.close();
