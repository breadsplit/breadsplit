<template lang='pug'>
v-card.form-category(v-rows='"max-content max-content auto max-content"')
  app-composed-toolbar.mb-n3(dark)
    v-btn(icon @click='close()')
      v-icon mdi-close
    v-toolbar-title Categories
    v-spacer

  v-list
</template>

<script lang='ts'>
import { Component, mixins } from 'nuxt-property-decorator'
import { CommonMixin, GroupMixin, DialogChildMixin } from '~/mixins'

@Component
export default class FormCategory extends mixins(DialogChildMixin, CommonMixin, GroupMixin) {
}
</script>