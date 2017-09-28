import * as T from '../mutation-types'

const state = {
  page: 1,
  allLoaded: false,
  myPostLists: [],
  myPostIsNoNews: false,
  deleteStatus: false,
  complaintStatus: false,
  total: 0,
  JoinActivityPage: 1,
  JoinActivityLists: [],
  JoinActivityAllLoaded: false,
  JoinActivityNoNews: false
}

const mutations = {
  [T.GET_MY_POST_LIST] (state, data) {
    if (data.length) {
      state.page += 1
      state.myPostLists = state.myPostLists.concat(data)
      state.allLoaded = false
    } else {
      state.allLoaded = true
    }
    if (!state.myPostLists.length) {
      state.myPostIsNoNews = true
    }
  },

  [T.DELETE_POST] (state, data) {
    state.deleteStatus = data
  },

  [T.COMPLAINT_POST] (state, data) {
    state.complaintStatus = data
  },

  [T.GET_JOIN_ACTIVITY_MEMBERS] (state, data) {
    if (data.userInfoList.length) {
      state.total = data.total
      state.JoinActivityPage += 1
      state.JoinActivityLists = state.JoinActivityLists.concat(data.userInfoList)
      state.JoinActivityAllLoaded = false
    } else {
      state.JoinActivityAllLoaded = true
    }
    if (!state.JoinActivityLists.length) {
      state.JoinActivityNoNews = true
    }
  },

  [T.DESTROY_POST_STORE] (state) {
    state.page = 1
    state.allLoaded = false
    state.myPostLists = []
    state.myPostIsNoNews = false
    state.deleteStatus = false
    state.complaintStatus = false
    state.total = 0
    state.JoinActivityPage = 1
    state.JoinActivityLists = []
    state.JoinActivityAllLoaded = false
    state.JoinActivityNoNews = false
  }
}

export default {
  state,
  mutations
}
