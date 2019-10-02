
import { Vue, Component } from 'nuxt-property-decorator'
import { LOCALE_FALLBACK } from '~/utils'

@Component
export default class CommonMixin extends Vue {
  get isMobile () {
    return this.$vuetify.breakpoint.xs
  }

  get currentLocale () {
    return this.$i18n.locale || LOCALE_FALLBACK
  }

  WIP () {
    this.$snack(this.$t('ui.wip'), { color: 'red' })
  }
}
