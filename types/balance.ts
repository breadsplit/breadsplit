import Fraction from 'fraction.js'
import { GroupOptions } from '.'

export interface GroupMetaChanges {
  name?: string
  icon?: string
  color?: string
  main_currency?: string
  options?: Partial<GroupOptions>
}

export interface ExchangeRecord {
  base: string
  date: string
  rates: Record<string, number>
  timestamp: number
  provider: 'fixer'
}

export interface TransactionBalance {
  uid: string
  credit_weight: number
  debt_weight: number
  credit: Fraction
  debt: Fraction
  balance: Fraction
}

export interface Balance {
  uid: string
  balance: Fraction
  currency: string
  removed?: boolean
}

export interface Solution {
  from: string
  to: string
  amount: Fraction
  currency: string
}
