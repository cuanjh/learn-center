export default {
  loginInfo: {}, // 登录信息
  userInfo: null, // 用户信息
  isVip: false,
  courseLangsList: [], // 官方课程列表
  recommendRadioTeachers: [], // 推荐的电台主播
  FileQiniuToken: '', // 获取上传七牛的token
  langsStateSel: [],
  recommendRadioPage: 1,
  recommendRadios: [],
  isAnonymous: false,
  isCanRecord: false, // 判断浏览器是否可以录音
  langCodesSel: [], // 课程相关
  kidRecordList: [], // kid录音列表
  xfISEResult: {},
  xfSpeechType: '', // 讯飞语音分类,asr 语音听写（识别）, ise 语音评测
  xfLang: {
    'KEN': 'en_us'
  },
  xfSyllPhone: {
    'aa': 'ɑː',
    'ae': 'æ',
    'ah': 'ʌ',
    'ao': 'ɔː',
    'ar': 'eə',
    'aw': 'aʊ',
    'ax': 'ə',
    'ay': 'aɪ',
    'eh': 'e',
    'er': 'ɜː',
    'ey': 'eɪ',
    'ih': 'ɪ',
    'ir': 'ɪə',
    'iy': 'iː',
    'oo': 'ɒ',
    'ow': 'əʊ',
    'oy': 'ɒɪ',
    'uh': 'ʊ',
    'uw': 'uː',
    'ur': 'ʊə',
    'b': 'b',
    'ch': 'tʃ',
    'd': 'd',
    'dh': 'ð',
    'f': 'f',
    'g': 'g',
    'hh': 'h',
    'jh': 'dʒ',
    'k': 'k',
    'l': 'l',
    'm': 'm',
    'n': 'n',
    'ng': 'ŋ',
    'p': 'p',
    'r': 'r',
    's': 's',
    'sh': 'ʃ',
    't': 't',
    'th': 'θ',
    'v': 'v',
    'w': 'w',
    'y': 'j',
    'z': 'z',
    'zh': 'ʒ',
    'dr': 'dr',
    'dz': 'dz',
    'tr': 'tr',
    'ts': 'ts'
  }
}
