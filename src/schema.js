const typeDefs = `#graphql
  type Matricula {
    id: ID!
    codigoAlumno: String!
    nombre: String!
    promedio: Float!
    descuento: Float!
    total: Float!
    ciclo: String!
    facultad: String!
    estadoPago: String!
    fechaConsulta: String!
  }

  type EstadisticasMatriculas {
    totalAlumnos: Int!
    montoTotalRecaudado: Float!
    promedioDescuento: Float!
    porEstadoPago: [ConteoEstado!]!
    porCiclo: [ConteoCiclo!]!
  }

  type ConteoEstado {
    estado: String!
    cantidad: Int!
  }

  type ConteoCiclo {
    ciclo: String!
    cantidad: Int!
    montoTotal: Float!
  }

  type ConsultaMasivaResultado {
    procesados: Int!
    matriculas: [Matricula!]!
    workerId: String!
  }

  type GenerarMatriculasResultado {
    insertados: Int!
    totalEnBD: Int!
    workerId: String!
  }

  type Query {
    matriculas(limit: Int, offset: Int, ciclo: String, estadoPago: String): [Matricula!]!
    matricula(id: ID!): Matricula
    consultarPagoMatricula(codigoAlumno: String!): Matricula
    consultaMasivaMatriculas(cantidad: Int!, ciclo: String): ConsultaMasivaResultado!
    estadisticasMatriculas: EstadisticasMatriculas!
    health: String!
  }

  type Mutation {
    generarMatriculas(cantidad: Int!): GenerarMatriculasResultado!
  }
`;

module.exports = { typeDefs };
