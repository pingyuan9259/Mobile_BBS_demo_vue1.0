import { APP_ICO } from '../configs/app'

let favicon = {
  set () {
    let i = 0
    let links = document.getElementsByTagName('link')
    while (links[i]) {
      if (links[i].rel && (links[i].rel.indexOf('icon') !== -1 || links[i].rel.indexOf('shortcut') !== -1)) {
        links[i].href = APP_ICO
        break
      }
      i++
    }
  }
}

export default favicon
