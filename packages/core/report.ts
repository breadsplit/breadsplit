import Fraction from 'fraction.js'
import Vue from 'vue'
import sortBy from 'lodash/sortBy'
import { Transaction, Group } from '../types'
import { ParseCategory, ExchangeInTransaction, TransactionHelper } from '.'

export interface ExpensesByCategoriesItem {
  id: string
  label: string
  color: string
  icon: string
  value: Fraction
  currency: string
}

export function ReportExpensesByCategories (vm: Vue, transactions: Transaction[], group: Group, ignoredCategories: string[] = [], involvedId?: string, display_currency?: string): ExpensesByCategoriesItem[] {
  display_currency = display_currency || group.main_currency

  const records: Record<string, ExpensesByCategoriesItem> = {}
  for (const transaction of transactions) {
    const categoryid = transaction.category || 'other'

    if (ignoredCategories.includes(categoryid))
      continue

    if (!records[categoryid]) {
      const category = ParseCategory(categoryid, group, vm.$t.bind(vm))
      records[categoryid] = {
        id: categoryid,
        icon: category.icon,
        label: category.text,
        color: category.color,
        value: new Fraction(0),
        currency: display_currency,
      }
    }

    let value = new Fraction(transaction.total_fee)
    if (involvedId) {
      const balance = TransactionHelper.from(transaction).balanceChangesOf(involvedId)
      if (!balance)
        value = new Fraction(0)
      else
        value = balance.debt
    }

    const exchangeResult = ExchangeInTransaction(transaction, value, display_currency || group.main_currency)
    records[categoryid].value = records[categoryid].value.add(exchangeResult.value)
  }

  return sortBy(Object.values(records), a => +a.value).reverse()
}
