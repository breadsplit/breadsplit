import { Configuration } from '@nuxt/types'
import { extendConfig } from '../nuxt.config.base'

const config: Configuration = extendConfig({
  css: ['~/assets/style/index.sass'],

  modules: [
    '~/modules/assets',
  ],

  plugins: [
    '~/../shared/plugins/i18n',
  ],
})

export default config
