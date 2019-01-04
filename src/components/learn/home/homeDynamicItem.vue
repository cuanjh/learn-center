<template>
  <div>
    <div class="item-top">
      <div class="people-img" v-if="dynamic.info.author_info">
        <img :src="dynamic.info.author_info.photo" alt="动态头像">
        <div class="country">
          <img :src="dynamic.info.author_info.country_flag" alt="国家">
        </div>
      </div>
      <div class="learn-coures-right">
        <p>{{dynamic.info.nickname}}</p>
        <!-- <div class="learn-one">
          <span>英语</span>
        </div> -->
        <div class="learn-more">
         <div class="language">
            <p>
              <span v-for="(lang, index) in dynamic.info.lang_infos" :key="index">
                {{lang.name}}
              </span>
            </p>
          </div>
        </div>
      <div class="attention" @click="relation()">
        <!-- authorInfo.has_followed === false -->
        <span v-if="dynamic.info.has_followed === false">关注</span>
        <span v-else>取消关注</span>
      </div>
      </div>
    </div>
    <div class="dynamic-details">
      <span>{{dynamic.info.content}}</span>
    </div>
    <div class="description">
      <p @click="clickShoeReview()">
        <i class="comment"></i>
        <span>{{dynamic.info.comment_num}}</span>
      </p>
      <p @click="clickReward(dynamic.info.id)">
        <i class="coins"></i>
        <span>{{dynamic.info.reward_num}}</span>
      </p>
      <p>
        <i class="share"></i>
        <span>{{dynamic.info.shared_num}}</span>
      </p>
    </div>
    <!-- 评论的输入框 -->
    <div class="review" v-show="reviewShow">
      <div class="review-content">
        <div class="text">
          <textarea id="character"
                    autocomplete="off"
                    v-model="content"
                    placeholder="说点什么吧~~">
          </textarea>
        </div>
        <div class="review-pic">
          <div class="face" @click="showEmoji = !showEmoji">
            <i :class="{active: showEmoji === true}"></i>
            <span>表情</span>
          </div>
          <div class="send" @click="send(dynamic.info.id, dynamic.info.type_info)">
            <span>发送</span>
          </div>
        </div>
      </div>
      <!-- 表情包 -->
      <transition name="fade" mode="">
        <div class="emoji-box" v-if="showEmoji" >
          <ul class="emojiWrap">
            <li v-for="(item,i) in emojiData" :key="i" v-html="item" @click="chooseEmoji(i, $event)" ></li>
          </ul>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import Cookie from '../../../tool/cookie'

