<template lang='pug'>
.color-select
  v-btn(text icon @click='reset()' v-if='selectingSub').ma-1
    v-icon(color='grey') mdi-arrow-left
  template(v-for='(c, idx) in currentColors')
    v-btn(text icon @click='select(c, idx)' :style='{ selected: isSelected(c, idx) }').ma-1
      v-icon(:color='c') mdi-checkbox-blank-circle
</template>

<script lang='ts'>
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import swatches, { BaseIndex } from '~/../meta/swatches'

@Component
export default class ColorSelect extends Vue {
  @Prop(String) readonly color!: string
  main = -1

  get selectingSub () {
    return this.main !== -1
  }

  get mainColors () {
    return swatches.map(i => i[BaseIndex])
  }

  get subColors () {
    if (this.selectingSub)
      return swatches[this.main]
    return []
  }

  get currentColors () {
    if (this.selectingSub)
      return this.subColors
    return this.mainColors
  }

  select (color: string, index: number) {
    if (!this.selectingSub) {
      this.main = index
      this.$emit('update:color', color)
    }
    else {
      this.$emit('update:color', color)
      this.$emit('done')
      this.reset()
    }
  }

  reset () {
    this.main = -1
  }

  isSelected (color: string, index: number) {
    if (this.selectingSub)
      return color === this.color
    return (swatches[index] || []).includes(color)
  }
}
</script>
