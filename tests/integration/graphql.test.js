const { ApolloServer } = require('@apollo/server');
const { connectMongo, closeMongo, getCollection } = require('../../src/db');
const { typeDefs } = require('../../src/schema');
const { resolvers } = require('../../src/resolvers');
const { generarMatricula } = require('../../src/generador');

describe('GraphQL integración', () => {
  let server;

  beforeAll(async () => {
    await connectMongo();
    await getCollection().deleteMany({});
    await getCollection().insertMany([generarMatricula(1), generarMatricula(2)]);

    server = new ApolloServer({ typeDefs, resolvers });
    await server.start();
  });

  afterAll(async () => {
    await server.stop();
    await closeMongo();
  });

  test('health responde OK', async () => {
    const res = await server.executeOperation({ query: '{ health }' });
    expect(res.body.singleResult.errors).toBeUndefined();
    expect(res.body.singleResult.data.health).toContain('UTP Matrículas API');
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

    expect(res.body.singleResult.errors).toBeUndefined();
    expect(res.body.singleResult.data.consultarPagoMatricula.codigoAlumno).toBe('UTP000001');
  });

  test('estadisticasMatriculas retorna totales', async () => {
    const res = await server.executeOperation({
      query: '{ estadisticasMatriculas { totalAlumnos } }',
    });

    expect(res.body.singleResult.errors).toBeUndefined();
    expect(res.body.singleResult.data.estadisticasMatriculas.totalAlumnos).toBe(2);
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

    expect(res.body.singleResult.errors).toBeUndefined();
    expect(res.body.singleResult.data.generarMatriculas.insertados).toBe(3);
    expect(res.body.singleResult.data.generarMatriculas.totalEnBD).toBe(5);
  });
});
