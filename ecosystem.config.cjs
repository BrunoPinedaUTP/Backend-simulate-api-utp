module.exports = {
  apps: [
    {
      name: 'utp-matriculas-api',
      script: './src/index.js',
      instances: 4,
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
        LOG_LEVEL: 'info',
        MONGODB_URI: 'mongodb://localhost:27017',
        MONGODB_DB: 'utp_matriculas',
        CPU_LOAD_MS: '150',
      },
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
};
