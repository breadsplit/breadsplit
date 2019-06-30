<template lang='pug'>
.action-with-text
  .action
    slot(name='action')
  .text
    slot(name='text')
</template>

<style lang='sass'>
.action-with-text
  text-align: center
  display: inline-block

  &:not(.inline)
    & > *
      display: block

    & > .text
      font-size: 0.9em

  &.inline
    & > *
      display: inline-block
      vertical-align: middle

    & > .text
      font-size: 1.1em
      margin-left: 10px
      font-weight: bold
</style>
