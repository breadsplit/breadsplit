<template lang='pug'>
v-card.sharing.pa-4.mb-2
  .vertical-aligned-grid(@click='toggle' v-columns='"auto max-content"')
    v-subheader.pl-1
      span
        div {{$t('ui.share.join_via_link')}}
        .op-50(v-if='public') {{$t('ui.share.join_via_link_enabled')}}
        .op-50(v-else) {{$t('ui.share.join_via_link_disabled')}}
    v-switch.mt-3.mb-n3.mouse-pass(:value='public' :loading='loading' inset color='primary')

  v-slide-y-reverse-transition
    v-btn.mt-2(color='primary' block depressed v-show='public' @click='copyShareLink')
      v-icon.mr-3 mdi-share
      span {{$t('ui.share.share_link')}}
</template>

<script lang='ts'>
import { Component, mixins } from 'nuxt-property-decorator'
import GroupMixin from '~/mixins/group'

@Component
export default class SwitchToOnline extends mixins(GroupMixin) {

}
</script>
