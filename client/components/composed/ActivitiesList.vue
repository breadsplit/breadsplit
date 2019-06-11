<template lang='pug'>
v-list.pa-0(two-line)
  template(v-for='(act, index) in activities')
    v-divider(v-if='index!=0')
    v-list-tile(:key='act.id', avatar, @click='onActivityClick(act)')
      v-list-tile-avatar
        app-user-avatar(:id='act.by')
      v-list-tile-content
        v-list-tile-title(v-html='activityDescription(act)')
        v-list-tile-sub-title.time-label {{$dt(act.timestamp).fromNow()}}
</template>

<script lang='ts'>
import { Component, Prop, mixins } from 'nuxt-property-decorator'
import { Activity } from '~/types'
import { getActivityDescription } from '~/core'
import { NavigationMixin, UserInfoMixin } from '~/mixins'

@Component
export default class ActivitiesList extends mixins(NavigationMixin, UserInfoMixin) {
  @Prop(Array) readonly activities!: Activity[]

  get locale() {
    return this.$store.getters.locale
  }

  activityDescription(act: Activity) {
    return getActivityDescription(this.$t.bind(this), act, this.locale, id => this.getUserName(id))
  }

  onActivityClick(act: Activity) {
    if (act.entity === 'transaction' && act.entity_id)
      this.gotoTransaction(act.entity_id)
  }
}
</script>
