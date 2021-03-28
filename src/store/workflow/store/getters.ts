
import { formatState } from '../types/formatState'
import { GetterTree } from 'vuex'

export const getters: GetterTree<formatState, any> = {
  getModulesFunction: state => {
    return state.modulesFunctions
  }
}
