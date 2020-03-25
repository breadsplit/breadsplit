<template lang="pug">
v-icon(v-if='clientGroup && clientGroup.online' :color='color' :class='classes') {{icon}}
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { ClientGroup } from '~/types'

@Component
export default class SyncingIcon extends Vue {
  @Prop() clientGroup!: ClientGroup

  get icon() {
    if (!this.clientGroup)
      return
    if (this.clientGroup.syncing_state === 'in_progress')
      return 'mdi-cloud-sync'
    if (this.clientGroup.syncing_state === 'done')
      return 'mdi-cloud-check'
    if (this.clientGroup.syncing_state === 'error')
      return 'mdi-alert'
  }

  get classes() {
    if (!this.clientGroup)
      return
    if (this.clientGroup.syncing_state === 'in_progress')
      return 'syncing-icon'
    if (this.clientGroup.syncing_state === 'done')
      return 'op-25'
  }

  get color() {
    if (!this.clientGroup)
      return
    if (this.clientGroup.syncing_state === 'error')
      return 'red'
    if (this.clientGroup.syncing_state === 'done')
      return 'grey'
    return 'primary'
  }
}
</script>
