const { MongoMemoryServer } = require('mongodb-memory-server');
const { connectMongo, closeMongo } = require('../../src/db');

let mongoServer;

async function esperar(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function conectarConReintentos(maxIntentos = 15) {
  let ultimoError;
  for (let intento = 1; intento <= maxIntentos; intento += 1) {
    try {
      await closeMongo();
      await connectMongo();
      return;
    } catch (err) {
      ultimoError = err;
      await closeMongo();
      await esperar(Math.min(intento * 1000, 5000));
    }
  }
  throw ultimoError;
}

async function conectarMongoTest() {
  process.env.MONGODB_DB = process.env.MONGODB_DB || 'utp_matriculas_test';

  const enCi = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';

  if (enCi && process.env.MONGODB_URI) {
    await conectarConReintentos();
    return;
  }

  mongoServer = await MongoMemoryServer.create({
    instance: {
      launchTimeout: 120000,
    },
  });

  process.env.MONGODB_URI = mongoServer.getUri();
  await conectarConReintentos();
}

async function desconectarMongoTest() {
  await closeMongo();
  if (mongoServer) {
    await mongoServer.stop();
    mongoServer = null;
  }
}

function getSingleResult(response) {
  if (response.body.kind !== 'single') {
    throw new Error(`Respuesta GraphQL inesperada: ${response.body.kind}`);
  }
  return response.body.singleResult;
}

module.exports = {
  conectarMongoTest,
  desconectarMongoTest,
  getSingleResult,
};
