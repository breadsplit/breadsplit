<template lang='pug'>
v-card
  v-subheader
    v-icon.mr-1 mdi-calendar-text
    span {{$t('ui.tabs.activities')}}

  app-date-grouping-list(:data='group.activities')
    template(v-slot:item='{items, index, date}')
      app-activities-list(:activities='items' :key='date')
</template>

<script lang='ts'>
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class Activities extends Vue {
}
</script>
