<template lang="pug">
div
  app-dialog(
    watch-on-query='group'
    persistent no-click-animation
  )
    app-form-group

  app-dialog(
    watch-on-query='trans'
    persistent no-click-animation
  )
    app-form-transaction

  app-dialog(
    watch-on-query='category'
    persistent no-click-animation
  )
    app-form-category

  app-dialog(
    watch-on-query='categories'
  )
    app-categories-edit

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

  app-dialog(
    watch-on-query='user'
    :fullscreen='false'
  )
    app-form-user

</template>
