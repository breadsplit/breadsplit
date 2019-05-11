import { Activity } from '../../../types/models'
import { getActivityDescription } from '../../../core/activities_parser'
import { t } from './i18n'

export function buildNotificationFromActivities(act: Activity, locale: string, username: string) {
  return {
    title: getActivityDescription(t, act, locale, username),
  }
}
