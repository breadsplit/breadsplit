import Vue from 'vue/dist/vue.runtime.esm.js'
import { Activity } from '../../../types/models'
import { getActivityDescription } from '../../../core/activities_parser'
import { CreateVueI18n } from '../../../locales/index'

const i18n = CreateVueI18n(Vue, 'en')

export function buildNotificationFromActivities(act: Activity, locale: string, username: string) {
  return {
    title: getActivityDescription(i18n.t.bind(i18n), act, locale, username),
  }
}
