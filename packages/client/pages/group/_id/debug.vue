<template lang='pug'>
.group-page.px-8.scrolling(style='height:100vh')
  h2 Debug
  pre Synced Operations: {{clientGroup.synced_operations.length}}
  .py-3
  v-btn(@click='archive()' color='orange' dark) Archive Operations
  v-btn(@click='fix()' color='orange' dark) Fix Group
  v-btn(@click='back()' color='primary' text) Back to Group
</template>

<script lang='ts'>
import { Component, mixins } from 'nuxt-property-decorator'
import { GroupMixin, CommonMixin, NavigationMixin } from '~/mixins'

@Component
export default class GroupDebugPage extends mixins(CommonMixin, NavigationMixin, GroupMixin) {
  archive() {
    if (!confirm('Sure?'))
      return
    this.$fire.archiveGroupOperations(this.group.id)
  }

  fix() {
    if (!confirm('Sure?'))
      return
    this.$fire.functions.httpsCallable('fixGroup')({ id: this.group.id })
  }

  back() {
    this.gotoGroup(this.group.id)
  }
}
</script>
