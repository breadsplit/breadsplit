<template lang='pug'>
.absolute-placeholder(:style='style')
  slot
</template>

<script lang='ts'>
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class AbsolutePlaceholder extends Vue {
  // this variable is fore forcing vue to recalculate computed "height"
  salt = 0

  @Prop() readonly for?: Vue | Element

  get height() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
    const salt = this.salt
    const target = this.for || this.$children
    if (!target)
      return 0

    const getHeight = (el: Element | Vue) => {
      if (el instanceof Element)
        return el.clientHeight
      if (el instanceof Vue)
        return el.$el.clientHeight
      return 0
    }

    if (Array.isArray(target)) {
      return (target as (Vue|Element)[])
        .map(el => getHeight(el))
        .reduce((a, b) => a + b, 0)
    }
    return getHeight(target)
  }

  get style() {
    return {
      height: `${this.height}px`,
    }
  }

  recalculate() {
    this.salt += 1
  }

  mounted() {
    this.recalculate()
  }
}
</script>
