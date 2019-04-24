<style scoped>
  .bottom-box {
    position: relative;
    /* background-color: #00315e; */
    padding-top: 62px;
    bottom: 0;
    width: 100%;
    background-color: #1D425A;
  }
  .link-lists {
    width: 1180px;
    overflow: hidden;
    margin: 0px auto;
    display: flex;
    justify-content: space-between;
  }
  .link-lists dl {
    display: inline-block;
    margin-right: 114px;
    vertical-align: top;
    line-height: 20px;
    font-size: 14px;
  }
  .link-lists dl dt {
    font-weight: 600;
    color: #fff;
    padding-bottom: 28px;
  }
  .link-lists dl dd {
    /* font-weight: 400; */
    padding-bottom: 12px;
  }
  .link-lists dl dd a {
    color: #b3c8d6;
  }
  .link-lists dl dd a:hover {
    color: #ffffff;
  }
  .contact-our {
    font-size: 14px;
    color: #8098ae;
    line-height: 20px;
    border-bottom: 1px solid #1a466e;
    padding-top: 25px;
    padding-bottom: 10px;
    width: 1200px;
    margin: 0 auto;
  }
  .contact-our p {
    width: 1200px;
    overflow: hidden;
    margin: 0px auto;
  }
  .contact-our span {
    background-repeat: no-repeat;
    background-position: 20px;
    background-size: 12px;
    padding-left: 40px;
  }
  .contact-our span:nth-child(1) {
    background-image: url('./../../../static/images/home/t.svg');
  }
  .contact-our span:nth-child(2) {
    background-image: url('./../../../static/images/home/e.svg');
  }
  .icp-record {
    width: 1200px;
    overflow: hidden;
    font-size: 12px;
    color: #8098ae;
    line-height: 20px;
    margin: 0px auto;
    padding: 16px 0;
  }
  .footer-right {
    display: inline-block;
  }
  .footer-right .share {
    padding-bottom: 34px;
  }
  .footer-right .share a {
    display: inline-block;
    width: 26px;
    height: 26px;
  }
  .footer-right .share a:nth-child(2) {
    margin: 0 12px;
  }
  .footer-right .share a:nth-child(3) {
    margin-right:12px;
  }
  .footer-right .share a i {
    display: inline-block;
    width: 26px;
    height: 26px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }
  .footer-right .share .weixin {
    background-image: url('../../../static/images/footer/weixin.svg');
  }
  .footer-right .share .flash {
    background-image: url('../../../static/images/footer/facebook.svg');
  }
  .footer-right .share .weibo {
    background-image: url('../../../static/images/footer/weibo.svg');
  }
  .footer-right .share .qq {
    background-image: url('../../../static/images/footer/qq.svg');
  }
  .footer-right .share a:hover .weixin {
    background-image: url('../../../static/images/footer/weixin-hover.svg');
  }
  .footer-right .share a:hover .flash {
    background-image: url('../../../static/images/footer/facebook-hover.svg');
  }
  .footer-right .share a:hover .weibo {
    background-image: url('../../../static/images/footer/weibo-hover.svg');
  }
  .footer-right .share a:hover .qq {
    background-image: url('../../../static/images/footer/qq-hover.svg');
  }

  .footer-right .relation p {
    padding-bottom: 4px;
  }
  .footer-right .relation p i {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 2px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    margin-top: 4px;
  }
  .footer-right .relation p .phone {
    background-image: url('../../../static/images/footer/t.svg');
  }
  .footer-right .relation p .email {
    background-image: url('../../../static/images/footer/e.svg');
  }
  .footer-right .relation p span {
    font-size:15px;
    font-weight:300;
    color:rgba(255,255,255,1);
    line-height:21px;
    letter-spacing:1px;
    padding-left: 6px;
  }
  .footer-right .address {
    padding-top: 10px;
  }
  .footer-right .address ul li {
    padding-bottom: 4px;
  }
  .footer-right .address ul li i {
    display: inline-block;
    width: 8px;
    height: 8px;
    margin-top: 4px;
    background:url('../../../static/images/footer/star.svg') no-repeat center;
    background-size: cover;
  }
  .footer-right .address ul li span {
    font-size:12px;
    font-weight:300;
    color:rgba(128,152,174,1);
    line-height:17px;
    padding-left: 6px;
  }
  .row-bottom {
    width: 100%;
    background-color: #103044;
    margin-top: 50px;
  }
  .footer .copyright{
    width: 1180px;
    margin: 0 auto;
    padding: 22px 0;
    background: #103044;
  }
  .footer .copyright .bottom-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .footer .copyright .bottom-content .bottom .policy {
    padding-right: 34px;
    font-size:13px;
    font-weight:400;
    color:rgba(178,192,201,1);
  }
  .footer .copyright .desc{
    /* padding-left: 50px;
    line-height: 20px;
    font-size: 12px;
    color: #8098ae; */
    font-size:12px;
    font-family:PingFangSC-Light;
    font-weight:300;
    color: #8098AE;
  }
  @media screen and (max-width: 1024px) {
    .link-lists {
      width: 960px;
    }
    .contact-our {
      width: 960px;
    }
    .contact-our p {
      width: 960px;
    }

    .icp-record {
      width: 960px;
    }
  }
