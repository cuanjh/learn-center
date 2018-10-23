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
            <p class="details">查找，阅读和研究世界上已知的{{toThousands(langMapNum)}}种生活语言。</p>
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
                <span>{{toThousands(996212940)}}</span>
              </li>
              <li class="language">
                <span>拥有语言</span>
                <span>{{toThousands(1060)}}</span>
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
                <span>{{toThousands(741002200)}}</span>
              </li>
              <li class="language">
                <span>拥有语言</span>
                <span>288</span>
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
                <span>{{toThousands(437654678)}}</span>
              </li>
              <li class="language">
                <span>拥有语言</span>
                <span>{{toThousands(2300)}}</span>
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
                <span>{{toThousands(1195667795)}}</span>
              </li>
              <li class="language">
                <span>拥有语言</span>
                <span>{{toThousands(2143)}}</span>
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
                <span>{{toThousands(39803720)}}</span>
              </li>
              <li class="language">
                <span>拥有语言</span>
                <span>{{toThousands(1306)}}</span>
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
    <div class="country-courses">
      <div class="country-container">
        <div class="country-letter">
          <div class="letter">
            <a
              :class="['letter_list', { 'active': activeLetter == item.letter, 'locked': item.lists.length === 0 }]"
              v-for="(item, index) in arr"
              :key="index"
              @click="navScroll(item.letter)">
              {{item.letter}}
            </a>
            <p class="countries">{{getChineseName(tabCountry)}}</p>
          </div>
        </div>
        <div class="country-scroll">
          <div class="country-content">
            <div class="country-list" v-if="arr.length > 0 && item.lists.length > 0" v-for="(item , index) in arr" :key="index">
              <a :id="item.letter" class="letter-gray">{{item.letter}}</a>
              <ul>
                <li v-for="(item , index) in item.lists" :key="index"  @click="nationDetail(item.code, item.flag, item.name, item.pName2)">
                  <div class="country-img">
                    <img :src="item.flag" :onerror="defaultImg" alt="资源图片">
                  </div>
                  <div class="country-title">
                    <p>{{item.name}}</p>
                  </div>
                  <div class="country-icon" @click="nationDetail(item.code, item.flag, item.name, item.pName2)"></div>
                </li>
              </ul>
            </div>
            <!-- <div class="go">
              <div class="go-dog pointer dog"></div>
              <div class="list">
                <div class="go-home">首页</div>
                <div class="go-book">书架</div>
                <div class="go-my">我的</div>
              </div>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import $ from 'jquery'
