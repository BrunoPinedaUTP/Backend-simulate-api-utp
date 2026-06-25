const { ObjectId } = require('mongodb');
const { toGraphQL, buildFilter } = require('../../src/matriculas');

describe('matriculas helpers', () => {
  test('toGraphQL convierte _id a id string', () => {
    const id = new ObjectId();
    const result = toGraphQL({
      _id: id,
      codigoAlumno: 'UTP000001',
      nombre: 'Ana',
    });

    expect(result.id).toBe(id.toString());
    expect(result.codigoAlumno).toBe('UTP000001');
    expect(result._id).toBeUndefined();
  });

  test('toGraphQL retorna null si no hay documento', () => {
    expect(toGraphQL(null)).toBeNull();
  });

  test('buildFilter arma filtros opcionales', () => {
    expect(buildFilter({})).toEqual({});
    expect(buildFilter({ ciclo: '2025-I' })).toEqual({ ciclo: '2025-I' });
    expect(buildFilter({ estadoPago: 'PAGADO', ciclo: '2026-I' })).toEqual({
      estadoPago: 'PAGADO',
      ciclo: '2026-I',
    });
  });
});
