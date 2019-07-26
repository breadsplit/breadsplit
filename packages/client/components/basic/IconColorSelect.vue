<template lang='pug'>
.icon-select
  v-menu(v-model='menu' :width='280' :close-on-content-click='false')
    template(v-slot:activator='{ on }')
      slot(:on='on')

    v-card
      div(v-rows='"max-content auto"' style='height: 400px; width: 280px; overflow: hidden;')
        v-tabs(v-model='tab' background-color='transparent' :color='color' grow)
          v-tab {{$t('ui.icons')}}
          v-tab {{$t('ui.colors')}}

        v-tabs-items.grid-fill-height.scrolling(v-model='tab')
          v-tab-item.pa-2
            app-icon-select(
              :icon='icon'
              :selected-color='color'
              @update:icon='i=>setIcon(i)'
            )

          v-tab-item.pa-2
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
  tab = 0

  @Prop(String) readonly icon!: string
  @Prop({ default: 'primary' }) readonly color!: string
  @Prop([String, Array]) readonly icons: string | string[] | undefined

  @Watch('menu')
  onMenuChanged () {
    if (!this.menu)
      this.tab = 0
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
    this.tab = 1
    this.$emit('update:icon', value)
  }
  setColor (value) {
    this.tab = 0
    this.menu = false
    this.$emit('update:color', value)
  }
}
</script>
