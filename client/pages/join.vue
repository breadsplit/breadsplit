<template lang='pug'>
.scroll-page.height-100.join-page
  v-container
    .text-xs-center
      app-logo-name(:class='{large:!isMobile}')

      template(v-if='loading')
        v-progress-circular(indeterminate, size='80', color='grey lighten-2')
        p.ma-4 {{$t('ui.loading_group_info')}}

      template(v-else-if='!group')
        v-icon.ma-2(color='primary', size='100') mdi-emoticon-sad-outline
        p(class='primary--text' color='primary' style='font-size: 1.4em') Group Not Found

        v-btn.ma-2(color='teal lighten-1' dark @click='reload()')
          v-icon(size='20') mdi-autorenew
          span.ma-2 Reload
        v-btn.ma-2(color='teal lighten-1' dark @click='gotoHome()')
          v-icon(size='20') mdi-home-variant
          span.ma-2 Go Home

      div(v-else style='max-width:700px; margin: 0 auto;')
        p.ma-4(v-html='$t("ui.invited_to_join",[nameHtml])' style='font-size: 1.4em')
        v-subheader 我的名字是

        v-list(two-line, style='background:transparent;')
          template(v-for='(member, index) in members')
            template(v-if='index!=0 && !isLocal(member.uid) && isLocal(members[index-1].uid)')
              br
              v-subheader 以下為已存在用戶
            v-list-tile(:key='member.uid', avatar)
              v-list-tile-avatar
                app-user-avatar(:id='member.uid', size='40')
              v-list-tile-content
                v-list-tile-title
                  span(v-if='isLocal(member.uid)') {{member.name}}
                  app-user-info(v-else :id='member.uid', field='name')
              v-list-tile-action(v-if='isLocal(member.uid)')
                v-btn(color='primary' dark :loading='joining' @click='join(member.uid)') 認領我
              v-list-tile-action(v-else)
                v-icon(color='green lighten-1', size='40') mdi-account-check

        v-btn(v-if='uid', @click='join()', color='primary', large, round).pl-0
          app-user-avatar(:id='uid', :size='44').mr-3
          span {{$t('ui.join_as_me', [me.name])}}

        v-btn(v-else color='primary' dark :loading='joining' @click='join()') 我不在這ㄟ~

    app-login(ref='login')
</template>

<script lang='ts'>
import { Component, Mixins } from 'vue-property-decorator'
import { ServerGroup, Member } from '~/types'
import { IsThisId } from '~/core'
import { CommonMixin, UserInfoMixin, NavigationMixin } from '~/mixins'

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
export default class JoinPage extends Mixins(UserInfoMixin, CommonMixin, NavigationMixin) {
  serverGroup: ServerGroup | undefined = undefined
  loading = true
  joining = false
  id: string | null = null

  get group() {
    if (this.serverGroup)
      return this.serverGroup.present
    return undefined
  }

  get nameHtml() {
    if (this.group)
      return `<span class="primary--text">${this.group.name}</span>`
    return ''
  }

  get members() {
    if (!this.group)
      return []
    const orderList: Member[] = []
    Object.values(this.group.members)
      .filter(m => !m.removed && m.uid !== null)
      .forEach((m) => {
        if (this.isLocal(m.uid as string))
          orderList.unshift(m)
        else
          orderList.push(m)
      })
    return orderList
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
    this.$root.$apploading.open('Joining group...')
    await this.$fire.joinGroup(this.id, memberId)
    this.$root.$apploading.close()
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
