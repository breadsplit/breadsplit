
import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class CommonMixin extends Vue {
  get isMobile() {
    return this.$vuetify.breakpoint.xs
  }

  get currentLocale() {
    return this.$i18n.locale || 'en'
  }

  WIP() {
    this.$snack(this.$t('ui.wip'), { color: 'red' })
  }
}
