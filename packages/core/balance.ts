import find from 'lodash/find'
import Fraction from 'fraction.js'
import dayjs from 'dayjs'
import { Transaction, Group, Balance, Solution, ExchangeRecord } from '../types'
import { FallbackExchangeRate } from '../meta/fallback_exchange_rates'
import { formatExchangeDate } from '../utils/formatters'
import { defaultCurrency } from './defaults'
import { TransactionHelper } from '.'

export function GroupCurrency(group: Group) {
  const set = new Set([group.main_currency])
  for (const trans of group.transactions)
    set.add(trans.currency)
  return Array.from(set)
}

export function getExchangeRateOn(from: string, to: string, exchange_record: ExchangeRecord) {
  const rate = exchange_record.rates[to.toUpperCase()] / exchange_record.rates[from.toUpperCase()]
  return { rate, date: exchange_record.date }
}

function findClosestExchangeRate(from: dayjs.ConfigType, exchange_records: Record<string, ExchangeRecord> = {}, days = 3) {
  const date = dayjs(from)
  for (let i = 0; i <= days; i++) {
    const date_string = formatExchangeDate(date.subtract(i, 'day'))
    if (exchange_records[date_string])
      return exchange_records[date_string]
  }
  return undefined
}

export function ExchangeInTransaction(transaction: Transaction, value: Fraction, target_currency: string, exchange_records: Record<string, ExchangeRecord>, fallback_exchange_record = FallbackExchangeRate) {
  let currency = transaction.currency
  target_currency = target_currency || defaultCurrency
  let date: string | undefined
  let source = 'manual'
  let rate = 1

  while (currency !== target_currency) {
    // use manual override
    if (transaction.exchange_rate_override && transaction.exchange_rate_override.from === currency) {
      rate = transaction.exchange_rate_override.rate
      value = value.mul(rate)
      currency = transaction.exchange_rate_override.to
      date = transaction.exchange_rate_override.date
    }
    // use transaction defined exchange rate
    else {
      source = 'system'
      let exchange = findClosestExchangeRate(transaction.timestamp, exchange_records)
      if (!exchange) {
        source = 'fallback'
        exchange = fallback_exchange_record
      }
      const info = getExchangeRateOn(currency, target_currency, exchange)
      rate = info.rate
      value = value.mul(rate)
      currency = target_currency
      date = exchange.date
    }
  }

  return { value, date, source, rate }
}

export function GroupBalances(group: Group, display?: string | null, fallback_exchange_record = FallbackExchangeRate): Balance[] {
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

      const { value } = ExchangeInTransaction(t, c.balance, display_currency || group.main_currency, group.exchange_rates, fallback_exchange_record)
      member.balance = member.balance.add(value)
    })
  })

  // remove the "Removed members" when theire balance equal to 0
  memberBalances = memberBalances.filter(b => !b.removed || !b.balance.equals(0))

  // sort by the balance
  memberBalances.sort((a, b) => b.balance.abs().compare(a.balance.abs()))
  return memberBalances
}

export function GetSettleUpSolutions(balances: Balance[], group: Group): Solution[] {
  let remaining = balances.map(b => ({
    uid: b.uid,
    balance: b.balance,
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
