<template>
  <div class="search-box" @mouseleave="isShowEndangerPanel = false">
    <div class="search">
      <div class="search-inner-desc" v-show="!isShowSearch">
        <ul>
          <li @mouseenter="isShowEndangerPanel = true">
            <span class="endangered-languages">
              <i></i>濒危语种
            </span>
            <i :class="['arrow', {'active': isShowEndangerPanel}]"></i>
          </li>
          <li><span class="wal-courses" @click="loadCourses()"><i></i>课程</span></li>
          <li><span class="wal-partners" @click="loadRecommendTeachers()"><i></i>电台主播</span></li>
        </ul>
        <!-- <span @click="removeMarks()"><i></i>remove</span> -->
        <span class="search-icon" @click="isShowSearch = true"><i></i></span>
      </div>
      <transition name="search">
        <div class="search-inner" v-show="isShowSearch">
          <i @click="search()"></i>
          <input type="text" @keyup.enter="search()" v-model="searchKey" placeholder="搜索官方课程或濒危语种">
          <i @click="cancelSearch()"></i>
        </div>
      </transition>
      <transition name="show">
        <div class="endangered-panel" v-show="isShowEndangerPanel">
          <ul>
            <li @mouseenter="activeEndanger = item.val" :class="{'active': item.val == activeEndanger}"
              @click="selectEndanger(item)" v-for="item in endangeredLevelList"
              :key="item.id">
              <i :class="item.iconClass"></i>{{ item.text }}
            </li>
          </ul>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Bus from '../../../bus'