</style>
<template>
  <div class="bottom-box footer">
    <div class="link-lists" v-show="false">
      <dl>
        <dt>项目平台</dt>
        <dd><a href="http://www.utlcc.org" rel="nofollow noopener noreferrer" target="_blank">多语言冠军挑战赛</a></dd>
        <dd><a href="http://www.unesco-talkmate.org" rel="nofollow noopener noreferrer" target="_blank">联合国项目办公室</a></dd>
        <dd style="display:none"><a href="javascript:;" target="_blank">全球幼教联盟</a></dd>
        <dd><a href="https://www.talkmate.com/langmuseum.html" rel="nofollow noopener noreferrer" target="_blank">语言博物馆</a></dd>
        <dd><a href="https://www.talkmate.com/langtactic.html" rel="nofollow noopener noreferrer" target="_blank">一带一路语言战略</a></dd>
      </dl>
      <dl>
        <dt>企业文化</dt>
        <dd><a href="javascript:;" target="_blank">技术专利</a></dd>
        <dd><a href="javascript:;" target="_blank">荣誉展示</a></dd>
        <dd><a href="javascript:;" target="_blank">公益之行</a></dd>
      </dl>
      <dl>
        <dt>会员服务</dt>
        <dd><a href="javascript:;" target="_blank">机构会员</a></dd>
        <dd><a href="javascript:;" target="_blank">个人会员</a></dd>
      </dl>
      <dl>
        <dt>帮助中心</dt>
        <dd><a href="javascript:;" target="_blank">资料下载</a></dd>
        <dd><a href="javascript:;" target="_blank">产品建议</a></dd>
        <dd style="display:none"><a href="javascript:;" target="_blank">400客服</a></dd>
      </dl>
    </div>
    <div class="link-lists">
      <div class="footer-left">
        <dl>
          <dt>关于我们</dt>
            <dd><a href="https://www.talkmate.com/aboutus/index.html#company_profile">全球说简介</a></dd>
            <dd><a href="https://www.talkmate.com/aboutus/index.html#committee">UTN简介</a></dd>
            <dd><a href="https://www.talkmate.com/aboutus/index.html#partner">专业委员会</a></dd>
            <dd><a href="https://www.talkmate.com/aboutus/index.html#join_us">加入我们</a></dd>
        </dl>
        <dl>
          <dt>产品与服务</dt>
          <dd><a href="https://www.talkmate.com/product.html#talkmate-home">全球说简介</a></dd>
          <dd><a href="https://www.talkmate.com/product.html#children-course">儿童多语课程</a></dd>
          <dd><a href="https://www.talkmate.com/product.html#standard-course">多语课程PRO</a></dd>
          <dd><a href="https://www.talkmate.com/product.html#multilingual">儿童多语实验班</a></dd>
          <dd><a href="https://www.talkmate.com/product.html#cooperation">合作伙伴</a></dd>
        </dl>
        <dl>
          <dt>学术与公益</dt>
          <dd><a href="https://www.talkmate.com/commonweal.html#subject_research">课题研究</a></dd>
          <dd><a href="https://www.talkmate.com/commonweal.html#language_protection">濒危语言保护</a></dd>
          <dd><a href="https://www.talkmate.com/commonweal.html#language_promotion">世界语言竞赛</a></dd>
        </dl>
        <dl>
          <dt>新闻动态</dt>
          <dd><a href="https://www.talkmate.com/aboutus/news/news2019/index.html">2019</a></dd>
          <dd><a href="https://www.talkmate.com/aboutus/news/news2018/index.html">2018</a></dd>
          <dd><a href="https://www.talkmate.com/aboutus/news/news2017/index.html">2017</a></dd>
          <dd><a href="https://www.talkmate.com/aboutus/news/news2016/index.html">2016</a></dd>
          <dd><a href="https://www.talkmate.com/aboutus/news/news2015/index.html">2015</a></dd>
        </dl>
      </div>
      <div class="footer-right">
        <div class="share">
          <a href="javascript:;"><i class="weixin"></i></a>
          <a href="javascript:;"><i class="flash"></i></a>
          <a href="javascript:;"><i class="weibo"></i></a>
          <a href="javascript:;"><i class="qq"></i></a>
        </div>
        <div class="relation">
          <p><i class="phone"></i><span>400-068-8056</span></p>
          <p><i class="email"></i><span>vip@talkmate.com</span></p>
        </div>
        <div class="address">
          <ul>
            <li>
              <i></i>
              <span>京ICP备14044248号</span>
            </li>
            <li>
              <i></i>
              <span>公安部备案号 11010502036358</span>
            </li>
            <li>
              <i></i>
              <span>出版物经营许可证 第朝180182号</span>
            </li>
            <li>
              <i></i>
              <span>办学许可证 教民111010873930321号</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="row-bottom">
      <div class="copyright">
        <div class="main bottom-content">
          <p class="desc" style="display: none;">北京酷语时代教育科技有限公司 版权所有 @2016 京ICP备14044248号
            <a href="javascript:;" target="_blank">使用条款 | 隐私政策</a>
            <span class="policeICP">{dede:kuyulang key='公安部备案号 11010502036358'/}</span>
          </p>
          <p class="desc">北京酷语时代教育科技有限公司 版权所有 @2016</p>
          <div class="bottom">
            <a class="policy" href="javascript:;" target="_blank">使用条款 | 隐私政策 / 帮助</a>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="contact-our">
      <p>联系我们：<span>400-068-8056</span><span>vip@talkmate.com</span></p>
    </div>
    <div class="icp-record">
      北京酷语时代教育科技有限公司 版权所有 @2016 京ICP备14044248号
      <a href="">使用条款 | 隐私政策</a>
    </div> -->
  </div>
</template>
<script>
export default {
  data () {
    return {}
  }
}
</script>
