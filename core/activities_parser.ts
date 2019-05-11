import { TranslateResult } from 'vue-i18n'
import { Activity } from '../types/models'

export function getActivityDescription(
  t: (key: string, locale: string, args?: any[]) => TranslateResult,
  act: Activity,
  locale: string,
  getUserName: string | ((id: string) => string|undefined),
) {
  const $t = (key: string, args?: any[]) => t(key, locale, args).toString()

  let name: string|undefined
  if (typeof getUserName === 'string')
    name = getUserName
  else
    name = getUserName(act.by)

  const key = `${act.action}.${act.entity}`
  const by = `<b>${name || $t('ui.anonymous')}</b>`
  const entity_name = act.entity_name || act.entity_desc || ''
  switch (key) {
    case 'insert.transaction':
      return $t('acts.insert_transaction', [by, entity_name])
    case 'insert.group':
      return $t('acts.insert_group', [by])
    case 'insert.viewer':
      return $t('acts.insert_viewer', [by])
  }
  return key
}
