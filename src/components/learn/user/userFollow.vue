<template>
  <div class="user-follow">
    <div class="user-follow-content">
      <div class="user-follow-nav">
        <a @click="tabChange('follow')" :class="{'active': 'follow' == navFlag}">关注</a>
        <a @click="tabChange('followed')" :class="{'active': 'followed' == navFlag}">粉丝</a>
        <a @click="tabChange('dynamic')" :class="{'active': 'dynamic' == navFlag}">动态</a>
      </div>
      <div class="user-nav-container">
        <div class="user-nav-content">
          <div class="tab-follow" v-show="'follow' == navFlag">
            <ul>
              <li v-for="(item, index) in userFollowingList" :key="index">
                <div class="user-item-content">
                  <div class="left">
                    <div class="user-img">
                      <img @click="goUserDetail(item.user_id)" :src="item.photo" alt="">
                    </div>
                    <div class="description">
                      <a @click="goUserDetail(item.user_id)">{{item.nickname}}</a>
                      <p v-if="item">
                        <span><i></i>{{item.location.country_names[languagueHander] ? item.location.country_names[languagueHander] : '暂无'}}</span>
                        <span>{{jsGetAge(timestamp2Time(item.birthday*1000, '-'))}}岁</span>
                        <span>精通{{item.mother_tongue[0]?item.mother_tongue[0].name[languagueHander]:'暂无'}}</span>
                      </p>
                    </div>
                  </div>
                  <div class="right">
                    <a v-show="false"><span>发消息</span></a>
                    <a @click="cancelAttention(item.user_id)"><span>取消关注</span></a>
                  </div>
                </div>
              </li>
            </ul>
            <div class="up-all" v-if="userFollowing.length>0">
              <div class="up-all-content" v-if="userFollowing.length>5">
                <a @click="loadMoreFollowing()" v-text="showMoreFolllow?'全部展开':'收起'"></a>
                <i v-show="showMoreFolllow"></i>
                <i class="active" v-show="showMoreFolllow === false"></i>
              </div>
              <div v-else>
                <span class="no-show">已经是全部内容了</span>
              </div>
            </div>
            <div class="no-user-following" v-else>
              <dl>
                <dt></dt>
                <dd>
                  <p>你还没有关注的人哦!</p>
                </dd>
              </dl>
            </div>
          </div>
          <div class="tab-following" v-show="'followed' == navFlag">
            <ul>
              <li v-for="(item, index) in userFollowerList" :key="index">
                <div class="user-item-content">
                  <div class="left">
                    <div class="user-img">
                      <img @click="goUserDetail(item.user_id)" :src="item.photo" alt="">
                    </div>
                    <div class="description">
                      <a @click="goUserDetail(item.user_id)">{{item.nickname}}</a>
                      <p v-if="item">
                        <span><i></i>{{item.location.country_names[languagueHander] ? item.location.country_names[languagueHander]:'暂无'}}</span>
                        <span>{{jsGetAge(timestamp2Time(item.birthday*1000, '-'))}}岁</span>
                        <span>精通{{item.mother_tongue[0]?item.mother_tongue[0].name[languagueHander]:'暂无'}}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
            <div class="up-all" v-if="userFollower.length>0">
              <div class="up-all-content" v-if="userFollower.length>10">
                <a @click="loadMoreFollower()" v-text="showMoreFolllower?'全部展开':'收起'"></a>
                <i v-show="showMoreFolllower"></i>
                <i class="active" v-show="showMoreFolllower === false"></i>
              </div>
              <div v-else>
                <span class="no-show">已经是全部内容了</span>
              </div>
            </div>
            <div class="no-user-following" v-else>
              <dl>
                <dt></dt>
                <dd>
                  <p>你还没有粉丝哦!</p>
                </dd>
              </dl>
            </div>
          </div>
          <div class="tab-dynamic" v-show="'dynamic' == navFlag">
            <div class="no-user-following">
              <dl>
                <dt></dt>
                <dd>
                  <p>你还没有动态哦!</p>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import Bus from '../../../bus.js'
import { formatDate } from '../../../tool/date.js'
// import cookie from '../../../tool/cookie'

