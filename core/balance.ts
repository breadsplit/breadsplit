import { AssertionError } from 'assert'
import sumBy from 'lodash/sumBy'
import merge from 'lodash/merge'
import find from 'lodash/find'
import map from 'lodash/map'
import uniq from 'lodash/uniq'
import concat from 'lodash/concat'
import { Transaction, Group } from '../types'

export interface TransactionBalance {
  uid: string
  credit_weight: number
  debt_weight: number
  credit: number
  debt: number
  balance: number
}

export interface Balance {
  uid: string
  balance: Record<string, number>
  main_balance: number
  removed?: boolean
}

export function TransactionBalanceChanges(trans: Transaction): TransactionBalance[] {
  const fee = trans.total_fee
  const creditorWeights = sumBy(trans.creditors, 'weight')
  const debtorWeights = sumBy(trans.debtors, 'weight')
  const involvedIds = uniq(concat(map(trans.creditors, 'uid'), map(trans.debtors, 'uid')))

  const changes = involvedIds.map((uid): TransactionBalance => {
    const credit_weight = merge({ weight: 0 }, find(trans.creditors, { uid })).weight
    const debt_weight = merge({ weight: 0 }, find(trans.debtors, { uid })).weight
    const credit = fee * credit_weight / creditorWeights
    const debt = fee * debt_weight / debtorWeights
    const balance = credit - debt
    return {
      uid,
      credit_weight,
      debt_weight,
      credit,
      debt,
      balance,
    }
  })

  return changes
}

export function GroupBalances(group: Group): Balance[] {
  const mainCurrency = group.currencies[0]
  let balances = Object.values(group.members)
    .map((m): Balance => {
      const balance: Record<string, number> = { }
      group.currencies.forEach((currency) => {
        balance[currency] = 0
      })
      return {
        uid: m.id,
        balance,
        main_balance: 0,
        removed: m.removed,
      }
    })
  group.transactions.forEach((t) => {
    const currency = t.currency
    const changes = TransactionBalanceChanges(t)
    changes.forEach((c) => {
      const info = find(balances, { uid: c.uid })
      if (!info)
        throw new AssertionError({ message: `Member with id:"${c.uid}" is not found.` })
      if (!info.balance.hasOwnProperty(currency))
        info.balance[currency] = 0

      info.balance[currency] += c.balance
    })
  })
  balances.forEach((b) => {
    // TODO: curency change
    b.main_balance = b.balance[mainCurrency]
  })
  // remove the "Removed members" when theire balance equal to 0
  balances = balances.filter(b => !b.removed || b.main_balance !== 0)
  // sort by the balance
  balances.sort((a, b) => {
    if (a.removed === b.removed)
      return a.main_balance - b.main_balance
    if (a.removed)
      return 1
    return -1
  })
  return balances
}
