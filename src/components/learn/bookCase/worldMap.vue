<template>
  <div class="world-map">
    <div class="nav">
      <div class="nav-circle"></div>
      <router-link :to="{path: '/app/book-case'}">
        <span>书架</span>
      </router-link>
      /
      <div class="nav-current">
        世界语言地图
      </div>
    </div>
    <div class="world-container">
      <div class="world-header">
        <div class="five-continents">
          <a class="america" v-bind:class="{'active': 'Americas' == tabCountry}" @click="tabChange('Americas')"  href="javascript:;"><i></i><span>美洲</span></a>
          <a class="europe" v-bind:class="{'active': 'Europe' == tabCountry}" @click="tabChange('Europe')"  href="javascript:;"><i></i><span>欧洲</span></a>
          <a class="asia" v-bind:class="{'active': 'Asia' == tabCountry}" @click="tabChange('Asia')"  href="javascript:;"><i></i><span>亚洲</span></a>
          <a class="africa" v-bind:class="{'active': 'Africa' == tabCountry}" @click="tabChange('Africa')"  href="javascript:;"><i></i><span>非洲</span></a>
          <a class="oceania" v-bind:class="{'active': 'Pacific' == tabCountry}" @click="tabChange('Pacific')"  href="javascript:;"><i></i><span>大洋洲</span></a>
        </div>
        <div class="content">
          <div class="text" v-show="'country' == tabCountry">
            <p class="title">世界语言地图</p>
            <p class="details">查找，阅读和研究世界上已知的7,097种生活语言。</p>
            <p class="indicators">
              <span class="icon"></span>
              <span>在左侧地图选择大洲</span>
            </p>
          </div>
          <div class="country-america" v-show="'Americas' == tabCountry">
            <ul class="america-list">
              <i class="background"></i>
              <li class="title">美洲</li>
              <li class="number">
                <span>所有人口</span>
                <span>437654678</span>
              </li>
              <li class="language">
                <span>拥有语言</span>
                <span>2300</span>
              </li>
              <li class="main-countries">
                  <span>主要国家</span>
                  <p class="main-list">
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                  </p>
              </li>
            </ul>
          </div>
          <div class="country-europe" v-show="'Europe' == tabCountry">
            <ul class="europe-list">
              <i class="background"></i>
              <li class="title">欧洲</li>
              <li class="number">
                <span>所有人口</span>
                <span>437654678</span>
              </li>
              <li class="language">
                <span>拥有语言</span>
                <span>2300</span>
              </li>
              <li class="main-countries">
                  <span>主要国家</span>
                  <p class="main-list">
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                  </p>
              </li>
            </ul>
          </div>
          <div class="country-asia" v-show="'Asia' == tabCountry">
            <ul class="asia-list">
              <i class="background"></i>
              <li class="title">亚洲</li>
              <li class="number">
                <span>所有人口</span>
                <span>437654678</span>
              </li>
              <li class="language">
                <span>拥有语言</span>
                <span>2300</span>
              </li>
              <li class="main-countries">
                  <span>主要国家</span>
                  <p class="main-list">
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                  </p>
              </li>
            </ul>
          </div>
          <div class="country-africa" v-show="'Africa' == tabCountry">
            <ul class="africa-list">
              <i class="background"></i>
              <li class="title">非洲</li>
              <li class="number">
                <span>所有人口</span>
                <span>437654678</span>
              </li>
              <li class="language">
                <span>拥有语言</span>
                <span>2300</span>
              </li>
              <li class="main-countries">
                  <span>主要国家</span>
                  <p class="main-list">
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                  </p>
              </li>
            </ul>
          </div>
          <div class="country-oceania" v-show="'Pacific' == tabCountry">
            <ul class="oceania-list">
              <i class="background"></i>
              <li class="title">大洋洲</li>
              <li class="number">
                <span>所有人口</span>
                <span>437654678</span>
              </li>
              <li class="language">
                <span>拥有语言</span>
                <span>2300</span>
              </li>
              <li class="main-countries">
                  <span>主要国家</span>
                  <p class="main-list">
                    <i></i>
                    <i></i>
                  </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <countyies :allAreasInfo='allAreasInfo' :tabCountry='tabCountry'/>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import countyies from './countries'
