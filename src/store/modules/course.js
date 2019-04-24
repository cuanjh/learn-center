/* jshint esversion: 6 */

import _ from 'lodash'
import Cookie from 'js-cookie'

import { httpLogin, httpAssets, httpNoLogin } from '../../api/api'
import config from '../../api/config'
import * as courseMethod from './courseMethod'

const state = {
  language: 'chinese',
  languagueHander: 'zh-CN', // 默认不同的level的实现方式
  learnCourses: [], // 已订阅的课程
  radioCourses: [], // 订阅的电台课程
  subscribeCoursesStr: '',
  loading: false, // 用来判断加载状态程序
  currentCourseCode: '',
  currentChapterCode: '',
  courseBaseInfo: {},
  coverShow: false, // 遮罩
  learnInfo: {},
  finishedChapter: 0,
  chapterNum: 0,
  curLevel: '',
  scrollPos: {},
  levelNum: 6,
  levelDetail: [],
  levelDes: {
    'Level1': '初级 A1',
    'Level2': '初级 A2',
    'Level3': '中级 B1',
    'Level4': '中级 B2',
    'Level5': '高级 C1',
    'Level6': '高级 C1'
  },
  chapterDes: [],
  contentUrl: '',
  assetsUrl: '',
  chapters: {},
  curLevelChapters: [],
  unlock: {},
  unlockCourseList: {},
  unlockCourses: '',
  buyChapters: '',
  buyHide: true, // 购买成功后浮层消失
  curChapterProgress: '',
  curCorePart: {},
  curChapterContent: {},
  curSlide: 0,
  pathArr: [], // ['Level1', 'Unit1', 'Chapter2', 'A0', 'slide1']
  progress: {},
  recordForm: {},
  levelActivity: 0,
  formScores: {},
  core: false,
  homework: false,
  improvement: false,
  coreComplete: false,
  homeworkComplete: false,
  improvementComplete: false,
  homeworkContent: {},
  chapterTestResult: {}, // 记录用户的课程测试结果
  historyCourseRecord: {}, // 记录课程的历史数据
  feedInfos: [], // 动态列表
  radioRewardList: [],
  courseLangs: {}, // 官方课程
  partnerList: {}, // 语伴列表
  dynamicsLists: [], // 动态列表
  DynamicIndex: [] // 动态首页数据
}

