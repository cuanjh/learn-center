<template>
  <div class="vip-home">
      <div class="vip-header">
        <div class="header-img"></div>
        <div class="title">
          <p>成为 VIP 会员，加快学习速度</p>
          <p>借助 VIP 会员资格解锁完整的语言学习之旅</p>
        </div>
      </div>
    <div class="vip-container">
      <div class="vip-content">
        <!-- 介绍vip会员福利 -->
        <div class="introduce">
          <div class="introduce-title">
            <p>解锁以下所有功能以及更多其他实用功能</p>
            <p>获得各种专享功能的访问权限，从离线模式到由母语使用者提供反馈的对话功能。用不了多久您就能说出一口流利的外语！</p>
          </div>
          <!-- vip选项 -->
          <div class="vip-lists">
            <div class="lists-content">
              <!-- <div class="lists" v-show="false">
                <div class="list-header">
                  <p class="name">比较免费选项和 VIP 选项</p>
                  <div class="free">
                    <span>免费</span>
                    <span>VIP</span>
                  </div>
                </div>
                <div class="list-items">
                  <ul>
                    <li v-for='(item, index) in items' :key="index">
                      <div class="session">
                        <div class="icon-content"><i class="icon"></i></div>
                        <div class="title"><span>{{ item.red }}</span></div>
                      </div>
                      <div class="pitch">
                        <div class="icon-blue"></div>
                        <div class="icon-green"></div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div> -->
            </div>
          </div>
        </div>
        <!-- 激活码激活会员 -->
        <div class="activation-code">
          <div class="title">通过激活码升级</div>
          <div class="code">
            <input type="text" placeholder="输入激活码" v-model="codeNum">
            <button class="button" v-bind:disabled="codeNum == ''" @click='showConfirm()'>立即激活</button>
          </div>
        </div>
        <!-- 选择合适的计划 -->
        <div class="project">
          <div class="project-header">
            <div class="title">选择合适的计划来帮助您学习</div>
          </div>
          <div class="project-content">
            <div class="cards-list">
              <ul>
                <li v-for='(item, index) in productList' :key="index">
                  <div class="cards">
                    <p class="title">BASIC</p>
                    <div class="price">
                      <span>¥</span>
                      <span>{{ item.money }}</span>
                      <span>/mo</span>
                    </div>
                    <div class="expect">
                      <span>{{ item.product }}个月有效期</span>
                    </div>
                    <div class="button">
                      <p @click="goBuy(item)">
                        <span>立即购买</span>
                        <i></i>
                      </p>
                    </div>
                    <span class="hint" v-show="recommand === index">76%的人会选</span>
                    <span class="green" v-show="value === index">最优惠</span>
                  </div>
                </li>
              </ul>
            </div>
            <!-- 下面内容区 -->
            <div class="bottom-content">
              <div class="title">
                <i></i>
                <span>会员常见的问题</span>
              </div>
              <div class="course-list">
                <ul>
                  <li>
                    <div class="referral">
                      <p>
                        <span>VIP会员能否免费学习所学语种相关的电台课程？</span>
                        <i></i>
                      </p>
                    </div>
                  </li>
                  <li>
                    <div class="referral">
                      <p>
                        <span>VIP会员能否支持学币、优惠券优惠购买？</span>
                        <i></i>
                      </p>
                    </div>
                  </li>
                  <li>
                    <div class="referral">
                      <p>
                        <span>VIP会员能否叠加优惠券、学币、邀请码使用呢？</span>
                        <i></i>
                      </p>
                    </div>
                  </li>
                  <li>
                    <div class="referral">
                      <p>
                        <span>VIP会员本身提供购课折扣让利、免费课、免费阅读等丰富特权，故在购买VIP会员时不支持学币、优惠券等优惠抵扣。</span>
                        <i></i>
                      </p>
                    </div>
                  </li>
                </ul>
                <div class="phone">
                  <div class="phone-num">
                    <i></i>
                    <span>400 068 8056</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- 他们是这样说的 -->
            <div class="other-say">
              <div class="other-content">
                <div class="text">
                  <p>他们是这样说的</p>
                  <p>在过去的一段时间里我们陆续收到了很多国家的语言学习者发来的e-mail，留言和信件！</p>
                </div>
                <div class="other-lists">
                  <ul>
                    <li>
                      <div class="people-img">
                        <img src="https://uploadfile1.talkmate.com/uploadfiles/avatar/5b74e4432152c797519a092a/5b74e4432152c797519a092a.jpg?hash=FlbsyYkEr9WFXYJD0n7SfjqP1nWI" alt="动态头像">
                        <div class="country">
                          <img src="https://uploadfile1.talkmate.com/uploadfiles/avatar/5b74e4432152c797519a092a/5b74e4432152c797519a092a.jpg?hash=FlbsyYkEr9WFXYJD0n7SfjqP1nWI" alt="国家">
                        </div>
                      </div>
                      <div class="nickname">
                        <p>宫本はるか</p>
                        <p>英语</p>
                      </div>
                    </li>
                    <li>
                      <div class="people-img">
                        <img src="https://uploadfile1.talkmate.com/uploadfiles/avatar/5b74e4432152c797519a092a/5b74e4432152c797519a092a.jpg?hash=FlbsyYkEr9WFXYJD0n7SfjqP1nWI" alt="动态头像">
                        <div class="country">
                          <img src="https://uploadfile1.talkmate.com/uploadfiles/avatar/5b74e4432152c797519a092a/5b74e4432152c797519a092a.jpg?hash=FlbsyYkEr9WFXYJD0n7SfjqP1nWI" alt="国家">
                        </div>
                      </div>
                      <div class="nickname">
                        <p>宫本はるか</p>
                        <p>英语</p>
                      </div>
                    </li>
                    <li>
                      <div class="people-img">
                        <img src="https://uploadfile1.talkmate.com/uploadfiles/avatar/5b74e4432152c797519a092a/5b74e4432152c797519a092a.jpg?hash=FlbsyYkEr9WFXYJD0n7SfjqP1nWI" alt="动态头像">
                        <div class="country">
                          <img src="https://uploadfile1.talkmate.com/uploadfiles/avatar/5b74e4432152c797519a092a/5b74e4432152c797519a092a.jpg?hash=FlbsyYkEr9WFXYJD0n7SfjqP1nWI" alt="国家">
                        </div>
                      </div>
                      <div class="nickname">
                        <p>宫本はるか</p>
                        <p>英语</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import Vue from 'vue'
