<template lang='pug'>
.empty-placeholder.text-center(:class='{dense}')
  slot(name='icon')
    v-icon(v-if='icon' size='128').op-20.pb-3 mdi-{{icon}}
  p.content.op-50.mb-0 {{title}}
  p.desc.op-50 {{desc}}
  slot
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
export default class EmptyPlaceholder extends Vue {
  @Prop(String) readonly title?: string
  @Prop(String) readonly desc?: string
  @Prop(String) readonly icon?: string
  @Prop(Boolean) readonly dense?: boolean
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

  &.dense
    padding: 0 1em
</style>
