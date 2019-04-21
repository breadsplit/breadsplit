import { Transaction, Group } from '~/types'
import { sumBy, merge, find, map, uniq, concat } from 'lodash'
import { AssertionError } from 'assert'

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
  const balances = group.members.map(m => ({
    memberId: m.id,
    balance: {},
  }))
  group.transactions.forEach((t) => {
    const currency = t.currency
    const changes = TransactionBalanceChanges(t)
    changes.forEach((c) => {
      const member = find(balances, { memberId: c.memberId })
      if (!member)
        throw new AssertionError({ message: `Member with id:"${c.memberId}" is not found.` })
      if (!member.balance.hasOwnProperty(currency))
        member.balance[currency] = 0

      member.balance[currency] += c.balance
    })
  })
  return balances
}
