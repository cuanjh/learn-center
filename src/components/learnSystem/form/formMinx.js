import common from '../../../plugins/common'
var $ = require('jquery')
var _ = require('lodash')

var minx = {}

minx.shake = {
  methods: {
    shake: function (currentTarget) {
      this.shakeIsRight(currentTarget, false)
    },

    shakeIsRight: function (currentTarget, isRight) {
      var _this = this
      // 清除css
      $(currentTarget).removeClass('shake')
      // 重新添加css和计时器
      $(currentTarget).addClass('shake')
      // 显示对应的图标
      if (isRight) {
        _this.state_right = true
      } else {
        _this.state_error = true
      }
      this.timeoutId_shake = setTimeout(function () {
        if (_this.pos) {
          var newPos = common.randomItems(_this.pos)
          _this.$set(this, 'pos', newPos)
        }
        $(currentTarget).removeClass('shake')
        if (isRight) {
          _this.state_right = false
        } else {
          _this.state_error = false
        }
      }, this.delay_shake)
    },
    clearShake: function () {
      // 清除计时器
      clearTimeout(this.timeoutId_shake)
    }
  }
}

minx.switchPhoneticize = {
  methods: {
    switchPhoneticize: function () {
      // this.$data.switch_state = Config.switch_state
    }
  }
}

minx.switchGroupPhoneticize = {
  methods: {
    switchGroupPhoneticize: function () {
      // this.$data.switch_state = Config.switch_state
      this.$data.child.$data.sentence = this.$data.switch_state ? this.$data.cur_form.sentence_phoneticize : this.$data.cur_form.sentence
    }
  }
}

minx.formScore = {
  methods: {
    formScore: function () {
      console.log('formScore')
      if (this.noRecord) return
      if (_.isArray(this.data)) {
        _.each(this.data, function (val, idx) {
          this.updateFormScore({
            id: val.code,
            score: this.forms[idx].score / 100
          })
        }.bind(this))
      } else {
        this.updateFormScore({
          id: this.data.code,
          score: this.score / 100
        })
      }
    }
  }
}

minx.learnProgLog = {
  methods: {
    learnProgLog: function (res) {
      // 如果传过来的不是2也不是3，说明不是手动跳过，也不是自动跳过，就用原始的值
      // 题型组件内部状态，this.data （Object类型只有一个题，Arrary是多个题）
      if (_.isArray(this.data)) {
        if (!(res === 2 || res === 3)) {
          res = this.forms[this.form_index].score / 100
        }
        this.$dispatch('reportLearnProg', getCurrentForm(this.form_index), this.forms[this.form_index].form_show_type, res)
      } else {
        if (!(res === 2 || res === 3)) {
          res = this.score / 100
        }
        this.$dispatch('reportLearnProg', getCurrentForm(this.$parent.cur), this.data.form_show_type, res)
      }
    }
  }
}

function getCurrentForm (index) {
  var arr = window.location.href.split('index/')[1].replace(/(slide)/g, '').replace(/#/g, '').split('/')
  index++
  arr.push(index + '')
  return arr.join('-')
}

// function getFormID (data) {
//   // var Base = _.values('Config.LANG').join('-')
//   var Base = _.values('en_Basic').join('-')
//   var path = data.sound.split('/')
//   path = _.takeRight(path, 5).join('-').replace('.mp3', '')
//   var formID = Base + '-' + path
//   return formID
// }

export default minx
