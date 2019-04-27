<template lang="pug">
.icon-select
  v-menu(v-model='menu' :nudge-width='200')
    template(v-slot:activator='{ on }')
      v-btn(:color='color' icon v-on='on' large)
        v-icon(color='white') mdi-{{value}}
    v-card.pa-2
      template(v-for='i in iconset')
        v-btn(flat icon @click='setValue(i)' small)
          v-icon(color='grey darken-2') mdi-{{i}}
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import Iconsets from '~/meta/iconsets'

@Component
export default class IconSelect extends Vue {
  menu = false

  @Prop(String) readonly value!: string
  @Prop({ default: 'primary' }) readonly color!: string
  @Prop([String, Array]) readonly icons: string | string[] | undefined

  get iconset() {
    if (typeof this.icons === 'string')
      return Iconsets[this.icons] || []
    return this.icons || Iconsets.group
  }

  setValue(value) {
    this.$emit('input', value)
  }
}
</script>
