import { Activity } from '../types'
import { Translator } from '../utils/i18n'
import { numberToMoney } from '../utils'

export function getActivityDescription(
  $t: Translator,
  act: Activity,
  getUserName: ((id: string) => string|undefined),
  { locale = '', serverSide = false, showByName = true } = {},
) {
  let by = ''
  let source = act.source
  let target = act.target
  if (getUserName != null) {
    by = (showByName ? getUserName(act.by) : '') || ''
    source = source ? getUserName(source) : source
    target = target ? getUserName(target) : target
  }

  const key = `${act.action}.${act.entity}`
  const key_field = `${act.action}.${act.entity}.${act.update_fields}`
  let amount = act.amount ? numberToMoney(act.amount, locale, act.currency) : ''

  let entity = act.entity_name || act.entity_desc || ''
  if (amount)
    entity = `${entity} (${amount})`

  if (!serverSide) {
    by = `<b>${by}</b>`
    entity = `<b>${entity}</b>`
    amount = amount ? `<b>${amount}</b>` : amount
  }
  const payload = {
    by,
    entity,
    source,
    target,
    amount,
  }

  switch (key_field) {
    case 'update.group.name':
      return $t('acts.rename_group', payload)
    case 'update.group.currency':
      return $t('acts.change_group_currency', payload)
  }

  switch (key) {
    case 'insert.transaction':
      return $t('acts.insert_transaction', payload)
    case 'remove.transaction':
      return $t('acts.remove_transaction', payload)
    case 'update.transaction':
      return $t('acts.update_transaction', payload)

    case 'insert.transfer':
      return $t('acts.insert_transfer', payload)
    case 'remove.transfer':
      return $t('acts.remove_transfer', payload)
    case 'update.transfer':
      return $t('acts.update_transfer', payload)

    case 'insert.category':
      return $t('acts.insert_category', payload)
    case 'insert.group':
      return $t('acts.insert_group', payload)
    case 'publish.group':
      return $t('acts.publish_group', payload)
    case 'insert.viewer':
      return $t('acts.insert_viewer', payload)
    case 'insert.member':
      return $t('acts.insert_member', payload)
  }
  return key
}
