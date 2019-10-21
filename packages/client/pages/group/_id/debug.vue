<template lang='pug'>
.group-page.px-3.scrolling(style='height:100vh')
  h2 Debug
  pre {{clientGroup.operations.length}}
  v-btn(@click='archive()' color='orange' dark) Archive Operations
</template>

<script lang='ts'>
import { Component, mixins } from 'nuxt-property-decorator'
import { GroupMixin, CommonMixin, NavigationMixin } from '~/mixins'

@Component
export default class GroupDebugPage extends mixins(CommonMixin, NavigationMixin, GroupMixin) {
  archive () {
    if (!confirm('Sure?'))
      return
    this.$fire.archiveGroupOperations(this.group.id)
  }
}
</script>
