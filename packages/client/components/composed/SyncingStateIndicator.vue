<template lang="pug">
v-menu(offset-y)
  template(v-slot:activator='{ on }')
    v-btn(icon text v-on='on')
      app-syncing-icon(:client-group='clientGroup')
  v-card.pa-3
    span {{$t(`ui.syncing.${clientGroup.syncing_state}`)}}
    template(v-if='clientGroup.syncing_state === "error"')
      pre {{clientGroup.syncing_error}}
      v-btn(@click='retry' color='primary' text) {{$t('ui.button_retry')}}
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import { GroupMixin } from '~/mixins'

@Component
export default class SyncingStateIndicator extends mixins(GroupMixin) {
  retry () {
    if (!this.clientGroup)
      return
    this.$fire.uploadLocalChanges([this.clientGroup])
  }
}
</script>
