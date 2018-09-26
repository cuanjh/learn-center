<template>
  <div class="country-courses">
    <div class="country-container">
      <div class="country-letter">
        <div class="letter">
          <a :href="`#mubiao`+index" rel="nofollow" target="_self" class="letter_list" v-bind:class="{bg:index===isActive}" v-for="(item, index) in letterLists" :key="index" @click="navScroll(item, index)">{{item}}</a>
          <p class="countries">{{getChineseName(tabCountry)}}</p>
        </div>
      </div>
      <div class="country-content">
        <div class="country-list" v-for="(item , index) in countryList" :key="index">
          <span :id="`mubiao`+index" class="letter-gray">{{item.letter}}</span>
          <ul>
            <li @click="nationDetail(item.code, item.flag, item.name, item.pName2)" v-for="(item , index) in item.lists" :key="index">
              <div class="country-img">
                <img :src="item.flag" alt="资源图片">
              </div>
              <div class="country-title">
                <p>{{item.name}}</p>
              </div>
              <div class="country-icon"></div>
            </li>
          </ul>
        </div>
      </div>
      <div :class="['tip-box']" v-show="tipAppear">{{tipTxt}}</div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['allAreasInfo', 'tabCountry'],
  data () {
    return {
      isActive: 0,
      tipAppear: false, // 弹框
      tipTxt: '', // 弹框的文字
      A_Z: '', // 生成26个字母
      letterLists: [] // 字母列表
    }
  },
  mounted () {
    for (var i = 65; i < 91; i++) {
      this.A_Z += String.fromCharCode(i) + ''
    }
    this.letterLists = this.A_Z.split('')
  },
  computed: {
    countryList () {
      let arr = []
      this.letterLists.forEach(letter => {
        let obj = {
          letter: letter,
          lists: []
        }
        for (let i = this.allAreasInfo.length - 1; i >= 0; i--) {
          let item = this.allAreasInfo[i]
          if (item.letter === letter) {
            obj.lists.push(item)
          }
        }
        arr.push(obj)
      })
      for (let i = arr.length - 1; i >= 0; i--) {
        let item = arr[i]
        if (item.lists.length > 0) {
        } else {
          arr.splice(i, 1)
        }
      }
      console.log('arr', arr)
      return arr
    }
  },
  methods: {
    nationDetail (code, flag, name, pName2) {
      let OBJ = {
        'flag': flag,
        'name': name,
        'pName2': pName2
      }
      let jsonStr = JSON.stringify(OBJ)
      localStorage.setItem('nationInfo', jsonStr)
      this.$router.push({ path: `/app/nation-details/${code}` })
    },
    navScroll (id, index) {
      this.tipTxt = id
      this.tipAppear = true
      setTimeout(() => {
        this.tipAppear = false
      }, 1000)
      this.isActive = index
    },
    getChineseName (tabCountry) {
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
    }
  }
}
</script>
<style lang="less" scoped>
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
    &.bg {
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
  .country-container .country-content {
    width: 100%;
    margin-top: 10px;
    height: 2000px;
    overflow-y: scroll;
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
    width: 100%;
  }
  .country-container .country-content .country-list ul li{
    position: relative;
    width: 100%;
    padding: 16px 0;
    border-top: 1px solid #EBEBEB;
  }
  .country-container .country-content .country-list ul li .country-img{
    display: inline-block;
    width: 56px;
    height: 56px;
  }
  .country-container .country-content .country-list ul li .country-img img{
    width: 100%;
    height: 100%;
  }
  .country-container .country-content .country-list ul li .country-title {
    display: inline-block;
    font-size: 14px;
    color: #444444;
    line-height: 56px;
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
</style>
