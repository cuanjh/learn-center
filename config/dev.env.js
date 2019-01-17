/* jshint esversion: 6 */
'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_HOST: '"http://api.talkmate.com"',
  LOGIN_URL: '"http://beat-study.talkmate.com/app/index"',
  APP_KEY: '"talkmateVersion"',
  APP_SECRET: '"5EAE76C6323C85D2E35D4817020D84C9"'
  // APP_SECRET: '"E6DAC3DC3514681FC922ECE1B0CF06EB"'
})
