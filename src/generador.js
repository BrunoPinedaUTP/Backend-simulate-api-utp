const { faker } = require('@faker-js/faker/locale/es');

const CICLOS = ['2025-I', '2025-II', '2026-I'];
const FACULTADES = [
  'Ingeniería de Sistemas',
  'Ingeniería Industrial',
  'Administración de Empresas',
  'Contabilidad',
  'Derecho',
  'Psicología',
  'Arquitectura',
];
const ESTADOS_PAGO = ['PAGADO', 'PENDIENTE', 'PARCIAL', 'VENCIDO'];
const MONTO_BASE_MATRICULA = 2850;

function calcularDescuento(promedio) {
  if (promedio >= 17) return 0.3;
  if (promedio >= 15) return 0.2;
  if (promedio >= 13) return 0.1;
  return 0;
}

function generarMatricula(id) {
  const promedio = Number(faker.number.float({ min: 10, max: 20, fractionDigits: 2 }));
  const descuentoPct = calcularDescuento(promedio);
  const descuento = Number((MONTO_BASE_MATRICULA * descuentoPct).toFixed(2));
  const total = Number((MONTO_BASE_MATRICULA - descuento).toFixed(2));

  return {
    codigoAlumno: `UTP${String(id).padStart(6, '0')}`,
    nombre: faker.person.fullName(),
    promedio,
    descuento,
    total,
    ciclo: faker.helpers.arrayElement(CICLOS),
    facultad: faker.helpers.arrayElement(FACULTADES),
    estadoPago: faker.helpers.arrayElement(ESTADOS_PAGO),
    fechaConsulta: faker.date.recent({ days: 30 }).toISOString(),
  };
}

function generarMatriculas(cantidad) {
  return Array.from({ length: cantidad }, (_, i) => generarMatricula(i + 1));
}

module.exports = {
  CICLOS,
  FACULTADES,
  ESTADOS_PAGO,
  MONTO_BASE_MATRICULA,
  calcularDescuento,
  generarMatricula,
  generarMatriculas,
};
