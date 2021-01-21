import { formatState } from '../types/formatState'
import { ActionTree } from 'vuex'

export const actions: ActionTree<formatState, any> = {
  setModulesFunctions ({commit}, modulesFunctions) {
    commit('setModulesFunctions', modulesFunctions)
  }
}
