const { ApolloServer } = require('@apollo/server');
const { getCollection } = require('../../src/db');
const { typeDefs } = require('../../src/schema');
const { resolvers } = require('../../src/resolvers');
const { generarMatricula } = require('../../src/generador');
const {
  conectarMongoTest,
  desconectarMongoTest,
  getSingleResult,
} = require('../helpers/mongo');

describe('GraphQL integración', () => {
  let server;

  beforeAll(async () => {
    await conectarMongoTest();
    await getCollection().deleteMany({});
    await getCollection().insertMany([generarMatricula(1), generarMatricula(2)]);

    server = new ApolloServer({ typeDefs, resolvers });
    await server.start();
  }, 60000);

  afterAll(async () => {
    if (server) {
      await server.stop();
    }
    await desconectarMongoTest();
  });

  test('health responde OK', async () => {
    const res = await server.executeOperation({ query: '{ health }' });
    const { data, errors } = getSingleResult(res);

    expect(errors).toBeUndefined();
    expect(data.health).toContain('UTP Matrículas API');
  });

  test('consultarPagoMatricula encuentra alumno', async () => {
    const res = await server.executeOperation({
      query: `
        query ($codigo: String!) {
          consultarPagoMatricula(codigoAlumno: $codigo) {
            codigoAlumno
            nombre
            total
          }
        }
      `,
      variables: { codigo: 'UTP000001' },
    });
    const { data, errors } = getSingleResult(res);

    expect(errors).toBeUndefined();
    expect(data.consultarPagoMatricula.codigoAlumno).toBe('UTP000001');
  });

  test('estadisticasMatriculas retorna totales', async () => {
    const res = await server.executeOperation({
      query: '{ estadisticasMatriculas { totalAlumnos } }',
    });
    const { data, errors } = getSingleResult(res);

    expect(errors).toBeUndefined();
    expect(data.estadisticasMatriculas.totalAlumnos).toBe(2);
  });

  test('generarMatriculas inserta registros', async () => {
    const res = await server.executeOperation({
      query: `
        mutation ($cantidad: Int!) {
          generarMatriculas(cantidad: $cantidad) {
            insertados
            totalEnBD
          }
        }
      `,
      variables: { cantidad: 3 },
    });
    const { data, errors } = getSingleResult(res);

    expect(errors).toBeUndefined();
    expect(data.generarMatriculas.insertados).toBe(3);
    expect(data.generarMatriculas.totalEnBD).toBe(5);
  });
});
