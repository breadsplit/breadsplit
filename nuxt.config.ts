import NuxtConfiguration from '@nuxt/config'
import VuetifyLoaderPlugin from 'vuetify-loader/lib/plugin'
import pkg from './package.json'

const debug = process.env.NODE_ENV !== 'production'

const config: NuxtConfiguration = {
  mode: 'spa',
  debug,

  head: {
    title: pkg.fullname,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700',
      },
    ],
  },

  manifest: {
    name: pkg.fullname,
    short_name: pkg.fullname,
    display: 'standalone',
    orientation: 'portrait-primary',
  },

  loading: { color: '#fff' },

  css: [
    '@mdi/font/css/materialdesignicons.min.css',
    '~/assets/style/app.styl',
  ],

  workbox: {
    offlineAnalytics: true,
    offline: true,
  },

  plugins: [
    // LocalStorage is not available in server side
    // the SSR is disabled for this plugin
    { src: '@/plugins/localstorage', ssr: false },
    { src: '@/plugins/i18n', ssr: false },
    '@/plugins/dayjs',
    '@/plugins/utils',
    '@/plugins/vuetify',
    '@/plugins/swatches',
    '@/plugins/components',
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
    id: process.env.GOOGLE_GTAG_ID,
    debug,
  },
}

export default config
