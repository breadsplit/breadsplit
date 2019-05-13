
import { Vue, Component, Inject } from 'vue-property-decorator'

@Component
export default class DialogChildMixin extends Vue {
  @Inject() readonly dialog!: any

  get options() {
    return this.dialog.options as any || {}
  }
  get visible() {
    return this.dialog.visible as boolean
  }

  close(result?: any) {
    this.$emit('close', result)
  }
}
