module.exports = {
  roots: ['<rootDir>/src'],
  transform: { '^.+\\.(ts|tsx|js|jsx)?$': 'ts-jest' },
  testRegex: '(/__test__/.*|(\\.|/)(test|spec))\\.[jt]sx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  modulePathIgnorePatterns: ['<rootDir>/src/__test__/jest.setup.js'],
  verbose: true,
  errorOnDeprecated: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.{js,ts}'],
  setupFiles: ['<rootDir>/src/__test__/jest.setup.js'],
  setupFilesAfterEnv: ['jest-extended/all'], // jest-extended
  runner: 'groups', // jest-runner-groups,
  globals: {},
};
