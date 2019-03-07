/* jshint esversion: 6 */
'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_HOST: '"https://api.talkmate.com"',
  LOGIN_URL: '"https://learn.talkmate.com/app/index"',
  REDIRECT_URL: '"https://learn.talkmate.com/app/pay-success"',
  APP_KEY: '"talkmateVersion"',
  APP_SECRET: '"5EAE76C6323C85D2E35D4817020D84C9"' // 线上
})
