
import { Vue, Component, Inject } from 'nuxt-property-decorator'

@Component
export default class DialogChildMixin extends Vue {
  @Inject() readonly dialog!: any
  visible = false

  get options () {
    return this.dialog.options as any || {}
  }

  close (result?) {
    this.visible = false
    this.$emit('close', result)
    try {
      // @ts-ignore
      this.$parent.$parent.$parent.close()
    }
    catch {}
  }
}
