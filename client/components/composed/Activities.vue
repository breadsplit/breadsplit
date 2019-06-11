<template lang='pug'>
v-card
  v-subheader
    v-icon.mr-1 mdi-calendar-text
    span {{$t('ui.tabs.activities')}}

  app-expandable-list(:data='activities')
    template(v-slot:item='{items, index, date}')
      app-activities-list(:activities='items' :key='date')
</template>

<script lang='ts'>
import { Component, mixins, Prop } from 'nuxt-property-decorator'
import { GroupMixin, UserInfoMixin, NavigationMixin, CommonMixin } from '~/mixins'

@Component
export default class Activities extends mixins(GroupMixin, UserInfoMixin, NavigationMixin, CommonMixin) {
  @Prop({ default: 10 }) readonly max!: number

  get activities() {
    return this.group.activities
      .map(a => a)
      .sort((a, b) => b.timestamp - a.timestamp)
  }
}
</script>
