const { MongoMemoryServer } = require('mongodb-memory-server');
const { connectMongo, closeMongo } = require('../../src/db');

let mongoServer;

async function esperar(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function conectarMongoTest() {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();
  process.env.MONGODB_DB = 'utp_matriculas_test';

  let ultimoError;
  for (let intento = 1; intento <= 5; intento += 1) {
    try {
      await connectMongo();
      return;
    } catch (err) {
      ultimoError = err;
      await closeMongo();
      await esperar(intento * 500);
    }
  }
  throw ultimoError;
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
