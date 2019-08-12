import { UID, ExchangeProvider } from '.'

export interface CurrencyRecord {
  id: UID
  from_currency: string
  from_fee: number
  to_currency: string
  to_fee: number
  handling_fee: number
  timestamp: number
  desc: string
}

export interface CurrencyChangeRate {
  from_currency: string
  to_currency: string
  change_rate: number
}

export interface ExchangeRecord {
  base: string
  date: string
  rates: Record<string, number>
  timestamp: number
  provider: ExchangeProvider
}
