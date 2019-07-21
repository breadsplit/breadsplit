import { Activity } from '../types'
import { Translator } from '../utils/i18n'

export function getActivityDescription (
  t: Translator,
  act: Activity,
  locale: string,
  getUserName: string | undefined | ((id: string) => string|undefined),
  serverSide: boolean = false
) {
  const $t = (key: string, args?: any[]) => t(key, locale, args).toString()

  let name: string|undefined
  if (typeof getUserName === 'string')
    name = getUserName
  else if (getUserName != null)
    name = getUserName(act.by)

  const key = `${act.action}.${act.entity}`
  const key_field = `${act.action}.${act.entity}.${act.update_fields}`
  let by = name
  let entity_name = act.entity_name || act.entity_desc || ''
  if (!serverSide) {
    by = `<b>${by}</b>`
    entity_name = `<b>${entity_name}</b>`
  }
  switch (key_field) {
    case 'update.group.name':
      return $t('acts.rename_group', [by, entity_name])
    case 'update.group.currency':
      return $t('acts.change_group_currency', [by, entity_name])
  }
  switch (key) {
    case 'insert.transaction':
      return $t('acts.insert_transaction', [by, entity_name])
    case 'remove.transaction':
      return $t('acts.remove_transaction', [by, entity_name])
    case 'update.transaction':
      return $t('acts.update_transaction', [by, entity_name])
    case 'insert.group':
      return $t('acts.insert_group', [by])
    case 'publish.group':
      return $t('acts.publish_group', [by])
    case 'insert.viewer':
      return $t('acts.insert_viewer', [by])
    case 'insert.member':
      return $t('acts.insert_member', [by, entity_name])
  }
  return key
}
