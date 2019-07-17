<template lang='pug'>
v-dialog(v-model='dialog' @keydown.esc='close()' v-bind='$attrs' v-on='$listeners')
  slot(v-if='!lazy || dialog')
</template>

<script lang='ts'>
import { Vue, Component, Prop } from 'nuxt-property-decorator'

@Component({
  inheritAttrs: false,
})
export default class PromiseDialog extends Vue {
  dialog = false
  resolve: Function|null = null

  @Prop(Boolean) readonly lazy

  open<T=any> (defaultValue?: T): Promise<T> {
    this.dialog = true

    return new Promise((resolve) => {
      this.resolve = (payload = defaultValue) => resolve(payload)
    })
  }

  close<T=any> (payload?: T) {
    if (this.resolve)
      this.resolve(payload)
    this.dialog = false
    this.resolve = null
  }
}
</script>