export default {
  data () {
    return {
      tabCountry: 'country',
      isShow: false,
      allAreasInfo: [] // 全部
    }
  },
  components: {
    countyies
  },
  mounted () {
    this.getMapInfoByCountry()
  },
  methods: {
    ...mapActions({
      worldLanguageMap: 'course/worldLanguageMap'
    }),
    tabChange (tabCountry) {
      this.tabCountry = tabCountry
      this.getMapInfoByCountry(tabCountry)
    },
    getMapInfoByCountry (tabCountry) {
      this.allAreasInfo = []
      this.worldLanguageMap().then(res => {
        console.log('res', res)
        res.maps.forEach(items => {
          let pName2 = items.name
          let pCode2 = items.code
          if (tabCountry) {
            if (pName2 === tabCountry) {
              items.areasInfo.forEach(item => {
                let pCode1 = item.code
                let pName1 = item.name
                item.countriesInfo.forEach(country => {
                  let obj = country
                  obj['pCode1'] = pCode1
                  obj['pCode2'] = pCode2
                  obj['pName1'] = pName1
                  obj['pName2'] = pName2
                  obj['letter'] = country.name.slice(0, 1)
                  this.allAreasInfo.push(obj)
                })
              })
            }
          } else {
            items.areasInfo.forEach(item => {
              let pCode1 = item.code
              let pName1 = item.name
              item.countriesInfo.forEach(country => {
                let obj = country
                obj['pCode1'] = pCode1
                obj['pCode2'] = pCode2
                obj['pName1'] = pName1
                obj['pName2'] = pName2
                obj['letter'] = country.name.slice(0, 1)
                this.allAreasInfo.push(obj)
              })
            })
          }
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
a {
    text-decoration:none;
  }
.world-map {
  width: 1200px;
  margin: 0px auto 144px;
}

.nav {
  margin: 20px 0;
  font-weight: bold;
  display: inline-block;
  font-size: 20px;
}

.nav-circle {
  height: 6px;
  width: 6px;
  border-radius: 50%;
  background-color: #999999;
  display: inline-block;
  margin-top: 9px;
}

.nav span {
  color: #999999;
}

.nav-current {
  display: inline-block;
  color: #2A9FE4;
}

.world-container {
  width: 1180px;
  .world-header {
    width: 100%;
    height: 451px;
    background: #ffffff;
    padding: 30px;
    .five-continents {
      position: relative;
      display: inline-block;
      width: 75%;
      height: 100%;
      border-right: 1px solid #EBEBEB;
      font-size: 14px;
      color: #ffffff;
      .america { // 美洲
        width: 248px;
        height: 391px;
        display: inline-block;
        &:hover {
          i {
            transform: scale(1.2,1.2);
          }
        }
        i {
          display: inline-block;
          width: 248px;
          height: 391px;
          background: url('../../../../static/images/bookCase/map/america.png') no-repeat;
          background-size: 240px 380px;
        }
        span {
          display: inline-block;
          position: absolute;
          top: 36%;
          left: 13%;
        }
        &.active {
          i {
            background: url('../../../../static/images/bookCase/map/americaSelected.png') no-repeat;
            background-size: 240px 380px;
          }
        }
      }
      .europe { // 欧洲
        display: inline-block;
        width: 500px;
        height: 180px;
        &:hover {
          i {
            transform: scale(1.2,1.2);
          }
        }
        i {
          display: inline-block;
          width: 500px;
          height: 180px;
          background: url('../../../../static/images/bookCase/map/europe.png') no-repeat;
          background-size: 400px 160px;
          background-position-y: 22px;
          background-position-x: 50px;
        }
        span {
          display: inline-block;
          position: absolute;
          top: 27%;
          left: 47%;
        }
        &.active {
          i {
            background: url('../../../../static/images/bookCase/map/europeSelected.png') no-repeat;
            background-size: 400px 160px;
            background-position-y: 22px;
            background-position-x: 50px;
          }
        }
      }
      .asia { // 亚洲
        width: 234px;
        height: 186px;
        display: inline-block;
        position: absolute;
        top: 126px;
        left: 381px;
        &:hover {
          i {
            transform: scale(1.2,1.2);
          }
        }
        i {
          display: inline-block;
          width: 234px;
          height: 186px;
          background: url('../../../../static/images/bookCase/map/asia.png') no-repeat;
          background-size: 234px 186px;
        }
        span {
          display: inline-block;
          position: absolute;
          top: 19%;
          left: 47%;
        }
        &.active {
          i {
            background: url('../../../../static/images/bookCase/map/asiaSelected.png') no-repeat;
            background-size: 234px 186px;
          }
        }
      }
      .africa { // 非洲
        display: inline-block;
        width: 145px;
        height: 138px;
        position: absolute;
        top: 173px;
        left: 294px;
        &:hover {
          i {
            transform: scale(1.2,1.2);
          }
        }
        i {
          display: inline-block;
          width: 145px;
          height: 138px;
          background: url('../../../../static/images/bookCase/map/africa.png') no-repeat;
          background-size: 145px 138px;
        }
        span {
          display: inline-block;
          position: absolute;
          top: 24%;
          left: 43%;
        }
        &.active {
          i {
            background: url('../../../../static/images/bookCase/map/africaSelected.png') no-repeat;
            background-size: 145px 138px;
          }
        }
      }
      .oceania { // 大洋洲
        display: inline-block;
        width: 130px;
        height: 151px;
        position: absolute;
        top: 210px;
        left: 550px;
        &:hover {
          i {
            transform: scale(1.2,1.2);
          }
        }
        i {
          display: inline-block;
          width: 130px;
          height: 151px;
          background: url('../../../../static/images/bookCase/map/oceania.png') no-repeat;
          background-size: 130px 151px;
        }
        span {
          display: inline-block;
          position: absolute;
          top: 43%;
          left: 17%;
        }
        &.active {
          i {
            background: url('../../../../static/images/bookCase/map/oceaniaSelected.png') no-repeat;
            background-size: 130px 151px;
          }
        }
      }
    }
    .content {
      display: inline-block;
      width: 24%;
      height: 100%;
      .text {
        width: 100%;
        height: 100%;
        display: inline-block;
        .title {
          height: 45px;
          font-size: 32px;
          color: #444444;
          margin-top: 40px;
          margin-bottom: 16px;
          padding-left: 30px;
        }
        .details {
          height: 56px;
          font-size: 20px;
          color: #B5B5B5;
          text-align: left;
          padding-left: 30px;
          margin-bottom: 160px;
        }
        .indicators {
          height: 28px;
          font-size: 20px;
          color: #444444;
          line-height: 20px;
          padding-left: 30px;
          text-align: left;
          .icon {
            display: inline-block;
            width: 13px;
            height: 18px;
            background: url('../../../../static/images/bookCase/triangle.png') no-repeat;
            background-size: 13px 18px;
            margin-top: 2px;
          }
        }
      }
      // 美洲
      .country-america {
        position: relative;
        width: 100%;
        height: 100%;
        .america-list {
          width: 100%;
          height: 100%;
          padding-left: 30px;
          .background {
            display: inline-block;
            width: 100%;
            height: 196px;
            background: url('../../../../static/images/bookCase/map/americaBackground.png') no-repeat;
            background-size: 216px 180px;
            background-position-x: 36px;
            background-position-y: 12px;
          }
          .title {
            width: 100%;
            height: 40px;
            font-size: 32px;
            color: #444444;
            position: absolute;
            top: 74px;
          }
          .number {
            margin-bottom: 20px;
            span:nth-child(1){
              width: 60px;
              height: 21px;
              display: inline-block;
              font-size: 15px;
              color: #444444;
              margin-right: 10px;
              line-height: 21px;
            }
            span:nth-child(2){
              width: 76px;
              height: 18px;
              display: inline-block;
              font-size: 15px;
              color: #B5B5B5;
              line-height: 18px;
            }
          }
          .language {
            margin-bottom: 20px;
            span:nth-child(1){
              width: 60px;
              height: 21px;
              display: inline-block;
              font-size: 15px;
              color: #444444;
              margin-right: 10px;
              line-height: 21px;
            }
            span:nth-child(2){
              width: 76px;
              height: 18px;
              display: inline-block;
              font-size: 15px;
              color: #B5B5B5;
              line-height: 18px;
            }
          }
          .main-countries {
            span{
              width: 60px;
              height: 21px;
              display: inline-block;
              font-size: 15px;
              color: #444444;
              margin-right: 10px;
              line-height: 21px;
            }
            .main-list {
              display: inline-block;
              width: 152px;
              i {
                display: inline-block;
                width: 40px;
                height: 26px;
                box-shadow: 0px 2px 4px 0px #000000;
                margin-bottom: 10px;
                &:nth-child(1){
                  background: url('../../../../static/images/bookCase/america/CN@2x.png') no-repeat;
                  background-size: 40px 26px;
                }
                &:nth-child(2){
                  background: url('../../../../static/images/bookCase/america/IN@2x.png') no-repeat;
                  background-size: 40px 26px;
                  margin: 0 10px;
                }
                &:nth-child(3){
                  background: url('../../../../static/images/bookCase/america/JP@2x.png') no-repeat;
                  background-size: 40px 26px;
                }
                &:nth-child(4){
                  background: url('../../../../static/images/bookCase/america/KR@2x.png') no-repeat;
                  background-size: 40px 26px;
                  margin-right: 10px;
                }
                &:nth-child(5){
                  background: url('../../../../static/images/bookCase/america/MA@2x.png') no-repeat;
                  background-size: 40px 26px;
                }
              }
            }
          }
        }
      }
      // 欧洲
      .country-europe {
        position: relative;
        width: 100%;
        height: 100%;
        .europe-list {
          width: 100%;
          height: 100%;
          padding-left: 30px;
          .background {
            display: inline-block;
            width: 100%;
            height: 196px;
            background: url('../../../../static/images/bookCase/map/europeBackground.png') no-repeat;
            background-size: 216px 180px;
            background-position-x: 36px;
            background-position-y: 12px;
          }
          .title {
            width: 100%;
            height: 40px;
            font-size: 32px;
            color: #444444;
            position: absolute;
            top: 74px;
          }
          .number {
            margin-bottom: 20px;
            span:nth-child(1){
              width: 60px;
              height: 21px;
              display: inline-block;
              font-size: 15px;
              color: #444444;
              margin-right: 10px;
              line-height: 21px;
            }
            span:nth-child(2){
              width: 76px;
              height: 18px;
              display: inline-block;
              font-size: 15px;
              color: #B5B5B5;
              line-height: 18px;
            }
          }
          .language {
            margin-bottom: 20px;
            span:nth-child(1){
              width: 60px;
              height: 21px;
              display: inline-block;
              font-size: 15px;
              color: #444444;
              margin-right: 10px;
              line-height: 21px;
            }
            span:nth-child(2){
              width: 76px;
              height: 18px;
              display: inline-block;
              font-size: 15px;
              color: #B5B5B5;
              line-height: 18px;
            }
          }
          .main-countries {
            span{
              width: 60px;
              height: 21px;
              display: inline-block;
              font-size: 15px;
              color: #444444;
              margin-right: 10px;
              line-height: 21px;
            }
            .main-list {
              display: inline-block;
              width: 152px;
              i {
                display: inline-block;
                width: 40px;
                height: 26px;
                box-shadow: 0px 2px 4px 0px #000000;
                margin-bottom: 10px;
                &:nth-child(1){
                  background: url('../../../../static/images/bookCase/europe/CN@2x.png') no-repeat;
                  background-size: 40px 26px;
                }
                &:nth-child(2){
                  background: url('../../../../static/images/bookCase/europe/IN@2x.png') no-repeat;
                  background-size: 40px 26px;
                  margin: 0 10px;
                }
                &:nth-child(3){
                  background: url('../../../../static/images/bookCase/europe/JP@2x.png') no-repeat;
                  background-size: 40px 26px;
                }
                &:nth-child(4){
                  background: url('../../../../static/images/bookCase/europe/KR@2x.png') no-repeat;
                  background-size: 40px 26px;
                  margin-right: 10px;
                }
                &:nth-child(5){
                  background: url('../../../../static/images/bookCase/europe/SG@2x.png') no-repeat;
                  background-size: 40px 26px;
                }
              }
            }
          }
        }
      }
      // 亚洲
      .country-asia {
        position: relative;
        width: 100%;
        height: 100%;
        .asia-list {
          width: 100%;
          height: 100%;
          padding-left: 30px;
          .background {
            display: inline-block;
            width: 100%;
            height: 196px;
            background: url('../../../../static/images/bookCase/map/asiaBackground.png') no-repeat;
            background-size: 216px 180px;
            background-position-x: 36px;
            background-position-y: 12px;
          }
          .title {
            width: 100%;
            height: 40px;
            font-size: 32px;
            color: #444444;
            position: absolute;
            top: 74px;
          }
          .number {
            margin-bottom: 20px;
            span:nth-child(1){
              width: 60px;
              height: 21px;
              display: inline-block;
              font-size: 15px;
              color: #444444;
              margin-right: 10px;
              line-height: 21px;
            }
            span:nth-child(2){
              width: 76px;
              height: 18px;
              display: inline-block;
              font-size: 15px;
              color: #B5B5B5;
              line-height: 18px;
            }
          }
          .language {
            margin-bottom: 20px;
            span:nth-child(1){
              width: 60px;
              height: 21px;
              display: inline-block;
              font-size: 15px;
              color: #444444;
              margin-right: 10px;
              line-height: 21px;
            }
            span:nth-child(2){
              width: 76px;
              height: 18px;
              display: inline-block;
              font-size: 15px;
              color: #B5B5B5;
              line-height: 18px;
            }
          }
          .main-countries {
            span{
              width: 60px;
              height: 21px;
              display: inline-block;
              font-size: 15px;
              color: #444444;
              margin-right: 10px;
              line-height: 21px;
            }
            .main-list {
              display: inline-block;
              width: 152px;
              i {
                display: inline-block;
                width: 40px;
                height: 26px;
                box-shadow: 0px 2px 4px 0px #000000;
                margin-bottom: 10px;
                &:nth-child(1){
                  background: url('../../../../static/images/bookCase/asia/CN@2x.png') no-repeat;
                  background-size: 40px 26px;
                }
                &:nth-child(2){
                  background: url('../../../../static/images/bookCase/asia/IN@2x.png') no-repeat;
                  background-size: 40px 26px;
                  margin: 0 10px;
                }
                &:nth-child(3){
                  background: url('../../../../static/images/bookCase/asia/JP@2x.png') no-repeat;
                  background-size: 40px 26px;
                }
                &:nth-child(4){
                  background: url('../../../../static/images/bookCase/asia/KR@2x.png') no-repeat;
                  background-size: 40px 26px;
                  margin-right: 10px;
                }
                &:nth-child(5){
                  background: url('../../../../static/images/bookCase/asia/SG@2x.png') no-repeat;
                  background-size: 40px 26px;
                }
              }
            }
          }
        }
      }
      // 非洲
      .country-africa {
        position: relative;
        width: 100%;
        height: 100%;
        .africa-list {
          width: 100%;
          height: 100%;
          padding-left: 30px;
          .background {
            display: inline-block;
            width: 100%;
            height: 196px;
            background: url('../../../../static/images/bookCase/map/africaBackground.png') no-repeat;
            background-size: 216px 180px;
            background-position-x: 36px;
            background-position-y: 12px;
          }
          .title {
            width: 100%;
            height: 40px;
            font-size: 32px;
            color: #444444;
            position: absolute;
            top: 74px;
          }
          .number {
            margin-bottom: 20px;
            span:nth-child(1){
              width: 60px;
              height: 21px;
              display: inline-block;
              font-size: 15px;
              color: #444444;
              margin-right: 10px;
              line-height: 21px;
            }
            span:nth-child(2){
              width: 76px;
              height: 18px;
              display: inline-block;
              font-size: 15px;
              color: #B5B5B5;
              line-height: 18px;
            }
          }
          .language {
            margin-bottom: 20px;
            span:nth-child(1){
              width: 60px;
              height: 21px;
              display: inline-block;
              font-size: 15px;
              color: #444444;
              margin-right: 10px;
              line-height: 21px;
            }
            span:nth-child(2){
              width: 76px;
              height: 18px;
              display: inline-block;
              font-size: 15px;
              color: #B5B5B5;
              line-height: 18px;
            }
          }
          .main-countries {
            span{
              width: 60px;
              height: 21px;
              display: inline-block;
              font-size: 15px;
              color: #444444;
              margin-right: 10px;
              line-height: 21px;
            }
            .main-list {
              display: inline-block;
              width: 152px;
              i {
                display: inline-block;
                width: 40px;
                height: 26px;
                box-shadow: 0px 2px 4px 0px #000000;
                margin-bottom: 10px;
                &:nth-child(1){
                  background: url('../../../../static/images/bookCase/africa/CN@2x.png') no-repeat;
                  background-size: 40px 26px;
                }
                &:nth-child(2){
                  background: url('../../../../static/images/bookCase/africa/IN@2x.png') no-repeat;
                  background-size: 40px 26px;
                  margin: 0 10px;
                }
                &:nth-child(3){
                  background: url('../../../../static/images/bookCase/africa/JP@2x.png') no-repeat;
                  background-size: 40px 26px;
                  margin-right: 10px;
                }
                &:nth-child(4){
                  background: url('../../../../static/images/bookCase/africa/KR@2x.png') no-repeat;
                  background-size: 40px 26px;
                }
                &:nth-child(5){
                  background: url('../../../../static/images/bookCase/africa/MA@2x.png') no-repeat;
                  background-size: 40px 26px;
                }
              }
            }
          }
        }
      }
      // 大洋洲
      .country-oceania {
        position: relative;
        width: 100%;
        height: 100%;
        .oceania-list {
          width: 100%;
          height: 100%;
          padding-left: 30px;
          .background {
            display: inline-block;
            width: 100%;
            height: 196px;
            background: url('../../../../static/images/bookCase/map/oceaniaBackground.png') no-repeat;
            background-size: 216px 180px;
            background-position-x: 36px;
            background-position-y: 12px;
          }
          .title {
            width: 100%;
            height: 40px;
            font-size: 32px;
            color: #444444;
            position: absolute;
            top: 74px;
          }
          .number {
            margin-bottom: 20px;
            span:nth-child(1){
              width: 60px;
              height: 21px;
              display: inline-block;
              font-size: 15px;
              color: #444444;
              margin-right: 10px;
              line-height: 21px;
            }
            span:nth-child(2){
              width: 76px;
              height: 18px;
              display: inline-block;
              font-size: 15px;
              color: #B5B5B5;
              line-height: 18px;
            }
          }
          .language {
            margin-bottom: 20px;
            span:nth-child(1){
              width: 60px;
              height: 21px;
              display: inline-block;
              font-size: 15px;
              color: #444444;
              margin-right: 10px;
              line-height: 21px;
            }
            span:nth-child(2){
              width: 76px;
              height: 18px;
              display: inline-block;
              font-size: 15px;
              color: #B5B5B5;
              line-height: 18px;
            }
          }
          .main-countries {
            span{
              width: 60px;
              height: 21px;
              display: inline-block;
              font-size: 15px;
              color: #444444;
              margin-right: 10px;
              line-height: 21px;
            }
            .main-list {
              display: inline-block;
              width: 152px;
              i {
                display: inline-block;
                width: 40px;
                height: 26px;
                box-shadow: 0px 2px 4px 0px #000000;
                margin-bottom: 10px;
                &:nth-child(1){
                  background: url('../../../../static/images/bookCase/oceania/CN@2x.png') no-repeat;
                  background-size: 40px 26px;
                }
                &:nth-child(2){
                  background: url('../../../../static/images/bookCase/oceania/JP@2x.png') no-repeat;
                  background-size: 40px 26px;
                  margin: 0 10px;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
