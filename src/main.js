import Vue from 'vue'
import App from './App'
import VueResource from 'vue-resource'
import { sync } from 'vuex-router-sync'
import router from './router'
import store from './vuex/store'
import 'vue-lazyload-img'
import filter from './filters/index'
import VueTouch from 'vue-touch'

Vue.use(VueTouch)
// install request
Vue.use(VueResource)

filter()

// install lazyload
Vue.use(Vue.lazyimg, {
  fadein: true, // 是否开启淡入效果的全局选项
  nohori: false, // 是否忽略横向懒加载的全局选项
  speed: 20 // 对屏幕滚动的速度的阈值，滚动速度高于此值时，不加载图片
})

// install routers with store
sync(store, router)

router.start(App, '#root')
