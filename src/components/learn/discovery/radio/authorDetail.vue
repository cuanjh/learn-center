<template>
  <div class="author">
    <div class="author-top">
      <div class="author-top-content">
        <div class="author-img">
          <img :src="authorInfo.photo" alt="作者头像">
          <i class="vip-img" v-show="authorInfo.is_member == true"></i>
        </div>
        <div class="author-text">
          <p class="nickname"><span>{{authorInfo.nickname}}</span></p>
          <div class="cont">
            <div class="bg">
              <i class="gender" v-if="authorInfo.gender === 'female'"></i>
              <i class="man" v-else></i>
            </div>
            <div class="location">
              <i></i>
              <span>{{authorInfo.country_name}}</span>
            </div>
          </div>
          <div class="dialogue">
            <p class="talk" v-show="false">
              <span><i></i>对话</span>
            </p>
            <p class="follow" @click="relation()">
              <a v-if="authorInfo.has_followed === false"><i></i>关注</a>
              <a v-else>已关注</a>
            </p>
          </div>
          <div class="introduce">
            <span>{{authorInfo.description}}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 下面的电台列表 动态列表-->
    <div class="author-radio">
      <div class="tab-item">
        <span v-bind:class="{'active': 'authorInfo' == tabFlag}" @click="tabChange('authorInfo')">个人信息</span>
        <span v-bind:class="{'active': 'radios' == tabFlag}" @click="tabChange('radios')">他的电台</span>
      </div>
      <div class="author-content">
        <div class="author-content-box" v-if="'authorInfo' == tabFlag">
          <div class="lists">
            <div class="personal-dynamic">
              <div class="content">
                <p>个人动态</p>
                <p><span>{{feedInfos.length}}</span></p>
                <p v-show="false"><span>查看他的动态</span></p>
              </div>
            </div>
            <div class="personal-dynamic">
              <div class="content">
                <p>他的粉丝</p>
                <p><span>{{authorInfo.be_followed_num}}</span></p>
                <p v-show="false"><i></i><span></span></p>
              </div>
            </div>
            <div class="personal-dynamic">
              <div class="content">
                <p>他的关注</p>
                <p><span>{{authorInfo.follow_num}}</span></p>
                <p v-show="false"><span>关注他们</span></p>
              </div>
            </div>
          </div>
          <div class="author-details">
            <div class="author-lists">
              <ul>
                <li>
                  <div class="item">
                    <p class="text">
                      <span>国家/地区：</span>
                      <span>{{authorInfo.country_name}}</span>
                    </p>
                  </div>
                </li>
                <li>
                  <div class="item">
                    <p class="text">
                      <span>全球说ID：</span>
                      <span>{{authorInfo.talkmate_id}}</span>
                    </p>
                  </div>
                </li>
                <li>
                  <div class="item">
                    <p class="text">
                      <span>年龄：</span>
                      <span>{{authorInfo.age}}岁</span>
                    </p>
                  </div>
                </li>
                 <li>
                  <div class="item">
                    <p class="text">
                      <span>金币：</span>
                      <span>{{authorInfo.coins}}</span>
                    </p>
                  </div>
                </li>
                 <li>
                  <div class="item">
                    <p class="text">
                      <span>性别：</span>
                      <span>{{authorInfo.gender == 'female'?'女':'男'}}</span>
                    </p>
                  </div>
                </li>
                 <li>
                  <div class="item">
                    <p class="text">
                      <span>会员：</span>
                      <span>{{authorInfo.is_member == false?'非会员':'VIP'}}</span>
                    </p>
                  </div>
                </li>
                 <li>
                  <div class="item">
                    <p class="text">
                      <span>精通语种：</span>
                      <span>{{language}}</span>
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="talkmate-img">
            <p></p>
          </div>
        </div>
        <div class="author-content-box" v-if="'radios' == tabFlag">
          <author-radios :radios="radios"></author-radios>
          <!-- 展开全部 -->
          <div class="up-all" v-if="radios.length > 0">
            <span v-if="showPage === -1">已显示全部内容</span>
            <span @click="loadMoreRadio()" v-else>全部展开<i></i></span>
          </div>
          <div class="author-describe-content" v-else>
            <i></i>
            <span>这个人比较懒没有制作电台</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import authorItem from './authorItem'
import Bus from '../../../../bus'
// import $ from 'jquery'
import AuthorRadios from './authorRadios.vue'

