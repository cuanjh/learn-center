/* jshint esversion: 6 */
export default {
  // apiUrl: 'http://api.200h.com:81',
  URL: {
    channelCode: 'web_test_1'
  },
  API_VERSION: 4.1,
  content_version: 1.5,

  // 用户模块
  courseList_v2: '/info/course_langs_v2', // 获取课程第二个接口，增加大洲字段
  userLogin: '/user/login', // 登录
  phoneVertify: '/user/get_sms_code_by_guest', // 注册获取验证码接口
  bindEmail: '/user/bind_email', // 绑定邮箱
  getCaptionCode: '/auth/caption', // 获取验证码
  checkCaptionCode: '/user/check_caption_code', // 检查图片验证码
  register: '/user/register', // 注册
  anonymousRegisterApi: '/user_anonymous/register', // 匿名用户注册接口
  checkPhonenumber: '/user_check/phonenumber', // 检测手机号是否被注册
  checkEmail: '/user_check/email', // 检查有限是否被注册
  sendEmail: '/user/send_code', // 发邮件找回密码
  getPhoneVertify: '/user/get_sms_code_by_user', // 用户找回密码手机获取验证码接口
  resetPwdPhone: '/user/reset_password', // 通过手机号找回密码
  resetPwdEmail: '/user/reset_password_email', // 通过邮箱找回密码
  userInfo: '/user/get_info', // 获取用户信息
  updateInfo: '/user/update_info', // 更新用户信息
  logout: '/user/logout', // 用户退出
  resetPwd: '/user/reset_password_anonymous', // 匿名账号重置密码
  changePwd: '/user/change_pwd', // 修改密码
  getCountries: '/info/get_countries', // 获取国家课程列表
  getLanguages: '/info/get_mother_tongue', // 获取语言列表
  // getCourseList: '/info/get_course_list', // 获取官方语言列表 --弃用
  bindPhoneNumber: '/user/bind_phonenumber', // 绑定手机号
  resetAnonymous: '/user/reset_password_anonymous', // 匿名账号重置
  unbindIdentity: '/user/unbind_identity', // 解除邮箱或者手机号绑定
  uploadUserPhoto: '/user/upload_user_photo', // 上传用户头像(需要登录)
  // 登录新的接口

  // 课程
  moreLearnCoursesApi: '/study/more_learn_courses', // 获取更多的订阅课程
  currentCourse: '/study/current_course', // 获取一个课程的详情
  learnInfo: '/studyv1/learn_info/index', // 1.一门课程基本配置 2.用户针对此课程学习基本配置 3.学习信息
  unlockChapter: '/chapters_state/get_unlock_chapter', // 最新的接口加入A0-A8是否完成的数据结构；返回正在学习的chapter编码；
  setCurChapter: '/chapters_state/set_current_chapter', // 设置正在学习的课程的最新chapter编码
  getRecord: '/chapters_state/get_record', // 查询学习结果
  getProgress: '/chapters_state/get_progress', // 获取学习结果
  hasGrade: '/level_grade/has_grade', // 返回用户对当前课程是否进行过定级操作
  levelGradeGrade: '/level_grade/grade', // 定级确认
  homeworkContent: '/feedv1/homework/content', // 获取作业内容接口
  homeworkPub: '/feedv1/homework/pub', // 写作业接口
  getStudyDelCourse: '/study/del_course', // 删除已购买的课程
  getCourseArchives: '/study_archive/get_archives', // 获取课程档案接口
  getTradeRecord: '/trade_record/get_lists', // 交易记录列表的实现
  getCoinsProduct: '/product/lists', // 金币充值进行扫描支付
  createAliWebOrder: '/pay/ali_web_order', // 创建支付宝网页支付订单
  getMemberProductsList: '/product/lists', // 会员产品支付渠道暂定于国内
  getMemberCard: '/member/card', // 会员卡激活账号的接口
  postUnlockChapter: '/chapters_state/unlock_chapter', // 解锁课程
  getBuyChapter: '/chapter_purchase/purchase',

  // 书架
  bookCaseIndex: '/studyv1/shelf/v2/index', // 书架首页
  langInfo: '/studyv1/shelf/v2/lang_info', // 课程详情信息
  shelfResList: '/studyv1/shelf/v2/res_list', // 资源列表接口
  purchaseCourse: '/store/purchase_course', // 购买课程
  languageMap: '/studyv1/shelf/v2/lang_map', // 世界语言地图
  countryInfo: '/studyv1/shelf/v2/country_info', // 国家信息
  courseLangs: '/info/course_langs', // 获取和课程相关的语言列表信息
  courseListApi: '/studyv1/course/list',
  shelfSearchApi: '/studyv1/shelf/search', // 书架搜索接口
  chinaLangMapApi: '/studyv1/shelf/china_lang_map', // 中国方言课程地图接口
  countryLanguagesApi: '/studyv1/shelf/v2/country_languages', // 获取国家所拥有的语言

  // 动态
  qiniuFilesToken: '/qiniu_token/uploadfiles', // 获取上传的token
  communityApi: '/feedv1/dynamic/v5/index', // 动态首页接口
  dynamicListsApi: '/feedv1/dynamic/v5/list', // 动态列表接口
  dynamicPubApi: '/feedv1/dynamic/pub', // 动态发布接口
  topicsListsApi: '/feedv1/topics/v3/list', // 话题列表接口

  // 发现
  disvHomeApi: '/disv1/home', // 发现首页接口
  disvRadioApi: '/disv1/radio', // 发现电台首页接口
  radioListsApi: '/disv1/radio/list', // 发现，电台，更多电台列表
  radioDetailApi: '/topic_course/detail/<course_code>/', // 用户电台明细
  radioCardListApi: '/user_course/card_list/{course_code}/{list_order}/{page}/{pagesize}', // 课程卡片列表接口
  radioCardDetailApi: '/user_course/get_course_card_detail', // 课程卡片详情接口
  radioCardCommentListsApi: '/user_course/get_more_course_card_comments', // 课程卡片列表接口
  radioCommentCardApi: '/user_course/comment_course_card', // 课程卡片评论接口
  radioAuthorDetailApi: '/feedv1/partner/detail', // 电台作者详情接口
  radioRelationFollow: '/relation/follow', // 关注接口
  radioRelationCancel: '/relation/cancel', // 取消关注接口
  radioAuthorListApi: '/feedv1/partner/radios', // 作者电台列表
  radioAuthorDynamic: '/feedv1/partner/v3/dynamics', // 作者动态
  radioAuthorCommentList: '/feedv1/comment/list', // 加载更多评论列表接口
  radioAuthorCommentPub: '/feedv1/comment/pub', // 发表动态评论、批改作业接口
  radioAuthorCommentRewardList: '/feedv1/dynamic/detail', // 动态、作业详情接口 动态打赏列表rewards取出
  radioAuthorCommentReward: '/feedv1/dynamic/reward', // 动态奖励接口
  disvRecommendRadiosApi: '/disv1/radio/recommends', // 电台推荐接口
  getRandomRadioApi: '/disv1/radio/recommend_one', // 电台首页随机推荐电台
  getOtherRecommendsApi: '/disv1/radio/recommends', // 其他人也在听
  getHotRadiosApi: '/disv1/radio/hot', // 热门电台
  // 电台支付相关接口
  createWxRadioOrderApi: '/pay/wx_qrcode_order', // 电台微信支付

  // 头条
  headlineHome: '/disv1/headline/home', // 头条首页接口
  headlineList: '/disv1/headline/list', // 头条列表接口
  headlineDetail: '/disv1/headline/detail', // 头条详情接口
  commentList: '/disv1/headline/comment_list', // 评论列表接口
  comments: '/disv1/headline/comment', // 头条评论接口
  reportList: '/feedv1/dynamic/report', // 头条投诉接口
  searchList: '/disv1/headline/search', // 头条搜索接口
  /**
   * 世界语言地图
   * 语伴
   */
  partnerListApi: '/feedv1/partner/list', // 语伴列表接口
  partnerSearchApi: '/feedv1/partner/search', // 语伴搜索接口
  endangeredMapListApi: '/studyv1/shelf/v2/endangered_map', // 濒危语言列表
  endangeredLangDetailApi: '/studyv1/shelf/v2/endangered_lang', // 濒危语言详情
  recommendRadioTeachersApi: '/disv1/radio/recommend_teachers', // 推荐的电台主播
  allRadioTeachersApi: '/disv1/radio/teachers', // 推荐所有的电台主播
  langMapInfoApi: '/studyv1/learn_info/v2/lang_map_info', // 语言地图统计数据

  // 学习系统
  qiniuToken: '/qiniu_token/corpus', // 获取上传语料的token
  coinRules: '/study/coin_rules',
  postProgress: '/chapters_state/progress', // 上传学习结果
  coinsIncrease: '/account/coins_increase', // 增加金币
  coinsReduce: '/account/coins_reduce', // 减少金币
  courseTestRanking: '/course_test/ranking', // 返回本课程测试的排行榜数据
  courseTestRecord: '/course_test/record', // 用来存储课程测试结束的测试结果及过程
  finishedInfo: '/study_info/finished_info', // 返回每部分学完的学习完成信息
  activityRecord: '/chapters_state/activity_record', // 各个部分即A0-A8学完，上传统计结果
  getGradeContent: '/level_grade/get_content', // 用来获取课程定级的内容
  postGradeResult: '/level_grade/grade_result', // 用来接收用户在定级的过程中学习的结果
  getRecordCourseList: '/study_info/record_course_list', // 获取用户录音课程
  getRecordCourse: '/study_info/record_course', // 获取用户录音课程

  /**
   * 新登录接口
   */
  // umThirdLoginApi: 'http://talkmate.com', // 第三方登录的测试域名
  // umThirdLoginCallBackApi: 'http://beat-study.talkmate.com/app/index',
  umUserSnsLoginApi: '/umv1/user/web/sns/login', // 第三方登录接口
  umUserLoginApi: '/umv1/user/login', // 快速登录接口
  umUserPwdLoginApi: '/umv1/user/login/pwd', // 密码登录接口
  umUserEditPwdApi: '/umv1/user/edit/pwd', // 用户信息里面修改密码
  umSendCodeApi: '/umv1/sms/send', // 发送验证码接口
  umUserInfoApi: '/umv1/user/info', // 获取用户信息接口
  umUpdateUserInfoApi: '/umv1/user/edit/info', // 修改用户信息
  umUserBindPhoneApi: '/umv1/user/sns/bind/phone', // 绑定手机号码
  umUserExistsPhoneApi: '/umv1/user/exists/phone', // 验证手机号是否存在接口
  umLangsListApi: '/umv1/langs/lists', // 语言列表接口
  umLangsStateApi: '/umv1/langs/state', // 语言设置状态接口
  umUserAnonyApi: '/umv1/user/anony' // 匿名登录
}
