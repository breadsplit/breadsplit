
import { Vue, Component, Inject } from 'nuxt-property-decorator'

@Component
export default class DialogChildMixin extends Vue {
  @Inject() readonly dialog!: any

  get options() {
    return this.dialog.options as any || {}
  }
  get visible() {
    return this.dialog.visible as boolean
  }

  close(result?) {
    this.$emit('close', result)
    try {
      // @ts-ignore
      this.$parent.$parent.$parent.close()
    }
    catch {}
  }
}
