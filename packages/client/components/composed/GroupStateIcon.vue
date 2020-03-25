<template lang="pug">
span
  template(v-if='unreadsOf(group.id)')
    v-avatar(size='25', color='red' dark)
      v-list-item-title.ma-2(v-text='unreadsOf(group.id)' style='color: white;')
  template(v-else='isSyncing(group.id)')
    app-syncing-icon(:client-group='clientGroup')
</template>

<script lang='ts'>
import { Component, Vue, Prop, Getter } from 'nuxt-property-decorator'

@Component
export default class GroupStateIcon extends Vue {
  @Prop() id!: string

  @Getter('group/unreadsOf') unreadsOf!: (id: string) => number

  get group() {
    return this.$store.state.group.cache.groups[this.id]
  }

  get clientGroup() {
    return this.$store.state.group.groups[this.id]
  }
}
</script>
