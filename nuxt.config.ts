import NuxtConfiguration from '@nuxt/config'
import VuetifyLoaderPlugin from 'vuetify-loader/lib/plugin'
import pkg from './package.json'

const config: NuxtConfiguration = {
  mode: 'spa',

  /*
  ** Headers of the page
  */
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

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
    '@mdi/font/css/materialdesignicons.min.css',
    '~/assets/style/app.styl',
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/i18n',
    // LocalStorage is not available in server side
    // the SSR is disabled for this plugin
    { src: '@/plugins/localstorage', ssr: false },
    '@/plugins/utils',
    '@/plugins/vuetify',
    '@/plugins/swatches',
    '@/plugins/components',
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    // '@nuxtjs/axios',
    '@nuxtjs/pwa',
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  router: {
    mode: 'hash',
    middleware: [
      'book',
    ],
  },
  /*
  ** Build configuration
  */
  build: {
    transpile: ['vuetify/lib'],
    plugins: [new VuetifyLoaderPlugin()],
    loaders: {
      stylus: {
        import: ['~assets/style/variables.styl'],
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
}

export default config