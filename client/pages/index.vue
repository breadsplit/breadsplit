<template lang='pug'>
v-container
  v-layout(column, justify-center, align-center)
    v-flex.text-xs-center(xs12, sm8, md6)
      template(v-for='(group, i) in groups')
        nuxt-link.group-entry(v-ripple, :to='`/group/${group.id}`', :style='groupCssVars(group)')
          v-icon mdi-{{ group.icon }}
          .groupname.text-truncate(v-text='group.name')

    v-divider.my-3

    v-flex.text-xs-center(xs12, sm8, md6)
      v-btn(@click='openDialog("newgroup")' rounded color='primary')
        v-icon.mr-2 mdi-plus
        span {{$t('ui.button_new_group')}}
</template>

<script lang='ts'>
import { Component, mixins } from 'nuxt-property-decorator'
import { NavigationMixin } from '~/mixins'

@Component
export default class Homepage extends mixins(NavigationMixin) {
  get groups() {
    return this.$store.getters['group/all']
  }

  groupCssVars(group) {
    return {
      '--group-color': group.color,
    }
  }
}
</script>

<style lang='stylus'>
.group-entry
  --group-color #000
  --group-padding 15px

  width 100px
  height 100px
  margin 5px
  display inline-block
  border-radius 5px
  position relative
  border 1px solid rgba(0,0,0,0.1)
  box-shadow 1px 1px 5px 0px rgba(50, 50, 50, 0.1)
  cursor pointer
  background white

  .theme--dark &
    background #252525

  .v-btn__content
    display block
    opacity 0.6
    text-align center

  .groupname
    position absolute
    left var(--group-padding)
    right var(--group-padding)
    bottom var(--group-padding)
    color var(--group-color)
    line-height 1em

  .v-icon
    position absolute
    left var(--group-padding)
    top var(--group-padding)
    color var(--group-color)
    font-size 25px

</style>
