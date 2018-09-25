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
import { mapState, mapActions } from 'vuex'

import Bus from '../../../bus'

export default {
  props: {
    searchUserCourse: ''
  },
  data () {
    return {
      filterCourseList: []
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
    })
  },
  watch: {
    searchUserCourse (newVal, oldVal) {
      if (newVal) {
        this.shelfSearch({key_word: newVal}).then((res) => {
          if (res.data.courses.length > 0) {
            this.filterCourseList = res.data.courses
          }
        })
      }
    }
  },
  methods: {
    ...mapActions({
      shelfSearch: 'course/shelfSearch'
    }),
    routerGo (item) {
      let langCode = item['code'].split('_')[0]
      if (this.subscribeCoursesStr.length === 0) {
        this.$router.push({path: '/app/book-details/' + langCode})
        this.$emit('hideLangList')
        return
      }
      if (this.subscribeCoursesStr.indexOf(item['code'])) {
        Bus.$emit('changeCourseCode', item['code'])
        this.$emit('hideLangList')
        return
      }
      this.$router.push({path: '/app/book-details/' + langCode})
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
