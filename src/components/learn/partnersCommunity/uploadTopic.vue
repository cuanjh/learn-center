<template>
  <div v-show="type === 'UploadType_topic'">
    <textarea id="textarea"
              autocomplete="off"
              v-model="content"
              placeholder="说点什么吧~~">
    </textarea>
    <div class="topic-container" v-show="showTopicLists">
      <div class="topic-content">
        <div class="wrap-arrow">
          <i></i>
        </div>
        <div class="topic-item">
          <!-- <div class="input"> -->
            <input  type="text"
                    :placeholder="holder"
                    @keyup.13="search()"
                    @blur.prevent="blurFn()"
                    v-model.lazy="keyWord">
            <i class="search" @click="search()"></i>
          <!-- </div> -->
          <div class="inner">
            <div class="innerbox">
              <div class="lists" v-for="(item, index) in topics" :key="index" @click="topicItem(item)">
                <p class="img">
                  <img :src="item.cover_url" alt="话题图片">
                </p>
                <p class="text">
                  <span>#{{item.topic_title}}#</span>
                  <span>{{item.pub_num}} 人参与</span>
                </p>
              </div>
              <div class="lists" v-show="topics.length===0">
                <span>没有找到相关话题~~~</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="publish" @click="publish()">
      <span>发布</span>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  props: ['type', 'showTopicLists'],
  data () {
    return {
      topics: [],
      holder: '#输入要找的话题#',
      page: 1,
      keyWord: '',
      content: '',
      topicKey: '',
      topicTitle: ''
    }
  },
  mounted () {
    this.getTopicsLists({page: this.page}).then((res) => {
      this.topics = res.topicList.topics
      console.log('动态话题列表', this.topics)
    })
  },
  computed: {
    ...mapState({
      dynamicsLists: state => state.course.dynamicsLists // 动态首页列表和打赏列表数据
    })
  },
  methods: {
    ...mapActions({
      getTopicsLists: 'course/getTopicsLists', // 动态话题列表
      getDynamic: 'course/getDynamic' // 发布动态接口
    }),
    // 点击话题
    topicItem (topic) {
      console.log('topic', topic)
      this.content = '#' + topic.topic_title + '#'
      this.topicKey = topic.topic_key
      this.topicTitle = topic.topic_title
      this.$emit('topcItemHidden', false)
    },
    // 搜索话题
    search () {
      if (!this.keyWord) {
        alert('请输入关键字')
        return false
      }
      this.getTopicsLists({page: this.page, key_word: this.keyWord}).then((data) => {
        this.topics = data.topicList.topics
        console.log('搜索动态话题列表', this.topics)
      })
    },
    // 失去焦点
    blurFn () {
      if (this.keyWord !== '') {
        this.keyWord = ''
      }
    },
    // 点击发布
    publish () {
      let contents = this.content.split('#')
      let contentText = contents[contents.length - 1]
      let params = {
        topic_key: this.topicKey,
        topic_title: this.topicTitle,
        content: contentText
      }
      console.log('params', params)
      this.getDynamic(params).then(res => {
        console.log('发布动态返回数据', res)
        this.dynamicsLists.unshift(res.feedInfo)
        this.content = ''
      })
    }
  },
  watch: {
    content () {
      if (this.content === '') {
        this.$emit('topcItemHidden', true)
      }
    }
  }
}
</script>
<style lang="less" scoped>
#textarea {
  margin-top: 10px;
  padding: 0 3px;
  width: 100%;
  height: 64px;
  background:rgba(246,248,249,1);
  border-radius:3px;
  border:1px dashed rgba(216,227,233,1);
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
.topic-container {
  z-index: 9;
  position: absolute;
  top: 270px;
  left: 38%;
  width: 400px;
  height: 380px;
  background: #ffffff;
  box-shadow: 0px 4px 12px 0px rgba(60,91,111,0.3);
  border-radius: 5px;
  .topic-content {
    position: relative;
    width: 100%;
    height: 100%;
    .wrap-arrow {
      position: absolute;
      top: -12px;
      left: 50%;
      margin-left: -11px;
      width: 22px;
      height: 22px;
      i {
        display: inline-block;
        width: 22px;
        height: 22px;
        background: url('../../../../static/images/course/learn-big-arrow.png') no-repeat center;
        background-size: 100%;
      }
    }
    .topic-item {
      width: 100%;
      height: 100%;
      padding: 35px 30px 30px;
      overflow: hidden;
      input {
        width: 100%;
        height: 40px;
      }
      .search {
        cursor: pointer;
        position: absolute;
        top: 48px;
        right: 48px;
        display: inline-block;
        width: 16px;
        height: 16px;
        background: url('../../../../static/images/community/search.svg') no-repeat center;
        background-size: cover;
      }
      .inner{
        width: 100%;
        height: 100%;
        border-top: 1px solid #E6EBEE;
        overflow:hidden;
        padding: 20px 0 30px;
        .innerbox{
          overflow-x: hidden;
          overflow-y: auto;
          color: #000;
          font-size: .7rem;
          font-family: "\5FAE\8F6F\96C5\9ED1",Helvetica,"黑体",Arial,Tahoma;
          height: 100%;
          .lists {
            cursor: pointer;
            display: flex;
            align-items: center;
            .img {
              width: 40px;
              height: 40px;
              img {
                width: 100%;
                height: 100%;
                border-radius:3px;
              }
            }
            .text {
              display: flex;
              flex-direction: column;
              font-size:14px;
              font-family:PingFang-SC-Bold;
              font-weight:bold;
              color:rgba(51,51,51,1);
              padding: 10px 0 10px 8px;
              span:nth-child(2) {
                font-size:12px;
                font-family:PingFang-SC-Medium;
                font-weight:500;
                color:rgba(153,153,153,1);
                padding-top: 4px;
              }
            }
          }
        }
      }
    }
  }
}

/*滚动条样式*/
.innerbox::-webkit-scrollbar {/*滚动条整体样式*/
  width: 8px;     /*高宽分别对应横竖滚动条的尺寸*/
  height: 4px;
}
.innerbox::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px #EEF2F3;
  background: #EEF2F3;
}
.innerbox::-webkit-scrollbar-track {/*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(255,255,255,1);
  border-radius: 0;
  background: rgba(255,255,255,1);
}
</style>
