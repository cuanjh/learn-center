<template>
  <div class="reference">
    <div class="reference-content">
      <div class="sign">
        <div class="sign-name">
          <i></i>
          <span>为你推荐的语伴</span>
        </div>
        <div class="more-partner">
          <span>更多语伴</span>
        </div>
      </div>
      <div class="partner-lists">
        <ul>
          <li v-for="(partner, index) in partnerLists.slice(0, 5)" :key="index">
            <div class="item-content">
              <div class="title-img">
                <img :src="partner.photo" alt="推荐语伴头像">
                <div class="country-img">
                  <img :src="partner.country_flag" alt="国家图片">
                </div>
              </div>
              <div class="name">
                <span>{{partner.nickname}}</span>
              </div>
              <div class="course">
                <span>{{partner.country_name}}</span>
              </div>
              <div class="attention">
                <span ><i></i>关注</span>
                <!-- <span ><i></i>取消关注</span> -->
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="exchange">
        <span>换一批</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['partnerLists'],
  data () {
    return {
    }
  }
}
</script>
<style lang="less" scoped>
.reference {
  width: 100%;
  background: #ffffff;
  .reference-content {
    width: 100%;
    padding: 27px 0 38px;
    .sign {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 30px;
      .sign-name {
        display: flex;
        align-items: center;
        font-size:16px;
        font-family:PingFang-SC-Bold;
        font-weight:bold;
        color:rgba(16,48,68,1);
        i {
          width: 36px;
          height: 36px;
          background-image: url('../../../../static/images/community/language.svg');
          background-repeat: no-repeat;
          background-size: cover;
          display: inline-block;
          margin-right: 15px;
        }
      }
      .more-partner {
        cursor: pointer;
        font-size:14px;
        font-family:PingFang-SC-Medium;
        font-weight:500;
        color:rgba(60,91,111,1);
      }
    }
    .partner-lists {
      width: 100%;
      ul {
        width: 100%;
        padding: 40px 33px;
        display: flex;
        justify-content:space-between;
        li {
          width: 19%;
          background:rgba(250,252,253,1);
          border-radius:5px;
          border:1px solid rgba(230,235,238,0.56);
          .item-content {
            width: 100%;
            padding: 26px 0;
            .title-img {
              position: relative;
              width: 60px;
              height: 60px;
              margin: 0 auto;
              img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
              }
              .country-img {
                width: 18px;
                height: 18px;
                position: absolute;
                bottom: 0;
                right: 0;
              }
            }
            .name {
              display: inline-block;
              width: 100%;
              text-align: center;
              padding: 15px 0 10px;
              span {
                font-size:14px;
                font-family:PingFangSC-Semibold;
                font-weight:600;
                color:rgba(51,51,51,1);
              }
            }
            .course {
              width: 100%;
              display: inline-block;
              text-align: center;
              span {
                font-size:12px;
                font-family:PingFang-SC-Medium;
                font-weight:500;
                color:rgba(153,153,153,1);
              }
            }
            .attention {
              cursor: pointer;
              padding: 25px 0;
              text-align: center;
              span {
                background:rgba(255,255,255,1);
                border-radius:18px;
                border:1px solid rgba(230,235,238,1);
                padding: 5px 22px;
                font-size:13px;
                font-family:PingFang-SC-Medium;
                font-weight:500;
                color:rgba(16,48,68,1);
                i {
                  display: inline-block;
                  width: 8px;
                  height: 8px;
                  background: url('../../../../static/images/authLogin/weixin.svg') no-repeat center;
                  background-size: cover;
                  margin-right: 7px;
                  margin-top: 8px;
                }
              }
            }
          }
        }
      }
    }
    .exchange {
      cursor: pointer;
      width: 100%;
      text-align: right;
      padding: 0 33px;
      span {
        font-size:14px;
        font-family:PingFang-SC-Medium;
        font-weight:500;
        color:rgba(144,162,174,1);
      }
    }
  }
}
</style>
