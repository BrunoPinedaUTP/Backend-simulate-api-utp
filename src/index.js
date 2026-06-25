const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { typeDefs } = require('./schema');
const { resolvers } = require('./resolvers');
const { connectMongo, MONGODB_URI, MONGODB_DB } = require('./db');
const { logger, workerId, workerName } = require('./logger');

const PORT = Number(process.env.PORT || 4000);

async function start() {
  await connectMongo();

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use((req, res, next) => {
    const startTime = Date.now();
    res.on('finish', () => {
      logger.info(
        {
          method: req.method,
          path: req.path,
          statusCode: res.statusCode,
          durationMs: Date.now() - startTime,
          workerId,
          workerName,
        },
        'request handled'
      );
    });
    res.setHeader('X-Worker-Id', workerId);
    res.setHeader('X-Worker-Name', workerName);
    res.setHeader('X-Worker-Pid', String(process.pid));
    next();
  });

  app.get('/worker-info', (_req, res) => {
    res.json({
      workerId,
      workerName,
      pid: process.pid,
      universidad: 'UTP - Universidad Tecnológica del Perú',
      servicio: 'Consulta de pagos de matrícula',
      database: MONGODB_DB,
      mongoUri: MONGODB_URI,
    });
  });

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async () => ({ workerId }),
    })
  );

  app.listen(PORT, () => {
    logger.info(
      { port: PORT, workerId, pid: process.pid, mongoUri: MONGODB_URI, db: MONGODB_DB },
      'GraphQL UTP Matrículas iniciado (MongoDB)'
    );
  });
}

start().catch((err) => {
  logger.error({ err }, 'Error al iniciar API');
  process.exit(1);
});
