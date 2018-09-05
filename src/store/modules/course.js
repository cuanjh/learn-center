import _ from 'lodash'
import Cookie from 'js-cookie'

import { httpLogin, httpAssets } from '../../api/api'
import config from '../../api/config'
import * as courseMethod from './courseMethod'

const state = {
  language: 'chinese',
  languagueHander: 'zh-CN', // 默认不同的level的实现方式
  learnCourses: [], // 已订阅的课程
  loading: true, // 用来判断加载状态程序
  currentCourseCode: '',
  currentChapterCode: '',
  courseBaseInfo: {},
  coverShow: false, // 遮罩
  learnInfo: {},
  finishedChapter: 0,
  chapterNum: 0,
  curLevel: '',
  levelNum: 6,
  levelDetail: ['level1', 'level2', 'level3', 'level4', 'level5', 'level6'],
  levelDes: {
    'Level1': '初级A1',
    'Level2': '初级A2',
    'Level3': '中级B1',
    'Level4': '中级B2',
    'Level5': '高级C1',
    'Level6': '高级C1'
  },
  contentUrl: '',
  assetsUrl: '',
  chapters: {},
  curLevelChapters: [],
  unlock: {},
  unlockCourseList: {},
  unlockCourses: '',
  buyChapters: '',
  curChapterProgress: '',
  curCorePart: {},
  curChapterContent: {},
  curSlide: 0,
  pathArr: [], // ['Level1', 'Unit1', 'Chapter2', 'A0', 'slide1']
  progress: {},
  recordForm: {},
  levelActivity: 0,
  chapterTestResult: {} // 记录用户的课程测试结果
}

const actions = {
  getLearnCourses ({commit, state, dispatch}) {
    return httpLogin(config.getMoreLearnCourses).then((res) => {
      commit('clearMoreCourses')
      _.map(res.learn_courses, (course) => {
        if (course['course_type'] === 0) {
          dispatch('getUnlockChapter', course['code']).then((data) => {
            console.log(data)
            commit('updateLearnCourses', { course, data })
          })
        }
      })
    })
  },
  getCourseList ({ commit }) {
    return httpLogin(config.getCourseList).then((res) => {
      console.log(res)
    })
  },
  getLearnInfo ({ commit }, courseCode) {
    return httpLogin(config.learnInfo, { course_code: courseCode })
  },
  getCourseContent ({ commit }, contentUrl) {
    return httpAssets(contentUrl)
  },
  getUnlockChapter ({ commit }, courseCode) {
    return httpLogin(config.unlockChapter, { course_code: courseCode })
  },
  getRecord ({ commit }, currentChapterCode) {
    return httpLogin(config.getRecord, { activity_code: currentChapterCode }).then((res) => {
      console.log(res)
    })
  },
  getProgress ({ commit }, currentChapterCode) {
    return httpLogin(config.getProgress, { chapter_code: currentChapterCode, state: '' })
    // .then((res) => {
    //   // commit('updateCurChapterProgress', res.record.forms)
    // })
  },
  setCurrentChapter ({ commit }, curChapter) {
    return httpLogin(config.setCurChapter, { chapter_code: curChapter })
  },
  getChapterContent ({ commit, state }) {
    return httpAssets(state.assetsUrl + state.curChapterUrl)
  },
  getGradeInfo ({ commit, state }, courseCode) {
    return httpLogin(config.hasGrade, { content_version: '1.5', course_code: courseCode })
  },
  levelGrade ({ commit, state }, courseCode) {
    return httpLogin(config.levelGradeGrade, { course_code: courseCode })
  },
  homeworkContent ({ commit, state }, activityCode) {
    return httpLogin(config.homeworkContent, { activity_code: activityCode })
  },
  // 删除已订阅的课程的接口实现
  getDeletePurchase ({ commit, dispatch }, code) {
    commit('showLoading')
    httpLogin(config.getStudyDelCourse, { code: code }).then((res) => {
      dispatch('getLearnCourses')
    })
  }
}

const mutations = {
  // 更新更多订阅课程
  updateLearnCourses (state, payload) {
    let course = payload.course
    var arr = payload.data.current_chapter_code.split('-')
    course['currentLevel'] = arr[2]
    course['currentChapter'] = arr[4]
    let unlockCourses = []
    Object.keys(payload.data.unlock).map(key => {
      unlockCourses.push(key)
    })
    var num = unlockCourses.findIndex((value, index, arr) => {
      return value === course['current_chapter_code']
    })
    course['completeRate'] = (((num + 1) / payload.course.chapter_num) * 100).toFixed(0) + '%'
    state.learnCourses.push(course)
  },
  updateCurCourseCode (state, data) {
    state.currentCourseCode = data
    localStorage.setItem('currentCourseCode', state.currentCourseCode)
  },
  updateCourseInfo (state, data) {
    state.courseBaseInfo = data.info.courseBaseInfo
    localStorage.setItem('courseBaseInfo', JSON.stringify(state.courseBaseInfo))
    state.learnInfo = data.info.learnInfo
    state.chapterNum = state.courseBaseInfo.chapter_num
    state.finishedChapter = state.learnInfo.chapter_num_finished
    state.levelNum = state.courseBaseInfo.level_num
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
    state.chapters.map((item) => {
      console.log(item)
    })
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
    for (var item in data.unlock) {
      state.unlockCourses += item + ',' // 已经解锁的课程
      if (data.unlock[item]['Has_purchased']) {
        state.buyChapters += item + ',' // 购买的课程
      }
    }
  },
  updateCurLevel  (state, level) {
    console.log(state.unlockCourses)
    if (state.unlockCourses.toLowerCase().indexOf(level) > 0) {
      let unlockCourseList = state.unlockCourses.trim(',').split(',')
      state.currentChapterCode = unlockCourseList.slice(0, unlockCourseList.length - 1).filter((item) => { return item.toLowerCase().indexOf(level) > -1 }).pop()
    } else {
      let path = [state.currentChapterCode.split('-')[0], state.currentChapterCode.split('-')[1], 'Level' + level.replace('level', ''), 'Unit1', 'Chapter1']
      state.currentChapterCode = path.join('-')
    }

    localStorage.setItem('currentChapterCode', state.currentChapterCode)

    state.curLevelChapters = []
    state.chapters
      .filter((item) => { return item.code.toLowerCase().indexOf(level) > -1 })
      .forEach((item) => {
        state.curLevelChapters.push(item)
      })
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
    console.log(111)
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
    console.log('chapterProgress')
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
    } else {
      slides = chapterContent.improvement.parts.filter((item) => {
        return item.slide_type_code.indexOf(id) > -1
      })[0].slides
      slideNumber = slides.length
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

    var _pro = {}
    _.each(record, function (form, key) {
      var keyArray = key.split('-')
      var activity = keyArray[0]
      var formID = keyArray.slice(1, 3).join('-')
      var arr = state.currentChapterCode.split('-')
      _.set(_pro, [arr[2], arr[3], arr[4], activity, formID], form)
    })
    state.recordForm = _pro

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
      progressBar[key] = _.sum(val) / val.length
    })

    let index = (progressBar.findIndex((value, index, arr) => {
      return value === -1
    }))
    state.curSlide = index === -1 ? 0 : index
    state.progress = progressBar
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
  },
  showLoading (state) {
    state.loading = true
  },
  hideLoading (state) {
    state.loading = false
  },
  updateCoverState (state, flag) {
    state.coverShow = flag
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
