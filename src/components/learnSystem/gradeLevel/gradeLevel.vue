<template>
  <div>
    <div class="sentence-box" v-if="pk"></div>
    <transition mode="out-in">
      <component :is="state" :data="data" :path="path" :ref="state"></component>
    </transition>
    <component :is="'grade-progress'" :data="progressNum" :idx="cur" :currLevel="currLevel" v-if="showProgress" ref="pro"></component>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapState, mapMutations, mapActions } from 'vuex'

import gradeProgress from './gradeProgress.vue'
import pkMenu from '../pk/pkMenu.vue'
import cutdown from '../pk/cutdown.vue'
import Loader from '../../../plugins/loader'

export default {
  props: ['currLevel'],
  data () {
    return {
      contentInfo: {},
      state: 'pk-menu', // 组件名称
      pk: false, // 双人PK
      single: false, // 单人测试
      progressNum: [], // 进度,正误
      showProgress: true, // 是佛显示进度条
      time: 0, // 测试时间
      score: 0, // 记录自己的得分
      pk_finish: false, // 双人PK是否完成
      pk_time: 0, // 用于记录最快的人的时间避免延迟导致时间错误
      save_progress: [], // 自己的进度记录, 用时+正误
      cur: -1,
      pk_playerFinish: false,
      data: [], // pk数据
      path: [], // 章节数
      courseCode: ''
      // currLevel: 1 //当前评测定级的索引,从1开始1=A1,2=A2,3=B1,...
    }
  },
  components: {
    'grade-progress': gradeProgress,
    'pk-menu': pkMenu,
    'cutdown': cutdown
  },
  beforeRouteUpdate (to, from, next) {
    if (to.name === 'gradeLevel') {
      console.log(this.contentInfo)
      this.$set(this, 'state', 'pk-menu')
      this.$refs.cutdown.$emit('break')
      this.$refs.pro.$emit('reset-progress')
      // this.$set(this, 'data', [])
      let level = 'Level' + to.params.currLevel
      let curLevelContentInfo = _.get(this.contentInfo, [level])
      var forms = curLevelContentInfo.slides[0].forms
      var resource = this.getResource(forms)
      Loader(resource).then((cb, data) => {
        console.log(data)
        let _slide = forms
        _.map(data, (val) => {
          _slide[val.idx][val.type] = val.url
        })
        this.$set(this, 'data', _slide)
        this.initCutDown()
        next()
      }).catch((cb, err) => {
        console.log(err.stack)
      })
    } else {
      next()
    }
  },
  mounted () {
    this.courseCode = this.currentCourseCode
    if (!this.courseCode) {
      this.courseCode = localStorage.getItem('currentCourseCode')
    }
    this.getGradeContent(this.courseCode).then((res) => {
      console.log(res)
      this.contentInfo = res.content_info
      let level = 'Level' + this.currLevel
      let curLevelContentInfo = _.get(this.contentInfo, [level])
      var forms = curLevelContentInfo.slides[0].forms
      var resource = this.getResource(forms)
      Loader(resource).then((cb, data) => {
        console.log(data)
        let _slide = forms
        _.map(data, (val) => {
          _slide[val.idx][val.type] = val.url
        })
        this.$set(this, 'data', _slide)
        this.initCutDown()
      }).catch((cb, err) => {
        console.log(err.stack)
      })
    })
  },
  computed: {
    ...mapState({
      currentCourseCode: state => state.course.currentCourseCode
    }),
    questionNum () {
      console.log(this.data)
      return Math.floor(this.data.length / 2)
    },
    pkData () {
      return this.data
    }
  },
  created () {
    this.$on('single-pk', () => {
      this.initCutDown()
      return false
    })

    this.$on('couple-pk', (data) => {
      this.initCutDown(this.questionNum, data)
      return false
    })

    this.$on('finished-pk', (score) => {
      if (!this.single && !this.pk_finish) {
        this.score = score
        this.time = this.$refs.pro.getTime()
        // $event.trigger('pk_over', [this.time])
        // 暂停倒计时
        this.$refs['pro'].$emit('pasue-progress')
        // 提示用户等待
        if (!this.pk_playerFinish) {
          // toaster.success(Config.tips.pk_waitPlayer)
        }
        return
      } else if (this.single) {
        this.score = score
        this.time = this.$refs.pro.getTime()
      }
      return false
    })

    this.$on('form-score', (idx, score) => {
      this.cur = idx
      // 设置存储进度
      this.save_progress[idx] = {
        time: this.$refs['pro'].getTime(),
        score: score
      }
      this.progressNum[idx] = score
      /**
       * this.progressNum = [0,1,0,0,-1,-1,-1,-1]
       * 1.判断最后一个是否是'-1', 如果不是-1表示本轮的题目还没有做完
       * 2.向服务端传送定级数据, level_grade/grade_result
       * 3.判断当前的正确率是否大于90%, 大于继续做后面的题目, 否则回到定级确认页面
       * 4.判断当前的level是否是level6, 如果是level6, 回到定级确认页面
       */
      var _progressNum = this.progressNum
      if (_progressNum[_progressNum.length - 1] !== -1) {
        var gradeCode =
          this.courseCode +
          '-Level' + parseInt(this.currLevel) +
          '-Unit4-Chapter6-A7'
        var progress = {}
        _.each(_progressNum, (val, key) => {
          // key从0开始计数,所以需要+1
          var _key = 'A7-1-' + (parseInt(key) + 1)
          progress[_key] = val
        })
        progress = JSON.stringify(progress)
        var _this = this
        var obj = {
          courseCode: this.courseCode,
          gradeCode: gradeCode,
          progress: progress,
          level: 'Level' + this.currLevel
        }
        this.postGradeResult(obj).then((data) => {
          console.log('--123--')
          console.log(data)
          console.log(_this.currLevel)
          var res = data.grade_result
          if (parseFloat(res.rate) >= 0.9) {
            var nextLevel = parseInt(_this.currLevel) + 1
            if (parseInt(_this.currLevel) < 6) {
              this.$router.replace({ path: '/learn/gradeLevel/level' + nextLevel })
            } else {
              this.updateGradeLevelActivity(nextLevel)
              this.$router.push({ path: '/course/grade-level-confirm' })
            }
          } else {
            this.updateGradeLevelActivity(_this.currLevel)
            this.$router.push({ path: '/course/grade-level-confirm' })
          }
        })
      }
    })

    this.$on('time-over', () => {
      this.$broadcast('timeup')
      return false
    })

    this.$on('back', (content) => {
      this.$router.push({path: '/course/course-list'})
      // window.location.href =
      //   Config.index +
      //   'v2/learn/index/' +
      //   Config.LANG.lang +
      //   '/Basic/content/Level1'
    })
  },
  methods: {
    ...mapMutations({
      updateGradeLevelActivity: 'course/updateGradeLevelActivity'
    }),
    ...mapActions({
      getGradeContent: 'learn/getGradeContent',
      postGradeResult: 'learn/postGradeResult'
    }),
    initCutDown (num, data) {
      this.pk_time = 0
      this.showProgress = true
      this.$set(this, 'progressNum', _.fill(Array(this.questionNum), -1))
      console.log(this.progressNum)
      this.$set(this, 'state', 'cutdown')
      this.cur = -1
      this.pk = true
      this.pk_finish = false
      this.pk_playerFinish = false
      this.single = !num
      // this.$refs['pro'].$emit('init')
      this.score = 0

      this.$nextTick(() => {
        this.$refs.pro.$emit('init-timer', num, data)
      })
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
<style lang='less' scoped>
  @import '../../../../static/less/global_var.less';
</style>
