<template lang='pug'>
v-btn.close-button(icon @click='$emit("close")')
  v-icon(color='primary') mdi-close
</template>

<style lang="sass" scoped>
.close-button
  position: absolute
  top: 10px
  right: 10px
  z-index: 2
</style>
