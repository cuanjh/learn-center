<template>
  <div class="details">
    <div class="details-content">
      <div class="details-left">
        <div class="left-content">
          <div class="left-title">
            <span>{{detail.title}}</span>
          </div>
          <!-- 发布者信息 -->
          <div class="user">
            <div class="user-img">
              <!-- <img src="https://gw.alicdn.com/tfs/TB1yopEdgoQMeJjy1XaXXcSsFXa-640-302.png" alt=""> -->
              <img :src="author.photo" alt="头像">
            </div>
            <div class="user-name">
              <span class="new-type">{{author.nickname}}</span>
              <span class="publish-date">{{detail.input_time*1000 | dateFmt('YYYY-MM-DD')}}</span>
            </div>
          </div>
          <!--新闻内容-->
          <div class="news-content" v-html="html"></div>
          <div class="key-bottom">
            <!--关键词 begin-->
            <div class="keywords">
              <ul class="keywords-list">
                <li v-for="(item, index) in tags_info" :key="index">
                  <!-- :to="{ name: 'stage', params: {id: 'A0' + i}}" -->
                  <router-link :to="{ name: 'headlineSearch', params: {val: item}}">
                    <span>#</span>
                    <span class="key">{{item}}</span>
                  </router-link>
                </li>
              </ul>
            </div>
            <!-- 投诉内容 -->
            <div class="reports" @click="showReport()">
              <div class="report-cont">
                <a href="javascrit:;>">
                  <i class="rep-img"></i>
                  <span>内容投诉</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 更多推荐 -->
      <div class="recommend-more">
        <div class="recommend-content">
          <p class="title">
            <span class="line"></span>
            <span>更多推荐</span>
            <span class="line"></span>
          </p>
          <div class="recommend-list">
            <ul>
              <router-link  tag="li"
                            v-for="(item, index) in relatedNews"
                            :key="index"
                            :to="{path: '/app/headline-details/' + item.id}">
                <div class="img">
                  <img :src="item.banner_img ? item.banner_img : item.thumbs[0]" alt="推荐图片">
                </div>
                <div class="news_item">
                  <div class="news_item_row1">
                    <span class="news_item_title">{{item.title}}</span>
                  </div>
                  <div class="news_item_row2">
                    <span class="news_item_type">{{item.tag_title}}</span>
                    <span class="reading">阅读&nbsp;{{item.hits}}</span>
                  </div>
                </div>
              </router-link>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!-- 评论内容 -->
    <div class="left-comment">
      <div class="comment-contents">
        <div class="comment-top">
          <span>{{commentLists.length}}条评论</span>
        </div>
        <div class="comment-list">
          <div class="comment-item">
            <div class="comment-pic">
              <img :src="userInfo.photo" alt="当前用户头像">
            </div>
            <div class="text">
              <!-- 说点什么吧... -->
              <textarea @blur.prevent="blurFn()"
                        @focus.prevent="focusFn()"
                        v-model="introduct"
                        id="comment-content"
                        class="input-comment"
                        autocomplete="off" :placeholder="holder"></textarea>
              <div class="but" @click="review" @keyup.enter="review">
                <span>评论</span>
              </div>
            </div>
          </div>
          <div class="comment-item" >
            <div class="item" v-for="(item, index) in commentLists" :key="index">
              <div class="comment-pic">
                <img v-lazy="item.photo" alt="当前用户头像">
              </div>
              <div class="text">
                <div class="comment-name">
                  <span class="name">{{item.nickname}}</span>
                  <span class="time">{{item.created_time*1000 | dateFmt('YYYY-MM-DD')}}</span>
                </div>
                <div class="review">
                  <span>{{item.content}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 点击加载更多  @click="loadMore"-->
      <div class="loadMore" @click="loadMore">
        <span v-text="btnText" v-show="flag == true"></span>
        <span v-text="btnText" v-show="flag == false"></span>
      </div>
    </div>
    <!-- 举报内容 -->
    <div class="report" v-show="isShow">
      <div class="report-content">
        <div class="close" @click="hidePanel"></div>
        <div class="inner">
          <div class="title">请选择举报类型</div>
          <ul>
            <li class="report-item" :id="'check' + item.id" v-for="(item, index) in arrReport" :key="index">
              <input type="checkbox" class="input_check" :id="'checkb'+item.id" :value="item.item_des" v-model="checkboxList">
              <label :for="'checkb'+item.id">{{item.item_des}}</label>
            </li>
          </ul>
          <div class="editor">
            <textarea v-model="reportContents" id="reportContent" name="txt" class="form-control" clos=",50" rows="5" warp="virtual" placeholder="留下你的问题，我们会尽快处理"></textarea>
          </div>
          <div class="button" id="btnReport" @click="submit()">
            <span>提交</span>
          </div>
        </div>
        <div class="toast1" v-show="showTextOff">
          <span class="toast-text">请选择你要举报的项目</span>
        </div>
        <div class="toast2" v-show="showTextSuccess">
          <span class="toast-text">举报成功</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import $ from 'jquery'

export default {
  data () {
    return {
      flag: true,
      btnText: '点击加载更多',
      isShow: false,
      showTextOff: false,
      showTextSuccess: false,
      holder: '说点什么吧...',
      detail: {},
      author: {}, // 作者
      html: '', // 内容
      tags_info: [], // 关键字
      relatedNews: [], // 相关新闻，推荐
      commentLists: [], // 评论列表
      introduct: '', // 输入的内容
      id: '',
      page: 1,
      arrReport: [
        {id: 1, item_des: '内容虚假', isEdit: '0'},
        {id: 2, item_des: '播放问题', isEdit: '0'},
        {id: 3, item_des: '新闻不完整', isEdit: '0'},
        {id: 4, item_des: '空短新闻', isEdit: '0'},
        {id: 5, item_des: '内容不实', isEdit: '0'},
        {id: 6, item_des: '侵权（抄袭、侵犯名誉等）', isEdit: '0'},
        {id: 7, item_des: '政治', isEdit: '0'},
        {id: 8, item_des: '其他问题，我要吐槽', isEdit: '1'}
      ],
      checkboxList: [], // 选中的内容
      list: '', // 输入的投诉内容
      reportContents: '' // text框输入的内容
    }
  },
  components: {},
  beforeRouteUpdate (to, from, next) {
    if (to.name === 'headlineDetails') {
      next()
      this.initHeadDetail()
    } else {
      next()
    }
  },
  mounted () {
    this.initHeadDetail()
    this.initCommLists()
    // this.id = this.$route.params.id
    // console.log('id', this.id)
    // // 头条详情页面
    // this.headlineDetail({id: this.id}).then((data) => {
    //   console.log('data', data)
    //   this.detail = data.detail
    //   this.author = data.detail.author
    //   this.html = data.detail.content
    //   this.tags_info = data.detail.tags_info
    //   this.relatedNews = data.detail.related_news
    //   // this.initComment(id)
    // })
    // // 评论列表
    // this.commentList({hid: this.id, page: this.page}).then((res) => {
    //   console.log('commentList评论列表', res)
    //   if (res.data.comments.length === 0) {
    //     this.flag = false
    //     this.btnText = '暂时没有评论内容'
    //   }
    //   this.commentLists = res.data.comments
    // })
    // this.initComments()
    this.$nextTick(() => {
      this.removeStyle()
    })
  },
  updated () {
    this.resetStyle()
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  methods: {
    ...mapActions({
      headlineDetail: 'course/headlineDetail',
      commentList: 'course/commentList',
      comments: 'course/comments',
      reportList: 'course/reportList'
    }),
    showReport () {
      this.isShow = true
    },
    hidePanel () {
      // qing kong
      this.checkboxList = []
      this.reportContents = ''
      this.isShow = false
      this.showTextSuccess = false
    },
    // 头条详情页面
    async initHeadDetail () {
      let _this = this
      _this.id = _this.$route.params.id
      console.log('id', _this.id)
      // 头条详情页面
      await _this.headlineDetail({id: _this.id}).then((data) => {
        console.log('头条详情页面', data)
        _this.detail = data.detail
        _this.author = data.detail.author
        _this.html = data.detail.content
        _this.tags_info = data.detail.tags_info
        _this.relatedNews = data.detail.related_news
        // this.initComment(id)
      })
    },
    // 评论列表
    async initCommLists () {
      let _this = this
      _this.id = _this.$route.params.id
      await _this.commentList({hid: _this.id, page: _this.page}).then((res) => {
        console.log('commentList评论列表', res)
        if (res.data.comments.length === 0) {
          _this.flag = false
          _this.btnText = '暂时没有评论内容'
        }
        _this.commentLists = res.data.comments
      })
    },
    // 评论
    review () {
      this.flag = true
      this.btnText = '点击加载更多'
      // 评论接口
      console.log('content', this.introduct)
      if (this.introduct === '') {
        alert('请输入内容')
        return
      }
      this.comments({hid: this.id, content: this.introduct}).then((data) => {
        console.log('comments评论的内容', data)
        data['content'] = this.introduct
        this.commentLists.unshift(data)
        // console.log('this.commentLists', this.commentLists)
        this.commentList({hid: this.id, page: 1}).then((res) => {
          this.introduct = ''
          console.log('res评论后返回的', res)
          if (res.data.page === -1) {
            return
          }
          console.log('res', res)
          this.commentLists = res.data.comments
          console.log('commentLists评论后返回的列表', this.commentLists)
        })
      })
    },
    // 投诉
    submit () {
      let _this = this
      console.log('reason', _this.list)
      _this.list = _this.checkboxList.toString()
      console.log('reportContents', _this.reportContents)
      if (_this.list === '' && _this.reportContents === '') {
        _this.showTextOff = true
        setTimeout(() => {
          _this.showTextOff = false
        }, 1000)
      } else {
        if (_this.reportContents) {
          _this.list += _this.reportContents
        }
        _this.reportList({id: _this.id, report: _this.list}).then((data) => {
          console.log('reportdata', data)
          _this.showTextSuccess = true
          $('.toast2').addClass('toast-fadeOut')
        })
      }
    },
    blurFn () { // 失去焦点
      setTimeout(() => {
        $('.input-comment').css('height', '40px', 'width', '700px')
        $('.but').css('top', '7px')
      }, 300)
      if (this.holder === '') {
        this.holder = '说点什么吧...'
      }
    },
    focusFn () { // 获取焦点
      $('.input-comment').css('height', '160px', 'width', '700px')
      $('.but').css('top', '130px')
      if (this.holder === '说点什么吧...') {
        this.holder = ''
      }
    },
    loadMore () { // 评论加载更多
      if (!this.flag) {
        return false
      }
      this.page++
      console.log('this.page', this.page)
      this.commentList({hid: this.id, page: this.page}).then((res) => {
        console.log('res', res)
        this.commentLists = this.commentLists.concat(res.data.comments)
        console.log('commentLists', this.commentLists)
        if (res.data.page === -1) {
          this.btnText = '已显示全部内容~'
          this.flag = false
        }
      })
    },
    removeStyle () {
      $('.news-content').find('img').removeAttr('style')
    },
    resetStyle () {
      $('.news-content').find('p,span').css({
        'font-size': '16px',
        'color': '#333333',
        'line-height': '28px',
        'font-family': "'Microsoft YaHei','PingFang SC','Hiragino Sans GB',Helvetica,Tahoma,Arial,SimSun,Heiti,sans-serif",
        'word-wrap': 'break-word'
      })
      $('.news-content').find('img').css({
        'width': '100%',
        'margin': '10px 0 10px'
      })
    }
  }
}
</script>

<style lang="less" scoped>
a {
  text-decoration: none;
  cursor: pointer;
}
ul,li {
  list-style:none;
  text-decoration: none;
}
.details {
  width: 1200px;
  margin: 0 auto;
  .details-content {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .details-left {
    display: inline-block;
    width: 850px;
    background: #ffffff;
    margin-top: 20px;
    padding: 40px 40px;
    .left-content {
      width: 100%;
      .left-title {
        height: 100px;
        font-size: 36px;
        color: #000000;
        display: table-cell;
        vertical-align: middle;
        line-height: 50px;
        font-weight: bold;
      }
      .user {
        height: 48px;
        margin: 20px 0;
        .user-img {
          display: inline-block;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }
        .user-name {
          display: inline-block;
          font-size: 20px;
          color: #9B9B9B;
          line-height: 47px;
          .new-type {
            margin: 0 14px;
          }
        }
      }
      .news-content {
        width: 100%;
        word-wrap: break-word;
        font-size: 16px;
        color: #333;
        line-height: 28px;
        margin-bottom: 20px;
        img {
          margin: 10px 0;
          width: 97.5%;
          margin: - auto;
        }
      }
      .key-bottom {
        width: 100%;
        display: flex;
        justify-content: space-between;
        .keywords {
          display: inline-block;
          .keywords-list {
            li {
              display: inline;
              border-radius: 80px;
              padding: 4px 14px;
              background: #EAEAEA;
              a {
                font-size: 14px;
                color: #999999;
                span:nth-child(1) {
                  color: #2A9FE4
                }
              }
            }
          }
        }
        .reports {
          display: inline-block;
          width: 100px;
          height: 23px;
          .report-cont {
            width: 100%;
            height: 100%;
            a {
              width: 100%;
              height: 100%;
              i {
                display: inline-block;
                width: 16px;
                height: 16px;
                background: url('../../../../../static/images/headline/report.png') no-repeat center;
                background-size: cover;
                margin-top: 4px;
              }
              span {
                line-height: 23px;
                font-size: 16px;
                color: #D8D8D8;
              }
            }
          }
        }
      }
    }
  }
}
.left-comment {
  width: 850px;
  background: #ffffff;
  border-top: 1px solid #EAEAEA;
  margin-bottom: 20px;
  .comment-contents {
    width: 100%;
    padding: 40px 40px;
    .comment-top {
      font-size: 24px;
      color: #333333;
    }
    .comment-list {
      width: 100%;
      .comment-item {
        width: 100%;
        margin: 37px 0;
        .item {
          margin-bottom: 36px;
        }
        .comment-pic {
          display: inline-block;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }
        .text {
          position: relative;
          display: inline-block;
          .input-comment {
            color: red;
            -webkit-appearance: none;
            background-color: #DDDDDD;
            background-image: none;
            border-radius: 20px;
            border: 0rem solid #bfcbd9;
            // color: #D8D8D8;
            font-size: 14px;
            height: 40px;
            outline: 0;
            overflow: hidden;
            width: 700px;
            display: inline-block;
            padding: 10px 90px 10px 20px;
            resize: none;
          }
          .but {
            cursor: pointer;
            position: absolute;
            top: 7px;
            right: 14px;
            width: 70px;
            height: 26px;
            background: #9B9B9B;
            text-align: center;
            border-radius: 20px;
            line-height: 26px;
            span {
              font-size: 14px;
              color: #ffffff;
            }
          }
          .comment-name {
            font-size: 14px;
            .name {
              color: #333333;
              margin: 0 10px;
            }
            .time {
              color: #D8D8D8;
            }
          }
          .review {
            font-size: 14px;
            color: #333333;
          }
        }
      }
    }
  }
  .loadMore {
    cursor: pointer;
    font-size: 20px;
    color: black;
    padding: 20px;
    text-align: center;
    border-top: 1px solid #EAEAEA;
    &:hover {
      color: rgb(53, 171, 240);
    }
  }
}
.recommend-more {
  position: absolute;
  top: 0;
  right: 20px;
  width: 283px;
  margin-top: 20px;
  background: #ffffff;
  .recommend-content {
    width: 100%;
    padding: 36px 20px;
    .title {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .line {
        display: inline-block;
        width: 24px;
        height: 2px;
        background: #F2F2F2;
      }
      span:nth-child(2){
        font-size: 16px;
        color: #333333;
        margin: 0 10px;
      }
    }
    .recommend-list {
      margin-top: 17px;
      ul {
        li {
          cursor: pointer;
          border-bottom: 1px dashed #EAEAEA;
          margin-top: 20px;
          .img {
            width: 100%;
            height: 128px;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .news_item {
            display: flex;
            flex-direction: column;
            margin: 16px 20px;
            justify-content: space-around;
            .news_item_row1 {
              display: inline-block;
              margin-bottom: 16px;
              span {
                font-size: 16px;
                color: #444444;
                text-decoration: none;
                font-weight: bold;
              }
            }
            .news_item_row2 {
              .news_item_type {
                font-size: 14px;
                color: #999999;
                margin-right: 38px;
              }
              .reading {
                font-size: 14px;
                color: #999999;
              }
            }
          }
        }
      }
    }
  }
}

.report {
    position: fixed;
    width: 100%;
    height: 100%;
    margin-top: 80px;
    top: 0px;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, .6);
    z-index: 99999999;
    overflow: hidden;
}
.report .report-content {
  position: absolute;
  top: 50%;
  left: 50%;
  right: 0;
  bottom: 0;
  width: 560px;
  height: 560px;
  margin-top: -280px;
  margin-left: -280px;
  .close {
    width: 41px;
    height: 41px;
    background: url('../../../../../static/images/headline/close.png') no-repeat;
    background-size: cover;
  }
}
.report .report-content .inner {
  width: 510px;
  margin-top: 45px;
  background: #ffffff;
  padding: 45px 45px;
  .editor {
    width: 100%;
    height: 124px;
    margin-top: 18px;
    background: #F7F7F7;
    textarea {
      outline: none;
    }
    .form-control {
      width: 100%;
      height: 124px;
      font-size: 16px;
      color: #D8D8D8;
      padding: 11px 16px;
    }
  }
  .button {
    cursor: pointer;
    width: 100px;
    height: 40px;
    margin-top: 20px;
    line-height: 40px;
    font-size: 14px;
    text-align: center;
    border-radius: 20px;
    color: #ffffff;
    background: #2A9FE4;
  }
}
.report .report-content ul {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  li {
    width: 50%;
    height: 20px;
  }
}
.report .report-content .title {
    font-size: 20px;
    color: #333333;
    padding-bottom: 15px;
    border-bottom: 1px solid #ddd;
}
.report .report-item {
  margin-top: 17px;
  line-height: 17px;
}

.report .report-item input {
  cursor: pointer;
  position: absolute;
  -webkit-appearance: checkbox;
  appearance: checkbox;
  -webkit-appearance: checkbox;
  -webkit-appearance: checkbox;
  -ms-appearance: checkbox;
  -moz-appearance: checkbox;
  -o-appearance: checkbox;
}

// .report-item span {
//   position: relative;
//   display: inline-block;
//   width: 17px;
//   height: 17px;
// }

.report .report-item > label {
  cursor: pointer;
  position: absolute;
  margin-left: 20px;
  font-size: 16px;
  color: #333333;
}

// .report-item .input_check+label {
//   display: inline-block;
//   width: 17px;
//   height: 17px;
//   background: url('../../../../../static/images/headline/unchecked3.png') no-repeat;
//   background-size: cover;
//   cursor:pointer;
// }

// .report-item .input_check:checked+label {
//   background: url('../../../../../static/images/headline/unchecked3.png');
//   background-size: cover;
//   cursor:pointer;
// }

// .report-item span {
//   font-size: 16px;
//   color: #333333;
// }

.report .report-content textarea {
  border: 0;
  background-color: #F7F7F7;
  border-radius: 5px;
  font-size: 16px;
  background-image: none;
  outline: 0;
  overflow: hidden;
  resize: none;
}

.report textarea::-webkit-input-placeholder {
  color: #D8D8D8;
  font-size: 16px;
}

.report textarea::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #D8D8D8;
  font-size: 16px;
}

.report textarea:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #D8D8D8;
  font-size: 16px;
}

.report textarea:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: #D8D8D8;
  font-size: 16px;
}
.report .toast1 {
  // display: none;
  position: relative;
  width: 150px;
  height: 90px;
  border-radius: 15px;
  background: rgb(0, 0, 0);
  color: #999999;
  box-sizing: border-box;
  text-align: center;
  z-index: 1000;
  margin: -50% auto;
  left: 0;
  right: 0;
  padding: 20px 20px;
  visibility:visible;
  -webkit-animation-fill-mode:both;
}
.report .toast-text {
  font-size: 16px;
  display: inline-block;
  text-align: center;
  vertical-align: top;
}
.report .toast2 {
  // display: none;
  position: relative;
  width: 150px;
  height: 90px;
  border-radius: 15px;
  background: rgb(0, 0, 0);
  color: #999999;
  box-sizing: border-box;
  text-align: center;
  z-index: 1000;
  margin: -50% auto;
  left: 0;
  right: 0;
  padding: 20px 20px;
  visibility:visible;
  -webkit-animation-fill-mode:both;
  .toast-text {
    line-height: 50px;
  }
}
@-webkit-keyframes fadeOut {
  0% {
    opacity: 1;
    /*初始状态 透明度为1*/
  }
  50% {
    opacity: 1;
    /*中间状态 透明度为1*/
  }
  70% {
    opacity: 0.8;
    /*中间状态 透明度为0.8*/
  }
  100% {
    opacity: 0;
    visibility: hidden;
    /*结尾状态 透明度为0*/
  }
}

.toast-fadeOut {
  -webkit-animation-name: fadeOut;
  /*动画名称*/
  -webkit-animation-duration: 1s;
  /*动画持续时间*/
  -webkit-animation-iteration-count: 1;
  /*动画次数*/
  -webkit-animation-delay: 0s;
  /*延迟时间*/
}

</style>
