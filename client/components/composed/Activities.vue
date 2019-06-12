<template lang='pug'>
v-card
  v-subheader
    v-icon.mr-1 mdi-calendar-text
    span {{$t('ui.tabs.activities')}}

  app-date-grouping-list(:data='group.activities' expand-icon='')
    template(v-slot:header-append='{items, index, date}')
      span.op-50 ({{items.length}})
    template(v-slot:item='{items, index, date}')
      app-activities-list(:activities='items' :key='date')
</template>

<script lang='ts'>
import { Component, mixins } from 'nuxt-property-decorator'
import { GroupMixin } from '../../mixins'

@Component
export default class Activities extends mixins(GroupMixin) {
}
</script>
