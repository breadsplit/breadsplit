import NuxtConfiguration from '@nuxt/config'
import VuetifyLoaderPlugin from 'vuetify-loader/lib/plugin'
import pkg from '../package.json'
import ServicesIntegrations from './meta/services_integrations'
import theme from './meta/theme'

const debug = process.env.NODE_ENV !== 'production'

const config: NuxtConfiguration = {
  mode: 'spa',
  debug,

  head: {
    title: pkg.fullname,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' },
      { hid: 'description', name: 'description', content: pkg.description },
      { name: 'HandheldFriendly', content: 'true' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700',
      },
    ],
  },

  manifest: {
    name: pkg.fullname,
    short_name: pkg.fullname,
    display: 'standalone',
    orientation: 'portrait-primary',
    start_url: '/',
    theme_color: '#fafafa',
    background_color: theme.background,
  },

  env: {
    NODE_ENV: process.env.NODE_ENV || 'development',
    BUILD_TARGET: process.env.BUILD_TARGET || '',
    BUILD_TIME: new Date().toISOString(),
    BUILD_MACHINE: process.env.BUILD_MACHINE || process.env.OSTYPE || '',
    APP_VERSION: pkg.version,
  },

  loading: { color: '#fff' },

  css: [
    '@mdi/font/css/materialdesignicons.min.css',
    '~/assets/style/app.styl',
  ],

  plugins: [
    // LocalStorage is not available in server side
    // the SSR is disabled for this plugin
    { src: '~/plugins/localstorage', ssr: false },
    { src: '~/plugins/i18n', ssr: false },
    '~/plugins/dayjs',
    '~/plugins/utils',
    '~/plugins/firebase',
    '~/plugins/vuetify',
    '~/plugins/components',
  ],

  router: {
    mode: 'hash',
    middleware: [
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
    splitChunks: {
      layouts: true,
    },
    publicPath: '/nuxt/',
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        // @ts-ignore
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
        })
      }
    },
  },

  modules: [
    '@nuxtjs/pwa',
    '@nuxtjs/google-gtag',
  ],

  'google-gtag': {
    id: process.env.GOOGLE_GTAG_ID || ServicesIntegrations.google_gtag,
    debug,
  },

  workbox: {
    offlineAnalytics: true,
    offline: true,
    swURL: './firebase-messaging-sw.js',
  },
}

export default config
