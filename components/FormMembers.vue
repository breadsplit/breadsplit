<template lang="pug">
p {{members}}
</template>

<script>
export default {
  props: {
    members: { type: Array, default: () => ([]) },
  },
}
</script>
