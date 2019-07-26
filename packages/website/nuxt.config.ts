import NuxtConfiguration from '@nuxt/config'
import theme from '../meta/theme'
import pkg from '../../package.json'

const debug = process.env.NODE_ENV !== 'production'

const config: NuxtConfiguration = {
  mode: 'spa',
  debug,

  head: {
    title: pkg.fullname,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'description', content: pkg.description },
      { name: 'author', content: pkg.author },
      { name: 'keywords', content: pkg.keywords.join(',') },
      { name: 'HandheldFriendly', content: 'true' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        async: true,
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap',
      },
      {
        async: true,
        rel: 'stylesheet',
        href: 'https://cdnjs.cloudflare.com/ajax/libs/MaterialDesign-Webfont/3.8.95/css/materialdesignicons.css',
      },
    ],
  },

  loading: { color: '#3B8070' },

  build: {
    extractCSS: !debug,
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
    },
    icons: {
      iconfont: 'mdi',
    },
    customVariables: [
      '~/assets/style/app.sass',
    ],
    defaultAssets: {
      font: false,
      icons: false,
    },
  },

  'google-gtag': {
    id: process.env.GOOGLE_GTAG_ID,
    debug,
  },
}

export default config
