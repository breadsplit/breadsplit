module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^~/(.*)$': '<rootDir>/$1',
    '^vue$': 'vue/dist/vue.common.js',
  },
  moduleFileExtensions: ['ts', 'js', 'vue', 'json'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '.*\\.(vue)$': 'vue-jest',
  },
  'collectCoverage': true,
  'collectCoverageFrom': [
    '<rootDir>/utils/**/*.ts',
    '<rootDir>/store/**/*.ts',
    '!<rootDir>/utils/**/avatarProvider.ts',
  ],
  'coverageDirectory': './coverage/',
}
