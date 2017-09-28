import * as T from '../mutation-types'

const state = {
  lists: [],
  activityLists: [],
  atNum: 0,
  replyNum: 0,
  likeNum: 0,
  userInfo: null
}

const mutations = {
  [T.GET_HOME_LIST] (state, data) {
    state.lists = data.bbsList
    state.activityLists = data.activityBbsList
    state.atNum = data.atNum
    state.replyNum = data.replyNum
    state.likeNum = data.likeNum
  },

  [T.GET_USER_DETAIL] (state, data) {
    state.userInfo = Object.assign({}, data)
  },

  [T.DESTROY_HOME_STORE] (state) {
    state.lists = []
    state.activityLists = []
    state.atNum = 0
    state.replyNum = 0
    state.likeNum = 0
    state.userInfo = null
  }
}

export default {
  state,
  mutations
}
