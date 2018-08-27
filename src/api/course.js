import { httpLogin } from './api'
import config from './config'

export default {
  currentCourse () {
    return httpLogin(config.currentCourse, {
      content_version: '1.5'
    })
  }
}
