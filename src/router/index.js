// 首页&&用户验证模块
const home = r => require.ensure([], () => r(require('@/components/home/home.vue')), 'userAuth')
const authLogin = r => require.ensure([], () => r(require('@/components/userAuth/authLogin.vue')), 'userAuth')
const authRegister = r => require.ensure([], () => r(require('@/components/userAuth/authRegister.vue')), 'userAuth')
const authForget = r => require.ensure([], () => r(require('@/components/userAuth/authForget.vue')), 'userAuth')
const authResetPhone = r => require.ensure([], () => r(require('@/components/userAuth/authResetPhone.vue')), 'userAuth')
const authResetEmail = r => require.ensure([], () => r(require('@/components/userAuth/authResetEmail.vue')), 'userAuth')
const selectLang = r => require.ensure([], () => r(require('@/components/userAuth/userSelectLang.vue')), 'userAuth')
// 学习
const learn = r => require.ensure([], () => r(require('@/components/learn/learn.vue'), 'learn'))
const courseList = r => require.ensure([], () => r(require('@/components/learn/course/courseList.vue'), 'learn'))
const bookCase = r => require.ensure([], () => r(require('@/components/learn/bookCase/bookCase.vue'), 'learn'))
const bookCaseDetails = r => require.ensure([], () => r(require('@/components/learn/bookCase/bookCaseDetails.vue'), 'learn'))
const gradeLevelShow = r => require.ensure([], () => r(require('@/components/learn/gradeLevel/gradeLevelShow.vue'), 'learn'))
const gradeLevelConfirm = r => require.ensure([], () => r(require('@/components/learn/gradeLevel/gradeLevelConfirm.vue'), 'learn'))
const homework = r => require.ensure([], () => r(require('@/components/learn/homework/homework.vue'), 'learn'))
// 学习 --- 我的
const user = r => require.ensure([], () => r(require('@/components/learn/user/user.vue'), 'learn'))
const userCourse = r => require.ensure([], () => r(require('@/components/learn/user/userCourse.vue'), 'learn'))

// 学习系统
const learnSystem = r => require.ensure([], () => r(require('@/components/learnSystem/learn.vue'), 'learnSystem'))
const stage = r => require.ensure([], () => r(require('@/components/learnSystem/stage/stage.vue'), 'learnSystem'))
const pk = r => require.ensure([], () => r(require('@/components/learnSystem/pk/pk.vue'), 'learnSystem'))
// const homework = r => require.ensure([], () => r(require('@/components/learnSystem/homework/homework.vue'), 'learnSystem'))
const gradeLevel = r => require.ensure([], () => r(require('@/components/learnSystem/gradeLevel/gradeLevel.vue'), 'learnSystem'))
const envirionmentTest = r => require.ensure([], () => r(require('@/components/learnSystem/userGuide/environmentTest.vue'), 'learnSystem'))
const userGuide = r => require.ensure([], () => r(require('@/components/learnSystem/userGuide/userGuide.vue'), 'learnSystem'))
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
    path: '/course',
    component: learn,
    meta: {
      auth: true
    },
    children: [
      {
        path: 'course-list',
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
        path: 'grade-level-show',
        component: gradeLevelShow
      },
      {
        path: 'grade-level-confirm',
        component: gradeLevelConfirm
      },
      {
<<<<<<< HEAD
        path: 'homework',
        name: 'homework',
        component: homework
=======
        path: 'user',
        component: user,
        children: [
          {
            path: 'user-course',
            component: userCourse
          }
        ]
>>>>>>> 4365bc928040cce3e0eb8c2f6f1136c00376468b
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
  }
]
