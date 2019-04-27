<template lang='pug'>
v-dialog(
  v-model='dialog', @keydown.esc='cancel'
  v-bind='$attrs', style='z-index:200'
)
  slot(v-if='dialog')
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

  computed: {
    isOpened() {
      return !!this.dialog
    },
  },

  watch: {
    dialog() {
      if (!this.dialog)
        this.$emit('exit')
    },
  },

  methods: {
    open(options = {}) {
      this.dialog = true
      this.options = options
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    close(flag = true) {
      this.resolve(flag)
      if (this.dialog)
        this.dialog = false
    },
  },
}
</script>
