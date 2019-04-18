import { Vue, Component } from 'vue-property-decorator'

@Component
export default class BasicMixin extends Vue {
  get primary() {
    return this.$store.getters.primary
  }
}
