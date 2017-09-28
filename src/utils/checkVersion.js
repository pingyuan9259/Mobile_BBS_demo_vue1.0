import Cookie from './cookie'
import { APP_ID } from '../configs/app'

const toNum = (version) => {
  let v = version.toString()
  let c = v.split('.')
  let numPlace = ['', '0', '00', '000', '0000']
  let r = numPlace.reverse()
  for (let i = 0; i < c.length; i++) {
    let len = c[i].length
    c[i] = r[len] + c[i]
  }
  let res = c.join('')
  return res
}
let largeVersion = (version) => {
  let theVersion = Cookie.getCookie('_version_' + APP_ID)
  if (!theVersion) {
    return false
  }
  let _a = toNum(theVersion)
  let _b = toNum(version)
  if (_a >= _b) {
    return true
  }
  if (_a < _b) {
    return false
  }
}

export default largeVersion
