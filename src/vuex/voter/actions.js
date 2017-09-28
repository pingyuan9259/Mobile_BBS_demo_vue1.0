import * as T from '../mutation-types'
import log from '../../utils/logger'
import Request from '../../utils/request'

export const getVoterList = ({ dispatch, state }, data, success, fail) => {
  Request.get({
    url: '/v3/bbs/voter-list',
    data: data
  }).then((res) => {
    if (res.code !== 1) {
      if (res.need_login) {
        res.message = '请登录'
      }
      fail && fail(res.message)
      return
    }
    success && success()
    let data = res.result
    dispatch(T.GET_VOTER_LIST, data)
  }).catch((err) => {
    log.error(err)
  })
}

export const destroyVoterStore = ({ dispatch, state }) => {
  dispatch(T.DESTROY_VOTER_STORE)
}
