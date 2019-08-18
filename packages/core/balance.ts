import find from 'lodash/find'
import Fraction from 'fraction.js'
import { Transaction, Group, Balance, Solution, ExchangeRecord } from '../types'
import { FallbackExchangeRate } from '../meta/fallback_exchange_rates'
import { defaultCurrency } from './defaults'
import { TransactionHelper } from '.'

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

export function ExchangeInTransaction (transaction: Transaction, value: Fraction, target_currency: string, fallback_exchange_record = FallbackExchangeRate) {
  let currency = transaction.currency
  target_currency = target_currency || defaultCurrency
  let date: string | undefined

  while (currency !== target_currency) {
    // use manual override
    if (transaction.exchange_rate_override && transaction.exchange_rate_override.from === currency) {
      value = value.mul(transaction.exchange_rate_override.rate)
      currency = transaction.exchange_rate_override.to
      date = transaction.exchange_rate_override.date
    }
    // use transaction defined exchange rate
    else {
      const exchange = transaction.exchange_rate || fallback_exchange_record
      const { rate } = getExchangeRateOn(currency, target_currency, exchange)
      value = value.mul(rate)
      currency = target_currency
      date = exchange.date
    }
  }

  return { value, date }
}

export function GroupBalances (group: Group, display?: string | null, fallback_exchange_record = FallbackExchangeRate): Balance[] {
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

      const { value } = ExchangeInTransaction(t, c.balance, display_currency || group.main_currency, fallback_exchange_record)
      member.balance = member.balance.add(value)
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
