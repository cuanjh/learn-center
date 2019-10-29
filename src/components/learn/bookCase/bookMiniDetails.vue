<template>
  <div class="book-details">
    <nav-comp />
    <div class="details-header">
      <div class="details-header-content">
        <div class="details-header-left">
          <div class="left-content">
            <div class="left-top">
              <div class="details-img">
                <img :src="(courseInfo.flag ? courseInfo.flag : '/static/images/bookCase/img_default_maige.png') | urlFix('imageView2/0/format/jpg')" alt="课程详情的图片">
              </div>
              <div class="details-case">
                <p>
                  <span>{{ courseInfo.name + 'Mini'}}</span>
                </p>
              </div>
            </div>
            <div class="left-bottom">
              <div class="left-bottom-content">
                <ul>
                  <li>
                    <div class="item">
                      <i class="language"></i>
                      <span>课时</span>
                      <span class="fl">{{ courseInfo.chapter_num }}课时</span>
                    </div>
                  </li>
                  <li>
                    <div class="item">
                      <i class="case"></i>
                      <span>词汇</span>
                      <span class="fl">{{ courseInfo.vacabulary }}+</span>
                    </div>
                  </li>
                  <li>
                    <div class="item">
                      <i class="homeWork"></i>
                      <span>句型</span>
                      <span class="fl">{{ courseInfo.sentence}}+</span>
                    </div>
                    <a href="javascript:void(0)" :id="'btnState' + btnState" @click="btnHandler()" class="button">
                      <span>{{btnDesc}}</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="details-header-right">
          <div class="right-content">
            <div class="audio-play">
              <img src="https://mobile-static.talkmate.com/resource/2017-01-16/jiaoxuefa.png" alt>
              <p class="text" @click="playRadio()">
                <span>全球说母语教学法</span>
              </p>
            </div>
            <div class="add-btn">
              <div class="img-cont">
                <div class="img"></div>
                <span>扫一扫下载全球说App</span>
              </div>
            </div>
            <!-- 分享 -->
            <!-- <share-box :type="type"/> -->
          </div>
        </div>
      </div>
    </div>
    <div class="details-box">
      <div class="details-content">
        <div class="course-desc">
          <p class="title">课程介绍</p>
          <span>《全球说{{courseInfo.name}}》是联合国教科文组织世界语言地图项目推荐的学前儿童多语教育课程中的多语系列课程。</span>
          <span class="desc">本课程采用联合国教科文组织与全球说共同研发的ICOC自然母语学习法、PRIC教学法等算法模型，根据3-6岁学前儿童语言记忆特点量身定制的中国首套儿童多语学习体系。真正实现儿童在成长的黄金时期同时掌握多种语言的可行性。</span>
        </div>
        <div class="course-features">
          <p class="title">课程特色</p>
          <div class="features-content">
            <div class="line"></div>
            <ul>
              <li v-for="(item, index) in miniDetailInfo" :key="index">
                <span class="circle">{{item.num}}</span>
                <div class="introduce">
                  <span class="li-title">{{item.title}}</span>
                  <span class="dec" v-html="item.desc"></span>
                </div>
                <div class="img-box">
                  <img :class="'img' + item.num" :src="item.phtop" alt="">
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="course-system">
          <p class="title">课程体系</p>
          <p class="title2">主修课程Level划分</p>
          <div class="shuju">
            <i class="system-img"></i>
          </div>
        </div>
      </div>
    </div>
    <!-- vip提示 -->
    <vip-prompt></vip-prompt>
    <!-- 视频 -->
    <div class="video-box" v-show="showRadioPlay">
      <div class="video-dialog">
        <!-- txy.mp4 -->
        <video id="my-video" controls="controls">
          <source src="/i/movie.ogg" type="video/ogg" />
          <source src="//mobile-static.talkmate.com/resource/2017-04-05/jiaoxuefa-zh.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import Bus from '../../../bus'
import $ from 'jquery'
import NavComp from '../../common/nav.vue'
import ShareBox from '../../common/shareBox'
import VipPrompt from '../../../components/common/vipPrompt.vue'
import Cookie from '../../../tool/cookie'

