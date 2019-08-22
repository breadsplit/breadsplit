<template lang='pug'>
v-container.text-center
  template(v-if='!groups.length')
    app-empty-placeholder(
      icon='bread-slice-outline'
      :title='$t("placeholders.groups.title")'
      :desc='$t("placeholders.groups.desc")'
    )
      v-btn(@click='gotoNewGroup' rounded color='primary')
        v-icon.mr-2 mdi-plus
        span {{$t('ui.button_new_group')}}

  template(v-else)
    app-group-widget(v-for='(group, i) in groups' :id='group.id' :key='group.id')

    .my-8

    v-btn(@click='gotoNewGroup' rounded color='primary')
      v-icon.mr-2 mdi-plus
      span {{$t('ui.button_new_group')}}

    .my-12
    app-credit.op-25(simple='true')

    v-btn(@click='reload' text small color='grey').op-25 Reload
</template>

<script lang='ts'>
import { Component, mixins, Getter } from 'nuxt-property-decorator'
import { NavigationMixin } from '~/mixins'
import { Group } from '~/types'

@Component
export default class Homepage extends mixins(NavigationMixin) {
  @Getter('group/all') groups!: Group[]

  groupCssVars (group) {
    return {
      '--group-color': group.color,
    }
  }

  reload () {
    window.location.reload()
  }
}
</script>
