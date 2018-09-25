<template>
  <section class='learn-search-head-courseList'>
    <ul>
      <li class='learn-search-head-courseList-hover' v-for="(item, index) in filterCourseList" :key="index">
        <span></span><span @click='routerGo(item)'>{{ item['name']}}</span>
      </li>
    </ul>
  </section>
</template>

<script>
import { mapState } from 'vuex'

import _ from 'lodash'
import simplePinyin from 'simple-pinyin'
import Bus from '../../../bus'

export default {
  props: {
    searchUserCourse: ''
  },
  data () {
    return {
    }
  },
  filters: {
    filterSearch: (item) => {
      if (this.searchUserCourse in [item.name, item.lan_code, item.pinyin]) {
        return item
      } else {
        return null
      }
    }
  },
  created () {
    this.$on('enterSearch', () => {
      if (this.filterCourseList.length === 1) {
        this.routerGo(this.filterCourseList[0])
      }
    })
  },
  computed: {
    ...mapState({
      subscribeCoursesStr: state => state.course.subscribeCoursesStr,
      courseFilterAll: state => state.user.courseFilterAll
    }),
    courseFilterAllTemp () {
      var _courseArr = []
      for (var _index in this.courseFilterAll) {
        var _course = this.courseFilterAll[_index]
        _course.pinyin = _.flattenDeep(
          simplePinyin(_course.name, { pinyinOnly: false })
        ).join('')
        _courseArr.push(_course)
      }
      return _courseArr
    },
    learnCourses () {
      return this.$store.state.course.learnCourses
    },
    filterCourseList () {
      var key = this.searchUserCourse
      let courseList = this.courseFilterAllTemp
      return courseList.filter((item) => {
        return item.name.indexOf(key.toLowerCase()) !== -1 || item.lan_code.indexOf(key.toLowerCase()) !== -1 || item.pinyin.indexOf(key.toLowerCase()) !== -1
      })
    }
  },
  methods: {
    routerGo (item) {
      if (this.subscribeCoursesStr.length === 0) {
        this.$router.push({path: '/app/book-details/' + item['lan_code']})
        this.$emit('hideLangList')
        return
      }
      for (var i = 0; i < this.learnCourses.length; i++) {
        if (this.learnCourses[i]['lan_code'] === item['lan_code']) {
          let courseCode = this.learnCourses[i]['code']
          Bus.$emit('changeCourseCode', courseCode)
          this.$emit('hideLangList')
          return
        }
      }
      this.$router.push({path: '/app/book-details/' + item['lan_code']})
      this.$emit('hideLangList')
    }
  }
}
</script>

<style scoped>
.learn-search-head-courseList {
  position: absolute;
  right: 126px;
  top: 59px;
  z-index: 1000;
}
.learn-search-head-courseList > ul {
  width: 206px;
  background: #ffffff;
  border-radius: 4px;
  /*box-shadow: 0 2px 9px 0 rgba(112, 112, 112, 0.5);*/
}
.learn-search-head-courseList > img {
  width: 16px;
  height: 16px;
  display: block;
  position: absolute;
  top: -9px;
  left: 25px;
}
.learn-search-head-courseList > ul > li {
  height: 40px;
  line-height: 40px;
  width: 206px;
  cursor: pointer;
}
.learn-search-head-courseList > ul > li:last-child {
  height: 43px;
  padding-bottom: 3px;
}
.learn-search-head-courseList > ul > li:first-child {
  height: 50.9px;
  padding-top: 10.9px;
}
.learn-search-head-courseList > ul > li > span {
  display: inline-block;
  font-family: SourceHanSansCN-Normal;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  color: #4a4a4a;
}
.learn-search-head-courseList > ul > li > span:first-child {
  width: 5px;
  height: 40px;
}
.learn-search-head-courseList > ul > li > span:last-child {
  width: 196px;
  display: inline-block;
  padding-left: 5px;
  border-bottom: 0.6px solid #ededed;
  /*float: right;*/
}
.learn-search-head-courseList > ul > li:hover span:first-child {
  cursor: pointer;
  background-color: #3c9bbe;
}
.learn-search-head-courseList > ul > li:last-child span:last-child {
  border-bottom: none;
}
</style>
