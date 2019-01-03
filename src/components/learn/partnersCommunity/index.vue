<template>
  <div class="community">
    <div class="community-container">
      <!-- 左边内容区 -->
      <div class="community-content">
        <div class="left-content">
          <div class="user-info">
            <div class="user">
              <div class="top">
                <div class="user-img">
                  <img :src="authorInfo.photo" alt="用户头像">
                </div>
                <div class="name">
                  <span>{{authorInfo.nickname}}</span>
                  <span>分享你的新鲜事</span>
                </div>
                <div class="focus">
                  <p>
                    <span>{{authorInfo.follow_num}}</span>
                    <span>关注</span>
                  </p>
                  <p class="line"></p>
                  <p>
                    <span>{{authorInfo.be_followed_num}}</span>
                    <span>粉丝</span>
                  </p>
                  <p class="line"></p>
                  <p>
                    <span>{{authorInfo.country_name}}</span>
                    <span>国家/地区</span>
                  </p>
                </div>
              </div>
              <div class="function">
                <span>图片</span>
                <span>文字</span>
                <span>视频</span>
                <span>语言</span>
              </div>
            </div>
          </div>
          <!-- 话题推荐 -->
          <div class="topic">
            <div class="recommend">
              <p class="more">
                <span>话题推荐</span>
                <span>更多话题</span>
              </p>
              <div class="topic-lists">
                <ul>
                  <li v-for="(item, index) in bannerTopics" :key="index">
                    <img :src="item.cover_url" alt="推荐话题图片">
                    <p class="title">
                      <span>{{item.topic_title}}</span>
                    </p>
                    <p class="number">
                      <i></i>
                      <span>{{item.pub_num}}</span>
                      <span>人参与</span>
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <!-- 动态列表 -->
          <div class="dynamic-content">
            <div class="dynamic-lists">
              <div class="dynamic-item" v-for="(dynamic, index) in dynamicsLists" :key="index">
                <dynamic-item :dynamic="dynamic"></dynamic-item>
              </div>
            </div>
          </div>
        </div>
      </div>
        <!-- 右边内容区 -->
        <right-slide/>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import dynamicItem from './dynamicItem.vue'
import Cookie from '../../../tool/cookie'
import rightSlide from './rightSlide.vue'

export default {
  data () {
    return {
      authorInfo: {}, // 作者信息
      ID: [], // 移动端缓存的动态ID的数组
      topics: [] // 推荐的话题
    }
  },
  components: {dynamicItem, rightSlide},
  mounted () {
    // this.getCommunity({excludeIds: this.ID})
    this.initCommunity()
    let userId = Cookie.getCookie('user_id')
    this.getAuthorDetail({ partner_user_id: userId }).then(data => {
      console.log('作者信息', data)
      this.authorInfo = data.detail
    })
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
      dynamicsLists: state => state.course.dynamicsLists, // 动态首页数据
      bannerTopics: state => state.course.bannerTopics
    })
  },
  methods: {
    ...mapActions({
      getAuthorDetail: 'course/getAuthorDetail', // 作者的详情
      getUserInfo: 'getUserInfo',
      getCommunity: 'course/getCommunity' // 动态首页
    }),
    async initCommunity () {
      await this.getCommunity({excludeIds: this.ID})
      console.log('dynamicsLists', this.dynamicsLists)
      console.log('dynamicses', this.bannerTopics)
    }
  }
}
</script>
<style lang="less" scoped>
.community {
  width: 100%;
  margin: 20px 0 160px;
  background: #ffffff;
}
.community-container {
  width: 1200px;
  background: pink;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
}
.community-content {
  width: 840px;
  background: rgb(206, 164, 206);
  .left-content {
    width: 100%;
    height: 100%;
    .user-info {
      width: 100%;
      height: 180px;
      padding: 21px 30px;
      background: rgb(239, 240, 199);
      .top {
        position: relative;
        display: flex;
        .user-img {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }
        .name {
          line-height: 70px;
          span:nth-child(1) {
            font-size:22px;
            font-family:PingFangSC-Semibold;
            font-weight:600;
            color:rgba(16,48,68,1);
            padding-left: 12px;
          }
          span:nth-child(2) {
            font-size:18px;
            font-family:PingFangSC-Semibold;
            font-weight:600;
            color:rgba(144,162,174,1);
            padding-left: 25px;
          }
        }
        .focus {
          position: absolute;
          top: 20px;
          right: 0;
          display: flex;
          p {
            display: flex;
            flex-direction: column;
            // padding: 10px;
            span {
              text-align: center;
            }
            span:nth-child(1) {
              font-size:22px;
              font-family:PingFangSC-Semibold;
              font-weight:600;
              color:rgba(16,48,68,1);
              line-height:30px;
            }
            span:nth-child(2) {
              font-size:18px;
              font-family:PingFangSC-Semibold;
              font-weight:600;
              color:rgba(144,162,174,1);
              line-height:25px;
              margin-top: 4px;
            }
          }
          p:nth-child(3) {
            span:nth-child(1) {
              color: rgb(248, 132, 24);
            }
          }
          .line {
            width: 1px;
            background: rgb(161, 160, 160);
            height: 50px;
            margin: 6px 18px 0;
          }
        }
      }
      .function {
        margin-top: 34px;
        font-size:14px;
        font-family:PingFangSC-Semibold;
        font-weight:600;
        color:rgba(126,146,159,1);
        line-height:20px;
        span {
          cursor: pointer;
          display: inline-block;
          border-radius: 18px;
          background: #F6F8F9;
          padding: 8PX 44PX;
        }
      }
    }
    // 推荐话题
    .topic {
      width: 100%;
      height: 180px;
      .recommend {
        padding: 14px 30px;
        .more {
          display: flex;
          justify-content: space-between;
          font-size:14px;
          font-family:PingFangSC-Semibold;
          font-weight:600;
          color:rgba(144,162,174,1);
          line-height:20px;
        }
        .topic-lists {
          width: 100%;
          ul {
            width: 100%;
              display: flex;
              overflow-x: scroll;
            li {
              position: relative;
              margin-right: 11px;
              img {
                width:158px;
                height:80px;
                border-radius: 6px;
                margin: 10px 0 6px;
              }
              .title {
                width:158px;
                height:80px;
                border-radius: 6px;
                background:rgba(0,0,0,.3);
                position: absolute;
                top: 10px;
                text-align: center;
                line-height: 80px;
                span {
                  font-size:14px;
                  font-family:PingFangSC-Semibold;
                  font-weight:600;
                  color:rgba(255,255,255,1);
                }
              }
              .number {
                i {
                  display: inline-block;
                  width: 16px;
                  height: 14px;
                  background: url('../../../../static/images/community/person.svg') no-repeat center;
                  background-size: cover;
                  margin-right: 4px;
                  margin-top: 4px;
                }
                span {
                  font-size:13px;
                  font-family:PingFang-SC-Medium;
                  font-weight:500;
                  color:rgba(153,153,153,1);
                  line-height:18px;
                }
              }
            }
            li:last-child {
              margin-right: 0px;
            }
          }
        }
      }
    }
    // 动态列表
    .dynamic-content {
      width: 100%;
      .dynamic-lists {
        width: 100%;
        height: 100%;
        .dynamic-item {
          width: 100%;
          height: 100%;
          padding: 29px 50px 44px;
          background: #ffffff;
          box-shadow:0px 3px 10px 0px rgba(5,43,52,0.03);
          margin-top: 15px;
        }
      }
    }
  }
}

</style>
