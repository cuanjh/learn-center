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
const bookCase = r => require.ensure([], () => r(require('@/components/learn/bookCase/bookCase.vue'), 'learn'))
const bookCaseDetails = r => require.ensure([], () => r(require('@/components/learn/bookCase/bookCaseDetails.vue'), 'learn'))
export default[
  {
    path: '/',
    redirect: '/auth'
  },
  {
    path: '/auth',
    component: home,
    redirect: '/auth/login',
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
    path: '/learn',
    component: learn,
    children: [
      {
        path: 'book-case',
        component: bookCase
      },
      {
        path: 'book-details/:courseCode',
        component: bookCaseDetails
      }
    ]
  }
]
