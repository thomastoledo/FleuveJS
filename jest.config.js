module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageThreshold: {
    "global": {
      "branches": 95,
      "functions": 95,
      "lines": 95,
      "statements": 0
    }
  }
};