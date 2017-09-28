import * as T from '../mutation-types'
import moment from 'moment'
import Cookie from '../../utils/cookie'
import { APP_ID } from '../../configs/app'

const state = {
  summary: {},
  commonPost: {
    page: 1,
    limit: 15,
    sort: '',
    list: [],
    allLoaded: false
  },
  activityPost: {
    page: 1,
    limit: 15,
    allLoaded: false
  },
  activityList: {},
  sharePost: {
    page: 1,
    limit: 15,
    list: [],
    allLoaded: false
  },
  enrollApplyList: {
    page: 1,
    limit: 15,
    sort: '',
    list: [],
    allLoaded: false
  },
  homeWorkList: {
    page: 1,
    limit: 15,
    sort: '',
    list: [],
    allLoaded: false
  },
  joinApplyList: {
    page: 1,
    limit: 15,
    sort: '',
    list: [],
    allLoaded: false
  },
  myApplyList: {
    page: 1,
    limit: 15,
    sort: '',
    list: [],
    allLoaded: false
  },
  applyCount: [],
  detail: {},
  replyPage: 1,
  replys: [],
  secondReplyList: [],
  paymentListener: '',
  AvatarUrl: '',
  agreeNum: 0, // 认证完成数
  disAgreeNum: 0, // 未完成数
  voteMembers: [], // 投票人数
  allLoaded: false,
  reward: {},
  cardDetail: {},
  articleList: {}
}

