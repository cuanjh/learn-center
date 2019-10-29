<template>
  <div class="course-container">
    <div class="left-side" @mouseleave="navCourse = false">
      <div class="lang-overview">
        <dl>
          <dt><img :src="flag | urlFix('imageView2/0/w/200/h/200/format/jpg')"></dt>
          <dd>
            <div class="triangle">
              <span v-text='name'></span>
              <p>
                <i :class="{active:navCourse}" @mouseenter="navCourse = true"></i>
                <learn-course-list class="mycourse-wrap" :subscribeLangCourses="subscribeLangCourses"  v-show="navCourse"></learn-course-list>
              </p>
            </div>
            <p class="course-old"></p>
            <p class="vip" v-if="isVip === 1"><span><i></i>{{ vipEndDate }}到期</span><router-link :to="{path: '/app/vip-home'}" target="_blank">会员续费</router-link></p>
            <p class="no-vip" v-else><span><i></i>你还不是会员</span><router-link :to="{path: '/app/vip-home'}" target="_blank">成为会员</router-link></p>
          </dd>
        </dl>
        <ul>
          <li class="course-learn-test" @click="jumpToPage('/learn/testing')">
            <p></p>
            <p>学习环境测试</p>
          </li>
        </ul>
      </div>
      <router-view></router-view>
    </div>
    <div class='learn-course-nav'>
      <ul>
        <li v-for='level in catalogs' :key="level.code" :style="{'width': levelWidth}">
          <p class='learn-course-nav-blue'
              v-bind:class="{'learn-course-nav-active': curLevelCode === level.code}"
              v-on:click='selLevel(level)'>{{ level.levelNameDes[lang] }}</p>
        </li>
      </ul>
    </div>
    <div class="course-content">
      <transition name="fade" mode="out-in">
      <div class="course-list" v-show="isShowList">
        <div class="course-item"
          v-for="(item, index) in curLevelChapters"
          :key="'item' + index"
          :id="item.code">
          <div class="current-learn-course-info"
            @click="jumpToCourse(item.code)"
            v-if="isShow ? curChapterCode !== item.code : !isShow">
            <div class="current-learn-course-flag">
              <img :src="item.flag | urlFix('imageView2/0/w/168/h/80/format/jpg')">
              <!-- <div class="fix-ie-bg" v-show="unlockCourses.indexOf(item.code) === -1"></div> -->
            </div>
            <div class="current-learn-course-word-info">
              <div class="current-learn-course-title">
                <span>课程</span>
                <span>{{ index + 1 }}</span>
              </div>
              <div class="current-learn-course-describe">{{ item['title']['zh-cn'] }}</div>
            </div>
          </div>
          <transition name="expand" mode="out-in">
            <div class="course-item-detail" v-show="isShow && curChapterCode == item.code">
              <div class="course-brief" @click="switchShow()">
                <img :src="item.image_bg2 | urlFix('imageView2/0/w/704/h/260/format/jpg')" alt="">
                <div class="course-brief-shade">
                  <div class="course-brief-title">
                    <span>课程</span>
                    <span>{{ index + 1 }}</span>
                  </div>
                  <div class="course-brief-describe">{{ item['des']['zh-cn'] }}</div>
                  <div class="course-brief-progress-title">学习进度：</div>
                  <div class="course-brief-progress-area">
                    <div class="course-brief-progress-bg">
                      <div class="course-brief-progress" :style="{width: curChapterData['completeRate'] + '%'}"></div>
                    </div>
                    <div class="course-brief-progress-val">
                      {{ curChapterData['completeRate'] + '%'}}
                    </div>
                  </div>
                  <div class="course-brief-shrink">
                    <i class="shrink" @click="switchShow()"></i>
                  </div>
                </div>
              </div>
              <div class="tab-container">
                <div class="tab-nav">
                  <ul>
                    <li
                      v-for="(name, index) in tabNav"
                      :key="index" :class="index == active ? 'active' : ''"
                      @click="changeTab(index)">
                      <span>{{name}}</span>
                      <div class="line"></div>
                    </li>
                  </ul>
                </div>
                <div class="tab-content">
                  <div class="tab-content-kid" v-show="active == 0">
                    <ul>
                      <li  @click="goKidStage(item, 'draw')">
                        <div class="icon">
                          <i></i>
                        </div>
                        <div class="title">
                          <span>绘本阅读</span>
                        </div>
                      </li>
                      <li @click="goKidStage(item, 'word')">
                        <div class="icon"><i></i></div>
                        <div class="title"><span >核心单词</span></div>
                      </li>
                      <li @click="goKidSongs(item)">
                        <div class="icon"><i></i></div>
                        <div class="title"><span>儿歌</span></div>
                      </li>
                    </ul>
                  </div>
                  <div class="tab-content-pro" v-show="active == 1">
                    <div class="course-core">
                      <div class="course-core-name">
                        <span>核心课程</span>
                      </div>
                      <div class="course-item-box" v-for="core in curChapterData.core" :key="core.part_num">
                        <a href="javascript:void(0)" @click="startCore(item.code + '-A0' + core.part_num, core.isUnlock)" :to="{ name: 'stage', params: {id: 'A0' + core.part_num}}">
                          <div class="current-course-item">
                            <div class="course-item-icon">
                              <canvas width="300" height="300" :id="item.code + '-canvas-A0' + core.part_num"></canvas>
                              <div :class="'core' + core.part_num"></div>
                              <i class="icon-course-lock" v-show="!core.isUnlock"></i>
                            </div>
                            <p class="course-item-title" :class="{'course-item-title-locked': !core.isUnlock }">核心{{core.part_num}}</p>
                            <p class="course-item-star" v-show="core.isCompleted">
                              <span class="course-yellow-star"><i v-for="index in core.star" :key="index"></i></span>
                              <span class="course-yellow-star courseIsLock"><i v-for="index in (5 - core.star)" :key="index"></i></span>
                            </p>
                            <p class="course-item-progress">
                              <span></span>
                            </p>
                            <div class="continue-learn-core">
                              <span>继续学习</span>
                            </div>
                          </div>
                        </a>
                        <div class="course-circle-box" v-if="core.part_num<5">
                          <div class="course-core-circle" v-for="index in 3" :key="index"></div>
                        </div>
                      </div>
                    </div>
                    <div class="course-review">
                      <div class="course-review-name">
                        <span>测试</span>
                      </div>
                      <div class="course-item-box">
                        <a href="javascript:void(0);" @click="startTest(curChapterData.coreComplete)">
                          <div class="current-course-item">
                            <div class="course-item-icon">
                              <canvas width="300" height="300" :id="item.code + '-canvas-A7'"></canvas>
                              <div class="review-test"></div>
                              <i class="icon-review-lock" v-show="!((hasPurchased || isVip == 1) && curChapterData['coreComplete'])"></i>
                            </div>
                            <p class="course-item-title" :class="{'course-item-title-locked': !((hasPurchased || isVip == 1) && curChapterData['coreComplete']) }">测试</p>
                            <p class="course-item-star" v-show="testData.isTestCompleted">
                              <span class="course-yellow-star"><i v-for="index in testData.star" :key="index"></i></span>
                              <span class="course-yellow-star courseIsLock"><i v-for="index in testData.grayStar" :key="index"></i></span>
                            </p>
                            <p class="course-item-progress" v-show="testData['isTestCompleted']">
                              <span v-show="curChapterData.coreComplete && !testData['isTestCompleted']" v-text="testData['completedTestRate']"></span>
                            </p>
                            <div v-show="testData['completedTestRate'] && testData['completedTestRate'] !== 1" class="continue-learn-test">
                              <span>继续学习</span>
                            </div>
                          </div>
                        </a>
                        <div class="course-circle-box">
                          <div class="course-review-circle" v-for="index in 3" :key="index"></div>
                        </div>
                      </div>
                      <div class="course-item-box" style="margin-left: -4px;">
                        <a href="javascript:void(0)" @click="startHomework(curChapterData.coreComplete)">
                          <div class="current-course-item">
                            <div class="course-item-icon">
                              <canvas width="300" height="300" :id="item.code + '-canvas-A8'"></canvas>
                              <div class="review-homework"></div>
                              <i class="icon-review-lock" v-show="!curChapterData.coreComplete"></i>
                            </div>
                            <p class="course-item-title" :class="{'course-item-title-locked': !curChapterData.coreComplete }">作业</p>
                            <p class="course-item-star" v-show="homeworkData['isComplete']">
                              <span class="course-yellow-star"><i v-for="index in homeworkData['star']" :key="index"></i></span>
                              <span class="course-yellow-star courseIsLock"><i v-for="index in homeworkData['grayStar']" :key="index"></i></span>
                            </p>
                            <p class="course-item-progress" v-show="homeworkData['isComplete']">
                              <span v-show="curChapterData.homework && !homeworkData['isComplete']" v-text="homeworkData['completedHomeworkRate']"></span>
                            </p>
                            <div class="continue-learn-test" v-show="homeworkData['completedHomeworkRate'] && homeworkData['completedHomeworkRate'] !== '1'">
                              <span>继续学习</span>
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                    <div class="course-vip">
                      <div class="course-vip-name">
                        <p>强化</p>
                        <!-- <p>(会员专享)</p> -->
                      </div>
                      <div class="course-item-box" v-for="(vip, i) in vipData" :key="i">
                        <a href="javascript:void(0);" @click="jumpVipPage(curChapterData['coreComplete'], item.code + '-A' + (i + 1))">
                          <div class="current-course-item">
                            <div class="course-item-icon">
                              <canvas width="300" height="300" :id="item.code + '-canvas-A' + (i + 1)"></canvas>
                              <div :class="'vip'+ (i + 1)"></div>
                              <i class="icon-vip-lock" v-show="!((hasPurchased || isVip == 1) && curChapterData['coreComplete'])"></i>
                            </div>
                            <div class="continue-learn-vip">
                              <span>继续学习</span>
                            </div>
                            <p class="course-item-title" :class="{'course-item-title-locked': !((hasPurchased || isVip == 1) && curChapterData['coreComplete']) }">{{ $t("courseItem.vip."+vipItemList[i]) }}</p>
                            <p class="course-item-star" v-show="vip['isCompleted']">
                              <span class="course-yellow-star"><i v-for="index in vip['starNum']" :key="index"></i></span>
                              <span class="course-yellow-star courseIsLock"><i v-for="index in (5 - vip['starNum'])" :key="index"></i></span>
                            </p>
                            <p class="course-item-progress" v-show="!vip['isCompleted']">
                              <span v-text="vip['completedRate']"></span>
                            </p>
                          </div>
                        </a>
                        <div class="course-circle-box" v-if="i<(vipItemList.length-1)">
                          <div class="course-vip-circle" v-for="index in 3" :key="index"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
      </transition>
    </div>
    <transition name="fade" mode="out-in">
      <kid-songs v-show="showSongs" @closeModal="closeModal"/>
    </transition>
  </div>
