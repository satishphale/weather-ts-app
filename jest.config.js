/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|tests).[jt]s?(x)'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
};
