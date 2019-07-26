<template lang='pug'>
v-card.categories-edit(v-rows='"max-content max-content auto max-content"')
  app-composed-toolbar.mb-n3(dark color='primary')
    v-btn(icon @click='close()')
      v-icon mdi-close
    v-toolbar-title Categories
    v-spacer

  v-list
    span TODO:
</template>

<script lang='ts'>
import { Component, mixins } from 'nuxt-property-decorator'
import { CommonMixin, GroupMixin, DialogChildMixin } from '~/mixins'

@Component
export default class CategoriesEdit extends mixins(DialogChildMixin, CommonMixin, GroupMixin) {
}
</script>
