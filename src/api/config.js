export default {
  apiUrl: 'http://api.200h.com',
  API_VERSION: 4.1,
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
  // 书架
  bookCaseIndex: '/studyv1/shelf/v2/index', // 书架首页
  langInfo: '/studyv1/shelf/v2/lang_info' // 课程详情信息
}
