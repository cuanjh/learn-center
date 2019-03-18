<template>
  <div class="share">
    <div class="gb_resLay">
      <div class="bdsharebuttonbox">
        <ul class="gb_resItms">
          <li>
            <a title="分享到微信" href="#" class="bds_weixin" data-cmd="weixin" @click="shareWeixin(shareRadio)" >
            </a>
          </li>
          <li> <a title="分享到新浪微博" href="#" class="bds_tsina" data-cmd="tsina" @click="shareWeibo(shareRadio)"></a></li>
          <li> <a title="分享到QQ好友" href="#" class="bds_sqq" data-cmd="sqq" @click="shareQQ(shareRadio)"></a></li>
          <li> <a title="分享到QQ空间" href="#" class="bds_qzone" data-cmd="qzone" @click="shareSpace(shareRadio)"></a></li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import Bus from '../../bus.js'
// import $ from 'jquery'
import cookie from '../../tool/cookie'
export default {
  props: ['type'],
  data () {
    return {
      shareRadio: {}
    }
  },
  beforeCreate () {
  },
  created () {
    Bus.$on('shareCardContent', (shareCard) => {
      let userId = cookie.getCookie('user_id')
      console.log('当前要分享的卡片', shareCard)
      this.shareRadio = shareCard
      console.log('=====>', this.shareRadio)
      if (userId) {
        setTimeout(() => {
          this.setShare(shareCard)
        }, 0)
      }
    })
  },
  mounted () {
    console.log('type', this.type)
  },
  methods: {
    shareWeixin (radio) {
      console.log('radio', radio)
      setTimeout(() => {
        this.setShare(radio)
      }, 0)
    },
    shareWeibo (radio) {
      console.log('radio', radio)
      setTimeout(() => {
        this.setShare(radio)
      }, 0)
    },
    shareQQ (radio) {
      setTimeout(() => {
        this.setShare(radio)
      }, 0)
    },
    shareSpace (radio) {
      setTimeout(() => {
        this.setShare(radio)
      }, 0)
    },
    setShare (radio) {
      let userId = cookie.getCookie('user_id')
      if (!userId) {
        Bus.$emit('showGoLoginBox')
        return false
      }
      // 分享相关代码
      /* eslint-disable */
      if (this.type === '1') {
        window._bd_share_config = {
          "common":{
            "bdSnsKey":{},
            "bdDesc": "全球说电台课程", //分享时的标题
            "bdText":"我在听#全球说#配套课程"+radio.module_name+"，随时随地学语言，走到哪里，学到哪里！",//分享时的文本摘要
            "bdMini":"1",
            "bdMiniList":false,
            "bdPic":radio.cover, //此处为分享时自带的图片
            "bdUrl":'http://share.talkmate.com/course/' + radio.code, //此处为后台要进行分享的内容的定义
            "bdStyle":"1",
            "bdSize":"24",
          },
          "share":{},
          "selectShare":{
            "bdContainerClass":null,
            "bdSelectMiniList":["weixin","tsina","sqq","qzone"]
          }
        }
      } else {
        window._bd_share_config = {
          "common":{
            "bdSnsKey":{},
            "bdDesc": "全球说电台课程", //分享时的标题
            "bdText":"我在听#全球说#配套课程"+radio.description+"，随时随地学语言，走到哪里，学到哪里！",//分享时的文本摘要
            "bdMini":"1",
            "bdMiniList":false,
            "bdPic":radio.cover_url, //此处为分享时自带的图片
            "bdUrl":'http://share.talkmate.com/card/' + radio.course_code + '/' + radio.card_id, //此处为后台要进行分享的内容的定义
            "bdStyle":"1",
            "bdSize":"24",
          },
          "share":{},
          "selectShare":{
            "bdContainerClass":null,
            "bdSelectMiniList":["weixin","tsina","sqq","qzone"]
          }
        }
      }
      const s = document.createElement('script')
      s.type = 'text/javascript'
      s.src = '/static/api/js/share.js?v=89860593.js?cdnversion=' + ~(-new Date() / 36e5)
      document.body.appendChild(s)
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
  .bd_weixin_popup .bd_weixin_popup_foot {
    position: relative; top: -12px;
  }
}
.bdshare_weixin_qrcode_dialog_bg {
  width: 262px!important;
  height: 297px!important;
  left: 517.5px!important;
  top: 324.5px!important;
  display: block!important;
}
</style>
