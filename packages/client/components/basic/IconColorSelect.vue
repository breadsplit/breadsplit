<template lang='pug'>
.icon-select
  v-menu(v-model='menu' :max-width='280' :close-on-content-click='false')
    template(v-slot:activator='{ on }')
      slot(:on='on')

    v-card.pa-2

      template(v-if='stage === 0')
        template(v-for='i in iconset')
          v-btn(icon @click='setIcon(i)' :style='i===icon?selectedStyle:null').ma-1
            v-icon(:color='color') mdi-{{i}}

      template(v-else)
        template(v-for='c in swatches')
          v-btn(text icon @click='setColor(c)' :style='c===color?selectedStyle:null').ma-1
            v-icon(:color='c') mdi-checkbox-blank-circle
</template>

<script lang='ts'>
import { Vue, Component, Prop, Watch } from 'nuxt-property-decorator'
import Iconsets from '~/../meta/iconsets'
import swatches from '~/../meta/swatches'

@Component
export default class IconColorSelect extends Vue {
  menu = false
  swatches = swatches
  stage = 0

  @Prop(String) readonly icon!: string
  @Prop({ default: 'primary' }) readonly color!: string
  @Prop([String, Array]) readonly icons: string | string[] | undefined

  @Watch('menu')
  onMenuChanged () {
    if (!this.menu)
      this.stage = 0
  }

  get iconset () {
    if (typeof this.icons === 'string')
      return Iconsets[this.icons] || []
    return this.icons || Iconsets.group
  }

  get selectedStyle () {
    return {
      background: 'rgba(128, 128, 128, 0.2)',
    }
  }

  setIcon (value) {
    this.stage = 1
    this.$emit('update:icon', value)
  }
  setColor (value) {
    this.stage = 0
    this.menu = false
    this.$emit('update:color', value)
  }
}
</script>
