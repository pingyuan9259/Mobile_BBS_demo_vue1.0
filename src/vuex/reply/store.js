import * as T from '../mutation-types'

const state = {
  replyMePage: 1,
  replyMeAllLoaded: false,
  replyMeLists: [],
  replyMeIsNoNews: false,
  repliedPage: 1,
  repliedAllLoaded: false,
  repliedLists: [],
  repliedIsNoNews: false,
  collectionStatus: false,
  deleteStatus: false,
  replySelf: []
}

const mutations = {
  [T.GET_REPLY_ME_LIST] (state, data) {
    if (data.length) {
      state.replyMePage += 1
      state.replyMeLists = state.replyMeLists.concat(data)
    } else {
      state.replyMeAllLoaded = true
    }
    if (!state.replyMeLists.length) {
      state.replyMeIsNoNews = true
    }
  },

  [T.GET_REPLIED_LIST] (state, data) {
    if (data.length) {
      state.repliedPage += 1
      state.repliedLists = state.repliedLists.concat(data)
    } else {
      state.repliedAllLoaded = true
    }
    if (!state.repliedLists.length) {
      state.repliedIsNoNews = true
    }
  },

  [T.COLLECTION_REPLY] (state, data) {
    state.collectionStatus = data
  },

  [T.DELETE_REPLY] (state, data) {
    state.deleteStatus = data
  },

  [T.DESTROY_REPLY_STORE] (state) {
    state.replyMePage = 1
    state.replyMeAllLoaded = false
    state.replyMeLists = []
    state.replyMeIsNoNews = false
    state.repliedPage = 1
    state.repliedAllLoaded = false
    state.repliedLists = []
    state.repliedIsNoNews = false
    state.collectionStatus = false
    state.deleteStatus = false
    state.replySelf = []
  }
}

export default {
  state,
  mutations
}
