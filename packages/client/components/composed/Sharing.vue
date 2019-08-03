<template lang='pug'>
v-card.sharing.pa-4.mb-2
  .vertical-aligned-grid(@click='toggle' v-columns='"auto max-content"')
    v-subheader.pl-1
      span
        div {{$t('ui.share.join_via_link')}}
        .op-50(v-if='public') {{$t('ui.share.join_via_link_enabled')}}
        .op-50(v-else) {{$t('ui.share.join_via_link_disabled')}}
    v-switch.mt-3.mb-n3.mouse-pass(:input-value='public' :loading='loading' inset color='primary')

  v-slide-y-reverse-transition
    v-btn.mt-2(color='primary' block depressed v-show='public' @click='copyShareLink')
      v-icon.mr-3 mdi-share
      span {{$t('ui.share.share_link')}}
</template>

<script lang='ts'>
import { Component, mixins, Getter } from 'nuxt-property-decorator'
import { ClientGroup } from '~/types'
import GroupMixin from '~/mixins/group'
import { Share } from '~/utils/share'

@Component
export default class Sharing extends mixins(GroupMixin) {
  @Getter('group/currentShareLink') currentShareLink: string | undefined
  @Getter('group/currentClientGroup') clientGroup: ClientGroup | undefined

  loading = false

  get public () {
    if (this.clientGroup && this.clientGroup.options)
      return this.clientGroup.options.public || false
    return false
  }

  async copyShareLink () {
    if (!this.currentShareLink)
      return
    await Share(
      this,
      this.$t('prompt.invite_friends').toString(),
      this.$t('prompt.share_message', [this.group.name]).toString(),
      this.currentShareLink,
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
      console.log(e)
    }
    finally {
      this.loading = false
    }
  }
}
</script>
