<template lang='pug'>
.scroll-page
  v-container
    .text-xs-center.mt-4.pt-3
      app-logo-name(:class='{large:!isMobile}')
      .my-4.py-2

      template(v-if='loading')
        v-progress-circular(indeterminate, size='80', color='grey lighten-2')
        p.ma-4 {{$t('ui.loading_group_info')}}

      template(v-else-if='!group')
        p Group Not Found
        p TODO:WRITING

      template(v-else)
        div(v-columns='"80px auto"')
          v-icon(color='primary', size='50') mdi-{{group.icon}}
          .text-xs-left.mt-2(v-html='$t("ui.invited_to_join",[])' style='font-size: 1.4em')
          span.primary--text {{group.name}}

        span.primary--text 我的名字是

        v-card.px-2.pb-2.ma-2
          v-list(two-line style='height: 300px; overflow-y: auto;')
            template(v-for='(member, index) in members')
              template(v-if='index!=0 && !isLocal(member.id) && isLocal(members[index-1].id)')
                br
                span.primary--text 以下為已存在用戶
              v-list-tile(:key='member.id', avatar)
                v-list-tile-avatar
                  app-user-avatar(:id='member.id', size='40')
                v-list-tile-content
                  v-list-tile-title
                    span(v-if='isLocal(member.id)') {{member.name}}
                    app-user-info(v-else :id='member.id', field='name')
                v-list-tile-action(v-if='isLocal(member.id)')
                  v-btn(color='primary' dark :loading='joining' @click='join(member.id)') 認領我
                v-list-tile-action(v-else)
                  v-icon(color='green lighten-1', size='50') mdi-account-check
              v-divider

        v-btn(color='primary' dark :loading='joining' @click='join()') 我不在這ㄟ~

    app-login(ref='login')
</template>

<script lang='ts'>
import { Component, Mixins } from 'vue-property-decorator'
import { ServerGroup, Member } from '~/types'
import { IsThisId } from '~/core'
import { CommonMixin } from '~/mixins'

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
export default class JoinPage extends Mixins(CommonMixin) {
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
    const orderList: Member[] = []
    Object.values(this.group.members)
      .filter(m => !m.removed)
      .forEach((m) => {
        if (this.isLocal(m.id))
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
