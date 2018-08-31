export default {
  apiUrl: 'http://api.200h.com:81',
  URL: {
    channelCode: 'web_test_1'
  },
  API_VERSION: 4.1,
  content_version: 1.5,

  // 用户模块
  courseList_v2: '/info/course_langs_v2', // 获取课程第二个接口，增加大洲字段
  userLogin: '/user/login', // 登录
  phoneVertify: '/user/get_sms_code_by_guest', // 注册获取验证码接口
  getCaptionCode: '/auth/caption', // 获取验证码
  checkCaptionCode: '/user/check_caption_code', // 检查图片验证码
  register: '/user/register', // 注册
  checkPhonenumber: '/user_check/phonenumber', // 检测手机号是否被注册
  checkEmail: '/user_check/email', // 检查有限是否被注册
  sendEmail: '/user/send_code', // 发邮件找回密码
  getPhoneVertify: '/user/get_sms_code_by_user', // 用户找回密码手机获取验证码接口
  resetPwdPhone: '/user/reset_password', // 通过手机号找回密码
  resetPwdEmail: '/user/reset_password_email', // 通过邮箱找回密码
  userInfo: '/user/get_info', // 获取用户信息
  logout: '/user/logout', // 用户退出

  // 课程
  // getCourseList: '/info/get_course_list', // 获取官方语言列表
  getMoreLearnCourses: '/study/more_learn_courses', // 获取更多的订阅课程
  currentCourse: '/study/current_course', // 获取一个课程的详情
  learnInfo: '/studyv1/learn_info/index', // 1.一门课程基本配置 2.用户针对此课程学习基本配置 3.学习信息
  unlockChapter: '/chapters_state/get_unlock_chapter', // 最新的接口加入A0-A8是否完成的数据结构；返回正在学习的chapter编码；
  setCurChapter: '/chapters_state/set_current_chapter', // 设置正在学习的课程的最新chapter编码
  getRecord: '/chapters_state/get_record', // 查询学习结果
  getProgress: '/chapters_state/get_progress', // 获取学习结果
  hasGrade: '/level_grade/has_grade', // 返回用户对当前课程是否进行过定级操作
  levelGradeGrade: '/level_grade/grade', // 定级确认
  homeworkContent: '/feedv1/homework/content', // 获取作业内容接口
  getStudyDelCourse: '/study/del_course', // 删除已购买的课程

  // 书架
  bookCaseIndex: '/studyv1/shelf/v2/index', // 书架首页
  langInfo: '/studyv1/shelf/v2/lang_info', // 课程详情信息

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
  postGradeResult: '/level_grade/grade_result' // 用来接收用户在定级的过程中学习的结果
}
