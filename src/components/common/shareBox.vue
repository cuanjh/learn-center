<template>
  <div class="share">
    <div class="gb_resLay">
      <div class="bdsharebuttonbox">
        <ul class="gb_resItms">
          <li>
            <!--  @mouseenter=""  -->
            <a title="分享到微信" href="javascript:;" class="bds_weixin" data-cmd="weixin" @click="shareCourseCard(shareCourse)" @mouseleave="leaveWX()">
            </a>
          </li>
          <li> <a title="分享到新浪微博" href="javascript:;" class="bds_tsina" data-cmd="tsina" @click="shareCourseCard(shareCourse)"></a></li>
          <li> <a title="分享到QQ好友" href="javascript:;" class="bds_sqq" data-cmd="sqq" @click="shareCourseCard(shareCourse)"></a></li>
          <li> <a title="分享到QQ空间" href="javascript:;" class="bds_qzone" data-cmd="qzone" @click="shareCourseCard(shareCourse)"></a></li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import Bus from '../../bus.js'
import $ from 'jquery'
import cookie from '../../tool/cookie'
export default {
  props: ['type'], // 1: 电台详情分享 2: 电台卡片分享 3: 官方课程详情分享
  data () {
    return {
      shareCourse: {}
    }
  },
  created () {
    Bus.$on('shareCardContent', (shareCard) => {
      console.log('当前要分享的卡片', shareCard)
      const s = document.createElement('script')
      s.type = 'text/javascript'
      s.src = '/static/api/js/share.js?cdnversion=' + ~(-new Date() / 36e5)
      document.body.appendChild(s)
      this.shareCourse = shareCard
    })
  },
  mounted () {
    console.log('type', this.type)
  },
  methods: {
    leaveWX () {
      $('#bdshare_weixin_qrcode_dialog').hide()
    },
    shareCourseCard (course) {
      console.log('course', course)
      let userId = cookie.getCookie('user_id')
      if (!userId) {
        Bus.$emit('showGoLoginBox')
        return false
      }
      // 分享相关代码
      /* eslint-disable */
      let bdDesc = '', bdText = '', bdPic = '', bdUrl = ''
      if (this.type === '1') {
        bdDesc = '全球说电台课程' //分享时的标题
        bdText = '我在听#全球说#配套课程' + course.module_name + '，随时随地学语言，走到哪里，学到哪里！' //分享时的文本摘要
        bdPic = course.cover //此处为分享时自带的图片
        bdUrl = 'http://share.talkmate.com/course/' + course.code //此处为后台要进行分享的内容的定义
      } else if (this.type === '2') {
        bdDesc = '全球说电台课程' //分享时的标题
        bdText = '我在听#全球说#配套课程' + course.description + '，随时随地学语言，走到哪里，学到哪里！' //分享时的文本摘要
        bdPic = course.cover_url, //此处为分享时自带的图片
        bdUrl = 'http://share.talkmate.com/card/' + course.course_code + '/' + course.card_id //此处为后台要进行分享的内容的定义
      } else {
        bdDesc = '全球说-WAL世界语言地图' //分享时的标题
        bdText = '我从#全球说-世界语言地图#中推荐了' + course.name + '，传承语言文化，扩充语言知识！我在全球说，跟随世界语言地图学习多样语言，传承多样文化' //分享时的文本摘要
        bdPic = course.flag //此处为分享时自带的图片
        bdUrl = 'http://share.talkmate.com/course_new/' + course.course_code //此处为后台要进行分享的内容的定义
      }

      window._bd_share_config = {
        "common":{
          "onBeforeClick": function (cmd, config) {
            return false
          },
          "bdSnsKey":{},
          "bdDesc": bdDesc, //分享时的标题
          "bdText":bdText,//分享时的文本摘要
          "bdMini":"1",
          "bdMiniList":false,
          "bdPic":bdPic, //此处为分享时自带的图片
          "bdUrl":bdUrl, //此处为后台要进行分享的内容的定义
          "bdStyle":"1",
          "bdSize":"24",
        },
        "share":{}
      }

      if (window._bd_share_main) {
        window._bd_share_main.init()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.share {
  .bdsharebuttonbox {
    .gb_resItms {
      display: flex;
      justify-content: center;
    }
  }
  .bdsharebuttonbox a {
    width: 28px!important;
    height: 28px!important;
    margin: 0 auto!important;
    float: none!important;
    padding: 0!important;
    display: block;
    margin-right: 9px!important;
  }
  .bdsharebuttonbox a img { width: 28px; height: 28px; }
  .bdsharebuttonbox .bds_weixin {
    position: relative;
    background: url('../../../static/images/shareImg/weixin.svg') no-repeat center center/28px 28px;
    &:hover {
      background-image: url('../../../static/images/shareImg/weixin-hover.svg');
    }
  }
  .bdsharebuttonbox .bds_tsina {
    background: url('../../../static/images/shareImg/weibo.svg') no-repeat center center/28px 28px;
    &:hover {
      background-image: url('../../../static/images/shareImg/weibo-hover.svg');
    }
  }
  .bdsharebuttonbox .bds_sqq {
    background: url(../../../static/images/shareImg/qq.svg) no-repeat center center/28px 28px;
    &:hover {
      background-image: url('../../../static/images/shareImg/qq-hover.svg');
    }
  }
  .bdsharebuttonbox .bds_qzone {
    background: url(../../../static/images/shareImg/qq-space.svg) no-repeat center center/28px 28px;
    &:hover {
      background-image: url('../../../static/images/shareImg/qq-space-hover.svg');
    }
  }
}
</style>
