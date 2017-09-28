import Vue from 'vue'
import VueRouter from 'vue-router'
import $ from 'npm-zepto'
import Title from './utils/setTitle'
import { MessageBox } from 'mint-ui'

Vue.use(VueRouter)
var router = new VueRouter({
  history: true,
  linkActiveClass: 'active',
  saveScrollPosition: true,
  suppressTransitionError: true
})

router.afterEach(function (transition) {
  $('.msgbox-wrapper')[0] && MessageBox.close()
  let timer = setTimeout(() => {
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
    clearTimeout(timer)
  }, 0)
  $(window).unbind('scroll')
  let bridge = window.tinfiniteBridge
  if (bridge && bridge.showButton) {
    bridge.showButton('[]')
  }

  let title = transition.to.title
  Title.set(title)
})

router.map({
  '/clock_rank': {
    title: '打卡排行榜',
    name: 'clock_rank',
    component: (resolve) => {
      require(['./pages/clock_rank/'], resolve)
    }
  },
  '/at_me': {
    title: '@我的',
    name: 'at_me',
    component: (resolve) => {
      require(['./pages/at_me/'], resolve)
    }
  },
  '/reply': {
    title: '回复',
    name: 'reply',
    component: (resolve) => {
      require(['./pages/reply/'], resolve)
    }
  },
  '/reply_me': {
    title: '回复我的',
    name: 'reply_me',
    component: (resolve) => {
      require(['./pages/reply_me/'], resolve)
    }
  },
  '/replied': {
    title: '我回复的',
    name: 'replied',
    component: (resolve) => {
      require(['./pages/replied/'], resolve)
    }
  },
  '/favor': {
    title: '点赞',
    name: 'favor',
    component: (resolve) => {
      require(['./pages/favor/'], resolve)
    }
  },
  '/favor_list': {
    title: '点赞列表',
    name: 'favor_list',
    component: (resolve) => {
      require(['./pages/favor_list/'], resolve)
    }
  },
  '/favor_me': {
    title: '赞了我的',
    name: 'favor_me',
    component: (resolve) => {
      require(['./pages/favor_me/'], resolve)
    }
  },
  '/favored': {
    title: '我赞过的',
    name: 'favored',
    component: (resolve) => {
      require(['./pages/favored/'], resolve)
    }
  },
  '/my_post': {
    title: '我的贴',
    name: 'my_post',
    component: (resolve) => {
      require(['./pages/my_post/'], resolve)
    }
  },
  '/post_report': {
    title: '举报',
    name: 'post_report',
    component: (resolve) => {
      require(['./pages/post_report/'], resolve)
    }
  },
  '/clock_record': {
    title: '打卡',
    name: 'clock_record',
    component: (resolve) => {
      require(['./pages/clock_record/'], resolve)
    }
  },
  '/act_participant': {
    title: '查看活动参与人',
    name: 'act_participant',
    component: (resolve) => {
      require(['./pages/act_participant/'], resolve)
    }
  },
  '/voter': {
    title: '查看投票人',
    name: 'voter',
    component: (resolve) => {
      require(['./pages/voter/'], resolve)
    }
  },
  '/activity_rule': {
    title: '活动规则',
    name: 'activity_rule',
    component: (resolve) => {
      require(['./pages/activity_rule/'], resolve)
    }
  },
  '/test': {
    title: '测试',
    name: 'test',
    component: (resolve) => {
      require(['./pages/test/'], resolve)
    }
  },
  '/forum_detail': {
    title: '',
    name: 'forumdetail',
    component: (resolve) => {
      require(['./pages/forum_detail/'], resolve)
    }
  },
  '/forum_list': {  // 列表
    title: '',
    name: 'forumlist',
    component: (resolve) => {
      require(['./pages/forum_list/'], resolve)
    }
  }
})

router.alias({
  '/': '/forum_list'
})

export default router
