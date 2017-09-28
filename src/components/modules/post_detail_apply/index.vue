<style lang="less">
  @import "../../../styles/base/base-750";
  @import './index';
</style>

<template>
  <!--  活动申请贴  -->
  <div class="activity" v-if="detail.type === CONFIG.postType.activity">
    <!--  每日任务  -->
    <div class="every-task">每日任务：{{ detail.goal }}</div>
    <br>
    <div class="every-task">每日打卡后，需超过1%的活动参与成员对打卡进行认证，即视为当天任务完成。</div>
    <!--  时间及活动金  -->
    <div class="activity_details">
      <p>
        报名时间：{{ detail.applyBeginAt | timeFormat }} 至 {{ detail.applyEndAt | timeFormat }}
      </p>
      <p>
        活动时间：{{ detail.activityBeginAt | timeFormat }} 至 {{ detail.activityEndAt | timeFormat }}
      </p>
      <p>
        活动金：{{ detail.fee }}元
      </p>
      <!-- 奖励详情 -->
      <div v-if="detail.canJoin === 7 && reward.finishStatus === 1" class="ongoing-detail">
        <p>
          参与人数：{{ reward.totalNumber }}人
        </p>
        <p>
          完成人数：{{ reward.finishNumber }}人
        </p>
        <p>
          活动储备金： {{ reward.activityReserve }}元
        </p>
        <p>
          平台手续费： {{ reward.poundage }}元
        </p>
        <p v-if="reward.activityReserve > reward.poundage">
          活动鼓励金： ({{ reward.activityReserve }}-{{  reward.poundage }})/{{ reward.finishNumber }}={{ reward.rewardPerPerson }}元 
        </p>
        <p v-else>
          活动鼓励金： ({{ reward.activityReserve }}-0)/{{ reward.finishNumber }}={{ reward.rewardPerPerson }}元 
        </p>
        <p>
          返还活动金： {{ reward.cardReward }}元
        </p>
        <p>
          总金额： {{ reward.totalPay }}元
        </p>
      </div>
      <div v-if="detail.canJoin === 7 && reward.finishStatus === 0" class="reward-detail">
        <p>
          活动持续： {{ reward.totalDays }}天
        </p>
        <p>
          每天活动金： {{ reward.fee / reward.totalDays }}元
        </p>
        <p>
          打卡天数： {{ reward.finishDays }}天
        </p>
        <p>
          返还活动金： {{ reward.cardReward }}元
        </p>
      </div>
    </div>
    <!--  参与人  -->
    <div class="haspeople" v-if="detail.joinMembers">
      <div class="join_member_total" v-link="{path: 'act_participant?postId=' + postId }">
        已有<span>{{ detail.joinMembers.total }}</span>人参与活动
      </div>
      <ul class="join_member_list">
        <li
          v-for="member in detail.joinMembers.userInfoList"
          class="join_member"
          @click="getUserInfo(member.userId)">
          <img :src="member.avatar || defaultAvatar | https" data-ignore="1" />
        </li>
      </ul>
    </div>
    <!-- 状态提示 -->
    <div class="status-tip">
      <p v-if="detail.canJoin === 3 && detail.joinOrNot === 0">活动报名即将开始</p>
      <p v-if="detail.joinOrNot === 1 && detail.canJoin === 5">已参加，活动即将开始</p>
      <p v-if="detail.joinOrNot === 1 && detail.canJoin === 6">已参加，活动进行中</p>
      <p v-if="detail.canJoin === 1">若活动申请未通过审核，活动金将返回钱包</p>
      <p v-if="detail.canJoin === 0">活动金已返还钱包</p>
      <p v-if="detail.canJoin === 2">活动报名即将开始</p>
      <p v-if="detail.canJoin === 7 && moment().isBefore(moment(detail.activityEndAt).add(1, 'days'))">活动已结束，24小时后可查看活动结算详情</p>
      <p v-if="moment().isAfter(moment(detail.activityEndAt).add(1, 'days')) && reward.finishStatus === 1">活动金和鼓励金已转入钱包，请去钱包查看</p>
      <p v-if="moment().isAfter(moment(detail.activityEndAt).add(1, 'days')) && reward.finishStatus === 0">活动金已转入钱包，请去钱包查看</p>
    </div>
    <!--  正在审核中  -->
    <div v-if="detail.isPass === 1" class="audit-con">
      <div class="join_btn can_not_join">正在审核...</div>
    </div>

    <!--  审核未通过  -->
    <div v-if="detail.isPass === 0" class="audit-con">
      <div class="join_btn can_not_join">审核未通过</div>
    </div>

    <!--  审核通过  -->
    <div v-if="detail.isPass === 2">
      <div v-if="detail.canJoin === 2" class="join_btn can_not_join">审核已通过</div>

      <!--  报名时间之前  -->
      <div v-if="detail.canJoin === 3">
        <div v-if="detail.joinOrNot === 0" class="join_btn can_not_join">审核已通过</div>
        <div v-else class="join_btn can_join" v-link="{ path: '/forum_list?bbsId='+ detail.bbsId +'&channelId=' + detail.channelId }">进入活动论坛</div>
      </div>

      <!--  报名时间内  -->
      <div v-if="detail.canJoin === 4">
        <div v-if="detail.joinOrNot === 0 && userId !== detail.userId" class="join_btn can_join" @click="payActivity">支付{{ detail.fee }}元活动金参与该活动</div>
        <div v-else class="join_btn can_join" v-link="{ path: '/forum_list?bbsId='+ detail.bbsId +'&channelId=' + detail.channelId }">进入活动论坛</div>
      </div>

      <!--  等待活动开始  -->
      <div v-if="detail.canJoin === 5">
        <div v-if="detail.joinOrNot === 0" class="join_btn can_not_join">报名已结束</div>
        <div v-else class="join_btn can_join" v-link="{ path: '/forum_list?bbsId='+ detail.bbsId +'&channelId=' + detail.channelId }">去打卡</div>
      </div>
      <!--  活动中  -->
      <div v-if="detail.canJoin === 6">
        <div v-if="detail.joinOrNot === 0" class="join_btn can_not_join">报名已结束</div>
        <div v-else class="join_btn can_join" v-link="{ path: '/forum_list?bbsId='+ detail.bbsId +'&channelId=' + detail.channelId }">去打卡</div>
      </div>
      <!--  活动结束后  -->
      <div v-if="detail.canJoin === 7">
        <div v-if="detail.joinOrNot === 0" class="join_btn can_not_join">活动已结束</div>
        <div v-else class="join_btn can_join" v-link="{ path: '/forum_list?bbsId='+ detail.bbsId +'&channelId=' + detail.channelId }">进入活动论坛</div>
      </div>
    </div>

    <!--  活动规则  -->
    <div class="rule_con">
      <div v-if="isMyPublish && detail.isPass === 1" class="undo-activity" @click="ubdoActivity"><span>撤销活动并退款</span></div>
      <div class="activity_rule icon-activity_rule" v-link="{ path: 'activity_rule'}"><span>活动规则</span></div>
    </div>
  </div>
  <mt-actionsheet :actions="actions" :visible.sync="sheetVisible"></mt-actionsheet>
