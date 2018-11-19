// 首页&&用户验证模块
const home = r => require.ensure([], () => r(require('@/components/home/home.vue')), 'home')
const authLogin = r => require.ensure([], () => r(require('@/components/userAuth/authLogin.vue')), 'auth-login')
const authRegister = r => require.ensure([], () => r(require('@/components/userAuth/authRegister.vue')), 'auth-register')
const authForget = r => require.ensure([], () => r(require('@/components/userAuth/authForget.vue')), 'auth-forget')
const authResetPhone = r => require.ensure([], () => r(require('@/components/userAuth/authResetPhone.vue')), 'auth-reset-phone')
const authResetEmail = r => require.ensure([], () => r(require('@/components/userAuth/authResetEmail.vue')), 'auth-reset-email')
const selectLang = r => require.ensure([], () => r(require('@/components/userAuth/userSelectLang.vue')), 'select-lang')
// 学习
const learn = r => require.ensure([], () => r(require('@/components/learn/learn.vue')), 'learn')
const courseList = r => require.ensure([], () => r(require('@/components/learn/course/courseList.vue')), 'course-list')
const bookCase = r => require.ensure([], () => r(require('@/components/learn/bookCase/bookCase.vue')), 'book-case')
const bookCaseDetails = r => require.ensure([], () => r(require('@/components/learn/bookCase/bookCaseDetails.vue')), 'book-case-details')
const hotCourses = r => require.ensure([], () => r(require('@/components/learn/bookCase/hotCourses.vue')), 'hot-courses')
const worldMap = r => require.ensure([], () => r(require('@/components/learn/bookCase/worldMap.vue')), 'world-map')
const chinaLangMap = r => require.ensure([], () => r(require('@/components/learn/bookCase/chinaLangMap.vue')), 'china-lang-map')
const nationDetails = r => require.ensure([], () => r(require('@/components/learn/bookCase/nationDetails.vue')), 'nation-details')
const gradeLevelShow = r => require.ensure([], () => r(require('@/components/learn/gradeLevel/gradeLevelShow.vue')), 'grade-level-show')
const gradeLevelConfirm = r => require.ensure([], () => r(require('@/components/learn/gradeLevel/gradeLevelConfirm.vue')), 'grade-level-confirm')
const homework = r => require.ensure([], () => r(require('@/components/learn/homework/homework.vue')), 'homework')
// 学习 --- 我的
const user = r => require.ensure([], () => r(require('@/components/learn/user/user.vue')), 'user')
const userCourse = r => require.ensure([], () => r(require('@/components/learn/user/userCourse.vue')), 'user-course')
const userDoc = r => require.ensure([], () => r(require('@/components/learn/user/userDoc.vue')), 'userDoc')
const userWallet = r => require.ensure([], () => r(require('@/components/learn/user/userWallet.vue')), 'user-wallet')
const userVip = r => require.ensure([], () => r(require('@/components/learn/user/userVip.vue')), 'userVip')
const userSetting = r => require.ensure([], () => r(require('@/components/learn/user/userSetting.vue')), 'user-setting')
const userAnonymous = r => require.ensure([], () => r(require('@/components/learn/user/userAnonymous.vue')), 'user-anonymous')

// 学习 --- 发现
const discovery = r => require.ensure([], () => r(require('@/components/learn/discovery/discovery.vue')), 'discovery')
const discoveryHome = r => require.ensure([], () => r(require('@/components/learn/discovery/home.vue')), 'discovery-home')
const radioHome = r => require.ensure([], () => r(require('@/components/learn/discovery/radio/radioHome.vue')), 'radio-home')
const radioDetail = r => require.ensure([], () => r(require('@/components/learn/discovery/radio/radioDetail.vue')), 'radio-detail')
const headline = r => require.ensure([], () => r(require('@/components/learn/discovery/headline/headline.vue')), 'headline')
const headlineDetails = r => require.ensure([], () => r(require('@/components/learn/discovery/headline/headlineDetails.vue')), 'headline-details')
const headlineSearch = r => require.ensure([], () => r(require('@/components/learn/discovery/headline/headlineSearch.vue')), 'headline-search')

