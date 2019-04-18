import randomstr from '~/utils/randomstr'
import Vue from 'vue'
import { MutationTree, ActionTree, GetterTree } from 'vuex'
import { Book, Member, MemberRoles } from '~/types'
import { BookState, RootState } from '~/types/store'

// Helpers

const CreateBook = (payload = {}): Book => {
  const book:Book = Object.assign({
    id: randomstr(5),
    name: '',
    options: {
      multiple_currencies: true,
    },
    time_created: +new Date(),

    members: [],
    transactions: [],
    currencies: [],
    currency_records: [],
    activities: [],

    online: false,
  }, payload)

  book.members = book.members.map(m => CreateMember(m))

  return book
}

const CreateMember = (payload = {}): Member => {
  return Object.assign({
    id: randomstr(10),
    name: '',
    role: MemberRoles.collaborator,
  }, payload)
}

// Store

export const state = (): BookState => ({
  books: {},
  currentId: null,
})

export const getters: GetterTree<BookState, RootState> = {

  current(state) {
    if (!state.currentId)
      return undefined
    return state.books[state.currentId] || undefined
  },

  books(state) {
    return Object.values(state.books)
  },

}

export const actions: ActionTree<BookState, RootState> = {

}

export const mutations: MutationTree<BookState> = {

  purge(state) {
    state.currentId = null
    Vue.set(state, 'books', {})
  },

  switch(state, id: string | null) {
    state.currentId = id
  },

  // Books
  add(state, payload) {
    const book = CreateBook(payload)
    Vue.set(state.books, book.id, book)
  },

  remove(state, id) {
    Vue.delete(state.books, id)
  },

  edit(state, { id, changes }) {
    id = id || state.currentId
    Object.assign(state.books[id], changes)
  },

  // Members
  addMember(state, { id, member }) {
    id = id || state.currentId
    state.books[id].members.push(CreateMember(member))
  },

  removeMember(state, { id, memberid }) {
    id = id || state.currentId
    const member = state.books[id].members.find(m => m.id === memberid)
    const index = member ? state.books[id].members.indexOf(member) : -1
    if (index > -1)
      state.books[id].members.splice(index, 1)
  },

  editMember(state, { id, memberid, changes }) {
    id = id || state.currentId
    const member = state.books[id].members.find(m => m.id === memberid)
    if (member)
      Object.assign(member, changes)
  },

}
