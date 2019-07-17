module.exports = {
  root: true,
  env: {
    es6: true,
    browser: true,
    node: true,
    jest: true,
    'cypress/globals': true,
  },
  plugins: [
    'cypress',
    'jest',
    'chai-friendly',
  ],
  extends: [
    '@antfu/eslint-config-vue',
  ],
  rules: {
    // cypress
    'no-unused-expressions': 0,
    'chai-friendly/no-unused-expressions': 2
  }
}
