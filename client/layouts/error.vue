<template lang='pug'>
v-layout.nuxt-error.my-5.py-3(column, justify-center, align-center)
  v-flex.text-xs-center(xs12, sm8, md6)
    component(:is='errorPage' :error='parsedError.error', :payload='parsedError.payload')
</template>

<script>
import * as ErrorPages from '@/components/error'
import DefaultErrorPages from '@/components/error/default'

export default {
  name: 'NuxtError',
  layout: 'default',
  props: {
    error: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    parsedError() {
      if (this.error.type)
        return this.error
      else
        return { error: this.error, type: 'common' }
    },
    errorPage() {
      return ErrorPages[this.parsedError.type] || DefaultErrorPages
    },
  },
}
</script>

<style lang='stylus'>
.nuxt-error
  .error-icon
    opacity 0.4
  .error-code
    font-size 2em
    max-width 300px
  .error-desc
    font-size 1.2em
    opacity 0.8
    max-width 300px
</style>
