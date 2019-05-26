import NuxtConfiguration from '@nuxt/config'
import VuetifyLoaderPlugin from 'vuetify-loader/lib/plugin'
import pkg from '../package.json'
import theme from '../meta/theme'

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
      { property: 'og:image', content: '/img/png/favicon-194x194.png' },
      { property: 'og:description', content: pkg.description },
    ],
    link: [
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/img/png/apple-touch-icon.png', media: '(device-width: 1536px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2)' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/img/png/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '194x194', href: '/img/png/favicon-194x194.png' },
      { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/android-chrome-192x192.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/img/png/favicon-16x16.png' },
      {
        async: true,
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap',
      },
      {
        async: true,
        rel: 'stylesheet',
        href: 'https://cdnjs.cloudflare.com/ajax/libs/MaterialDesign-Webfont/3.6.95/css/materialdesignicons.css',
      },
    ],
  },

  manifest: {
    name: fullname,
    short_name: fullname,
    display: 'standalone',
    orientation: 'portrait-primary',
    start_url: '/',
    theme_color: '#666',
    background_color: theme.background,
    prefer_related_applications: false,
    icons: [{
      src: '/img/png/android-chrome-192x192.png',
      sizes: '192x192',
      type: 'image/png',
    },
    {
      src: '/img/png/android-chrome-512x512.png',
      sizes: '512x512',
      type: 'image/png',
    }],
  },

  env: {
    NODE_ENV: process.env.NODE_ENV || 'development',
    FIREBASE_SERVER: process.env.FIREBASE_SERVER || 'development',
    BUILD_TARGET: process.env.BUILD_TARGET || '',
    RELEASE_CHANNEL,
    BUILD_TIME: new Date().toISOString(),
    BUILD_MACHINE: process.env.BUILD_MACHINE || process.env.OSTYPE || '',
    APP_VERSION: pkg.version,
  },

  loading: { color: '#fff' },

  css: [
    '~/assets/style/app.styl',
  ],

  plugins: [
    /* The order of plugins is important */

    /* Request handling */
    // '~/plugins/ua', // detect webview

    /* Data */
    '~/plugins/localstorage', // load store from localstorage
    '~/plugins/i18n',

    /* Plugins and Components */
    '~/plugins/packages', // 3-rd party dependencies
    '~/plugins/firebase',
    '~/plugins/vuetify',
    '~/plugins/directives',
    '~/plugins/components', // register components
  ],

  router: {
    mode: 'hash',
    middleware: [
      'ua',
      'group',
    ],
  },

  build: {
    transpile: ['vuetify/lib'],
    plugins: [new VuetifyLoaderPlugin()],
    loaders: {
      stylus: {
        import: ['~vuetify/src/stylus/settings/_variables.styl'],
      },
    },
    splitChunks: {},
    extractCSS: !dev,
    publicPath: '/nuxt/',
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        // @ts-ignore
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue|ts)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
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
  render: {
    bundleRenderer: {
      shouldPreload: (file, type) => {
        return ['script', 'style'].includes(type)
      },
    },
  },

  modules: [
    '@nuxtjs/pwa',
    '@nuxtjs/google-gtag',
    '@nuxtjs/sentry',
  ],

  'google-gtag': {
    id: process.env.GOOGLE_GTAG_ID,
    debug: dev,
  },

  // https://pwa.nuxtjs.org/modules/workbox.html
  workbox: {
    offlineAnalytics: true,
    offline: true,
    runtimeCaching: [
      {
        urlPattern: 'https://cdnjs.cloudflare.com/.*',
        handler: 'cacheFirst',
        method: 'GET',
        strategyOptions: { cacheableResponse: { statuses: [0, 200] } },
      },
      {
        urlPattern: '.*googleusercontent.com.*',
        handler: 'cacheFirst',
        method: 'GET',
        strategyOptions: { cacheableResponse: { statuses: [0, 200] } },
      },
      {
        urlPattern: '.*googleapis.com.*',
        handler: 'cacheFirst',
        method: 'GET',
        strategyOptions: { cacheableResponse: { statuses: [0, 200] } },
      },
      {
        urlPattern: '.*(?:png|jpg|jpeg|svg)$',
        handler: 'cacheFirst',
        method: 'GET',
        strategyOptions: { cacheableResponse: { statuses: [0, 200] } },
      },
      {
        urlPattern: '.*(?:woff|woff2|otf)$',
        handler: 'cacheFirst',
        method: 'GET',
        strategyOptions: { cacheableResponse: { statuses: [0, 200] } },
      },
      {
        urlPattern: '/img/.*',
        handler: 'staleWhileRevalidate',
        method: 'GET',
        strategyOptions: { cacheableResponse: { statuses: [0, 200] } },
      },
    ],
  },

  // https://sentry.io/
  sentry: {
    dsn: process.env.SENTRY_DSN,
    config: {
      tags: {
        build_target: process.env.BUILD_TARGET,
      },
    },
  },
}

export default config
