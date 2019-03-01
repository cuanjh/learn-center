<template>
  <div class="my-partner">
    <div class="title">学习语伴</div>
    <div class="my-content">
      <div class="left">
        <!-- <div class="name"><i></i>语伴动态</div>
        <ul>
          <li v-for="(dynamic, index) in dynamicLists" :key="index">
            <home-dynamic-item :dynamic="dynamic"/>
          </li>
        </ul> -->
        <!-- 进入语伴聊天室 -->
        <!-- <div class="go-in">
          <router-link tag="p" :to="{path: 'community-index'}">
            <i></i>
            <span>进入语伴聊天室</span>
          </router-link>
        </div> -->
        <!-- 为你推荐的语伴 -->
        <reference-partner :partnerLists="partnerLists"></reference-partner>
      </div>
      <div class="right">
        <!-- 语伴动态 -->
        <partner-dynamic :dynamics="dynamics"></partner-dynamic>
        <!-- <recommend-parnters :parnterLists="parnterLists"/>
        <chart-room/> -->
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import RecommendParnters from '../home/recommendParnters.vue'
import ChartRoom from '../home/chartRoom.vue'
import HomeDynamicItem from './homeDynamicItem.vue'
import ReferencePartner from './referencePartner.vue'
import PartnerDynamic from './partnerDynamic.vue'

export default {
  data () {
    return {
      reviewShow: false, // 评论输入框
      showEmoji: false, // 笑脸表情
      emojiDataUTF: [],
      emojiData: [],
      content: '' // input输入的内容
    }
  },
  components: {
    RecommendParnters,
    ChartRoom,
    HomeDynamicItem,
    ReferencePartner,
    PartnerDynamic
  },
  mounted () {
    // for (let key in this.$emoji.EMOJI_MAP) {
    //   this.emojiDataUTF.push(key) // 和后端交互时使用UTF码
    //   this.emojiData.push(this.$emoji.unifiedToHTML(key))
    // }
    // this.getCommunity({excludeIds: []})
  },
  computed: {
    ...mapState({
      DynamicIndex: state => state.course.DynamicIndex // 动态首页数据
    }),
    dynamics () {
      if (!Object.keys(this.DynamicIndex).length) {
        return []
      }
      return this.DynamicIndex.dynamicList.dynamics
    },
    // 动态推荐的语伴parnter
    partnerLists () {
      if (!Object.keys(this.DynamicIndex).length) {
        return []
      }
      return this.DynamicIndex.partners
    }
  },
  methods: {
    ...mapActions({
      getCommunity: 'course/getCommunity' // 动态首页
    })
    // 评论输入框
    // clickShoeReview () {
    //   this.reviewShow = !this.reviewShow
    //   this.hitShow = !this.hitShow
    // },
    // // 评论
    // send (id, typeInfo) {
    //   this.radioAuthorCommentPub({id: id, type_info: typeInfo, comment: this.content}).then((data) => {
    //     console.log('点击评论返回', data)
    //     this.content = '' // 在返回结束时清空内容
    //     // 处理评论列表的内容
    //     this.dynamic.info.comment_num += 1
    //   })
    // },
    // // 关注
    // relation () {
    //   let _this = this
    //   let followId = _this.dynamic.info.user_id
    //   if (_this.dynamic.info.has_followed === true) {
    //     _this.remRadioRelationCancel({following_id: followId}).then(data => {
    //       if (data.success) {
    //         _this.dynamic.info.has_followed = false
    //       }
    //     })
    //   } else {
    //     _this.getRadioRelationFollow({following_id: followId}).then(data => {
    //       if (data.success) {
    //         _this.dynamic.info.has_followed = true
    //       }
    //     })
    //   }
    // },
    // // 点击表情添加到input框
    // chooseEmoji (index, e) {
    //   console.log('e', e)
    //   let text = e.target.innerHTML
    //   this.content = this.content + text
    //   this.showEmoji = !this.showEmoji
    // }
  }
}
</script>

