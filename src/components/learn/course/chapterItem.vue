<template>
  <div>
    <div v-for="(item, index) in curLevelChapters" :key="index" :id="item.code">
      <transition name="fade" mode="out-in">
      <div class="current-learn-course-info" v-show="isShow ? isShow : item.code !== currentChapterCode"
          :class="{'current-learn-course-disabled': unlockCourses.indexOf(item.code) === -1}"
          @click="jumpToCourse(item.code)">
        <div class="current-learn-course-flag">
          <img v-bind:src="'https://course-assets1.talkmate.com/'+item.image.replace('200x200', '1200x488')+'/format/jpeg'">
          <div class="fix-ie-bg" v-if="unlockCourses.indexOf(item.code) === -1"></div>
        </div>
        <div class="current-learn-course-word-info">
          <div class="current-learn-course-title">
            <span>课程</span>
            <span>{{ parseInt(item.code.split('-')[3].split("").pop()-1)*6 + parseInt(item.code.split('-')[4].split("").pop()) }}</span>
          </div>
          <div class="current-learn-course-describe">{{ item['info']['zh-cn']['describe'] }}</div>
          <div class="current-learn-course-gold"  :class="{'courseIsLock': (parseInt(userInfo.member_info.member_type) === 1) ? false :  (buyChapters.indexOf(item.code) === -1)}">
            <i></i>
            150金币
          </div>
        </div>
        <div class="progress-area">
          <div class="progress-bg">
            <div class="progress" :style="{width: (item.progress ? item.progress : 0) +'%'}"></div>
          </div>
          <div class="progress-val"
            :style="{color: item.progress ? '#0581d1' : '#cbcbcb'}"
            v-text="(parseFloat(item.progress) > 0 ? item.progress : 0)+'%'">
          </div>
        </div>
      </div>
      </transition>
      <transition name="fade" mode="out-in">
        <div class="course-core-test-check" v-show="item.code === currentChapterCode && unlockCourses.indexOf(item.code) > -1 && (buyChapters.indexOf(item.code) !== -1 || parseInt(userInfo.member_info.member_type) ===1) && !isShow">
          <ul>
            <li class="course-brief" @click="switchShow()">
              <img v-bind:src="'https://course-assets1.talkmate.com/'+item.image.replace('200x200', '1200x488')+'/format/jpeg'" alt="">
              <div class="course-brief-shade">
                <div class="course-brief-title">
                  <span>课程</span>
                  <span>{{ parseInt(item.code.split('-')[3].split("").pop()-1)*6 + parseInt(item.code.split('-')[4].split("").pop()) }}</span>
                </div>
                <div class="course-brief-describe">{{ item['info']['zh-cn']['describe'] }}</div>
                <div class="course-brief-progress-title">学习进度：</div>
                <div class="course-brief-progress-area">
                  <div class="course-brief-progress-bg">
                    <div class="course-brief-progress" :style="{width: item.progress+'%'}"></div>
                  </div>
                  <div class="course-brief-progress-val">
                    {{ (item.progress ? item.progress : 0)+'%'}}
                  </div>
                </div>
              </div>
            </li>
            <li class="course-core">
              <div class="course-core-name">
                <span>核心课程</span>
              </div>
              <div class="course-item-box" v-for="i in 5" :key="i">
                <a href="javascript:void(0)" @click="startCore('A0' + i, coreData[i]['isActive'])" :to="{ name: 'stage', params: {id: 'A0' + i}}">
                  <div class="course-item">
                    <p class="course-item-star" v-if="coreData[i]['isCompleted']">
                      <span class="course-yellow-star"><i v-for="index in coreData[i]['starNum']" :key="index"></i></span>
                      <span class="course-yellow-star courseIsLock"><i v-for="index in (5 - coreData[i]['starNum'])" :key="index"></i></span>
                    </p>
                    <p class="course-item-progress" v-else>
                      <span v-text="coreData[i]['completedRate']"></span>
                    </p>
                    <div class="course-item-icon">
                      <canvas width="300" height="300" :id="item.code + '-canvas-A0' + i"></canvas>
                      <div :class="'core' + i"></div>
                      <i v-show="!coreData[i]['isCompleted'] && !coreData[i]['completedRate'] && !coreData[i]['isActive']" class="icon-course-lock"></i>
                    </div>
                    <p class="course-item-title" :class="{'course-item-title-locked': !coreData[i]['completedRate'] &&  !coreData[i]['isActive']}">核心{{i}}</p>
                  </div>
                </a>
                <div class="course-circle-box" v-if="i<5">
                  <div class="course-core-circle" :class="{'course-core-circle-locked': !coreData[i]['isCompleted'] }" v-for="index in 3" :key="index"></div>
                </div>
              </div>
            </li>

            <li class="course-review">
              <div class="course-review-name">
                <span>测试</span>
              </div>
              <div class="course-item-box">
                <a href="javascript:void(0);" @click="startTest(coreData['isCoreCompleted'])">
                  <div class="course-item">
                    <p class="course-item-star" v-show="coreData['isCoreCompleted'] && testData['isTestCompleted']">
                      <span class="course-yellow-star"><i v-for="index in testData['starTestNum']" :key="index"></i></span>
                      <span class="course-yellow-star courseIsLock"><i v-for="index in (5 - testData['starTestNum'])" :key="index"></i></span>
                    </p>
                    <p class="course-item-progress" v-show="!testData['isTestCompleted']">
                      <span v-show="coreData['isCoreCompleted'] && !testData['isTestCompleted']" v-text="testData['completedTestRate']"></span>
                    </p>
                    <div class="course-item-icon">
                      <canvas width="300" height="300" :id="item.code + '-canvas-A7'"></canvas>
                      <div class="review-test"></div>
                      <i v-show="!coreData['isCoreCompleted']" class="icon-review-lock"></i>
                    </div>
                    <p class="course-item-title" :class="{'course-item-title-locked': !coreData['isCoreCompleted'] }">测试</p>
                  </div>
                </a>
                <div class="course-circle-box">
                  <div class="course-review-circle" :class="{'course-review-circle-locked': !testData['isTestCompleted'] }" v-for="index in 3" :key="index"></div>
                </div>
              </div>
            <div class="course-item-box">
              <a href="javascript:void(0)" @click="startHomework(coreData['isCoreCompleted'])">
                <div class="course-item">
                  <p class="course-item-star"  v-show="coreData['isCoreCompleted']  && homeworkData['isHomeworkCompleted']">
                    <span class="course-yellow-star"><i v-for="index in homeworkData['starHomeworkNum']" :key="index"></i></span>
                    <span class="course-yellow-star courseIsLock"><i v-for="index in (5 - homeworkData['starHomeworkNum'])" :key="index"></i></span>
                  </p>
                  <p class="course-item-progress" v-show="!homeworkData['isHomeworkCompleted']">
                    <span v-show="coreData['isCoreCompleted'] && !homeworkData['isHomeworkCompleted']" v-text="homeworkData['completedHomeworkRate']"></span>
                  </p>
                  <div class="course-item-icon">
                    <canvas width="300" height="300" :id="item.code + '-canvas-A8'"></canvas>
                    <div class="review-homework"></div>
                    <i v-show="!coreData['isCoreCompleted']" class="icon-review-lock"></i>
                  </div>
                  <p class="course-item-title" :class="{'course-item-title-locked': !coreData['isCoreCompleted'] }">作业</p>
                </div>
              </a>
            </div>
          </li>

          <li class="course-vip" v-show="item.code === currentChapterCode">
              <div class="course-vip-name">
                <p>强化</p>
                <p>(会员专享)</p>
              </div>
              <div class="course-item-box" v-for="(vipitem, i) in vipItemList" :key="i">
                <a href="javascript:void(0);" @click="jumpVipPage(coreData['isCoreCompleted'] && vipData['A' + (i + 1)]['isActive'], 'A' + (i + 1))">
                  <div class="course-item">
                    <p class="course-item-star" v-if="vipData['A' + (i + 1)]['isCompleted']">
                      <span class="course-yellow-star"><i v-for="index in vipData['A' + (i + 1)]['starNum']" :key="index"></i></span>
                      <span class="course-yellow-star courseIsLock"><i v-for="index in (5 - vipData['A' + (i + 1)]['starNum'])" :key="index"></i></span>
                    </p>
                    <p class="course-item-progress" v-else>
                      <span v-text="vipData['A' + (i + 1)]['completedRate']"></span>
                    </p>
                    <div class="course-item-icon">
                      <canvas width="300" height="300" :id="item.code + '-canvas-A' + (i + 1)"></canvas>
                      <div :class="'vip'+ (i + 1)"></div>
                      <i v-show="!(coreData['isCoreCompleted'] && vipData['A' + (i + 1)]['isActive'])" class="icon-vip-lock"></i>
                    </div>
                    <p class="course-item-title" :class="{'course-item-title-locked': !(coreData['isCoreCompleted'] && vipData['A' + (i + 1)]['isActive']) }">{{ $t("courseItem.vip."+vipitem) }}</p>
                  </div>
                  <div class="course-circle-box" v-if="i<(vipItemList.length-1)">
                    <div class="course-vip-circle" :class="{'course-vip-circle-locked': !vipData['A' + (i + 1)]['completedRate'] }" v-for="index in 3" :key="index"></div>
                  </div>
                </a>
              </div>
            </li>
          </ul>
        </div>
      </transition>
    </div>
    <div class="nolock-test-check" v-show="nolockTestCheckShow">
      <p class="animated flipInX" v-show="nolockTestCheckShow">
        <span v-html="tips"></span>
        <i></i>
        <span class="goBackCore" @click="goBackLearn">继续学习</span>
      </p>
    </div>
    <div class="nolock-test-check" v-show="anonymousCheckShow">
      <p class="animated flipInX">快去注册，<br>开启全球说学习之旅吧！
        <i></i>
        <span class="goBackCore" @click="goToRegister">去注册</span>
      </p>
    </div>
    <buy-chapter ref='buyChapter' />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import $ from 'jquery'
