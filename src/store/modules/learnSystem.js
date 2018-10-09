import $ from 'jquery'
import _ from 'lodash'
import Cookie from '../../tool/cookie'
import md5 from 'md5'

import { httpLogin, httpGetToken } from '../../api/api'
import config from '../../api/config'

const state = {
  resetSoundUrl: '',
  locked: false,
  isPause: false,
  hiddenMicrophone: false,
  direction: 1,
  canRecord: true,
  autoJump: true,
  switchState: false,
  speakwork: false,
  coinCalculationRule: null, // 金币计算规则
  finishedInfo: {},
  curSlide: 1,
  tips: {
    chapter_opened: '新章节已开启',
    exit_learn_system: '您确定要退出学习系统？',
    feedback: '反馈已成功发送',
    homework_micphoneFailed: '获取麦克风失败,请检查麦克风是否正常。',
    homework_sendSuccess: '作业已成功发送',
    micphone: '为了能正常使用麦克风,请点击网页顶部弹窗里的【允许】按钮。',
    micphoneFailed: '获取麦克风失败,学习系统切换至无麦克风模式。',
    micphone_failed: '获取麦克风失败,学习系统切换至无麦克风模式<br>如需开启麦克风,请点击浏览器上方的允许麦克<br>风按钮并重新进入课程。',
    micphone_input: '请对着您的麦克风说话哦。',
    pk_playerLeave: '挑战者已离开',
    pk_waitPlayer: '对方尚在答题中,请稍等。',
    setting_autoJumpClose: '切换为非自动跳过模式',
    setting_autoJumpOpen: '切换为自动跳过模式',
    setting_hiddenMicrophoneClose: '切换为显示麦克风模式',
    setting_hiddenMicrophoneOpen: '切换为隐藏麦克风模式',
    setting_micphoneClose: '切换为无麦克风模式',
    setting_micphoneOpen: '切换为正常模式'
  },
  guide: {
    again: '你可以在个人设置中再次进行测试。',
    beforeDesc: '你即将体验到全球说学习系统中的四种题型。准备好了吗？我们现在就开始吧！',
    beforeTitle: '终于到了正式学习的环节啦！',
    bower: '浏览器支持不良好，无法正常学习，',
    browser: '浏览器',
    chrome: 'chrome浏览器进行学习',
    con: '祝贺你已经掌握了全球说的学习方法了',
    confirm: '确认',
    desc: '想知道如何高效使用全球说学语言吗，点击下一步试试！',
    download: '点此下载',
    ear: '耳机',
    err: '未检测到声音，不能进行发音练习，请检查或更换麦克风，否则将跳过课程发音环节',
    error: '为了保证上课质量，建议优化你的电脑',
    finish: '检测完毕',
    'go-desc': '接下来开启你的自然母语学习之旅吧！',
    'guide-header': '欢迎来到全球说',
    hard: '硬件',
    listen: '听声音选择正确的图片',
    mic: '麦克风',
    'micro-error': '未检测到声音，不能进行发音练习，请检查或更换麦克风，否则将跳过课程发音环节',
    microError: '请检查或更换麦克风',
    microHas: '已检测到麦克风',
    microNon: '请检查或更换麦克风',
    net: '网络',
    'network-error': '网络异常',
    'network-error-desc': '你的网络不稳定。上课时，请勿使用下载软件或观看在线视频。',
    next: '下一步',
    normal: '正常',
    obj: '检测项',
    ok: '通过',
    oper: '操作系统',
    pass: '你的电脑一切正常，可以顺利上课',
    qq: '咨询客服',
    read: '看图听音选单词',
    result: '检测结果',
    skip: '跳过学习指南',
    soft: '软件',
    soundError: '请检查或更换耳机',
    speak: '说出你听到的声音',
    speed: '下载速度',
    start: '开始',
    status: '状态',
    testBtn: '知道了',
    testing: '正在检测... ',
    tip: '检测过程大概需要1分钟，请准备好麦克风和耳机，请按提示进行操作',
    try: '点击试音',
    unnormal: '异常',
    untest: '未检测',
    upload: '上传速度',
    'video-desc': '掌握全球说独有的学习法，将帮助你重塑语言学习的新思维，在不知不觉地跟随式学习中，脱口而出说外语！',
    'video-header': '200小时掌握一门新语言的秘密',
    wait: '等待',
    write: '写出你听到的词句',
    _testing: '检测中'
  },
  testDialog: {
    btn: {
      yes: '听得到',
      no: '听不到'
    },
    error: {
      micro: '啊哦，一直没有检测到你的声音。'
    },
    soundFail: '未检测到声音',
    soundSuccess: '已检测到声音',
    success: '检测到你的声音了，麦克风正常。',
    testing: '你可以听到播放的声音吗？',
    title: {
      audition: '点击下面的播放按钮进行试听',
      micro: '点击麦克风按钮，并对着麦克风说一句话'
    }
  },
  sndEff: ['correct.mp3', 'wrong.mp3', 'recordPro.mp3', 'tip.mp3', 'kick.mp3'],
  formScores: {},
  pkTime: 30,
  qiniuToken: ''
}

