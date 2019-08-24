<template lang='pug'>
.scroll-page.height-100.join-page
  v-container
    .text-center
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

        // Local members list
        template(v-if='localMembers.length')
          v-subheader {{$t('ui.join.my_name_is')}}

          v-list(style='background:transparent;')
            template(v-for='(member, index) in localMembers')
              v-list-item(:key='member.uid')
                v-list-item-avatar
                  app-user-avatar(:member='member', size='40')
                v-list-item-content.text-left
                  v-list-item-title
                    app-user-info(:member='member', field='name')
                v-list-item-action
                  v-btn.px-4(color='primary' rounded @click='join(member.uid)') {{$t('ui.join.this_is_me')}}

          .op-75.mb-3 {{$t('ui.join.not_in_the_list_question')}}

        // Join button
        v-btn(v-if='uid' @click='join()' color='primary' large rounded).pl-0
          app-user-avatar(:id='uid', :size='44' style='margin-left: -1.1px').mr-3
          span {{$t('ui.join_as_me', [me.name])}}

        v-btn.px-4(v-else color='primary' outlined rounded @click='join()') {{$t('ui.join.join_anonymous')}}

        v-divider.mb-3.mt-6

        // Other members list
        v-subheader {{$t('ui.join.existing_users')}}
        v-list(style='background:transparent;')
          template(v-for='(member, index) in onlineMembers')
            v-list-item(:key='member.uid')
              v-list-item-avatar
                app-user-avatar(:member='member', size='40')
              v-list-item-content.text-left
                v-list-item-title
                  app-user-info(:member='member', field='name')

    app-login(ref='login')
</template>

<script lang='ts'>
import { Component, mixins } from 'nuxt-property-decorator'
import { ServerGroup } from '~/types'
import { IsThisId } from '~/core'
import { CommonMixin, UserInfoMixin, NavigationMixin } from '~/mixins'
import Login from '~/components/dialogs/Login.vue'

@Component({
  // @ts-ignore
  layout: 'base',
  watchQuery: true,
  async asyncData ({ query }) {
    return {
      id: query.id,
    }
  },
  head () {
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

  get group () {
    if (this.serverGroup)
      return this.serverGroup.present
    return undefined
  }

  get members () {
    if (!this.group)
      return []
    return Object.values(this.group.members)
  }

  get localMembers () {
    return this.members.filter(m => IsThisId.LocalMember(m.uid))
  }

  get onlineMembers () {
    return this.members.filter(m => !IsThisId.LocalMember(m.uid))
  }

  async join (memberId?: string) {
    if (!this.id)
      return
    if (!this.uid)
      await this.$refs.login.login()

    setTimeout(async () => {
      if (!this.uid || !this.id)
        return // login canceled

      this.$apploading.open(this.$t('ui.join.join_in_progress'))
      await this.$fire.joinGroup(this.id, memberId)
      this.$apploading.close()
    }, 300)
  }

  isLocal (id: string) {
    return IsThisId.LocalMember(id)
  }

  async mounted () {
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