export default {
  data () {
    return {
      searchKey: '',
      isShowSearch: false,
      endangeredLevelList: [
        {id: 1, iconClass: 'vulnerableIcon', text: '不安全型', val: 'Vulnerable'},
        {id: 2, iconClass: 'definitelyIcon', text: '肯定濒危型', val: 'Definitely endangered'},
        {id: 3, iconClass: 'severelyIcon', text: '严重濒危型', val: 'Severely endangered'},
        {id: 4, iconClass: 'criticallyIcon', text: '极度濒危型', val: 'Critically endangered'},
        {id: 5, iconClass: 'extinct', text: '已经消失型', val: 'Extinct'}
      ],
      isShowEndangerPanel: false,
      activeEndanger: ''
    }
  },
  mounted () {
    // 加载官方课程
    this.getLangsList()
    // 加载推荐的主播
    this.getRecommendTeachers()
  },
  computed: {
    ...mapState({
      courseLangsList: state => state.courseLangsList
    })
  },
  methods: {
    ...mapActions([
      'getLangsList',
      'getEndangeredMap',
      'getRecommendTeachers'
    ]),
    // 点击电台主播
    loadRecommendTeachers () {
      this.isShowEndangerPanel = false
      this.$parent.$refs.map.$emit('loadRecommendTeachers')
    },
    loadCourses () {
      this.isShowEndangerPanel = false
      this.$parent.$refs.map.$emit('loadCourseLangs', this.courseLangsList)
    },
    cancelSearch () {
      this.searchKey = ''
      this.isShowSearch = false
    },
    search () {
      let key = this.searchKey
      Bus.$emit('mapSearch', key)
    },
    selectEndanger (item) {
      this.activeEndanger = item.val
      this.getEndangeredMap({degree: this.activeEndanger}).then(res => {
        if (res.success) {
          this.$parent.$refs.map.$emit('loadEndangerMap', res.data)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .search-box {
    position: relative;
    z-index: 99;
  }
  .search {
    position: absolute;
    width: 700px;
    height: 50px;
    border-radius: 31px;
    background: rgba(5,129,209,.8);
    // top:0;
    left: 0;
    right: 0;
    bottom: 70px;
    margin: 0 auto;
  }

  .search-inner-desc {
    width: 100%;
    line-height: 50px;
    position: absolute;
  }

  .search-inner-desc ul {
    display: inline-flex;
    width: 652px;
  }

  .search-inner-desc ul li{
    display: inline-block;
    width: 216px;
    text-align: center;
    color: #fff;
    font-weight: bold;
    font-size: 14px;
  }

  .search-inner-desc span {
    cursor: pointer;
  }

  .search-inner-desc .endangered-languages i {
    width: 20px;
    height: 20px;
    background-image: url('../../../../static/images/learnIndex/wal-endangered-languages.svg');
    background-repeat: no-repeat;
    background-size: cover;
    display: inline-block;
    margin: 14px 8px;
  }

 .search-inner-desc .arrow {
    width: 9px;
    height: 5px;
    background-image: url('../../../../static/images/learnIndex/arrow-down.svg');
    background-repeat: no-repeat;
    background-size: cover;
    display: inline-block;
    margin: 22px 8px;
  }

  .search-inner-desc .active {
    background-image: url('../../../../static/images/learnIndex/arrow-up.svg');
  }

  .search-inner-desc .wal-courses i {
    width: 20px;
    height: 20px;
    background-image: url('../../../../static/images/learnIndex/wal-courses.svg');
    background-repeat: no-repeat;
    background-size: cover;
    display: inline-block;
    margin: 14px 8px;
  }

  .search-inner-desc .wal-partners i {
    width: 20px;
    height: 20px;
    background-image: url('../../../../static/images/learnIndex/wal-partners.svg');
    background-repeat: no-repeat;
    background-size: cover;
    display: inline-block;
    margin: 14px 8px;
  }

  .search-inner-desc .search-icon {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: #fff;
    margin-top: 7px;
    float: right;
    margin-right: 7px;
  }

  .search-inner-desc .search-icon i {
    width: 14px;
    height: 14px;
    background-image: url('../../../../static/images/learnIndex/wal-search.svg');
    background-repeat: no-repeat;
    background-size: cover;
    display: inline-block;
    margin-left: 11px;
    margin-top: 11px;
  }

  .search-inner {
    width:685px;
    height:36px;
    background:rgba(248,250,251,1);
    border-radius:22px;
    margin: 7px 8px;
    text-align: center;
    position: absolute;
  }

  .search-inner > i:first-child {
    width: 14px;
    height: 14px;
    background-image: url('../../../../static/images/learnIndex/wal-search.svg');
    background-repeat: no-repeat;
    background-size: cover;
    display: inline-block;
    margin-top: 12px;
    margin-right: 4px;
    cursor: pointer;
  }

  .search-inner > i:last-child {
    width: 11px;
    height: 11px;
    background-image: url('../../../../static/images/bookCase/cancel.svg');
    background-repeat: no-repeat;
    background-size: cover;
    display: inline-block;
    margin-top: 11px;
    cursor: pointer;
  }

  .search-inner > input {
    height: 36px;
    width: 618px;
    margin:0 auto;
  }

  .search-inner > input::placeholder {
    color: #B8B8B8;
    font-size: 14px;
    font-weight: 500px;
  }

  .endangered-panel {
    position: absolute;
    width: 160px;
    height: 192px;
    background-color: #fff;
    border-radius: 0px 3px 3px 0;
    border: 1px solid #9fc9ed;
    margin-top: 50px;
    margin-left: 24px;
    padding-top: 3px;
    ul {
      li {
        padding: 6px 18px;
        margin-top: 4px;
        color: #103044;
        font-size: 14px;
        font-weight: 500;
        border-left: 3px solid rgba(255, 255, 255, 0);
        cursor: pointer;
      }
    }
    .active {
      border-left: 3px solid #2A9FE4;
      background-color: #EEF2F3;
    }
  }

  .vulnerableIcon {
    width: 9px;
    height: 16px;
    background-image: url('../../../../static/images/learnIndex/map/map-vulnerable.svg');
    background-repeat: no-repeat;
    background-size: cover;
    display: inline-block;
    margin-top: 1px;
    margin-right: 10px;
  }

  .definitelyIcon {
    width: 9px;
    height: 16px;
    background-image: url('../../../../static/images/learnIndex/map/map-definitely-endangered.svg');
    background-repeat: no-repeat;
    background-size: cover;
    display: inline-block;
    margin-top: 1px;
    margin-right: 10px;
  }

  .severelyIcon {
    width: 9px;
    height: 16px;
    background-image: url('../../../../static/images/learnIndex/map/map-severely-endangered.svg');
    background-repeat: no-repeat;
    background-size: cover;
    display: inline-block;
    margin-top: 1px;
    margin-right: 10px;
  }

  .criticallyIcon {
    width: 9px;
    height: 16px;
    background-image: url('../../../../static/images/learnIndex/map/map-critically-endangered.svg');
    background-repeat: no-repeat;
    background-size: cover;
    display: inline-block;
    margin-top: 1px;
    margin-right: 10px;
  }

  .extinct {
    width: 9px;
    height: 16px;
    background-image: url('../../../../static/images/learnIndex/map/map-extinct.svg');
    background-repeat: no-repeat;
    background-size: cover;
    display: inline-block;
    margin-top: 1px;
    margin-right: 10px;
  }

  @keyframes show {
    0% {
      opacity: 0;
      height: 0;
    }
    100% {
      opacity: 1;
      height: 192px;
    }
  }
  @keyframes hide {
    0% {
      opacity: 1;
      height: 192px;
    }
    100% {
      opacity: 0;
      height: 0;
    }
  }
  .show-enter-active {
    animation: show .5s;
  }
  .show-leave-active {
    animation: hide .5s;
  }
  .show-enter, .show-leave-to {
    opacity: 0;
  }

  @keyframes searchShow {
    0% {
      opacity: 0;
      right: -100px;
    }
    100% {
      opacity: 1;
      right: 0;
    }
  }
  @keyframes searchHide {
    0% {
      opacity: 1;
      right: 0;
    }
    100% {
      opacity: 0;
      right: -100px;
    }
  }
  .search-enter-active {
    animation: searchShow .5s;
  }
  .search-leave-active {
    animation: searchHide .5s;
  }
  .search-enter, .search-leave-to {
    opacity: 0;
  }
</style>