const actions = {
  currentCourse () {
    return httpLogin(config.currentCourse, {
      content_version: '1.5'
    })
  },
  getLearnCourses ({commit, state, dispatch}) {
    state.learnCourses = []
    state.radioCourses = []
    return httpLogin(config.moreLearnCoursesApi).then((res) => {
      commit('clearMoreCourses')
      _.map(res.learn_courses, (course) => {
        if (course.course_type === 0) {
          dispatch('getUnlockChapter', course.code).then((data) => {
            commit('updateLearnCourses', { course, data })
          })
        } else if (course.course_type === 1) {
          commit('updateRadioCourses', course)
        }
      })
    })
  },
  getCourseList ({ commit }) {
    return httpLogin(config.getCourseList)
  },
  getLearnInfo ({ commit }, courseCode) {
    return httpLogin(config.learnInfo, { course_code: courseCode }).then((res) => {
      commit('updateCourseInfo', res)
      return res
    })
  },
  getCourseContent ({ commit, state }, contentUrl) {
    return httpAssets(contentUrl).then((res) => {
      commit('updateChapters', res)
      commit('updateCurChapterUrl', state.currentChapterCode)
      commit('updateCurChapter', state.currentChapterCode)
    })
  },
  getUnlockChapter ({ commit }, courseCode) {
    return httpLogin(config.unlockChapter, { course_code: courseCode })
  },
  getRecord ({ commit }, currentChapterCode) {
    return httpLogin(config.getRecord, { activity_code: currentChapterCode })
  },
  postProgress ({ commit, state }) {
    let formScores = {}
    _.forIn(state.formScores, (value, key) => {
      if (value > -1) {
        formScores[key] = value
      }
    })
    state.formScores = formScores
    return httpLogin(config.postProgress, { forms: JSON.stringify(state.formScores) })
  },
  getProgress ({ commit }, currentChapterCode) {
    return httpLogin(config.getProgress, { chapter_code: currentChapterCode, state: '' }).then((res) => {
      if (res.state !== 0) {
        commit('updateCurChapterProgress', res.record.forms)
      } else {
        commit('updateCurChapterProgress', '')
      }
    })
  },
  setCurrentChapter ({ commit }, curChapter) {
    return httpLogin(config.setCurChapter, { chapter_code: curChapter }).then((res) => {
      commit('updateCurChapterUrl', curChapter)
      commit('updateCurChapter', curChapter)
    })
  },
  getChapterContent ({ commit, state }) {
    return httpAssets(state.assetsUrl + state.curChapterUrl).then((res) => {
      commit('updateChapterContent', res)
    })
  },
  getGradeInfo ({ commit, state }, courseCode) {
    return httpLogin(config.hasGrade, { content_version: '1.5', course_code: courseCode })
  },
  levelGrade ({ commit, state }, courseCode) {
    return httpLogin(config.levelGradeGrade, { course_code: courseCode })
  },
  homeworkContent ({ commit, state }, activityCode) {
    return httpLogin(config.homeworkContent, { activity_code: activityCode }).then((res) => {
      commit('updateHomeworkContent', res.contents)
    })
  },
  homeworkPub ({ commit, state }, params) {
    return httpLogin(config.homeworkPub, params)
  },
  // 删除已订阅的课程的接口实现
  getDeletePurchase ({ commit, dispatch }, code) {
    return httpLogin(config.getStudyDelCourse, { code: code })
  },
  postUnlockChapter ({ commit }, params) {
    return httpLogin(config.postUnlockChapter, params)
  },
  getBuyChapter ({ commit }, params) {
    return httpLogin(config.getBuyChapter, params)
  },
  getCourseTestRanking ({ commit, state }, chapterCode) {
    return httpLogin(config.courseTestRanking, { chapter_code: chapterCode }).then((res) => {
      commit('updateChapterTestResult', res.result)
    })
  },
  /**
   * 书架相关
   */
  // 书架首页接口
  bookCaseIndex () {
    return httpLogin(config.bookCaseIndex)
  },
  // 语言课程信息接口
  langInfoDetails ({ commit, dispatch }, params) {
    return httpLogin(config.langInfo, params)
    // return httpLogin(config.langInfo, params).then((res) => {
    //   commit('updateCourseDetails', res)
    //   res.countryInfo.forEach(item => {
    //     state.countrysInfoLists = []
    //     dispatch('countryInfo', {code: item.code}).then((res) => {
    //       item.countryLangueInfos = res.country_info.langsInfo
    //     })
    //   })
    // })
  },
  // 获取课程资源列表
  getShelfResList ({ commit }, params) {
    return httpLogin(config.shelfResList, params)
  },
  postPurchaseCourse ({ commit }, params) {
    return httpLogin(config.purchaseCourse, params)
  },
  // 世界语言地图
  worldLanguageMap ({ commit }, params) {
    return httpLogin(config.languageMap, params)
  },
  // 国家详情接口
  countryInfo ({ commit }, params) {
    return httpLogin(config.countryInfo, params)
  },
  // 书架语言课程搜索
  shelfSearch ({commit}, params) {
    return httpLogin(config.shelfSearchApi, params)
  },
  // 获取和课程相关的语言列表信息
  getCourseLangs ({commit}) {
    return httpNoLogin(config.courseLangs)
  },
  // 中国方言地图课程列表
  getChinaLangMap ({commit}) {
    return httpLogin(config.chinaLangMapApi)
  },
  /**
   * 动态相关
   */
  // 动态首页数据
  getCommunity ({commit, dispatch}, params) {
    state.DynamicIndex = []
    return httpLogin(config.communityApi, params).then((data) => {
      commit('updateDynamicIndex', data)
    })
  },
  getDynamicLists ({commit, dispatch}, params) {
    state.dynamicsLists = []
    return httpLogin(config.dynamicListsApi, params).then(res => {
      console.log('params', params)
      res.dynamicList.dynamics.forEach(item => {
        let id = item.info.id
        dispatch('radioAuthorCommentRewardList', {id: id}).then((res) => {
          item.rewardLists = res.detail.rewards
          commit('updateDynamicsLists', item)
        })
      })
    })
  },
  // 发布动态
  getDynamic ({commit}, params) {
    return httpLogin(config.dynamicPubApi, params)
  },
  // 动态话题列表
  getTopicsLists ({commit}, params) {
    return httpLogin(config.topicsListsApi, params)
  },
  /**
   * 发现相关
   */
  postDisvHome ({commit}) {
    return httpLogin(config.disvHomeApi)
  },
  postDisvRadio ({commit}) {
    return httpLogin(config.disvRadioApi)
  },
  postRadioDetail ({commit}, code) {
    let api = config.radioDetailApi.replace('<course_code>', code)
    return httpLogin(api)
  },
  getRadioList ({commit}, params) {
    return httpLogin(config.radioListsApi, params)
  },
  getRadioCardList ({commit}, params) {
    let api = config.radioCardListApi.replace('{course_code}', params.code)
      .replace('{list_order}', params.listOrder)
      .replace('{page}', params.page)
      .replace('{pagesize}', params.pageSize)
    return httpLogin(api)
  },
  // 获取电台课程卡片详情
  getRadioCardDetail ({commit}, params) {
    return httpLogin(config.radioCardDetailApi, params)
  },
  // 获取电台卡片详情评论列表
  getRadioCardCommentLists ({commit}, params) {
    return httpLogin(config.radioCardCommentListsApi, params)
  },
  // 评论课程卡片
  getRadioCommentCard ({commit}, params) {
    return httpLogin(config.radioCommentCardApi, params)
  },
  // 作者详情
  getAuthorDetail ({ commit }, params) {
    return httpLogin(config.radioAuthorDetailApi, params)
  },
  // 作者电台列表
  getRadioAuthorList ({ commit }, params) {
    return httpLogin(config.radioAuthorListApi, params)
  },
  // 关注
  getRadioRelationFollow ({ commit }, params) {
    return httpLogin(config.radioRelationFollow, params)
  },
  remRadioRelationCancel ({ commit }, params) {
    return httpLogin(config.radioRelationCancel, params)
  },
  // 作者动态
  getRadioAuthorDynamic ({ commit, state, dispatch }, params) {
    return httpLogin(config.radioAuthorDynamic, params).then((data) => {
      commit('updateRadioDynamic', data.dynamics.feedInfos)
      data.dynamics.feedInfos.forEach((item) => {
        let id = item.info.id
        dispatch('radioAuthorCommentRewardList', {id: id}).then((data) => {
          item.rewardLists = data.detail.rewards
        })
      })
    })
  },
  // 动态详情打赏列表接口
  radioAuthorCommentRewardList ({ commit }, params) {
    return httpLogin(config.radioAuthorCommentRewardList, params)
  },
  // 动态奖励接口
  radioAuthorCommentReward ({ commit, dispatch }, params) {
    return httpLogin(config.radioAuthorCommentReward, params)
  },
  // 加载更多评论列表接口
  getAuthorCommentList ({ commit }, params) {
    return httpLogin(config.radioAuthorCommentList, params)
  },
  // 发表动态评论、批改作业接口
  radioAuthorCommentPub ({ commit }, params) {
    return httpLogin(config.radioAuthorCommentPub, params)
  },

  // 头条首页
  headlineHome ({ commit }) {
    return httpLogin(config.headlineHome)
  },
  headlineList ({ commit }, params) {
    return httpLogin(config.headlineList, params)
  },
  headlineDetail ({ commit }, params) {
    return httpLogin(config.headlineDetail, params)
  },
  commentList ({ commit }, params) {
    return httpLogin(config.commentList, params)
  },
  comments ({ commit }, params) {
    return httpLogin(config.comments, params)
  },
  reportList ({ commit }, params) {
    return httpLogin(config.reportList, params)
  },
  searchList ({ commit }, params) {
    return httpLogin(config.searchList, params)
  },
  // 获取所有的课程语言
  getCourseListV2 ({commit}) {
    return httpLogin(config.courseList_v2).then(res => {
      commit('updateCourseLangs', res.course_langs)
    })
  },
  // 语伴列表接口
  getPartnerList ({commit}) {
    let pageTime = new Date().getTime()
    return httpLogin(config.partnerListApi, {page_time: pageTime, page_size: 100}).then((res) => {
      commit('updatePartnerList', res.partners.userInfos)
    })
  },
  // 语伴搜索
  searchPartnerList ({commit}) {
    let pageTime = new Date().getTime()
    return httpLogin(config.partnerSearchApi, {page_time: pageTime}).then((res) => {
      commit('updatePartnerList', res.partners.partnersInfo)
    })
  }

}

