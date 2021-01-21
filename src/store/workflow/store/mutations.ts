import { MutationTree } from 'vuex'
import {formatState} from '../types/formatState'

export const mutations: MutationTree<formatState> = {
  ['setModulesFunctions'] (state, modulesFunctions) {
    state.modulesFunctions = modulesFunctions
  }
}