import { mapState, mapActions, mapMutations } from 'vuex'
import Bus from '../../../bus.js'
import LogCollect from '../../../tool/logCollect'
// import I18nLocales from '../../../vueI18/locale'

export default {
  data () {
    return {
      // items: I18nLocales[Vue.config.lang].vip.left.tips,
      recommand: 2,
      value: 3,
      codeNum: ''
    }
  },
  components: {
  },
  created () {
    Bus.$on('settingUpdate', (type) => {
      this.confirmCard(type)
    })
  },
  mounted () {
    this.getMemberProductsList()
    console.log('会员列表卡片充值', this.productList)
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
      productList: state => state.user.productList
    }),
    ui () {
      let ui = this.userInfo
      if (Object.keys(ui).length === 0) {
        ui = JSON.parse(sessionStorage.getItem('userInfo'))
      }
      return ui
    }
  },
  methods: {
    ...mapMutations({
    }),
    ...mapActions({
      getMemberCard: 'user/getMemberCard', // 激活码激活接口
      getMemberProductsList: 'user/getMemberProductsList'
    }),
    // 提示用户的信息不完整
    alertMessage (msg) {
      let obj = {
        className: 'warnIcon',
        description: `${msg}`,
        btnDesc: '确定',
        isLink: false
      }
      Bus.$emit('showCommonModal', obj)
    },
    // 提示激活
    alertConfirm (confirm) {
      let obj = {
        className: 'warnIcon',
        buttonClass: 'buttonClass',
        description: `你确定要激活吗？`,
        btnCancel: '取消',
        btnDesc: '确定',
        isLink: false,
        emitMethod: confirm
      }
      Bus.$emit('showCommonModal', obj)
    },
    goBuy (item) {
      let OBJ = item
      let jsonStr = JSON.stringify(OBJ)
      localStorage.setItem('userBuy', jsonStr)
      this.$router.push({
        path: '/app/vip-user-buy'
      })
    },
    // 激活码激活
    showConfirm () {
      console.log('确定激活码？', this.codeNum)
      var _memberType = this.ui.member_info.member_type
      // this.$refs.alert.$emit('UserVipCode', this.activateNum)
      this.getMemberCard(this.codeNum).then((res) => {
        console.log('激活码返回', res)
        if (res.success) {
          this.alertConfirm(res.member_info.money)
          // LogCollect.payMemberCard(
          //   _memberType,
          //   this.codeNum,
          //   1,
          //   res.member_info.money
          // )
        } else {
          this.alertMessage(res.errorMsg)
          LogCollect.payMemberCard(_memberType, this.codeNum, 0, 0)
        }
      })
      // if (!this.codeNum) {
      //   return
      // }
      // this.alertMessage('你确定使用激活码激活会员？')
      // this.$refs.alert.$emit('ifConfirmShow', true)
    },
    confirmCard (money) {
      var _memberType = this.ui.member_info.member_type
      LogCollect.payMemberCard(
        _memberType,
        this.codeNum,
        1,
        money
      )
    }
  }
}
</script>
<style lang="less" scoped>
.vip-home {
  width: 100%;
  .vip-header {
    position: relative;
    .header-img {
      width: 100%;
      height: 360px;
      background: url('../../../../static/images/vipUpgrade/header.jpeg') no-repeat center;
      background-size: cover;
    }
    .title {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      margin-bottom: 10px;
      p:nth-child(1) {
        font-size:28px;
        font-family:PingFang-SC-Bold;
        font-weight:bold;
        color:rgba(255,255,255,1);
        text-align: center;
      }
      p:nth-child(2) {
        font-size:14px;
        font-family:PingFang-SC-Medium;
        font-weight:500;
        color:rgba(255,255,255,1);
        text-align: center;
      }
    }
  }
  // 内容区
  .vip-container {
    width: 100%;
    .vip-content {
      width: 100%;
      // 介绍会员福利
      .introduce {
        margin-top: 80px;
        width: 100%;
        height: 610px;
        background: #ffffff;
        padding: 73px 120px 0;
        .introduce-title {
          p:nth-child(1) {
            font-size:24px;
            font-family:PingFang-SC-Bold;
            font-weight:bold;
            color:rgba(51,51,51,1);
            margin-bottom: 8px;
          }
          p:nth-child(1) {
            font-size:14px;
            font-family:PingFang-SC-Medium;
            font-weight:500;
            color:rgba(51,51,51,1);
          }
        }
        .vip-lists {
          margin-top: 12px;
          width: 100%;
          height: 530px;
          height:530px;
          background:rgba(255,255,255,1);
          box-shadow:0px 6px 16px 0px rgba(0,51,86,0.12);
          border:1px solid rgba(233,237,239,1);
          .lists-content {
            width: 100%;
            padding: 37px 128px 37px 60px;
            .lists {
              width: 100%;
              .list-header {
                width: 100%;
                display: flex;
                justify-content: space-between;
                padding-bottom: 15px;
                border-bottom: 1px solid rgb(228, 229, 230);
                .name {
                  font-size:14px;
                  font-family:PingFangSC-Semibold;
                  font-weight:600;
                  color:rgba(51,51,51,1);
                }
                .free {
                  font-size:14px;
                  font-family:PingFangSC-Semibold;
                  font-weight:600;
                  color:rgba(51,51,51,1);
                  padding-right: 9px;
                  span:nth-child(1) {
                    margin-right: 84px;
                  }
                }
              }
              .list-items {
                width: 100%;
                margin-top: 42px;
                height: 375px;
                overflow-y: scroll;
                ul {
                  li {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 14px;
                    align-items: center;
                    .session {
                      display: flex;
                      width: 60%;
                      align-items: center;
                      .icon-content {
                        position: relative;
                        width: 34px;
                        height: 34px;
                        margin-right: 20px;
                        i {
                          display: inline-block;
                          position: absolute;
                          top: 50%;
                          left: 50%;
                          transform: translate(-50%, -50%);
                          width: 20px;
                          height: 20px;
                          background-image: url('../../../../static/images/learn/learn-diqiu.svg');
                          background-position: center;
                          background-repeat: no-repeat;
                          background-size: cover;
                        }
                      }
                      .title {
                        font-size:14px;
                        font-family:PingFang-SC-Medium;
                        font-weight:500;
                        color:rgba(51,51,51,1);
                      }
                    }
                    .pitch {
                      display: flex;
                      justify-content: space-between;
                      width: 140px;
                      .icon-blue {
                        width: 20px;
                        height: 20px;
                        background: url('../../../../static/images/vipUpgrade/blue.svg') no-repeat center;
                        background-size: cover;
                      }
                      .icon-green {
                        width: 20px;
                        height: 20px;
                        background: url('../../../../static/images/vipUpgrade/green.svg') no-repeat center;
                        background-size: cover;
                      }
                    }
                  }
                  li:nth-child(1) .session .icon{
                    background-image: url('../../../../static/images/learn/learn-diqiu.svg');
                  }
                  li:nth-child(2) .session .icon{
                    background-image: url('../../../../static/images/learn/learn-youxian.svg');
                  }
                  li:nth-child(3) .session .icon{
                    width: 17px;
                    height: 14px;
                    background-image: url('../../../../static/images/learn/learn-tingli.svg');
                  }
                  li:nth-child(4) .session .icon{
                    background-image: url('../../../../static/images/learn/learn-kouyu.svg');
                  }
                  li:nth-child(5) .session .icon{
                    width: 18px;
                    height: 16px;
                    background-image: url('../../../../static/images/learn/learn-yuedu.svg');
                  }
                  li:nth-child(6) .session .icon{
                    background-image: url('../../../../static/images/learn/learn-gangbi.svg');
                  }
                  li:nth-child(7) .session .icon{
                    width: 17px;
                    background-image: url('../../../../static/images/learn/learn-dengpao.svg');
                  }
                  li:nth-child(8) .session .icon{
                    width: 19px;
                    background-image: url('../../../../static/images/learn/learn-tingshuo.svg');
                  }
                  li:nth-child(9) .session .icon{
                    height: 17px;
                    background-image: url(../../../../static/images/learn/learn-huangguan-red.svg);
                  }
                  li:nth-child(10) .session .icon{
                    background-image: url(../../../../static/images/learn/learn-jiangpai.svg);
                  }
                  li:nth-child(11) .session .icon{
                    background-image: url(../../../../static/images/learn/learn-pengyouquan.svg);
                  }
                  li:nth-child(12) .session .icon{
                    background-image: url(../../../../static/images/learn/learn-fanyi.svg);
                  }
                  li:nth-child(13) .session .icon{
                    width: 21px;
                    height: 16px;
                    background-image: url(../../../../static/images/learn/learn-xiazai.svg);
                  }
                  li:nth-child(14) .session .icon{
                    width: 22px;
                    height: 16px;
                    background-image: url(../../../../static/images/learn/learn-pingfen.svg);
                  }
                  li:nth-child(15) .session .icon{
                    width: 24px;
                    height: 13px;
                    background-image: url(../../../../static/images/learn/learn-diy.svg);
                  }
                }
              }
              /*滚动条样式*/
              .list-items::-webkit-scrollbar {/*滚动条整体样式*/
                width: 8px;     /*高宽分别对应横竖滚动条的尺寸*/
                height: 4px;
              }
              .list-items::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
                border-radius: 5px;
                -webkit-box-shadow: inset 0 0 5px #fff;
                background: #fff;
              }
              .list-items::-webkit-scrollbar-track {/*滚动条里面轨道*/
                -webkit-box-shadow: inset 0 0 5px rgba(255,255,255,1);
                border-radius: 0;
                background: rgba(255,255,255,1);
              }
            }
          }
        }
      }
      // 激活码激活会员
      .activation-code {
        width: 100%;
        margin-top: 121px;
        padding: 0 120px;
        text-align: center;
        .title {
          font-size:24px;
          font-family:PingFang-SC-Bold;
          font-weight:bold;
          color:rgba(51,51,51,1);
        }
        .code {
          margin: 16px auto 0;
          input {
            width:351px;
            height:36px;
            background:rgba(255,255,255,1);
            border-radius:18px 0px 0px 18px;
            border:1px solid rgba(176,188,192,1);
            padding: 6px 20px;
          }
          .button {
            // cursor: pointer;
            width: 121px;
            height: 36px;
            font-size:15px;
            font-family:PingFang-SC-Bold;
            font-weight:bold;
            color:rgba(0,42,91,1);
            background:rgba(216,222,225,1);
            border-radius:0px 18px 18px 0px;
            border:1px solid rgba(176,188,192,1);
          }
          .button:disabled {
            cursor: not-allowed;
            background:rgba(200,212,219,1);
          }
        }
      }
      // 卡片
      .project {
        width: 100%;
        background: #ffffff;
        border-bottom: 1px solid #6A878E47;
        .project-header {
          background: rgba(246,248,249);
          padding: 54px 0 190px;
          text-align: center;
          .title {
            font-size:24px;
            font-family:PingFang-SC-Bold;
            font-weight:bold;
            color:rgba(51,51,51,1);
          }
        }
        .project-content {
          padding: 0 120px;
          position: relative;
          width: 100%;
          .cards-list {
            width: 100%;
            margin-top: -140px;
            ul {
              width: 100%;
              display: flex;
              justify-content: space-between;
              li {
                overflow: hidden;
                position: relative;
                width: 23%;
                background:rgba(255,255,255,1);
                box-shadow:0px 6px 16px 0px rgba(0,51,86,0.12);
                border-radius:5px;
                border:1px solid rgba(208,221,228,1);
                .cards {
                  padding: 52px 32px 33px;
                  .title {
                    text-align: center;
                  }
                  .price {
                    padding-top: 41px;
                    position: relative;
                    text-align: center;
                    span:nth-child(1) {
                      font-size:26px;
                      font-family:PingFang-SC-Medium;
                      font-weight:500;
                      color:rgba(144,162,174,1);
                    }
                    span:nth-child(2) {
                      font-size:70px;
                      font-family:DINCondensed-Bold;
                      font-weight:bold;
                      color:rgba(0,42,91,1);
                    }
                    span:nth-child(3) {
                      position: absolute;
                      bottom: 25px;
                      font-size:16px;
                      font-family:PingFang-SC-Bold;
                      font-weight:bold;
                      color:rgba(144,162,174,1);
                      text-align: bottom;
                    }
                  }
                  .expect {
                    width: 100%;
                    text-align: center;
                    padding: 45px 0 80px;
                    span {
                      font-size:14px;
                      font-family:PingFangSC-Regular;
                      font-weight:400;
                      color:rgba(0,42,91,1);
                    }
                  }
                  .button {
                    cursor: pointer;
                    width:160px;
                    height:36px;
                    background:rgba(42,159,228,1);
                    border-radius:20px;
                    margin: 0 auto;
                    text-align: center;
                    line-height: 36px;
                    p {
                      display: inline-block;
                      span {
                        font-size:14px;
                        font-family:PingFangSC-Semibold;
                        font-weight:600;
                        color:rgba(255,255,255,1);
                        margin-right: 10px;
                      }
                      i {
                        display: none;
                        width: 20px;
                        height: 20px;
                        background: url('../../../../static/images/authLogin/going.svg') no-repeat center;
                        background-size: cover;
                        float: right;
                        margin-top: 8px;
                      }
                    }
                    &:hover p i {
                      display: block;
                      transition: padding-right 218ms ease;
                    }
                  }
                  .hint {
                    display: inline-block;
                    width: 150px;
                    height: 86px;
                    color: #fff;
                    line-height: 144px;
                    text-align: center;
                    background-color: #FFBE29FF;
                    position: absolute;
                    top: -23px;
                    right: -54px;
                    font-size: 12px;
                    transform: rotate(45deg);
                    padding: 0 24px;
                  }
                  .green {
                    display: inline-block;
                    width: 150px;
                    height: 86px;
                    color: #fff;
                    line-height: 144px;
                    text-align: center;
                    background-color: #91D249FF;
                    position: absolute;
                    top: -23px;
                    right: -54px;
                    font-size: 12px;
                    transform: rotate(45deg);
                    padding: 0 24px;
                  }
                }
              }
              li:nth-child(3) {
                border:1px solid rgba(255,190,41,1);
              }
              li:nth-child(4) {
                border:1px solid rgba(208,221,228,1);
              }
            }
          }
          .bottom-content {
            width: 100%;
            margin-top: 112px;
            .title {
              i {
                display: inline-block;
                width: 52px;
                height: 52px;
                background: url('../../../../static/images/vipUpgrade/icon.svg') no-repeat center;
                background-size: cover;
              }
              span {
                font-size:28px;
                font-family:PingFang-SC-Bold;
                font-weight:bold;
                color:rgba(51,51,51,1);
                line-height: 52px;
              }
            }
            .course-list {
              width: 100%;
              background:rgba(255,255,255,1);
              border-radius:8px;
              border:4px solid rgba(238,243,246,1);
              margin-top: 15px;
              ul {
                padding: 57px 100px;
                li {
                  padding: 14px 0;
                  border-bottom: 1px solid #DEE6EBFF;
                  .referral {
                    width: 100%;
                    p {
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                      font-size:14px;
                      font-family:PingFang-SC-Medium;
                      font-weight:500;
                      color:rgba(51,51,51,1);
                      span {
                        display: inline-block;
                        width: 95%;
                      }
                      i {
                        display: inline-block;
                        width: 6px;
                        height: 12px;
                        background: url('../../../../static/images/go.svg') no-repeat center;
                        background-size: cover;
                      }
                    }
                  }
                }
              }
              .phone {
                width: 100%;
                padding-bottom: 24px;
                .phone-num {
                  width: 100%;
                  text-align: center;
                  i {
                    display: inline-block;
                    width: 60px;
                    height: 60px;
                    background: url('../../../../static/images/vipUpgrade/blue.svg') no-repeat center;
                    background-size: 100%;
                  }
                  span {
                    font-size:16px;
                    font-family:PingFang-SC-Bold;
                    font-weight:bold;
                    color:rgba(51,51,51,1);
                    line-height: 60px;
                  }
                }
              }
            }
          }
          .other-say {
            padding: 183px 0;
            width: 100%;
            .other-content {
              width: 100%;
              .text {
                p:nth-child(1) {
                  font-size:24px;
                  font-family:PingFang-SC-Medium;
                  font-weight:500;
                  color:rgba(16,48,68,1);
                }
                p:nth-child(2) {
                  font-size:18px;
                  font-family:PingFang-SC-Regular;
                  font-weight:400;
                  color:rgba(60,91,111,1);
                }
              }
              .other-lists {
                width: 100%;
                margin-top: 44px;
                ul {
                  display: flex;
                  justify-content: space-between;
                  li {
                    width: 33%;
                    display: flex;
                    align-items: center;
                    .people-img {
                      position: relative;
                      width: 64px;
                      height: 64px;
                      margin-right: 15px;
                      img {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                      }
                      .country {
                        position: absolute;
                        right: 0;
                        bottom: 0;
                        width: 14px;
                        height: 14px;
                        border-radius: 50%;
                        img {
                          width: 100%;
                          height: 100%;
                        }
                      }
                    }
                    .nickname {
                      p:nth-child(1) {
                        font-size:17px;
                        font-family:PingFang-SC-Bold;
                        font-weight:bold;
                        color:rgba(51,51,51,1);
                      }
                      p:nth-child(2) {
                        font-size:13px;
                        font-family:PingFang-SC-Medium;
                        font-weight:500;
                        color:rgba(184,184,184,1);
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
