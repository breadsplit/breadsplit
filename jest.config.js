module.exports = {
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/packages/client/$1',
    '^vue$': 'vue/dist/vue.common.js',
  },
  moduleFileExtensions: [
    'ts',
    'js',
    'vue',
    'json',
    'yml',
    'yaml',
  ],
  testMatch: [
    '**/packages/client/**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '.*\\.(vue)$': 'vue-jest',
    '\\.yml$': 'jest-yaml-transform',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/packages/client/utils/**/*.ts',
    '<rootDir>/packages/client/store/**/*.ts',
    '<rootDir>/packages/core/**/*.ts',
    '!<rootDir>/packages/client/utils/**/avatarProvider.ts',
    '!<rootDir>/packages/client/utils/**/core.ts',
    '!<rootDir>/packages/client/utils/**/id_helper.ts',
  ],
  coverageDirectory: './coverage/',
  globals: {
    'ts-jest': {
      tsConfig: './packages/client/tsconfig.json',
    },
  },
}
