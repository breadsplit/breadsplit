<template lang="pug">
app-dialog(ref='dialog' :lazy='false' persistent no-click-animation)
  app-transaction-detail
</template>

<script lang='ts'>
import { Component, Vue } from 'nuxt-property-decorator'
import Dialog from '~/components/global/Dialog.vue'

@Component({
  async asyncData({ params }) {
    return { params }
  },
})
export default class TransactionPage extends Vue {
  params: any

  $refs!: {
    dialog: Dialog
  }

  get options() {
    return Object.assign({}, this.$route.query, this.params)
  }

  mounted() {
    this.$nextTick(async () => {
      await this.$refs.dialog.open(this.options)
      this.$router.go(-1)
    })
  }
}
</script>