</template>

<script>
import Vue from 'vue'
import { payToJoin, getReward } from '../../../vuex/forums/actions'
import { cardSuccessListener } from '../../../vuex/clock/actions'
import postConfig from '../../../constants/postType'
import { Actionsheet, MessageBox } from 'mint-ui'
import { APP_ID, DEVICE_ID_KEY } from '../../../configs/app'
import Cookie from '../../../utils/cookie'
import moment from 'moment'
import defaultImg from '../../../configs/default_img'

Vue.component(Actionsheet.name, Actionsheet)

export default {
  data () {
    return {
      CONFIG: postConfig,
      actions: [{
        name: '钱包支付',
        method: this.walletPay
      }],
      sheetVisible: false,
      payStyle: '',
      platform: '',
      appId: APP_ID,
      deviceId: DEVICE_ID_KEY,
      defaultAvatar: defaultImg.avatar,
      fromChannel: '',
      userId: null,
      isMyPublish: false,
      moment: moment
    }
  },
  vuex: {
    getters: {
      postId: state => state.route.query.postId,
      userInfo: ({ home }) => home.userInfo,
      detail: state => state.forums.detail,
      paymentListener: state => state.forums.paymentListener,
      reward: state => state.forums.reward
    },
    actions: {
      payToJoin,
      getReward,
      cardSuccessListener
    }
  },
  watch: {
    paymentListener (val) {
      MessageBox({
        message: '是否支付成功?',
        confirmButtonText: '完成支付',
        confirmButtonClass: 'confirm',
        showCancelButton: true,
        cancelButtonText: '未完成支付',
        cancelButtonClass: 'cancel'
      }).then(action => {
        window.history.go(0)
      })
      let bridge = window.tinfiniteBridge
      if (bridge && bridge.payforbyNative) {
        bridge.payforbyNative(JSON.stringify({
          platform: this.platform,
          orderInfo: val
        }))
      }
    }
  },
  created () {
    this.userId = window.localStorage.getItem('userId')
    if (!this.userId) {
      let userInfo = JSON.parse(decodeURIComponent(Cookie.getCookie('_user_info_' + APP_ID)))
      this.userId = userInfo.id
    }
    this.isMyPublish = (this.userId === this.detail.userId)
  },
  ready () {
    if (!window.tinfiniteListener) {
      window.tinfiniteListener = {}
    }

    window.tinfiniteListener.payforStatusListener = this.payforStatusListener
    window.tinfiniteListener.undoforStatusListener = this.undoforStatusListener

    if (this.detail.joinOrNot === 1 && moment().isAfter(moment(this.detail.activityEndAt).add(1, 'days'))) {
      let data = {
        bbs_id: this.detail.bbsId
      }
      this.getReward(data)
    }
  },
  methods: {
    payActivity () {
      this.sheetVisible = !this.sheetVisible
    },
    walletPay () {
      this._checkEquipment()
      let deviceId = Cookie.getCookie(this.deviceId)
      this.payStyle = 'wallet'
      this.platform = 3

      let data = {
        pay_method: this.payStyle,
        product_id: this.detail.id,
        from_channel: this.fromChannel,
        client_unique_id: deviceId,
        order_type: 98
      }

      let bridge = window.tinfiniteBridge
      if (bridge && bridge.payforbyNative) {
        bridge.payforbyNative(JSON.stringify({
          platform: this.platform,
          orderInfo: JSON.stringify(data)
        }))
      }
    },
    payment () {
      this._checkEquipment()
      let deviceId = Cookie.getCookie(this.deviceId)
      let data = {
        app_id: this.appId,
        pay_method: this.payStyle,
        post_id: this.detail.id,
        from_channel: this.fromChannel,
        client_unique_id: deviceId
      }
      this.payToJoin(data)
    },
    _checkEquipment () {
      let u = navigator.userAgent
      let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1
      let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
      if (isiOS) {
        this.fromChannel = 'ios'
      } else if (isAndroid) {
        this.fromChannel = 'android'
      }
    },
    payforStatusListener (data) {
      let res = JSON.parse(data)
      if (res && res.action === 22) {
        MessageBox({
          message: '是否支付成功?',
          confirmButtonText: '完成支付',
          confirmButtonClass: 'confirm',
          showCancelButton: true,
          cancelButtonText: '未完成支付',
          cancelButtonClass: 'cancel'
        }).then(action => {
          window.history.go(0)
        })
      }
    },
    getUserInfo (userId) {
      let bridge = window.tinfiniteBridge
      if (bridge && bridge.jumptoNativePage) {
        bridge.jumptoNativePage(JSON.stringify({
          pname: 'user_detail',
          options: { userId: userId }
        }))
      }
    },
    ubdoActivity () {
      MessageBox({
        message: '确定撤销当前活动并发起退款？',
        confirmButtonText: '确认',
        confirmButtonClass: 'confirm',
        showCancelButton: true,
        cancelButtonText: '取消',
        cancelButtonClass: 'cancel'
      }).then(action => {
        if (action === 'cancel') {
          return
        }
        let bridge = window.tinfiniteBridge
        if (bridge && bridge.undoforbyNative) {
          bridge.undoforbyNative(this.postId)
        }
      })
    },
    undoforStatusListener (data) {
      let res = JSON.parse(data)
      if (res.code !== 0) {
        MessageBox({
          message: '活动已被取消，活动金将在1-7个工作日内退回钱包余额',
          confirmButtonText: '知道了',
          confirmButtonClass: 'confirm'
        }).then(action => {
          window.history.go(-1)
        })
      } else {
        MessageBox({
          message: '活动撤销失败，请稍后重试',
          confirmButtonText: '知道了',
          confirmButtonClass: 'confirm'
        })
      }
    }
  }
}
</script>
