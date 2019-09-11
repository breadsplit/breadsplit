import NuxtConfiguration from '@nuxt/config'
import { extendConfig } from '../nuxt.config.base'

const config: NuxtConfiguration = extendConfig({
  css: ['~/assets/style/index.sass'],

  modules: [
    '~/modules/assets',
  ],

  plugins: [
    '~/../shared/plugins/i18n',
  ],
})

export default config
