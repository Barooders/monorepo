module.exports = {
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    ecmaVersion: 2015,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'filenames-simple'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:import/typescript',
    'plugin:import/recommended',
  ],
  root: true,
  ignorePatterns: [
    '.eslintrc.js',
    'medusa-config.js',
    'src/migrations/*',
    '**/*.spec.ts',
  ],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
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
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'lodash',
            importNames: ['merge'],
            message:
              'Lodash merge mutates the first object, please use our merge override from shared-types instead.',
          },
        ],
      },
    ],
  },
};
