
import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class CommonMixin extends Vue {
  get isMobile() {
    // @ts-ignore
    return this.$vuetify.breakpoint.xs
  }

  WIP() {
    this.$root.$snack(this.$t('ui.wip'), { color: 'red' })
  }
}
