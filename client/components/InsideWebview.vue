<template lang='pug'>
v-container
  .title You are inside a isInsideWebview
  p Please select "open in browser" menu
  p
  p {{$store.state.userAgent}}
  p {{$store.state.webview}}
  // TODO:WRITING: more details instructions
  // TODO:CODE: add "continue anyway" button
</template>