const mutations = {
  // 更新课程列表
  // updateCourseDetails (state, data) {
  //   console.log('课程列表', data)
  //   state.bookCaseDetails = data
  //   // 处理信息
  //   for (var item in data.langInfo) {
  //     if (state.langInfoObj[item]) {
  //       state.langInfoObj[item]['info'] = data.langInfo[item]['info']
  //     }
  //   }
  //   state.countrysInfoLists = data.countryInfo // 国家
  //   sessionStorage.setItem('countrysInfoLists', JSON.stringify(state.countrysInfoLists))
  //   console.log('课程详情mutations==>', state.bookCaseDetails)
  // },
  // 更新更多订阅课程
  updateLearnCourses (state, payload) {
    let course = payload.course
    var arr = payload.data.current_chapter_code.split('-')
    course['currentLevel'] = arr[2]
    course['currentUnit'] = arr[3]
    course['currentChapter'] = arr[4]
    let unlockCourses = []
    Object.keys(payload.data.unlock).map(key => {
      unlockCourses.push(key)
    })
    var num = unlockCourses.indexOf(course['current_chapter_code'])
    course['completeRate'] = (((num + 1) / payload.course.chapter_num) * 100).toFixed(0) + '%'
    state.learnCourses.push(course)
    let subscribeCoursesStr = localStorage.getItem('subscribeCoursesStr')
    subscribeCoursesStr += course.code + ','
    state.subscribeCoursesStr = subscribeCoursesStr
    localStorage.setItem('subscribeCoursesStr', subscribeCoursesStr)
    localStorage.setItem('learnMoreCourses', JSON.stringify(state.learnCourses))
  },
  updateRadioCourses (state, course) {
    state.radioCourses.push(course)
  },
  updateCurCourseCode (state, data) {
    state.currentCourseCode = data
    localStorage.setItem('currentCourseCode', state.currentCourseCode)
  },
  updateCourseInfo (state, data) {
    console.log('updateCourseInfo', data)
    state.courseBaseInfo = data.info.courseBaseInfo
    localStorage.setItem('courseBaseInfo', JSON.stringify(state.courseBaseInfo))
    state.learnInfo = data.info.learnInfo
    state.chapterNum = state.courseBaseInfo.chapter_num
    state.finishedChapter = state.learnInfo.chapter_num_finished
    state.levelNum = state.courseBaseInfo.level_num
    let levelDetail = ['level1', 'level2', 'level3', 'level4', 'level5', 'level6']
    state.levelDetail = levelDetail.slice(0, state.courseBaseInfo.level_num)
    let curChapterCode = state.learnInfo.current_chapter_code
    state.curLevel = curChapterCode.split('-')[2]
    state.assetsUrl = data.info.courseBaseInfo.content_config.assets_url
    Cookie.set('assetsApi', state.assetsUrl)
    state.contentUrl = state.courseBaseInfo.content_config.content_url
    state.currentChapterCode = curChapterCode
    localStorage.setItem('currentChapterCode', state.currentChapterCode)
  },
  updateChapters (state, data) {
    state.chapters = courseMethod.getCourseStructure(data.themes, state.unlock)
    console.log('theme chapters', state.chapters)
    state.curLevelChapters = []
    state.chapters
      .filter((item) => { return item.code.indexOf(state.curLevel) > -1 })
      .forEach((item) => {
        state.curLevelChapters.push(item)
      })

    localStorage.setItem('curLevelChapters', JSON.stringify(state.curLevelChapters))
  },
  updateCurLevelChapters (state, level) {
    state.curLevelChapters = []
    state.chapters
      .filter((item) => { return item.code.indexOf(level) > -1 })
      .forEach((item) => {
        state.curLevelChapters.push(item)
      })
    localStorage.setItem('curLevelChapters', JSON.stringify(state.curLevelChapters))
  },
  updateUnlockCourseList (state, data) {
    state.unlock = data.unlock
    state.unlockCourses = ''
    for (var item in data.unlock) {
      state.unlockCourses += item + ',' // 已经解锁的课程
      state.core = data.unlock[item].Core
      state.coreComplete = data.unlock[item].Core_complete
      state.homework = data.unlock[item].Homework
      state.homeworkComplete = data.unlock[item].Homework_complete
      state.improvement = data.unlock[item].Improvement
      state.improvementComplete = data.unlock[item].Improvement_complete
      if (data.unlock[item]['Has_purchased']) {
        state.buyChapters += item + ',' // 购买的课程
      }
    }
    console.log('buyChapter==>', state.buyChapters)
    console.log('unlock ===> ', data.unlock)
  },
  updateCurLevel  (state, level) {
    // console.log(state.unlockCourses)
    // if (state.unlockCourses.toLowerCase().indexOf(level) > 0) {
    //   let unlockCourseList = state.unlockCourses.trim(',').split(',')
    //   state.currentChapterCode = unlockCourseList.slice(0, unlockCourseList.length - 1).filter((item) => { return item.toLowerCase().indexOf(level) > -1 }).pop()
    // }
    // else {
    //   let path = [state.currentChapterCode.split('-')[0], state.currentChapterCode.split('-')[1], 'Level' + level.replace('level', ''), 'Unit1', 'Chapter1']
    //   state.currentChapterCode = path.join('-')
    // }

    // localStorage.setItem('currentChapterCode', state.currentChapterCode)

    state.curLevelChapters = []
    state.chapters
      .filter((item) => { return item.code.toLowerCase().indexOf(level) > -1 })
      .forEach((item) => {
        state.curLevelChapters.push(item)
      })
    console.log(level, state.curLevelChapters)
    localStorage.setItem('curLevelChapters', JSON.stringify(state.curLevelChapters))
    state.curLevel = level
  },
  updateCurChapter (state, curChapter) {
    state.currentChapterCode = curChapter
    localStorage.setItem('currentChapterCode', state.currentChapterCode)
    state.pathArr = state.currentChapterCode.split('-')
    localStorage.setItem('pathArr', state.currentChapterCode)
  },
  updateCurChapterProgress (state, forms) {
    state.curChapterProgress = forms
    localStorage.setItem('curChapterProgress', JSON.stringify(forms))
  },
  updateCurCoreParts (state, id) {
    let corePartInfos = {}
    if (Object.keys(state.courseBaseInfo).length === 0) {
      corePartInfos = JSON.parse(localStorage.getItem('courseBaseInfo')).corePartInfos
    } else {
      corePartInfos = state.courseBaseInfo.corePartInfos
    }

    let currentChapterCode = state.currentChapterCode
    if (!currentChapterCode) {
      currentChapterCode = localStorage.getItem('currentChapterCode')
    }

    state.corePartInfo = corePartInfos.filter((item) => {
      return item.chapter_code === currentChapterCode.split('-').slice(2, 5).join('-')
    })[0]

    let coreNum = parseInt(id.split('A0')[1]) - 1
    state.curCorePart = state.corePartInfo.parts[coreNum]

    let curLevelChapters = {}
    if (state.curLevelChapters.length === 0) {
      curLevelChapters = JSON.parse(localStorage.getItem('curLevelChapters'))
    } else {
      curLevelChapters = state.curLevelChapters
    }

    let chapter = curLevelChapters.filter(
      (item) => {
        return item.code === currentChapterCode
      })[0]
    state.curChapterUrl = chapter.chapter_url
  },
  chapterProgress (state, id) {
    let group = {}
    let record = {}
    if (Object.keys(state.curChapterProgress).length === 0) {
      record = JSON.parse(localStorage.getItem('curChapterProgress'))
    } else {
      record = state.curChapterProgress
    }

    let startSlideNum = 0
    let slideNumber = 0
    let slides = []
    let chapterContent = {}
    if (Object.keys(state.curChapterContent).length === 0) {
      chapterContent = JSON.parse(localStorage.getItem('curChapterContent'))
    } else {
      chapterContent = state.curChapterContent
    }

    if (id.indexOf('A0') > -1) {
      slides = state.curCorePart.Slides
      startSlideNum = state.curCorePart.Slides[0]
      slideNumber = state.curCorePart.Slides.length
      let formSlides = chapterContent.coreLessons.parts[0].slides
      slides.forEach((slide) => {
        let forms = formSlides[slide - 1].forms
        forms.forEach((form, key) => {
          if (!record) {
            return
          }
          let r = record['A0-' + (slide) + '-' + (key + 1)]
          if (r !== 0 && r !== 1) {
            record['A0-' + (slide) + '-' + (key + 1)] = -1
          }
        })
      })
    } else {
      slides = chapterContent.improvement.parts.filter((item) => {
        return item.slide_type_code.indexOf(id) > -1
      })[0].slides
      slideNumber = slides.length
      slides.forEach((slide, index) => {
        let forms = slide.forms
        forms.forEach((form, key) => {
          if (!record) {
            return
          }
          let r = record[id + '-' + (index + 1) + '-' + (key + 1)]
          if (r !== 0 && r !== 1) {
            record[id + '-' + (index + 1) + '-' + (key + 1)] = -1
          }
        })
      })
    }
    let progressBar = _.fill(Array(slideNumber), state.debug ? 1 : -1)

    // 对数据进行分组
    _.map(record, function (val, key) {
      if (id.indexOf('A0') > -1 && key.indexOf('A0') > -1) {
        let slideID = key.split('-')[1]
        if (_.isEmpty(group[slideID])) {
          group[slideID] = [val]
        } else {
          group[slideID].push(val)
        }
      } else if (key.indexOf(id) > -1) {
        let slideID = key.split('-')[1]
        if (_.isEmpty(group[slideID])) {
          group[slideID] = [val]
        } else {
          group[slideID].push(val)
        }
      }
    })

    let currentChapterCode = state.currentChapterCode
    if (!currentChapterCode) {
      currentChapterCode = localStorage.getItem('currentChapterCode')
    }
    var _pro = {}
    var _formScores = {}
    _.each(record, function (form, key) {
      var keyArray = key.split('-')
      var activity = keyArray[0]
      var formID = keyArray.slice(1, 3).join('-')
      var arr = currentChapterCode.split('-')
      _.set(_pro, [arr[2], arr[3], arr[4], activity, formID], form)
      _.set(_formScores, [currentChapterCode + '-' + key], form)
    })
    state.recordForm = _pro
    state.formScores = _formScores

    let newGroup = {}
    if (id.indexOf('A0') > -1) {
      slides.forEach((val) => {
        if (_.get(group, val)) {
          newGroup[val - startSlideNum] = _.get(group, val)
        }
      })
    } else {
      slides.forEach((val, index) => {
        if (_.get(group, index + 1)) {
          newGroup[index] = _.get(group, index + 1)
        }
      })
    }

    // 对分组数据进行计算,进项插入
    _.map(newGroup, function (val, key) {
      if (val.indexOf(-1) > -1) {
        progressBar[key] = -1
      } else {
        progressBar[key] = _.sum(val) / val.length
      }
    })

    let index = (progressBar.findIndex((value, index, arr) => {
      return value === -1
    }))
    state.curSlide = index === -1 ? 0 : index
    state.progress = progressBar
  },
  updateFormScore (state, preload) {
    // 老师进入数据不再更新
    // if (isTeacher) { return }
    var id = preload.id
    if (!id) {
      return
    }
    let score = preload.score
    var idArray = id.match(/(Level\d)-(Unit\d)-(Chapter\d)-(A\d)-(\d+-\d+)/)
    idArray = idArray.slice(1)
    state.formScores[id] = score
    // console.log(id, score)
    // 设置本地进度
    _.set(state.recordForm, idArray, score)
  },
  setFormScoresNull (state) {
    state.formScores = {}
  },
  updateChapterContent (state, data) {
    state.curChapterContent = data
    localStorage.setItem('curChapterContent', JSON.stringify(data))
  },
  updateCurSlide (state, slide) {
    state.curSlide = slide
    // state.pathArr = state.currentChapterCode.split('-')
    state.pathArr.push('Slide' + slide)
    localStorage.setItem('pathArr', state.pathArr.join('-'))
  },
  updateCurChapterUrl (state, currentChapterCode) {
    let curLevelChapters
    if (Object.keys('curLevelChapters').length === 0) {
      curLevelChapters = JSON.parse(localStorage.getItem('curLevelChapters'))
    } else {
      curLevelChapters = state.curLevelChapters
    }
    let chapter = curLevelChapters.filter(
      (item) => {
        return item.code === currentChapterCode
      })[0]
    state.curChapterUrl = chapter.chapter_url
  },
  updateGradeLevelActivity (state, level) {
    state.levelActivity = level
  },
  updateChapterTestResult (state, result) {
    state.chapterTestResult = result
  },
  updateProgressScore (state, payload) {
    state.progress[payload.curSlide] = payload.score
  },
  clearMoreCourses (state) {
    state.learnCourses = []
    state.radioCourses = []
    state.subscribeCoursesStr = ''
    localStorage.setItem('subscribeCoursesStr', '')
  },
  showLoading (state) {
    state.loading = true
  },
  hideLoading (state) {
    state.loading = false
  },
  updateChapterDes (state, chapterCode) {
    let arr = chapterCode.split('-')
    let learnMoreCourse = state.learnCourses
    if (Object.keys(learnMoreCourse).length === 0) {
      learnMoreCourse = JSON.parse(localStorage.getItem('learnMoreCourses'))
    }
    let course = learnMoreCourse.filter((item) => {
      return item.lan_code === arr[0]
    })
    state.chapterDes = []
    state.chapterDes.push(course[0].name['zh-CN'])
    state.chapterDes.push(state.levelDes[arr[2]])
    let unitNum = parseInt(arr[3].replace('Unit', ''))
    let chapterNum = parseInt(arr[4].replace('Chapter', ''))
    state.chapterDes.push('课程' + ((unitNum - 1) * 6 + chapterNum))
  },
  updateHomeworkContent (state, data) {
    state.homeworkContent = data
  },
  updateHistoryCourseRecord (state, data) {
    state.historyCourseRecord = data
  },
  // 动态首页的列表
  updateDynamicIndex (state, data) {
    state.DynamicIndex = data
    console.log('动态首页数据', state.DynamicIndex)
  },
  // 动态列表
  updateDynamicsLists (state, item) {
    state.dynamicsLists.push(item)
    // state.dynamicsLists.forEach(i => {
    //   console.log('item', i)
    // })
    console.log('动态列表', state.dynamicsLists)
  },
  // 电台动态
  updateRadioDynamic (state, data) {
    state.feedInfos = data
    console.log('动态列表=>', state.feedInfos)
  },
  // 更新官方语言
  updateCourseLangs (state, data) {
    state.courseLangs = data
  },
  // 更新语伴列表
  updatePartnerList (state, data) {
    state.partnerList = data
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