export default {
  props: ['dynamic'],
  data () {
    return {
      reviewShow: false, // 评论输入框
      showEmoji: false, // 笑脸表情
      emojiDataUTF: [],
      emojiData: [],
      content: '' // input输入的内容
    }
  },
  mounted () {
    for (let key in this.$emoji.EMOJI_MAP) {
      this.emojiDataUTF.push(key) // 和后端交互时使用UTF码
      this.emojiData.push(this.$emoji.unifiedToHTML(key))
    }
  },
  methods: {
    ...mapActions({
      getRadioRelationFollow: 'course/getRadioRelationFollow', // 关注
      remRadioRelationCancel: 'course/remRadioRelationCancel', // 取消关注
      radioAuthorCommentRewardList: 'course/radioAuthorCommentRewardList', // 动态打赏列表接口
      radioAuthorCommentReward: 'course/radioAuthorCommentReward', // 打赏动态奖励的接口
      radioAuthorCommentPub: 'course/radioAuthorCommentPub' // 发表动态评论、批改作业接口
    }),
    // 评论输入框
    clickShoeReview () {
      this.reviewShow = !this.reviewShow
    },
    // 评论
    send (id, typeInfo) {
      this.radioAuthorCommentPub({id: id, type_info: typeInfo, comment: this.content}).then((data) => {
        console.log('点击评论返回', data)
        this.content = '' // 在返回结束时清空内容
        // 处理评论列表的内容
        this.dynamic.info.comment_num += 1
      })
    },
    // 打赏动态
    clickReward (id) {
      let currentUserId = Cookie.getCookie('user_id')
      if (this.dynamic.info.has_rewarded) {
        alert('你已经打赏过了~~~')
      } else {
        this.radioAuthorCommentReward({id: id, to_user_id: currentUserId}).then(res => {
          this.radioAuthorCommentRewardList({id: id}).then(data => {
            this.dynamic.info.has_rewarded = true
            this.dynamic.info.reward_num += 1
            this.dynamic.rewardLists = data.detail.rewards
          })
        })
      }
    },
    // 关注
    relation () {
      let _this = this
      let followId = _this.dynamic.info.user_id
      if (_this.dynamic.info.has_followed === true) {
        _this.remRadioRelationCancel({following_id: followId}).then(data => {
          if (data.success) {
            _this.dynamic.info.has_followed = false
          }
        })
      } else {
        _this.getRadioRelationFollow({following_id: followId}).then(data => {
          if (data.success) {
            _this.dynamic.info.has_followed = true
          }
        })
      }
    },
    // 点击表情添加到input框
    chooseEmoji (index, e) {
      console.log('e', e)
      let text = e.target.innerHTML
      this.content = this.content + text
      this.showEmoji = !this.showEmoji
    }
  }
}
</script>
<style lang="less" scoped>
.item-top {
  display: flex;
  .people-img {
    position: relative;
    width: 40px;
    height: 40px;
    margin-right: 10px;
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
  .learn-coures-right {
    width: 100%;
    position: relative;
    p {
      font-size:14px;
      font-family:HiraKakuStdN-W8;
      font-weight:normal;
      color:rgba(10,43,64,1);
      margin-bottom: 11px;
    }
    .learn-one {
      font-size:12px;
      font-family:PingFang-SC-Medium;
      font-weight:500;
      color:rgba(144,162,174,1);
    }
    .learn-more {
      font-size:12px;
      font-family:PingFang-SC-Medium;
      font-weight:500;
      color:rgba(144,162,174,1);
      // i {
      //   display: inline-block;
      //   width: 17px;
      //   height: 11px;
      //   background: url('../../../../static/images/community/Line.svg') no-repeat center;
      //   background-size: 100%;
      // }
    }
    .attention {
      cursor: pointer;
      position: absolute;
      top: 8px;
      right: 0;
      // width:60px;
      // height:24px;
      border-radius:16px;
      border:1px solid rgba(213,221,226,1);
      text-align: center;
      padding: 0 10px;
      span {
        font-size:12px;
        font-family:PingFang-SC-Bold;
        font-weight:bold;
        color:rgba(42,159,228,1);
      }
    }
  }
}
.dynamic-details {
  width: 100%;
  font-size:14px;
  font-family:PingFang-SC-Medium;
  font-weight:500;
  color:rgba(51,51,51,1);
  line-height:20px;
  margin-top: 15px;
}
.description {
  display: flex;
  margin: 27px 0 20px;
  p {
    cursor: pointer;
    font-size:13px;
    font-family:PingFang-SC-Medium;
    font-weight:500;
    color:rgba(144,162,174,1);
    line-height:18px;
    margin-right: 26px;
    i {
      display: inline-block;
      margin-top: 2px;
    }
    .comment {
      width: 11px;
      height: 13px;
      background: url('../../../../static/images/community/comment.svg') no-repeat center;
      background-size: 100%;
    }
    .coins {
      width: 11px;
      height: 15px;
      background: url('../../../../static/images/community/coins.svg') no-repeat center;
      background-size: 100%;
    }
    .share {
      width: 13px;
      height: 13px;
      background: url('../../../../static/images/community/share.svg') no-repeat center;
      background-size: 100%;
    }
  }
}
// 评论输入框
.review {
  width: 100%;
  .review-content {
    width: 100%;
    .text {
      textarea {
        padding: 0 3px;
        width: 100%;
        height: 64px;
        background:rgba(246,248,249,1);
        border-radius:3px;
        border:1px solid rgba(216,227,233,1);
      }
    }
    .review-pic {
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      .face {
        i {
          cursor: pointer;
          display: inline-block;
          width: 16px;
          height: 16px;
          background: url('../../../../static/images/community/smile.svg') no-repeat center;
          background-size: 100%;
          margin-top: 2px;
          &:hover {
            background: url('../../../../static/images/community/smilehover.svg') no-repeat center;
            background-size: 100%;
          }
          &.active {
            background: url('../../../../static/images/community/smileclick.svg') no-repeat center;
            background-size: 100%;
          }
        }
        span {
          font-size:14px;
          font-family:PingFang-SC-Medium;
          font-weight:500;
          color:rgba(144,162,174,1);
          line-height:20px;
        }
      }
      .send {
        cursor: pointer;
        width:74px;
        height:30px;
        background:rgba(42,159,228,1);
        border-radius:15px;
        text-align: center;
        line-height: 30px;
        span {
          font-size:14px;
          font-family:PingFang-SC-Medium;
          font-weight:500;
          color:rgba(255,255,255,1);
        }
      }
    }
  }
  // 表情包
  .emoji-box {
    position: absolute;
    z-index: 10;
    left: 10px;
    width: 400px;
    height: 200px;
    // top: 290px;
    box-shadow: 0 4px 20px 1px rgba(0, 0, 0, 0.2);
    background: white;
    ul {
      width: 400px;
      height: 200px;
      overflow: auto;
      padding: 10px;
      li {
        width: 30px;
        cursor: pointer;
        display: inline-block;
        margin: 2px;
      }
    }
  }
}
</style>