</template>

<script>
import $ from 'jquery'
import { mapMutations, mapActions } from 'vuex'
import moment from 'moment'
import Bus from '../../../bus'
import LearnCourseList from '../../common/learnCourseList.vue'
import cookie from '../../../tool/cookie'
import kidSongs from './kidSongs.vue'

export default {
  name: 'leftSide',
  data () {
    return {
      showSongs: false,
      isVip: 0, // 是否是VIP
      curChapterData: {
        core: [],
        completeRate: '0'
      },
      coreData: [],
      testData: {},
      homeworkData: {},
      vipData: [],
      unlockCourses: '',
      trigangleShow: false,
      navCourse: false,
      flag: '',
      name: '',
      changeCourseCode: '',
      curLevelCode: '',
      curLevelChapters: [],
      curChapterCode: '',
      curKidChapterCompleteRate: 0,
      catalogs: [],
      assetsServer: '',
      learnCourse: [],
      subscribeLangCourses: [],
      tabNav: ['学习', '拓展'],
      vipItemList: ['listen', 'oral', 'reading', 'writing', 'grammar', 'speaking'],
      active: -1,
      isShow: true,
      isShowList: true,
      buyChapters: '',
      hasPurchased: false
    }
  },
  components: {
    LearnCourseList,
    kidSongs
  },
  // beforeRouteUpdate (to, from, next) {
  //   console.log('监听路由变化：', this.$route.path)
  //   if (to.name === 'kidCourseList') {
  //     next()
  //     this.initKid()
  //   }
  // },
  created () {
    // this.$on('draw', this.drawProgress)
    this.$on('changeIsShow', (flag) => {
      this.isShow = flag
    })
    Bus.$on('changeKidProChapter', () => {
      this.initProData()
    })
  },
  mounted () {
    let courseCode = this.$route.params.courseCode
    this.getOneCourseSub({course_code: courseCode}).then(res => {
      console.log('courseSubInfo', res)
      if (res.subInfo.course_type === 3) {
        localStorage.setItem('isKid', '1')
      } else if (res.subInfo.course_type === 0) {
        localStorage.setItem('isKid', '0')
      }
    })
    this.getUserInfo().then(res => {
      this.userInfo = res.info
      this.isVip = res.info.member_info.member_type
    })
    this.active = -1
    let kidTabActive = localStorage.getItem('kidTabActive')
    if (kidTabActive === '0') {
      this.active = parseInt(kidTabActive)
    }
    this.initData()
  },
  computed: {
    // 统计vip的时间
    vipEndDate () {
      if (!this.userInfo || !this.userInfo.member_info) {
        return
      }
      let endTime = this.userInfo.member_info.end_time * 1000
      return moment(endTime).format('YYYY.MM.DD')
    },
    levelWidth () {
      let width = Math.floor(100 / parseInt(this.levelNum)) + '%'
      return width
    },
    lang () {
      return this.$i18n.locale
    }
  },
  watch: {
    $route (to, from) {
      if (to.name === from.name) {
        this.changeCourseCode = to.params.courseCode
      }
    },
    changeCourseCode () {
      this.initKid()
    }
  },
  methods: {
    ...mapActions({
      getLearnInfoV5: 'course/getLearnInfoV5',
      setKidCurrentChapter: 'setKidCurrentChapter',
      getCatalog: 'getCatalog',
      getMoreLearnCourses: 'getMoreLearnCourses',
      getSubCourses: 'getSubCourses', // 新的课程列表接口
      getUnlockChapter: 'course/getUnlockChapter',
      getCourseContent: 'course/getCourseContent',
      getRecord: 'course/getRecord',
      getProgress: 'getProgress',
      getOneCourseSub: 'getOneCourseSub',
      getCourseTestRanking: 'getCourseTestRanking',
      getHomeworkContent: 'getHomeworkContent',
      getChapterContent: 'getChapterContent'
    }),
    ...mapActions([
      'getUserInfo',
      'getLearnInfoV5',
      'getKidCatalog',
      'getMoreLearnCourses',
      'setChapterUnlock',
      'getSubCourses'// 新的课程列表接口
    ]),
    ...mapMutations({
      updateCurCourseCode: 'course/updateCurCourseCode',
      updateUnlockCourseList: 'course/updateUnlockCourseList'
    }),
    async initKid () {
      localStorage.removeItem('kidTabActive')
      this.active = 0
      let courseCode = this.$route.params.courseCode
      // 1 获取该课程的学习信息
      let res1 = await this.getLearnInfoV5({course_code: courseCode})
      console.log(res1)
      localStorage.setItem('courseBaseInfo', JSON.stringify(res1.info.courseBaseInfo))
      this.flag = res1.info.courseBaseInfo.flag
      this.name = res1.info.courseBaseInfo.name + 'Mini'
      this.hasPurchased = res1.info.purchaseState.has_purchased
      this.curChapterCode = res1.info.learnConfig.current_chapter_code
      this.curLevelCode = this.curChapterCode.split('-').slice(0, 3).join('-')
      // this.setChapterUnlock({chapter_code: this.curChapterCode, module: 'core'})
      // 2.设置当前学习的课程
      this.setKidCurrentChapter({chapter_code: this.curChapterCode})
      localStorage.setItem('currentChapterCode', this.curChapterCode)

      // 2.2 获取kid目录结构
      let res22 = await this.getCatalog({course_code: courseCode})
      console.log(res22)
      this.assetsServer = res22.assets_server
      this.catalogs = res22.catalogInfo.catalogs
      let curLevel = this.catalogs.find(item => {
        return item.code === this.curLevelCode
      })
      this.curLevelChapters = curLevel.chapters
      localStorage.setItem('curLevelChapters', JSON.stringify(this.curLevelChapters))
      console.log('curLevelChapters', this.curLevelChapters)
      this.initProData()
    },
    async initData () {
      let courseCode = this.$route.params.courseCode
      // 1 获取该课程的学习信息
      let res1 = await this.getLearnInfoV5({course_code: courseCode})
      console.log(res1)
      localStorage.setItem('courseBaseInfo', JSON.stringify(res1.info.courseBaseInfo))
      this.flag = res1.info.courseBaseInfo.flag
      this.name = res1.info.courseBaseInfo.name + 'Mini'
      this.hasPurchased = res1.info.purchaseState.has_purchased
      this.curChapterCode = res1.info.learnConfig.current_chapter_code
      this.curLevelCode = this.curChapterCode.split('-').slice(0, 3).join('-')
      // this.setChapterUnlock({chapter_code: this.curChapterCode, module: 'core'})
      // 2.设置当前学习的课程
      this.setKidCurrentChapter({chapter_code: this.curChapterCode})
      localStorage.setItem('currentChapterCode', this.curChapterCode)

      // 2.2 获取kid目录结构
      let res22 = await this.getCatalog({course_code: courseCode})
      console.log(res22)
      this.assetsServer = res22.assets_server
      this.catalogs = res22.catalogInfo.catalogs
      let curLevel = this.catalogs.find(item => {
        return item.code === this.curLevelCode
      })
      this.curLevelChapters = curLevel.chapters
      localStorage.setItem('curLevelChapters', JSON.stringify(this.curLevelChapters))
      console.log('curLevelChapters', this.curLevelChapters)
      // 3. 获取订阅课程
      let res3 = await this.getSubCourses()
      console.log('新的课程列表返回', res3)
      if (res3.success) {
        let learnCourses = res3.courses
        learnCourses.forEach(item => {
          if (item.course_type === 0 || item.course_type === 3) {
            this.subscribeLangCourses.push(item)
          }
        })
        // 按kid课程在前，pro课程在后，每个分组按后订阅的在前
        this.subscribeLangCourses = this.subscribeLangCourses.sort((a, b) => {
          return b.course_type - a.course_type
        })
        console.log('订阅的官方课程', this.subscribeLangCourses)
      }
      this.initProData()
    },
    jumpToPage (path) {
      this.$router.push({ path: path })
    },
    // 点击订阅的课程跳转到点击的课程开始学习
    changeCourseCodes (courseCode) {
      localStorage.setItem('lastCourseCode', courseCode)
      this.updateCurCourseCode(courseCode)
      Bus.$emit('changeCourseCode', courseCode)
    },
    changeTab (index) {
      // let courseCode = this.$route.params.courseCode
      // let unlockChapters = await this.getUnlockChapter(courseCode)
      // this.unlockCourses = Object.keys(unlockChapters.unlock).join(',')
      // this.buyChapters = ''
      // Object.keys(unlockChapters.unlock).forEach(key => {
      //   let item = unlockChapters.unlock[key]
      //   if (item.Has_purchased) {
      //     this.buyChapters += key + ','
      //   }
      // })
      // console.log('curChapterCode', this.curChapterCode)
      // let arr = this.curChapterCode.split('-')
      // let num = (parseInt(arr[3].toLowerCase().replace('unit', '')) - 1) * 6 + parseInt(arr[4].toLowerCase().replace('chapter', ''))
      // console.log(num)
      // if (num > 1 && parseInt(this.isVip) !== 1 && this.buyChapters.indexOf(this.curChapterCode) === -1) {
      //   Bus.$emit('showBuyChapterPanel', this.curChapterCode)
      //   return false
      // }
      if (index === 1) {
        this.drawProgress('core', this.curChapterData['core'])
        this.drawProgress('test', this.testData)
        this.drawProgress('homework', this.homeworkData)
        this.drawProgress('vip', this.vipData)
      }
      this.active = index
      localStorage.setItem('kidTabActive', this.active)
    },
    async initProData () {
      this.isShow = true
      let courseCode = this.$route.params.courseCode
      // 4. pro课程数据处理
      let unlockChapters = await this.getUnlockChapter(courseCode)
      this.updateUnlockCourseList(unlockChapters)
      this.unlockCourses = Object.keys(unlockChapters.unlock).join(',')
      this.buyChapters = ''
      Object.keys(unlockChapters.unlock).forEach(key => {
        let item = unlockChapters.unlock[key]
        if (item.Has_purchased) {
          this.buyChapters += key + ','
        }
      })
      console.log('unlockChapters ==> ', unlockChapters)
      let curUnlockChapter = unlockChapters.unlock[unlockChapters.current_chapter_code]
      console.log('curUnlockChapter ==> ', curUnlockChapter)
      if (curUnlockChapter) {
        this.updateUnlockCourseList(unlockChapters)
        this.curChapterData['coreComplete'] = curUnlockChapter['A05']
        this.curChapterData['homework'] = curUnlockChapter['Homework']
        this.curChapterData['homeworkComplete'] = curUnlockChapter['Homework_complete']
        this.curChapterData['improvement'] = curUnlockChapter['Improvement']
        this.curChapterData['completeRate'] = this.calCompleteRate(curUnlockChapter)
      } else {
        this.curChapterData['coreComplete'] = false
        this.curChapterData['homework'] = false
        this.curChapterData['homeworkComplete'] = false
        this.curChapterData['improvement'] = false
        this.curChapterData['completeRate'] = 0
        this.setChapterUnlock({chapter_code: this.curChapterCode})
      }

      let curChapter = this.curLevelChapters.find(item => {
        return item.code === this.curChapterCode
      })
      console.log(curChapter)

      // 核心课程
      let corePartInfos = JSON.parse(localStorage.getItem('corePartInfos'))
      console.log(corePartInfos)
      let curChapterCoreParts = corePartInfos.find(item => {
        return item.chapter_code === this.curChapterCode.split('-').slice(2, 5).join('-')
      }).parts
      console.log(curChapterCoreParts)

      await this.getRecord(this.curChapterCode + '-A0')

      let progressObj = await this.getProgress({chapter_code: this.curChapterCode})
      console.log('progressObj', progressObj)
      let forms = {}
      if (progressObj.state) {
        forms = progressObj.record.forms
      }
      console.log(Object.keys(forms))
      let formsKey = Object.keys(forms)
      this.curChapterData['core'] = []
      for (let i = 0; i < curChapterCoreParts.length; i++) {
        let item = curChapterCoreParts[i]
        let isUnlock = false
        if (curUnlockChapter) {
          if (item.part_num === 1 && curUnlockChapter.Core) {
            isUnlock = true
          }
          if (item.part_num > 1 && curUnlockChapter['A0' + (item.part_num - 1)]) {
            isUnlock = true
          }
        }
        if (this.isVip && item.part_num === 1 && this.curChapterCode.toLowerCase().indexOf('unit1-chapter1') > -1) {
          isUnlock = true
        }
        let formLength = item.end_form - item.start_form + 1
        let formNum = 0
        let correctFormNum = 0
        item.slides.forEach(slide => {
          let arr = formsKey.filter(form => {
            return form.indexOf('A0-' + slide + '-') > -1
          })
          arr.forEach(form => {
            if (forms[form] === 1) {
              correctFormNum++
            }
          })
          formNum += arr.length
        })
        let completedRate = !formNum ? '' : ((formNum / formLength) * 100).toFixed(0)
        let correctRate = (correctFormNum / formLength).toFixed(2)
        let isCompleted = false
        if (curUnlockChapter) {
          isCompleted = curUnlockChapter['A0' + item.part_num]
        }
        let coreObj = {part_num: item.part_num, star: this.starNum(correctRate), completedRate: completedRate, isUnlock: isUnlock, isCompleted: isCompleted}
        this.curChapterData['core'].push(coreObj)
      }

      // 测试数据
      let testRanking = await this.getCourseTestRanking(this.curChapterCode)
      console.log('testRanking', testRanking)
      if (testRanking.result.current_user && Object.keys(testRanking.result.current_user).length > 0) {
        this.testData['isTestCompleted'] = 1
        this.testData['completedTestRate'] = 100
        let correctRate = testRanking.result.current_user.correct_rate
        if (!correctRate) {
          correctRate = 0
        }
        correctRate = Math.floor((correctRate).toFixed(3))
        this.testData['star'] = this.starNum(correctRate)
        this.testData['grayStar'] = 5 - this.testData['star']
      } else {
        this.testData['isTestCompleted'] = 0
        this.testData['completedTestRate'] = ''
        this.testData['star'] = 0
        this.testData['grayStar'] = 5
      }

      // 作业
      let retObj = {}
      let homeworkContent = await this.getHomeworkContent(this.curChapterCode + '-A8')
      console.log(homeworkContent)
      if (homeworkContent && Object.keys(homeworkContent).length > 0) {
        let homeworkNum = homeworkContent.contents.length
        let doneNum = 0
        homeworkContent.contents.forEach((item) => {
          if (item.has_done) {
            doneNum++
          }
        })
        if (homeworkNum === doneNum) {
          retObj['star'] = 5
          retObj['grayStar'] = 0
          retObj['completedHomeworkRate'] = 100
          retObj['isComplete'] = 1
          retObj['imgHomeworkStyle'] = ''
        } else {
          retObj['star'] = 0
          retObj['grayStar'] = 5
          retObj['isComplete'] = 0
          retObj['completedHomeworkRate'] = (doneNum === 0) ? '' : (doneNum / homeworkNum * 100).toFixed(0) + '%'
          retObj['imgHomeworkStyle'] = ''
        }
      } else {
        retObj['star'] = 0
        retObj['grayStar'] = 5
        retObj['isComplete'] = 0
        retObj['completedHomeworkRate'] = ''
        retObj['imgHomeworkStyle'] = ''
      }
      this.homeworkData = retObj
      console.log(this.homeworkData)
      // await this.getCourseContent(curChapter.chapter_url)
      // vip 课程数据
      let chapterContent = await this.getChapterContent(curChapter.chapter_url)
      console.log('chapterContent', chapterContent)
      this.vipData = []
      let srcVipArray = []
      let vipFormArray = []
      for (let i = 1; i <= 6; i++) {
        let obj = {}
        obj['isCompleted'] = 0
        obj['starNum'] = 0
        obj['completedRate'] = ''
        obj['imgStyle'] = ''

        if (Object.keys(chapterContent).length > 0) {
          let vipForms = []
          Object.keys(forms).filter((item) => {
            return item.indexOf('A' + i) > -1
          }).map((el) => {
            return forms[el]
          }).forEach((i) => {
            if (i > -1) {
              vipForms.push(i)
            }
          })
          srcVipArray[i] = vipForms
          let vipParts = chapterContent.improvement.parts
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
            obj['completedRate'] = '100'
            let correctNum = srcVipArray[i].filter((item) => item === 1).length
            let correctRate = (correctNum / vipFormArray[i]).toFixed(2)
            obj['starNum'] = this.starNum(correctRate)
            obj['imgStyle'] = ''
          }
        }

        obj['isActive'] = 1
        if (!(parseInt(this.isVip) === 1 || this.hasPurchased)) {
          obj['isCompleted'] = 0
          obj['isActive'] = 0
          obj['completedRate'] = ''
          obj['starNum'] = 0
          obj['imgStyle'] = ''
        }
        this.vipData.push(obj)
      }
      console.log(srcVipArray)
      console.log(vipFormArray)
      console.log('vipdata', this.vipData)
      console.log('curChapterData', this.curChapterData)
      let kidTabActive = localStorage.getItem('kidTabActive')
      if (!kidTabActive || kidTabActive === '-1') {
        kidTabActive = '0'
      }
      if (kidTabActive) {
        this.active = parseInt(kidTabActive)
      }
      setTimeout(() => {
        this.changeTab(this.active)
      }, 100)
    },
    drawProgress (type, retObj) {
      console.log(retObj)
      let chapterCode = this.curChapterCode
      let rate = 0
      let id = ''
      let color = ''
      if (type === 'core') {
        for (let i = 0; i < 5; i++) {
          rate = parseFloat(retObj[i]['completedRate'] ? retObj[i]['completedRate'] : 0)
          id = '#' + chapterCode + '-canvas-A0' + (i + 1)
          color = '#2A9FE4'
          this.draw(id, rate, color)
        }
      } else if (type === 'test') {
        rate = parseFloat(retObj['completedTestRate'] ? retObj['completedTestRate'] : 0)
        id = '#' + chapterCode + '-canvas-A7'
        color = '#7FB926'
        this.draw(id, rate, color)
      } else if (type === 'homework') {
        rate = parseFloat(retObj['completedHomeworkRate'] ? retObj['completedHomeworkRate'] : 0)
        id = '#' + chapterCode + '-canvas-A8'
        color = '#7FB926'
        this.draw(id, rate, color)
      } else if (type === 'vip') {
        for (let i = 0; i < 6; i++) {
          rate = parseFloat(retObj[i]['completedRate'] ? retObj[i]['completedRate'] : 0)
          id = '#' + chapterCode + '-canvas-A' + (i + 1)
          color = '#F5A623'
          this.draw(id, rate, color)
        }
      }
    },
    draw (id, rate, color) {
      if (this.$el && this.$el.querySelector(id)) {
        rate = (rate === 100) ? 0 : rate
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
    async startCore (id, isUnlock) {
      console.log('点击每一个课程的时候', id, isUnlock)
      // if (isUnlock) {
      //   this.$router.push({ name: 'stage', params: {id: id} })
      // } else {
      //   this.tips = '学习需要循序渐进, <br>请先完成前面课程的学习哦！'
      //   Bus.$emit('setContinueLearn', this.tips)
      // }
      let courseCode = this.$route.params.courseCode
      let unlockChapters = await this.getUnlockChapter(courseCode)
      this.updateUnlockCourseList(unlockChapters)
      this.unlockCourses = Object.keys(unlockChapters.unlock).join(',')
      this.buyChapters = ''
      Object.keys(unlockChapters.unlock).forEach(key => {
        let item = unlockChapters.unlock[key]
        if (item.Has_purchased) {
          this.buyChapters += key + ','
        }
      })
      if (this.curChapterCode.toLowerCase().indexOf('unit1-chapter1') > -1 && parseInt(this.isVip) !== 1 && this.buyChapters.indexOf(this.curChapterCode) === -1) {
        if (!this.hasPurchased) {
          Bus.$emit('showBuyChapterPanel', this.curChapterCode)
          return false
        }
      }
      // 上个核心是否学完
      if (isUnlock) {
        let arr = this.curChapterCode.split('-')
        let num = (parseInt(arr[3].toLowerCase().replace('unit', '')) - 1) * 6 + parseInt(arr[4].toLowerCase().replace('chapter', ''))
        console.log(num)
        // 判断非会员是否购买了课程
        if (parseInt(this.isVip) === 1 || this.buyChapters.indexOf(this.curChapterCode) > -1 || this.hasPurchased) {
          this.$router.push({ name: 'stage', params: {id: id} })
        } else {
          Bus.$emit('showBuyChapterPanel', this.curChapterCode)
          return false
        }
      } else {
        this.tips = '学习需要循序渐进, <br>请先完成前面课程的学习哦！'
        Bus.$emit('setContinueLearn', this.tips)
      }
      console.log('curChapterCode', this.curChapterCode)
    },
    startTest (isCoreCompleted) {
      if (parseInt(this.isVip) === 1 || this.hasPurchased) {
        if (!isCoreCompleted) {
          this.tips = '学习需要循序渐进, <br>请先完成前面课程的学习哦！'
          Bus.$emit('setContinueLearn', this.tips)
        } else {
          this.$router.push({ path: '/learn/pk/' + this.curChapterCode })
        }
      } else {
        let obj = {
          className: 'vipIcon',
          description: '升级会员体验更多功能提高学习效率',
          btnDesc: '升级会员',
          isLink: true,
          hyperLink: '/app/vip-home'
        }
        Bus.$emit('showCommonModal', obj)
      }
    },
    startHomework (isCoreCompleted) {
      if (!isCoreCompleted) {
        this.tips = '学习需要循序渐进, <br>请先完成前面课程的学习哦！'
        Bus.$emit('setContinueLearn', this.tips)
      } else {
        this.$router.push({ path: '/app/homework' })
      }
    },
    jumpVipPage (isActive, id) {
      if (parseInt(this.isVip) === 1 || this.hasPurchased) {
        if (isActive) {
          this.$router.push({ name: 'stage', params: {id: id} })
        } else {
          this.tips = '学习需要循序渐进, <br>请先完成前面课程的学习哦！'
          Bus.$emit('setContinueLearn', this.tips)
        }
      } else {
        let obj = {
          className: 'vipIcon',
          description: '升级会员体验更多功能提高学习效率',
          btnDesc: '升级会员',
          isLink: true,
          hyperLink: '/app/vip-home'
        }
        Bus.$emit('showCommonModal', obj)
      }
    },
    jumpToCourse (chapterCode) {
      let isAnonymous = cookie.getCookie('is_anonymous') === 'true'
      if (isAnonymous) {
        Bus.$emit('showBindWin')
        return false
      }
      // if (this.unlockCourses.indexOf(chapterCode) === -1) {
      //   this.tips = '完成上一课“核心课程”, <br>才能开启本课程！'
      //   Bus.$emit('setContinueLearn', this.tips)
      //   return false
      // }
      // if (parseInt(this.isVip) !== 1) {
      //   let routeUrl = this.$router.resolve({
      //     path: '/app/vip-home'
      //   })
      //   window.open(routeUrl.href, '_blank')
      //   return false
      // }
      // if (this.buyChapters.indexOf(chapterCode) === -1 && parseInt(this.isVip) !== 1) {
      //   Bus.$emit('showBuyChapterPanel', chapterCode)
      //   return false
      // }

      localStorage.setItem('currentChapterCode', chapterCode)
      if (chapterCode === this.curChapterCode) {
        if (this.isShow) {
          this.isShow = !this.isShow
        } else {
          this.isShow = !this.isShow
        }
        return false
      } else {
        this.isShow = false
        setTimeout(() => {
          this.setKidCurrentChapter({chapter_code: chapterCode}).then(res => {
            this.active = 0
            localStorage.setItem('kidTabActive', this.active)
            this.curChapterCode = chapterCode
            this.initProData()
          })
        }, 300)
      }
    },
    switchShow () {
      this.isShow = false
    },
    // 绘本阅读和单词
    goKidStage (item, type) {
      console.log(item, type)
      console.log(this.buyChapters)
      if (parseInt(this.isVip) === 1 || (parseInt(this.isVip) !== 1 && (this.hasPurchased || item.code.toLowerCase().indexOf('level1-unit1-chapter1') > -1))) {
        let code = item.code
        this.$router.push({path: '/app/kid-stage', query: {code: code, type: type}})
      } else {
        let obj = {
          className: 'vipIcon',
          description: '升级会员免费订阅所有官方课程',
          btnDesc: '升级会员',
          isLink: true,
          hyperLink: '/app/vip-home'
        }
        Bus.$emit('showCommonModal', obj)
      }
    },
    // 儿歌
    goKidSongs (item) {
      console.log('儿歌详情每一个===>', item)
      if (parseInt(this.isVip) === 1 || (parseInt(this.isVip) !== 1 && (this.hasPurchased || item.code.toLowerCase().indexOf('level1-unit1-chapter1') > -1))) {
        Bus.$emit('showSongsModal', item.code)
        this.showSongs = true
        $('body').css('overflow', 'hidden')
      } else {
        let obj = {
          className: 'vipIcon',
          description: '升级会员免费订阅所有官方课程',
          btnDesc: '升级会员',
          isLink: true,
          hyperLink: '/app/vip-home'
        }
        Bus.$emit('showCommonModal', obj)
      }
    },
    closeModal () {
      this.showSongs = false
      $('body').css('overflow', 'auto')
    },
    // 切换级别
    selLevel (level) {
      console.log(level)
      this.isShowList = false
      this.curLevelChapters = []
      setTimeout(() => {
        this.curLevelCode = level.code
        this.curLevelChapters = level.chapters
        localStorage.setItem('curLevelChapters', JSON.stringify(this.curLevelChapters))
        this.isShowList = true
      }, 500)
    },
    // 计算完成率
    calCompleteRate (curUnlockKidChapter) {
      let rate = 0
      if (curUnlockKidChapter) {
        // 绘本20%
        if (curUnlockKidChapter['Draw']) {
          rate += 0.2
        }
        // 单词20%
        if (curUnlockKidChapter['Word']) {
          rate += 0.2
        }
        if (curUnlockKidChapter['A01']) {
          rate += 0.06
        }
        if (curUnlockKidChapter['A02']) {
          rate += 0.06
        }
        if (curUnlockKidChapter['A03']) {
          rate += 0.06
        }
        if (curUnlockKidChapter['A04']) {
          rate += 0.06
        }
        if (curUnlockKidChapter['A05']) {
          rate += 0.06
        }
        if (curUnlockKidChapter['A1']) {
          rate += 0.03
        }
        if (curUnlockKidChapter['A2']) {
          rate += 0.03
        }
        if (curUnlockKidChapter['A3']) {
          rate += 0.03
        }
        if (curUnlockKidChapter['A4']) {
          rate += 0.03
        }
        if (curUnlockKidChapter['A5']) {
          rate += 0.03
        }
        if (curUnlockKidChapter['A6']) {
          rate += 0.03
        }
        if (curUnlockKidChapter['A7']) {
          rate += 0.06
        }
        if (curUnlockKidChapter['A8']) {
          rate += 0.06
        }
      }
      return parseInt(rate.toFixed(2) * 100)
    }
  }
}
</script>

<style lang="less" scoped>
.course-container {
  width: 980px;
  margin: 20px auto;
  padding-bottom: 40px;
}

.mycourse-wrap {
  top: 35px !important;
  left: -129px !important;
}

.left-side{
  width: 230px;
  border-radius: 4px;
  box-shadow: 0 1px 2px 0 rgba(218,230,243,0.30);
  display: inline-block;
  margin-top: 8px;
  position: fixed;
  z-index: 9;
  .lang-overview dl{
    border-radius: 4px;
    padding: 30px 0px 0 20px;
    height: 170px;
    background-image: url('../../../../static/images/learn/learn-lang-bg.png');
    background-size: cover;
    background-repeat: no-repeat;
  }

  .lang-overview dt {
    float: left;
    margin-right: 15px;
  }

  .lang-overview dt img {
    display: inline-block;
    width: 62px;
    height: 62px;
    border: #ffffff solid 2px;
    border-radius: 4px;
    box-shadow: #3179A3 0 2px 7px;
    object-fit: cover;
  }

  .lang-overview dd {
    height: 100px;
    position: relative;
  }

  .lang-overview dd p {
    font-size: 16px;
    font-weight: bold;
  }
  .lang-overview dd .triangle {
    width: 130px;
    display: inline-block;
  }
  .lang-overview dd .triangle span {
    display: inline-block;
    max-width: 90px;
    font-size: 19px;
    line-height:26px;
    font-weight: bold;
    color: #ffffff;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .lang-overview dd .triangle p {
    position: relative;
    display: inline-block;
  }
  .lang-overview dd .triangle p img {
    position: absolute;
    top: 22px;
    left: 3px;
    width: 22px;
    height: 14px;
  }
  // .fade-enter-active {
  //   transition: opacity .5s;
  // }
  // .fade-leave-active {
  //   transition: opacity .1s;
  // }
  // .fade-enter, .fade-leave-to {
  //   opacity: 0;
  // }
  .lang-overview dd .triangle p i {
    cursor: pointer;
    display: inline-block;
    width: 17px;
    height: 17px;
    background: url('../../../../static/images/course/qh-default.svg') no-repeat center;
    block-size: cover;
    margin-top: 5px;
  }
  .lang-overview dd .triangle p i.active {
    display: inline-block;
    width: 17px;
    height: 17px;
    background: url('../../../../static/images/course/qh-click.svg') no-repeat center;
    block-size: cover;
    margin-top: 5px;
  }

  .lang-overview dd .course-old {
    height:20px;
    font-size:14px;
    font-weight:500;
    color:#ffffff;
    line-height:20px;
    display: inline-block;
    position: absolute;
    bottom: 38px;
    left: 77px;
  }
  .lang-overview dd .vip {
    position: absolute;
    bottom: -10px;
  }
  .lang-overview dd .vip span:first-child i {
    width: 17px;
    height: 16px;
    line-height: 22px;
    background-image: url('../../../../static/images/course/course-vip-small.svg');
    background-size: cover;
    background-repeat: no-repeat;
    display: inline-block;
    margin-top: 1px;
    margin-right: 6px;
  }

  .lang-overview dd .vip span:first-child {
    height:18px;
    font-size:12px;
    font-weight:500;
    color:#ffffff;
    line-height:22px;
    margin-right: 16px;
  }

  .lang-overview dd .vip a {
    /* width:66px; */
    border-radius:20px;
    border:1px solid #ffbe29;
    font-size:12px;
    font-weight:600;
    color:#ffbe29;
    padding: 2px 8px;
    cursor: pointer;
  }
  .lang-overview dd .no-vip {
    display: flex;
    align-items: center;
    position: absolute;
    bottom: -10px;
  }
  .lang-overview dd .no-vip span:first-child i {
    width: 17px;
    height: 16px;
    line-height: 22px;
    background-image: url('../../../../static/images/course/course-unvip-small.svg');
    background-size: cover;
    background-repeat: no-repeat;
    display: inline-block;
    margin-top: 1px;
    margin-right: 6px;
  }

  .lang-overview dd .no-vip span:first-child {
    /* height:18px; */
    font-size:12px;
    font-weight:500;
    color:#ffffff;
    line-height:22px;
    margin-right: 16px;
  }
  .lang-overview dd .no-vip a {
    /* width:66px; */
    border-radius:20px;
    border:1px solid #ffbe29;
    font-size:12px;
    font-weight:600;
    color:#ffbe29;
    padding: 2px 8px;
    cursor: pointer;
  }
  .lang-overview ul {
    width: 100%;
    background: #ffffff;
    padding: 0 15px;
    border-radius: 0 0 4px 4px;
    position: absolute;
  }

  .lang-overview ul li {
    border-bottom: 1px solid #f5f5f5;
    color: #333333;
    padding: 10px 0;
    cursor: pointer;
    margin: 20px 0;
    /* background-color: #90A2AE; */
  }

  .lang-overview ul li:hover {
    background-color: #F6F8F9;
    color: #2A9FE4;
  }

  .lang-overview ul li:last-child {
    border-bottom: 0;
  }

  .lang-overview ul li p {
    margin: 0 auto;
    text-align: center;
    font-size: 14px;
    font-weight: 400px;
  }

  .lang-overview .course-test-level p:first-child {
    width: 32px;
    height: 42px;
    background-image: url('../../../../static/images/course/course-test-level.svg');
    background-size: cover;
    background-repeat: no-repeat;
  }

  .lang-overview .course-learn-test p:first-child {
    width: 32px;
    height: 42px;
    background-image: url('../../../../static/images/course/course-learn-test.svg');
    background-size: cover;
    background-repeat: no-repeat;
  }

  .lang-overview .course-learn-guide p:first-child {
    width: 32px;
    height: 42px;
    background-image: url('../../../../static/images/course/course-learn-guide.svg');
    background-size: cover;
    background-repeat: no-repeat;
  }

  .learn-test i{
    background: url(../../../../static/images/learn/study-test.svg) no-repeat;
  }
}

.learn-course-nav {
  text-align: center;
  width: 800px;
  height: 60px;
  background-color: #f6f8f9;
  margin-top: -21px;
  margin-left: 245px;
  position: fixed;
  z-index: 9;
  ul {
    list-style: none;
    padding: 0px 0px !important;
    height: 60px;
    display: flex;
  }
  ul > li {
    float: left;
  }
  ul > li > p {
    display: inline-block;
    text-align: center;
    height: 60px;
    line-height: 75px;
    font-family: ".AppleSystemUIFont";
    font-size: 14px;
    font-weight:500;
    font-style: normal;
    font-stretch: normal;
    color: #555555;
    width: 70px;
    cursor: pointer;
  }
  ul > li > span {
    display: inline-block;
    height: 50px;
    line-height: 50px;
    font-size: 80%;
    color: #dcdbdb;
  }
    .learn-course-nav-active {
    color: rgb(42,159,228) !important;
    border-bottom: 2px solid rgba(42,159,228,1);
  }

  .learn-course-nav-detail {
    color: rgb(42,159,228) !important;
  }
  .learn-course-nav-blue:hover {
    color: rgb(42,159,228) !important;
  }

  @media screen and (max-width: 1024px) {
    .learn-course-nav {
      width: 750px;
      margin-left: 242px;
    }
  }
}

.course-content {
  display: inline-block;
  margin-left: 248px;
  vertical-align: top;
}

.course-list {
  position: relative;
  width: 732px;
  margin-top: 50px;
  .course-item {
    background-color:#fff;
    margin-top: 14px;
    padding: 14px 14px 0 14px;
    border-radius: 5px;
    overflow: hidden;
  }
  .current-learn-course-info{
    margin-bottom: 14px;
    cursor: pointer;
    overflow:hidden;
  }
  .current-learn-course-disabled{
    cursor: not-allowed;
  }
  .current-learn-course-flag{
    float:left;
    width:168px;
    height:80px;
    border-radius: 3px;
    overflow:hidden;
    position:relative;
    background-color: #F5F7F8;
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
  .course-item-detail {
  }
  .course-brief{
    position: relative;
    border-radius: 5px;
    height: 258px;
    cursor: pointer;
  }
  .course-brief img{
    position: absolute;
    height: 100%;
    width: 100%;
    object-fit: cover;
    border-radius: 5px;
  }
  .course-brief-shade{
    position: absolute;
    height: 100%;
    width: 100%;
    background: rgba(0,0,0,0.40);
    border-radius: 5px;
    z-index: 2;
  }
  .course-brief-title{
    position: relative;
    font-size: 30px;
    color: #ffffff;
    line-height: 48px;
    font-weight: 500;
    padding-top: 54px;
    padding-left: 36px;
  }
  .course-brief-describe{
    position: relative;
    font-size: 18px;
    color: #ffffff;
    line-height: 24px;
    font-weight: 500;
    margin: 2px 0 0 36px;
  }

  .course-brief-progress-title{
    position: relative;
    font-size: 20px;
    color: #ffffff;
    line-height: 24px;
    font-weight: bold;
    margin: 35px 0 0 36px;
  }

  .course-brief-progress-area {
    position: relative;
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
    position: absolute;
    margin-top: 30px;
    right: 12px;
    bottom: 12px;
  }

  .course-brief-shrink .shrink {
    display: inline-block;
    width: 20px;
    height: 20px;
    background-image: url('../../../../static/images/course/course-shrink.svg');
    background-repeat: no-repeat;
    object-fit: cover;
    cursor: pointer;
  }

  .tab-container {
    padding: 50px 0;
  }

  .tab-nav {
    border-bottom: 1px solid rgba(233,234,235,.5);
    ul {
      padding: 0 100px;
      display: flex;
      flex-direction: row;
      li {
        width: 50%;
        text-align: center;
        position: relative;
        font-size: 16px;
        font-weight: 500;
        color: #9B9B9B;
        padding: 5px 0;
        cursor: pointer;
      }
      .active {
        color: #4A90E2;
        .line {
          position: absolute;
          width: 190px;
          height: 2px;
          background: #2A9FE4;
          border-radius: 1px;
          margin-left: 31px;
          margin-top: 5px;
        }
      }
    }
  }
  .tab-content {
    overflow: hidden;
    position: relative;
  }
  .tab-content-kid {
    ul {
      margin-top: 40px;
      padding-left: 18px;
    }
    ul li{
      display: flex;
      flex-direction: row;
      padding: 6px 0;
      cursor: pointer;
    }
    ul li .icon {
      margin-right: 14px;
    }
    ul li .icon i {
      display: inline-block;
      width: 64px;
      height: 64px;
      background-repeat: no-repeat;
      background-size: cover;
    }

    ul li:nth-child(1) .icon i{
      background-image: url('../../../../static/images/kid/icon-pic-book.png');
    }

    ul li:nth-child(2) .icon i{
      background-image: url('../../../../static/images/kid/icon-core-word.png');
    }

    ul li:nth-child(3) .icon i{
      background-image: url('../../../../static/images/kid/icon-child-music.png');
    }

    ul li .title {
      width: 100%;
      border-bottom: 1px solid rgba(230,235,238,.5);;
    }

    ul li .title span {
      display: inline-block;
      font-size: 16px;
      font-weight: 400;
      color: #333333;
      line-height: 18px;
      margin-top: 23px;
      cursor: pointer;
    }
  }

  .tab-content-pro {
    padding-top: 30px;
    .course-core{
      width: 100%;
      border-bottom: 1px solid rgba(233,234,235,0.50);
      padding: 15px 0 15px;
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
      margin-right: 30px;
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

    .courseIsLock i{
      -webkit-filter: grayscale(100%);
      -moz-filter: grayscale(100%);
      -ms-filter: grayscale(100%);
      -o-filter: grayscale(100%);
      filter: grayscale(100%);
      -webkit-filter: gray;
      filter: gray;
    }

    .course-review{
      width: 100%;
      border-bottom: 1px solid rgba(233,234,235,0.50);
      padding: 15px 0 15px;
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
      padding: 15px 0 0px;
    }

    .course-vip-name{
      width:72px;
      font-size: 16px;
      font-weight: bold;
      color:#F5A623;
      text-align: center;
      display: inline-block;
      vertical-align: top;
      height: 80px;
      line-height: 20px;
      margin: 16px 12px 0 0;
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
      background-color: rgba(0, 0, 0, .4);
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
      background-color: #2A9FE4;
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
  }
}

.expand-enter-active {
  animation: myfirst .3s;
}
.expand-leave-active {
  animation: myfirst .1s reverse;
}

@keyframes myfirst {
  from {
    height: 0px;
  }
  to {
    height: 720px;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}

.fade-enter, .fade-leave-to {
  opacity: 0
}
</style>
