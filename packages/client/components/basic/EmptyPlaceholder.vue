<template lang='pug'>
.empty-placeholder.text-center
  v-icon(size='128').op-20.pa-3 mdi-{{icon || 'balloon' }}
  p.content.op-50.mb-0 {{title}}
  p.desc.op-50.pb-2 {{desc}}
  slot
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
export default class EmptyPlaceholder extends Vue {
  @Prop(String) readonly title?: string
  @Prop(String) readonly desc?: string
  @Prop(String) readonly icon?: string
}
</script>

<style lang="sass">
.empty-placeholder
  padding: 4em 1em

  & > .content
    font-weight: normal
    font-size: 2em

  & > .desc
    font-size: 1.1em
</style>
