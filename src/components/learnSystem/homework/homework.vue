<template>
  <div>
    <component :is="state" :data="data" :id="ID" :ref="state"/>
  </div>
</template>

<script>
import _ from 'lodash'

import { mapState } from 'vuex'

import SpeakWork from './speakwork.vue'
import WriteWork from './writework.vue'

export default {
  props: ['router', 'resource'],
  data () {
    return {
      pro: [],
      data: {},
      state: 'write-homework',
      ID: '',
      path: [],
      computedAll: false
    }
  },
  components: {
    'speak-homework': SpeakWork,
    'write-homework': WriteWork
  },
  mounted () {
    // this.path = this.router.getRoute()
    // var homework = Model.getHomewrok(_.take(this.path, 3))
    var homework = this.getHomewrok()
    this.data = homework.data
    this.ID = homework.ID
    this.computedAll = homework.computed
    switch (homework.data.form_show_type) {
      case 'repeatSpeakH':
        this.state = 'speak-homework'
        break
      case 'writeWordsH':
        this.state = 'write-homework'
        break
    }
    this.$nextTick(() => {
      this.$refs[this.state].$emit('init')
    })
    // this.computedAll && toaster.success(Config.homework.tip_finish)
  },
  created () {
    this.$on('back-content', () => {
      this.$dispatch('change-router', _.take(this.path, 3).join('/'))
    })

    this.$on('update-progress', () => {
      // 更新进度
      var arr = this.$data.ID.split('-')
      arr.splice(0, 2)
      console.log('update-progress')
    })
  },
  computed: {
    ...mapState({
      currentChapterCode: state => state.course.currentChapterCode,
      curChapterContent: state => state.course.curChapterContent,
      recordForm: state => state.course.curChapterProgress
    })
  },
  methods: {
    getHomewrok () {
      console.log('getHomework')
      var path = (this.currentChapterCode + '-A8').split('-')
      var finishAll = true
      var randomIndex = () => {
        // 生成随机题型的下标（题型全部完成在所有题型中随机，否则在未完成的列表生成）
        var unFinishList = []
        _.forEach(homeworkProgress, (value, index) => {
          if (_.isUndefined(homeworkProgress[index])) {
            unFinishList.push(index)
            finishAll = false
          }
        })
        if (finishAll) {
          return _.random(0, homework.length - 1)
        } else {
          return unFinishList[_.random(0, unFinishList.length - 1)]
        }
      }

      // 获取作业当前chapter的作业数据列表
      // var homework = _.get(Course, path.slice(2).concat(['slide1', 'form']))
      var homework = {}
      this.curChapterContent.friendsZone.parts.forEach((item) => {
        if (item.slide_type_code === this.currentChapterCode + '-A8') {
          homework = item.slides[0].forms
        }
      })
      // 存储作业的完成情况
      var homeworkProgress = Array(homework.length) // 完成为1，未完成undefind

      var _pro = {}
      _.each(this.recordForm, (form, key) => {
        var keyArray = key.split('-')
        var activity = keyArray[0]
        var formID = keyArray.slice(1, 3).join('-')
        _.set(_pro, [activity, formID], form)
      })

      _.forEach(_.get(_pro, ['A8'], []), (value, key) => {
        homeworkProgress[key.split('-')[1] - 1] = value
      })

      var idx = randomIndex()
      return {
        data: homework[idx],
        ID: path.concat(['1', idx + 1]).join('-'),
        computed: finishAll
      }
    }
  }
}
</script>

<style lang="less">
@import "../../../../static/less/global_var";
.homework-box {
  width: 660px;
  background: #fff;
  height: 490px;
  position: center;
  .head {
    height: 70px;
    background-color: #55a4fc;
    color: #fff;
    font-size: 27px;
    text-align: center;
    line-height: 70px;
  }
  .content {
    padding: 30px;
  }
  .question {
    position: relative;
    b {
      display: inline-block;
      position: relative;
      background: url(../../../../static/images/homework/pencil.png);
      width: image-width;
      height: image-height;
      margin-right: 7px;
      top: 3px;
    }
    span {
      color: #5a6caf;
      font-size: 1.4em;
    }
    .tip {
      position: absolute;
      top: 0;
      right: 0;
      border-radius: 3px;
      cursor: pointer;
      background-color: #e9ecf6;
      color: #b7bed4;
      height: 20px;
      padding: 0 5px;
      b {
        background: url(../../../../static/images/homework/light.png);
        width: image-width;
        height: image-height;
      }
      &:hover {
        color: #fff;
        background: linear-gradient(0deg, #ffc33e 0%, #ebaa08 100%);
        b {
          background: url(../../../../static/images/homework/lightwhite.png);
        }
      }
    }
  }
  .que-con {
    overflow: hidden;
    line-height: 1.41;
    margin: 10px auto;
    font-size: 1.3em;
    color: @main-color;
    letter-spacing: 0.05em;
    min-height: 44px;
  }
  .que-input {
    margin-top: 20px;
  }
  textarea {
    border: 1px solid #b7bed4;
    height: 130px;
    padding: 10px;
    width: 570px;
    margin: 0 auto;
    display: block;
    font-size: 1.3em;
    color: #464646;
    border-radius: 3px;
  }
  .info {
    color: #b7bed4;
    margin-top: 20px;
    font-size: 1.25em;
  }
  .footer {
    border-top: 1px solid #e8e8e8;
    padding: 20px 0;
    padding-left: 20px;
  }
  .btn {
    cursor: pointer;
    float: left;
    line-height: 35px;
    text-align: center;
    color: #fff;
    font-size: 1.3em;
    margin-left: 20px;
    border-radius: 3px;
    background-color: #55a4fc;
    width: 123px;
    height: 35px;
    &:hover {
      background: linear-gradient(0deg, #59b3ff 0%, #4e9ff6 100%);
    }
  }
  .cancel {
    background-color: #e9ecf6;
    color: #b5bccf;
    &:hover {
      background: linear-gradient(0deg, #e9ecf6 0%, #dfe2ed 100%);
    }
  }
  .disable {
    background-color: #e9ecf6;
    color: #b5bccf;
    cursor: default;
    &:hover {
      background: #e9ecf6;
      color: #b5bccf;
    }
  }
}

.h-speak {
  .question {
    b {
      background: url(../../../../static/images/homework/speak.png);
      width: image-width;
      height: image-height;
    }
  }
  .que-record {
    border-top: 1px solid #e8e8e8;
    padding: 30px;
    canvas {
      position: absolute;
      z-index: 1;
      left: -6px;
      top: -6px;
      transform: rotate(-90deg);
    }
    .m-b {
      cursor: pointer;
      float: left;
      position: relative;
      width: 100px;
      z-index: 11;
      height: 100px;
    }
  }

  .rtl {
    direction: rtl;
    text-align: left;
  }

  .repeat {
    float: left;
    border-radius: 50%;
    background-color: #e9ecf6;
    width: 46px;
    height: 46px;
    margin-top: 27px;
    margin-left: 40px;
    b {
      background: url(../../../../static/images/homework/trumpet.png);
      width: image-width;
      height: image-height;
      display: block;
      position: relative;
      top: 14px;
      left: 14px;
    }
    &.active {
      background-color: @main-color;
      cursor: pointer;
    }
  }
}
</style>
