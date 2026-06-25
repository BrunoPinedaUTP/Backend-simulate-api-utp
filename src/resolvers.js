const {
  findMatriculas,
  findMatriculaById,
  findMatriculaByCodigo,
  getEstadisticas,
  insertMatriculas,
} = require('./matriculas');
const { workerId } = require('./logger');
const { simularCargaCPU } = require('./cpuLoad');

const resolvers = {
  Query: {
    matriculas: async (_, args) => {
      simularCargaCPU();
      return findMatriculas(args);
    },

    matricula: async (_, { id }) => {
      simularCargaCPU();
      return findMatriculaById(id);
    },

    consultarPagoMatricula: async (_, { codigoAlumno }) => {
      simularCargaCPU();
      return findMatriculaByCodigo(codigoAlumno);
    },

    consultaMasivaMatriculas: async (_, { cantidad, ciclo }) => {
      simularCargaCPU();
      const max = Math.min(Math.max(cantidad, 1), 100);
      const matriculas = await findMatriculas({ limit: max, offset: 0, ciclo });

      return {
        procesados: matriculas.length,
        matriculas,
        workerId,
      };
    },

    estadisticasMatriculas: async () => {
      simularCargaCPU();
      return getEstadisticas();
    },

    health: () => `UTP Matrículas API - Worker ${workerId} OK`,
  },

  Mutation: {
    generarMatriculas: async (_, { cantidad }) => {
      simularCargaCPU();
      const { insertados, totalEnBD } = await insertMatriculas(cantidad);
      return { insertados, totalEnBD, workerId };
    },
  },
};

module.exports = { resolvers };
