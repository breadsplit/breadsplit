import Fraction from 'fraction.js'
import Vue from 'vue'
import sortBy from 'lodash/sortBy'
import { Transaction, Group } from '../types'
import { ParserCategory, TransactionBalanceChanges, ExchangeInTransaction } from '.'

export interface ExpensesByCategoriesItem {
  id: string
  name: string
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
      const category = ParserCategory(categoryid, group, vm)
      records[categoryid] = {
        id: categoryid,
        icon: category.icon,
        name: category.text,
        color: category.color,
        value: new Fraction(0),
        currency: display_currency,
      }
    }

    let value = new Fraction(transaction.total_fee)
    if (involvedId) {
      const balance = TransactionBalanceChanges(transaction).find(i => i.uid === involvedId)
      if (!balance)
        value = new Fraction(0)
      else
        value = balance.debt
    }

    const exchanged = ExchangeInTransaction(transaction, value, group.main_currency, display_currency)
    records[categoryid].value = records[categoryid].value.add(exchanged)
  }

  return sortBy(Object.values(records), a => +a.value).reverse()
}
