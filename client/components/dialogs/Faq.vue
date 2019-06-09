<template lang='pug'>
v-card.faq
  app-dialog-bar(@close='close()' attached) {{$t('ui.faq')}}

  v-expansion-panel
    v-expansion-panel-content(v-for='(item,i) in list', :key='i')
      template(v-slot:header)
        div {{item.title}}
      v-card
        v-card-text.px-4.pt-1(v-html='item.details || wipText')
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

<style lang='stylus'>
.faq
  .v-expansion-panel__container--active
    .v-expansion-panel__header
      font-weight bold
</style>
