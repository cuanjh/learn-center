<template>
  <div class="hot-courses">
    <div class="nav">
      <div class="nav-circle"></div>
      <router-link :to="{path: '/app/book-case'}">
        <span>书架</span>
      </router-link>
      /
      <div class="nav-current">
        热门课程
      </div>
    </div>
    <div class="hot-container">
      <div class="hot-letter">
        <div class="letter">
          <a
            @click="scrollPosition(item)"
            :class="['letter_list', { 'active': activeLetter == item.letter, 'locked': item.list.length === 0 }]"
            v-for="(item , index) in groupCourseLangs"
            :key="index">
            {{item.letter}}
          </a>
        </div>
      </div>
      <div class="hot-scroll">
        <div class="hot-content">
          <div class="hot-list">
            <div class="section" v-if="group.list.length > 0" v-for="group in groupCourseLangs" :key="group.letter">
              <a :id="group.letter" class="letter-gray">{{ group.letter }}</a>
              <ul>
                <li v-for="item in group.list" :key="item.lan_code" @click="routerGo(item)">
                  <div class="hot-img">
                    <img :src="item.flag | urlFix('imageView2/0/w/200/h/200/format/jpg')" alt="资源图片">
                  </div>
                  <div class="hot-title">
                    <p>{{ item.name[languagueHander]}}</p>
                  </div>
                  <div class="hot-icon" @click="routerGo(item)"></div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import simplePinyin from 'simple-pinyin'
import _ from 'lodash'
import $ from 'jquery'

import Bus from '../../../bus'

