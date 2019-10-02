import { Configuration } from '@nuxt/types'
import theme from '../meta/theme'
import { extendConfig } from '../nuxt.config.base'

const RELEASE_CHANNEL = process.env.RELEASE_CHANNEL || 'dev'
const fullname = RELEASE_CHANNEL !== 'dev' ? 'BreadSplit' : 'BreadSplit Dev'

const config: Configuration = extendConfig({
  head: {
    script: [
      {
        innerHTML: ` (function () {
          const title = new URLSearchParams(window.location.search).get('group_title')
          if (title) document.title = decodeURIComponent(title)
        })() `,
        type: 'text/javascript',
        charset: 'utf-8',
      },
    ],
    __dangerouslyDisableSanitizers: ['script'],
  },

  css: [
    '~/assets/style/index.sass',
  ],

  manifest: {
    name: fullname,
    short_name: fullname,
    display: 'standalone',
    orientation: 'portrait-primary',
    start_url: '/',
    theme_color: '#666',
    background_color: theme.light.background,
    prefer_related_applications: false,
    icons: [{
      src: '/img/logo/appicon192.png',
      sizes: '192x192',
      type: 'image/png',
    },
    {
      src: '/img/logo/appicon512.png',
      sizes: '512x512',
      type: 'image/png',
    }],
  },

  plugins: [
    /* The order of plugins is important */

    /* Request handling */
    // '~/plugins/ua', // FIXME:detect webview

    /* Data */
    '~/plugins/localstorage', // load store from localstorage
    '~/../shared/plugins/i18n',

    /* Plugins and Components */
    '~/plugins/packages', // 3-rd party dependencies
    '~/plugins/firebase',
    '~/plugins/directives',
    '~/plugins/components', // register components
  ],

  router: {
    middleware: [
      'ua', // FIXME: remove this, use plugins instead
      'group',
    ],
  },

  render: {
    bundleRenderer: {
      shouldPreload: (file, type) => {
        return ['script', 'style'].includes(type)
      },
    },
  },

  modules: [
    '~/modules/messaging',
    '~/modules/assets',
    '@nuxtjs/pwa',
    '@nuxtjs/google-gtag',
    '@nuxtjs/sentry',
  ],

  // https://pwa.nuxtjs.org/modules/workbox.html
  workbox: {
    offlineAnalytics: true,
    offline: true,
    offlineStrategy: 'staleWhileRevalidate',
    runtimeCaching: [
      {
        urlPattern: 'https://cdnjs.cloudflare.com/.*',
        handler: 'cacheFirst',
        method: 'GET',
        strategyOptions: { cacheableResponse: { statuses: [0, 200] } },
      },
      {
        urlPattern: 'https://cdn.jsdelivr.net/.*',
        handler: 'cacheFirst',
        method: 'GET',
        strategyOptions: { cacheableResponse: { statuses: [0, 200] } },
      },
      {
        urlPattern: '.*googleusercontent.com/.*',
        handler: 'cacheFirst',
        method: 'GET',
        strategyOptions: { cacheableResponse: { statuses: [0, 200] } },
      },
      {
        urlPattern: '.*googleapis.com/.*',
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
})

export default config
