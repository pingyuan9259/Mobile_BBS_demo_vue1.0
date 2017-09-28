import cookieParser from 'cookie'
import { APP_ENV, APP_ID } from './app'

let cookie = cookieParser.parse(document.cookie)

let PREFIX = '//api-saas.tinfinite.com'
let TOKEN = cookie['_app_token_' + APP_ID] || cookie['_app_token']
let SOCKET_URI = 'http://im-saas.tinfinite.com'

// 判断有没有 env 有的话就是客户端 使用约定的token
let env = cookie['_app_env_' + APP_ID]
if (env) {
  let suffix = APP_ENV === 'pro' ? '' : '-' + APP_ENV
  PREFIX = '//api-saas' + suffix + '.tinfinite.com'
  SOCKET_URI = 'http://im-saas' + suffix + '.tinfinite.com'
} else {
  // 没有env就是在web端  使用老版配置
  let SUFFIX = APP_ENV === 'pro' ? '' : APP_ENV
  if (SUFFIX) {
    TOKEN = cookie[['_app_token', SUFFIX].join('_')]
    PREFIX = '//api-saas' + '-' + SUFFIX + '.tinfinite.com'
    SOCKET_URI = 'http://im-saas' + '-' + SUFFIX + '.tinfinite.com'
  } else {
    TOKEN = cookie['_app_token']
  }
}
export { PREFIX, TOKEN, SOCKET_URI }
