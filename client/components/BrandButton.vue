<template lang='pug'>
v-btn(
  v-bind='$attrs',
  :color='color',
  :dark='dark',
)
  v-avatar(size='21', tile).mr-2
    img(:src='require(`~/assets/brands/${brand}.svg`)')
  slot
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator'
import BrandColors from '~/meta/brandcolors'
import chroma from 'chroma-js'

@Component({
  inheritAttrs: false,
})
export default class BrandButton extends Vue {
  @Prop(String) readonly brand!: string

  get color() {
    return BrandColors[this.brand] || '#fff'
  }

  get dark() {
    return chroma(this.color).luminance() < 0.5
  }
}
</script>
