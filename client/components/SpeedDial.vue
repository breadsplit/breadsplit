<template lang="pug">
v-fab-transition
  v-speed-dial(v-model='fab', v-bind='$attrs', v-show='show')
    template(v-slot:activator='')
      v-btn(v-model='fab', :color='color', dark, fab='')
        v-icon mdi-{{icon}}
        v-icon mdi-{{iconclose}}
    v-tooltip(v-for='item in items', :key='item.key', :disabled='tooltipsDisabled', left, :value='show && tooltips')
      template(slot='activator')
        v-btn(fab, dark, small, :color='item.color || "accent"', @click='itemClick(item)')
          v-icon mdi-{{item.icon}}
      span {{item.text}}
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    value: { type: Boolean, default: false },
    show: { type: Boolean, default: true },
    color: { type: String, default: 'primary' },
    icon: { type: String, default: 'plus' },
    iconclose: { type: String, default: 'close' },
    items: { type: Array, default: () => ([]) },
  },
  data() {
    return {
      fab: false,
      tooltips: false,
      tooltipsDisabled: false,
    }
  },
  watch: {
    fab() {
      this.tooltips = false
      this.tooltipsDisabled = false
      this.fab && setTimeout(() => {
        this.tooltips = true
        this.$nextTick(() => this.tooltipsDisabled = true)
      }, 200)
      this.$emit('input', this.fab)
    },
    value: {
      immediate: true,
      handler() {
        this.fab = this.value
      },
    },
  },
  methods: {
    itemClick(item) {
      this.$emit('item-click', item.key)
    },
  },
}
</script>
