import * as T from '../mutation-types'
import log from '../../utils/logger'
import Request from '../../utils/request'

// 获取论坛信息
const getForumSummary = ({ dispatch }, bbsId, channelId, success, fail) => {
  Request.get({
    url: '/v3/bbs/bbs-info',
    data: {
      bbs_id: bbsId,
      channel_id: channelId
    }
  }).then((res) => {
    if (res.code !== 1) {
      if (res.need_login) {
        res.message = '请登录'
      }
      fail && fail(res.message)
      return
    }
    success && success()
    dispatch(T.FORUM_SUMMARY, res.result)
  }).catch((err) => {
    log.error(err)
  })
}

//  获取普通论坛中所有贴子
const getCommonForumPostList = ({ dispatch }, data, success, fail, bool) => {
  Request.get({
    url: '/v3/bbs/normal-post',
    data: data
  }).then((res) => {
    if (res.code !== 1) {
      if (res.need_login) {
        res.message = '请登录'
      }
      fail && fail(res.message)
      return
    }
    success && success(res.result)
    dispatch(T.FORUM_ALL_LIST, data.sort, res.result, bool)
  }).catch((err) => {
    log.error(err)
  })
}

// 获取活动贴子
const getActForumPostList = ({ dispatch }, data, success, fail, bool) => {
  Request.get({
    url: '/v3/bbs/activity-post',
    data: data
  }).then((res) => {
    if (res.code !== 1) {
      if (res.need_login) {
        res.message = '请登录'
      }
      fail && fail(res.message)
      return
    }
    success && success(res.result)
    dispatch(T.FORUM_ACTIVITY_LIST, data.type, data.sort, res.result, bool)
  }).catch((err) => {
    log.error(err)
  })
}

// 获取报名中的活动申请贴
const getEnrollApplyList = ({ dispatch }, data, success, fail) => {
  Request.get({
    url: '/v3/bbs/applying-activity-list',
    data: data
  }).then((res) => {
    if (res.code !== 1) {
      if (res.need_login) {
        res.message = '请登录'
      }
      fail && fail(res.message)
      return
    }
    success && success(res.result)
    dispatch(T.ENROLL_APPLY_LIST, res.result)
  }).catch((err) => {
    log.error(err)
  })
}

// 获取作业贴
const getHomeWorkPost = ({ dispatch }, data, success, fail, bool) => {
  Request.get({
    url: '/v3/bbs/homework-post',
    data: data
  }).then((res) => {
    if (res.code !== 1) {
      if (res.need_login) {
        res.message = '请登录'
      }
      fail && fail(res.message)
      return
    }
    success && success(res.result)
    dispatch(T.HOME_WORK_LIST, res.result, bool)
  }).catch((err) => {
    log.error(err)
  })
}

// 获取已参与的活动申请贴
const getJoinApplyList = ({ dispatch }, data, success, fail) => {
  Request.get({
    url: '/v3/bbs/joined-activity-list',
    data: data
  }).then((res) => {
    if (res.code !== 1) {
      if (res.need_login) {
        res.message = '请登录'
      }
      fail && fail(res.message)
      return
    }
    success && success(res.result)
    dispatch(T.JOIN_APPLY_LIST, res.result)
  }).catch((err) => {
    log.error(err)
  })
}

// 获取我的活动申请贴
const getMyApplyList = ({ dispatch }, data, success, fail) => {
  Request.get({
    url: '/v3/bbs/my-activity-list',
    data: data
  }).then((res) => {
    if (res.code !== 1) {
      if (res.need_login) {
        res.message = '请登录'
      }
      fail && fail(res.message)
      return
    }
    success && success(res.result)
    dispatch(T.MY_APPLY_LIST, res.result)
  }).catch((err) => {
    log.error(err)
  })
}

// 获取活动申请贴的数量
const getApplyCount = ({ dispatch }) => {
  Request.get({
    url: '/v3/bbs/post-count'
  }).then((res) => {
    if (res.code !== 1) {
      return
    }
    dispatch(T.APPLY_COUNT, res.result)
  }).catch((err) => {
    log.error(err)
  })
}

// 发贴或打卡成功回调
const postSuccess = ({ dispatch }, data) => {
  if (data.postType === 3) {
    dispatch(T.ACTIVITY_LIST, data)
  }
  if (data.postType === 2) {
    dispatch(T.POST_LIST, data)
  }
  if (data.postType === 4) {
    dispatch(T.HOMEWORK_LIST, data)
  }
}

// 获取贴子信息
const getForumDetail = ({dispatch}, data, success, fail) => {
  Request.get({
    url: '/v3/bbs/post-details-post',
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
    dispatch(T.FORUM_DETAIL, res.result)
  }).catch(function (err) {
    log.error(err)
  })
}

// 获取可打卡状态
const getCardDetail = ({dispatch}, data) => {
  Request.get({
    url: '/v3/bbs/channel-to-bbs',
    data: data
  }).then((res) => {
    if (res.code !== 1) {
      if (res.need_login) {
        res.message = '请登录'
      }
    }
    dispatch(T.CARD_DETAIL, res.result)
  }).catch(function (err) {
    log.error(err)
  })
}

// 获取贴子回复信息
const getDetailReplys = ({ dispatch }, data, success) => {
  Request.get({
    url: '/v3/bbs/post-details-replys',
    data: data
  }).then((res) => {
    if (res.code !== 1) {
      return
    }
    success && success()
    let isFirstReply = true
    dispatch(T.FORUM_DETAIL_REPLAYS, res.result, isFirstReply)
  }).catch(function (err) {
    log.error(err)
  })
}

