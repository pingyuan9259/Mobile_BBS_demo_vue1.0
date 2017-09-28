import * as T from '../mutation-types'

const state = {
  page: 1,
  voterLists: [],
  allLoaded: false,
  isNoNews: false,
  total: 0
}

const mutations = {
  [T.GET_VOTER_LIST] (state, data) {
    if (data.userInfoList.length) {
      state.total = data.total
      state.page += 1
      state.voterLists = state.voterLists.concat(data.userInfoList)
      state.allLoaded = false
    } else {
      state.allLoaded = true
    }
    if (!state.voterLists.length) {
      state.isNoNews = true
    }
  },

  [T.DESTROY_VOTER_STORE] (state) {
    state.page = 1
    state.voterLists = []
    state.allLoaded = false
    state.isNoNews = false
    state.total = 0
  }
}

export default {
  state,
  mutations
}
