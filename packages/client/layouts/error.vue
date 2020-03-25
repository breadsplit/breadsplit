<template lang='pug'>
v-layout.nuxt-error.my-5.py-3(column, justify-center, align-center)
  v-flex.text-center(xs12, sm8, md6)
    component(:is='errorPage' :error='parsedError.error', :payload='parsedError.payload')
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import * as ErrorPages from '~/components/error'

@Component({
  layout: 'default',
})
export default class ErrorLayout extends Vue {
  @Prop({ default: () => ({}) }) readonly error: any
  @Prop({ default: () => ({}) }) readonly payload: any

  get parsedError() {
    if (this.error.type)
      return this.error
    else
      return { error: this.error, type: 'common' }
  }

  get errorPage() {
    return ErrorPages[this.parsedError.type] || ErrorPages.DefaultErrorPages
  }
}
</script>

<style lang='sass'>
.nuxt-error
  .error-icon
    opacity: 0.4
  .error-code
    font-size: 2em
    max-width: 300px
  .error-desc
    font-size: 1.2em
    opacity: 0.8
    max-width: 300px
</style>