// 获取课程群管理员
const getChannelAdmin = ({ dispatch }, data, success) => {
  let arr = {
    'channel_ids[]': data
  }
  Request.post({
    url: '/v3/privilege/pr10003',
    data: arr
  }).then((res) => {
    if (res.code !== 1) {
      return
    }
    success && success(res, data)
  }).catch(function (err) {
    log.error(err)
  })
}

// 获取回复里的文章信息
const getPostDetail = ({dispatch}, data) => {
  let arr = []
  let obj = {}
  for (let i of data) {
    if (!obj[i]) {
      arr.push(i)
      obj[i] = 1
    }
  }
  if (!arr.length) {
    return
  }
  Request.post({
    url: '/v3/official-account/post/getPostInfoByIds',
    data: {
      ids: arr
    }
  }).then((res) => {
    if (res.code !== 1) {
      if (res.need_login) {
        res.message = '请登录'
      }
    }
    dispatch(T.POST_DETAIL, res.result)
  }).catch(function (err) {
    log.error(err)
  })
}

// 回复贴子成功后操作
const replyPostAction = ({ dispatch }, data) => {
  dispatch(T.FORUM_DETAIL_REPLAYS, data)
}

// 回复评论成功后操作
const replyCommentAction = ({ dispatch }, data) => {
  dispatch(T.FORUM_DETAIL_REPLAYS, data)
}

// 获取更多回复
const getMoreReplys = ({ dispatch }, params, success) => {
  Request.get({
    url: '/v3/bbs/more-reply',
    data: {
      post_id: params.postId,
      first_reply_id: params.firstReplyId
    }
  }).then(function (res) {
    if (res.code !== 1) {
      return
    }
    success && success()
    let forDelete = params.forDelete || false
    dispatch(T.FORUM_MORE_REPLY, {
      result: res.result,
      replysId: params.firstReplyId,
      forDelete
    })
  }).catch(function (err) {
    log.error(err)
  })
}

// 删除回复
const deleteReply = ({ dispatch, state }, data, success, fail) => {
  Request.post({
    url: '/v3/bbs/delete-reply',
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
    let params = {
      deleteStatus: res.result,
      replyId: data.reply_id,
      second: data.second || false
    }
    dispatch(T.FORUM_DELETE_REPLY, params)
  }).catch((err) => {
    console.log(err)
  })
}

// 投票（完成度)
const vote = ({ dispatch }, params, success) => {
  Request.post({
    url: '/v3/bbs/vote',
    data: {
      post_id: params.post_id,
      is_agree: params.is_agree
    }
  }).then(function (res) {
    if (res.result) {
      success && success()
      dispatch(T.FORUM_VOTE, params.is_agree)
    } else {
      log.error(res)
    }
  }).catch(function (err) {
    log.error(err)
  })
}

// 支付加入活动
const payToJoin = ({ dispatch }, data) => {
  Request.post({
    url: '/v3/payment/bbsorder/create',
    data: data
  }).then(function (res) {
    if (res.code !== 1) {
      return
    }
    if (data.pay_method === 'wcpay') {
      res.result = JSON.stringify(res.result)
    }
    dispatch(T.FORUM_PAY_TO_JOIN, res.result)
  }).catch(function (err) {
    log.error(err)
  })
}

// 点赞或取消点赞
const likeOrCancel = ({ dispatch }, data, success) => {
  Request.post({
    url: '/v3/bbs/like-or-cancel',
    data: data
  }).then((res) => {
    if (res.code === 1) {
      success && success()
      if (data.like_type === 1) {
        dispatch(T.FORUM_SWITCH_LIKE_OR_NOT, 1)
        // 提示成功点赞
      } else {
        dispatch(T.FORUM_SWITCH_LIKE_OR_NOT, 2)
        // 提示成功取消点赞
      }
    } else {
      // 失败
      return
    }
  }).catch((err) => {
    log.error(err)
  })
}

// 回复跳转操作
const replyLinkAction = ({ dispatch, state }, data, success, fail) => {
  Request.get({
    url: '/v3/bbs/floor-all-reply',
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
    dispatch(T.REPLY_LINK_ACTION, data)
  }).catch((err) => {
    console.log(err)
  })
}

// 修改论坛信息
const updateBbsInfo = ({ dispatch }, data) => {
  Request.post({
    url: '/v3/bbs/update-bbs-info',
    data: data
  }).then(function (res) {
    if (res.code !== 1) {
      return
    }
    dispatch(T.UPDATE_BBS_INFO, res.result, data.type)
  }).catch(function (err) {
    log.error(err)
  })
}

// 活动奖励详情
const getReward = ({ dispatch }, data) => {
  Request.get({
    url: '/v3/bbs/bbs-activity-reward',
    data: data
  }).then(function (res) {
    if (res.code !== 1) {
      return
    }
    dispatch(T.REWARD, res.result)
  }).catch(function (err) {
    log.error(err)
  })
}

// 销毁论坛store
const destroyForumsStore = ({ dispatch, state }) => {
  dispatch(T.DESTROY_FORUMS_STORE)
}

export {
  getForumSummary,
  getCommonForumPostList,
  getActForumPostList,
  getEnrollApplyList,
  getHomeWorkPost,
  getJoinApplyList,
  getMyApplyList,
  getApplyCount,
  getForumDetail,
  getCardDetail,
  getDetailReplys,
  getPostDetail,
  getChannelAdmin,
  replyPostAction,
  vote,
  payToJoin,
  getMoreReplys,
  deleteReply,
  likeOrCancel,
  updateBbsInfo,
  getReward,
  postSuccess,
  replyLinkAction,
  destroyForumsStore,
  replyCommentAction
}
