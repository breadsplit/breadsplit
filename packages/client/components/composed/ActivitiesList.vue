<template lang='pug'>
v-list.activities-list.pb-4.pl-2.pt-0(flat style='background: transparent')
  template(v-for='([act, prev], index) in parsed')
    v-list-item.relax-list-item(:key='act.id' v-on='on(act)' :ripple='false' :class='{head: act.by !== prev.by}')
      v-list-item-avatar
        app-user-avatar(v-if='act.by !== prev.by' :id='act.by' size='34')
      v-list-item-content
        v-list-item-subtitle.timestamp(v-if='act.by !== prev.by || d(act.timestamp) !== d(prev.timestamp)' color='primary') {{d(act.timestamp)}}
        v-list-item-title(v-html='activityDescription(act)')
</template>

<script lang='ts'>
import { Component, Prop, mixins, Getter } from 'nuxt-property-decorator'
import { Activity } from '~/types'
import { getActivityDescription } from '~/core'
import { dateFromNow } from '~/../utils/formatters'
import { NavigationMixin, UserInfoMixin, CommonMixin } from '~/mixins'

@Component
export default class ActivitiesList extends mixins(NavigationMixin, UserInfoMixin, CommonMixin) {
  @Prop(Array) readonly activities!: Activity[]
  @Getter('locale') locale!: string

  get parsed () {
    return this.activities.map((act, idx) => {
      const prev = this.activities[idx - 1] || {}
      return [act, prev]
    })
  }

  d (ts) {
    return dateFromNow(ts, this.currentLocale)
  }

  activityDescription (act: Activity) {
    return getActivityDescription(this.$t.bind(this), act, this.locale, id => '')
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
}
</script>

<style lang='sass'>
.activities-list
  .v-list-item, .v-list-item__avatar
    min-height: 0 !important
    height: initial !important
  .head
    margin-top: 10px
  .timestamp
    padding-top: 8px
    padding-bottom: 5px
    color: var(--theme-primary) !important
  .v-list-item__content
    padding: 5px 0
</style>
