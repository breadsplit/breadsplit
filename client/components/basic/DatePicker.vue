<template lang='pug'>
v-dialog(v-model='dialog', :return-value.sync='date', persistent, lazy, full-width, width='290px')
  v-date-picker(v-model='date', scrollable)
    v-spacer
    v-btn(flat, color='primary', @click='close') {{$t('ui.button_cancel')}}
    v-btn(flat, color='primary', @click='save') {{$t('ui.button_ok')}}
</template>

<script lang='ts'>
import { Component, Vue } from 'nuxt-property-decorator'
import dayjs from 'dayjs'

@Component({
  inheritAttrs: false,
})
export default class DatePicker extends Vue {
  dialog = false
  resolve: ((result) => void) | null = null
  reject: ((error) => void) | null = null
  date = ''

  open(date?: number) {
    this.dialog = true
    this.date = dayjs(date).format('YYYY-MM-DD')
    return new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }

  save() {
    this.dialog = false
    if (this.resolve)
      this.resolve(+dayjs(this.date))
  }

  close(flag = true) {
    this.dialog = false
    if (this.resolve)
      this.resolve(null)
  }
}
</script>
