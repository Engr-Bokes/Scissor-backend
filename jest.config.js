module.exports = {
    transform: {
      '^.+\\.tsx?$': ['ts-jest', {
        useESM: true, // Support ECMAScript modules
      }],
    },
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'tsx', 'js'],
    extensionsToTreatAsEsm: ['.ts'], // Handle .ts files as ECMAScript modules
    preset: 'ts-jest/presets/default-esm', // Use ESM preset
    transformIgnorePatterns: [
      '/node_modules/(?!nanoid).+\\.js$', // Ensure modern modules are transformed
    ],
  };
  