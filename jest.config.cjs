module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js',
    '!src/logger.js',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'json-summary'],
  coverageThreshold: {
    global: {
      branches: 30,
      functions: 35,
      lines: 40,
      statements: 40,
    },
  },
  testTimeout: 120000,
  forceExit: true,
};
