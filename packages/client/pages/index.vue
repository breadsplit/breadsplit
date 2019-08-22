<template lang='pug'>
v-container.text-center
  template(v-if='!groups.length')
    app-empty-placeholder(
      icon='bread-slice-outline'
      :title='$t("placeholders.groups.title")'
      :desc='$t("placeholders.groups.desc")'
    )
      v-btn(@click='gotoNewGroup' rounded color='primary')
        v-icon.mr-2 mdi-plus
        span {{$t('ui.button_new_group')}}

  template(v-else)
    template(v-for='(group, i) in groups')
      nuxt-link.group-entry(v-ripple, :to='`/group/${group.id}`', :style='groupCssVars(group)')
        v-icon mdi-{{ group.icon }}
        .groupname(v-text='group.name')

    .my-3

    v-btn(@click='gotoNewGroup' rounded color='primary')
      v-icon.mr-2 mdi-plus
      span {{$t('ui.button_new_group')}}

    .my-12
    app-credit.op-25(simple='true')

    v-btn(@click='reload' text small color='grey').op-25 Reload
</template>

<script lang='ts'>
import { Component, mixins, Getter } from 'nuxt-property-decorator'
import { NavigationMixin } from '~/mixins'
import { Group } from '~/types'

@Component
export default class Homepage extends mixins(NavigationMixin) {
  @Getter('group/all') groups!: Group[]

  groupCssVars (group) {
    return {
      '--group-color': group.color,
    }
  }

  reload () {
    window.location.reload()
  }
}
</script>

<style lang='sass'>
.group-entry
  --group-color: #000
  --group-padding: 15px

  width: 140px
  height: 85px
  margin: 5px
  display: inline-block
  border-radius: 8px
  position: relative
  border: 1px solid rgba(0,0,0,0.1)
  box-shadow: 1px 1px 5px 0px rgba(50, 50, 50, 0.1)
  cursor: pointer
  background: white

  .theme--dark &
    background: #252525

  .v-btn__content
    display: block
    opacity: 0.6
    text-align: center

  .groupname
    position: absolute
    left: var(--group-padding)
    right: var(--group-padding)
    bottom: var(--group-padding)
    color: var(--group-color)
    line-height: 1em
    white-space: nowrap
    text-align: left
    text-overflow: ellipsis
    overflow: hidden

  .v-icon
    position: absolute
    left: var(--group-padding)
    top: var(--group-padding)
    color: var(--group-color)
    font-size: 25px
</style>