import BuyChapter from './buyChapterConfirm.vue'
export default {
  props: ['currentCourseCode', 'item'],
  data () {
    return {
      isCoreCompleted: 0,
      chapterProgress: 0,
      vipItemList: ['listen', 'oral', 'reading', 'writing', 'grammar', 'speaking'],
      nolockTestCheckShow: false,
      anonymousCheckShow: false,
      isShow: false,
      tips: ''
    }
  },
  components: {
    BuyChapter
  },
  created () {
    this.$on('draw', this.drawProgress)
    this.$on('changeIsShow', (flag) => {
      this.isShow = flag
    })
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo,
      'currentChapterCode': state => state.course.currentChapterCode,
      'unlockCourses': state => state.course.unlockCourses,
      'buyChapters': state => state.course.buyChapters,
      'curLevelChapters': state => state.course.curLevelChapters,
      'courseBaseInfo': state => state.course.coursBaseInfo,
      'curChapterProgress': state => state.course.curChapterProgress,
      'curChapterContent': state => state.course.curChapterContent,
      'chapterTestResult': state => state.course.chapterTestResult,
      'homeworkContent': state => state.course.homeworkContent
    }),
    coreData () {
      var that = this
      console.log(that.curLevelChapters)
      // 核心课程

      let curChapterCode = that.currentChapterCode
      let corePartInfos = that.$store.state.course.courseBaseInfo.corePartInfos
      let coreParts = corePartInfos.filter((item) => curChapterCode.indexOf(item.chapter_code) > 0)

      let retObj = {}
      let partObj = coreParts[0].parts
      let coreNum = 0
      partObj.forEach(element => {
        let startForm = element.start_form - 1
        let endForm = element.end_form
        let coreForms = []
        element.Slides.forEach((slide) => {
          Object.keys(that.curChapterProgress).filter((item) => {
            return item.indexOf('A0-' + slide + '-') > -1
          }).map((el) => {
            return that.curChapterProgress[el]
          }).forEach((i) => {
            coreForms.push(i)
          })
        })
        let obj = {}
        let len = endForm - startForm
        if (coreForms.length < len) {
          obj['isCompleted'] = 0
          obj['starNum'] = 0
          obj['completedRate'] = !coreForms.length ? '' : ((coreForms.length / len) * 100).toFixed(0) + '%'
          obj['imgStyle'] = ''
        } else {
          obj['isCompleted'] = 1
          obj['completedRate'] = '1'
          let correctNum = coreForms.filter((item) => item === 1).length
          let correctRate = (correctNum / coreForms.length).toFixed(2)
          obj['starNum'] = this.starNum(correctRate)
          obj['imgStyle'] = ''

          coreNum++
        }

        obj['isActive'] = 0
        if (element.part_num === 1) {
          obj['isActive'] = 1
        } else {
          if (retObj[element.part_num - 1]['isCompleted'] === 1) {
            obj['isActive'] = 1
          }
        }
        retObj[element.part_num] = obj
      })

      retObj['isCoreCompleted'] = (coreNum === 5) ? 1 : 0
      this.$emit('draw', 'core', retObj)
      return retObj
    },
    // 强化 会员专享
    vipData () {
      let that = this
      let retObj = {}
      let srcVipArray = []
      let vipFormArray = []
      for (let i = 1; i <= 6; i++) {
        let obj = {}
        obj['isCompleted'] = 0
        obj['starNum'] = 0
        obj['completedRate'] = '0'
        obj['imgStyle'] = ''

        if (Object.keys(that.$store.state.course.curChapterContent).length > 0) {
          srcVipArray[i] = Object.keys(that.$store.state.course.curChapterProgress).filter((item) => {
            return item.indexOf('A' + i) > -1
          }).map((el) => {
            return that.curChapterProgress[el]
          })
          let vipParts = that.curChapterContent.improvement.parts
          vipParts.forEach((item) => {
            if (item.slide_type_code.indexOf('A' + i) > -1) {
              let formsLength = 0
              item.slides.forEach((slide) => {
                formsLength += slide.forms.length
              })
              vipFormArray[i] = formsLength
            }
          })

          if (srcVipArray[i] && (srcVipArray[i].length < vipFormArray[i])) {
            obj['isCompleted'] = 0
            obj['starNum'] = 0
            obj['completedRate'] = !srcVipArray[i].length ? '' : ((srcVipArray[i].length / vipFormArray[i]) * 100).toFixed(0) + '%'
            obj['imgStyle'] = ''
          } else {
            obj['isCompleted'] = 1
            obj['completedRate'] = '1'
            let correctNum = srcVipArray[i].filter((item) => item === 1).length
            let correctRate = (correctNum / vipFormArray[i]).toFixed(2)
            obj['starNum'] = this.starNum(correctRate)
            obj['imgStyle'] = ''
          }
        }

        obj['isActive'] = 0
        if (i === 1) {
          obj['isActive'] = 1
        } else {
          if (retObj['A' + (i - 1)]['isCompleted'] === 1) {
            obj['isActive'] = 1
          }
        }
        if (parseInt(this.userInfo.member_info.member_type) !== 1) {
          obj['isCompleted'] = 0
          obj['isActive'] = 0
          obj['completedRate'] = ''
          obj['starNum'] = 0
          obj['imgStyle'] = ''
        }
        retObj['A' + i] = obj
      }
      console.log(srcVipArray)
      console.log(vipFormArray)
      this.$emit('draw', 'vip', retObj)
      return retObj
    },
    testData () {
      // 测试
      var that = this
      let retObj = {}
      // let srcTestArray = Object.keys(that.curChapterProgress).filter((item) => {
      //   return item.indexOf('A7') > -1
      // }).map((el) => {
      //   return that.curChapterProgress[el]
      // })
      if (that.chapterTestResult.current_user && Object.keys(that.chapterTestResult.current_user).length > 0) {
        retObj['isTestCompleted'] = 1
        retObj['completedTestRate'] = '1'
        console.log('correct_rate---->', this.chapterTestResult)
        let correctRate = this.chapterTestResult.current_user.correct_rate
        if (!correctRate) {
          correctRate = 0
        }
        correctRate = Math.floor((correctRate).toFixed(3))
        retObj['starTestNum'] = this.starNum(correctRate)
        retObj['imgTestStyle'] = ''
      } else {
        retObj['isTestCompleted'] = 0
        retObj['completedTestRate'] = ''
        retObj['starTestNum'] = 0
        retObj['imgTestStyle'] = ''
      }
      if (!this.coreData['isCoreCompleted']) {
        retObj['completedTestRate'] = ''
        retObj['isTestCompleted'] = 0
      }
      this.$emit('draw', 'test', retObj)
      return retObj
    },
    // 作业
    homeworkData () {
      let that = this
      let retObj = {}
      if (that.homeworkContent && Object.keys(that.homeworkContent).length > 0) {
        let homeworkNum = that.homeworkContent.length
        let doneNum = 0
        that.homeworkContent.forEach((item) => {
          if (item.has_done) {
            doneNum++
          }
        })
        if (homeworkNum === doneNum) {
          retObj['isHomeworkCompleted'] = 1
          retObj['starHomeworkNum'] = 5
          retObj['completedHomeworkRate'] = '0'
          retObj['imgHomeworkStyle'] = ''
        } else {
          retObj['isHomeworkCompleted'] = 0
          retObj['starHomeworkNum'] = 0
          retObj['completedHomeworkRate'] = (doneNum === 0) ? '' : (doneNum / homeworkNum * 100).toFixed(0) + '%'
          retObj['imgHomeworkStyle'] = ''
        }
      } else {
        retObj['isHomeworkCompleted'] = 0
        retObj['starHomeworkNum'] = 0
        retObj['completedHomeworkRate'] = ''
        retObj['imgHomeworkStyle'] = ''
      }
      if (!this.coreData['isCoreCompleted']) {
        retObj['completedHomeworkRate'] = ''
      }
      this.$emit('draw', 'homework', retObj)
      return retObj
    }
  },
  methods: {
    jumpToCourse (chapterCode) {
      let isAnonymous = this.userInfo['is_anonymous']
      if (isAnonymous) {
        this.anonymousCheckShow = true
        return false
      }
      if (this.unlockCourses.indexOf(chapterCode) === -1) {
        this.tips = '完成上一课“核心课程”, <br>才能开启本课程！'
        this.nolockTestCheckShow = true
        return false
      }
      if (this.buyChapters.indexOf(chapterCode) === -1 && parseInt(this.userInfo.member_info.member_type) !== 1) {
        this.$refs['buyChapter'].$emit('buyCoin', chapterCode)
        return false
      }

      let top = $('#' + chapterCode).offset().top - 90
      $('body,html').animate({ scrollTop: top }, 300, 'linear')
      // $('body,html').scrollTop(top)

      setTimeout(() => {
        this.$emit('loadChapterInfo', chapterCode)
      }, 400)
    },
    starNum (correctRate) {
      let stars = 0
      if (correctRate <= 0.40) {
        stars = 1
      } else if (correctRate <= 0.65) {
        stars = 2
      } else if (correctRate <= 0.80) {
        stars = 3
      } else if (correctRate <= 0.95) {
        stars = 4
      } else {
        stars = 5
      }
      return stars
    },
    startCore (id, isActive) {
      if (isActive) {
        this.$router.push({ name: 'stage', params: {id: id} })
      } else {
        this.tips = '学习需要循序渐进, <br>请先完成前面课程的学习哦！'
        this.nolockTestCheckShow = true
      }
    },
    startTest (isCoreCompleted) {
      if (!isCoreCompleted) {
        this.tips = '学习需要循序渐进, <br>请先完成前面课程的学习哦！'
        this.nolockTestCheckShow = true
      } else {
        this.$router.push({ path: '/learn/pk' })
      }
    },
    startHomework (isCoreCompleted) {
      if (!isCoreCompleted) {
        this.tips = '学习需要循序渐进, <br>请先完成前面课程的学习哦！'
        this.nolockTestCheckShow = true
      } else {
        this.$router.push({ path: '/app/homework' })
      }
    },
    jumpVipPage (isActive, id) {
      if (parseInt(this.userInfo.member_info.member_type) !== 1) {
        this.$router.push({ path: '/app/user/vip' })
      } else {
        if (isActive) {
          this.$router.push({ name: 'stage', params: {id: id} })
        } else {
          this.tips = '学习需要循序渐进, <br>请先完成前面课程的学习哦！'
          this.nolockTestCheckShow = true
        }
      }
    },
    goBackLearn () {
      this.nolockTestCheckShow = false
    },
    drawProgress (type, retObj) {
      console.log(retObj)
      let chapterCode = this.currentChapterCode
      if (type === 'core') {
        for (let i = 1; i <= 5; i++) {
          let rate = parseFloat(retObj[i]['completedRate'] ? retObj[i]['completedRate'] : 0)
          let id = '#' + chapterCode + '-canvas-A0' + i
          let color = '#2A9FE4'
          this.draw(id, rate, color)
        }
      } else if (type === 'test') {
        let rate = parseFloat(retObj['completedTestRate'] ? retObj['completedTestRate'] : 0)
        let id = '#' + chapterCode + '-canvas-A7'
        let color = '#7FB926'
        this.draw(id, rate, color)
      } else if (type === 'homework') {
        let rate = parseFloat(retObj['completedHomeworkRate'] ? retObj['completedHomeworkRate'] : 0)
        let id = '#' + chapterCode + '-canvas-A8'
        let color = '#7FB926'
        this.draw(id, rate, color)
      } else if (type === 'vip') {
        for (let i = 1; i <= 6; i++) {
          let rate = parseFloat(retObj['A' + i]['completedRate'] ? retObj['A' + i]['completedRate'] : 0)
          let id = '#' + chapterCode + '-canvas-A' + i
          let color = '#F5A623'
          this.draw(id, rate, color)
        }
      }
    },
    draw (id, rate, color) {
      if (this.$el && this.$el.querySelector(id)) {
        rate = (rate === 1) ? 100 : rate
        let canvas = this.$el.querySelector(id)
        let ctx = canvas.getContext('2d')
        let mW = canvas.width
        let mH = canvas.height
        let startAngle = -(1 / 2 * Math.PI) // 开始角度
        let endAngle = startAngle + 2 * Math.PI * rate * 0.01 // 结束角度
        ctx.clearRect(0, 0, mW, mH)
        ctx.beginPath()
        ctx.arc(140, 157, 98, startAngle, endAngle)
        ctx.lineWidth = 9
        ctx.strokeStyle = color
        ctx.stroke()
      }
    },
    switchShow () {
      this.isShow = true
    },
    goToRegister () {
      let langCode = this.userInfo['current_course_code'].split('-')[0]
      this.$router.push({ path: '/auth/register/' + langCode })
    }
  }
}
</script>

