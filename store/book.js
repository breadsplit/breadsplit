import randomstr from '~/utils/randomstr'
import Vue from 'vue'

const CreateBook = () => ({
  id: randomstr(5),
  name: '',
  icon: '',
  color: '',
  members: [],
  records: [],
  currenies: [],
  currenyrecords: [],
  options: {},
  serverid: null,
  lastsync: null,
  online: false,
  operation_history: [],
})

const CreateMember = ({ name, email, phone, role, avatar }) => ({
  id: randomstr(5),
  name,
  email,
  phone,
  avatar,
  role,
  uid: null,
})

export const state = () => ({
  books: [],
  currentIndex: -1,
})

export const getters = {
  current(state) {
    if (state.currentIndex < 0)
      return null
    return state.books[state.currentIndex] || null
  },
}

export const actions = {
  new({ commit, rootState, state, dispatch }, payload) {
    const book = Object.assign({}, CreateBook(), payload)
    commit('addBook', book)
    dispatch('newMember', { bookidx: state.books.length - 1, user: rootState.user, role: 'owner' })
  },
  newMember({ commit }, { bookidx, user, phone, role }) {
    const { name, email } = user
    const member = CreateMember({ name, email, phone, role })
    commit('addMember', { bookidx, member })
  },
}

export const mutations = {
  purge(state) {
    state.currentIndex = -1
    Vue.set(state, 'books', [])
  },
  switchTo(state, index) {
    state.currentIndex = index
  },
  switchToId(state, id) {
    const book = state.books.find(b => b.id === id)
    state.currentIndex = state.books.indexOf(book)
  },
  addMember(state, { bookidx, member }) {
    // TODO:Vaildate the uniquity of members' email
    state.books[bookidx].members.push(member)
  },
  removeMember(state, { bookidx, memberIndex }) {
    // TODO:
  },
  addBook(state, book) {
    state.books.push(book)
  },
  removeBook(state, bookidx) {
    state.books.splice(bookidx, 1)
  },
}
