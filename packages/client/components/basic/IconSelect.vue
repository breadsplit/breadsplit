<template lang='pug'>
.icon-select
  template(v-for='set in iconset')
    v-subheader {{$t(`icons.${set.name}`)}}
    template(v-for='i in set.icons')
      v-btn(icon @click='setIcon(i)' ).ma-1
        v-icon(:color='i === icon ? selectedColor : defaultColor') mdi-{{i}}
</template>

<script lang='ts'>
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import Iconsets from '~/../meta/icons'

@Component
export default class IconSelect extends Vue {
  @Prop(String) readonly icon!: string
  @Prop({ default: 'grey' }) readonly defaultColor!: string
  @Prop({ default: 'primary' }) readonly selectedColor!: string

  get iconset () {
    return Object.entries(Iconsets).map(([name, icons]) => {
      return {
        name,
        icons: icons.map(i => i.slice(4)),
      }
    })
  }

  setIcon (value) {
    this.$emit('update:icon', value)
  }
}
</script>
