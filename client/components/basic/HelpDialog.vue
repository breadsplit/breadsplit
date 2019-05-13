<template lang='pug'>
v-card.py-2
  app-dialog-bar(@close='close()' :close-buttons='false')
    v-icon.mr-2(color='primary') mdi-help-circle-outline
    span {{$t(`help.${help}.title`)}}

  v-card-text.px-4(v-html="$t(`help.${help}.details`)")

  .pa-2.text-xs-center
    v-btn(color='primary' @click='close') {{$t('ui.button_ok')}}
</template>

<script lang='ts'>
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class HelpDialog extends Vue {
  @Prop(String) readonly help?: string

  close(result?) {
    this.$emit('close', result)
  }
}
</script>