/**
  * 订阅状态判断
  * "has_purchased": false, //是否购买
  * "over_date": 0,//过期日期的时间戳
  * "start_date": 0,//购买起始日期
  * "over_due": false,//购买后是否过期
  * "sub_state": 1 //订阅状态，0：没订阅，1:订阅，2：订阅后删除
 **/

export default {
  data () {
    return {
      userId: '',
      btnDesc: '',
      btnState: '', // 0: 没订阅 1: 订阅了 2: 订阅后删除了
      subState: {}, // 课程订阅的数据
      showRadioPlay: false,
      type: '3',
      courseInfo: {}, // 语言详情
      miniDetailInfo: [
        {
          num: 1,
          title: '母语学习环境，沉浸式学习',
          desc: '全球说 Mini 多语课程沉浸式学习是中国学前儿童学习外语的最佳模式。全球说 Mini 多语课程模式以“直接学习，类似习得”的学习方式，以互动性极强的阶梯式场景为基础，在丰富的学习内容和活动中，通过直观、形象、生动有趣的呈现方式来提高外语学习的可接受性、可理解性、趣味性和应用性，全面多维度的激发儿童的语言表达和交流。',
          phtop: require('../../../../static/images/bookCase/mini/1.png')
        },
        {
          num: 2,
          title: '科学原创配套绘本阅读，促进大脑发育',
          desc: '全球说 Mini 多语课程采用与联合国教科文组织一起研发的儿童系列绘本及儿歌为主要学习线索，通过自然、积极的语言环境促进儿童智力发展和思维发展。',
          phtop: require('../../../../static/images/bookCase/mini/2.png')
        },
        {
          num: 3,
          title: '专业化课程标准，可视化学习效果',
          desc: '·参照UNESCO WORLD ATLAS OF LANGUAGES<br/>·参照CEFR欧洲共同语言参考标准<br/>·运用权威蓝思分级阅读分级体系，结合中国儿童 实际阅读能力，进行有效的本土化定级调整。',
          phtop: require('../../../../static/images/bookCase/mini/3.png')
        },
        {
          num: 4,
          title: '秉承联合国教科文组织可持续发展终身优质教育的理念',
          desc: '多年来，联合国教科文组织不断重申在学前儿童阶段推广以母语为基础的多语教育的重要性。全球说 Mini 多语课程在多语言课程体系与多元文化体验活动中把优质教育的培养落到每个孩子的成长中，借助语言的力量去探索无边的世界，把儿童培养成未来小公民。',
          phtop: require('../../../../static/images/bookCase/mini/4.png')
        }
      ]
    }
  },
  components: {
    NavComp,
    ShareBox,
    VipPrompt
  },
  computed: {
    miniCode () {
      return this.$route.params.miniCode
    }
  },
  mounted () {
    console.log(this.miniCode)
    let navList = [
      {id: 1, path: '/app/index', text: '我的学习账户'},
      {id: 2, path: '/app/book-case', text: '添加课程'},
      {id: 3, path: '', text: '课程详情'}
    ]
    Bus.$emit('loadNavData', navList)
    this.userId = Cookie.getCookie('user_id')
    this.initDataDetails()
    document.addEventListener('click', (e) => {
      if (e.target.className === 'video-box' && e.target.className !== 'video-dialog') {
        this.showRadioPlay = false
        $('#my-video')[0].pause()
      }
    })
  },
  methods: {
    ...mapActions({
      getKidCourseDetail: 'getKidCourseDetail',
      getSubCourses: 'getSubCourses',
      getOneCourseSub: 'getOneCourseSub',
      getLearnInfoV5: 'getLearnInfoV5',
      setKidCurrentChapter: 'setKidCurrentChapter'
    }),
    // 播放视频
    playRadio () {
      /* eslint-disable */
      $('#my-video')[0].play()
      /* eslint-enable */
      this.showRadioPlay = true
    },
    // 初始化详情页面
    async initDataDetails () {
      let _this = this
      await this.getKidCourseDetail({course_code: this.miniCode}).then(res => {
        console.log(res)
        _this.courseInfo = res.detail
        _this.subState = res.detail.sub_state
        if (_this.subState.sub_state === 0) {
          _this.btnState = '0'
          _this.btnDesc = '订阅课程'
        } else if (_this.subState.sub_state === 1) {
          _this.btnState = '1'
          _this.btnDesc = '开始学习'
        } else if (_this.subState.sub_state === 2) {
          _this.btnState = '2'
          _this.btnDesc = '重新订阅'
        }
        Bus.$emit('shareCardContent', _this.courseInfo)
      })
    },
    // 点击订阅状态按钮
    btnHandler () {
      if (this.btnState === '1') {
        localStorage.removeItem('kidTabActive')
        this.startLearn()
      } else if (this.btnState === '0' || this.btnState === '2') {
        this.subscribeCourse()
      }
    },
    // 开始学习
    async startLearn () {
      console.log(this.miniCode)
      this.$router.push({path: '/app/kid-course-list/' + this.miniCode})
    },
    subscribeCourse () {
      if (!this.userId) {
        Bus.$emit('showGoLoginBox')
        return false
      }
      this.getOneCourseSub({course_code: this.miniCode}).then(res => {
        console.log('状态返回===》', res)
        if (res.success) {
          this.btnState = '1'
          this.btnDesc = '开始学习'
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.book-details {
  width: 960px;
  margin: 0px auto 144px;
}
.details-header {
  width: 100%;
  margin-top: 8px;
  border-radius: 3px;
  .details-header-content {
    width: 100%;
    display: flex;
    justify-content: space-between;
    // 上部左边部分
    .details-header-left {
      width: 690px;
      border-radius: 5px;
      background: #ffffff;
      .left-content {
        height: 100%;
        padding: 36px 40px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .left-top {
          padding-bottom: 30px;
          position: relative;
          .details-img {
            width: 84px;
            height: 84px;
            box-shadow:0px 4px 10px 0px rgba(81,120,135,0.18);
            img {
              width: 100%;
              height: 100%;
              border-radius: 6px;
              object-fit: cover;
            }
          }
          .details-case {
            position: absolute;
            top: 23px;
            left: 104px;
            p:nth-child(1) {
              font-size:24px;
              font-weight:800;
              color:rgba(51,51,51,1);
            }
          }
        }
        .left-bottom {
          position: relative;
          .left-bottom-content {
            ul {
              li {
                // width: 380px;
                margin-top: 6px;
                // border-bottom: 1px solid #EBEBEB;
                .item {
                  width: 380px;
                  line-height: 26px;
                  padding: 5px 50px;
                  background: #F6F8F9FF;
                  border-radius: 80px;
                  font-size:14px;
                  font-weight:400;
                  color:rgba(51,51,51,1);
                  .fl {
                    float: right;
                    display: block;
                    // width: 110px;
                    font-weight:800;
                  }
                  i {
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    margin-right: 10px;
                    margin-top: 3px;
                  }
                  .language {
                    background: url('../../../../static/images/language.svg') no-repeat center;
                    background-size: cover;
                  }
                  .case {
                    background: url('../../../../static/images/case.svg') no-repeat center;
                    background-size: cover;
                  }
                  .homeWork {
                    background: url('../../../../static/images/homeWork.svg') no-repeat center;
                    background-size: cover;
                  }
                }
              }
              li:last-child {
                display: -ms-flexbox;
                display: flex;
                -ms-flex-pack: justify;
                justify-content: space-between;
              }
            }
          }
          .button {
            min-width: 140px;
            background: #2A9FE4FF;
            font-size: 14px;
            color: #ffffff;
            text-align: center;
            padding: 8px 42px;
            border-radius: 20px;
            box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, .15);
          }
          .button:hover {
            background: rgba(11, 108, 224, .6)
          }
          .locked {
            background-color: #90A2AE;
            box-shadow: 0 0 0 0;
          }
        }
      }
    }
    // 上部右边部分
    .details-header-right {
      width: 258px;
      border-radius: 5px;
      background: #ffffff;
      .right-content {
        width: 100%;
        height: 100%;
        padding: 20px;
        .audio-play {
          position: relative;
          width: 100%;
          height: 120px;
          border-radius: 10px;
          img {
            width: 100%;
            height: 100%;
            border-radius: 3px;
            object-fit: cover;
          }
          .text {
            cursor: pointer;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, .2);
            position: absolute;
            top: 0;
            text-align: center;
            line-height: 120px;
            font-size: 16px;
            color: #ffffff;
            border-radius: 3px;
          }
        }
        .add-btn {
          width: 100%;
          .img-cont {
            padding: 24px 0 20px;
            text-align: center;
            .img {
              width: 67px;
              height: 66px;
              background: url('../../../../static/images/qrcode.png') no-repeat center;
              background-size: cover;
              margin: 0 auto;
              margin-bottom: 10px;
            }
            span {
              font-size: 12px;
              color: #7E929FFF;
              line-height: 12px;
            }
          }
        }
      }
    }
  }
}
.details-box {
  width: 100%;
  background: #ffffff;
  margin-top: 20px;
  border-radius:0px 0px 5px 5px;
  .details-content {
    .title {
      font-size:17px;
      font-weight:500;
      color:rgba(51,51,51,1);
      line-height:24px;
      padding-bottom: 10px;
    }
    .course-desc {
      padding: 42px 44px 50px;
      span {
        display: block;
        font-size:14px;
        font-weight:400;
        color:rgba(84,100,125,1);
        line-height:24px;
      }
      .desc {
        padding-top: 10px;
      }
    }
    .course-features {
      padding: 0px 44px;
      .features-content {
        display: flex;
        position: relative;
        ul {
          position: relative;
          z-index: 2;
          li {
            display: flex;
            padding-bottom: 50px;
            .circle {
              display: inline-block;
              width:22px;
              height:22px;
              background:rgba(42,159,228,1);
              border-radius: 50%;
              font-size:14px;
              font-family:PingFang-SC-Bold;
              font-weight:bold;
              color:rgba(255,255,255,1);
              line-height:22px;
              text-align: center;
              margin-right: 18px;
            }
            .introduce {
              max-width: 488px;
              margin-right: 52px;
              span {
                display: block;
              }
              .li-title {
                font-size:15px;
                font-weight:bold;
                color:rgba(10,43,64,1);
                line-height:21px;
                padding-bottom: 6px;
              }
              .dec {
                font-size:14px;
                font-weight:500;
                color:rgba(84,100,125,1);
                line-height:24px;
              }
            }
            .img-box {
              width: 274px;
              height: 170px;
              text-align: center;
              .img1 {
                display: inline-block;
                width: 236px;
                height: 201px;
                object-fit: cover;
              }
              .img2 {
                display: inline-block;
                width: 223px;
                height: 169px;
                object-fit: cover;
              }
              .img3 {
                display: inline-block;
                width: 274px;
                height: 160px;
                object-fit: cover;
              }
              .img4 {
                display: inline-block;
                width: 227px;
                height:194px;
                object-fit: cover;
              }
            }
          }
        }
        .line {
          display: block;
          width: 1px;
          height: 780px;
          background: -webkit-linear-gradient(top,rgb(123, 208, 249), rgb(98, 198, 245), rgb(69, 177, 241), rgba(69, 177, 241, 0)) no-repeat;
          position: absolute;
          top: 10px;
          left: 10px;
          z-index: 1;
        }
      }
    }
    .course-system {
      width: 100%;
      p {
        padding: 0 44px;
      }
      .title2 {
        font-size:14px;
        font-weight:500;
        color:rgba(88,105,115,1);
        line-height:20px;
      }
      .shuju {
        width: 100%;
        text-align: center;
      }
      .system-img {
        display: inline-block;
        width: 930px;
        height: 536px;
        background: url('../../../../static/images/bookCase/mini/shuju.png') no-repeat center;
        background-size: cover;
      }
    }
  }
}
.video-box {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1050;
  overflow: hidden;
  outline: 0;
  background: rgba(0, 0, 0, .5);
  .video-dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 710px;
    height: 400px;
    transform: translate(-50%, -50%);
    video {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
