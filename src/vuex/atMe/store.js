import * as T from '../mutation-types'

const state = {
  page: 1,
  lists: [],
  allLoaded: false,
  isNoNews: false
}

const mutations = {
  [T.GET_AT_ME_LIST] (state, data) {
    if (data.length) {
      state.page += 1
      state.lists = state.lists.concat(data)
    } else {
      state.allLoaded = true
    }
    if (!state.lists.length) {
      state.isNoNews = true
    }
  },

  [T.DESTROY_AT_ME_STORE] (state) {
    state.page = 1
    state.lists = []
    state.allLoaded = false
    state.isNoNews = false
  }
}

export default {
  state,
  mutations
}