// import countyies from './countries'
export default {
  data () {
    return {
      A_Z: '', // 生成26个字母
      obj: {},
      letterLists: [], // 字母列表
      activeLetter: 'A',
      tabCountry: 'country',
      isShow: false,
      allAreasInfos: [], // 全部
      arr: [],
      defaultImg: 'this.src="/static/images/bookCase/default_course.png"',
      langMapNum: 0
    }
  },
  mounted () {
    this.langMapNum = localStorage.getItem('langMapNum')
    for (var i = 65; i < 91; i++) {
      this.A_Z += String.fromCharCode(i) + ''
    }
    this.letterLists = this.A_Z.split('')
    this.$nextTick(() => {
      this.getMapInfoByCountry()
    })
  },
  methods: {
    ...mapActions({
      worldLanguageMap: 'course/worldLanguageMap'
    }),
    tabChange (tabCountry) { // 点击显示洲的右边信息
      this.tabCountry = tabCountry
      this.getMapInfoByCountry(tabCountry)
    },
    getChineseName (tabCountry) { // 点击显示对应的洲的中文
      switch (tabCountry) {
        case 'Americas':
          return '美洲'
        case 'Europe':
          return '欧洲'
        case 'Asia':
          return '亚洲'
        case 'Africa':
          return '非洲'
        case 'Pacific':
          return '大洋洲'
        default :
          return '全世界'
      }
    },
    getMapInfoByCountry (tabCountry) {
      this.arr = []
      this.$nextTick(() => {
        this.activeLetter = 'A'
        this.worldLanguageMap().then(res => {
          console.log('res', res)
          res.maps.forEach(items => {
            let pName2 = items.name
            let pCode2 = items.code
            if (tabCountry) {
              this.tabCountry = tabCountry
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
                    this.allAreasInfos.push(obj)
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
                  this.allAreasInfos.push(obj)
                })
              })
            }
          })
          this.letterLists.forEach(letter => {
            let obj = {
              letter: letter,
              lists: []
            }
            for (let i = this.allAreasInfos.length - 1; i >= 0; i--) {
              let item = this.allAreasInfos[i]
              if (!item.flag) {
                continue
              }
              if (item.letter === letter) {
                obj.lists.push(item)
                this.allAreasInfos.splice(i, 1)
              }
            }
            this.arr.push(obj)
          })
          // for (let i = this.arr.length - 1; i >= 0; i--) {
          //   let item = this.arr[i]
          //   if (item.lists.length > 0) {
          //   } else {
          //     this.arr.splice(i, 1)
          //   }
          // }
          console.log('arr', this.arr)
          setTimeout(() => {
            this.scrollContent()
          }, 100)
        })
      })
    },
    // 跳转国家详情的路由传参
    nationDetail (code, flag, name, pName2) {
      let OBJ = {
        'flag': flag,
        'name': name,
        'pName2': pName2
      }
      let jsonStr = JSON.stringify(OBJ)
      localStorage.setItem('nationInfos', jsonStr)
      this.$router.push({ path: `/app/nation-details/${code}` })
    },
    // 处理点击字母
    navScroll (letter) {
      if ($('#' + letter).offset()) {
        this.activeLetter = letter
        let top = $('.country-content').scrollTop() - $('#' + letter).scrollTop() + $('#' + letter).offset().top - 726
        $('.country-content').animate({scrollTop: top}, 300)
      }
    },
    // 处理滚动内容
    scrollContent () {
      $('.country-content').on('scroll', () => {
        let countryLists = $('.country-list')
        let scrollTop = $('.country-content').scrollTop()
        let len = countryLists.length - 1
        for (; len > -1; len--) {
          let that = countryLists.eq(len)
          let letter = that.find('a').attr('id')
          if (scrollTop >= $('.country-content').scrollTop() - $('#' + letter).scrollTop() + $('#' + letter).offset().top - 726) {
            this.activeLetter = letter
            break
          }
        }
      })
    },
    // 数字每三位添加逗号
    toThousands (num) {
      return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
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
  font-size: 16px;
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
          z-index: 99 !important;
          i {
            transform: scale(1.1,1.1);
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
        position: absolute;
        top: -2px;
        left: 254px;
        &:hover {
          z-index: 99 !important;
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
          position: relative;
          top: -71px;
          left: 28%;
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
          z-index: 99 !important;
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
          z-index: 99 !important;
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
          z-index: 99 !important;
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
              line-height: 25px;
            }
            span:nth-child(2){
              width: 76px;
              height: 18px;
              display: inline-block;
              font-size: 15px;
              color: #B5B5B5;
              line-height: 25px;
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
              line-height: 25px;
            }
            span:nth-child(2){
              width: 76px;
              height: 18px;
              display: inline-block;
              font-size: 15px;
              color: #B5B5B5;
              line-height: 25px;
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
                border-radius: 2px;
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
              line-height: 25px;
            }
            span:nth-child(2){
              width: 76px;
              height: 18px;
              display: inline-block;
              font-size: 15px;
              color: #B5B5B5;
              line-height: 25px;
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
              line-height: 25px;
            }
            span:nth-child(2){
              width: 76px;
              height: 18px;
              display: inline-block;
              font-size: 15px;
              color: #B5B5B5;
              line-height: 25px;
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
                border-radius: 4px;
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
              line-height: 25px;
            }
            span:nth-child(2){
              width: 76px;
              height: 18px;
              display: inline-block;
              font-size: 15px;
              color: #B5B5B5;
              line-height: 25px;
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
              line-height: 25px;
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
              line-height: 25px;
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
                border-radius: 4px;
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
              line-height: 25px;
            }
            span:nth-child(2){
              width: 76px;
              height: 18px;
              display: inline-block;
              font-size: 15px;
              color: #B5B5B5;
              line-height: 25px;
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
              line-height: 25px;
            }
            span:nth-child(2){
              width: 76px;
              height: 18px;
              display: inline-block;
              font-size: 15px;
              color: #B5B5B5;
              line-height: 25px;
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
              width: 162px;
              i {
                display: inline-block;
                width: 40px;
                height: 26px;
                box-shadow: 0px 2px 4px 0px #000000;
                margin-bottom: 10px;
                border-radius: 4px;
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
                  margin-right: 10px;
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
              line-height: 25px;
            }
            span:nth-child(2){
              width: 76px;
              height: 18px;
              display: inline-block;
              font-size: 15px;
              color: #B5B5B5;
              line-height: 25px;
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
              line-height: 25px;
            }
            span:nth-child(2){
              width: 76px;
              height: 18px;
              display: inline-block;
              font-size: 15px;
              color: #B5B5B5;
              line-height: 25px;
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
                border-radius: 4px;
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
a {
    text-decoration:none;
  }
  .country-courses {
    width: 1180px;
    margin-top: 20px;
  }
  .course-balk {
    display: block;
    width: 80px;
    height: 30px;
    background: #ffffff;
    text-align: center;
    line-height: 30px;
    border-radius: 6px;
    margin-bottom: 28px;
    margin-top: 20px;
  }
  .bocourseok-balk p {
    display: inline-block;
    background: url(../../../../static/images/homework/balck.png);
    background-size: 100% 100%;
    margin-top: 6px;
    width: 12px;
    height: 18px;
  }
  .course-balk span {
    font-size: 16px;
    color: #999999;
  }
  .country-container {
    width: 1180px;
    background: #ffffff;
    padding: 30px;
  }
  .country-container .country-letter {
    width: 100%;
    height: 65px;
    border-bottom: 1px solid #EBEBEB;
  }
  .country-container .country-letter .letter {
    width: 820px;
    height: 65px;
    display: flex;
    justify-content: space-between;
    margin-left: 20px;
  }
  .country-container .country-letter .letter .letter_list {
    display: inline-block;
    width: 16px;
    height: 35px;
    font-size: 18px;
    color: #2A9FE4;
    text-align: center;
    line-height: 35px;
    &.active {
      display: inline-block;
      width: 26px;
      height: 35px;
      font-size: 16px;
      box-shadow: 0px 2px 4px #000000;
      border-radius: 3px;
      text-align: center;
      line-height: 35px;
      background: #0581D1;
      color: #ffffff;
    }
  }
  .country-container .country-letter .letter .countries {
    width: 54px;
    height: 26px;
    font-size: 18px;
    color: #0581D1;
    position: relative;
    left: 236px;
    top: 10px;
  }
  .country-container .country-scroll {
    width: 1130px;
    overflow: hidden;
    height: 800px;
  }
  .country-container .country-content {
    width: 1180px;
    margin-top: 10px;
    height: 800px;
    overflow-y: auto;
  }
  .country-container .country-content::-webkit-scrollbar {display:none}
  .country-container .country-content .country-list {
    width: 1100px;
    margin-left: 20px;
  }
  .country-container .country-content .country-list .letter-gray {
    display: inline-block;
    width: 100%;
    height: 28px;
    font-size: 16px;
    color: #333333;
  }
  .country-container .country-content .country-list ul {
    width: 1060px;
  }
  .country-container .country-content .country-list ul li{
    position: relative;
    width: 100%;
    padding: 16px 0;
    border-top: 1px solid #EBEBEB;
    cursor: pointer;
  }
  .country-container .country-content .country-list ul li .country-img{
    display: inline-block;
    width: 75px;
    height: 50px;
  }
  .country-container .country-content .country-list ul li .country-img img{
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .country-container .country-content .country-list ul li .country-title {
    display: inline-block;
    font-size: 14px;
    color: #444444;
    line-height: 56px;
    margin-left: 20px;
  }
  .country-container .country-content .country-list ul li .country-icon {
    position: absolute;
    top: 40px;
    right: 0;
    display: inline-block;
    width: 10px;
    height: 18px;
    background: url('../../../../static/images/bookCase/jiantou.png') no-repeat;
    background-size: 10px 18px;
    cursor: pointer;
  }
  .tip-box {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -100%);
    width: 60px;
    height: 60px;
    border-radius: 100%;
    background-color: #009efc;
    font-size: 40px;
    text-align: center;
    line-height: 60px;
  }
  .go {
    position: fixed;
    bottom: 47%;
    right: 20px;
    width: 150px;
    height: 150px;
    .list {
      display: none;
      width: 140px;
      height: 140px;
      font-size: 12px;
      color: #ffffff;
      margin: 0 auto;
      margin-top: 5px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .go-home {
        display: none;
        width: 40px;
        height: 40px;
        background: #2A9FE4;
        border-radius: 50%;
        text-align: center;
        line-height: 40px;
        animation: goHome 2s linear;
      }
      .go-book {
        display: none;
        width: 40px;
        height: 40px;
        background: #2A9FE4;
        border-radius: 50%;
        text-align: center;
        line-height: 40px;
        animation: goBook 2s linear;
      }
      .go-my {
        display: none;
        width: 40px;
        height: 40px;
        background: #2A9FE4;
        border-radius: 50%;
        text-align: center;
        line-height: 40px;
        animation: goMy 2s linear;
      }
    }
  }
  .go .go-dog {
    background: url('../../../../static/images/bookCase/dog.png') no-repeat;
    width: 41px;
    height: 46px;
    background-size: 80px auto;
    position: absolute;
    bottom: 35%;
    left: 0;
    z-index: 2;
    animation: dog steps(1,end) 2s infinite
  }
  @-webkit-keyframes dog {
    50%{
      background-position:-41px 0
    }
  }
  @-webkit-keyframes goHome {
    0%{
      transform: translate(0px, 0px) rotate(0deg);
      opacity: 0;
    }
    50%{
      transform: translate(60px, 0px) rotate(360deg);
      opacity: 1;
    }
    100%{
      transform: translateX(60px)
    }
  }
  @-webkit-keyframes goBook {
    0%{
      transform: translate(0px, 0px) rotate(0deg);
      opacity: 0;
    }
    50%{
      transform: translate(80px, 0px) rotate(360deg);
      opacity: 1;
    }
    100%{
      transform: translateX(80px)
    }
  }
  @-webkit-keyframes goMy {
    0%{
      transform: translate(0px, 0px) rotate(0deg);
      opacity: 0;
    }
    50%{
      transform: translate(60px, 0px) rotate(360deg);
      opacity: 1;
    }
    100%{
      transform: translateX(60px)
    }
  }

  .locked {
    -webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    -ms-filter: grayscale(100%);
    -o-filter: grayscale(100%);
    filter: grayscale(100%);
    -webkit-filter: gray;
    filter: gray;
  }
</style>
