<template lang='pug'>
v-container
  .text-xs-center.mt-4.pt-4
    template(v-if='loading')
      v-progress-circular(indeterminate, size='80', color='grey lighten-2')
      p.ma-4 {{$t('ui.loading_group_info')}}
    template(v-else)
      p(v-html='$t("ui.join_group", [name])' style='font-size: 1.8em')

      v-btn(:color='joining ? "grey" : "primary"' :disabled='!id' :loading='joining' @click='join') {{$t('ui.button_join')}}
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import { Group } from '~/types/models'

@Component({
  watchQuery: true,
  async asyncData({ query }) {
    return { id: query.id }
  },
})
export default class JoinPage extends Vue {
  group: Group | undefined
  loading = true
  joining = false
  id: string | null = null

  get name() {
    return (this.group && this.group.name) || '????'
  }

  async join() {
    if (!this.id)
      return
    this.joining = true
    await this.$fire.joinGroup(this.id)
    this.joining = false
  }

  mounted() {
    if (this.$store.getters['group/all'].map(g => g.id).includes(this.id)) {
      this.$router.replace(`/group/${this.id}`)
      // @ts-ignore
      this.$root.$snack(this.$t('tips.already_joined_group'))
      return
    }
    this.loading = false
  }
}
</script>
