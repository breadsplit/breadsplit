import Vue from 'vue'
import includes from 'lodash/includes'
import orderBy from 'lodash/orderBy'
import union from 'lodash/union'
import { oc } from 'ts-optchain'
import { MutationTree, ActionTree, GetterTree, ActionContext } from 'vuex'
import { FallbackExchangeRate } from '../../meta/fallback_exchange_rates'
import { GroupStateDefault } from '.'
import { GroupState, RootState, Group, ServerGroup, ClientGroup, ExchangeRecord } from '~/types'
import { EvalTransforms, ProcessOperation, BasicCache, Transforms, MemberDefault, ClientGroupDefault, TransactionDefault, TransformKeys, IdMe, GroupBalances, GetSettleUpSolutions, CategoryDefault } from '~/core'
import { DEBUG } from '~/../meta/env'

// eslint-disable-next-line no-console
const log = (...args) => !DEBUG || console.log('VUX', ...args)

const OperationCache = new BasicCache<Group>()
const Transformer = EvalTransforms<Group>(Transforms, { cacheObject: OperationCache })

export const state = GroupStateDefault

export const getters: GetterTree<GroupState, RootState> = {

  current (state) {
    if (!state.currentId)
      return undefined
    return state.cache.groups[state.currentId]
  },

  currentBalances (state) {
    if (!state.currentId)
      return undefined
    return state.cache.balances[state.currentId]
  },

  currentSolutions (state) {
    if (!state.currentId)
      return undefined
    return state.cache.solutions[state.currentId]
  },

  currentId (state) {
    return state.currentId
  },

  currentClientGroup (state) {
    if (!state.currentId)
      return undefined
    return state.groups[state.currentId]
  },

  all (state) {
    return orderBy(Object.values(state.groups), ['lastchanged'], ['desc'])
      .map(group => state.cache.groups[group.id])
  },

  clientGroupById: state => (id: string) => {
    return state.groups[id]
  },

  id: state => (id: string) => {
    return state.cache.groups[id]
  },

  memberById: state => ({ groupId, uid }) => {
    groupId = groupId || state.currentId
    const group = state.cache.groups[groupId]
    if (!group)
      return null
    return group.members[uid]
  },

  activeMembersOf: state => (groupid?: string) => {
    groupid = groupid || state.currentId || ''
    const group = state.cache.groups[groupid] as Group
    if (!group)
      return []
    return Object.values(group.members).filter(m => !m.removed)
  },

  activeMembers (state, getters) {
    return getters.activeMembersOf(state.currentId)
  },

  isSyncing: state => (groupId?: string) => {
    groupId = groupId || state.currentId || ''
    const group = state.groups[groupId]
    return !!(group.syncing_operations.length)
  },

  unreadsOf: state => (id?: string) => {
    id = id || state.currentId || ''
    return state.unreads[id] || 0
  },
}

function NewOperation (
  context: ActionContext<GroupState, RootState>,
  groupid: string,
  name: TransformKeys,
  data: any,
  meta: object = {}
) {
  meta = {
    ...meta,
    by: context.rootGetters['user/uid'] || IdMe,
    timestamp: +new Date(),
  }
  context.commit('newOperation', { id: groupid, name, data, meta })
  context.dispatch('cacheGroup', groupid)
}

export const actions: ActionTree<GroupState, RootState> = {

  add (context, payload) {
    const group = ClientGroupDefault(payload)
    group.base.activities.push({
      by: context.rootGetters['user/uid'] || IdMe,
      timestamp: +new Date(),
      action: 'insert',
      entity: 'group',
    })
    context.commit('add', group)
    context.dispatch('cacheGroup', group.id)
    context.commit('switch', group.id)
  },

  modify (context, { id, changes }) {
    NewOperation(context, id, 'modify_meta', changes)
  },

  // Members
  addMember (context, { id, member }) {
    member = MemberDefault(member)
    NewOperation(context, id, 'insert_member', member)
  },

  removeMember (context, { id, memberid }) {
    NewOperation(context, id, 'remove_member', memberid)
  },

  editMember (context, { id, memberid, changes }) {
    NewOperation(context, id, 'modify_member', { id: memberid, changes })
  },

  changeMemberId (context, { id, from, to }) {
    NewOperation(context, id, 'change_member_id', { from, to })
  },

  // Transactions
  newTransaction (context, { id, trans }) {
    trans = TransactionDefault(trans)
    NewOperation(context, id, 'insert_transaction', trans)
  },

  editTransaction (context, { id, trans }) {
    trans = TransactionDefault(trans)
    NewOperation(context, id, 'modify_transaction', trans)
  },

  removeTransaction (context, { id, transid }) {
    NewOperation(context, id, 'remove_transaction', transid)
  },

  // Category
  newCategory (context, { id, category }) {
    category = CategoryDefault(category)
    NewOperation(context, id, 'insert_category', category)
  },

  editCategory (context, { id, categoryid, changes }) {
    NewOperation(context, id, 'modify_category', { id: categoryid, changes })
  },

  removeCategory (context, { id, categoryid }) {
    NewOperation(context, id, 'remove_category', categoryid)
  },

  reorderCategories (context, { id, categories, archived = [] }) {
    NewOperation(context, id, 'reorder_categories', categories)
  },

  // Exchange Rates
  updateExchangeRates (context, { id, date, record }) {
    if (oc(context.state).cache.groups[id].exchange_rates[date]())
      return
    NewOperation(context, id, 'update_exchange_rate', { date, record })
  },

  // Caches
  cacheInit ({ state, dispatch }) {
    for (const id of Object.keys(state.groups)) {
      if (!state.cache.groups[id])
        dispatch('cacheGroup', id)
    }
  },

  cacheGroup ({ state, commit, dispatch }, id?: string|null) {
    id = id || state.currentId
    if (!id)
      return
    const clientGroup = state.groups[id]
    if (!clientGroup)
      return
    const { base, operations } = clientGroup
    if (!base)
      return
    log(`🐱‍👤 Caching group ${id}`)
    const group = Transformer(base, operations)
    commit('setCache', { field: 'groups', key: id, value: Object.freeze(group) })
    dispatch('cacheBalances', { id })
  },

  cacheBalances ({ state, commit, rootState, getters }, { id, exchange_record }: { id?: string; exchange_record?: ExchangeRecord }) {
    id = id || state.currentId || undefined
    if (!id)
      return
    const group: Group = getters.id(id)
    if (!group)
      return

    if (!exchange_record) {
      const keys = Object.keys(rootState.cache.exchange_rates).sort()
      exchange_record = rootState.cache.exchange_rates[keys[keys.length - 1]] || FallbackExchangeRate
    }
    log(`🐱‍👤 Caching balances ${group.id} [${exchange_record.date}]`)
    const display_currency = oc(state.groups[group.id]).local_options.display_currency(undefined)
    const balances = GroupBalances(group, display_currency, exchange_record)
    const solutions = GetSettleUpSolutions(balances, group)

    commit('setCache', {
      field: 'balances',
      key: group.id,
      value: Object.freeze(balances.map(b => ({
        ...b,
        balance: +b.balance,
      }))),
    })
    commit('setCache', {
      field: 'solutions',
      key: group.id,
      value: Object.freeze(solutions.map(s => ({
        ...s,
        amount: +s.amount,
      }))),
    })
  },

  // Firebase
  onServerUpdate ({ dispatch, commit }, { data, timestamp }) {
    commit('onServerUpdate', { data, timestamp })
    dispatch('cacheGroup', data.id)
  },

  removeOnlineGroups ({ state, commit }) {
    for (const id of Object.keys(state.groups)) {
      if (state.groups[id].online)
        commit('remove', id)
    }
  },

  setConfigs ({ dispatch, commit, state }, { id, field, value }) {
    id = id || state.currentId
    commit('setConfigs', { id, field, value })
    if (field === 'display_currency')
      dispatch('cacheBalances', { id })
  },
}

