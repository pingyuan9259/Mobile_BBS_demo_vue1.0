import * as T from '../mutation-types'

const state = {
  lists: []
}

const mutations = {
  [T.GETLIST] (state, lists) {
    state.lists = lists
  }
}

export default {
  state,
  mutations
}
