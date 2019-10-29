<template>
  <div v-show="type === 'UploadType_text'">
    <textarea id="textarea"
              autocomplete="off"
              v-model="content"
              placeholder="说点什么吧~~">
    </textarea>
    <div class="publish" @click="publish()">
      <span>发布</span>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  props: ['type'],
  data () {
    return {
      content: ''
    }
  },
  mounted () {
  },
  computed: {
    ...mapState({
      dynamicsLists: state => state.course.dynamicsLists // 动态首页列表和打赏列表数据
    })
  },
  methods: {
    ...mapActions({
      getDynamic: 'course/getDynamic', // 发布动态接口
      getCommunity: 'course/getCommunity' // 动态首页
    }),
    // 点击发布
    publish () {
      this.getDynamic({content: this.content}).then(res => {
        console.log('发布动态返回数据', res)
        this.dynamicsLists.unshift(res.feedInfo)
      })
    }
  }
}
</script>
<style lang="less" scoped>
#textarea {
  padding: 0 3px;
  width: 100%;
  height: 64px;
  background:rgba(246,248,249,1);
  border-radius:3px;
  border:1px solid rgba(216,227,233,1);
}
.publish{
  cursor: pointer;
  position: absolute;
  bottom: 6px;
  right: 0;
  margin-top: 7px;
  display: inline-block;
  span {
    font-size:14px;
    font-family:PingFangSC-Semibold;
    font-weight:600;
    color:rgba(255,255,255,1);
    padding: 6px 31px;
    background-color: #7ED321;
    border-radius: 18px;
  }
}
</style>
