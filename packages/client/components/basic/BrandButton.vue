<template lang='pug'>
v-btn(
  v-bind='$attrs',
  v-on='$listeners',
  :color='color',
  :dark='dark',
  :light='!dark',
  :style='style',
)
  v-avatar.brand-icon(size='21', tile).mr-2
    img(:src='`/img/brands/${brand}.svg`')
  span.brand-text
    slot {{brand}}
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import BrandColors from '~/../meta/brandcolors'
import { isDark } from '~/utils/colors'

@Component({
  inheritAttrs: false,
})
export default class BrandButton extends Vue {
  @Prop(String) readonly brand!: string
  @Prop(String) readonly width!: string | number

  get color() {
    return BrandColors[this.brand] || '#fff'
  }

  get dark() {
    return isDark(this.color)
  }

  get style() {
    let width = this.width
    if (typeof width === 'number')
      width = `${width}px`
    return {
      width,
    }
  }
}
</script>

<style lang='sass' scoped>
.v-btn
  padding: 0
  text-transform: none
.brand-icon
  position: absolute
  left: 15px
.brand-text
  padding-left: 30px
  margin: 0 20px
</style>
