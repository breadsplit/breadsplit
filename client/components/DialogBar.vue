<template lang='pug'>
v-toolbar(flat :color='backgroundColor' v-bind='$attrs')
  v-btn(icon v-if='!closeOnRight' @click='close(false)')
    v-icon(:color='color') mdi-close
  v-toolbar-title.primary--text
    slot
  template(v-if='closeOnRight')
    v-spacer
    v-btn(icon @click='close(false)')
      v-icon(:color='color') mdi-close
</template>

<script lang='ts'>
import { Component, Prop, Mixins } from 'vue-property-decorator'
import CommonMixin from '~/mixins/common'

@Component({
  inheritAttrs: false,
})
export default class DialogBar extends Mixins(CommonMixin) {
  @Prop({ default: 'primary' }) readonly color!: string
  @Prop({ default: 'transparent' }) readonly backgroundColor!: string

  close(flag?: boolean) {
    this.$emit('close', flag)
  }

  get closeOnRight() {
    return !this.isMobile && ['windows', 'linux'].includes(this.$store.state.ua.os)
  }
}
</script>