<style scoped>
  .current-learn-course-info{
    cursor: pointer;
    padding:15px;
    background-color:#fff;
    border-radius: 4px;
    margin-top:15px;
    overflow:hidden;
    -webkit-transition: all .3s ease-in-out;
    -moz-transition: all .3s ease-in-out;
    -ms-transition: all .3s ease-in-out;
    -o-transition: all .3s ease-in-out;
    transition: all .3s ease-in-out;
    border-radius: 5px 5px 0 0;
  }
  .current-learn-course-info:hover {
    box-shadow: 0 0 26px 0 rgba(000, 000, 000, 0.3);
    -webkit-transition: all .3s ease-in-out;
    -moz-transition: all .3s ease-in-out;
    -ms-transition: all .3s ease-in-out;
    -o-transition: all .3s ease-in-out;
    transition: all .3s ease-in-out;
  }

  .current-learn-course-disabled{
    cursor: not-allowed;
  }

  .current-learn-course-flag{
    float:left;
    width:213px;
    height:100px;
    border-radius: 2.73px;
    overflow:hidden;
    position:relative;
  }

  .current-learn-course-flag img{
    height: 100%;
    width: 100%;
    line-height: auto;
    object-fit: cover;
  }

  .fix-ie-bg{
    width: 100%;
    height: 100%;
    background-color: #000;
    background-image: url('../../../../static/images/learn/learn-course-little-bg.png');
    background-size: cover;
    background-repeat: no-repeat;
    opacity: 0.3;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
  }

  .current-learn-course-word-info{
    float:left;
    margin-left:28px;
  }

  .current-learn-course-title{
    font-size: 16px;
    color: #404040;
    font-weight: 600;
    line-height: 24px;
  }

  .current-learn-course-describe{
    font-size:14px;
    color:#616161;
    line-height: 22px;
  }

  .current-learn-course-gold{
    color: #616161;
    font-size: 12px;
    line-height: 15px;
    margin-top: 39px;
  }

 .current-learn-course-gold i{
    float:left;
    width:14px;
    height:14px;
    margin-right:10px;
    background:url(../../../../static/images/learn/learn-course-gold.png) no-repeat;
    background-size:100% 100%;
  }

  .courseIsLock i{
    -webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    -ms-filter: grayscale(100%);
    -o-filter: grayscale(100%);
    filter: grayscale(100%);
    -webkit-filter: gray;
    filter: gray;
  }

  .progress-area {
    float: right;
    margin-right: 10px;
    display: inline-flex;
    line-height: 100px;
    width: 190px;
  }

  .progress-bg {
    width: 131px;
    height: 12px;
    background-color: #f4f4f4;
    border-radius: 100px;
    margin: auto 10px;
  }

  .progress{
    background-color: #2097DD;
    height: 12px;
    border-radius: 100px;
    width:0;
  }

  .progress-val{
    display: inline-block;
    font-size: 14px;
    color: #cbcbcb;
    font-weight: bold;
  }

  .fade-enter-active, .fade-leave-active {
    transition: all .8s linear;
  }

  .fade-enter, .fade-leave-to {
    /* transform: translateY(-10px); */
    opacity: 0;
  }

  .course-core-test-check{
    background-color:#fff;
    margin-top: 15px;
    padding:15px;
    border-radius:4px;
    /* transform: translateY(-140px); */
  }

  .course-brief{
    position: relative;
    border-radius: 2.73px;
    height: 322px;
  }

  .course-brief img{
    position: absolute;
    height: 322px;
    width: 100%;
    object-fit: cover;
    border-radius: 2.73px;
  }

  .course-brief-shade{
    position: relative;
    height: 100%;
    width: 100%;
    background: rgba(0,0,0,0.40);
    border-radius: 2.73px;
    z-index: 2;
  }

  .course-brief-title{
    font-size: 48px;
    color: #ffffff;
    line-height: 48px;
    font-weight: bold;
    padding-top: 55px;
    padding-left: 80px;
  }

  .course-brief-describe{
    font-size: 24px;
    color: #ffffff;
    line-height: 24px;
    font-weight: bold;
    margin: 17px 0 0 80px;
  }

  .course-brief-progress-title{
    font-size: 20px;
    color: #ffffff;
    line-height: 24px;
    font-weight: bold;
    margin: 62px 0 0 80px;
  }

  .course-brief-progress-area {
    margin: 10px 0 0 80px;
    display: inline-flex;
    line-height: 10px;
  }

  .course-brief-progress-bg {
    width: 200px;
    height: 12px;
    background-color: rgba(244,244,244,0.4);
    border-radius: 100px;
    margin: auto 10px 0 0;
  }

  .course-brief-progress{
    background-color: #2097DD;
    height: 12px;
    border-radius: 100px;
    width:0;
  }

  .course-brief-progress-val{
    display: inline-block;
    font-size: 16px;
    color: #ffffff;
    font-weight: bold;
  }

  .course-core{
    width: 100%;
    border-bottom: 1px solid rgba(233,234,235,0.50);
    padding: 15px 0 30px;
  }

  .course-core-name{
    font-size: 16px;
    font-weight: bold;
    color:#2a9fe4;
    display: inline-block;
    position: relative;
    margin-top: 50px;
    margin-right: 25px;
    vertical-align: top;
  }

  .course-circle-box{
    display: inline-block;
    position: relative;
    margin-top: 4px;
  }

  .course-core-circle {
    display: inline-block;
    margin: 54px 2px;
    border-radius: 50%;
  }

  .course-core-circle:after {
    content: '';
    margin: 3px;
    display: table;
    width: 4px;
    height: 4px;
    background: #0581d1;
    border-radius: 50%;
  }

  .course-core-circle-locked:after {
    background: #C7EAFF;
  }

  .course-item-box{
    display: inline-block;
    position: relative;
    vertical-align: top;
  }

  .course-item {
    position: relative;
    display: inline-block;
    vertical-align: top;
    text-align: center;
    margin-left: 8px;
    height: 120px;
    width: 75px;
  }

  .course-item-star{
    margin-top: 8px;
    height: 10px;
    display: inline-flex;
  }
  .course-item-star span{
    display: inline-block;
  }

  .course-item-progress {
    height: 18px;
    width: 75px;
    font-size: 12px;
    color: #4A4A4A;
    margin-bottom: 7px;
  }

  .course-item-icon{
    margin: 10px 0 0 5px;
    position: absolute;
    height:64px
  }
  .course-item-icon div{
    cursor: pointer;
    width: 65px;
    height: 65px;
    position: relative;
    border-radius: 50%;
    background-repeat: no-repeat;
    background-size: cover;
  }

  .course-item-icon img[src=""]{
    opacity: 0;
  }

  .course-item-icon .core1{
    background-image: url('../../../../static/images/course/course-core1.png');
  }

  .course-item-icon .core2{
    background-image: url('../../../../static/images/course/course-core2.png');
  }

  .course-item-icon .core3{
    background-image: url('../../../../static/images/course/course-core3.png');
  }

  .course-item-icon .core4{
    background-image: url('../../../../static/images/course/course-core4.png');
  }

  .course-item-icon .core5{
    background-image: url('../../../../static/images/course/course-core5.png');
  }

  .course-item-icon .review-test {
    background-image: url('../../../../static/images/course/course-review-test.png')
  }

  .course-item-icon .review-homework {
    background-image: url('../../../../static/images/course/course-review-homework.png')
  }

  .course-item-icon .vip1 {
    background-image: url('../../../../static/images/course/course-vip-listen.png')
  }
  .course-item-icon .vip2 {
    background-image: url('../../../../static/images/course/course-vip-oral.png')
  }
  .course-item-icon .vip3 {
    background-image: url('../../../../static/images/course/course-vip-reading.png')
  }
  .course-item-icon .vip4 {
    background-image: url('../../../../static/images/course/course-vip-writing.png')
  }
  .course-item-icon .vip5 {
    background-image: url('../../../../static/images/course/course-vip-grammar.png')
  }
  .course-item-icon .vip6 {
    background-image: url('../../../../static/images/course/course-vip-speaking.png')
  }

  .course-item-icon .core-canvas {
    width: 64px;
    height: 64px;
    background-color: red;
    position: absolute;
    z-index: -1;
  }

  .icon-course-lock {
    background-image: url('../../../../static/images/course/icon-course-lock.png');
    background-repeat: no-repeat;
    background-size: cover;
    height: 25px;
    width: 25px;
    display: inline-block;
    margin-top: -30px;
    margin-left: 40px;
    position: relative;
  }

  .icon-review-lock {
    background-image: url('../../../../static/images/course/icon-review-lock.png');
    background-repeat: no-repeat;
    background-size: cover;
    height: 25px;
    width: 25px;
    display: inline-block;
    margin-top: -30px;
    margin-left: 40px;
    position: relative;
  }

  .icon-vip-lock {
    background-image: url('../../../../static/images/course/icon-vip-lock.png');
    background-repeat: no-repeat;
    background-size: cover;
    height: 25px;
    width: 25px;
    display: inline-block;
    margin-top: -30px;
    margin-left: 40px;
    position: relative;
  }
  .course-item-title{
    position: absolute;
    margin: 90px 0 0 20px;
    line-height: 30px;
    font-size: 14px;
    color: #444444;
    font-weight: bold;
  }

  .course-item-title-locked {
    color: #d8d8d8;
  }

  .course-yellow-star i{
    float:left;
    width:10px;
    height:10px;
    margin-left:4px;
    background:url(../../../../static/images/course/course-yellow-star.png) no-repeat;
    background-size:100% 100%;
  }

  .course-review{
    width: 100%;
    border-bottom: 1px solid rgba(233,234,235,0.50);
    padding: 15px 0 30px;
  }

  .course-review-name{
    width: 72px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    color: #7FB926;
    display: inline-block;
    position: relative;
    margin-right: 18px;
    margin-top: 50px;
    vertical-align: top;
  }

  .course-review-circle {
    display: inline-block;
    position: relative;
    margin: 54px 2px;
    border-radius: 50%;
  }

  .course-review-circle:after {
    content: '';
    margin: 3px;
    display: table;
    width: 4px;
    height: 4px;
    background: #7FB926;
    border-radius: 50%;
  }

  .course-review-circle-locked:after {
    background: #DCF0BC;
  }

  .course-vip{
    width: 100%;
    padding: 15px 0 30px;
  }

  .course-vip-name{
    font-size: 16px;
    font-weight: bold;
    color:#F5A623;
    text-align: center;
    display: inline-block;
    vertical-align: top;
    height: 80px;
    line-height: 20px;
    margin: 40px 15px 0 0;
  }

  .course-vip-name p{
    font-weight: bold;
  }

  .course-vip-circle {
    display: inline-block;
    margin: 54px 2px;
    border-radius: 50%;
  }

  .course-vip-circle:after {
    content: '';
    margin: 3px;
    display: table;
    width: 4px;
    height: 4px;
    background: #F5A623;
    border-radius: 50%;
  }

  .course-vip-circle-locked:after {
    background: #FFEDCD;
  }

  .nolock-test-check{
    position:fixed;
    width:100%;
    height:100%;
    top:0px;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 61, 90, .9);
    z-index:99999999;
    overflow: hidden;
  }

  .nolock-test-check p{
    width:354px;
    height:250px;
    padding:80px 30px 0px;
    text-align:center;
    font-size:14px;
    color:#4a4a4a;
    word-wrap:break-word;
    word-break:normal;
    background-color:#fff;
    border-radius:4px;
    position:absolute;
    top:0px;
    left:0px;
    right:0px;
    bottom:0px;
    margin:auto;
  }

  .nolock-test-check p i{
    position:absolute;
    width:110px;
    height:110px;
    padding:26px;
    border-radius:55px;
    top:0px;
    left:50%;
    margin-left:-55px;
    margin-top:-55px;
    background:url(../../../../static/images/learn/learn-vip-warn.png) #fff center center no-repeat;
    background-size:86%;
  }

  .goBackCore {
    position: absolute;
    left: 50%;
    margin-left: -84px;
    bottom: 30px;
    width: 168px;
    height: 40px;
    color: #fff;
    font-size: 18px;
    cursor: pointer;
    border-radius: 20px;
    line-height: 40px;
    text-align: center;
    background-color: #fd8469;
  }

  canvas {
    width: 95px;
    height: 95px;
    position: absolute;
    display: block;
    margin-left: -12px;
    margin-top: -17px;
    z-index: 1;
  }
</style>
