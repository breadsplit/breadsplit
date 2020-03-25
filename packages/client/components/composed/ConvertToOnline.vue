<template lang='pug'>
v-card.inviting.pa-4.mb-2(flat color='transparent')
  .vertical-aligned-grid(v-columns='"max-content auto"').mb-2
    v-icon.mr-3(size='48').op-50 mdi-cloud-off-outline
    v-subheader.pl-1
      span
        div {{$t('ui.group_is_offline')}}
        .op-75 {{$t('ui.group_is_offline_desc')}}

  v-btn.ml-11.px-5(color='primary' text @click='convert')
    span {{$t('ui.convert_to_online')}}
</template>

<script lang='ts'>
import { Component, mixins } from 'nuxt-property-decorator'
import GroupMixin from '~/mixins/group'

@Component
export default class ConvertToOnline extends mixins(GroupMixin) {
  async convert() {
    if (await this.$confirm(this.$t('prompt.are_you_sure'))) {
      this.$apploading.open(this.$t('loading.coverting_online'))
      try {
        await this.$fire.publishGroup(this.group.id)
      }
      catch (e) {
        // eslint-disable-next-line
            console.error(e)
        // TODO:ERROR error handling
      }
      this.$apploading.close()
    }
  }
}
</script>
