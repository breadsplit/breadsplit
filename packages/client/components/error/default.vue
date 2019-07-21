<template lang='pug'>
div
  v-icon.error-icon(size='64') mdi-{{error.icon || 'alert-circle-outline'}}
  .error-code.text-center {{error.statusCode}}
  .error-desc.text-center {{error.message}}
  v-btn.error-return(text, color='primary', to='/', nuxt) Home
  v-btn.error-return(text, color='primary', @click='reload()') Reload
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class DefaultErrorPage extends Vue {
  @Prop({ default: () => ({}) }) readonly error: any
  @Prop({ default: () => ({}) }) readonly payload: any

  reload () {
    window.location.reload()
  }
}
</script>
