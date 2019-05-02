<template lang="pug">
.icon-select
  v-menu(v-model='menu' :max-width='280' :close-on-content-click='false')
    template(v-slot:activator='{ on }')
      v-btn(:color='color' icon v-on='on' large)
        v-icon(color='white') mdi-{{icon}}

    v-card.pa-2

      template(v-if='stage === 0')
        template(v-for='icon in iconset')
          v-btn(flat icon @click='setIcon(icon)' small)
            v-icon(:color='color') mdi-{{icon}}

      template(v-else)
        template(v-for='color in swatches')
          v-btn(flat icon @click='setColor(color)' small)
            v-icon(:color='color') mdi-checkbox-blank-circle
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import Iconsets from '~/meta/iconsets'
import swatches from '~/meta/swatches'

@Component
export default class IconSelect extends Vue {
  menu = false
  swatches = swatches
  stage = 0

  @Prop(String) readonly icon!: string
  @Prop({ default: 'primary' }) readonly color!: string
  @Prop([String, Array]) readonly icons: string | string[] | undefined

  @Watch('menu')
  onMenuChanged() {
    if (!this.menu)
      this.stage = 0
  }

  get iconset() {
    if (typeof this.icons === 'string')
      return Iconsets[this.icons] || []
    return this.icons || Iconsets.group
  }

  setIcon(value) {
    this.stage = 1
    this.$emit('update:icon', value)
  }
  setColor(value) {
    this.stage = 0
    this.menu = false
    this.$emit('update:color', value)
  }
}
</script>
