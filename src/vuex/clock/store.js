import * as T from '../mutation-types'

const state = {
  page: 1,
  clockLists: [],
  allLoaded: false,
  myClockInfo: {},
  clockDetail: {},
  scale: 0,
  isNoNews: false
}

const mutations = {
  [T.GET_CLOCK_LIST] (state, data) {
    if (data.clockRank.length) {
      state.myClockInfo = {
        avatar: data.avatar,
        clockNumber: data.clockNumber,
        fullname: data.fullname,
        rank: data.rank,
        userId: data.userId
      }
      state.page += 1
      state.clockLists = state.clockLists.concat(data.clockRank)
    } else {
      state.allLoaded = true
    }
    if (!state.clockLists.length) {
      state.isNoNews = true
    }
  },

  [T.GET_CLOCK_RECORD] (state, data) {
    state.clockDetail = data
    state.scale = data.finishDays / data.goalDays
  },

  [T.CARD_SUCCESS_LISTENER] (state) {
    state.clockDetail.finishDays += 1
    state.clockDetail.todayStatus = true
    state.scale = state.clockDetail.finishDays / state.clockDetail.goalDays
  },

  [T.DESTORY_CLOCK_STORE] (state) {
    state.page = 1
    state.clockLists = []
    state.allLoaded = false
    state.myClockInfo = {}
    state.clockDetail = {}
    state.scale = 0
    state.isNoNews = false
  }
}

export default {
  state,
  mutations
}
