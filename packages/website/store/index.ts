import { MutationTree, ActionTree } from 'vuex'
import { RootState } from '~/types'

export const state = (): RootState => ({
  user_locale: null,
})

export const mutations: MutationTree<RootState> = {
}

export const actions: ActionTree<RootState, RootState> = {
}
