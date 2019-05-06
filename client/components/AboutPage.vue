<template lang='pug'>
v-card
  v-toolbar(dark, color='primary')
    v-btn(icon, dark, @click='close(false)')
      v-icon mdi-close
    v-toolbar-title {{$t('ui.about')}}

  v-container.pa-4.text-xs-center
    p BreadSplit
    p balabalbala

    app-brand-button(brand='patreon' :href='socials.patreon' target='__blank')
      span Become a patreon

    app-credit
</template>

<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator'
import socials from '~/meta/socials'

@Component
export default class AboutPage extends Vue {
  socials = socials

  close(result?) {
    this.$emit('close', result)
  }
}
</script>
