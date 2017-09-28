import * as T from '../mutation-types'
import Request from '../../utils/request'

// 获取回复我
export const getReplyMeList = ({ dispatch, state }, data, success, fail) => {
  Request.get({
    url: '/v3/bbs/reply-me',
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
    dispatch(T.GET_REPLY_ME_LIST, data)
  }).catch((err) => {
    console.log(err)
  })
}

// 获取我回复
export const getRepliedList = ({ dispatch, state }, data, success, fail) => {
  Request.get({
    url: '/v3/bbs/i-reply',
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
    dispatch(T.GET_REPLIED_LIST, data)
  }).catch((err) => {
    console.log(err)
  })
}

// 收藏回复
export const collectionReply = ({ dispatch, state }, data, success, fail) => {
  Request.post({
    url: '/v3/collection',
    data: data
  }).then((res) => {
    if (res.code !== 1) {
      if (res.need_login) {
        res.message = '请登录'
      }
      fail && fail(res.message)
      return
    }
    let data = res.result
    success && success()
    dispatch(T.COLLECTION_REPLY, data)
  }).catch((err) => {
    console.log(err)
  })
}

// 销毁回复store
export const destroyReplyStore = ({ dispatch, state }) => {
  dispatch(T.DESTROY_REPLY_STORE)
}
