import type { Config } from 'jest';

const config: Config = {
  collectCoverageFrom: ['<rootDir>/src/**/*.{ts,tsx}', '!<rootDir>/src/**/*.d.ts'],
  coverageDirectory: 'coverage',
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  moduleNameMapper: {
    '@client/(.*)': '<rootDir>/src/client/$1',
    '@common/(.*)': '<rootDir>/src/common/$1',
    '@middleware/(.*)': '<rootDir>/src/middleware/$1',
    '@provider/(.*)': '<rootDir>/src/provider/$1',
  },
  rootDir: '.',
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  // testEnvironment: 'jest-environment-node', // TODO: this is required for the ARC0200Contract tests, otherwise the algosdk fails
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/test/tsconfig.json',
      },
    ],
  },
  verbose: true,
};

export default config;
