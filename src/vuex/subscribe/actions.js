import * as T from '../mutation-types'
import log from '../../utils/logger'
import Request from '../../utils/request'

// 检查用户是否可以购买此服务
const ckeckHaveService = ({ dispatch, state }, data, fail) => {
  Request.post({
    url: '/v3/subscribe/get-user-product-function',
    data: data
  }).then((res) => {
    if (res.code !== 1) {
      fail && fail(res.message)
      return
    }
    dispatch(T.CHECK_HAVE_SERVICE, res.result)
  }).catch((err) => {
    log.error(err)
  })
}

// 加群
const joinChannel = ({ dispatch, state }, data, success) => {
  Request.post({
    url: '/v3/subscribe/join-channel',
    data: data
  }).then((res) => {
    if (res.code !== 1) {
      return
    }
    success && success()
    dispatch(T.JOIN_CHANNEL, res.result)
  }).catch((err) => {
    log.error(err)
  })
}

export {
  ckeckHaveService,
  joinChannel
}
