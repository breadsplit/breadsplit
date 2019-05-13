<template lang='pug'>
v-container
  .text-xs-center.mt-4.pt-4
    template(v-if='loading')
      v-progress-circular(indeterminate, size='80', color='grey lighten-2')
      p.ma-4 {{$t('ui.loading_group_info')}}

    template(v-else-if='!group')
      p Group Not Found
      p TODO:WRITING

    template(v-else)

      v-icon(:color='color', size='120').ma-3 mdi-{{group.icon}}
      div(v-html='$t("ui.invited_to_join", [group.name])' style='font-size: 1.8em')
      .avatars.mb-3
        app-user-avatar(v-for='uid in group.viewers', :id='uid', :key='uid' size='32').ma-1

      v-btn(:color='color' dark :loading='joining' @click='join') {{$t('ui.button_join')}}
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import { Group } from '~/types'

@Component({
  watchQuery: true,
  async asyncData({ query }) {
    return { id: query.id }
  },
})
export default class JoinPage extends Vue {
  group: Group | null = null
  loading = true
  joining = false
  id: string | null = null

  get color() {
    return (this.group && this.group.color) || 'primary'
  }

  async join() {
    if (!this.id)
      return
    if (!this.$store.getters['user/uid']) {
      // @ts-ignore
      this.$root.$login.open()
      // TODO:CODE: auto join after login
      return
    }
    this.joining = true
    await this.$fire.joinGroup(this.id)
    this.joining = false
  }

  async mounted() {
    this.loading = true
    if (this.$store.getters['group/all'].map(g => g.id).includes(this.id)) {
      this.$router.replace(`/group/${this.id}`)
      // @ts-ignore
      this.$root.$snack(this.$t('tips.already_joined_group'))
      return
    }
    if (!this.id) {
      this.loading = false
      return
    }
    // @ts-ignore
    this.group = await this.$fire.groupMeta(this.id)
    this.loading = false
  }
}
</script>