<style lang="less" scoped>
  .my-partner {
    width: 1200px;
    margin: 30px auto;
    .title {
      font-size: 15px;
      font-weight: bold;
      color: #849ea5;
      line-height: 35px;
    }
    .my-content {
      display: flex;
      justify-content: space-between;
      .left {
        display: inline-block;
        width: 820px;
        background-color: #fff;
        border-radius: 5px;
        box-shadow:0px 3px 10px 0px rgba(5,43,52,0.03);
        // padding-left: 40px;
        // padding-top: 37px;
        // .name {
        //   font-size: 16px;
        //   font-weight: bold;
        //   color: #333333;
        //   line-height: 36px;
        //   padding: 37px 40px 0;
        //   i {
        //     width: 36px;
        //     height: 36px;
        //     background-image: url('../../../../static/images/learnIndex/dynamic-icon.svg');
        //     background-repeat: no-repeat;
        //     background-size: cover;
        //     display: inline-block;
        //     margin-right: 15px;
        //   }
        // }
        // ul {
        //   padding: 34px 90px;
        //   li {
        //     padding: 19px 0 19px 0;
        //     border-bottom:1px solid rgba(224,230,235,1);
        //     .item-top {
        //       display: flex;
        //       .people-img {
        //         position: relative;
        //         width: 40px;
        //         height: 40px;
        //         margin-right: 10px;
        //         img {
        //           width: 100%;
        //           height: 100%;
        //           border-radius: 50%;
        //         }
        //         .country {
        //           position: absolute;
        //           right: 0;
        //           bottom: 0;
        //           width: 14px;
        //           height: 14px;
        //           border-radius: 50%;
        //           img {
        //             width: 100%;
        //             height: 100%;
        //           }
        //         }
        //       }
        //       .learn-coures-right {
        //         width: 100%;
        //         position: relative;
        //         p {
        //           font-size:14px;
        //           font-family:HiraKakuStdN-W8;
        //           font-weight:normal;
        //           color:rgba(10,43,64,1);
        //           margin-bottom: 11px;
        //         }
        //         .learn-one {
        //           font-size:12px;
        //           font-family:PingFang-SC-Medium;
        //           font-weight:500;
        //           color:rgba(144,162,174,1);
        //         }
        //         .learn-more {
        //           font-size:12px;
        //           font-family:PingFang-SC-Medium;
        //           font-weight:500;
        //           color:rgba(144,162,174,1);
        //           // i {
        //           //   display: inline-block;
        //           //   width: 17px;
        //           //   height: 11px;
        //           //   background: url('../../../../static/images/community/Line.svg') no-repeat center;
        //           //   background-size: 100%;
        //           // }
        //         }
        //         .attention {
        //           cursor: pointer;
        //           position: absolute;
        //           top: 8px;
        //           right: 0;
        //           // width:60px;
        //           // height:24px;
        //           border-radius:16px;
        //           border:1px solid rgba(213,221,226,1);
        //           text-align: center;
        //           padding: 0 10px;
        //           span {
        //             font-size:12px;
        //             font-family:PingFang-SC-Bold;
        //             font-weight:bold;
        //             color:rgba(42,159,228,1);
        //           }
        //         }
        //       }
        //     }
        //     .dynamic-details {
        //       width: 100%;
        //       font-size:14px;
        //       font-family:PingFang-SC-Medium;
        //       font-weight:500;
        //       color:rgba(51,51,51,1);
        //       line-height:20px;
        //       margin-top: 15px;
        //     }
        //     .description {
        //       display: flex;
        //       margin: 27px 0 20px;
        //       p {
        //         cursor: pointer;
        //         font-size:13px;
        //         font-family:PingFang-SC-Medium;
        //         font-weight:500;
        //         color:rgba(144,162,174,1);
        //         line-height:18px;
        //         margin-right: 26px;
        //         i {
        //           display: inline-block;
        //           margin-top: 2px;
        //         }
        //         .comment {
        //           width: 11px;
        //           height: 13px;
        //           background: url('../../../../static/images/community/comment.svg') no-repeat center;
        //           background-size: 100%;
        //         }
        //         .coins {
        //           width: 11px;
        //           height: 15px;
        //           background: url('../../../../static/images/community/coins.svg') no-repeat center;
        //           background-size: 100%;
        //         }
        //         .share {
        //           width: 13px;
        //           height: 13px;
        //           background: url('../../../../static/images/community/share.svg') no-repeat center;
        //           background-size: 100%;
        //         }
        //       }
        //     }
        //     // 评论输入框
        //     .review {
        //       width: 100%;
        //       .review-content {
        //         width: 100%;
        //         .text {
        //           textarea {
        //             padding: 0 3px;
        //             width: 100%;
        //             height: 64px;
        //             background:rgba(246,248,249,1);
        //             border-radius:3px;
        //             border:1px solid rgba(216,227,233,1);
        //           }
        //         }
        //         .review-pic {
        //           margin-top: 10px;
        //           display: flex;
        //           justify-content: space-between;
        //           .face {
        //             i {
        //               cursor: pointer;
        //               display: inline-block;
        //               width: 16px;
        //               height: 16px;
        //               background: url('../../../../static/images/community/smile.svg') no-repeat center;
        //               background-size: 100%;
        //               margin-top: 2px;
        //               &:hover {
        //                 background: url('../../../../static/images/community/smilehover.svg') no-repeat center;
        //                 background-size: 100%;
        //               }
        //               &.active {
        //                 background: url('../../../../static/images/community/smileclick.svg') no-repeat center;
        //                 background-size: 100%;
        //               }
        //             }
        //             span {
        //               font-size:14px;
        //               font-family:PingFang-SC-Medium;
        //               font-weight:500;
        //               color:rgba(144,162,174,1);
        //               line-height:20px;
        //             }
        //           }
        //           .send {
        //             cursor: pointer;
        //             width:74px;
        //             height:30px;
        //             background:rgba(42,159,228,1);
        //             border-radius:15px;
        //             text-align: center;
        //             line-height: 30px;
        //             span {
        //               font-size:14px;
        //               font-family:PingFang-SC-Medium;
        //               font-weight:500;
        //               color:rgba(255,255,255,1);
        //             }
        //           }
        //         }
        //       }
        //       // 表情包
        //       .emoji-box {
        //         position: absolute;
        //         z-index: 10;
        //         left: 10px;
        //         width: 400px;
        //         height: 200px;
        //         // top: 290px;
        //         box-shadow: 0 4px 20px 1px rgba(0, 0, 0, 0.2);
        //         background: white;
        //         ul {
        //           width: 400px;
        //           height: 200px;
        //           overflow: auto;
        //           padding: 10px;
        //           li {
        //             width: 30px;
        //             cursor: pointer;
        //             display: inline-block;
        //             margin: 2px;
        //           }
        //         }
        //       }
        //     }
        //   }
        //   li:last-child {
        //     border-bottom: 0px solid;
        //   }
        // }
        // .go-in {
        //   width: 100%;
        //   height: 47px;
        //   background: #E6EBEE;
        //   border-radius:0px 0px 5px 5px;
        //   text-align: center;
        //   p {
        //     display: inline-block;
        //     cursor: pointer;
        //     i {
        //       display: inline-block;
        //       width: 36px;
        //       height: 46px;
        //       background: url('../../../../static/images/community/goparnter.svg') no-repeat center;
        //       background-size: 100%;
        //     }
        //     span {
        //       text-align: center;
        //       font-size:14px;
        //       font-family:PingFang-SC-Bold;
        //       font-weight:bold;
        //       color:rgba(21,85,103,1);
        //       line-height:47px;
        //     }
        //   }
        // }
      }
      .right {
        display: inline-block;
        width: 340px;
        // height: 480px;
        border-radius: 5px;
        background: #fff;
        box-shadow:0px 3px 10px 0px rgba(5,43,52,0.03);
      }
    }
  }
</style>