export default {
  data () {
    return {
      letterList: ['热门', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
      hotLangs: [],
      courseLangs: [],
      groupCourseLangs: [],
      activeLetter: '热门'
    }
  },
  mounted () {
    let _this = this
    // 获取官方课程信息
    _this.getCourseLangs().then((res) => {
      console.log('res', res)
      _this.hotLangs = res.hot_langs
      _this.groupCourseLangs.push({
        letter: '热门',
        list: _this.hotLangs
      })

      res.course_langs.forEach((item) => {
        let obj = item
        let name = item.name[_this.languagueHander]
        let pinyin = _.flattenDeep(simplePinyin(name, { pinyinOnly: false })).join('')
        obj['pinyin'] = pinyin
        obj['letter'] = pinyin.slice(0, 1).toUpperCase()
        _this.courseLangs.push(obj)
      })
      console.log(_this.courseLangs)
      console.log(_this.courseLangs.sort(_this.compareUp('pinyin')))
      let sortCourseLangs = _this.courseLangs.sort(_this.compareUp('pinyin'))
      let letterArr = _this.getUpperLetters()
      letterArr.forEach((letter) => {
        let obj = {}
        obj['letter'] = letter
        obj['list'] = sortCourseLangs.filter((courseLang) => {
          return letter === courseLang.letter
        })
        _this.groupCourseLangs.push(obj)
      })
      console.log(_this.groupCourseLangs)
      setTimeout(() => {
        this.scrollEvent()
      }, 100)
    })
  },
  computed: {
    ...mapState({
      languagueHander: state => state.course.languagueHander,
      subscribeCoursesStr: state => state.course.subscribeCoursesStr
    })
  },
  methods: {
    ...mapActions({
      getCourseLangs: 'course/getCourseLangs'
    }),
    compareUp (propertyName) {
      // 升序排序
      return (object1, object2) => {
        var value1 = object1[propertyName]
        var value2 = object2[propertyName]
        return value1.localeCompare(value2)
      }
    },
    getUpperLetters () {
      var arr = []
      for (let i = 65; i < 91; i++) {
        arr.push(String.fromCharCode(i))
      }
      return arr
    },
    scrollPosition (letter) {
      if ($('#' + letter).offset()) {
        this.activeLetter = letter
        let top = $('.hot-content').scrollTop() - $('#' + letter).scrollTop() + $('#' + letter).offset().top - 265
        $('.hot-content').animate({scrollTop: top}, 300)
      }
    },
    scrollEvent () {
      let sections = $('.section')
      $('.hot-content').on('scroll', () => {
        let scrollTop = $('.hot-content').scrollTop()
        let len = sections.length - 1
        for (; len > -1; len--) {
          let that = sections.eq(len)
          let letter = that.find('a').attr('id')
          if (scrollTop >= $('.hot-content').scrollTop() - $('#' + letter).scrollTop() + $('#' + letter).offset().top - 265) {
            this.activeLetter = letter
            break
          }
        }
      })
    },
    routerGo (item) {
      let langCode = item['lan_code']
      if (this.subscribeCoursesStr.length === 0) {
        this.$router.push({path: '/app/book-details/' + langCode})
        return
      }
      let courseCode = item['lan_code'] + '-Basic'
      if (this.subscribeCoursesStr.indexOf(courseCode) > -1) {
        Bus.$emit('changeCourseCode', courseCode)
        return
      }
      this.$router.push({path: '/app/book-details/' + langCode})
    }
  }
}
</script>
<style scoped>
  a {
    text-decoration:none;
  }

  .hot-courses {
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

  .bocourseok-balk p {
    display: inline-block;
    background: url(../../../../static/images/homework/balck.png);
    background-size: 100% 100%;
    margin-top: 6px;
    width: 12px;
    height: 18px;
  }

  .hot-container {
    width: 1200px;
    min-height: 800px;
    background: #ffffff;
    padding: 30px 0 30px 30px;
  }
  .hot-container .hot-letter {
    width: 100%;
    height: 65px;
    border-bottom: 1px solid #EBEBEB;
  }
  .hot-container .hot-letter .letter {
    width: 880px;
    height: 65px;
    display: flex;
    justify-content: space-between;
    margin-left: 20px;
  }
  .active {
    height: 35px;
    background: #0581D1;
    color: #ffffff !important;
    box-shadow: 0px 2px 4px #000000;
    border-radius: 3px;
  }
  .hot-container .hot-letter .letter .letter_list {
    display: inline-block;
    padding: 0 8px;
    font-size: 16px;
    color: #2A9FE4;
    font-weight: bold;
    text-align: center;
    height: 35px;
    line-height: 35px;
  }
  .hot-container .hot-scroll {
    width: 1150px;
    height: 800px;
    overflow: hidden;
  }
  .hot-container .hot-content {
    width: 1200px;
    padding-top: 10px;
    overflow-y: auto;
    height: 800px;
  }

  .hot-content::-webkit-scrollbar {
    display: none;
  }
  .hot-content {
    -ms-overflow-style: none;
    overflow: -moz-scrollbars-none;
  }
  .hot-content::-webkit-scrollbar{width: 0px}
  .hot-container .hot-content .hot-list {
    width: 1100px;
    margin-left: 20px;
  }
  .hot-container .hot-content .hot-list .letter-gray {
    display: inline-block;
    width: 100%;
    height: 28px;
    font-size: 16px;
    color: #333333;
  }
  .hot-container .hot-content .hot-list ul {
    width: 100%;
  }
  .hot-container .hot-content .hot-list ul li{
    position: relative;
    width: 100%;
    padding: 16px 0;
    border-top: 1px solid #EBEBEB;
    cursor: pointer;
  }
  .hot-container .hot-content .hot-list ul li .hot-img{
    display: inline-block;
    width: 56px;
    height: 56px;
  }
  .hot-container .hot-content .hot-list ul li .hot-img img{
    width: 100%;
    height: 100%;
    border-radius: 4px;
  }
  .hot-container .hot-content .hot-list ul li .hot-title {
    display: inline-block;
    font-size: 14px;
    color: #444444;
    line-height: 56px;
    margin-left: 30px;
  }
  .hot-container .hot-content .hot-list ul li .hot-icon {
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
