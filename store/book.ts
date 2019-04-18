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
    options: {},

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

const CreateMember = (payload:{ name:string }): Member => {
  return Object.assign({
    id: randomstr(10),
    name: '',
    role: MemberRoles.collaborator,
  }, payload)
}

// Store

export const state = (): BookState => ({
  books: [],
  currentIndex: -1,
})

export const getters: GetterTree<BookState, RootState> = {

  current(state:BookState) {
    if (state.currentIndex < 0)
      return null
    return state.books[state.currentIndex] || null
  },

  last(state:BookState) {
    if (!state.books.length)
      return null
    return state.books[state.books.length - 1] || null
  },

}

export const actions: ActionTree<BookState, RootState> = {

  new({ commit }, payload) {
    const book = CreateBook(payload)
    commit('addBook', book)
  },

  newMember({ commit, state }, { bookidx, member }) {
    if (bookidx == null || bookidx < 0)
      bookidx = state.currentIndex
    if (bookidx >= 0)
      commit('addMember', { bookidx, member: CreateMember(member) })
  },

  editMember({ commit, state }, { bookidx, memberid, changes }) {
    if (bookidx == null || bookidx < 0)
      bookidx = state.currentIndex
    if (bookidx >= 0)
      commit('editMember', { bookidx, memberid, changes })
  },

  removeMember({ commit, state }, { bookidx, memberid }) {
    if (bookidx == null || bookidx < 0)
      bookidx = state.currentIndex
    if (bookidx >= 0)
      commit('removeMember', { bookidx, memberid })
  },

}

export const mutations: MutationTree<BookState> = {

  purge(state) {
    state.currentIndex = -1
    Vue.set(state, 'books', [])
  },

  switchTo(state, index: number) {
    state.currentIndex = index
  },

  switchToId(state, id: string) {
    const book = state.books.find(b => b.id === id)
    state.currentIndex = book ? state.books.indexOf(book) : -1
  },

  addMember(state, { bookidx, member }) {
    // TODO:Vaildate the uniquity of members' email
    state.books[bookidx].members.push(member)
  },

  removeMember(state, { bookidx, memberid }) {
    const member = state.books[bookidx].members.find(m => m.id === memberid)
    const index = member ? state.books[bookidx].members.indexOf(member) : -1
    if (index > -1)
      state.books[bookidx].members.splice(index, 1)
  },

  editMember(state, { bookidx, memberid, changes }) {
    const member = state.books[bookidx].members.find(m => m.id === memberid)
    Object.assign(member, changes)
  },

  addBook(state, book: Book) {
    state.books.push(book)
  },

  removeBook(state, bookidx) {
    state.books.splice(bookidx, 1)
  },
}
