/* jshint esversion: 6 */
'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_HOST: '"http://dev.api.talkmate.com"',
  APP_KEY: '"talkmateVersion"',
  APP_SECRET: '"E6DAC3DC3514681FC922ECE1B0CF06EB"'
})