const mutations = {
  // 页面请求
  [T.FORUM_SUMMARY] (state, data) {
    state.summary = data
  },

  // 是否可打卡
  [T.CARD_DETAIL] (state, data) {
    state.cardDetail = data
  },

  // 发普通贴成功
  [T.POST_LIST] (state, data) {
    let arr = []
    let userInfo = JSON.parse(decodeURIComponent(Cookie.getCookie('_user_info_' + APP_ID)))
    let userId = userInfo ? userInfo.id : window.localStorage.getItem('userId')
    let userAvatar = userInfo ? userInfo.avatar : window.localStorage.getItem('userAvatar')
    let userName = userInfo ? userInfo.fullname : window.localStorage.getItem('userName')
    data.createrId = userId
    data.createrName = userName
    data.createrAvatar = userAvatar
    arr.unshift(data)
    state.sharePost.list = arr.concat(state.sharePost.list)
    state.commonPost.list = arr.concat(state.commonPost.list)
  },

  // 发作业贴成功
  [T.HOMEWORK_LIST] (state, data) {
    let arr = []
    let userInfo = JSON.parse(decodeURIComponent(Cookie.getCookie('_user_info_' + APP_ID)))
    let userId = userInfo ? userInfo.id : window.localStorage.getItem('userId')
    let userAvatar = userInfo ? userInfo.avatar : window.localStorage.getItem('userAvatar')
    let userName = userInfo ? userInfo.fullname : window.localStorage.getItem('userName')
    data.createrId = userId
    data.createrName = userName
    data.createrAvatar = userAvatar
    arr.unshift(data)
    state.homeWorkList.list = arr.concat(state.homeWorkList.list)
  },

  // 打卡成功
  [T.ACTIVITY_LIST] (state, data) {
    if (state.activityPost.allLoaded) {
      state.activityList[moment(data.createdAt).format('M月D日')] = state.activityList[moment(data.createdAt).format('M月D日')] || []
      state.activityList[moment(data.createdAt).format('M月D日')].unshift(data)
      state.activityList = Object.assign({}, state.activityList) // 改变对象引用状态
    }
  },

  [T.FORUM_ALL_LIST] (state, sort, data, bool) {
    if (bool) {
      state.homeWorkList = {
        page: 1,
        limit: 15,
        sort: '',
        list: [],
        allLoaded: false
      }
      state.commonPost.list = data
    } else {
      state.commonPost.list = data.length ? state.commonPost.list.concat(data) : state.commonPost.list
    }
    state.commonPost.allLoaded = data.length < state.commonPost.limit
    if (!state.commonPost.allLoaded) {
      state.commonPost.page++
    }
  },

  [T.FORUM_ACTIVITY_LIST] (state, type, sort, data, bool) {
    if (type === 3) { // 打卡贴
      if (bool) {
        data.length && data.forEach((value) => {
          state.activityList[moment(value.createdAt).format('M月D日')] = []
          state.activityList[moment(value.createdAt).format('M月D日')].unshift(value)
        })
      } else {
        data.length && data.forEach((value) => {
          state.activityList[moment(value.createdAt).format('M月D日')] = state.activityList[moment(value.createdAt).format('M月D日')]
          state.activityList[moment(value.createdAt).format('M月D日')].unshift(value)
        })
      }
      state.activityList = Object.assign({}, state.activityList) // 改变对象引用状态
      state.activityPost.allLoaded = data.length < state.activityPost.limit
      if (!state.activityPost.allLoaded) {
        state.activityPost.page++
      }
    } else if (type === 2 || !type) { // 普通贴
      if (state.sharePost.sort !== sort) { // 排序方式发生改变
        state.sharePost = {
          page: 1,
          limit: 15,
          sort: sort,
          list: [],
          allLoaded: false
        }
      }
      if (bool) {
        state.sharePost.list = data
      } else {
        state.sharePost.list = data.length ? state.sharePost.list.concat(data) : state.sharePost.list
      }
      state.sharePost.allLoaded = data.length < state.sharePost.limit
      if (!state.sharePost.allLoaded) {
        state.sharePost.page++
      }
    }
  },

  [T.ENROLL_APPLY_LIST] (state, data) {
    state.enrollApplyList.list = data.length ? state.enrollApplyList.list.concat(data) : state.enrollApplyList.list
    state.enrollApplyList.allLoaded = data.length < state.enrollApplyList.limit
    if (!state.enrollApplyList.allLoaded) {
      state.enrollApplyList.page++
    }
  },

  // 回复中的文章详情
  [T.POST_DETAIL] (state, data) {
    for (let i of data) {
      let postObj = {
        cover: i.cover,
        title: i.title
      }
      state.articleList[i.id] = postObj
      state.articleList = Object.assign({}, state.articleList)
    }
  },

  [T.HOME_WORK_LIST] (state, data, bool) {
    if (bool) {
      state.commonPost = {
        page: 1,
        limit: 15,
        sort: '',
        list: [],
        allLoaded: false
      }
      state.homeWorkList.list = data
    } else {
      state.homeWorkList.list = data.length ? state.homeWorkList.list.concat(data) : state.homeWorkList.list
    }
    state.homeWorkList.allLoaded = data.length < state.homeWorkList.limit
    if (!state.homeWorkList.allLoaded) {
      state.homeWorkList.page++
    }
  },

  [T.JOIN_APPLY_LIST] (state, data) {
    state.joinApplyList.list = data.length ? state.joinApplyList.list.concat(data) : state.joinApplyList.list
    state.joinApplyList.allLoaded = data.length < state.joinApplyList.limit
    if (!state.joinApplyList.allLoaded) {
      state.joinApplyList.page++
    }
  },

  [T.MY_APPLY_LIST] (state, data) {
    state.myApplyList.list = data.length ? state.myApplyList.list.concat(data) : state.myApplyList.list
    state.myApplyList.allLoaded = data.length < state.myApplyList.limit
    if (!state.myApplyList.allLoaded) {
      state.myApplyList.page++
    }
  },

  [T.APPLY_COUNT] (state, data) {
    state.applyCount.push(data.applyingActivity, data.joinedActivity, data.myActivity)
  },

  [T.FORUM_DETAIL] (state, data) {
    state.detail = Object.assign({}, data)
    state.agreeNum = data.agreeNum || 0
    state.disAgreeNum = data.disAgreeNum || 0
    state.voteMembers = data.voteMembers || []
  },

  [T.FORUM_DETAIL_REPLAYS] (state, data, isFirstReply) {
    // state.replys = data
    if (data && isFirstReply) {
      let newReplys = data.firstReplyList
      state.replyPage += 1
      state.replys = state.replys.concat(newReplys)
      if (!data.surplusFirstReplyNum) {
        state.allLoaded = true
      }
    } else if (data && data.length === 1) {   // 添加回复
      if (data[0].oneLevelId) { // 添加二级回复
        state.replys.forEach((reply) => {
          if (reply.replyId === data[0].oneLevelId) {
            if (reply.surplusSecondReplyNum > 0) {
              reply.surplusSecondReplyNum ++
            } else {
              reply.secondReplys = reply.secondReplys.concat(data)
            }
            return
          }
        })
      } else if (data[0].oneLevelReply) { // 添加一级回复
        if (state.allLoaded) {
          state.replys = state.replys.concat(data)
          state.articleList = Object.assign({}, state.articleList)
        }
      }
    }
  },

  // 页面操作
  [T.FORUM_VOTE] (state, isAgree) {
    state.detail.canVote = 0
    if (isAgree) {
      state.agreeNum ++
    } else {
      state.disAgreeNum ++
    }
    let userInfo = JSON.parse(decodeURIComponent(Cookie.getCookie('_user_info_' + APP_ID)))
    let userId = userInfo ? userInfo.id : window.localStorage.getItem('userId')
    let userAvatar = userInfo ? userInfo.avatar : window.localStorage.getItem('userAvatar')
    let userName = userInfo ? userInfo.fullname : window.localStorage.getItem('userName')
    let user = [{
      avatar: userAvatar,
      createdAt: '',
      userId: userId,
      userName: userName
    }]
    state.voteMembers = user.concat(state.voteMembers)
  },

  [T.FORUM_PAY_TO_JOIN] (state, data) {
    state.paymentListener = data
    // state.detail.canJoin = 0
  },

  [T.FORUM_MORE_REPLY] (state, data) {
    if (data.forDelete) {
      data.result = data.result.slice(0, 1)
    }
    state.secondReplyList = data.result
    if (state.replys) {
      state.replys.map((item) => {
        if (item.replyId === data.replysId) {
          item.secondReplys = item.secondReplys.concat(data.result)
          if (!data.forDelete) {
            item.surplusSecondReplyNum = 0
          }
          return
        }
      })
    }
  },

  [T.FORUM_DELETE_REPLY] (state, data) {
    state.deleteStatus = data.deleteStatus
    if (data.second) {
      state.replys.forEach((reply) => {
        if (reply.secondReplys) {
          reply.secondReplys.forEach((value, index) => {
            if (data.replyId === value.replyId) {
              reply.secondReplys.splice(index, 1)
              if (reply.surplusSecondReplyNum > 0) {
                reply.surplusSecondReplyNum--
              }
              return
            }
          })
        }
      })
    } else {
      state.replys.forEach((value, index) => {
        if (data.replyId === value.replyId) {
          state.replys.splice(index, 1)
          return
        }
      })
    }
  },

  [T.FORUM_SWITCH_LIKE_OR_NOT] (state, data) {
    state.detail.likeOrNot = data
  },

  [T.UPDATE_BBS_INFO] (state, data, type) {
    if (type === 1) {
      state.AvatarUrl = data
    } else if (type === 2) {
      state.summary.bbsIntroduction = data
    }
  },

  [T.REPLY_LINK_ACTION] (state, data) {
    // state.replySelf = data
    state.replys = state.replys.concat(data)
  },

  [T.REWARD] (state, data) {
    state.reward = data
  },

  [T.DESTROY_FORUMS_STORE] (state) {
    state.summary = {}
    state.commonPost = {
      page: 1,
      limit: 15,
      sort: '',
      list: [],
      allLoaded: false
    }
    state.activityPost = {
      page: 1,
      limit: 15,
      list: {},
      allLoaded: false
    }
    state.activityList = {}
    state.sharePost = {
      page: 1,
      limit: 15,
      list: [],
      allLoaded: false
    }
    state.enrollApplyList = {
      page: 1,
      limit: 15,
      sort: '',
      list: [],
      allLoaded: false
    }
    state.homeWorkList = {
      page: 1,
      limit: 15,
      sort: '',
      list: [],
      allLoaded: false
    }
    state.joinApplyList = {
      page: 1,
      limit: 15,
      sort: '',
      list: [],
      allLoaded: false
    }
    state.myApplyList = {
      page: 1,
      limit: 15,
      sort: '',
      list: [],
      allLoaded: false
    }
    state.applyCount = []
    state.detail = {}
    state.replyPage = 1
    state.replys = []
    state.secondReplyList = []
    state.paymentListener = ''
    state.AvatarUrl = ''
    state.agreeNum = 0
    state.disAgreeNum = 0
    state.voteMembers = []
    state.allLoaded = false
    state.cardDetail = {}
    state.articleList = {}
  }
}

export default {
  state,
  mutations
}
