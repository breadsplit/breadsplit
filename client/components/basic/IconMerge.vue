<template lang='pug'>
.icon-merge
  slot
  .append
    slot(name='append')
</template>

<style lang='stylus'>
.icon-merge
  position relative

  .append
    position absolute
    bottom -2px
    right -8px
</style>
