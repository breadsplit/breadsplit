/* eslint-disable @typescript-eslint/no-var-requires */
const { resolve } = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const deepmerge = require('deepmerge')
const { Nuxt } = require('nuxt')
const tsConfig = require('./client/tsconfig.json')
const { links } = require('./meta/html_headers')

const srcDir = 'client'

const nuxt = new Nuxt({})

const nuxtLoaders = nuxt.options.build.loaders

module.exports = {
  components: `${srcDir}/components/basic/[A-Z]*.vue`,
  renderRootJsx: resolve(__dirname, srcDir, 'styleguide.root.ts'),
  assetsDir: resolve(__dirname, srcDir, 'static'),
  template: {
    head: {
      links,
    },
  },
  require: [
    resolve(__dirname, srcDir, 'assets/style/app.styl'),
  ],
  webpackConfig: {
    resolve: {
      extensions: ['.js', '.json', '.vue', '.ts'],
      alias: {
        '~': resolve(__dirname, srcDir),
        '@': resolve(__dirname, srcDir),
      },
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: nuxtLoaders.vue,
        },
        {
          test: /\.(j|t)s$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [require.resolve('@nuxt/babel-preset-app')],
              },
            },
            {
              loader: 'ts-loader',
              options: deepmerge(tsConfig, {
                transpileOnly: true,
                appendTsSuffixTo: [/\.vue$/],
                compilerOptions: {
                  noEmit: false,
                  target: 'esnext',
                  module: 'esnext',
                },
              }),
            }],
        },
        {
          test: /\.css$/,
          use: ['vue-style-loader', 'css-loader'],
        },
        {
          test: /\.styl(us)?$/,
          use: ['vue-style-loader', 'css-loader', 'stylus-loader'],
        },
        {
          test: /\.pug$/,
          oneOf: [
            {
              resourceQuery: /^\?vue/i,
              use: [{
                loader: 'pug-plain-loader',
              }],
            },
            {
              use: [
                'raw-loader',
                {
                  loader: 'pug-plain-loader',
                },
              ],
            },
          ],
        },
        {
          test: /\.ya?ml$/,
          use: ['js-yaml-loader'],
        },
      ],
    },
    plugins: [new VueLoaderPlugin()],
  },
  usageMode: 'expand',
  exampleMode: 'expand',
  styleguideDir: 'dist',
}
