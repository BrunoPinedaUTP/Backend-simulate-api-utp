const { ObjectId } = require('mongodb');

function toGraphQL(doc) {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return { id: _id.toString(), ...rest };
}

function buildFilter({ ciclo, estadoPago } = {}) {
  const filter = {};
  if (ciclo) filter.ciclo = ciclo;
  if (estadoPago) filter.estadoPago = estadoPago;
  return filter;
}

async function findMatriculas({ limit, offset = 0, ciclo, estadoPago } = {}) {
  const { getCollection } = require('./db');
  const collection = getCollection();
  const filter = buildFilter({ ciclo, estadoPago });

  let cursor = collection.find(filter).sort({ codigoAlumno: 1 }).skip(offset);
  if (limit != null) cursor = cursor.limit(limit);

  const docs = await cursor.toArray();
  return docs.map(toGraphQL);
}

async function findMatriculaById(id) {
  const { getCollection } = require('./db');
  const collection = getCollection();

  let doc = null;
  if (ObjectId.isValid(id)) {
    doc = await collection.findOne({ _id: new ObjectId(id) });
  }
  if (!doc) {
    doc = await collection.findOne({ codigoAlumno: id });
  }
  return toGraphQL(doc);
}

async function findMatriculaByCodigo(codigoAlumno) {
  const { getCollection } = require('./db');
  const doc = await getCollection().findOne({ codigoAlumno });
  return toGraphQL(doc);
}

async function getEstadisticas() {
  const { getCollection } = require('./db');
  const collection = getCollection();

  const [totales, porEstado, porCiclo] = await Promise.all([
    collection
      .aggregate([
        {
          $group: {
            _id: null,
            totalAlumnos: { $sum: 1 },
            promedioDescuento: { $avg: '$descuento' },
            montoTotalRecaudado: {
              $sum: {
                $cond: [{ $eq: ['$estadoPago', 'PAGADO'] }, '$total', 0],
              },
            },
          },
        },
      ])
      .toArray(),
    collection
      .aggregate([
        { $group: { _id: '$estadoPago', cantidad: { $sum: 1 } } },
        { $project: { _id: 0, estado: '$_id', cantidad: 1 } },
        { $sort: { estado: 1 } },
      ])
      .toArray(),
    collection
      .aggregate([
        {
          $group: {
            _id: '$ciclo',
            cantidad: { $sum: 1 },
            montoTotal: { $sum: '$total' },
          },
        },
        {
          $project: {
            _id: 0,
            ciclo: '$_id',
            cantidad: 1,
            montoTotal: { $round: ['$montoTotal', 2] },
          },
        },
        { $sort: { ciclo: 1 } },
      ])
      .toArray(),
  ]);

  const stats = totales[0] || {
    totalAlumnos: 0,
    promedioDescuento: 0,
    montoTotalRecaudado: 0,
  };

  return {
    totalAlumnos: stats.totalAlumnos,
    montoTotalRecaudado: Number((stats.montoTotalRecaudado || 0).toFixed(2)),
    promedioDescuento: Number((stats.promedioDescuento || 0).toFixed(2)),
    porEstadoPago: porEstado,
    porCiclo,
  };
}

async function getSiguienteId() {
  const { getCollection } = require('./db');
  const last = await getCollection().find().sort({ codigoAlumno: -1 }).limit(1).toArray();
  if (!last.length) return 1;
  return parseInt(last[0].codigoAlumno.replace('UTP', ''), 10) + 1;
}

async function insertMatriculas(cantidad) {
  const { getCollection } = require('./db');
  const { generarMatricula } = require('./generador');
  const collection = getCollection();
  const max = Math.min(Math.max(cantidad, 1), 500);
  const startId = await getSiguienteId();

  const docs = Array.from({ length: max }, (_, i) => generarMatricula(startId + i));
  await collection.insertMany(docs);

  const totalEnBD = await collection.countDocuments();
  return { insertados: docs.length, totalEnBD };
}

module.exports = {
  toGraphQL,
  findMatriculas,
  findMatriculaById,
  findMatriculaByCodigo,
  getEstadisticas,
  insertMatriculas,
};
