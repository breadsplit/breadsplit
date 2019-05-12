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
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { hid: 'description', name: 'description', content: pkg.description },
      { name: 'HandheldFriendly', content: 'true' },
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
        href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700',
      },
      {
        async: true,
        rel: 'stylesheet',
        href: 'https://cdnjs.cloudflare.com/ajax/libs/MaterialDesign-Webfont/3.6.95/css/materialdesignicons.css',
      },
    ],
  },

  manifest: {
    name: pkg.fullname,
    short_name: pkg.fullname,
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
    BUILD_TARGET: process.env.BUILD_TARGET || '',
    BUILD_TIME: new Date().toISOString(),
    BUILD_MACHINE: process.env.BUILD_MACHINE || process.env.OSTYPE || '',
    APP_VERSION: pkg.version,
  },

  loading: { color: '#fff' },

  css: [
    '~/assets/style/app.styl',
  ],

  plugins: [
    '~/plugins/messaging-sw',
    '~/plugins/localstorage',
    '~/plugins/i18n',
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
    splitChunks: {},
    extractCSS: true,
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
    // disable ios manifest fix for now
    // 'modules/manifest-ios',
  ],

  'google-gtag': {
    id: process.env.GOOGLE_GTAG_ID || ServicesIntegrations.google_gtag,
    debug,
  },

  workbox: {
    offlineAnalytics: true,
    offline: true,
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
