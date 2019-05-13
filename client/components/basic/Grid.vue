<template lang='pug'>
.app-grid(:style='style')
  slot
</template>

<script lang='ts'>
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class Form extends Vue {
  @Prop({ default: '' }) readonly columns!: string
  @Prop({ default: '' }) readonly rows!: string

  get style() {
    return {
      'grid-template-columns': this.columns,
      'grid-template-rows': this.rows,
    }
  }
}
</script>

<style lang='stylus'>
.app-grid
  display grid

  .v-subheader
    padding-left 0
</style>
