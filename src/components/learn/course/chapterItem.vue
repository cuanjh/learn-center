<template>
  <div class="course-list">
    <div class="course-item" v-for="(item, index) in curLevelChapters" :key="index" :id="item.code">
      <div class="current-learn-course-info"
          :class="{'current-learn-course-disabled': unlockCourses.indexOf(item.code) === -1}"
          @click="jumpToCourse(item.code)"  v-if="isShow ? currentChapterCode !== item.code : !isShow">
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
          <div class="current-learn-course-gold" v-show="(parseInt(isVip) === 1) ? false :  (buyChapters.indexOf(item.code) === -1)" :class="{'courseIsLock': (parseInt(isVip) === 1) ? false :  (buyChapters.indexOf(item.code) === -1)}">
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
      <!-- <transition name="fade" mode="out-in"> -->
        <div class="course-item-detail" v-if="isShow && currentChapterCode === item.code">
          <ul>
            <li class="course-brief">
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
                <div class="course-brief-shrink">
                  <i class="shrink" @click="switchShow()"></i>
                </div>
              </div>
            </li>
            <li class="course-core">
              <div class="course-core-name">
                <span>核心课程</span>
              </div>
              <div class="course-item-box" v-for="i in 5" :key="i">
                <a href="javascript:void(0)" @click="startCore('A0' + i, coreData[i]['isActive'])" :to="{ name: 'stage', params: {id: 'A0' + i}}">
                  <div class="current-course-item">
                    <div class="course-item-icon">
                      <canvas width="300" height="300" :id="item.code + '-canvas-A0' + i"></canvas>
                      <div :class="'core' + i"></div>
                      <i v-show="!coreData[i]['isCompleted'] && !coreData[i]['completedRate'] && !coreData[i]['isActive']" class="icon-course-lock"></i>
                    </div>
                    <p class="course-item-title" :class="{'course-item-title-locked': !coreData[i]['completedRate'] &&  !coreData[i]['isActive']}">核心{{i}}</p>
                    <p class="course-item-star" v-if="coreData[i]['isCompleted']">
                      <span class="course-yellow-star"><i v-for="index in coreData[i]['starNum']" :key="index"></i></span>
                      <span class="course-yellow-star courseIsLock"><i v-for="index in (5 - coreData[i]['starNum'])" :key="index"></i></span>
                    </p>
                    <p class="course-item-progress" v-else>
                      <span v-text="coreData[i]['completedRate']"></span>
                    </p>
                    <div v-show="coreData[i]['completedRate'] && coreData[i]['completedRate'] !== '1'" class="continue-learn-core">
                      <span>继续学习</span>
                    </div>
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
                  <div class="current-course-item">
                    <div class="course-item-icon">
                      <canvas width="300" height="300" :id="item.code + '-canvas-A7'"></canvas>
                      <div class="review-test"></div>
                      <i v-show="!coreData['isCoreCompleted']" class="icon-review-lock"></i>
                    </div>
                    <p class="course-item-title" :class="{'course-item-title-locked': !coreData['isCoreCompleted'] }">测试</p>
                     <p class="course-item-star" v-show="coreData['isCoreCompleted'] && testData['isTestCompleted']">
                      <span class="course-yellow-star"><i v-for="index in testData['starTestNum']" :key="index"></i></span>
                      <span class="course-yellow-star courseIsLock"><i v-for="index in (5 - testData['starTestNum'])" :key="index"></i></span>
                    </p>
                    <p class="course-item-progress" v-show="!testData['isTestCompleted']">
                      <span v-show="coreData['isCoreCompleted'] && !testData['isTestCompleted']" v-text="testData['completedTestRate']"></span>
                    </p>
                    <div v-show="testData['completedTestRate'] && testData['completedTestRate'] !== '1'" class="continue-learn-test">
                      <span>继续学习</span>
                    </div>
                  </div>
                </a>
                <div class="course-circle-box">
                  <div class="course-review-circle" :class="{'course-review-circle-locked': !testData['isTestCompleted'] }" v-for="index in 3" :key="index"></div>
                </div>
              </div>
            <div class="course-item-box" style="margin-left: -4px;">
              <a href="javascript:void(0)" @click="startHomework(coreData['isCoreCompleted'])">
                <div class="current-course-item">
                  <div class="course-item-icon">
                    <canvas width="300" height="300" :id="item.code + '-canvas-A8'"></canvas>
                    <div class="review-homework"></div>
                    <i v-show="!coreData['isCoreCompleted']" class="icon-review-lock"></i>
                  </div>
                  <p class="course-item-title" :class="{'course-item-title-locked': !coreData['isCoreCompleted'] }">作业</p>
                  <p class="course-item-star"  v-show="coreData['isCoreCompleted']  && homeworkData['isHomeworkCompleted']">
                    <span class="course-yellow-star"><i v-for="index in homeworkData['starHomeworkNum']" :key="index"></i></span>
                    <span class="course-yellow-star courseIsLock"><i v-for="index in (5 - homeworkData['starHomeworkNum'])" :key="index"></i></span>
                  </p>
                  <p class="course-item-progress" v-show="!homeworkData['isHomeworkCompleted']">
                    <span v-show="coreData['isCoreCompleted'] && !homeworkData['isHomeworkCompleted']" v-text="homeworkData['completedHomeworkRate']"></span>
                  </p>
                  <div v-show="homeworkData['completedHomeworkRate'] && homeworkData['completedHomeworkRate'] !== '1'" class="continue-learn-test">
                    <span>继续学习</span>
                  </div>
                </div>
              </a>
            </div>
          </li>

          <li class="course-vip">
              <div class="course-vip-name">
                <p>强化</p>
                <p>(会员专享)</p>
              </div>
              <div class="course-item-box" v-for="(vipitem, i) in vipItemList" :key="i">
                <a href="javascript:void(0);" @click="jumpVipPage(coreData['isCoreCompleted'] && vipData['A' + (i + 1)]['isActive'], 'A' + (i + 1))">
                  <div class="current-course-item">

                    <div class="course-item-icon">
                      <canvas width="300" height="300" :id="item.code + '-canvas-A' + (i + 1)"></canvas>
                      <div :class="'vip'+ (i + 1)"></div>
                      <i v-show="!(coreData['isCoreCompleted'] && vipData['A' + (i + 1)]['isActive'])" class="icon-vip-lock"></i>
                    </div>
                    <div v-show="vipData['A' + (i + 1)]['completedRate'] &&  vipData['A' + (i + 1)]['completedRate'] !== '1'" class="continue-learn-vip">
                      <span>继续学习</span>
                    </div>
                    <p class="course-item-title" :class="{'course-item-title-locked': !(coreData['isCoreCompleted'] && vipData['A' + (i + 1)]['isActive']) }">{{ $t("courseItem.vip."+vipitem) }}</p>
                    <p class="course-item-star" v-if="vipData['A' + (i + 1)]['isCompleted']">
                      <span class="course-yellow-star"><i v-for="index in vipData['A' + (i + 1)]['starNum']" :key="index"></i></span>
                      <span class="course-yellow-star courseIsLock"><i v-for="index in (5 - vipData['A' + (i + 1)]['starNum'])" :key="index"></i></span>
                    </p>
                    <p class="course-item-progress" v-else>
                      <span v-text="vipData['A' + (i + 1)]['completedRate']"></span>
                    </p>
                  </div>
                </a>

                 <div class="course-circle-box" v-if="i<(vipItemList.length-1)">
                    <div class="course-vip-circle" :class="{'course-vip-circle-locked': !vipData['A' + (i + 1)]['completedRate'] }" v-for="index in 3" :key="index"></div>
                  </div>
              </div>
            </li>
          </ul>
        </div>
      <!-- </transition> -->
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
import { mapState, mapMutations } from 'vuex'
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
      isShow: true,
      isHistory: false,
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
    this.$on('changeIsHistory', (flag) => {
      this.isHistory = flag
    })
    this.$on('saveHistoryCourseData', () => {
      let obj = {}
      obj['core'] = this.coreData
      obj['test'] = this.testData
      obj['homework'] = this.homeworkData
      obj['vip'] = this.vipData
      let hcr = this.historyCourseRecord
      hcr[this.currentChapterCode] = obj
      this.updateHistoryCourseRecord(hcr)
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
      'homeworkContent': state => state.course.homeworkContent,
      historyCourseRecord: state => state.course.historyCourseRecord
    }),
    coreData () {
      var that = this
      console.log(that.curLevelChapters)
      let retObj = {}
      // 核心课程
      if (!that.isHistory) {
        let curChapterCode = that.currentChapterCode
        let corePartInfos = that.$store.state.course.courseBaseInfo.corePartInfos
        let coreParts = corePartInfos.filter((item) => curChapterCode.indexOf(item.chapter_code) > 0)

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
              if (i > -1) {
                coreForms.push(i)
              }
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
      } else {
        retObj = that.historyCourseRecord[that.currentChapterCode]['core']
      }

      this.$emit('draw', 'core', retObj)
      return retObj
    },
    // 强化 会员专享
    vipData () {
      let that = this
      let retObj = {}
      if (!that.isHistory) {
        let srcVipArray = []
        let vipFormArray = []
        for (let i = 1; i <= 6; i++) {
          let obj = {}
          obj['isCompleted'] = 0
          obj['starNum'] = 0
          obj['completedRate'] = ''
          obj['imgStyle'] = ''

          if (Object.keys(that.$store.state.course.curChapterContent).length > 0) {
            let vipForms = []
            Object.keys(that.$store.state.course.curChapterProgress).filter((item) => {
              return item.indexOf('A' + i) > -1
            }).map((el) => {
              return that.curChapterProgress[el]
            }).forEach((i) => {
              if (i > -1) {
                vipForms.push(i)
              }
            })
            srcVipArray[i] = vipForms
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
          if (parseInt(this.isVip) !== 1) {
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
      } else {
        retObj = that.historyCourseRecord[that.currentChapterCode]['vip']
      }
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
      if (!that.isHistory) {
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
      } else {
        retObj = that.historyCourseRecord[that.currentChapterCode]['test']
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
      if (!that.isHistory) {
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
      } else {
        retObj = that.historyCourseRecord[that.currentChapterCode]['homework']
      }
      if (!this.coreData['isCoreCompleted']) {
        retObj['completedHomeworkRate'] = ''
      }
      this.$emit('draw', 'homework', retObj)
      return retObj
    },
    isVip () {
      if (!this.userInfo.member_info) {
        return
      }
      return this.userInfo.member_info['member_type']
    }
  },
  methods: {
    ...mapMutations({
      updateHistoryCourseRecord: 'course/updateHistoryCourseRecord'
    }),
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
      if (this.buyChapters.indexOf(chapterCode) === -1 && parseInt(this.isVip) !== 1) {
        this.$refs['buyChapter'].$emit('buyCoin', chapterCode)
        return false
      }

      if (chapterCode === this.currentChapterCode) {
        if (this.isShow) {
          this.isShow = !this.isShow
        } else {
          this.isShow = !this.isShow
          let top = $('#' + chapterCode).offset().top - 126
          $('body,html').animate({ scrollTop: top }, 300, 'linear')
        }

        return false
      } else {
        let time = 0
        if (this.isShow) {
          time = 300
        }
        this.isShow = false
        setTimeout(() => {
          let top = $('#' + chapterCode).offset().top - 126
          $('body,html').animate({ scrollTop: top }, 300, 'linear')
        }, time)

        setTimeout(() => {
          this.$emit('loadChapterInfo', chapterCode)
        }, 300)
      }
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
      if (parseInt(this.isVip) !== 1) {
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
      if (rate === 1) {
        return
      }
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
      this.isShow = false
    },
    goToRegister () {
      let langCode = this.userInfo['current_course_code'].split('-')[0]
      this.$router.push({ path: '/auth/register/' + langCode })
    }
  }
}
</script>

<style scoped>
  .course-list {
    margin-top: 60px;
    width: 890px;
  }

  .course-item {
    background-color:#fff;
    margin-top: 14px;
    padding: 14px;
    border-radius: 5px;
  }

  .current-learn-course-info{
    cursor: pointer;
    overflow:hidden;
    /* -webkit-transition: all .3s ease-in-out;
    -moz-transition: all .3s ease-in-out;
    -ms-transition: all .3s ease-in-out;
    -o-transition: all .3s ease-in-out;
    transition: all .3s ease-in-out;
    border-radius: 5px 5px 0 0; */
  }
  /* .current-learn-course-info:hover {
    box-shadow: 0 0 26px 0 rgba(0, 0, 0, 0.2);
    -webkit-transition: all .3s ease-in-out;
    -moz-transition: all .3s ease-in-out;
    -ms-transition: all .3s ease-in-out;
    -o-transition: all .3s ease-in-out;
    transition: all .3s ease-in-out;
  } */

  .current-learn-course-disabled{
    cursor: not-allowed;
  }

  .current-learn-course-flag{
    float:left;
    width:168px;
    height:80px;
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
    line-height: 80px;
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

  /* .fade-enter-active, .fade-leave-active {
    transition: all 1s linear;
  }

  .fade-enter, .fade-leave-to {
    transform: translateY(-10px);
    opacity: 0;
  } */

  .course-item-detail ul > li:not(:first-child) {
    padding: 24px 24px 0;
  }

  .show-course-item{
    height: 510px;
    transition: height .3s ease-out;
  }

  .hide-course-item {
    height: 0;
    transition: height .3s ease-out;
  }

  /* @keyframes translateBigItem {
    0%{
      transform: translateY(-340px);
      opacity: 1;
    }
    100%{
      transform: translateY(0);
      opacity: 1;
    }
  } */

  @keyframes heightSpread {
    0%{
      height: 50px;
      opacity: 0;
    }
    10%{
      height: 100px;
      opacity: 0.1;
    }
    20%{
      height: 150px;
      opacity: 0.2;
    }
    30%{
      height: 200px;
      opacity: 0.3;
    }
    40%{
      height: 250px;
      opacity: 0.4;
    }
    50%{
      height: 300px;
      opacity: 0.5;
    }
    60%{
      height: 350px;
      opacity: 0.6;
    }
    70%{
      height: 400px;
      opacity: 1;
    }
    80%{
      height: 450px;
      opacity: 1;
    }
    90%{
      height: 500px;
      opacity: 1;
    }
    100%{
      height: 533px;
      opacity: 1;
    }
  }

  .course-brief{
    position: relative;
    border-radius: 2.73px;
    height: 300px;
  }

  .course-brief img{
    position: absolute;
    height: 100%;
    width: 100%;
    object-fit: cover;
    border-radius: 5px;
  }

  .course-brief-shade{
    position: relative;
    height: 100%;
    width: 100%;
    background: rgba(0,0,0,0.40);
    border-radius: 5px;
    z-index: 2;
  }

  .course-brief-title{
    font-size: 30px;
    color: #ffffff;
    line-height: 48px;
    font-weight: 500;
    padding-top: 54px;
    padding-left: 36px;
  }

  .course-brief-describe{
    font-size: 18px;
    color: #ffffff;
    line-height: 24px;
    font-weight: 500;
    margin: 2px 0 0 36px;
  }

  .course-brief-progress-title{
    font-size: 20px;
    color: #ffffff;
    line-height: 24px;
    font-weight: bold;
    margin: 62px 0 0 36px;
  }

  .course-brief-progress-area {
    margin: 10px 0 0 36px;
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

  .course-brief-shrink {
    background: red;
    margin-top: 30px;
  }

  .course-brief-shrink .shrink {
    width: 20px;
    height: 20px;
    float: right;
    background-image: url('../../../../static/images/course/course-shrink.svg');
    background-repeat: no-repeat;
    object-fit: cover;
    margin-right: 13px;
    cursor: pointer;
  }

  .course-core{
    width: 100%;
    border-bottom: 1px solid rgba(233,234,235,0.50);
    padding: 15px 0 30px;
  }

  .course-core-name{
    font-size: 15px;
    font-weight: bold;
    color:#2a9fe4;
    display: inline-block;
    position: relative;
    margin-left: 6px;
    margin-top: 15px;
    margin-right: 19px;
    vertical-align: top;
  }

  .course-circle-box{
    display: none;
    position: relative;
    margin-top: 4px;
  }

  .course-core-circle {
    display: inline-block;
    margin: 54px 1px;
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
    margin-right: 40px;
    width: 70px;
    height: 111px;
    text-align: center;
  }

  .current-course-item {
    position: relative;
    display: inline-block;
    text-align: center;
  }

  .course-item-star{
    display: inline-flex;
  }
  .course-item-star span{
    display: inline-block;
  }

  .course-item-progress {
    display: none;
    height: 18px;
    width: 75px;
    font-size: 12px;
    color: #4A4A4A;
    margin-bottom: 7px;
  }

  .course-item-icon{
    width: 56px;
    height: 56px;
    margin: 0 auto;
    /* position: absolute; */
  }
  .course-item-icon div{
    cursor: pointer;
    width: 56px;
    height: 56px;
    position: relative;
    border-radius: 50%;
    background-repeat: no-repeat;
    background-size: cover;
  }

  .course-item-icon img[src=""]{
    opacity: 0;
  }

  .course-item-icon .core1{
    background-image: url('../../../../static/images/course/course-core1.svg');
  }

  .course-item-icon .core2{
    background-image: url('../../../../static/images/course/course-core2.svg');
  }

  .course-item-icon .core3{
    background-image: url('../../../../static/images/course/course-core3.svg');
  }

  .course-item-icon .core4{
    background-image: url('../../../../static/images/course/course-core4.svg');
  }

  .course-item-icon .core5{
    background-image: url('../../../../static/images/course/course-core5.svg');
  }

  .course-item-icon .review-test {
    background-image: url('../../../../static/images/course/course-review-test.svg')
  }

  .course-item-icon .review-homework {
    background-image: url('../../../../static/images/course/course-review-homework.svg')
  }

  .course-item-icon .vip1 {
    background-image: url('../../../../static/images/course/course-vip-listen.svg')
  }
  .course-item-icon .vip2 {
    background-image: url('../../../../static/images/course/course-vip-oral.svg')
  }
  .course-item-icon .vip3 {
    background-image: url('../../../../static/images/course/course-vip-reading.svg')
  }
  .course-item-icon .vip4 {
    background-image: url('../../../../static/images/course/course-vip-writing.svg')
  }
  .course-item-icon .vip5 {
    background-image: url('../../../../static/images/course/course-vip-grammar.svg')
  }
  .course-item-icon .vip6 {
    background-image: url('../../../../static/images/course/course-vip-speaking.svg')
  }

  .course-item-icon .core-canvas {
    width: 64px;
    height: 64px;
    position: absolute;
    z-index: -1;
  }

  .icon-course-lock {
    background-image: url('../../../../static/images/course/icon-course-lock.svg');
    background-repeat: no-repeat;
    background-size: cover;
    height: 25px;
    width: 25px;
    display: inline-block;
    margin-top: -21px;
    margin-left: 39px;
    position: relative;
  }

  .icon-review-lock {
    background-image: url('../../../../static/images/course/icon-review-lock.svg');
    background-repeat: no-repeat;
    background-size: cover;
    height: 25px;
    width: 25px;
    display: inline-block;
    margin-top: -21px;
    margin-left: 39px;
    position: relative;
  }

  .icon-vip-lock {
    background-image: url('../../../../static/images/course/icon-vip-lock.svg');
    background-repeat: no-repeat;
    background-size: cover;
    height: 25px;
    width: 25px;
    display: inline-block;
    margin-top: -21px;
    margin-left: 39px;
    position: relative;
  }
  .course-item-title{
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
    margin:0 2px;
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
    margin-right: 13px;
    margin-top: 15px;
    vertical-align: top;
  }

  .course-review-circle {
    display: inline-block;
    position: relative;
    margin: 54px 1px;
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
    margin: 10px 12px 0 0;
  }

  .course-vip-name p{
    font-weight: bold;
  }

  .course-vip-circle {
    display: inline-block;
    margin: 54px 1px;
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
    width: 84px;
    height: 84px;
    position: absolute;
    display: block;
    margin-left: -11px;
    margin-top: -16px;
    z-index: 1;
  }

  .continue-learn-vip {
    display: none;
    width: 84px;
    height: 34px;
    background-image: url('../../../../static/images/course/continue-learn-vip.png');
    background-repeat: no-repeat;
    background-size: cover;
    position:absolute;
    left: 52px;
    top: 13px;
  }

  .continue-learn-vip span{
    color: #fff;
    font-size: 12px;
    font-weight: bold;
  }

  .continue-learn-test {
    display: none;
    width: 84px;
    height: 34px;
    background-image: url('../../../../static/images/course/continue-learn-test.png');
    background-repeat: no-repeat;
    background-size: cover;
    position:absolute;
    left: 52px;
    top: 13px;
  }

  .continue-learn-test span{
    color: #fff;
    font-size: 12px;
    font-weight: bold;
  }

  .continue-learn-core {
    display: none;
    width: 84px;
    height: 34px;
    background-image: url('../../../../static/images/course/continue-learn-core.png');
    background-repeat: no-repeat;
    background-size: cover;
    position:absolute;
    left: 52px;
    top: 13px;
  }

  .continue-learn-core span{
    color: #fff;
    font-size: 12px;
    font-weight: bold;
  }

  @media screen and (max-width: 1024px) {
    .course-list {
      width: 715px;
      /*margin-left: 242px; */
    }

    .course-item-box {
      margin-right: 21px;
    }

    .course-brief {
      height: 260px;
    }

    .course-brief-title {
      padding-top: 20px;
    }

    .course-brief-progress-title {
      margin-top: 55px;
    }
  }
</style>
