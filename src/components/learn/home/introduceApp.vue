<template>
  <div class="introduce-app">
    <div class="introduce-home">
      <!-- 上部分 -->
      <div class="introduce-header">
        <div class="bg-img"></div>
        <div class="text">
          <div class="text-introduce">
            <p>走到哪里，学到哪！</p>
            <p>Talkmate-全球说移动应用程序支持离线下载学习语言课程；你还可以发现那些非常丰富的电台课程资源，只需点击一下即可播放相关的电台课程，让你随时随地学习走到哪里学到哪里，比传统外语学习效率提高5倍！</p>
          </div>
          <!-- 视频 -->
          <div class="video-box">
            <div class="video-play" @click="playRadio($event)">
              <i class="play"></i>
            </div>
            <div class="video-img" v-show="videoImg"></div>
            <div class="video-dialog">
              <video class="vjs-tech" id="my-video" controls="controls">
                <!-- <source src="/i/movie.ogg" type="video/ogg" /> -->
                <source src="https://mobile-static.talkmate.com/video/talkmate-introduce.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </div>
      <!-- 精品推荐 -->
      <div class="quality-goods">
        <div class="content">
          <div class="ipad"></div>
          <div class="mini"></div>
          <div class="iphone"></div>
          <div class="icon"></div>
          <div class="score"></div>
        </div>
      </div>
      <!-- 下载 -->
      <div class="download">
        <div class="download-cont">
          <div class="ios">
            <p class="p">
              <span>iPad 和 iPhone 的 </span>
              <span>下载<i></i></span>
            </p>
            <i class="ios-icon"></i>
            <i class="ios-app" @click="goDownLoadIos()"></i>
          </div>
          <div class="line"></div>
          <div class="android">
            <span>Android 的 下载</span>
            <i class="google" @click="goDownLoadGoogle()"></i>
            <div class="android-app"><i></i></div>
          </div>
        </div>
      </div>
      <!-- 功能 -->
      <div class="function">
        <div class="function-cont">
          <div class="text">
            <p>把这些功能放进口袋</p>
            <div class="lists">
              <ul>
                <li>
                  <div class="list-li">
                    <div class="img"></div>
                    <div class="title">
                      <span>下载离线课程</span>
                      <span>零散的时间里，在没有网络的位置，离线下载课程都可以让你的学习无阻，让学习更加灵活顺畅，和高效。</span>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="list-li">
                    <div class="img2"></div>
                    <div class="title">
                      <span>更好的语伴交互</span>
                      <span>来自一百多个国家的语伴学习互助和主题群聊室，接触系统智能推荐的国外语伴，让学习更有意义。</span>
                    </div>
                  </div>
                </li>
              </ul>
              <ul>
                <li>
                  <div class="list-li">
                    <div class="img3"></div>
                    <div class="title">
                      <span>边走边听的电台课程</span>
                      <span>你可以相信，电台课程语声具来的轻松惬意，你可以做到随时随地边走边听，多样有趣的音频课程带你聊基恩异域风情，扩展你的认知。</span>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="list-li">
                    <div class="img4"></div>
                    <div class="title">
                      <span>也可以读上一篇文章</span>
                      <span>有关你的语种，我们会推荐有助于提升语言认知的文章或新闻，如果你还会第二门语言，那“更多”就是你最好的选择。</span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <!-- 学习平台 -->
      <div class="learn">
        <div class="learn-cont">
          <p>我们的合作伙伴和给予的权威推荐</p>
          <div class="learn-icon">
            <div class="item">
              <i class="red-icon"></i>
              <p class="red">中华人民共和国教育部 最佳合作伙伴</p>
            </div>
            <div class="item">
              <i class="blue-icon"></i>
              <p class="blue">联合国教科文组织<br>世界语言地图语言学习<br>与语言社区承载平台</p>
            </div>
            <div class="item">
              <i class="soil-icon"></i>
              <p class="soil">2019年联合国“国际本土语言年” 合作伙伴</p>
            </div>
            <div class="item">
              <i class="research-icon"></i>
              <p class="research">中国语言资源保护研究中心 官方战略合作伙伴</p>
            </div>
            <div class="item">
              <i class="app-store-icon"></i>
              <p class="app">苹果商店精华推荐</p>
            </div>
          </div>
        </div>
      </div>
      <!-- 他们是这样说的 -->
      <div class="say">
        <div class="say-cont">
          <div class="say-text">
            <p>他们是这样说的</p>
            <p>在过去的一段时间里我们陆续收到了很多国家的语言学习者发来的e-mail，留言和信件！</p>
          </div>
          <div class="comments-list">
            <div class="swiper-container">
              <div class="swiper-wrapper">
                <div class="swiper-slide">
                  <ul>
                    <li>
                      <div class="top">
                        <div class="img"></div>
                        <div  class="language">
                          <p>特丽莎-梅梅（中国.厦门）</p>
                          <p>
                            <span>英语<i></i></span> >
                            <span>日语<i></i><i></i></span>、
                            <span>阿拉伯语<i></i><i></i></span>
                          </p>
                        </div>
                      </div>
                      <div class="text">
                        <p>最nice的就是全球说的电台配套课程了，讲解透彻易懂，还了解了很多语种所在国家的风情文化！还有很多国外的同学，大家一起聊天，一起分享各自的履历！</p>
                      </div>
                    </li>
                    <li>
                      <div class="top">
                        <div class="img2"></div>
                        <div  class="language">
                          <p>Brashae Hello（法国.里昂）</p>
                          <p>
                            <span>汉语<i></i></span> >
                            <span>日语<i></i><i></i></span>、
                            <span>西班牙语<i></i><i></i></span>
                          </p>
                        </div>
                      </div>
                      <div class="text">
                        <p>固定的时间里在web端学习，沉浸感很强！移动APP的应用场景更加丰富，使用入门相对简单，两端结合学习，灵活又高效。</p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div class="swiper-slide">
                  <ul>
                    <li>
                      <div class="top">
                        <div class="img3"></div>
                        <div  class="language">
                          <p>Tough (美国.亚特兰大)</p>
                          <p>
                            <span>法语<i></i></span> >
                            <span>日语<i></i><i></i></span>、
                            <span>俄语<i></i><i></i></span>
                          </p>
                        </div>
                      </div>
                      <div class="text">
                        <p>全球说优势很明显，移动APP使用简单，体验愉悦，根据说母语的习惯来学习语言，还有语伴的纠正和帮助，让我感觉不是一个人在孤独地学习！</p>
                      </div>
                    </li>
                    <li>
                      <div class="top">
                        <div class="img4"></div>
                        <div  class="language">
                          <p>往事如风（中国.天津）</p>
                          <p>
                            <span>英语<i></i></span> >
                            <span>韩语<i></i><i></i></span>、
                            <span>西班牙语<i></i><i></i></span>
                          </p>
                        </div>
                      </div>
                      <div class="text">
                        <p>非常好用！只要跟着进度来学习，不会担心没有金币换课程，一节课程通过图片加语音加自己说的方式来学习，反复记忆，灵活使用，印象更深刻。</p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div class="swiper-slide">
                  <ul>
                    <li>
                      <div class="top">
                        <div class="img5"></div>
                        <div  class="language">
                          <p>Evangeline（英国.伦敦）</p>
                          <p>
                            <span>日语<i></i></span> >
                            <span>西班牙语<i></i><i></i></span>、
                            <span>意大利语<i></i><i></i></span>
                          </p>
                        </div>
                      </div>
                      <div class="text">
                        <p>系统会根据我学习的语种，为我推荐关于提升语言认知的文章和新闻，这样让我的学习过程增加了趣味性和丰富性，我很喜欢！</p>
                      </div>
                    </li>
                    <li>
                      <div class="top">
                        <div class="img6"></div>
                        <div  class="language">
                          <p>Marie Alfred Cornu（法国.奥尔良）</p>
                          <p>
                            <span>韩语<i></i></span> >
                            <span>阿拉伯语<i></i><i></i></span>、
                            <span>葡萄牙语<i></i><i></i></span>
                          </p>
                        </div>
                      </div>
                      <div class="text">
                        <p>界面风格干净简洁，没有过多的信息来干扰我，反而让我更加有坚持学习下去的动力，期待能在这里学习到更多有用的语言。</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <!-- 分页器 -->
              <div id="swiper-pagination" class="swiper-pagination"></div>
            </div>
            <!-- <ul>
              <li>
                <div class="top">
                  <div class="img"></div>
                  <div  class="language">
                    <p>特丽莎-梅梅（中国.厦门）</p>
                    <p>
                      <span>英语<i></i></span> >
                      <span>日语<i></i><i></i></span>、
                      <span>阿拉伯语<i></i><i></i></span>
                    </p>
                  </div>
                </div>
                <div class="text">
                  <p>最nice的就是全球说的电台配套课程了，讲解透彻易懂，还了解了很多语种所在国家的风情文化！还有很多国外的同学，大家一起聊天，一起分享各自的履历！</p>
                </div>
              </li>
              <li>
                <div class="top">
                  <div class="img2"></div>
                  <div  class="language">
                    <p>Brashae Hello（法国.里昂）</p>
                    <p>
                      <span>英语<i></i></span> >
                      <span>日语<i></i><i></i></span>、
                      <span>阿拉伯语<i></i><i></i></span>
                    </p>
                  </div>
                </div>
                <div class="text">
                  <p>固定的时间里在web端学习，沉浸感很强！移动APP的应用场景更加丰富，使用入门相对简单，两端结合学习，灵活又高效。</p>
                </div>
              </li>
            </ul> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import $ from 'jquery'
