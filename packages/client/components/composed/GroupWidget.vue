<template lang='pug'>
nuxt-link.group-widget.pa-3(
  v-ripple
  :to='`/group/${group.id}`'
  :style='groupCssVars(group)'
  v-columns='"max-content auto max-content"'
)
  .group-icon
    v-icon(size='30') mdi-{{ group.icon }}
  .pa-2
    .group-name(v-text='group.name')
    .group-members {{membersCount}} members
  .group-status-icon(v-if='group.online')
    app-group-state-icon(:id='group.id')
</template>

<script lang='ts'>
import { Component, mixins, Prop } from 'nuxt-property-decorator'
import { NavigationMixin } from '~/mixins'
import { Group, ClientGroup } from '~/types'

@Component
export default class GroupWidget extends mixins(NavigationMixin) {
  @Prop(String) id!: string

  get group (): Group {
    return this.$store.getters['group/id'](this.id)
  }

  get clientGroup (): ClientGroup {
    return this.$store.getters['group/clientGroupById'](this.id)
  }

  get membersCount () {
    return Object.values(this.group.members).filter(m => !m.removed).length
  }

  groupCssVars (group) {
    return {
      '--group-color': group.color,
    }
  }
}
</script>

<style lang='sass'>
.group-widget
  --group-color: #000
  --group-padding: 15px

  height: 85px
  margin: 10px 5px
  display: block
  border-radius: 8px
  position: relative
  border: 1px solid rgba(0,0,0,0.1)
  box-shadow: 1px 1px 5px 0px rgba(50, 50, 50, 0.1)
  cursor: pointer
  background: white
  text-decoration: none
  color: var(--group-color)
  text-align: left
  overflow: hidden
  font-weight: normal

  .theme--dark &
    background: #191919

  & > *
    margin-top: auto
    margin-bottom: auto

  .group-status-icon
    padding: 0 0.5em

  .group-icon
    padding: 0 1em

    .v-icon
      color: var(--group-color)

  .group-name
    line-height: 1em
    white-space: nowrap
    text-align: left
    text-overflow: ellipsis
    overflow: hidden
    color: var(--group-color)

  .group-members
    line-height: 1em
    font-size: 0.8em
    opacity: 0.5
    color: rgba(125,125,125)
</style>
