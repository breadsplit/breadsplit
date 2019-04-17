<template lang='pug'>
v-dialog(v-model='dialog', @keydown.esc='cancel', v-bind='$attrs', style='z-index:200')
  slot
</template>

<script>
export default {
  inheritAttrs: false,
  data() {
    return {
      dialog: false,
      resolve: null,
      reject: null,
      options: {},
    }
  },
  methods: {
    open(options) {
      this.dialog = true
      this.options = options
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    close(flag = true) {
      this.resolve(flag)
      this.dialog = false
    },
  },
}
</script>
