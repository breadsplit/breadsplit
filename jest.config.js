module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^~/(.*)$': '<rootDir>/client/$1',
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
    '**/client/**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '.*\\.(vue)$': 'vue-jest',
    '\\.yml$': 'jest-yaml-transform',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/client/utils/**/*.ts',
    '<rootDir>/client/store/**/*.ts',
    '<rootDir>/core/**/*.ts',
    '!<rootDir>/client/utils/**/avatarProvider.ts',
    '!<rootDir>/client/utils/**/core.ts',
    '!<rootDir>/client/utils/**/id_helper.ts',
  ],
  coverageDirectory: './coverage/',
  globals: {
    'ts-jest': {
      tsConfig: './client/tsconfig.json',
    },
  },
}
