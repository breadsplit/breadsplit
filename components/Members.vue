<template lang='pug'>
.members
  .member(v-for='member in members')
    .name {{member.display}}
    .email {{member.email}}
    p {{member}}
</template>

<script>
export default {
  props: {
    members: { type: Array, default: () => ([]) },
  },
}
</script>
