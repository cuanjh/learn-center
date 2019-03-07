/* jshint esversion: 6 */
'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_HOST: '"https://dev.api.talkmate.com"',
  LOGIN_URL: '"https://test-learn.talkmate.com/app/index"',
  REDIRECT_URL: '"https://test-learn.talkmate.com/app/pay-success"',
  APP_KEY: '"talkmateVersion"',
  APP_SECRET: '"E6DAC3DC3514681FC922ECE1B0CF06EB"' // 测试
})
