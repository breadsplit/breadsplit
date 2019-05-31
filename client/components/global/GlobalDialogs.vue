<template lang="pug">
div
  app-dialog(
    watch-on-query='newgroup'
    persistent no-click-animation
  )
    app-new-group

  app-dialog(
    :lazy='false'
    watch-on-query='newtrans'
    persistent no-click-animation
  )
    app-new-transaction

  app-dialog(
    watch-on-query='settings'
  )
    app-settings

  app-dialog(
    :lazy='false'
    watch-on-query='transaction'
    persistent no-click-animation
  )
    app-transaction-detail

</template>
