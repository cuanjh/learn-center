<template>
  <div class="introduce-app">
    <div class="introduce-home">
      <!-- 上部分 -->
      <div class="introduce-header">
        <div class="bg-img"></div>
        <div class="bg-img2"></div>
        <div class="text">
          <p>Where did you go to learn where?</p>
          <p>Talkmate-Global says mobile applications support offline downloading of learning language courses, and related radio courses are played in one click, allowing you to learn anytime, anywhere, and 5 times more efficient than traditional foreign language learning!</p>
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
          <p>屡获殊荣的多语言学习平台</p>
          <div class="learn-icon">
            <i class="red-icon"></i>
            <i class="blue-icon"></i>
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
                  <p>最nice的全球说的电台配套课程了，讲解透彻易懂，还更多了解了很多语种所在国家的风情文化！还有很多国外的同学，一起聊天一起分享各自的履历！</p>
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
                  <p>在固定的时间在web端学习，沉浸感很强！移动APP的应用场景更加丰富，使用入门相对简单，两端结合学习，灵活也高效。</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    goDownLoadIos () {
      window.open('https://itunes.apple.com/cn/app/%E5%85%A8%E7%90%83%E8%AF%B4-talkmate-%E8%8B%B1%E8%AF%AD%E6%97%A5%E8%AF%AD%E9%9F%A9%E8%AF%AD%E7%AD%89%E8%AF%AD%E8%A8%80%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B/id959231176?mt=8')
    },
    goDownLoadGoogle () {
      window.open('https://play.google.com/store/apps/details?id=com.kuyu')
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
      .bg-img {
        width: 100%;
        height: 344px;
        background: url('../../../../static/images/introduceApp/headimg.png') no-repeat center;
        background-size: cover;
      }
      .text {
        width: 1200px;
        display: flex;
        flex-direction: column;
        padding-top: 75px;
        position: absolute;
        margin: auto;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        p {
          width: 700px;
          font-size: 14px;
          color: #ffffff;
          line-height: 20px;
        }
        p:nth-child(1) {
          font-size: 32px;
          font-weight: bold;
          line-height: 46px;
        }
      }
    }
    // 精品推荐
    .quality-goods {
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
          background: url('../../../../static/images/mini.svg') no-repeat center;
          background-size: 100%;
          margin-right: 27px;
        }
        .iphone {
          width: 71px;
          height: 141px;
          background: url('../../../../static/images/introduceApp/iPhone.png') no-repeat center;
          background-size: 100%;
          margin-right: 58px;
        }
        .icon {
          width: 142px;
          height: 99px;
          background: url('../../../../static/images/introduceApp/icon.png') no-repeat center;
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
            background: url('../../../../static/images/introduceApp/iosapp.png') no-repeat center;
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
            background: url('../../../../static/images/introduceApp/google.png') no-repeat center;
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
            background: url('../../../../static/images/introduceApp/androoid.png') no-repeat center;
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
            font-family: PingFang-SC;
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
                      font-family: PingFang-SC;
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
          .red-icon {
            display: inline-block;
            width: 235px;
            height: 146px;
            margin-right: 99px;
            background: url('../../../../static/images/redlearn.png') no-repeat center;
            background-size: cover;
          }
          .blue-icon {
            display: inline-block;
            width: 151px;
            height: 135px;
            background: url('../../../../static/images/bluelearn.png') no-repeat center;
            background-size: cover;
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
          width: 100%;
          margin-top: 56px;
          ul {
            width: 100%;
            display: flex;
            li {
              display: inline-block;
              box-shadow: 0px 3px 8px 0px #0A2B4014;
              padding: 54px 110px;
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
                width: 384px;
                font-weight: 500;
              }
            }
          }
        }
      }
    }
  }
}
</style>
