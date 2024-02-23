export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  coverageDirectory: './coverage',
  testRegex: '.e2e-spec.ts$',
  moduleNameMapper: {
    '@src/(.*)$': '<rootDir>/src/$1',
    '@modules/(.*)$': '<rootDir>/src/modules/$1',
    '@config/(.*)$': '<rootDir>/src/config/$1',
    '@libs/(.*)$': '<rootDir>/src/libs/$1',
    '@exceptions$': '<rootDir>/src/libs/exceptions',
    '@tests/(.*)$': '<rootDir>/tests/$1',
  },
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
};
