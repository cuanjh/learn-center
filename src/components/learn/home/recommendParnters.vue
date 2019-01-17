<template>
    <!-- 上面的推荐 -->
    <div class="recommend-top">
      <div class="recommend-lists">
        <div class="header">
          <div class="left">
            <i></i>
            <span>为你推荐的语伴</span>
          </div>
          <div class="all"><span>全部</span></div>
        </div>
        <div class="recommend-partners">
          <ul>
            <li v-for="(partner, index) in parnterLists" :key="index">
              <div class="partner-img">
                <div class="header-img">
                  <img :src="partner.photo" alt="推荐语伴头像">
                  <div class="country-img">
                    <img :src="partner.country_flag" alt="国家图片">
                  </div>
                </div>
                <div class="name">
                  <p class="title">{{partner.nickname}}</p>
                  <p class="language">
                    <span>{{partner.country_name}}</span>
                    <!-- <span>{{partner.country_name}}<i></i></span> -->
                    <!-- <span v-for="(lang, index) in partner.lang_infos" :key="index">{{lang.name}}</span> -->
                  </p>
                </div>
              </div>
              <div class="focus">
                <span>关注</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="refresh">
        <span>换一批</span>
      </div>
    </div>
</template>
<script>
export default {
  props: ['parnterLists'],
  data () {
    return {}
  },
  mounted () {},
  computed: {},
  methods: {}
}
</script>
<style lang="less" scoped>
.recommend-top {
  width: 100%;
  padding: 37px 30px 36px;
  background: #ffffff;
  .header {
    display: flex;
    justify-content: space-between;
    font-size:16px;
    font-family:PingFang-SC-Bold;
    font-weight:bold;
    color:rgba(51,51,51,1);
    line-height:36px;
    i {
      display: inline-block;
      width: 36px;
      height: 36px;
      background: url('../../../../static/images/community/language.svg') no-repeat center;
      background-size: 100%;
      margin-right: 10px;
    }
    .all {
      cursor: pointer;
      font-size:14px;
      font-family:PingFang-SC-Medium;
      font-weight:500;
      color:rgba(60,91,111,1);
      line-height:36px;
    }
  }
  .recommend-lists {
    width: 100%;
    .recommend-partners {
      width: 100%;
      margin-top: 30px;
      ul {
        width: 100%;
        li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 18px;
          .partner-img {
            display: flex;
            align-items: center;
            .header-img {
              position: relative;
              width: 54px;
              height: 54px;
              margin-right: 10px;
              img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
              }
              .country-img {
                width: 16px;
                height: 16px;
                position: absolute;
                bottom: 0;
                right: 0;
              }
            }
            .name {
              .title {
                font-size: 14px;
                font-family:HiraKakuStdN-W8;
                color: #4A5C64;
              }
              .language {
                font-size:12px;
                font-family:PingFang-SC-Medium;
                font-weight:500;
                color:rgba(144,162,174,1);
                span:nth-child(1) {
                  display: inline-block;
                  i {
                    display: inline-block;
                    width: 10px;
                    height: 11px;
                    background: url('../../../../static/images/community/Line.svg') no-repeat center;
                    background-size: 100%;
                    margin-top: 6px;
                  }
                }
              }
            }
          }
          .focus {
            cursor: pointer;
            width:50px;
            height:24px;
            border-radius:16px;
            border:1px solid rgba(213,221,226,1);
            text-align: center;
            span {
              font-size:12px;
              font-family:PingFang-SC-Bold;
              font-weight:bold;
              color:rgba(42,159,228,1);
              line-height:24px;
            }
          }
        }
      }
    }
  }
  .refresh {
    font-size:14px;
    font-family:PingFang-SC-Medium;
    font-weight:500;
    color:rgba(144,162,174,1);
    line-height:20px;
    text-align: right;
    span {
      cursor: pointer;
    }
  }
}
</style>
