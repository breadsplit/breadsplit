<template lang="pug">
.file-upload
  input.input-file(
    v-if='!disabled'
    type='file',
    :multiple='multiple',
    :name='fieldName',
    :accept='accept'
    @change='$emit("change", Array.from($event.target.files))',
  )
  slot
</template>

<script lang='ts'>
import { Vue, Component, Prop } from 'nuxt-property-decorator'

@Component
export default class FileUpload extends Vue {
  @Prop({
    type: String,
    default: 'image/*',
  })
  accept

  @Prop({
    type: Boolean,
    default: false,
  })
  multiple

  @Prop({
    type: Boolean,
    default: false,
  })
  disabled

  @Prop({
    type: String,
    default: 'upload',
  })
  fieldName
}
</script>

<style lang="sass">
.file-upload
  display: inline-block
  position: relative
  .input-file
    opacity: 0
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    z-index: 1000
</style>
