import { formatState } from '../types/formatState'
import { ActionTree } from 'vuex'

export const actions: ActionTree<formatState, any> = {
  setModulesFunctions ({commit}, modulesFunctions) {
    commit('setModulesFunctions', modulesFunctions)
  },
  setSequences ({commit}, sequences) {
    commit('setSequences', sequences)
  },
  setCurrentSequence ({commit}, sequence) {
    commit('setCurrentSequence', sequence)
  }
}
