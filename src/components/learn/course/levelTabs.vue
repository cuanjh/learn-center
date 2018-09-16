<template>
  <div class='learn-footer-course-nav'>
    <ul>
      <li v-for='(level, index) in levelDetail' :key="index" :style="{'width': levelWidth}">
        <p class='learn-footer-course-nav-blue'
            v-bind:class="{'learn-footer-course-nav-active':curLevel.toLowerCase() === level}"
            v-on:click='selLevel(level)'>{{ $t(level) }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  props: ['levelDetail', 'levelNum', 'curLevel'],
  data () {
    return {
      active: 0
    }
  },
  mounted () {
    console.log(this.levelDetail)
  },
  computed: {
    ...mapState({
      currentChapterCode: state => state.course.currentChapterCode
    }),
    levels () {
      let that = this
      return that.levelDetail.splice(0, parseInt(this.levelNum))
    },
    levelWidth () {
      let width = Math.floor(100 / parseInt(this.levelNum)) + '%'
      return width
    }
  },
  methods: {
    ...mapMutations({
      updateCurLevel: 'course/updateCurLevel',
      updateCurChapterUrl: 'course/updateCurChapterUrl',
      updateCurChapter: 'course/updateCurChapter'
    }),
    selLevel (level) {
      this.updateCurLevel(level)
      // let chapterCode = this.currentChapterCode
      // this.$emit('loadChapterInfo', chapterCode)
    }
  }
}
</script>

<style scoped>
  .learn-footer-course-nav {
    text-align: center;
    width: 100%;
    height: 60px;
    border-radius: 4px;
    background-color: #fff;
  }

  .learn-footer-course-nav > ul {
    list-style: none;
    padding: 0px 0px !important;
    height: 60px;
    display: flex;
  }

  .learn-footer-course-nav > ul > li {
    float: left;
    /* padding: 0 20px; */
  }

  .learn-footer-course-nav > ul > li > p {
    display: inline-block;
    text-align: center;
    height: 60px;
    line-height: 60px;
    font-family: ".AppleSystemUIFont";
    font-size: 16px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    color: #4a4a4a;
    width: 80%;
    cursor: pointer;
  }

  .learn-footer-course-nav > ul > li > span {
    display: inline-block;
    height: 50px;
    line-height: 50px;
    font-size: 80%;
    color: #dcdbdb;
  }

  .learn-footer-course-nav-active {
    color: #0581D1 !important;
    border-bottom: 4px solid #0581D1;
  }

  .learn-footer-course-nav-detail {
    color: #0581D1 !important;
  }
  .learn-footer-course-nav-blue:hover {
    color: #0581D1 !important;
  }
</style>
