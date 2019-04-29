<template lang='pug'>
div
  v-icon.error-icon(size='64') mdi-{{error.icon || 'alert-circle-outline'}}
  .error-code.text-xs-center {{error.statusCode}}
  .error-desc.text-xs-center {{error.message}}
  v-btn.error-return(flat, color='primary', to='/', nuxt) Home
  v-btn.error-return(flat, color='primary', @click='reload()') Reload
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      default: () => ({}),
    },
    payload: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    reload() {
      window.location.reload()
    },
  },
}
</script>
