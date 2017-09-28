import Vue from 'vue'
import Vuex from 'vuex'
import forums from './forums/store'
import test from './test/store'
import home from './home/store'
import atMe from './atMe/store'
import reply from './reply/store'
import favor from './favor/store'
import post from './post/store'
import voter from './voter/store'
import clock from './clock/store'
import subscribe from './subscribe/store'

Vue.use(Vuex)
Vue.config.debug = true

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    test,
    forums,
    home,
    atMe,
    reply,
    favor,
    post,
    voter,
    clock,
    subscribe
  },
  strict: debug,
  middlewares: debug ? [] : []
})
