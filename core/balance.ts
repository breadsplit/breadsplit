import { AssertionError } from 'assert'
import { sumBy, merge, find, map, uniq, concat } from 'lodash'
import { Transaction, Group } from '../types/models'

export function TransactionBalanceChanges(trans: Transaction) {
  const fee = trans.total_fee
  const creditorWeights = sumBy(trans.creditors, 'weight')
  const debtorWeights = sumBy(trans.debtors, 'weight')
  const involvedIds = uniq(concat(map(trans.creditors, 'memberId'), map(trans.debtors, 'memberId')))

  const changes = involvedIds.map((memberId) => {
    const credit_weight = merge({ weight: 0 }, find(trans.creditors, { memberId })).weight
    const debt_weight = merge({ weight: 0 }, find(trans.debtors, { memberId })).weight
    const credit = fee * credit_weight / creditorWeights
    const debt = fee * debt_weight / debtorWeights
    const balance = credit - debt
    return {
      memberId,
      credit_weight,
      debt_weight,
      credit,
      debt,
      balance,
    }
  })

  return changes
}

export function GroupBalances(group: Group) {
  const balances = Object.values(group.members)
    .map((m) => {
      const balance = {}
      group.currencies.forEach((currency) => {
        balance[currency] = 0
      })
      return {
        memberId: m.id,
        balance,
      }
    })
  group.transactions.forEach((t) => {
    const currency = t.currency
    const changes = TransactionBalanceChanges(t)
    changes.forEach((c) => {
      const info = find(balances, { memberId: c.memberId })
      if (!info)
        throw new AssertionError({ message: `Member with id:"${c.memberId}" is not found.` })
      if (!info.balance.hasOwnProperty(currency))
        info.balance[currency] = 0

      info.balance[currency] += c.balance
    })
  })
  return balances
}
