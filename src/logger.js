const pino = require('pino');

const workerId = process.env.NODE_APP_INSTANCE ?? process.env.pm_id ?? '0';
const workerName = process.env.name ?? 'utp-matriculas-api';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  base: {
    workerId,
    workerName,
    pid: process.pid,
  },
  transport:
    process.env.NODE_ENV !== 'production'
      ? { target: 'pino-pretty', options: { colorize: true, translateTime: 'SYS:standard' } }
      : undefined,
});

module.exports = { logger, workerId, workerName };
