const GETLIST = 'GETLIST'
const FORUM_SUMMARY = 'FORUM_SUMMARY'         // 论坛简介
const FORUM_LIST = 'FORUM_LIST'               // 论坛列表
const FORUM_ALL_LIST = 'FORUM_ALL_LIST'   // 获取所有贴子
const FORUM_ACTIVITY_LIST = 'FORUM_ACTIVITY_LIST'   // 论坛活动贴列表
const ENROLL_APPLY_LIST = 'ENROLL_APPLY_LIST' // 报名中的活动申请贴
const HOME_WORK_LIST = 'HOME_WORK_LIST' // 作业贴
const JOIN_APPLY_LIST = 'JOIN_APPLY_LIST' // 已参加的活动申请贴
const MY_APPLY_LIST = 'MY_APPLY_LIST' // 我的活动申请贴
const APPLY_COUNT = 'APPLY_COUNT' // 活动申请贴的数量
const FORUM_DETAIL = 'FORUM_DETAIL'           // 贴子详情
const FORUM_DETAIL_REPLAYS = 'FORUM_DETAIL_REPLAYS'           // 贴子回复详情
const DESTROY_FORUMS_STORE = 'DESTROY_FORUMS_STORE'           // 销毁论坛
// 首页
const GET_HOME_LIST = 'GET_HOME_LIST'         // 获取论坛首页列表
const GET_USER_DETAIL = 'GET_USER_DETAIL'     // 获取用户信息
const DESTROY_HOME_STORE = 'DESTROY_HOME_STORE' // 销毁Home中的所有数据
// @我
const GET_AT_ME_LIST = 'GET_AT_ME_LIST'       // 获取@我列表
const DESTROY_AT_ME_STORE = 'DESTROY_AT_ME_STORE'   // 销毁@我中的所有数据
// 回复
const GET_REPLY_ME_LIST = 'GET_REPLY_ME_LIST' // 获取回复我列表
const GET_REPLIED_LIST = 'GET_REPLIED_LIST'   // 获取我回复的列表
const FORUM_DELETE_REPLY = 'FORUM_DELETE_REPLY' // 删除回复
const COLLECTION_REPLY = 'COLLECTION_REPLY'   // 收藏回复
const REPLY_LINK_ACTION = 'REPLY_LINK_ACTION' // 我回复跳转操作
const POST_DETAIL = 'POST_DETAIL' // 回复中的文章详情
const DESTROY_REPLY_STORE = 'DESTROY_REPLY_STORE' // 销毁Reply中的所有数据
// 赞了
const GET_FAVOR_ME_LIST = 'GET_FAVOR_ME_LIST' // 获取赞了我的列表
const GET_FAVORED_LIST = 'GET_FAVORED_LIST'   // 获取我赞了的列表
const GET_FAVOR_LIST = 'GET_FAVOR_LIST'       // 获取点赞列表
const DESTORY_FAVOR_STORE = 'DESTORY_FAVOR_STORE'   // 销毁Favor中的所有数据
// 贴子
const POST_LIST = 'POST_LIST' // 发普通贴成功回调
const HOMEWORK_LIST = 'HOMEWORK_LIST' // 发作业贴成功回调
const GET_MY_POST_LIST = 'GET_MY_POST_LIST'   // 获取我的贴子列表
const DELETE_POST = 'DELETE_POST'             // 删除贴子
const COMPLAINT_POST = 'COMPLAINT_POST'       // 投诉贴子
const DESTROY_POST_STORE = 'DESTROY_POST_STORE'   // 销毁Post中的所有数据
// 投票
const GET_VOTER_LIST = 'GET_VOTER_LIST'       // 获取投票人列表
const DESTROY_VOTER_STORE = 'DESTROY_VOTER_STORE' // 销毁Voter中的所有数据
// 打卡
const CARD_DETAIL = 'CARD_DETAIL'             // 可打卡状态
const ACTIVITY_LIST = 'ACTIVITY_LIST'         // 打卡成功
const GET_CLOCK_LIST = 'GETCLOCKLIST'         // 获取打卡列表
const GET_CLOCK_RECORD = 'GET_CLOCK_RECORD'   // 获取打卡信息
const CARD_SUCCESS_LISTENER = 'CARD_SUCCESS_LISTENER' // 打卡成功监听操作（打卡详情页）
const DESTORY_CLOCK_STORE = 'DESTORY_CLOCK_STORE'   // 销毁Clock中的所有数据

const GET_JOIN_ACTIVITY_MEMBERS = 'GET_JOIN_ACTIVITY_MEMBERS'  // 获取参与活动用户列表
const FORUM_VOTE = 'FORUM_VOTE'                   // 投票
const FORUM_PAY_TO_JOIN = 'FORUM_PAY_TO_JOIN'     // 支付参加活动
const FORUM_MORE_REPLY = 'FORUM_MORE_REPLY'       // 获取更多评论
const FORUM_SWITCH_LIKE_OR_NOT = 'FORUM_SWITCH_LIKE_OR_NOT' // 点赞或取消
const CHECK_HAVE_SERVICE = 'CHECK_HAVE_SERVICE'   // 检查用户是否购买此服务
const JOIN_CHANNEL = 'JOIN_CHANNEL'               // 加群
const UPDATE_BBS_INFO = 'UPDATE_BBS_INFO'         // 修改论坛信息

export {
  GETLIST,
  FORUM_SUMMARY,
  FORUM_LIST,
  FORUM_ALL_LIST,
  FORUM_ACTIVITY_LIST,
  ENROLL_APPLY_LIST,
  HOME_WORK_LIST,
  JOIN_APPLY_LIST,
  MY_APPLY_LIST,
  APPLY_COUNT,
  POST_DETAIL,
  FORUM_DETAIL,
  CARD_DETAIL,
  FORUM_DETAIL_REPLAYS,
  DESTROY_FORUMS_STORE,
  GET_HOME_LIST,
  GET_USER_DETAIL,
  DESTROY_HOME_STORE,
  GET_AT_ME_LIST,
  DESTROY_AT_ME_STORE,
  GET_REPLY_ME_LIST,
  GET_REPLIED_LIST,
  FORUM_DELETE_REPLY,
  COLLECTION_REPLY,
  REPLY_LINK_ACTION,
  DESTROY_REPLY_STORE,
  GET_FAVOR_ME_LIST,
  GET_FAVORED_LIST,
  GET_FAVOR_LIST,
  DESTORY_FAVOR_STORE,
  GET_MY_POST_LIST,
  DELETE_POST,
  COMPLAINT_POST,
  HOMEWORK_LIST,
  DESTROY_POST_STORE,
  GET_VOTER_LIST,
  DESTROY_VOTER_STORE,
  GET_CLOCK_LIST,
  GET_CLOCK_RECORD,
  CARD_SUCCESS_LISTENER,
  DESTORY_CLOCK_STORE,
  GET_JOIN_ACTIVITY_MEMBERS,
  FORUM_VOTE,
  FORUM_PAY_TO_JOIN,
  FORUM_MORE_REPLY,
  FORUM_SWITCH_LIKE_OR_NOT,
  CHECK_HAVE_SERVICE,
  JOIN_CHANNEL,
  UPDATE_BBS_INFO,
  POST_LIST,
  ACTIVITY_LIST
}
