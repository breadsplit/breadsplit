
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class CommonMixin extends Vue {
  get isMobile() {
    // @ts-ignore
    return this.$vuetify.breakpoint.xs
  }
}
