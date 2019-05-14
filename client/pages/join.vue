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
        app-user-avatar(v-for='uid in serverGroup.viewers', :id='uid', :key='uid' size='32').ma-1

      v-btn(:color='color' dark :loading='joining' @click='join') {{$t('ui.button_join')}}

  app-login(ref='login')
</template>

<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator'
import { ServerGroup } from '~/types'

@Component({
  // @ts-ignore
  layout: 'base',
  watchQuery: true,
  async asyncData({ query }) {
    return { id: query.id }
  },
  head() {
    return {
      title: this.$t('ui.title_join_a_group'),
    }
  },
})
export default class JoinPage extends Vue {
  serverGroup: ServerGroup | undefined = undefined
  loading = true
  joining = false
  id: string | null = null

  get color() {
    return (this.group && this.group.color) || 'primary'
  }

  get group() {
    if (this.serverGroup)
      return this.serverGroup.present
    return undefined
  }

  async join() {
    if (!this.id)
      return
    if (!this.$store.getters['user/uid']) {
      // if false, the login is canceled
      // @ts-ignore
      if (!await this.$refs.login.login())
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
    this.serverGroup = await this.$fire.groupInfo(this.id)
    this.loading = false
  }
}
</script>
