import APP_MAP from './appMap'

// 全局常量
const win = window
const loc = win.location
const host = loc.host
const port = loc.port
const APP_ENV = host.split('.')[0].split('-')[1] ? host.split('.')[0].split('-')[1] : 'pro'

// 初始变量
let APP_NAME = ''
let APP_ID = ''
let APP_LOGO = ''
let APP_ICO = ''
let APP_HOST = ''
let APP_KEY = ''
let DEVICE_ID_KEY = ''
let APP_IS_LOCAL = false

// for host
APP_HOST = host

// top level hostname
let topHostMatch = loc.hostname.match(/\.([^\.]+\.com)$/)
let TOP_LEVEL_HOST = topHostMatch && topHostMatch[1]

// for host
APP_HOST = TOP_LEVEL_HOST

// for app key
APP_KEY = TOP_LEVEL_HOST.split('.')[0]

// for appId & appLogo
if (!TOP_LEVEL_HOST) {
  throw new Error('url is wrong!')
} else {
  APP_ID = APP_MAP[APP_KEY].appId
  APP_LOGO = APP_MAP[APP_KEY].logo
  APP_ICO = APP_MAP[APP_KEY].ico
  DEVICE_ID_KEY = '_device_id_' + APP_ID
}

// for env
if (port) {
  APP_IS_LOCAL = true
}

export { APP_NAME, APP_KEY, APP_HOST, APP_IS_LOCAL, APP_ID, APP_LOGO, APP_ICO, TOP_LEVEL_HOST, APP_ENV, DEVICE_ID_KEY }
