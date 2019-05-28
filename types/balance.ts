import { GroupOptions } from '.'

export interface GroupMetaChanges {
  name?: string
  icon?: string
  color?: string
  currencies?: string[]
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
  credit: number
  debt: number
  balance: number
}

export interface Balance {
  uid: string
  balance: Record<string, number>
  main_balance: number
  main_currency: string
  removed?: boolean
}

export interface Solution {
  from: string
  to: string
  amount: number
  currency: string
}
