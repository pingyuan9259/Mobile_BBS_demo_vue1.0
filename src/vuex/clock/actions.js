import * as T from '../mutation-types'
import Request from '../../utils/request'

export const getClockList = ({ dispatch, state }, data, success, fail) => {
  Request.get({
    url: '/v3/bbs/clock-rank',
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
    dispatch(T.GET_CLOCK_LIST, data)
  }).catch(function (err) {
    console.log(err)
  })
}

export const getClockRecord = ({ dispatch, state }, data, success, fail) => {
  Request.get({
    url: '/v3/bbs/clock-record',
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
    dispatch(T.GET_CLOCK_RECORD, data)
  }).catch((err) => {
    console.log(err)
  })
}

// 打卡成功监听操作（打卡详情页）
export const cardSuccessListener = ({ dispatch, state }) => {
  dispatch(T.CARD_SUCCESS_LISTENER)
}

export const destroyClockStore = ({ dispatch, state }) => {
  dispatch(T.DESTORY_CLOCK_STORE)
}
