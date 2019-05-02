module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/client/$1',
    '^~/(.*)$': '<rootDir>/client/$1',
    '^vue$': 'vue/dist/vue.common.js',
  },
  moduleFileExtensions: [
    'ts',
    'js',
    'vue',
    'json',
  ],
  testMatch: [
    '**/client/**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '.*\\.(vue)$': 'vue-jest',
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
}
