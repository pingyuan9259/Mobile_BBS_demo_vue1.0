import * as T from '../mutation-types'
import log from '../../utils/logger'
import Request from '../../utils/request'

// 获取我的贴子
export const getMyPostList = ({ dispatch, state }, data, success, fail) => {
  Request.get({
    url: '/v3/bbs/my-posts',
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
    dispatch(T.GET_MY_POST_LIST, data)
  }).catch((err) => {
    log.error(err)
  })
}

// 删除贴子
export const deletePost = ({ dispatch, state }, data, success, fail) => {
  Request.post({
    url: '/v3/bbs/delete-post',
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
    dispatch(T.DELETE_POST, data)
  }).catch((err) => {
    log.error(err)
  })
}

// 举报贴子
export const complainPost = ({ dispatch, state }, data, success, fail) => {
  Request.post({
    url: '/v3/report/bbs-reply',
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
    dispatch(T.COMPLAINT_POST, data)
  }).catch((err) => {
    log.error(err)
  })
}

// 参与活动用户列表
export const getJoinActivityMembers = ({ dispatch, state }, data, success, fail) => {
  Request.get({
    url: '/v3/bbs/join-activity-members',
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
    dispatch(T.GET_JOIN_ACTIVITY_MEMBERS, data)
  }).catch((err) => {
    log.error(err)
  })
}

export const destroyPostStore = ({ dispatch, state }) => {
  dispatch(T.DESTROY_POST_STORE)
}
