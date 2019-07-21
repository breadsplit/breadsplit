<template lang='pug'>
.page-container.height-100(v-rows='"max-content max-content auto max-content auto"')
  .header {{$t('ui.newtrans.expense_paid_by')}}
  .subheader {{$t('ui.newtrans.xx_should_pay')}}

  div

  .text-center.mt-3
    span {{$t('ui.newtrans.select_who_paid')}}
    app-member-toggles(
      :uids='members.map(m=>m.uid)',
      :selected='form.creditors.filter(p=>p.weight).map(p=>p.uid)',
      @select='uid=>setCreditor(uid)',
      :fade='false'
    )

  div
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { Transaction, Member } from '~/types'

@Component
export default class PageCreditors extends Vue {
  @Prop(Object) readonly form!: Transaction
  @Prop({ default: () => [] }) readonly members!: Member[]

  setCreditor (uid: string) {
    this.form.creditors = [{ weight: 1, uid }]
    this.next()
  }

  next () {
    this.$emit('next')
  }
}
</script>
