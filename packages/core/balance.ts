import find from 'lodash/find'
import Fraction from 'fraction.js'
import { Transaction, Group, Balance, Solution, ExchangeRecord } from '../types'
import { defaultCurrency } from './defaults'
import { FallbackExchangeRate, TransactionHelper } from '.'

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
    const changes = TransactionHelper.from(t).balanceChanges
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
  memberBalances.sort((a, b) => b.balance.abs().compare(a.balance.abs()))
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
