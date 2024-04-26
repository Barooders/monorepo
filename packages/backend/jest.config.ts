import { config as dotenvConfig } from 'dotenv';
import { Config } from 'jest';

dotenvConfig({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env.local',
});

/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

const config: Config = {
  collectCoverage: false,
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',

  projects: [
    {
      displayName: 'Server',

      testRegex: ['(src|tests)/.*.(spec|test).(jsx?|tsx?)$'],
      moduleNameMapper: {
        '@config/(.*)': ['<rootDir>/src/config/$1'],
        '@libs/(.*)': ['<rootDir>/src/libs/$1'],
        '@modules/(.*)': ['<rootDir>/src/modules/$1'],
        '@generated/(.*)': ['<rootDir>/src/__generated/$1'],
        '@tests/(.*)': ['<rootDir>/tests/$1'],
        'prisma/(.*)': ['<rootDir>/prisma/$1'],
      },
      rootDir: '.',
      testEnvironment: 'node',
      transform: { '^.+\\.(ts|tsx)$': 'ts-jest' },
      testPathIgnorePatterns: ['/node_modules/', '.tmp', '.cache', 'dist'],
      moduleFileExtensions: ['js', 'ts', 'json'],
      clearMocks: true,
    },

    {
      displayName: 'Client (extensions)',

      testRegex: ['.*.(spec|test).(jsx?|tsx?)$'],
      moduleNameMapper: {
        '@config/(.*)': ['<rootDir>/config/$1'],
        '@libs/(.*)': ['<rootDir>/libs/$1'],
      },
      rootDir: 'extensions',
      testEnvironment: 'jsdom',
      transform: { '^.+\\.(ts|tsx)$': 'ts-jest' },
      testPathIgnorePatterns: ['/node_modules/', '.tmp', '.cache', 'dist'],
      moduleFileExtensions: ['js', 'ts', 'json'],
      clearMocks: true,
    },
  ],
};

export default config;
