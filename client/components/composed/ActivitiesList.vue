<template lang='pug'>
v-list.pa-0
  template(v-for='(act, index) in activities')
    v-divider(v-if='index!=0')
    v-list-item(:key='act.id', avatar, @click='onActivityClick(act)')
      v-list-item-avatar
        app-user-avatar(:id='act.by' size='38')
      v-list-item-content
        v-list-item-title(v-html='activityDescription(act)')
        v-list-item-subtitle.sub-label {{$dt(act.timestamp).fromNow()}}
</template>

<script lang='ts'>
import { Component, Prop, mixins, Getter } from 'nuxt-property-decorator'
import { Activity } from '~/types'
import { getActivityDescription } from '~/core'
import { NavigationMixin, UserInfoMixin } from '~/mixins'

@Component
export default class ActivitiesList extends mixins(NavigationMixin, UserInfoMixin) {
  @Prop(Array) readonly activities!: Activity[]
  @Getter('locale') locale!: string

  activityDescription(act: Activity) {
    return getActivityDescription(this.$t.bind(this), act, this.locale, id => this.getUserName(id))
  }

  onActivityClick(act: Activity) {
    if (act.entity === 'transaction' && act.entity_id)
      this.gotoTransaction(act.entity_id)
  }
}
</script>
