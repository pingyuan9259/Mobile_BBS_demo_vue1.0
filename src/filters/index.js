import Vue from 'vue'
import moment from 'moment'

export default function () {
  moment.locale('zh-cn', {
    months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
    monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
    weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
    weekdaysShort: '周日_周一_周二_周三_周四_周五_周六'.split('_'),
    weekdaysMin: '日_一_二_三_四_五_六'.split('_'),
    longDateFormat: {
      LT: 'Ah点mm分',
      LTS: 'Ah点m分s秒',
      L: 'YYYY-MM-DD',
      LL: 'YYYY年MMMD日',
      LLL: 'YYYY年MMMD日Ah点mm分',
      LLLL: 'YYYY年MMMD日ddddAh点mm分',
      l: 'YYYY-MM-DD',
      ll: 'YYYY年MMMD日',
      lll: 'YYYY年MMMD日Ah点mm分',
      llll: 'YYYY年MMMD日ddddAh点mm分'
    },
    meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
    meridiemHour: function (hour, meridiem) {
      if (hour === 12) {
        hour = 0
      }
      if (meridiem === '凌晨' || meridiem === '早上' || meridiem === '上午') {
        return hour
      } else if (meridiem === '下午' || meridiem === '晚上') {
        return hour + 12
      } else {
          // '中午'
        return hour >= 11 ? hour : hour + 12
      }
    },
    meridiem: function (hour, minute, isLower) {
      var hm = hour * 100 + minute
      if (hm < 600) {
        return '凌晨'
      } else if (hm < 900) {
        return '早上'
      } else if (hm < 1130) {
        return '上午'
      } else if (hm < 1230) {
        return '中午'
      } else if (hm < 1800) {
        return '下午'
      } else {
        return '晚上'
      }
    },
    calendar: {
      sameDay: function () {
        return this.minutes() === 0 ? '[今天]Ah[点整]' : '[今天]LT'
      },
      nextDay: function () {
        return this.minutes() === 0 ? '[明天]Ah[点整]' : '[明天]LT'
      },
      lastDay: function () {
        return this.minutes() === 0 ? '[昨天]Ah[点整]' : '[昨天]LT'
      },
      nextWeek: function () {
        var startOfWeek, prefix
        startOfWeek = moment().startOf('week')
        prefix = this.diff(startOfWeek, 'days') >= 7 ? '[下]' : '[本]'
        return this.minutes() === 0 ? prefix + 'dddAh点整' : prefix + 'dddAh点mm'
      },
      lastWeek: function () {
        var startOfWeek, prefix
        startOfWeek = moment().startOf('week')
        prefix = this.unix() < startOfWeek.unix() ? '[上]' : '[本]'
        return this.minutes() === 0 ? prefix + 'dddAh点整' : prefix + 'dddAh点mm'
      },
      sameElse: 'LL'
    },
    ordinalParse: /\d{1,2}(日|月|周)/,
    ordinal: function (number, period) {
      switch (period) {
        case 'd':
        case 'D':
        case 'DDD':
          return number + '日'
        case 'M':
          return number + '月'
        case 'w':
        case 'W':
          return number + '周'
        default:
          return number
      }
    },
    relativeTime: {
      future: '%s内',
      past: '%s前',
      s: '几秒',
      m: '1 分钟',
      mm: '%d 分钟',
      h: '1 小时',
      hh: '%d 小时',
      d: '1 天',
      dd: '%d 天',
      M: '1 个月',
      MM: '%d 个月',
      y: '1 年',
      yy: '%d 年'
    },
    week: {
      // GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效
      dow: 1, // Monday is the first day of the week.
      doy: 4  // The week that contains Jan 4th is the first week of the year.
    }
  })

  Vue.filter('default', (value, newValue) => {
    return value === '' ? newValue : value
  })

  Vue.filter('dateFormat', (value) => {
    moment.locale('zh-cn')
    if (!value) { return }
    let nowDay = moment().format('YYYY-MM-DD') // 当前年月日
    let proxDay = moment().subtract(1, 'days').format('YYYY-MM-DD') // 前一天年月日
    let commentDay = moment(value).format('YYYY-MM-DD')  // 传进来的年月日
    let nowHour = moment().format('YYYY-MM-DD HH') // 当前小时
    let commentHour = moment(value).format('YYYY-MM-DD HH') // 传进来的小时

    if (moment(nowDay).isSame(commentDay, 'day')) {
      if (moment(nowHour).isSame(commentHour, 'hour')) {
        let time = moment(value).fromNow()
        if (time.indexOf('几秒') !== -1) {
          time = '1分钟内'
        } else {
          time = time.replace(/\s/g, '')
        }
        return time
      } else {
        return '今天' + moment(value).format('HH:mm')
      }
    } else if (moment(proxDay).isSame(commentDay, 'day')) {
      return '昨天' + moment(value).format('HH:mm')
    } else {
      return moment(value).format('YYYY-MM-DD')
    }
  })

  Vue.filter('Format', (value) => {
    moment.locale('zh-cn')
    if (!value) { return }
    let nowDay = moment().format('YYYY-MM-DD') // 当前年月日
    let nextDay = moment().add(1, 'days').format('YYYY-MM-DD') // 明天年月日
    let commentDay = moment(value).format('YYYY-MM-DD')  // 传进来的年月日

    if (moment(nowDay).isSame(commentDay, 'day')) {
      return '今天'
    } else if (moment(nextDay).isSame(commentDay, 'day')) {
      return '明天'
    } else {
      return moment(value).format('M.D')
    }
  })

  Vue.filter('AtUser', (value, data) => {
    let reg = /@[\u4e00-\u9fa5]+\s/i
    let string = value
    for (let i = 0, len = data.length; i < len; i++) {
      // let name = string.match(reg)[0].substring(1)
      string = string.replace(reg, '<span class="name" data-user-id="' + data[i].id + '">@' + data[i].fullname + '</span>')
    }
    return string
  })

  Vue.filter('timeFormat', (value) => {
    moment.locale('zh-cn')
    if (!value) return
    return moment(value).format('YYYY-MM-DD')
  })

  Vue.filter('pointInTimeFormat', (value) => {
    moment.locale('zh-cn')
    if (!value) { return }
    let nowDay = moment().format('YYYY-MM-DD') // 当前年月日
    let commentDay = moment(value).format('YYYY-MM-DD')  // 传进来的年月日
    let nowHour = moment().format('YYYY-MM-DD HH') // 当前小时
    let commentHour = moment(value).format('YYYY-MM-DD HH') // 传进来的小时

    if (moment(nowDay).isSame(commentDay, 'day')) {
      if (moment(nowHour).isSame(commentHour, 'hour')) {
        let time = moment(value).fromNow()
        if (time.indexOf('几秒') !== -1) {
          time = '1分钟内'
        } else {
          time = time.replace(/\s/g, '')
        }
        return time
      } else {
        return moment(value).format('HH:mm')
      }
    } else {
      return moment(value).format('MM/DD')
    }
  })

  Vue.filter('personFormat', (value) => {
    if (!value) return
    if (value >= 1000) {
      value = value / 1000 + 'k'
    }
    return value
  })

  Vue.filter('https', (value) => {
    if (!value) {
      return value
    }
    let res = value.match(/^(?:[^\/]*)\/\/(.+)/)
    res = res ? ('//' + res[1]) : ''
    return res
  })

  Vue.filter('enter', (value, num) => {
    if (!value) {
      return value
    }
    value = value.replace(/</g, '&lt;').replace(/>/g, '&gt;')
    let res = value.replace(/\n/g, '<br>')
    if (num) {
      res = value.replace(/\n/g, '<br>').substring(0, num)
    }
    return res
  })

  Vue.filter('linkReplace', (value, sign) => {
    if (!value) {
      return ''
      // throw new Error('filter linkRelace is lack of Value!')
    }
    if (!sign) {
      value = value.replace(/</g, '&lt;').replace(/>/g, '&gt;')
    }
    let RegUrl = new RegExp()
    let urlList = []

    RegUrl.compile('((http[s]{0,1})://[A-Za-z0-9-_]+\\.[A-Za-z0-9-_%&\?#\/.=]+[A-Za-z0-9]+/?)|([a-zA-Z][a-zA-Z0-9\\.\\-]+\\.(com|cn|net|org|int|edu|info|biz|jobs|mobi|tel)(:\\d+)?(/[a-zA-Z0-9\\.\\-~!@#$%^&*+?:_/=<>]*)?)', 'g') // eslint-disable-line
    urlList = value.match(RegUrl)

    if (!urlList || urlList.length === 0) {
      return value
    }

    for (let item of urlList) {
      if (!(/^(http:[^\/]*)\/\/(.+)/).test(item) && !(/^(https:[^\/]*)\/\/(.+)/).test(item)) {
        let link = 'http://' + item
        value = value.replace(item, `<a href="${link}" target="_blank">${item}</a>`)
      } else {
        value = value.replace(item, `<a href="${item}" target="_blank">${item}</a>`)
      }
    }
    return value
  })

  Vue.filter('getPost', (value, num) => {
    if (!value) return
    let postObj = JSON.parse(window.localStorage.getItem(value))
    if (postObj && num === 1) {
      return postObj.cover
    } else if (postObj && num === 2) {
      return postObj.title
    } else {
      setTimeout(() => {
        // window.location.reload()
      }, 2000)
    }
  })
}
