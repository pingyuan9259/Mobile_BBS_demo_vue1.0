import * as T from '../mutation-types'

const state = {
  favorMePage: 1,
  favorMeAllLoaded: false,
  favorMeLists: [],
  favorMeIsNoNews: false,
  favoredPage: 1,
  favoredAllLoaded: false,
  favoredLists: [],
  favoredIsNoNews: false,
  favorPage: 1,
  favorAllLoaded: false,
  favorLists: [],
  favorIsNoNews: false,
  favorNum: 0
}

const mutations = {
  [T.GET_FAVOR_ME_LIST] (state, data) {
    if (data.length) {
      state.favorMePage += 1
      state.favorMeLists = state.favorMeLists.concat(data)
    } else {
      state.favorMeAllLoaded = true
    }
    if (!state.favorMeLists.length) {
      state.favorMeIsNoNews = true
    }
  },

  [T.GET_FAVORED_LIST] (state, data) {
    if (data.length) {
      state.favoredPage += 1
      state.favoredLists = state.favoredLists.concat(data)
    } else {
      state.favoredAllLoaded = true
    }
    if (!state.favoredLists.length) {
      state.favoredIsNoNews = true
    }
  },

  [T.GET_FAVOR_LIST] (state, data) {
    if (data.userInfoList.length) {
      state.favorNum = data.tatal
      state.favorPage += 1
      state.favorLists = state.favorLists.concat(data.userInfoList)
    } else {
      state.favorAllLoaded = true
    }
    if (!state.favorLists.length) {
      state.favorIsNoNews = true
    }
  },

  [T.DESTORY_FAVOR_STORE] (state, data) {
    state.favorMePage = 1
    state.favorMeAllLoaded = false
    state.favorMeLists = []
    state.favorMeIsNoNews = false
    state.favoredPage = 1
    state.favoredAllLoaded = false
    state.favoredLists = []
    state.favoredIsNoNews = false
    state.favorPage = 1
    state.favorAllLoaded = false
    state.favorLists = []
    state.favorIsNoNews = false
    state.favorNum = 0
  }
}

export default {
  state,
  mutations
}
