module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['apps/**/*.ts', 'libs/**/*.ts', '!**/*.module.ts', '!**/main.ts'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
};
