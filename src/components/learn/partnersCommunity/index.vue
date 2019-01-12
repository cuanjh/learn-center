<template>
  <div class="community">
    <div class="community-container">
      <!-- 左边内容区 -->
      <div class="community-content">
        <div class="left-content">
          <div class="user-info">
            <user-info-item :userInfoMessage="userInfoMessage"/>
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
          <div class="more" @click="loadMore()">
            <span>点击加载更多数据</span>
          </div>
        </div>
      </div>
      <!-- 右边内容区 -->
      <div class="recommend-right">
        <recommend-parnters :parnterLists="parnterLists"/>
        <chart-room/>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import dynamicItem from './dynamicItem.vue'
import Cookie from '../../../tool/cookie'
import RecommendParnters from '../home/recommendParnters.vue'
import ChartRoom from '../home/chartRoom.vue'
import UserInfoItem from './userInfoItem.vue'

export default {
  data () {
    return {
      userInfoMessage: {}, // 用户信息
      ID: [], // 移动端缓存的动态ID的数组
      topics: [], // 推荐的话题
      page: 1
    }
  },
  components: {
    UserInfoItem,
    dynamicItem,
    RecommendParnters,
    ChartRoom
  },
  mounted () {
    console.log('dynamicsLists', this.dynamicsLists)
    this.getCommunity({excludeIds: this.ID})
    this.getDynamicLists({page: this.page, excludeIds: this.ID})
    let userId = Cookie.getCookie('user_id')
    this.getAuthorDetail({ partner_user_id: userId }).then(data => {
      console.log('用户信息', data)
      this.userInfoMessage = data.detail
    })
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
      dynamicsLists: state => state.course.dynamicsLists, // 动态首页列表和打赏列表数据
      DynamicIndex: state => state.course.DynamicIndex // 动态首页数据
    }),
    dynamicsLists () {
      if (!Object.keys(this.$store.state.course.dynamicsLists).length) {
        return []
      }
      return this.$store.state.course.dynamicsLists
    },
    // 推荐的话题
    bannerTopics () {
      if (!Object.keys(this.DynamicIndex).length) {
        return []
      }
      return this.DynamicIndex.bannerTopics
    },
    // 动态推荐的语伴parnter
    parnterLists () {
      if (!Object.keys(this.DynamicIndex).length) {
        return []
      }
      return this.DynamicIndex.partners.slice(0, 5)
    }
  },
  methods: {
    ...mapActions({
      getDynamicLists: 'course/getDynamicLists', // 动态列表
      getAuthorDetail: 'course/getAuthorDetail', // 用户的详情
      getUserInfo: 'getUserInfo',
      getCommunity: 'course/getCommunity' // 动态首页
    }),
    loadMore () {
      this.dynamicsLists.forEach(item => {
        console.log('item', item.info.id)
        this.ID.push(item.info.id)
        console.log('ID', this.ID)
      })
      this.page++
      this.getDynamicLists({page: this.page, excludeIds: this.ID})
    }
  }
}
</script>
<style lang="less" scoped>
.community {
  width: 100%;
  margin: 20px 0 160px;
}
.community-container {
  width: 1200px;
  background: pink;
  margin: 0 auto;
  // display: flex;
  // justify-content: space-between;
}
.community-content {
  display: inline-block;
  width: 820px;
  margin-right: 15px;
  background: rgb(206, 164, 206);
  .left-content {
    width: 100%;
    height: 100%;
    .user-info {
      width: 100%;
      // height: 180px;
      padding: 21px 30px;
      background: rgb(239, 240, 199);
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
              overflow: hidden;
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
.recommend-right {
  width: 359px;
  display: inline-block;
}
</style>
