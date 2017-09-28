import * as T from '../mutation-types'
import Request from '../../utils/request'

export const getFavorMeList = ({ dispatch, state }, data, success, fail) => {
  Request.get({
    url: '/v3/bbs/like-me',
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
    dispatch(T.GET_FAVOR_ME_LIST, data)
  }).catch((err) => {
    console.log(err)
  })
}

export const getFavoredList = ({ dispatch, state }, data, success, fail) => {
  Request.get({
    url: '/v3/bbs/i-like',
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
    dispatch(T.GET_FAVORED_LIST, data)
  }).catch((err) => {
    console.log(err)
  })
}

export const getFavorList = ({ dispatch, state }, data, success, fail) => {
  Request.get({
    url: '/v3/bbs/post-like-list',
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
    dispatch(T.GET_FAVOR_LIST, data)
  }).catch((err) => {
    console.log(err)
  })
}

export const destroyFavorStore = ({ dispatch, state }) => {
  dispatch(T.DESTORY_FAVOR_STORE)
}
