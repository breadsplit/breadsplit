import Vue from 'vue'
import includes from 'lodash/includes'
import orderBy from 'lodash/orderBy'
import union from 'lodash/union'
import { oc } from 'ts-optchain'
import { MutationTree, ActionTree, GetterTree, ActionContext } from 'vuex'
import { GroupState, RootState, Group, ServerGroup, Operation, ClientGroup, ExchangeRecord } from '~/types'
import { EvalTransforms, ProcessOperation, BasicCache, Transforms, MemberDefault, ClientGroupDefault, TransactionDefault, TransformKeys, IdMe } from '~/core'
import { GroupStateDefault } from '~/store'
import { GroupBalances, GetSettleUpSolutions, FallbackExchangeRate } from '@/core'
import { DEBUG } from '~/../meta/env'

// eslint-disable-next-line no-console
const log = (...args) => !DEBUG || console.log('VUX', ...args)

const OperationCache = new BasicCache<Group>()
const Transformer = EvalTransforms<Group>(Transforms, { cacheObject: OperationCache })

function origin() {
  return window.location.origin
}

export const state = GroupStateDefault

export const getters: GetterTree<GroupState, RootState> = {

  current(state) {
    if (!state.currentId)
      return undefined
    return state.cache.groups[state.currentId]
  },

  currentBalances(state) {
    if (!state.currentId)
      return undefined
    return state.cache.balances[state.currentId]
  },

  currentSolutions(state) {
    if (!state.currentId)
      return undefined
    return state.cache.solutions[state.currentId]
  },

  currentShareLink(state, getters) {
    const current = getters.current
    if (!current || !current.online)
      return undefined
    return `${origin()}/join?id=${current.id}`
  },

  currentDisplayCurrency(state) {
    if (!state.currentId)
      return undefined
    return oc(state.configs[state.currentId]).display_currency()
  },

  currentId(state) {
    return state.currentId
  },

  all(state) {
    return orderBy(Object.values(state.groups), ['lastchanged'], ['desc'])
      .map(group => state.cache.groups[group.id])
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

  activeMembers(state, getters) {
    return getters.activeMembersOf(state.currentId)
  },

  isSyncing: state => (groupId?: string) => {
    groupId = groupId || state.currentId || ''
    const group = state.groups[groupId]
    return !!(group.syncingOperations.length)
  },

  unsyncedOperationsOf: state => (id?: string) => {
    id = id || state.currentId || ''
    const group = state.groups[id]
    const isUnsynced = (o: Operation) => !(group.syncingOperations || []).includes(o.hash)
    return group.operations.filter(isUnsynced)
  },

  unreadsOf: state => (id?: string) => {
    id = id || state.currentId || ''
    return state.unreads[id] || 0
  },
}

function NewOperation(
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

  add(context, payload) {
    const group = ClientGroupDefault(payload)
    group.base.activities.push({
      by: context.rootGetters['user/uid'] || IdMe,
      timestamp: +new Date(),
      action: 'insert',
      entity: 'group',
    })
    context.commit('add', group)
    context.dispatch('cacheGroup', group.id)
  },

  modify(context, { id, changes }) {
    NewOperation(context, id, 'modify_meta', changes)
  },

  addMember(context, { id, member }) {
    member = MemberDefault(member)
    NewOperation(context, id, 'insert_member', member)
  },

  removeMember(context, { id, memberid }) {
    NewOperation(context, id, 'remove_member', memberid)
  },

  editMember(context, { id, memberid, changes }) {
    NewOperation(context, id, 'modify_member', { id: memberid, changes })
  },

  // Transcations
  newTranscation(context, { id, trans }) {
    trans = TransactionDefault(trans)
    NewOperation(context, id, 'insert_transaction', trans)
  },

  removeTranscation(context, { id, transid }) {
    NewOperation(context, id, 'remove_transaction', transid)
  },

  // editTranscation(context, { id, transid, changes }) {
  //  NewOperation(context, id, 'modify_transaction', { id: transid, changes })
  // },

  changeMemberId(context, { id, from, to }) {
    NewOperation(context, id, 'change_member_id', { from, to })
  },

  changeDisplayCurrency({ state, commit, dispatch }, { id, display_currency }) {
    id = id || state.currentId
    const group = state.cache.groups[id]
    if (!group)
      return
    commit('setConfigs', { id, field: 'display_currency', value: display_currency })
    dispatch('cacheBalances', { group })
  },

  // Caches
  cacheInit({ state, dispatch }) {
    for (const id of Object.keys(state.groups)) {
      if (!state.cache.groups[id])
        dispatch('cacheGroup', id)
    }
  },

  cacheGroup({ state, commit, dispatch }, id?: string|null) {
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
    dispatch('cacheBalances', { group })
  },

  cacheBalances({ state, commit, rootState }, { group, exchange_record }: { group: Group; exchange_record?: ExchangeRecord }) {
    if (!exchange_record) {
      const keys = Object.keys(rootState.cache.exchange_rates).sort()
      exchange_record = rootState.cache.exchange_rates[keys[keys.length - 1]] || FallbackExchangeRate
    }
    log(`🐱‍👤 Caching balances ${group.id} [${exchange_record.date}]`)
    const display_currency = oc(state.configs[group.id]).display_currency(undefined)
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
  onServerUpdate({ dispatch, commit }, { data, timestamp }) {
    commit('onServerUpdate', { data, timestamp })
    dispatch('cacheGroup', data.id)
  },

  removeOnlineGroups({ state, commit }) {
    for (const id of Object.keys(state.groups)) {
      if (state.groups[id].online)
        commit('remove', id)
    }
  },
}

export const mutations: MutationTree<GroupState> = {

  setCache(state, { field, key, value }) {
    Vue.set(state.cache[field], key, value)
  },

  setConfigs(state, { id, field, value }) {
    if (!state.configs[id])
      Vue.set(state.configs, id, { display_currency: value })
    else
      Vue.set(state.configs[id], field, value)
  },

  switch(state, id: string | null) {
    state.currentId = id
  },

  // Groups
  add(state, group: ClientGroup) {
    Vue.set(state.groups, group.base.id, group)
    state.currentId = group.base.id
  },

  remove(state, id) {
    id = id || state.currentId
    if (state.currentId === id)
      state.currentId = null
    Vue.delete(state.groups, id)
    Vue.delete(state.cache.groups, id)
    Vue.delete(state.cache.balances, id)
    Vue.delete(state.cache.solutions, id)
    Vue.delete(state.configs, id)
  },

  newOperation(state, { id, name, data, meta }) {
    id = id || state.currentId
    const group = state.groups[id]
    if (group) {
      group.operations.push(ProcessOperation({ name, data, meta }))
      group.lastchanged = +new Date()
    }
  },

  // Members

  // Firebase
  onServerUpdate(state, { data, timestamp }) {
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

    const serverOperations = group.operations
    const localOperations = state.groups[group.id].operations || []
    const unsyncedOperations = localOperations.filter(
      o => !includes(serverOperations, o.hash)
    )

    const clientGroup = state.groups[group.id]

    const activitiesCount = oc(clientGroup).base.activities.length(0)

    clientGroup.syncingOperations = (clientGroup.syncingOperations || [])
      .filter(i => !serverOperations.includes(i))
    clientGroup.base = Object.freeze(group.present)
    clientGroup.operations = unsyncedOperations
    clientGroup.lastsync = timestamp

    const currentActivitiesCount = oc(clientGroup).base.activities.length(0)
    const newActivitiesCount = Math.max(currentActivitiesCount - activitiesCount, 0)

    Vue.set(state.unreads, group.id, (state.unreads[group.id] || 0) + newActivitiesCount)
  },

  clearUnreads(state, id) {
    Vue.set(state.unreads, id, 0)
  },

  syncOperations(state, { id, operations }) {
    const group = state.groups[id]
    group.syncingOperations = union(group.syncingOperations || [], operations.map(o => o.hash))
  },

  resetSyncingStates(state) {
    Object.values(state.groups).forEach((group) => {
      group.syncingOperations = []
    })
  },
}
