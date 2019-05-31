
import NuxtConfiguration from '@nuxt/config'
import VuetifyLoaderPlugin from 'vuetify-loader/lib/plugin'
import pkg from '../package.json'

const debug = process.env.NODE_ENV !== 'production'

const config: NuxtConfiguration = {
  mode: 'spa',
  debug,

  head: {
    title: 'website',
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
    ],
  },

  loading: { color: '#3B8070' },

  css: [
    '~/assets/css/app.styl',
  ],

  build: {
    transpile: ['vuetify/lib'],
    plugins: [new VuetifyLoaderPlugin()],
    loaders: {
      stylus: {
        import: ['~vuetify/src/stylus/settings/_variables.styl'],
      },
    },
    extractCSS: !debug,
    extend(config, ctx) {
      if (ctx.isDev && ctx.isClient && config.module) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue|ts)$/,
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
