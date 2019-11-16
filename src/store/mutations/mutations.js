import _ from 'lodash'
import simplePinyin from 'simple-pinyin'

export default {
  // updateCourseLangsList (state, data) {
  //   let arr = []
  //   data.forEach((item) => {
  //     let obj = item
  //     let name = item.name
  //     let pinyin = _.flattenDeep(simplePinyin(name, { pinyinOnly: false })).join('')
  //     obj['pinyin'] = pinyin
  //     obj['letter'] = pinyin.slice(0, 1).toUpperCase()
  //     arr.push(obj)
  //   })
  //   state.courseLangsList = data
  // },
  updateCourseLangsList (state, data) {
    console.log('data==========>', data)
    // let hotCourseMini = data.hotCourses.concat(data.kidCourses)
    let allCourseList = [...data.kidCourses, ...data.listCourses]
    let arr = []
    allCourseList.forEach((item) => {
      let obj = item
      let name = item.name
      if (!item.pinyin && !item.letter) {
        let pinyin = _.flattenDeep(simplePinyin(name, { pinyinOnly: false })).join('')
        obj['pinyin'] = pinyin
        obj['letter'] = pinyin.slice(0, 1).toUpperCase()
      }
      arr.push(obj)
    })
    state.courseLangsList = arr
    console.log(state.courseLangsList)
  },
  // 更新快速登录登录用户的信息
  updateLoginInfo (state, data) {
    state.loginInfo = data
    console.log('快速登录用户信息', data)
  },
  // 更新用户信息
  updateUserInfo (state, data) {
    state.userInfo = data.info
    sessionStorage.setItem('userInfo', JSON.stringify(state.userInfo))
    console.log('userInfo', state.userInfo)
  },
  // 更新上传七牛的token
  updateFileQiniuToken (state, data) {
    state.FileQiniuToken = data.token
  },
  // 电台主播推荐
  updatereCommendRadioTeachers (state, data) {
    state.recommendRadioTeachers = data
    console.log('电台主播推荐', state.recommendRadioTeachers)
  },
  updateLangsState (state, data) {
    let opt = []
    opt.push({'lan_code': data.currentLang.lan_code, 'text': data.currentLang.name + '优先'})
    opt.push({'lan_code': data.skillLang.lan_code, 'text': '母语优先'})
    state.langsStateSel = opt
    console.log('语言状态选项', state.langsStateSel)
  },
  // 更新相关课程
  updateLangCodes (state, data) {
    let arr = []
    console.log('data', data)
    if (!data) {
      state.langCodesSel = [{'lan_code': '', 'text': '全部'}]
    } else {
      arr.push({'lan_code': '', 'text': '全部'})
      if (data.currentLang.hasSet) {
        arr.push({'lan_code': data.currentLang.lan_code, 'text': data.currentLang.name + '相关'})
      }
      if (data.skillLang.hasSet) {
        arr.push({'lan_code': data.skillLang.lan_code, 'text': '母语相关'})
      }
      state.langCodesSel = arr
    }
    console.log('语言相关', state.langCodesSel)
  },
  updateRecommendRadios (state, res) {
    state.recommendRadioPage = res.page
    state.recommendRadios = res.data
    console.log('推荐的电台', state.recommendRadios)
  },
  updateRecommendRadioPage (state, page) {
    state.recommendRadioPage = page
  },
  // 更新匿名状态
  updateIsAnonymous (state, flag) {
    state.isAnonymous = flag
  },
  updateKidRecordList (state, records) {
    state.kidRecordList = records
  }
}
