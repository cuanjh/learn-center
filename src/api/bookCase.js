import { httpLogin } from './api.js'
import config from './config.js'
export default {
  bookCaseIndex () {
    return httpLogin(config.bookCaseIndex)
  },
  langInfo (params) {
    return httpLogin(config.langInfo, params)
  }
}
