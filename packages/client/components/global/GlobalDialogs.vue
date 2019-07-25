<template lang="pug">
div
  app-dialog(
    watch-on-query='newgroup'
    persistent no-click-animation
  )
    app-new-group

  app-dialog(
    watch-on-query='trans'
    persistent no-click-animation
  )
    app-form-transaction

  app-dialog(
    watch-on-query='settings'
  )
    app-settings

  app-dialog(
    watch-on-query='about'
  )
    app-about-page

  app-dialog(
    watch-on-query='faq'
  )
    app-faq

</template>
