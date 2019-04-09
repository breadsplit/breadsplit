<template lang="pug">
v-layout
  v-flex(text-xs-center='')
    blockquote.blockquote Hello, {{params.id}}
</template>

<script>
export default {
  async asyncData({ params }) {
    return { params }
  },
}
</script>
