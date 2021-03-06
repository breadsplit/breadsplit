/*
This file is shared both in client and server.

If you made any modification,
Please DO DEPLOY firebase functions before merge into master.
*/
import cloneDeep from 'lodash/cloneDeep'
import { TransformFunctions, Group, Member, Transaction, GroupMetaChanges, Category } from '../types'
import { CategoryPresets } from '../meta/categories'
import { ExchangeRecord } from '../types/currency_exchange'
import { IsThisId } from './id_helper'

export type TransformKeys =
  | 'init'
  | 'modify_meta'
  | 'insert_member'
  | 'remove_member'
  | 'modify_member'
  | 'insert_transaction'
  | 'modify_transaction'
  | 'remove_transaction'
  | 'update_exchange_rate'
  | 'insert_category'
  | 'modify_category'
  | 'remove_category'
  | 'reorder_categories'
  | 'change_member_id'
  | 'new_activity'

export const Transforms: TransformFunctions<Group> = {
  init(snap, data, { by, timestamp } = {}) {
    snap = Object.assign(snap || {}, cloneDeep(data))
    if (!snap.activities)
      snap.activities = []
    snap.activities.push({
      by,
      timestamp,
      action: 'publish',
      entity: 'group',
    })
    return snap
  },

  modify_meta(snap, changes?: GroupMetaChanges, { by, timestamp } = {}) {
    if (!changes)
      return snap
    changes = Object.assign({}, changes)
    if (changes.name && snap.name !== changes.name) {
      snap.name = changes.name
      snap.activities.push({
        by,
        timestamp,
        action: 'update',
        entity: 'group',
        update_fields: 'name',
        entity_name: changes.name,
      })
    }
    if (changes.main_currency && snap.main_currency !== changes.main_currency) {
      snap.main_currency = changes.main_currency
      snap.activities.push({
        by,
        timestamp,
        action: 'update',
        entity: 'group',
        update_fields: 'currency',
        entity_name: changes.main_currency,
      })
    }
    if (changes.icon)
      snap.icon = changes.icon
    if (changes.color)
      snap.color = changes.color
    return snap
  },

  insert_member(snap, member?: Member, { by, timestamp } = {}) {
    if (!member)
      return snap
    if (!member.uid)
      return snap
    snap.members[member.uid] = member
    snap.activities.push({
      by,
      timestamp,
      action: 'insert',
      entity: 'member',
      entity_id: member.uid,
      entity_name: member.name,
    })
    return snap
  },

  remove_member(snap, uid?: string) {
    if (!uid)
      return snap
    if (!snap.members[uid])
      return snap
    snap.members[uid].removed = true
    return snap
  },

  modify_member(snap, data) {
    if (!data)
      return snap
    const { id, changes } = data
    if (!snap.members[id])
      return snap
    Object.assign(snap.members[id], changes)
    return snap
  },

  insert_transaction(snap, transaction?: Transaction, { by, timestamp } = {}) {
    if (!transaction)
      return snap
    if (snap.transactions.find(i => i.id === transaction.id))
      return snap

    const trans = cloneDeep(transaction)
    trans.creator = by
    trans.timestamp_created = timestamp
    snap.transactions.unshift(trans)
    if (trans.type === 'transfer') {
      snap.activities.push({
        by,
        timestamp,
        action: 'insert',
        entity: 'transfer',
        entity_id: trans.id,
        entity_name: trans.desc,
        source: trans.creditors[0].uid,
        target: trans.debtors[0].uid,
        amount: trans.total_fee,
        currency: trans.currency,
      })
    }
    else {
      snap.activities.push({
        by,
        timestamp,
        action: 'insert',
        entity: 'transaction',
        entity_id: trans.id,
        entity_name: trans.desc,
        amount: trans.total_fee,
        currency: trans.currency,
      })
    }

    return snap
  },

  modify_transaction(snap, transaction?: Transaction, { by, timestamp } = {}) {
    if (!transaction)
      return snap
    const target = snap.transactions.find(t => t.id === transaction.id)
    if (!target)
      return snap
    Object.assign(target, transaction)
    target.modifier = by
    target.timestamp_modified = timestamp
    snap.activities.push({
      by,
      timestamp,
      action: 'update',
      entity: 'transaction',
      entity_id: transaction.id,
      entity_name: transaction.desc,
    })
    return snap
  },

  remove_transaction(snap, id: string, { by, timestamp } = {}) {
    const trans = snap.transactions.find(t => t.id === id)
    if (!trans)
      return snap
    snap.transactions.splice(snap.transactions.indexOf(trans), 1)
    snap.activities.push({
      by,
      timestamp,
      action: 'remove',
      entity: 'transaction',
      entity_id: trans.id,
      entity_name: trans.desc,
      amount: trans.total_fee,
      currency: trans.currency,
    })
    return snap
  },

  update_exchange_rate(snap, { date, record }: {date: string; record: ExchangeRecord}) {
    if (!snap.exchange_rates)
      snap.exchange_rates = {}
    snap.exchange_rates[date] = record
    return snap
  },

  reorder_categories(snap, categories: (Category | string)[], { by, timestamp } = {}) {
    if (!categories)
      return snap
    const categoriesIds = categories.map(t => typeof t !== 'string' && t.id).filter(i => i) as string[]

    // In case there are some conflict by other users
    const missedCategories = (snap.categories || []).filter(t => typeof t !== 'string' && !categoriesIds.includes(t.id))

    snap.categories = [
      ...categories.map(cat => (typeof cat === 'string') ? cat : { ...cat, removed: false }),
      ...missedCategories.map(cat => (typeof cat === 'string') ? cat : { ...cat, removed: true }),
    ]

    return snap
  },

  insert_category(snap, category: Category | string, { by, timestamp } = {}) {
    if (!snap.categories)
      snap.categories = CategoryPresets.default

    snap.categories.push(category)
    if (typeof category !== 'string') {
      snap.activities.push({
        by,
        timestamp,
        action: 'insert',
        entity: 'category',
        entity_id: category.id,
        entity_name: category.text,
        entity_color: category.color,
      })
    }
    return snap
  },

  modify_category(snap, { id, changes }: { id: string; changes: Partial<Category> }, { by, timestamp } = {}) {
    if (!snap.categories)
      return snap
    if (!IsThisId.Category(id))
      return snap

    const category = snap.categories.find(c => typeof c !== 'string' && c.id === id) as Category

    if (!category)
      return snap

    delete changes.id
    Object.assign(category, changes)

    return snap
  },

  remove_category(snap, id: string, { by, timestamp } = {}) {
    if (!snap.categories)
      return snap

    // built in
    if (!IsThisId.Category(id)) {
      snap.categories = snap.categories.filter(c => c !== id)
    }
    // custom
    else {
      const category = snap.categories.find(c => typeof c !== 'string' && c.id === id) as Category
      if (category)
        category.removed = true
    }

    return snap
  },

  change_member_id(snap, data) {
    if (!data)
      return snap
    const { from, to } = data
    if (!from || !to)
      return snap

    const member = snap.members[from]
    if (!member || snap.members[to])
      return snap

    // change members field
    member.uid = to
    member.name = '' // reset member's name
    delete snap.members[from]
    snap.members[to] = member

    // utils function
    function replacer(object: any, field: string) {
      if (object[field] === from)
        object[field] = to
    }

    // change uids in transactions
    for (const trans of snap.transactions) {
      replacer(trans, 'creator')
      replacer(trans, 'modifier')
      for (const c of trans.creditors)
        replacer(c, 'uid')
      for (const d of trans.debtors)
        replacer(d, 'uid')
    }

    return snap
  },

  new_activity(snap, data) {
    snap.activities.push(data)
    return snap
  },
}
