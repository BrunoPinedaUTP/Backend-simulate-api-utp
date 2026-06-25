const crypto = require('crypto');

function simularCargaCPU() {
  if (process.env.NODE_ENV === 'test' || process.env.CPU_LOAD_MS === '0') return;

  const baseMs = Number(process.env.CPU_LOAD_MS || 100);
  const ms = baseMs + Math.floor(Math.random() * 50);
  let data = `utp-matricula-${Date.now()}`;
  const fin = Date.now() + ms;

  while (Date.now() < fin) {
    for (let i = 0; i < 800; i += 1) {
      data = crypto.createHash('sha256').update(data).digest('hex');
    }
  }
}

module.exports = { simularCargaCPU };
