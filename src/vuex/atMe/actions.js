import * as T from '../mutation-types'
import log from '../../utils/logger'
import Request from '../../utils/request'

export const getAtMeList = ({ dispatch, state }, data, success, fail) => {
  Request.get({
    url: '/v3/bbs/at-me',
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
    dispatch(T.GET_AT_ME_LIST, data)
  }).catch((err) => {
    log.error(err)
  })
}

export const destroyAtMeStore = ({ dispatch, state }) => {
  dispatch(T.DESTROY_AT_ME_STORE)
}
