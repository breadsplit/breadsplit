<template lang='pug'>
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

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'

@Component({
  inheritAttrs: false,
})
export default class SpeedDial extends Vue {
  fab= false
  tooltips=false
  tooltipsDisabled= false

  @Prop({ default: false }) readonly value!: boolean
  @Prop({ default: true }) readonly show!: boolean
  @Prop({ default: 'primary' }) readonly color!: string
  @Prop({ default: 'plus' }) readonly icon!: string
  @Prop({ default: 'close' }) readonly iconclose!: string
  @Prop({ default: () => ([]) }) readonly items!: {key: string; color?: string; text: string}[]

  @Watch('fab')
  onFabChanged() {
    this.tooltips = false
    this.tooltipsDisabled = false
    this.fab && setTimeout(() => {
      this.tooltips = true
      this.$nextTick(() => this.tooltipsDisabled = true)
    }, 200)
    this.$emit('input', this.fab)
  }

  @Watch('value', { immediate: true })
  onValueChanged() {
    this.fab = this.value
  }

  itemClick(item) {
    this.$emit('item-click', item.key)
  }
}
</script>
