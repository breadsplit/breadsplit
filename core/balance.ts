import sumBy from 'lodash/sumBy'
import merge from 'lodash/merge'
import find from 'lodash/find'
import map from 'lodash/map'
import uniq from 'lodash/uniq'
import concat from 'lodash/concat'
import Fraction from 'fraction.js'
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
    const credit = new Fraction(fee).mul(credit_weight).div(creditorWeights)
    const debt = new Fraction(fee).mul(debt_weight).div(debtorWeights)
    const balance = credit.sub(debt)
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

export function GroupCurrency(group: Group) {
  const set = new Set([group.main_currency])
  for (const trans of group.transactions)
    set.add(trans.currency)
  return Array.from(set)
}

export function GroupBalances(group: Group): Balance[] {
  const main_currency = group.main_currency || defaultCurrency
  const currencies = GroupCurrency(group)
  let balances = Object.values(group.members)
    .map((m): Balance => {
      const balance: Record<string, Fraction> = { }
      currencies.forEach((currency) => {
        balance[currency] = new Fraction(0)
      })
      return {
        uid: m.uid as string,
        balance,
        main_balance: new Fraction(0),
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
        info.balance[currency] = new Fraction(0)

      info.balance[currency] = info.balance[currency].add(c.balance)
    })
  })
  balances.forEach((b) => {
    // TODO:AF curency change
    b.main_balance = b.balance[main_currency]
  })
  // remove the "Removed members" when theire balance equal to 0
  balances = balances.filter(b => !b.removed || !b.main_balance.equals(0))
  // sort by the balance
  balances.sort((a, b) => {
    if (a.removed === b.removed)
      return +a.main_balance.sub(b.main_balance)
    if (a.removed)
      return 1
    return -1
  })
  return balances
}

export function GetSettleUpSolutions(balances: Balance[], group: Group): Solution[] {
  let remaining = balances.map(b => ({
    uid: b.uid,
    balance: b.main_balance,
  }))
  const currency = group.main_currency || defaultCurrency
  const solutions: Solution[] = []

  function sort() {
    remaining = remaining
      .filter(i => +i.balance.abs() > 0.001)
      .sort((a, b) => +a.balance.sub(b.balance))
  }

  sort()

  while (remaining.length > 1) {
    const first = remaining[0]
    const last = remaining[remaining.length - 1]
    const amount = first.balance.abs() < last.balance.abs() ? first.balance.abs() : last.balance.abs()
    solutions.push({
      to: last.uid,
      from: first.uid,
      amount,
      currency,
    })
    first.balance = first.balance.add(amount)
    last.balance = last.balance.sub(amount)
    sort()
  }

  return solutions
}
