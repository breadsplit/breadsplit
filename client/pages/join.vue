<template lang='pug'>
v-container
  .text-xs-center.mt-4.pt-3
    app-logo-name.large

    .my-4.py-2

    template(v-if='loading')
      v-progress-circular(indeterminate, size='80', color='grey lighten-2')
      p.ma-4 {{$t('ui.loading_group_info')}}

    template(v-else-if='!group')
      p Group Not Found
      p TODO:WRITING

    template(v-else)
      div(v-columns='"80px auto"')
        v-icon(:color='color', size='50') mdi-{{group.icon}}
        .text-xs-left.mt-2(v-html='$t("ui.invited_to_join", [group.name])' style='font-size: 1.4em')

      v-card.px-2.pb-2.ma-2
        v-list(two-line)
          template(v-for='(member, index) in members')
            v-list-tile(:key='member.id', avatar)
              v-list-tile-avatar
                app-user-avatar(:id='member.id', size='40')
              v-list-tile-content
                v-list-tile-title
                  span(v-if='isLocal(member.id)') {{member.name}}
                  app-user-info(v-else :id='member.id', field='name')
              v-list-tile-action(v-if='isLocal(member.id)')
                v-btn(:color='color' dark :loading='joining' @click='join(member.id)') 認領我
              v-list-tile-action(v-else)
                v-btn(disabled) 我有人囉
            v-divider

        v-btn(:color='color' dark :loading='joining' @click='join()') 我不在這ㄟ~

  app-login(ref='login')
</template>

<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator'
import { ServerGroup } from '~/types'
import { IsThisId } from '~/core'

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

  get members() {
    if (!this.group)
      return []
    return Object.values(this.group.members)
  }

  async join(memberId?: string) {
    if (!this.id)
      return
    if (!this.$store.getters['user/uid']) {
      // if false, the login is canceled
      // @ts-ignore
      if (!await this.$refs.login.login())
        return
    }
    this.joining = true
    await this.$fire.joinGroup(this.id, memberId)
    this.joining = false
  }

  isLocal(id: string) {
    return IsThisId.LocalMember(id)
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
