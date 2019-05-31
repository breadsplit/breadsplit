<template lang="pug">
div
  app-dialog(
    watch-on-query='newgroup'
    persistent no-click-animation
  )
    app-new-group

  app-dialog(
    watch-on-query='newtrans'
    persistent no-click-animation
  )
    app-new-transaction

  app-dialog(
    watch-on-query='settings'
  )
    app-settings

  app-dialog(
    watch-on-query='transaction'
    persistent no-click-animation
  )
    app-transaction-detail

  app-dialog(
    watch-on-query='about'
  )
    app-about-page

  app-dialog(
    watch-on-query='faq'
  )
    app-faq

</template>
