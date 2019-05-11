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
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png', media: '(device-width: 1536px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2)' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '194x194', href: '/favicon-194x194.png' },
      { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/android-chrome-192x192.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
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
    theme_color: '#888',
    background_color: theme.background,
    prefer_related_applications: false,
    icons: [{
      src: '/android-chrome-192x192.png',
      sizes: '192x192',
      type: 'image/png',
    },
    {
      src: '/android-chrome-512x512.png',
      sizes: '512x512',
      type: 'image/png',
    }],
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
    '@nuxtjs/sentry',
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

  sentry: {
    dsn: process.env.SENTRY_DSN || ServicesIntegrations.sentry_dsn,
    config: {
      tags: {
        build_target: process.env.BUILD_TARGET,
      },
    },
  },
}

export default config
