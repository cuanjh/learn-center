/* jshint esversion: 6 */
'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // API_HOST: '"http://dev.api.talkmate.com"',
  API_HOST: '"https://api.talkmate.com"',
  LOGIN_URL: '"http://test-learn.talkmate.com"',
  HOME_URL: '"http://test-learn.talkmate.com/app/index"',
  REDIRECT_URL: '"http://test-learn.talkmate.com/app/pay-success"',
  APP_KEY: '"talkmateVersion"',
  // APP_SECRET: '"E6DAC3DC3514681FC922ECE1B0CF06EB"' // 测试
  APP_SECRET: '"5EAE76C6323C85D2E35D4817020D84C9"', // 线上
  KIDSHAREURL: 'https://mobile-static.talkmate.com/operate/activities/html/miniRecordShare/index.html' // 线上
  // KIDSHAREURL: 'http://test-learn.talkmate.com:82/miniRecordShare/index.html' // 测试
})
