module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'filenames-simple'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:import/typescript',
    'plugin:import/recommended',
  ],
  settings: {
    'import/resolver': { typescript: true, node: true },
    'import/ignore': ['lodash'],
  },
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', 'src/__generated/*'],
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/*.test.ts',
          '**/*.spec.ts',
          '**/*.e2e-spec.ts',
          'jest.config.ts',
        ],
      },
    ],
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-floating-promises': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-console': 'error',
    'array-callback-return': 'error',
    'filenames-simple/naming-convention': ['error', { rule: 'kebab-case' }],
    'no-restricted-syntax': [
      'error',
      {
        message:
          "Please don't use JSON. Prefer usage of jsonStringify or jsonParse",
        selector: 'CallExpression > MemberExpression > Identifier[name="JSON"]',
      },
    ],
    'import/no-restricted-paths': [
      'error',
      {
        zones: [
          {
            target: '**/domain/**',
            from: '**/infrastructure/**',
            message: 'Domain layer should not depend on Infrastructure layer',
          },
          {
            target: '**/domain/**',
            from: '**/application/**',
            message: 'Domain layer should not depend on Application layer',
          },
          {
            target: '**/modules/**',
            from: '**/__generated/**',
            message: 'Use Prisma clients and types from @libs/domain/prisma*',
          },
        ],
      },
    ],
  },
};
