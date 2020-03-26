<template lang="pug">
span
  template(v-if='unreadsOf(group.id)')
    v-avatar(size='25', color='red' dark)
      v-list-item-title.ma-2(v-text='unreadsOf(group.id)' style='color: white;')
  template(v-else-if='isSyncing(group.id) || !isPinned(group.id)')
    app-syncing-icon(:client-group='clientGroup')
  template(v-else)
    v-icon.op-50 mdi-pin
</template>

<script lang='ts'>
import { Component, Prop, Getter, Vue } from 'nuxt-property-decorator'

@Component
export default class GroupStateIcon extends Vue {
  @Prop() id!: string

  @Getter('group/unreadsOf') unreadsOf!: (id: string) => number
  @Getter('group/isSyncing') isSyncing!: (id: string) => boolean
  @Getter('group/isPinned') isPinned!: (id: string) => boolean

  get group() {
    return this.$store.state.group.cache.groups[this.id]
  }

  get clientGroup() {
    return this.$store.state.group.groups[this.id]
  }
}
</script>
