import sumBy from 'lodash/sumBy'
import merge from 'lodash/merge'
import find from 'lodash/find'
import map from 'lodash/map'
import uniq from 'lodash/uniq'
import concat from 'lodash/concat'
import Fraction from 'fraction.js'
import { Transaction, Group, TransactionBalance, Balance, Solution, ExchangeRecord } from '../types'
import { defaultCurrency } from './defaults'
import { FallbackExchangeRate } from '.'

export function GCD (arr: number[]) {
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

export function CreditorWeights (trans: Transaction): number {
  return sumBy(trans.creditors, c => c.weight || 0)
}

export function DebtorWeights (trans: Transaction): number {
  return sumBy(trans.debtors, d => d.weight || 0)
}

export function TransactionBalanceChanges (trans: Transaction): TransactionBalance[] {
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

export function GroupCurrency (group: Group) {
  const set = new Set([group.main_currency])
  for (const trans of group.transactions)
    set.add(trans.currency)
  return Array.from(set)
}

export function getExchangeRateOn (from: string, to: string, exchange_record: ExchangeRecord) {
  const rate = exchange_record.rates[to.toUpperCase()] / exchange_record.rates[from.toUpperCase()]
  return { rate, date: exchange_record.date }
}

export function applyExchangeRate (from: string, to: string, exchange_record: ExchangeRecord, value: Fraction) {
  const { rate } = getExchangeRateOn(from, to, exchange_record)
  return value.mul(rate)
}

export function ExchangeInTransaction (transaction: Transaction, value: Fraction, main_currency: string, display_currency?: string | null, exchange_record = FallbackExchangeRate) {
  const currency = transaction.currency
  main_currency = main_currency || defaultCurrency
  display_currency = display_currency || main_currency

  if (currency !== display_currency) {
    // use transaction defined exchange info if it's avaliable
    let record = (transaction.exchanges || []).find(e => e.from === currency && e.to === display_currency)
    if (record) {
      return value.mul(record.rate)
    }
    else {
      record = (transaction.exchanges || []).find(e => e.from === currency && e.to === main_currency)
      if (record)
        return applyExchangeRate(main_currency, display_currency, exchange_record, value.mul(record.rate))
      else
        return applyExchangeRate(currency, display_currency, exchange_record, value)
    }
  }
  return value
}

export function GroupBalances (group: Group, display?: string | null, exchange_record = FallbackExchangeRate): Balance[] {
  const main_currency = group.main_currency || defaultCurrency
  const display_currency = display || main_currency

  // init
  let memberBalances = Object.values(group.members)
    .map((m): Balance => {
      return {
        uid: m.uid as string,
        balance: new Fraction(0),
        currency: display_currency,
        removed: m.removed,
      }
    })

  group.transactions.forEach((t) => {
    const changes = TransactionBalanceChanges(t)
    changes.forEach((c) => {
      const member = find(memberBalances, { uid: c.uid })
      if (!member)
        throw new Error(`Member with id:"${c.uid}" is not found.`)

      member.balance = member.balance.add(ExchangeInTransaction(t, c.balance, group.main_currency, display_currency, exchange_record))
    })
  })

  // remove the "Removed members" when theire balance equal to 0
  memberBalances = memberBalances.filter(b => !b.removed || !b.balance.equals(0))

  // sort by the balance
  memberBalances.sort((a, b) => {
    if (a.removed === b.removed)
      return a.balance.compare(b.balance)
    if (a.removed)
      return 1
    return -1
  })
  return memberBalances
}

export function GetSettleUpSolutions (balances: Balance[], group: Group): Solution[] {
  let remaining = balances.map(b => ({
    uid: b.uid,
    balance: b.balance,
  }))
  const currency = group.main_currency || defaultCurrency
  const solutions: Solution[] = []

  function sort () {
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
