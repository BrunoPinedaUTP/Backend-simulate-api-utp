const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function listarJs(dir, archivos = []) {
  if (!fs.existsSync(dir)) return archivos;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      listarJs(full, archivos);
    } else if (entry.name.endsWith('.js')) {
      archivos.push(full);
    }
  }
  return archivos;
}

const carpetas = ['src', 'scripts'];
const archivos = carpetas.flatMap((c) => listarJs(path.join(ROOT, c)));

if (archivos.length === 0) {
  console.error('No se encontraron archivos .js para validar');
  process.exit(1);
}

for (const archivo of archivos) {
  require('child_process').execFileSync('node', ['--check', archivo], { stdio: 'inherit' });
  console.log(`✓ ${path.relative(ROOT, archivo)}`);
}

console.log(`\n✓ Sintaxis OK en ${archivos.length} archivos`);