export default {
  data () {
    return {
      nolockTestCheckShow: false,
      flag: true,
      type: 0, // 正常 1回复
      tabFlag: 'authorInfo', // authorInfo个人信息 radios他的电台
      authorInfo: {}, // 作者信息
      language: '', // 精通语言
      userId: '',
      radios: [], // 电台列表
      page: 1,
      tips: '',
      number: 2,
      showPage: 0
    }
  },
  components: {AuthorRadios, authorItem},
  computed: {
    ...mapState({
      feedInfos: state => state.course.feedInfos, // 动态列表
      userInfo: state => state.userInfo // 用户信息
    }),
    isVip () {
      if (!this.userInfo.member_info) {
        return 0
      }
      return this.userInfo.member_info.member_type
    }
  },
  mounted () {
    let _this = this
    _this.userId = _this.$route.params.userId
    console.log('userId', _this.userId)
    // 作者信息
    _this.getAuthorDetail({ partner_user_id: _this.userId }).then(data => {
      console.log('作者信息', data)
      _this.authorInfo = data.detail
      _this.language = data.detail.language_skill.length > 0 ? data.detail.language_skill.join(',') : '暂无'
      console.log('authorInfo', _this.authorInfo)
      console.log('language', _this.language)
    })
    // 作者电台列表
    _this.getRadioAuthorList({ partner_user_id: _this.userId, page: _this.page }).then((data) => {
      console.log('电台列表', data)
      if (data.data.radios) {
        _this.radios = data.data.radios
      }
      if (data.data.page === -1) {
        _this.showPage = -1
      }
    })
    // 作者动态列表
    _this.getRadioAuthorDynamic({ partner_user_id: _this.userId, page: _this.page, has_homework: 'Y' })
  },
  methods: {
    ...mapActions({
      getAuthorDetail: 'course/getAuthorDetail', // 作者的详情
      getRadioRelationFollow: 'course/getRadioRelationFollow', // 关注
      remRadioRelationCancel: 'course/remRadioRelationCancel', // 取消关注
      getRadioAuthorList: 'course/getRadioAuthorList', // 作者电台列表
      getRadioAuthorDynamic: 'course/getRadioAuthorDynamic' // 作者的动态
    }),
    // 电台和动态的bunner切换
    tabChange (tab) {
      this.tabFlag = tab
    },
    // 关注
    relation () {
      if (!this.userInfo) {
        Bus.$emit('showGoLoginBox')
        return
      }
      let _this = this
      let followId = _this.authorInfo.user_id
      if (_this.authorInfo.has_followed === true) { // 关注了
        console.log('关注了')
        _this.remRadioRelationCancel({following_id: followId}).then((data) => {
          console.log('取消关注', data)
          if (data.success === true) {
            // _this.text = '关注'
            _this.authorInfo.has_followed = false
          }
        })
      } else if (_this.authorInfo.has_followed === false) { // 没关注
        console.log('没关注')
        _this.getRadioRelationFollow({following_id: followId}).then((data) => {
          console.log('关注', data)
          if (data.success === true) {
            // _this.text = '取消关注'
            _this.authorInfo.has_followed = true
          }
        })
      }
    },
    // 点击加载更多
    loadMoreRadio () {
      if (this.showPage === -1) {
        return false
      }
      this.page++
      this.getRadioAuthorList({ partner_user_id: this.$route.params.userId, page: this.page }).then((res) => {
        console.log('电台列表', res)
        if (res.data.radios) {
          this.radios = this.radios.concat(res.data.radios)
        }
        if (res.data.page === -1) {
          this.showPage = res.data.page
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.author {
  width: 100%;
  .author-top {
    width: 100%;
    background: #ffffff;
    .author-top-content {
      width: 1200px;
      display: flex;
      padding: 42px 129px 33px;
      margin: 0 auto;
      .author-img {
        position: relative;
        width: 108px;
        height: 108px;
        margin-right: 30px;
        border-radius: 50%;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 5px solid #EEF2F3;
          object-fit: cover;
        }
        .vip-img {
          position: absolute;
          bottom: -4px;
          left: 50%;
          margin-left: -30px;
          display: inline-block;
          width: 60px;
          height: 20px;
          background: url('../../../../../static/images/authorVIP.svg') no-repeat center;
          background-size: cover;
        }
      }
      .author-text {
        font-size:13px;
        font-family:PingFang-SC-Medium;
        font-weight:500;
        color:rgba(144,162,174,1);
        .nickname {
          font-size: 24px;
          font-weight:bold;
          color:rgba(10,43,64,1);
        }
        i {
          display: inline-block;
          width: 10px;
          height: 10px;
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
        }
        .cont {
          display: flex;
          padding-top: 3px;
          .bg {
            display: flex;
            align-items: center;
            .gender {
              background-image: url('../../../../../static/images/authorfemale.svg');
            }
            .man {
              background-image: url('../../../../../static/images/authorman.svg');
            }
          }
          .location {
            display: flex;
            align-items: center;
            i {
              background-image: url('../../../../../static/images/authorlocation.svg');
              margin: 0 6px 0 8px;
            }
          }
        }
        .dialogue {
          padding: 9px 0 11px;
          p {
            display: inline-block;
            a {
              padding: 3px 15px;
              font-size:14px;
              font-family:PingFang-SC-Medium;
              font-weight:500;
              color:rgba(255,255,255,1);
              border-radius: 13px;
              display: flex;
              align-items: center;
              background: #2A9FE4FF;
              i {
                background-image: url('../../../../../static/images/authorfllowrit.svg');
                margin-right: 5px;
              }
              &:hover {
                background: #2a9fe4ff;
              }
            }
          }
          .talk {
            background: #C8D4DBFF;
            margin-right: 9px;
            i {
              background-image: url('../../../../../static/images/authordialogue.svg');
              margin-right: 5px;
            }
          }
        }
        .introduce {
          width: 510px;
          font-size:13px;
          font-family:PingFang-SC-Medium;
          font-weight:500;
          color:rgba(144,162,174,1);
          span {
            line-height:18px;
          }
        }
      }
    }
  }
  // 下面内容区域
  .author-radio {
    width: 1200px;
    margin: 0 auto;
    margin-top: 14px;
    // 导航
    .tab-item {
      display: flex;
      padding: 0 129px;
      span {
        cursor: pointer;
        font-size:14px;
        font-family:PingFang-SC-Bold;
        font-weight:bold;
        color:rgba(16,48,68,1);
        line-height: 20px;
        padding: 0 14px 2px;
        margin-right: 44px;
        &.active {
          color: #2A9FE4FF;
          border-bottom: 3px solid #2A9FE4FF;
        }
      }
    }
    // 内容区域
    .author-content {
      position: relative;
      width: 100%;
      background: #ffffff;
      // padding: 0 129px;
      .author-content-box {
        padding: 63px 129px 40px;
        i {
          display: inline-block;
          width: 10px;
          height: 10px;
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
        }
        .lists {
          display: flex;
          justify-content: space-between;
          padding-bottom: 36px;
          border-bottom: 1px solid #EEF2F3FF;
          .personal-dynamic {
            width: 32.5%;
            .content {
              width: 100%;
              padding: 16px 100px;
              background:rgba(246,248,249,.7);
              p {
                text-align: center;
                font-family:PingFang-SC-Medium;
              }
              p:nth-child(1) {
                font-size:14px;
                font-weight:500;
                color:rgba(126,146,159,1);
                line-height:20px;
              }
              p:nth-child(2) {
                font-size:26px;
                font-weight:800;
                color:rgba(10,43,64,1);
                line-height:37px;
                padding: 14px 0 10px;
              }
              p:nth-child(3) {
                cursor: pointer;
                font-size:14px;
                font-weight:800;
                color: #3C5B6FFF;
                line-height:20px;
                i {
                  background-image: url('../../../../../static/images/authorFllow.svg');
                }
                &:hover {
                  color:rgba(5,129,209,1);
                }
              }
            }
          }
        }
        // 作者介绍
        .author-details {
          width: 100%;
          .author-lists {
            width: 100%;
            padding: 36px 0 173px;
            ul {
              display: flex;
              flex-wrap: wrap;
              justify-content: space-between;
              li {
                width: 45%;
                padding-bottom: 12px;
                .item {
                  width: 100%;
                  .text {
                    font-size:14px;
                    font-family:PingFang-SC-Medium;
                    font-weight:500;
                    color:rgba(126,146,159,1);
                    line-height:20px;
                    span:nth-child(2) {
                      color: #0A2B40FF;
                    }
                  }
                }
              }
            }
          }
        }
        // 公司背景图
        .talkmate-img {
          width: 100%;
          p {
            width: 120px;
            height: 18px;
            margin: 0 auto;
            background:url('../../../../../static/images/talkmate-logo.svg') no-repeat center;
            background-size: cover;
          }
        }
      }
      // 点击加载更多
      .up-all {
        position: absolute;
        left: 0;
        bottom: 0;
        cursor: pointer;
        width: 100%;
        background: rgba(221, 221, 221, 0.1);
        text-align: center;
        line-height: 42px;
        font-size: 14px;
        font-family: PingFangSC-Semibold;
        font-weight: 600;
        color: rgba(42, 159, 228, 1);
        span {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        i {
          display: inline-block;
          width: 10px;
          height: 6px;
          background: url("../../../../../static/images/upAll.svg") no-repeat center;
          background-size: cover;
          margin-left: 10px;
        }
        .active {
          display: inline-block;
          width: 10px;
          height: 6px;
          background: url("../../../../../static/images/upAllActive.svg") no-repeat
            center;
          background-size: cover;
          margin-left: 10px;
        }
      }
      // 没电台
      .author-describe-content {
        width: 100%;
        height: 400px;
        display: flex;
        align-items: center;
        flex-direction: column;
        i {
          display: inline-block;
          width: 300px;
          height: 160px;
          background: url('../../../../../static/images/noradios.png') no-repeat center;
          background-size: cover;
        }
        span {
          padding-top: 30px;
          font-size: 24px;
          color: #b8b3b2;
        }
      }
    }
  }
}
</style>
