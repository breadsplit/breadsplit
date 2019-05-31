
import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class CommonMixin extends Vue {
  get isMobile() {
    return this.$vuetify.breakpoint.xs
  }

  WIP() {
    this.$snack(this.$t('ui.wip'), { color: 'red' })
  }
}
