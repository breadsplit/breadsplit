<template lang='pug'>
v-card.faq
  app-dialog-bar(@close='close()' attached) {{$t('ui.faq')}}

  v-expansion-panels(accordion)
    v-expansion-panel(v-for='(item,i) in list', :key='i')
      v-expansion-panel-header
        div {{item.title}}
      v-expansion-panel-content
        .pa-0(v-html='item.details || wipText')
</template>

<script lang='ts'>
import { Component, mixins } from 'nuxt-property-decorator'
import { DialogChildMixin } from '~/mixins'
import { EN_MESSAGES } from '~/../locales/index'

interface HelpDetail {
  title: string
  details: string
  tips?: string
}

@Component
export default class FAQ extends mixins(DialogChildMixin) {
  keys = Object.keys(EN_MESSAGES.help)

  get wipText() {
    return this.$t('ui.wip')
  }

  get list() {
    return this.keys.map((key) => {
      return this.$t(`help.${key}`) as object as HelpDetail
    })
  }
}
</script>

<style lang='sass'>
.faq
  .v-expansion-panel-header
    font-weight: bold
  .v-expansion-panel-content
    font-size: 0.9em
</style>
