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
import { Activity } from '~/types/models'
import GroupMixin from '~/mixins/group'
import MemberMixin from '~/mixins/member'

@Component
export default class Activities extends Mixins(GroupMixin, MemberMixin) {
  collapsed = true
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

  activityDescription(act: Activity) {
    const key = `${act.action}.${act.entity}`
    const by_name = `<b>${act.by_name || this.$t('ui.anonymous')}</b>`
    const entity_name = act.entity_name || act.entity_desc || ''
    switch (key) {
      case 'insert.transaction':
        return this.$t('acts.insert_transaction', [by_name, entity_name])
    }
    return key
  }

  onActivityClick(act: Activity) {
    this.$root.$snack('TODO: implement', { color: 'orange' })
  }
}
</script>
