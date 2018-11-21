<template>
  <div class='learn-course-nav'>
    <ul>
      <li v-for='(level, index) in levelDetail' :key="index" :style="{'width': levelWidth}">
        <p class='learn-course-nav-blue'
            v-bind:class="{'learn-course-nav-active':curLevel.toLowerCase() === level}"
            v-on:click='selLevel(level)'>{{ $t(level) }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'
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
    selLevel (level) {
      this.$emit('selLevel', level)
    }
  }
}
</script>

<style scoped>
  .learn-course-nav {
    text-align: center;
    width: 900px;
    height: 60px;
    /* border-radius: 4px; */
    background-color: rgb(241,245,248);
    margin-top: -16px;
    margin-left: 285px;
    position: fixed;
    z-index: 99;
  }

  .learn-course-nav > ul {
    list-style: none;
    padding: 0px 0px !important;
    height: 60px;
    display: flex;
  }

  .learn-course-nav > ul > li {
    float: left;
    /* padding: 0 20px; */
  }

  .learn-course-nav > ul > li > p {
    display: inline-block;
    text-align: center;
    height: 60px;
    line-height: 75px;
    font-family: ".AppleSystemUIFont";
    font-size: 14px;
    font-weight:500;
    font-style: normal;
    font-stretch: normal;
    color: #555555;
    width: 70px;
    cursor: pointer;
  }

  .learn-course-nav > ul > li > span {
    display: inline-block;
    height: 50px;
    line-height: 50px;
    font-size: 80%;
    color: #dcdbdb;
  }

  .learn-course-nav-active {
    color: rgb(42,159,228) !important;
    border-bottom: 2px solid rgba(42,159,228,1);
  }

  .learn-course-nav-detail {
    color: rgb(42,159,228) !important;
  }
  .learn-course-nav-blue:hover {
    color: rgb(42,159,228) !important;
  }

  @media screen and (max-width: 1024px) {
    .learn-course-nav {
      width: 750px;
      margin-left: 242px;
    }
  }
</style>
