import Vue from 'vue'
import { APP_ID } from '../configs/app'
import { PREFIX, TOKEN } from '../configs/request'
import log from './logger'

export default {
  _logError (data, url) {
    if (data.code === 0) {
      log.error(`${PREFIX}${url}'s request error:`, data)
    }
  },

  _logFail (data, url) {
    log.error(`${PREFIX}${url}'s request fail:`, data)
  },

  init (params) {
    if (!params.url) {
      throw new Error('the lack of url of request')
    }
    Vue.http.headers.common['x-access-token'] = TOKEN
    Vue.http.headers.common['x-app-id'] = APP_ID
    Vue.http.options.emulateJSON = true
  },

  post (params) {
    return new Promise((resolve, reject) => {
      this.init(params)
      Vue.http.post(
        `${PREFIX}${params.url}`,
        params.data || {}
      ).then((res) => {
        let data = res.data
        this._logError(data, params.url)
        resolve(data)
      }, (res) => {
        this._logFail(res.data, params.url)
        reject(res.data)
      })
    })
  },

  get (params) {
    return new Promise((resolve, reject) => {
      this.init(params)
      Vue.http.get(
        `${PREFIX}${params.url}`,
        params.data ? { params: params.data } : {}
      ).then((res) => {
        let data = res.data
        this._logError(data, params.url)
        resolve(data)
      }, (res) => {
        this._logFail(res.data, params.url)
        reject(res.data)
      })
    })
  }
}