// 学习系统
const learnSystem = r => require.ensure([], () => r(require('@/components/learnSystem/learn.vue')), 'learn-system')
const stage = r => require.ensure([], () => r(require('@/components/learnSystem/stage/stage.vue')), 'stage')
const pk = r => require.ensure([], () => r(require('@/components/learnSystem/pk/pk.vue')), 'pk')
// const homework = r => require.ensure([], () => r(require('@/components/learnSystem/homework/homework.vue'), 'learnSystem'))
const gradeLevel = r => require.ensure([], () => r(require('@/components/learnSystem/gradeLevel/gradeLevel.vue')), 'grade-level')
const envirionmentTest = r => require.ensure([], () => r(require('@/components/learnSystem/userGuide/environmentTest.vue')), 'envirionment-test')
const userGuide = r => require.ensure([], () => r(require('@/components/learnSystem/userGuide/userGuide.vue')), 'user-guide')

// 下载页面
const download = r => require.ensure([], () => r(require('@/components/common/download.vue')), 'download')

export default[
  {
    path: '/',
    redirect: '/auth'
  },
  {
    path: '/auth',
    redirect: 'auth/login',
    component: home,
    children: [
      {
        path: 'login',
        component: authLogin
      },
      {
        path: 'register/:code',
        component: authRegister
      },
      {
        path: 'select-lang',
        component: selectLang
      },
      {
        path: 'forget',
        component: authForget
      },
      {
        path: 'reset-phone/:phone',
        component: authResetPhone
      },
      {
        path: 'reset_password/:code',
        component: authResetEmail
      }
    ]
  },
  {
    path: '/app',
    component: learn,
    meta: {
      auth: true
    },
    children: [
      {
        path: 'course-list',
        name: 'courseList',
        meta: {
          keepAlive: true
        },
        component: courseList
      },
      {
        path: 'book-case',
        component: bookCase
      },
      {
        path: 'book-details/:courseCode',
        component: bookCaseDetails
      },
      {
        path: 'hot-courses',
        component: hotCourses
      },
      {
        path: 'world-map',
        component: worldMap
      },
      {
        path: 'china-lang-map',
        component: chinaLangMap
      },
      {
        path: 'nation-details/:countryCode',
        component: nationDetails
      },
      {
        path: 'grade-level-show',
        component: gradeLevelShow
      },
      {
        path: 'grade-level-confirm',
        component: gradeLevelConfirm
      },
      {
        path: 'homework',
        name: 'homework',
        component: homework
      },
      {
        path: 'user',
        component: user,
        redirect: 'user/course',
        children: [
          {
            path: 'course',
            component: userCourse
          },
          {
            path: 'doc',
            component: userDoc
          },
          {
            path: 'wallet',
            component: userWallet
          },
          {
            path: 'vip',
            component: userVip
          },
          {
            path: 'setting',
            component: userSetting
          },
          {
            path: 'bind',
            component: userAnonymous
          }
        ]
      },
      // 发现
      {
        path: 'discovery',
        component: discovery,
        redirect: 'discovery/home',
        children: [
          {
            path: 'home',
            component: discoveryHome
          },
          // 电台
          {
            path: 'radio-home',
            component: radioHome
          },
          {
            path: 'radio-detail/:code',
            component: radioDetail
          }
        ]
      },
      // 头条
      {
        path: 'headline',
        component: headline
      },
      // 头条每个栏目
      {
        path: 'headline-details/:id',
        name: 'headlineDetails',
        component: headlineDetails
      },
      {
        path: 'headline-search',
        name: 'headlineSearch',
        component: headlineSearch
      }
    ]
  },
  {
    path: '/learn',
    component: learnSystem,
    meta: {
      auth: true
    },
    children: [
      {
        path: 'stage/:id',
        name: 'stage',
        props: true,
        component: stage
      },
      {
        path: 'pk',
        name: 'pk',
        component: pk
      },
      {
        path: 'gradeLevel/level:currLevel',
        props: true,
        name: 'gradeLevel',
        component: gradeLevel
      },
      {
        path: 'testing',
        component: envirionmentTest
      },
      {
        path: 'user-guide',
        component: userGuide
      }
    ]
  },
  {
    path: '/download',
    component: download
  }
]
