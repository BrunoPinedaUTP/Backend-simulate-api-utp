const js = require('@eslint/js');
const globals = require('globals');

const reglasEstrictas = {
  'no-console': 'off',
  'no-unused-vars': [
    'error',
    {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_',
    },
  ],
  'eqeqeq': ['error', 'always', { null: 'ignore' }],
  'no-unreachable': 'error',
  'no-empty': ['error', { allowEmptyCatch: false }],
};

module.exports = [
  {
    ignores: ['node_modules/**', 'logs/**', 'db.json', 'eslint-ejemplos/**'],
  },
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.cjs'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
    rules: reglasEstrictas,
  },
  {
    files: ['eslint-ejemplos/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
    rules: reglasEstrictas,
  },
];
