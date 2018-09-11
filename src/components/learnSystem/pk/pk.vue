<template>
  <div>
    <div class="sentence-box" v-if="pk"></div>
    <transition mode="out-in">
      <component :is="state" :data="data" :path="path" :ref="state"></component>
    </transition>
    <component :is="'pk-progress'" :data="progressNum" :updateData="updateProgressNum" :idx="cur" v-if="showProgress" ref="pro"></component>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import _ from 'lodash'

import pkMenu from './pkMenu.vue'
import pkProgress from './pkProgress.vue'
import cutdown from './cutdown.vue'
import singleResult from './singleResult.vue'

// import pkRobot from './pkControl/pkRobot'
// import pkServer from './pkControl/pkServer'
import logCollect from '../../../plugins/logCollect'
import { onlyId } from '../../../plugins/onlyId'
import Loader from '../../../plugins/loader'

export default {
  data () {
    return {
      state: 'pk-menu', // 组件名称
      pk: false, // 双人PK
      single: false, // 单人测试
      progressNum: [], // 进度
      showProgress: true, // 是否显示进度条
      time: 0, // 测试时间
      score: 0, // 记录自己的得分
      pk_finish: false, // 双人PK是否完成
      pk_time: 0, // 用于记录最快的人的时间避免延迟导致时间错误
      save_progress: [], // 自己的进度记录
      cur: -1,
      pk_playerFinish: false,
      data: [], // pk数据
      path: [], // 章节数
      isBack: false // 是否为用户手动点击返回
    }
  },
  components: {
    'pk-menu': pkMenu,
    'cutdown': cutdown,
    'single-result': singleResult,
    'pk-progress': pkProgress
  },
  mounted () {
    var chapterCode = this.currentChapterCode
    if (!chapterCode) {
      chapterCode = localStorage.getItem('currentChapterCode')
    }

    let slideTypeCode = chapterCode + '-A7'
    let chapterContent = this.curChapterContent
    if (Object.keys(chapterContent).length === 0) {
      chapterContent = JSON.parse(localStorage.getItem('curChapterContent'))
    }
    var forms = this.getPkForms(chapterContent, slideTypeCode)
    var resource = this.getResource(forms)
    Loader(resource).then((cb, data) => {
      console.log(data)
      let _slide = forms
      _.map(data, (val) => {
        _slide[val.idx][val.type] = val.url
      })
      this.$set(this, 'data', _slide)
    }).catch((cb, err) => {
      console.log(err.stack)
    })

    this.$on('pk_player_getProgress', data => {
      this.$broadcast('addCouple', data.index, data.score)
    })

    this.$on('pk_finish', data => {
      data = data || {
        time: this.$.pro.getTime()
      }
      this.pk_finish = true
      this.pk_time = data.time
      this.$emit('time-over')
    })

    this.$on('pk_player_leave', () => {
      // toaster.success(Config.tips.pk_playerLeave)
    })

    this.$on('pk_player_finish', () => {
      this.pk_playerFinish = true
    })
  },
  computed: {
    ...mapState({
      currentChapterCode: state => state.course.currentChapterCode,
      curChapterContent: state => state.course.curChapterContent
    }),
    questionNum () {
      return Math.floor(this.data.length / 2)
    },
    precision () {
      var num = 0
      for (var i = 0; i < this.progressNum.length; i++) {
        if (this.progressNum[i] > 0) {
          num++
        }
      }
      return Math.round(num / this.progressNum.length * 100)
    },
    combo () {
      let num = 0
      let max = 0
      for (var i = 0; i < this.progressNum.length; i++) {
        if (this.progressNum[i] > 0) {
          num++
        } else {
          max = max > num ? max : num
          num = 0
        }
      }
      return max > num ? max : num
    },
    currentNum () {
      for (var i = 0; i < this.progressNum.length; i++) {
        if (this.progressNum[i] === -1) {
          return i
        }
      }
    },
    partNum () {
      return this.data[0].sound
        .split('sounds/')[1]
        .split('-')[0]
        .split('/')
    }
  },
  created () {
    console.log('created')
    this.$on('single-pk', () => {
      this.initCutDown()
      return false
    })

    this.$on('couple-pk', (data) => {
      this.initCutDown(this.questionNum, data)
      return false
    })

    this.$on('finished-pk', (score) => {
      console.log('finished-pk')
      if (!this.single && !this.pk_finish) {
        this.score = score
        this.time = this.$refs.pro.getTime()
        this.$emit('pk_over', [this.time])
        // 暂停倒计时
        this.$broadcast('pasue-progress')
        // 提示用户等待
        if (!this.pk_playerFinish) {
          // toaster.success(Config.tips.pk_waitPlayer)
        }
        return
      } else if (this.single) {
        this.score = score
        this.time = this.$refs.pro.getTime()
      }
      // 如果不是break的则
      if (this.state !== 'pk-menu') {
        if (this.single) {
          this.state = 'single-result'
        } else {
          this.state = 'couple-result'
        }
        let that = this
        setTimeout(() => {
          this.postCourseTestRecord({
            chapterCode: this.currentChapterCode,
            progress: JSON.stringify(that.save_progress)
          })
          // var result = that.$refs.pro.getResult(this.pk_time)
          if (that.$refs.pro) {
            that.$refs.pro.$emit('reset-progress')
          }
          that.pk = false
          this.$nextTick(() => {
            that.$refs['single-result'].$emit(
              'init-result',
              {
                score: that.score,
                time: that.time,
                question_num: that.questionNum,
                progress: that.save_progress
              }
            )
            that.showProgress = false
          })
        }, 500)
      }
      console.log('isback: ', this.isBack)
      // 结束时的日志汇报
      if (this.isBack) {
        // 用户点击了返回，数据汇报为exit
        let isFirst = 1 // 默认均为第一次学习
        let partNum = this.partNum.concat(this.currentNum + 1).join('-')
        logCollect.learnExit(isFirst, partNum)
      } else {
        // let isFirst = 1 // 默认均为第一次学习
        // let precision = this.precision
        // let combo = this.combo
        // let coin = 0 // pk模式不能获取金币，暂时默认为0；
        // 未点击，则数据汇报为end
        // logCollect.learnEnd(isFirst, precision, combo, coin)
      }
      this.isBack = false // isback状态初始化
      onlyId.del() // 在结算成绩后，会删除当前唯一ID

      return false
    })

    this.$on('form-score', (idx, score) => {
      console.log('form-score')
      this.cur = idx
      // 设置存储进度
      this.save_progress[idx] = {
        time: this.$refs['pro'].getTime(),
        score: score
      }
      this.progressNum[idx] = score
    })

    this.$on('time-over', () => {
      this.$refs.cutdown.$emit('timeup')
      return false
    })

    this.$on('back', (content) => {
      this.cur = -1
      if (this.state === 'pk-menu' || content) {
        // this.$dispatch('change-router', _.take(this.path, 3).join('/'))
        // this.$broadcast('break-rebot')
        this.$router.push({ path: '/app/course-list' })
      } else {
        // pk中断强制上传时间
        if (this.$refs.pro) {
          this.time = this.$refs.pro.getTime()
          this.pk_finish = true
        }

        this.state = 'pk-menu'
        this.showProgress = true
        if (this.$refs.pro) {
          this.$refs.pro.$emit('reset-progress')
        }

        if (this.$refs.cutdown) {
          this.$refs.cutdown.$emit('break')
        }
      }

      // this.$emit('pk_break')
    })

    this.$on('clientBack', () => {
      this.isBack = true // 客户端点击了返回退出，改变状态
    })

    this.$on('pkProgLog', (isFirst, formNum, type, optinon, result) => {
      logCollect.learnProg(isFirst, formNum, type, optinon, result)
    })

    this.$on('pkStartLog', (isFirst) => {
      // logCollect.learnStart(isFirst)
    })
  },
  methods: {
    ...mapActions({
      postCourseTestRecord: 'learn/postCourseTestRecord'
    }),
    initCutDown (num, data) {
      console.log('initCutDown')
      this.pk_time = 0
      this.showProgress = true
      this.$set(this, 'progressNum', _.fill(Array(this.questionNum), -1))
      this.$set(this, 'state', 'cutdown')
      // this.state = 'cutdown'
      this.pk = true
      this.pk_finish = false
      this.pk_playerFinish = false
      this.single = num ? !num : true
      this.$refs['pro'].$emit('init')
      this.score = 0

      this.$nextTick(() => {
        this.$refs.pro.$emit('init-timer', num, data)
      })
    },
    getPkForms (chapterContent, slideTypeCode) {
      console.log('chapterContent', chapterContent)
      let forms = []
      chapterContent.improvement.parts.forEach((item) => {
        if (item.slide_type_code === slideTypeCode) {
          forms = item.slides[0].forms
        }
      })
      return forms
    },
    updateProgressNum (data) {
      console.log('updateProgressNum')
      this.progressNum = data
    },
    getResource (forms) {
      var resource = []
      _.map(forms, function (val, idx) {
        val.form_id = idx + 1
        resource.push([{
          url: val.image,
          idx: idx,
          type: 'image'
        }, {
          url: val.sound,
          idx: idx,
          type: 'sound'
        }])
      })
      return _.flattenDeep(resource)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
