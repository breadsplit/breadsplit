<template lang="pug">
v-swatches(
  v-bind='$attrs',
  @input='input($event)',
  :colors='swatches',
  inline, :tabIndex='null')
</template>

<script>
import swatches from '~/meta/swatches'

export default {
  inheritAttrs: false,
  data() {
    return {
      swatches,
    }
  },
  methods: {
    input(e) {
      this.$emit('input', e)
    },
  },
}
</script>

<style lang="stylus">

$cols = 6
$margin = 3px
$size = 21px
$padding = 5px

.vue-swatches
  //width 'calc((%s + %s * 2) * %s + %s * 2)' % ($size $margin $cols $padding)
  padding $padding

.vue-swatches__swatch
  margin 1px $margin  !important
  width $size !important
  height $size !important
  border-radius 100% !important
  box-shadow none !important

.vue-swatches__swatch
  position relative
  font-size 0
  &:hover, &:focus
    opacity 0.90
    box-shadow inset 0 0 2px rgba(0, 0, 0, 0.75)
    outline none

  &.vue-swatches__swatch--border
    box-shadow inset 0 0 2px rgba(0, 0, 0, 0.75)

  &.vue-swatches__swatch--selected
    box-shadow inset 0 0 2px rgba(0, 0, 0, 0.75)

  .vue-swatches__diagonal--wrapper
    position absolute

.vue-swatches__check__wrapper
  position absolute
  width 100%
  height 100%

.vue-swatches__wrapper
  padding 0 !important

.vue-swatches__check__circle
  width 21px
  height 21px
  border-radius 50%

.vue-swatches__check__path
  fill white

.vue-swatches--has-children-centered
  display flex
  align-items center
  justify-content center
</style>
