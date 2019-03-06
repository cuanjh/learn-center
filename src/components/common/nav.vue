<template>
  <ul class="nav">
    <li v-for="item in navList" :key="item.id">
      <router-link :to="item.path">{{item.text}}</router-link>&nbsp;>&nbsp;
    </li>
    <li class="nav-current">
      {{lastNav.text}}
    </li>
  </ul>
</template>

<script>
import Bus from '../../bus'
export default {
  data () {
    return {
      navList: [],
      lastNav: {}
    }
  },
  created () {
    Bus.$on('loadNavData', (data) => {
      this.navList = data.slice(0, data.length - 1)
      this.lastNav = data[data.length - 1]
    })
  }
}
</script>

<style lang="less" scoped>
ul {
  margin-top: 25px;
  width: 100%;
  li {
    display: inline-block;
  }
}
.nav {
  height: 14px;
  line-height: 14px;
  font-weight: bold;
  display: inline-block;
  font-size: 14px;
  color: #8493A5;
  a {
    color: #7E929F;
    &:hover {
      color: #2A9FE4;
    }
  }
  .nav-current {
    display: inline-block;
    color: #2A9FE4;
  }
}
</style>
