import sumBy from 'lodash/sumBy'
import merge from 'lodash/merge'
import find from 'lodash/find'
import map from 'lodash/map'
import uniq from 'lodash/uniq'
import concat from 'lodash/concat'
import { Transaction, Group, TransactionBalance, Balance, Solution } from '../types'
import { defaultCurrency } from './defaults'

export function GCD(arr: number[]) {
  // Use spread syntax to get minimum of array
  const lowest = Math.min(...arr)

  for (let factor = lowest; factor > 1; factor--) {
    let isCommonDivisor = true

    for (let j = 0; j < arr.length; j++) {
      if (arr[j] % factor !== 0) {
        isCommonDivisor = false
        break
      }
    }

    if (isCommonDivisor)
      return factor
  }

  return 1
}

export function CreditorWeights(trans: Transaction): number {
  return sumBy(trans.creditors, c => c.weight || 0)
}

export function DebtorWeights(trans: Transaction): number {
  return sumBy(trans.debtors, d => d.weight || 0)
}

export function TransactionBalanceChanges(trans: Transaction): TransactionBalance[] {
  const fee = trans.total_fee
  const creditorWeights = CreditorWeights(trans)
  const debtorWeights = DebtorWeights(trans)
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
  const main_currency = group.currencies[0] || defaultCurrency
  let balances = Object.values(group.members)
    .map((m): Balance => {
      const balance: Record<string, number> = { }
      group.currencies.forEach((currency) => {
        balance[currency] = 0
      })
      return {
        uid: m.uid as string,
        balance,
        main_balance: 0,
        main_currency,
        removed: m.removed,
      }
    })
  group.transactions.forEach((t) => {
    const currency = t.currency
    const changes = TransactionBalanceChanges(t)
    changes.forEach((c) => {
      const info = find(balances, { uid: c.uid })
      if (!info)
        throw new Error(`Member with id:"${c.uid}" is not found.`)
      if (!info.balance.hasOwnProperty(currency))
        info.balance[currency] = 0

      info.balance[currency] += c.balance
    })
  })
  balances.forEach((b) => {
    // TODO: curency change
    b.main_balance = b.balance[main_currency]
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

export function SettleUp(balances: Balance[], group: Group): Solution[] {
  let remaining = balances.map(b => ({
    uid: b.uid,
    balance: b.main_balance,
  }))
  const currency = group.currencies[0] || defaultCurrency
  const solutions: Solution[] = []

  function sort() {
    remaining = remaining
      .filter(i => Math.abs(i.balance) > 0.001)
      .sort((a, b) => a.balance - b.balance)
  }

  sort()

  while (remaining.length > 1) {
    const first = remaining[0]
    const last = remaining[remaining.length - 1]
    const amount = Math.min(Math.abs(first.balance), Math.abs(last.balance))
    solutions.push({
      to: last.uid,
      from: first.uid,
      amount,
      currency,
    })
    first.balance += amount
    last.balance -= amount
    sort()
  }

  return solutions
}