const actions = {
  getCoinCalculationRule ({ commit, state }) {
    return httpLogin(config.coinRules).then((data) => {
      commit('updateCoinCalculationRule', data)
    })
  },
  postProgress ({ commit, state }) {
    return httpLogin(config.postProgress, { forms: JSON.stringify(state.formScores) })
  },
  postCoin ({ commit, state }, coins) {
    // 老师进入数据不再更新
    // if(isTeacher){ return }
    var userid = Cookie.getCookie('user_id')
    var verify = Cookie.getCookie('verify')
    var coinsToken = md5(userid + verify + coins)
    // console.log('postCoin, coins_token is %s', coinsToken)

    var apiPath = config.coinsIncrease
    if (coins < 0) {
      apiPath = config.coinsReduce
    }
    return httpLogin(apiPath, { coins: coins, coins_token: coinsToken, course_code: '' })
  },
  postCourseTestRecord ({ commit, state }, payload) {
    return httpLogin(config.courseTestRecord, { chapter_code: payload.chapterCode, progress: payload.progress })
  },
  getCourseTestRanking ({ commit, state }, chapterCode) {
    return httpLogin(config.courseTestRanking, { chapter_code: chapterCode })
  },
  getFinishedInfo ({ commit, state }, activityCode) {
    return httpLogin(config.finishedInfo, { activity_code: activityCode }).then((res) => {
      commit('updateFinishedInfo', res)
    })
  },
  postActivityRecord ({ commit, state }, payload) {
    return httpLogin(config.activityRecord, {
      activity_code: payload.activityCode,
      coins: payload.coins,
      correct_hits: payload.correctHits,
      learn_time: payload.learnTime,
      correct_rate: payload.correctRate,
      course_completed_rate: payload.courseCompleteRate
    })
  },
  getQiniuToken ({ commit }) {
    return httpGetToken(config.qiniuToken)
  },
  getGradeContent ({ commit, state }, courseCode) {
    return httpLogin(config.getGradeContent, {course_code: courseCode})
  },
  postGradeResult ({ commit, state }, payload) {
    return httpLogin(config.postGradeResult, {
      course_code: payload.courseCode,
      grade_code: payload.gradeCode,
      progress: payload.progress,
      level: payload.level
    })
  },
  getRecordCourseList ({ commit }, activityCode) {
    return httpLogin(config.getRecordCourseList, { activity_code: activityCode })
  },
  getRecordCourse ({ commit }, courseId) {
    return httpLogin(config.getRecordCourse, { course_id: courseId })
  }
}

const mutations = {
  chapterProgress (state) {
    let group = {}
    let record = state.recordForms

    let startSlideNum = state.curCorePart.Slides[0]
    let slideNumber = state.curCorePart.Slides.length
    let progressBar = _.fill(Array(slideNumber), state.debug ? 1 : -1)

    // 对数据进行分组
    _.map(record, function (val, key) {
      let slideID = key.split('-')[1]
      if (_.isEmpty(group[slideID])) {
        group[slideID] = [val]
      } else {
        group[slideID].push(val)
      }
    })

    let newGroup = {}
    state.curCorePart.Slides.forEach((val) => {
      if (_.get(group, val)) {
        newGroup[val - startSlideNum] = _.get(group, val)
      }
    })

    // 对分组数据进行计算,进项插入
    _.map(newGroup, function (val, key) {
      progressBar[key] = _.sum(val) / val.length
    })

    // 教师进入时模拟全部完成进度
    if (state.isTeacher) {
      $(progressBar).each(function (index, el) {
        progressBar[index] = 1
      })
    }
    state.curSlide = (progressBar.findIndex((value, index, arr) => {
      return value === -1
    })) + 1
    state.progress = progressBar
  },
  updateRecordUrl (state, source) {
    state.resetSoundUrl = source
  },
  updateLocked (state, flag) {
    state.locked = flag
  },
  updateSwitchState (state, flag) {
    state.switchState = flag
  },
  updatePause (state, flag) {
    state.isPause = flag
  },
  updateCoinCalculationRule (state, data) {
    state.coinCalculationRule = data
  },
  updateAutoJump (state, data) {
    state.autoJump = data
  },
  updateCanRecord (state, data) {
    state.canRecord = data
  },
  updateHiddenMicrophone (state, data) {
    state.hiddenMicrophone = data
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
  updateFinishedInfo (state, data) {
    state.finishedInfo = data.info
    localStorage.setItem('finishedInfo', JSON.stringify(data.info))
  },
  updateQiniuToken (state, data) {
    state.qiniuToken = data.token
  },
  updateSpeakWork (state, flag) {
    state.speakwork = flag
  },
  setFormScoresNull (state) {
    state.formScores = {}
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