export default {
  data () {
    return {
      showMoreFolllow: true,
      showMoreFolllower: true,
      navFlag: 'follow',
      userFollower: [],
      userFollowerList: [],
      userFollowing: [],
      userFollowingList: []
    }
  },
  filters: {
    formatDate (time) {
      let date = new Date(time * 1000)
      return formatDate(date, 'yyyy-MM-dd')
    }
  },
  created () {
    Bus.$on('activeUserItem', (e) => {
      console.log('activeUserItem', e)
      this.navFlag = e
    })
  },
  mounted () {
    this.navFlag = this.$route.params.navFlag ? this.$route.params.navFlag : 'follow'
    this.$parent.$emit('activeNavUserItem', this.navFlag)
    this.$parent.$emit('navItem', 'user')
    this.initUserFollowing()
    this.initUserFollower()
  },
  computed: {
    ...mapState({
      levelDes: state => state.course.levelDes,
      languagueHander: state => state.course.languagueHander
    })
  },
  methods: {
    ...mapActions({
      getUserInfo: 'getUserInfo',
      getUserFollowing: 'user/getUserFollowing',
      getUserFollower: 'user/getUserFollower',
      remRadioRelationCancel: 'course/remRadioRelationCancel' // 取消关注
    }),
    timestamp2Time (timestamp, separator) {
      var result = ''
      if (timestamp) {
        // var reg = new RegExp(/\D/, 'g') // 提取数字字符串
        var timestampStr = timestamp
        var d = new Date()
        d.setTime(timestampStr)
        var year = d.getFullYear()
        var month = d.getMonth() + 1
        var day = d.getDate()
        if (month < 10) {
          month = '0' + month
        }
        if (day < 10) {
          day = '0' + day
        }
        result = year + separator + month + separator + day
      }
      return result
    },
    // 根据出生日期算出年龄
    jsGetAge (strBirthday) {
      var returnAge
      var strBirthdayArr = strBirthday.split('-')
      var birthYear = strBirthdayArr[0]
      var birthMonth = strBirthdayArr[1]
      var birthDay = strBirthdayArr[2]
      let d = new Date()
      var nowYear = d.getFullYear()
      var nowMonth = d.getMonth() + 1
      var nowDay = d.getDate()
      if (nowYear === birthYear) {
        returnAge = 0 // 同年 则为0岁
      } else {
        var ageDiff = nowYear - birthYear // 年之差
        if (ageDiff > 0) {
          if (nowMonth === birthMonth) {
            var dayDiff = nowDay - birthDay // 日之差
            if (dayDiff < 0) {
              returnAge = ageDiff - 1
            } else {
              returnAge = ageDiff
            }
          } else {
            var monthDiff = nowMonth - birthMonth // 月之差
            if (monthDiff < 0) {
              returnAge = ageDiff - 1
            } else {
              returnAge = ageDiff
            }
          }
        } else {
          returnAge = -1 // 返回-1 表示出生日期输入错误 晚于今天
        }
      }
      return returnAge // 返回周岁年龄
    },
    // 获取关注的人
    initUserFollowing () {
      this.getUserFollowing().then(res => {
        console.log('关注的列表', res)
        this.userFollowing = res.following
        if (this.showMoreFolllow) {
          this.userFollowingList = res.following.slice(0, 5)
        } else {
          this.userFollowingList = res.following
        }
        console.log('关注的列表', this.userFollowing)
      })
    },
    loadMoreFollowing () {
      this.showMoreFolllow = !this.showMoreFolllow
      this.initUserFollowing()
    },
    // 获取粉丝
    initUserFollower () {
      this.getUserFollower().then(res => {
        console.log('粉丝列表', res)
        this.userFollower = res.follower
        if (this.showMoreFolllower) {
          this.userFollowerList = res.follower.slice(0, 10)
        } else {
          this.userFollowerList = res.follower
        }
        console.log('粉丝列表', this.userFollower)
      })
    },
    loadMoreFollower () {
      this.showMoreFolllower = !this.showMoreFolllower
      this.initUserFollower()
    },
    // 取消关注
    cancelAttention (followId) {
      this.remRadioRelationCancel({following_id: followId}).then((data) => {
        console.log('取消关注', data)
        if (data.success === true) {
          this.initUserFollowing()
          this.getUserInfo()
        }
      })
    },
    // 作者详情页面
    goUserDetail (userId) {
      this.$router.push({
        path: `/app/discovery/author-detail/${userId}`
      })
    },
    tabChange (tabFlag) {
      console.log('tabFlag', tabFlag)
      this.navFlag = tabFlag
      this.$parent.$emit('activeNavUserItem', this.navFlag)
    }
  }
}
</script>
<style lang="less" scoped>
.user-follow {
  width: 100%;
  background: #fff;
  // margin-top: 90px;
  .user-follow-content {
    width: 100%;
    .user-follow-nav {
      width: 100%;
      height: 60px;
      background-color: #ffffff;
      text-align: center;
      font-size: 16px;
      font-weight: 500;
      color: #6d6d6d;
      border-bottom: 1px solid #ededed;
      border-radius: 4px;
      position: relative;
      padding-left: 25px;
      a {
        display: inline-block;
        float: left;
        height: 60px;
        font-size:16px;
        font-family:PingFangSC-Semibold;
        font-weight:500;
        color:#3C5B6FFF;
        text-align: center;
        margin-right: 50px;
        // border-right: 1px solid #EEF2F3;
        line-height: 60px;
        &:hover {
          color: #2A9FE4;
        }
        &.active {
          color: #0581D1;
          font-weight: bold;
          border-bottom: 3px solid #2A9FE4FF;
        }
      }
      a:last-child {
        border-right: 0;
      }
    }
    .user-nav-container {
      width: 100%;
      .user-nav-content {
        .tab-follow,.tab-following,.tab-dynamic {
          width: 100%;
          ul {
            padding: 50px 44px 30px;
            li {
              padding: 20px 0;
              border-bottom: 1px solid #EEF2F3FF;
              .user-item-content {
                display: flex;
                justify-content: space-between;
                .left {
                  display: flex;
                  align-items: center;
                  .user-img {
                    width: 54px;
                    height: 54px;
                    border-radius: 50%;
                    background: #E6EBEEFF;
                    margin-right: 12px;
                    cursor: pointer;
                    img {
                      width: 100%;
                      height: 100%;
                      border-radius: 50%;
                      object-fit: cover;
                    }
                  }
                  .description {
                    p {
                      font-size:14px;
                      font-weight:500;
                      color:rgba(144,162,174,1);
                      padding-top: 8px;
                      span:nth-child(1) {
                        display: inline-block;
                        min-width: 48px;
                        max-width: 68px;
                        overflow: hidden;
                        text-overflow:ellipsis;
                        white-space: nowrap;
                      }
                      span:nth-child(2) {
                        padding: 0 18px;
                      }
                      i {
                        display: inline-block;
                        width: 14px;
                        height: 14px;
                        background-repeat: no-repeat;
                        background-size: cover;
                        background-position: center;
                        background-image: url('../../../../static/images/userInfo/positioning.svg');
                        margin-right: 6px;
                        margin-top: 3px;
                      }
                    }
                    a {
                      display: inline-block;
                      max-width: 200px;
                      font-size:16px;
                      font-weight:bold;
                      color:rgba(10,43,64,1);
                      overflow: hidden;
                      text-overflow:ellipsis;
                      white-space: nowrap;
                      &:hover {
                        color: #2A9FE4FF;
                      }
                    }
                  }
                }
                .right {
                  a {
                    font-size:14px;
                    font-weight:500;
                    color:rgba(126,146,159,1);
                    padding: 3px 20px;
                    border: 1px solid #E6EBEEFF;
                    border-radius: 15px;
                    &:hover {
                      background: #74C105FF;
                      color: #fff;
                    }
                  }
                  a:nth-child(2) {
                    margin-left: 9px;
                    border-color: #B9CDE2FF;
                    &:hover {
                      background: #fff;
                      color: #3C5B6FFF;
                    }
                  }
                }
              }
            }
            li:nth-child(1) {
              padding-top: 0px;
            }
            li:last-child {
              padding-bottom: 0px;
              border: none;
            }
          }
        }
        .tab-following {
          ul {
            display: flex;
            flex-wrap: wrap;
            li {
              width: 50%;
              border-bottom: none;
            }
            li:nth-child(2) {
              padding-top: 0;
            }
          }
        }
      }
    }
    .up-all {
      width: 100%;
      background: rgba(221, 221, 221, .1);
      text-align: center;
      line-height: 42px;
      font-size:14px;
      font-family:PingFangSC-Semibold;
      font-weight:600;
      color:rgba(42,159,228,1);
      a {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      i {
        display: inline-block;
        width: 10px;
        height: 6px;
        background: url('../../../../static/images/upAll.svg') no-repeat center;
        background-size: cover;
        margin-left: 10px;
      }
      .active {
        display: inline-block;
        width: 10px;
        height: 6px;
        background: url('../../../../static/images/upAllActive.svg') no-repeat center;
        background-size: cover;
        margin-left: 10px;
      }
      .up-all-content {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .course-related {
        width: 100%;
        min-height: 445px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        i {
          display: inline-block;
          width: 145px;
          height: 82px;
          background-image: url('../../../../static/images/discovery/language-related.svg');
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
        }
        span {
          padding-top: 18px;
          font-size:16px;
          font-weight:500;
          color:rgba(200,212,219,1);
          line-height:22px;
        }
      }
      .no-show {
        font-size:16px;
        font-weight:500;
        color:rgba(60,91,91,1);
      }
    }
  }
}
.no-user-following {
  margin-top: 16px;
  width: 100%;
  /* height: 176px; */
  min-height: 400px;
  border-radius: 4px;
  background-color: #ffffff;
}
.no-user-following dl {
  width: 100%;
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.no-user-following dl dt {
  width: 144px;
  height: 81px;
  background-image: url('../../../../static/images/userInfo/follower.svg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
.no-user-following dl dd {
  /* width: 70%;
  height: 100%; */
  text-align: center;
  padding: 20px 0 0;
  font-size: 18px;
}
.no-user-following dl dd p {
  font-size:16px;
  font-weight:500;
  color:rgba(200,212,219,1);
  line-height:22px;
}
</style>
