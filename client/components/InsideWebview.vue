<!--
This page will be displayed when the website is open inside a webview.

If you want to test this page on development environment, check this out:
https://www.howtogeek.com/113439/how-to-change-your-browsers-user-agent-without-installing-any-extensions/
-->

<template lang='pug'>
v-container
  v-icon mdi-alert
  .title You are inside a webview
  p Please select "open in browser" menu
  p
  p {{$store.state.userAgent}}
  p {{$store.state.webview}}
  // TODO:WRITING: more details instructions
  // TODO:CODE: add "continue anyway" button
</template>
