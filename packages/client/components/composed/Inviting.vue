<template lang='pug'>
v-card.inviting.pa-4.mb-2(flat color='transparent')
  .vertical-aligned-grid(@click='toggle' v-columns='"auto max-content"')
    v-subheader.pl-1
      span
        div {{$t('ui.share.join_via_link')}}
        .op-50(v-if='public') {{$t('ui.share.join_via_link_enabled')}}
        .op-50(v-else) {{$t('ui.share.join_via_link_disabled')}}
    v-switch.mt-3.mb-n3.mouse-pass(:input-value='public' :loading='loading' inset color='primary')

  v-slide-y-reverse-transition
    v-btn.mt-2(color='primary' block depressed v-show='public' @click='shareInviteLink')
      v-icon.mr-3 mdi-share
      span {{$t('ui.share.share_link')}}
</template>

<script lang='ts'>
import { Component, mixins } from 'nuxt-property-decorator'
import GroupMixin from '~/mixins/group'
import { Share } from '~/utils/share'

@Component
export default class Inviting extends mixins(GroupMixin) {
  loading = false

  get public () {
    if (this.clientGroup && this.clientGroup.options)
      return this.clientGroup.options.public || false
    return false
  }

  async shareInviteLink () {
    if (!this.inviteLink)
      return
    await Share(
      this,
      this.$t('prompt.invite_friends').toString(),
      this.$t('prompt.share_message', [this.group.name]).toString(),
      this.inviteLink,
    )
  }

  toggle () {
    if (!this.loading)
      this.update(!this.public)
  }

  async update (value: boolean) {
    this.loading = true
    try {
      await this.$fire.changeGroupOptions(this.group.id, { public: value })
    }
    catch (e) {
      console.error(e)
    }
    finally {
      this.loading = false
    }
  }
}
</script>
