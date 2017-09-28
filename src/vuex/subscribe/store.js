import * as T from '../mutation-types'

const state = {
  productInfo: null,
  joinChannelStatus: false
}

const mutations = {
  [T.CHECK_HAVE_SERVICE] (state, data) {
    state.productInfo = data
  },

  [T.JOIN_CHANNEL] (state, data) {
    state.joinChannelStatus = data
  }
}

export default {
  state,
  mutations
}
