const {
  connectMongo,
  closeMongo,
  getCollection,
  MONGODB_URI,
  MONGODB_DB,
} = require('../src/db');
const { generarMatriculas } = require('../src/generador');

const TOTAL_ALUMNOS = Number(process.env.SEED_COUNT || 500);
const FORCE_SEED = process.env.FORCE_SEED === 'true';

async function seed() {
  await connectMongo();
  const collection = getCollection();
  const existentes = await collection.countDocuments();

  if (existentes > 0 && !FORCE_SEED) {
    console.log(
      `✓ MongoDB ya tiene ${existentes} matrículas en ${MONGODB_DB}.matriculas (usa FORCE_SEED=true para regenerar)`
    );
    await closeMongo();
    return;
  }

  if (FORCE_SEED && existentes > 0) {
    await collection.deleteMany({});
    console.log('↻ Colección matriculas vaciada (FORCE_SEED=true)');
  }

  const matriculas = generarMatriculas(TOTAL_ALUMNOS);
  await collection.insertMany(matriculas);

  console.log(
    `✓ ${matriculas.length} matrículas UTP insertadas en MongoDB (${MONGODB_URI}/${MONGODB_DB})`
  );
  await closeMongo();
}

seed().catch(async (err) => {
  console.error('Error al hacer seed en MongoDB:', err.message);
  await closeMongo();
  process.exit(1);
});
