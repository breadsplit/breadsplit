import NuxtConfiguration from '@nuxt/config'
import mergeWith from 'lodash/mergeWith'
import pkg from '../package.json'
import theme from './meta/theme'

const dev = process.env.NODE_ENV !== 'production'
const RELEASE_CHANNEL = process.env.RELEASE_CHANNEL || 'dev'
const fullname = RELEASE_CHANNEL !== 'dev' ? 'BreadSplit' : 'BreadSplit Dev'

const config: NuxtConfiguration = {
  mode: 'spa',
  debug: dev,

  head: {
    title: fullname,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' },
      { name: 'description', content: pkg.description },
      { name: 'author', content: pkg.author },
      { name: 'keywords', content: pkg.keywords.join(',') },
      { name: 'HandheldFriendly', content: 'true' },

      { property: 'og:title', content: fullname },
      { property: 'og:image', content: '/img/logo/favicon.png' },
      { property: 'og:description', content: pkg.description },
    ],
    link: [
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/img/logo/touch-icon.png',
        media: '(device-width: 1536px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2)',
      },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/img/logo/favicon32.png' },
      { rel: 'icon', type: 'image/png', sizes: '194x194', href: '/img/logo/favicon.png' },
      { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/img/logo/appicon192.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/img/logo/favicon16.png' },
    ],
  },

  env: {
    NODE_ENV: process.env.NODE_ENV || 'development',
    FIREBASE_SERVER: process.env.FIREBASE_SERVER || 'development',
    BUILD_TARGET: process.env.BUILD_TARGET || '',
    RELEASE_CHANNEL,
    BUILD_TIME: new Date().toISOString(),
    APP_VERSION: pkg.version,
  },

  loading: { color: '#fff' },

  build: {
    splitChunks: {},
    extractCSS: !dev,
    publicPath: '/nuxt/',
    extend (config, ctx) {
      if (config.module) {
        config.module.rules.push({
          test: /\.ya?ml$/,
          use: 'js-yaml-loader',
        })
      }
    },
    babel: {
      presets: [
        [
          '@nuxt/babel-preset-app',
          {
            targets: '>0.25%, not ie 11, not op_mini all',
          },
        ],
      ],
    },
  },

  modules: [
    '@nuxtjs/google-gtag',
  ],

  devModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify',
  ],

  vuetify: {
    theme: {
      themes: theme,
      options: {
        customProperties: true,
      },
    },
    icons: {
      iconfont: 'mdi',
    },
    customVariables: [
      '~/assets/style/vars.sass',
    ],
  },

  'google-gtag': {
    id: process.env.GOOGLE_GTAG_ID,
    debug: dev,
  },
}

export default config

export function extendConfig (overrides: NuxtConfiguration) {
  return mergeWith(overrides, config, (obj, src) => {
    if (Array.isArray(obj))
      return obj.concat(src)
  })
}
