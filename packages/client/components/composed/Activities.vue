<template lang='pug'>
v-card(flat background='transparent')
  app-date-grouping-list(:data='group.activities' expand-icon='')
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
