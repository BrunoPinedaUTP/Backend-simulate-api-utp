const {
  calcularDescuento,
  generarMatricula,
  MONTO_BASE_MATRICULA,
} = require('../../src/generador');

describe('generador UTP', () => {
  test('calcularDescuento aplica reglas de mérito académico', () => {
    expect(calcularDescuento(18)).toBe(0.3);
    expect(calcularDescuento(16)).toBe(0.2);
    expect(calcularDescuento(14)).toBe(0.1);
    expect(calcularDescuento(11)).toBe(0);
  });

  test('generarMatricula incluye campos obligatorios', () => {
    const m = generarMatricula(1);

    expect(m.codigoAlumno).toBe('UTP000001');
    expect(m.nombre).toBeTruthy();
    expect(m.promedio).toBeGreaterThanOrEqual(10);
    expect(m.total).toBeLessThanOrEqual(MONTO_BASE_MATRICULA);
    expect(m.ciclo).toMatch(/^\d{4}-(I|II)$/);
  });
});
