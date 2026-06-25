const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const MONGODB_DB = process.env.MONGODB_DB || 'utp_matriculas';
const COLLECTION = 'matriculas';

let client;
let db;

async function connectMongo() {
  if (db) return db;

  const { MongoClient } = require('mongodb');
  client = new MongoClient(MONGODB_URI);
  await client.connect();
  db = client.db(MONGODB_DB);

  const collection = db.collection(COLLECTION);
  await collection.createIndex({ codigoAlumno: 1 }, { unique: true });
  await collection.createIndex({ ciclo: 1 });
  await collection.createIndex({ estadoPago: 1 });

  return db;
}

function getCollection() {
  if (!db) {
    throw new Error('MongoDB no conectado. Llama a connectMongo() primero.');
  }
  return db.collection(COLLECTION);
}

async function closeMongo() {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}

module.exports = {
  MONGODB_URI,
  MONGODB_DB,
  COLLECTION,
  connectMongo,
  getCollection,
  closeMongo,
};