export const mutations: MutationTree<GroupState> = {

  setCache (state, { field, key, value }) {
    Vue.set(state.cache[field], key, value)
  },

  setConfigs (state, { id, field, value }) {
    id = id || state.currentId
    const group = state.groups[id]
    if (group) {
      if (!group.local_options)
        group.local_options = {}
      group.local_options[field] = value
    }
  },

  switch (state, id: string | null) {
    state.currentId = id
  },

  // Groups
  add (state, group: ClientGroup) {
    Vue.set(state.groups, group.base.id, group)
  },

  remove (state, id) {
    id = id || state.currentId
    if (state.currentId === id)
      state.currentId = null
    Vue.delete(state.groups, id)
    Vue.delete(state.cache.groups, id)
    Vue.delete(state.cache.balances, id)
    Vue.delete(state.cache.solutions, id)
  },

  newOperation (state, { id, name, data, meta }) {
    id = id || state.currentId
    const group = state.groups[id]
    if (group) {
      group.operations.push(ProcessOperation({ name, data, meta }))
      group.lastchanged = +new Date()
    }
  },

  // Members

  // Firebase
  onServerUpdate (state, { data, timestamp }) {
    if (!data || !data.id)
      return
    const group: ServerGroup = data
    if (!state.groups[group.id]) {
      Vue.set(state.groups, group.id, {
        id: group.id,
        online: true,
        operations: [],
        lastchanged: timestamp,
      })
    }

    const serverOperations = group.operations || []
    const localOperations = state.groups[group.id].operations || []
    const unsyncedOperations = localOperations.filter(
      o => !includes(serverOperations, o.hash)
    )

    const clientGroup = state.groups[group.id]

    const activitiesCount = oc(clientGroup).base.activities.length(0)

    clientGroup.syncing_operations = (clientGroup.syncing_operations || [])
      .filter(i => !serverOperations.includes(i))
    clientGroup.base = Object.freeze(group.present)
    clientGroup.operations = unsyncedOperations
    clientGroup.lastsync = timestamp
    clientGroup.options = group.options
    clientGroup.synced_operations = serverOperations

    if (clientGroup.syncing_operations.length === 0) {
      clientGroup.syncing_state = 'done'
      clientGroup.syncing_error = null
    }

    const currentActivitiesCount = oc(clientGroup).base.activities.length(0)
    const newActivitiesCount = Math.max(currentActivitiesCount - activitiesCount, 0)

    if (group.id !== state.currentId)
      Vue.set(state.unreads, group.id, (state.unreads[group.id] || 0) + newActivitiesCount)
  },

  clearUnreads (state, id) {
    Vue.set(state.unreads, id, 0)
  },

  updateSyncingState (state, { id, syncing_error, syncing_operations }: Partial<ClientGroup>) {
    if (!id)
      return
    const group = state.groups[id]

    if (group.syncing_operations) {
      group.syncing_state = 'in_progress'
      group.syncing_operations = union(group.syncing_operations || [], syncing_operations)
    }

    if (syncing_error !== undefined) {
      group.syncing_error = syncing_error
      group.syncing_state = 'error'
      group.syncing_operations = []
    }
  },

  resetSyncingStates (state) {
    Object.values(state.groups).forEach((group) => {
      group.syncing_operations = []
    })
  },
}
