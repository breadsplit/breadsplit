<template lang='pug'>
div
  v-toolbar(
    :fixed='fixed' :absolute='absolute && !fixed'
    :color='backgroundColor' v-bind='$attrs' flat
  )
    template(v-if='closeButtons')
      v-btn(icon v-if='!closeOnRight' @click='close(false)')
        v-icon(:color='color') mdi-arrow-left
    v-toolbar-title(:style='{color}', :class='`${color}--text`')
      slot
    template(v-if='closeOnRight && closeButtons')
      v-spacer
      v-btn(icon @click='close(false)')
        v-icon(:color='color') mdi-close

  //.placeholder(v-if='fixed || absolute', :style='{height:placeholderHeight}')
</template>

<script lang='ts'>
import { Component, Prop, mixins } from 'nuxt-property-decorator'
import CommonMixin from '~/mixins/common'

@Component({
  inheritAttrs: false,
})
export default class DialogBar extends mixins(CommonMixin) {
  @Prop({ default: 'primary' }) readonly color!: string
  @Prop({ default: 'transparent' }) readonly backgroundColor!: string
  @Prop({ default: true }) readonly closeButtons!: boolean
  @Prop(Boolean) readonly absolute?: boolean
  @Prop(Boolean) readonly attached?: boolean
  @Prop(String) readonly height?: string

  close(flag?: boolean) {
    this.$emit('close', flag)
  }

  get fixed() {
    return this.isMobile && this.attached
  }

  get placeholderHeight() {
    if (this.height != null)
      return this.height
    return this.isMobile
      ? '56px'
      : '64px'
  }

  get closeOnRight() {
    return !this.isMobile && ['windows', 'linux'].includes(this.$store.state.ua.os)
  }
}
</script>
