const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

const COPIAR = [
  'src',
  'scripts/seed.js',
  'scripts/validate-syntax.js',
  'ecosystem.config.cjs',
  'package.json',
  'package-lock.json',
];

function copiar(origen, destino) {
  const stat = fs.statSync(origen);
  if (stat.isDirectory()) {
    fs.mkdirSync(destino, { recursive: true });
    for (const entry of fs.readdirSync(origen)) {
      copiar(path.join(origen, entry), path.join(destino, entry));
    }
    return;
  }
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.copyFileSync(origen, destino);
}

if (fs.existsSync(DIST)) {
  fs.rmSync(DIST, { recursive: true, force: true });
}
fs.mkdirSync(DIST, { recursive: true });

for (const item of COPIAR) {
  const origen = path.join(ROOT, item);
  if (!fs.existsSync(origen)) {
    console.error(`No existe: ${item}`);
    process.exit(1);
  }
  copiar(origen, path.join(DIST, item));
}

console.log(`✓ Build producción en ${DIST}`);
