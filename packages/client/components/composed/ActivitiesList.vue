<template lang='pug'>
v-list.activities-list.pb-4.pl-2.pt-0(flat style='background: transparent')
  template(v-for='item, index in activities')
    v-list-item.relax-list-item(v-on='on(item)' :ripple='false' :class='{head: isDifferentCreator(index)}')
      v-list-item-avatar
        app-user-avatar(v-if='isDifferentCreator(index)' :id='item.by' size='34')
      v-list-item-content
        v-list-item-subtitle.timestamp(v-if='isDifferentPeriod(index)' color='primary') {{d(item.timestamp)}}
        v-list-item-title(v-html='activityDescription(item)')
</template>

<script lang='ts'>
import { Component, Prop, mixins, Getter } from 'nuxt-property-decorator'
import { Activity } from '~/types'
import { getActivityDescription } from '~/core'
import { dateFromNow } from '~/utils'
import { NavigationMixin, UserInfoMixin, CommonMixin } from '~/mixins'

@Component
export default class ActivitiesList extends mixins(NavigationMixin, UserInfoMixin, CommonMixin) {
  @Prop(Array) readonly activities!: Activity[]
  @Getter('locale') locale!: string

  d (ts) {
    return dateFromNow(ts, this.currentLocale)
  }

  activityDescription (act: Activity) {
    return getActivityDescription(this.$t.bind(this), act, uid => this.getUserName(uid), { locale: this.currentLocale, showByName: false })
  }

  on (act: Activity) {
    if (!this.clickable(act))
      return {}
    return {
      click: () => this.onActivityClick(act),
    }
  }

  clickable (act: Activity) {
    // TODO: support more
    if (act.entity === 'transaction' && act.entity_id)
      return true
    return false
  }

  onActivityClick (act: Activity) {
    if (act.entity === 'transaction' && act.entity_id)
      this.gotoTransaction(act.entity_id)
  }

  isDifferentCreator (index: number) {
    const current = this.activities[index] || {}
    const prev = this.activities[index - 1] || {}
    return current.by !== prev.by
  }

  isDifferentPeriod (index: number) {
    const current = this.activities[index] || {}
    const prev = this.activities[index - 1] || {}
    return current.by !== prev.by || this.d(current.timestamp) !== this.d(prev.timestamp)
  }
}
</script>

<style lang='sass'>
.activities-list
  .v-list-item, .v-list-item__avatar
    min-height: 0 !important
    height: initial !important
  .timestamp
    padding-top: 8px
    padding-bottom: 5px
    color: var(--theme-primary) !important
  .v-list-item__content
    padding: 5px 0
</style>
