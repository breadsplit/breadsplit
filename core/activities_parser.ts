import { Activity } from '../types/models'

export function getActivityDescription(
  t: (key: string, locale: string, args?: any[]) => any,
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

  name = name || $t('ui.anonymous')

  const key = `${act.action}.${act.entity}`
  const by = serverSide ? name : `<b>${name}</b>`
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
