<template lang='pug'>
.scroll-page.height-100.join-page
  v-container
    .text-xs-center
      app-logo-name(:class='{large:!isMobile}')

      template(v-if='loading')
        v-progress-circular(indeterminate, size='80', color='grey lighten-2')
        p.ma-4 {{$t('ui.join.loading_group_info')}}

      template(v-else-if='!group')
        v-icon.ma-2(color='primary', size='100') mdi-emoticon-sad-outline
        p(class='primary--text' color='primary' style='font-size: 1.4em') {{$t('ui.join.group_not_found')}}

        v-btn.ma-2(color='teal lighten-1' dark @click='reload()')
          v-icon(size='20') mdi-autorenew
          span.ma-2 {{$t('ui.button_refresh')}}
        v-btn.ma-2(color='teal lighten-1' dark @click='gotoHome()')
          v-icon(size='20') mdi-home-variant
          span.ma-2 {{$t('ui.button_go_home')}}

      div(v-else style='max-width:700px; margin: 0 auto;')
        p.ma-4(v-if='group' style='font-size: 1.4em')
          i18n(path='ui.join.invited_to_join')
            b.primary--text {{group.name}}

        v-subheader {{$t('ui.join.my_name_is')}}

        v-list(two-line, style='background:transparent;')
          template(v-for='(member, index) in members')
            template(v-if='index!=0 && !isLocal(member.uid) && isLocal(members[index-1].uid)')
              br
              v-subheader {{$t('ui.join.existing_users')}}
            v-list-item(:key='member.uid')
              v-list-item-avatar
                app-user-avatar(:id='member.uid', size='40')
              v-list-item-content
                v-list-item-title
                  app-user-info(:member='member', field='name')
                  v-icon.ml-1(v-if='!isLocal(member.uid)' color='green lighten-1', size='20') mdi-check
              v-list-item-action(v-if='isLocal(member.uid)')
                v-btn(color='primary' text @click='join(member.uid)').px-3 {{$t('ui.join.this_is_me')}}

        v-btn(v-if='uid' @click='join()' color='primary' large rounded).pl-0
          app-user-avatar(:id='uid', :size='44').mr-3
          span {{$t('ui.join_as_me', [me.name])}}

        v-btn.px-4(v-else color='primary' rounded dark @click='join()') {{$t('ui.join.join_anonymous')}}

    app-login(ref='login')
</template>

<script lang='ts'>
import { Component, mixins } from 'nuxt-property-decorator'
import { ServerGroup, Member } from '~/types'
import { IsThisId } from '~/core'
import { CommonMixin, UserInfoMixin, NavigationMixin } from '~/mixins'
import Login from '~/components/dialogs/Login.vue'

@Component({
  // @ts-ignore
  layout: 'base',
  watchQuery: true,
  async asyncData({ query }) {
    return {
      id: query.id,
    }
  },
  head() {
    return {
      title: this.$t('ui.join.title'),
    }
  },
})
export default class JoinPage extends mixins(UserInfoMixin, CommonMixin, NavigationMixin) {
  serverGroup: ServerGroup | null = null
  loading = true
  joining = false
  id: string | null = null

  $refs!: {
    login: Login
  }

  get group() {
    if (this.serverGroup)
      return this.serverGroup.present
    return undefined
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
      if (!await this.$refs.login.login())
        return
    }
    this.$apploading.open('Joining group...')
    await this.$fire.joinGroup(this.id, memberId)
    this.$apploading.close()
  }

  isLocal(id: string) {
    return IsThisId.LocalMember(id)
  }

  async mounted() {
    this.loading = true
    if (this.$store.getters['group/all'].map(g => g.id).includes(this.id)) {
      this.$router.replace(`/group/${this.id}`)
      this.$snack(this.$t('tips.already_joined_group'))
      return
    }
    if (!this.id) {
      this.loading = false
      return
    }
    await this.$fire.waitForInitialized()
    this.serverGroup = await this.$fire.groupInfo(this.id)
    this.loading = false
  }
}
</script>
