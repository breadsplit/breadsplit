<template lang='pug'>
v-card
  v-subheader {{$t('ui.tabs.activities')}}
  v-list.pa-0(two-line)
    template(v-for='(act, index) in displayed')
      v-divider(v-if='index!=0')
      v-list-tile(:key='act.id', avatar, @click='onActivityClick(act)')
        v-list-tile-avatar
          app-user-avatar(:id='act.by')
        v-list-tile-content
          v-list-tile-title(v-html='activityDescription(act)')
          v-list-tile-sub-title.time-label {{$dt(act.timestamp).fromNow()}}

    template(v-if='needShowMore')
      v-divider
      .text-xs-center
        v-btn(flat small fluid color='primary' @click='collapsed=false') Show all

    // TODO: remove false to enable if need
    template(v-if='needCollapsed && false')
      v-divider
      .text-xs-center
        v-btn(flat small fluid color='primary' @click='collapsed=true') Collapse

</template>

<script lang='ts'>
import { Component, Mixins } from 'vue-property-decorator'
import { Activity } from '~/types'
import GroupMixin from '~/mixins/group'
import UserInfoMixin from '~/mixins/userinfo'
import { getActivityDescription } from '~/core'

@Component
export default class Activities extends Mixins(GroupMixin, UserInfoMixin) {
  collapsed = false
  collapsed_amount = 3

  get activities() {
    return this.group.activities
      .map(a => a)
      .sort((a, b) => b.timestamp - a.timestamp)
  }

  get amount() {
    return this.activities.length
  }

  get displayed() {
    if (this.collapsed)
      return this.activities.slice(0, this.collapsed_amount)
    return this.activities
  }

  get needShowMore() {
    return this.collapsed && this.amount > this.collapsed_amount
  }

  get needCollapsed() {
    return !this.collapsed && this.amount > this.collapsed_amount
  }

  get locale() {
    return this.$store.getters.locale
  }

  activityDescription(act: Activity) {
    return getActivityDescription(this.$t.bind(this), act, this.locale, this.getUserName.bind(this))
  }

  onActivityClick(act: Activity) {
    this.$root.$snack('TODO: implement', { color: 'orange' })
  }
}
</script>
