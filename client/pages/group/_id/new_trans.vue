<template lang='pug'>
</template>

<script lang='ts'>
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class NewTransactionPage extends Vue {
  get options() {
    return this.$route.query || {}
  }

  mounted() {
    this.$nextTick(async () => {
      // @ts-ignore
      await this.$root.$newtrans.open(this.options)
      this.$router.go(-1)
    })
  }
}
</script>