import Swiper from 'swiper'
import 'swiper/dist/css/swiper.min.css'

export default {
  data () {
    return {
      showRadioPlay: false,
      videoImg: true
    }
  },
  mounted () {
    this.$nextTick(() => {
      /* eslint-disable no-new */
      new Swiper('.swiper-container', {
        loop: true,
        initialSlide: 0,
        observer: true, // 修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, // 修改swiper的父元素时，自动初始化swiper
        notNextTick: true,
        // speed: 1000,
        autoplayStopOnLast: true,
        autoplay: {
          delay: 3000, // 3秒切换一次
          stopOnLastSlide: false,
          disableOnInteraction: false
        },
        paginationClickable: true,
        mousewheelControl: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        }
      })
    })
    document.addEventListener('click', (e) => {
      if (e.target.className === 'video-box' && e.target.className !== 'video-dialog') {
        this.showRadioPlay = false
        $('#my-video')[0].pause()
      }
    })
  },
  methods: {
    goDownLoadIos () {
      window.open('https://itunes.apple.com/cn/app/%E5%85%A8%E7%90%83%E8%AF%B4-talkmate-%E8%8B%B1%E8%AF%AD%E6%97%A5%E8%AF%AD%E9%9F%A9%E8%AF%AD%E7%AD%89%E8%AF%AD%E8%A8%80%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B/id959231176?mt=8')
    },
    goDownLoadGoogle () {
      window.open('https://play.google.com/store/apps/details?id=com.kuyu')
    },
    // 播放视频
    playRadio (e) {
      console.log('e', e)
      $(e.target).removeClass('play')
      this.videoImg = false
      $('#my-video')[0].play()
      this.showRadioPlay = true
    }
  }
}
</script>
<style lang="less" scoped>
.introduce-app {
  width: 100%;
  .introduce-home {
    width: 100%;
    // 上部分
    .introduce-header {
      position: relative;
      width: 100%;
      height: 344px;
      .bg-img {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
        height: 344px;
        background: url('../../../../static/images/introduceApp/headimg.png') no-repeat center;
        background-size: 100% 100%;
        z-index: 1;
      }
      .text {
        width: 1200px;
        display: flex;
        margin: 0 auto;
        z-index: 9;
        .text-introduce {
          display: inline-block;
          width: 517px;
          z-index: 2;
          padding-top: 81px;
          display: flex;
          flex-direction: column;
          p {
            width: 517px;
            font-size: 14px;
            color: #ffffff;
            line-height: 20px;
          }
          p:nth-child(1) {
            font-size: 32px;
            font-weight: bold;
            line-height: 46px;
            padding-bottom: 16px;
          }
        }
      }
      // 视频
      .video-box {
        position: relative;
        width: 422px;
        height: 248px;
        border: 6px #fff solid;
        box-shadow:0px 2px 13px 1px rgba(11,53,80,0.54);
        box-sizing: border-box;
        z-index: 2;
        margin-left: 112px;
        margin-top: 52px;
        .video-play {
          width: 58px;
          height: 58px;
          cursor: pointer;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          margin: auto;
          z-index: 99;
          i {
            cursor: pointer;
            display: inline-block;
            width: 58px;
            height: 58px;
            background-repeat: no-repeat;
            background-position: center;
            background-size: cover;
          }
          .play {
            background: url('../../../../static/images/introduceApp/play.svg');
          }
          .pause {
            background: url('../../../../static/images/introduceApp/blacktuijian.png');
          }
        }
        .video-img {
          position: absolute;
          top: 0;
          width: 410px;
          height: 236px;
          background: url('../../../../static/images/introduceApp/videomoren.png') no-repeat center;
          background-size: cover;
          object-fit: cover;
          z-index: 9;
        }
        .video-dialog {
          display: block;
          vertical-align: top;
          box-sizing: border-box;
          color: #fff;
          background-color: #000;
          position: relative;
          padding: 0;
          font-size: 10px;
          line-height: 1;
          font-weight: normal;
          font-style: normal;
          font-family: Arial, Helvetica, sans-serif;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          width:410px;
          height: 236px;
          .vjs-tech {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    // 精品推荐
    .quality-goods {
      // margin-top: 237px;
      width: 100%;
      height: 312px;
      background: #ffffff;
      .content {
        width: 1200px;
        height: 100%;
        padding-bottom: 41px;
        margin: 0 auto;
        display: flex;
        align-items: flex-end;
        .ipad {
          width: 190px;
          height: 100%;
            margin-right: 25px;
            background: url('../../../../static/images/introduceApp/iPad.svg') no-repeat center;
            background-size: 100%;
        }
        .mini {
          width:128px;
          height: 182px;
          background: url('../../../../static/images/introduceApp/mini.svg') no-repeat center;
          background-size: 100%;
          margin-right: 27px;
        }
        .iphone {
          width: 71px;
          height: 141px;
          background: url('../../../../static/images/introduceApp/iPhonenew.png') no-repeat center;
          background-size: 100%;
          margin-right: 58px;
        }
        .icon {
          width: 110px;
          height: 80px;
          background: url('../../../../static/images/introduceApp/icon.svg') no-repeat center;
          background-size: 100%;
          margin-right:73px;
        }
        .score {
          width: 374px;
          height: 43px;
          background: url('../../../../static/images/introduceApp/comments.png') no-repeat center;
          background-size: 100%;
        }
      }
    }
    // 下载
    .download {
      width: 100%;
      background: #F1F5F8FF;
      .download-cont {
        width: 1200px;
        height: 100%;
        padding: 36px 0px;
        margin: 0 auto;
        display: flex;
        .ios {
          position: relative;
          display: flex;
          align-items: center;
          p {
            display: inline-block;
            margin-right: 30px;
          }
          span {
            font-size:16px;
            font-family:PingFangSC-Semibold;
            font-weight:600;
            color:rgba(10,43,64,1);
            line-height:22px
          }
          span:nth-child(2) {
            color: #2A9FE4FF;
            &:hover {
              cursor: pointer;
              i {
                display: inline-block;
                position: absolute;
                top: -130px;
                left: 123px;
                width: 126px;
                height: 144px;
                background: url('../../../../static/images/introduceApp/download-appios.png') no-repeat center;
                background-size: cover;
              }
            }
          }
          .ios-icon {
            display: inline-block;
            width: 63px;
            height: 46px;
            background: url('../../../../static/images/introduceApp/blacktuijian.png') no-repeat center;
            background-size: cover;
            margin-right: 50px;
          }
          .ios-app {
            display: inline-block;
            width: 160px;
            height: 48px;
            background: url('../../../../static/images/introduceApp/iosapp.svg') no-repeat center;
            background-size: cover;
            cursor: pointer;
            border-radius: 5px;
          }
        }
        .line {
          width: 1px;
          height: 38px;
          background: #C8D4DBFF;
          margin: 0 28px;
        }
        .android {
          position: relative;
          display: flex;
          align-items: center;
          span {
            font-size:16px;
            font-family:PingFangSC-Semibold;
            font-weight:600;
            color:rgba(10,43,64,1);
            line-height:22px;
            margin-right: 42px;
          }
          .google {
            display: inline-block;
            width: 160px;
            height: 48px;
            background: url('../../../../static/images/introduceApp/google.svg') no-repeat center;
            background-size: cover;
            margin-right: 10px;
            cursor: pointer;
            border-radius: 5px;
          }
          .android-app {
            position: relative;
            display: inline-block;
            width: 160px;
            height: 48px;
            background: url('../../../../static/images/introduceApp/androoid.svg') no-repeat center;
            background-size: cover;
            cursor: pointer;
            border-radius: 5px;
            &:hover {
              i {
                display: inline-block;
                position: absolute;
                top: -146px;
                left: 37px;
                width: 126px;
                height: 144px;
                background: url('../../../../static/images/introduceApp/download-appandroid.png') no-repeat center;
                background-size: cover;
              }
            }
          }
        }
      }
    }
    // 功能
    .function {
      width: 100%;
      background: #ffffff;
      .function-cont {
        width: 1200px;
        padding: 88px 0 80px;
        margin: 0 auto;
        .text {
          p {
            width: 100%;
            font-size: 24px;
            color: #333333FF;
            line-height: 34px;
            font-weight: bold;
          }
          .lists {
            width: 100%;
            padding-top: 44px;
            ul {
              display: flex;
              li {
                width: 50%;
                .list-li {
                  width: 100%;
                  display: flex;
                  .img {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    margin-right: 10px;
                    background: url('../../../../static/images/downloadicon.svg') no-repeat center;
                    background-size: cover;
                  }
                  .img2 {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    margin-right: 10px;
                    background: url('../../../../static/images/partnersicon.svg') no-repeat center;
                    background-size: cover;
                  }
                  .img3 {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    margin-right: 10px;
                    background: url('../../../../static/images/radioicon.svg') no-repeat center;
                    background-size: cover;
                  }
                  .img4 {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    margin-right: 10px;
                    background: url('../../../../static/images/articleicon.svg') no-repeat center;
                    background-size: cover;
                  }
                  .title {
                    display: flex;
                    flex-direction: column;
                    span {
                      font-size: 14px;
                      line-height: 20px;
                      color: #333333FF;
                    }
                    span:nth-child(1) {
                      font-weight: 600;
                    }
                    span:nth-child(2) {
                      padding-top: 6px;
                      display: inline-block;
                      width: 460px;
                      color: #666666FF
                    }
                  }
                }
              }
            }
            ul:nth-child(2) {
              padding-top: 22px;
            }
          }
        }
      }
    }
    // 学习平台
    .learn {
      width: 100%;
      .learn-cont {
        width: 100%;
        padding: 56px 358px 62px;
        background: #F1F5F8FF;
        p {
          font-size: 24px;
          line-height: 34px;
          color: #333333FF;
          font-weight: bold;
          text-align: center;
        }
        .learn-icon {
          width: 100%;
          padding-top: 50px;
          text-align: center;
          display: flex;
          justify-content: center;
          .item {
            text-align: center;
            margin-right: 50px;
            p {
              width: 232px;
              font-size:16px;
              font-weight:500;
              color:rgba(51,51,51,1);
              line-height:22px;
            }
            .red {
              width: 170px;
              padding-top: 21px;
            }
            .blue {
              width: 162px;
              padding-top: 23px;
            }
            .soil {
              padding-top: 21px;
            }
            .research {
              width: 192px;
              padding-top: 25px;
            }
            .app {
              width: 128px;
              padding-top: 22px;
            }
            i {
              display: inline-block;
              height: 96px;
            }
            .red-icon {
              display: inline-block;
              width: 68px;
              height: 72px;
              background: url('../../../../static/images/introduceApp/redlearn.png') no-repeat center;
              background-size: cover;
            }
            .blue-icon {
              display: inline-block;
              width: 87px;
              height: 68px;
              background: url('../../../../static/images/introduceApp/bluelearn.svg') no-repeat center;
              background-size: cover;
            }
            .soil-icon {
              display: inline-block;
              width: 156px;
              height: 72px;
              background: url('../../../../static/images/introduceApp/soilicon.svg') no-repeat center;
              background-size: cover;
            }
            .research-icon {
              display: inline-block;
              width: 65px;
              height: 65px;
              background: url('../../../../static/images/introduceApp/researchicon.svg') no-repeat center;
              background-size: cover;
            }
            .app-store-icon {
              display: inline-block;
              width: 70px;
              height: 70px;
              background: url('../../../../static/images/introduceApp/App-store.svg') no-repeat center;
              background-size: cover;
            }
          }
        }
      }
    }
    // 他们是这样说的
    .say {
      width: 100%;
      background: #ffffff;
      .say-cont {
        width: 1200px;
        margin: 0 auto;
        padding: 80px 0 120px;
        .say-text {
          width: 100%;
          p:nth-child(1) {
            font-size: 24px;
            color: #333333FF;
            line-height: 34px;
            font-weight: bold;
            padding-bottom: 5px;
          }
        }
        p {
          font-size: 14px;
          color: #666666FF;
          line-height: 20px;
        }
        .comments-list {
          width: 1070px;
          height: 314px;
          margin-top: 56px;
          ul {
            width: 100%;
            display: flex;
            li {
              display: inline-block;
              box-shadow:0px 5px 15px 0px rgba(10,43,64,0.08);
              border-radius:10px;
              padding: 54px 52px 59px 110px;
              margin-right: 26px;
              .top {
                display: flex;
                align-items: center;
                width: 100%;
                .img {
                  width: 72px;
                  height: 72px;
                  border-radius: 50%;
                  background: url('../../../../static/images/introduceApp/china.svg') no-repeat center;
                  background-size: cover;
                  margin-right: 24px;
                }
                .img2 {
                  width: 72px;
                  height: 72px;
                  border-radius: 50%;
                  background: url('../../../../static/images/introduceApp/frach.svg') no-repeat center;
                  background-size: cover;
                  margin-right: 24px;
                }
                .img3 {
                  width: 72px;
                  height: 72px;
                  border-radius: 50%;
                  background: url('../../../../static/images/introduceApp/1.svg') no-repeat center;
                  background-size: cover;
                  margin-right: 24px;
                }
                .img4 {
                  width: 72px;
                  height: 72px;
                  border-radius: 50%;
                  background: url('../../../../static/images/introduceApp/2.svg') no-repeat center;
                  background-size: cover;
                  margin-right: 24px;
                }
                .img5 {
                  width: 72px;
                  height: 72px;
                  border-radius: 50%;
                  background: url('../../../../static/images/introduceApp/3.svg') no-repeat center;
                  background-size: cover;
                  margin-right: 24px;
                }
                .img6 {
                  width: 72px;
                  height: 72px;
                  border-radius: 50%;
                  background: url('../../../../static/images/introduceApp/4.svg') no-repeat center;
                  background-size: cover;
                  margin-right: 24px;
                }
                .language {
                  p:nth-child(1) {
                    font-size: 14px;
                    color: #333333FF;
                    line-height: 20px;
                    font-weight: bold;
                    padding-bottom: 6px;
                  }
                  p:nth-child(2) {
                    i {
                      display: inline-block;
                      width: 32px;
                      height: 4px;
                      background: #F1F2F3FF;
                      border-radius: 2px;
                    }
                    span:nth-child(1) {
                      position: relative;
                      i {
                      background: #2A9FE4FF;
                      position: absolute;
                      bottom: -3px;
                      left: 0;
                      }
                    }
                    span:nth-child(2) {
                      position: relative;
                      i {
                      position: absolute;
                      bottom: -3px;
                      left: 0;
                      }
                      i:nth-child(2) {
                        width: 12px;
                        background: #7ED321FF;
                      }
                    }
                    span:nth-child(3) {
                      position: relative;
                      i {
                      position: absolute;
                      bottom: -3px;
                      left: 0;
                      }
                      i:nth-child(2) {
                        width: 12px;
                        background: #7ED321FF;
                      }
                    }
                  }
                }
              }
              .text {
                padding-top: 16px;
                width: 360px;
                font-weight: 500;
              }
            }
          }
        }
        .swiper-container {
          width: 100%;
          height: 100%;
          .swiper-wrapper {
            width: 100%;
            height: 100%;
            .swiper-slide {
              width: 100%;
              height: 256px;
            }
          }
        }
      }
    }
  }
}

</style>
