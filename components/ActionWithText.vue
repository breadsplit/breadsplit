<template lang='pug'>
.action-with-text
  .action
    slot(name='action')
  .text
    slot(name='text')
</template>

<style lang='stylus'>
.action-with-text
  padding 5px
  text-align center
  display inline-block

  & > .text
    display block
    font-size 0.8em

</style>
