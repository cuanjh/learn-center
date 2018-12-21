import { httpLogin } from '../../api/api'
import config from '../../api/config'

export default {
  getUserInfo ({commit}) {
    httpLogin(config.umUserGetInfoApi).then((res) => {
      console.log(res)
    })
  }
}
