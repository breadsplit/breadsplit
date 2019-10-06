<template lang='pug'>
v-fab-transition
  v-speed-dial(
    v-model='fab'
    v-bind='$attrs'
    v-show='show'
    transition='slide-y-reverse-transition'
  )
    template(v-slot:activator='')
      v-btn(v-model='fab' :color='fab ? "transparent" : color' :depressed='fab' dark fab style='z-index: 30')
        v-icon(v-if='fab') mdi-{{iconclose}}
        v-icon(v-else) mdi-{{icon}}
    .speed-dial-container
      .actions
        .action-with-text.pa-3.pb-5(
          v-for='item in items'
          :style='item.style'
          @click='itemClick(item)'
        )
          v-btn.action.mx-auto(fab, dark, :color='item.color || "primary"')
            v-icon mdi-{{item.icon}}
          span.text.mx-auto(style='color:#fff') {{item.text}}
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'nuxt-property-decorator'

@Component({
  inheritAttrs: false,
})
export default class SpeedDial extends Vue {
  fab= false
  @Prop({ default: false }) readonly value!: boolean
  @Prop({ default: true }) readonly show!: boolean
  @Prop({ default: 'primary' }) readonly color!: string
  @Prop({ default: 'plus' }) readonly icon!: string
  @Prop({ default: 'close' }) readonly iconclose!: string
  @Prop({ default: () => ([]) }) readonly items!: {key: string; color?: string; text: string}[]

  @Watch('fab')
  onFabChanged () {
    this.$emit('input', this.fab)
  }

  @Watch('value', { immediate: true })
  onValueChanged () {
    this.fab = this.value
  }

  itemClick (item) {
    this.$emit('item-click', item.key)
    if (item.handler)
      item.handler()
  }
}
</script>

<style lang="sass">
.speed-dial-container
  left: 0
  right: 0
  bottom: 0
  height: calc(100vh + 300px)
  width: 100vw
  margin-bottom: -300px
  background: linear-gradient(0deg, rgba(0,0,0,0.8), rgba(0,0,0, 0.2))
  position: relative

  .actions
    position: absolute
    bottom: 280px
    text-align: center
    left: 0
    right: 0

    .action-with-text
      vertical-align: top
      width: 110px

      &:not(:first-child):not(:last-child)
        margin-top: -20px !important

      .text
        border-radius: 4px
        padding: 3px
</style>
