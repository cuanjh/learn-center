<template>
  <div class="module-user-guide">
    <welcome></welcome>
    <guide-video ref="video" />
    <example-before />
    <guide-listen :type-list="typeList" :list="list" :cur="cur" :sound="sound[0]" ref="listen"></guide-listen>
    <guide-speak :type-list="typeList" :list="list" :cur="cur" :sound="sound[1]" ref="speak"></guide-speak>
    <guide-read :type-list="typeList" :list="list" :cur="cur" :sound="sound[2]" ref="read"></guide-read>
    <guide-write :type-list="typeList" :list="list" :cur="cur" :sound="sound[3]" ref="write"></guide-write>
    <guide-final></guide-final>
  </div>
</template>

<script>
import _ from 'lodash'
import Loader from '../../../plugins/loader'

import Welcome from './welcome.vue'
import GuideVideo from './guideVideo.vue'
import ExampleBefore from './exampleBefore.vue'
import GuideListen from './guideListen.vue'
import GuideSpeak from './guideSpeak.vue'
import GuideRead from './guideRead.vue'
import GuideWrite from './guideWrite.vue'
import GuideFinal from './guideFinal.vue'

// let language = Config.language == "chinese"?"zh":"en";
let language = 'zh'
let resource = {
  listen: [
    {
      'form_show_type': 'sentenceToImg',
      'sound': 'course/sounds/ENG/Basic/Level1/Unit1/Chapter1/A0/4-1.mp3',
      'sentence': 'a cat',
      'image': 'course/images/common/Basic/Level1/Unit1/Chapter1/A0/4-1.webp'
    },
    {
      'form_show_type': 'sentenceToImg',
      'sound': 'course/sounds/ENG/Basic/Level1/Unit1/Chapter1/A0/4-2.mp3',
      'sentence': 'a dog',
      'image': 'course/images/common/Basic/Level1/Unit1/Chapter1/A0/4-2.webp'
    }
  ],
  speak: [
    {
      'form_show_type': 'repeatSpeak',
      'sound': 'course/sounds/ENG/Basic/Level1/Unit1/Chapter1/A5/9-1.mp3',
      'sentence': 'Good bye.',
      'image': 'course/images/common/Basic/Level1/Unit1/Chapter1/A5/9-1.webp'
    },
    {
      'form_show_type': 'repeatSpeak',
      'sound': 'course/sounds/ENG/Basic/Level1/Unit1/Chapter1/A5/9-2.mp3',
      'sentence': 'Good bye.',
      'image': 'course/images/common/Basic/Level1/Unit1/Chapter1/A5/9-2.webp'
    }
  ],
  read: [
    {
      'form_show_type': 'fillGap',
      'sound': 'course/sounds/ENG/Basic/Level1/Unit1/Chapter1/A4/6-1.mp3',
      'sentence_show': 'They are boys.',
      'options': ['are', 'is'],
      'image': 'course/images/common/Basic/Level1/Unit1/Chapter1/A4/6-1.webp'
    },
    {
      'form_show_type': 'fillGap',
      'sound': 'course/sounds/ENG/Basic/Level1/Unit1/Chapter1/A4/6-2.mp3',
      'sentence_show': 'They are girls.',
      'options': ['girls', 'girl'],
      'image': 'course/images/common/Basic/Level1/Unit1/Chapter1/A4/6-2.webp'
    }
  ],
  write: [
    {
      'form_show_type': 'autoSpeak',
      'sound': 'course/sounds/ENG/Basic/Level1/Unit1/Chapter2/A4/11-1.mp3',
      'sentence': 'Good bye.',
      'image': 'course/images/common/Basic/Level1/Unit1/Chapter2/A4/11-1.webp'
    },
    {
      'form_show_type': 'writeWords',
      'sound': 'course/sounds/ENG/Basic/Level1/Unit1/Chapter2/A4/11-2.mp3',
      'sentence': 'Good bye.',
      'image': 'course/images/common/Basic/Level1/Unit1/Chapter2/A4/11-2.webp'
    }
  ]
}

let soundArray = [
  {
    url: `https://course-assets1.talkmate.com/new_guide/${language}/listen.mp3`
  },
  {
    url: `https://course-assets1.talkmate.com/new_guide/${language}/speak.mp3`
  },
  {
    url: `https://course-assets1.talkmate.com/new_guide/${language}/look.mp3`
  },
  {
    url: `https://course-assets1.talkmate.com/new_guide/${language}/write.mp3`
  }
]

let guideResource = (key) => {
  let res = []
  _.each(resource[key], (form, idx) => {
    form.form_id = idx + 1
    res.push([
      {
        url: form.image,
        idx: idx,
        type: 'image'
      },
      {
        url: form.sound,
        idx: idx,
        type: 'sound'
      }
    ])
  })
  return _.flattenDeep(res)
}

function preLoad (_this) {
  let key = _this.componentList[_this.idx + 1]
  if (key) {
    _this.promise = Loader(guideResource(key))
  } else {
    _this.promise = END
  }
}

const END = -1

export default {
  data () {
    return {
      promise: {},
      list: [],
      typeList: [],
      cur: -1, // 当前的子组件
      componentList: ['listen', 'speak', 'read', 'write'],
      idx: 0,
      sound: [],
      start: false
    }
  },
  components: {
    Welcome,
    GuideVideo,
    ExampleBefore,
    GuideListen,
    GuideSpeak,
    GuideRead,
    GuideWrite,
    GuideFinal
  },
  mounted () {
    console.log('userguide monted')
    this.promise = Loader(guideResource(this.componentList[this.idx]))
    Loader(_.cloneDeep(soundArray)).then((cb, data) => {
      this.$set(this, 'sound', data)
    })
  },
  methods: {
    // 开始执行组件
    component_start (id) {
      this.$nextTick(() => {
        if (this.$refs[id].$refs.type[this.cur]) {
          this.$refs[id].$refs.compent[0].$emit('start')
        }
      })
    },

    // 销毁所有组件
    component_destroy (id) {
      this.$refs[id].$emit('hide-com')
      this.$refs[id].$emit('break')
    },

    getTypeList (list) {
      var type = []
      _.map(list, (val) => {
        if (_.isArray(val)) {
          type.push(val[0].form_show_type.toLowerCase())
        } else {
          type.push(val.form_show_type.toLowerCase())
        }
      })
      return type
    },
    getList (array, data, origin) {
      var slide = []
      var meargeArray = []
      var _slide = origin
      // 将加载完成资源复原到原位
      _.map(data, (val) => {
        _slide[val.idx][val.type] = val.url
      })
      // 将imgtosentence的选项提取出来
      var imgtosen = _.groupBy(_slide, 'form_show_type').imgToSentence
      var sentences = []
      _.each(imgtosen, (val) => {
        sentences.push({
          sentence: val.sentence,
          phoneticize: val.sentence_phoneticize
        })
      })

      // 赋值到相应组件中
      _.map(_slide, (val) => {
        if (!/auto|repeat|fill|write|make|imgtosentence$/ig.test(val.form_show_type)) {
          meargeArray.push(val)
        } else {
          val.sentences = sentences
          slide.push(val)
        }
      })

      !_.isEmpty(meargeArray) && slide.push(meargeArray)
      return slide
    }
  },

  created () {
    // 播放视频
    this.$on('playVideo', () => {
      this.$refs['video'].$emit('playVideo')
      return false
    })

    // 初始化组件
    this.$on('init-component', (id) => {
      this.$refs[id].$emit('init')
      this.$refs[id].$emit('show-com')

      return false
    })

    // 执行下一个组件
    this.$on('next-component', (score) => {
      this.score += score || 0
      this.cur++

      if (this.cur === this.list.length) {
        // var score1 = this.score / this.com_length

        this.cur = this.list.length - 1
        return
      }

      // 开始运行组件
      this.component_start(this.componentList[this.idx])
      return false
    })

    // 切换页面
    this.$on('changePage', (page) => {
      let idx = _.indexOf(this.componentList, page)
      let key = this.componentList[idx + 1]
      if (page === 'example') {
        setTimeout(() => {
          this.start = true
          this.promise.then((cb, data) => {
            let key = this.componentList[this.idx]
            let List = this.getList(null, data, _.cloneDeep(resource[key]))
            let Type = this.getTypeList(List)

            this.$set(this, 'typeList', Type)
            this.$set(this, 'list', List)
            this.$nextTick(() => {
              this.cur = -1

              this.$emit('init-component', key)
              this.$refs[key].$emit('startInit')
            })
            cb()
            preLoad(this)
          })
        }, 500)
        return
      }

      if (key) {
        this.$emit('next-slide')
      }
    })

    this.$on('window-resize', () => {
      if (this.start) {
        let key = this.componentList[this.idx]
        this.$refs[key].$emit('resize')
      }
      return false
    })

    this.$on('next-slide', () => {
      this.component_destroy(this.componentList[this.idx])
      this.cur = -1
      this.idx++
      if (this.promise === END) {
        this.start = false
      }
      _.delay(() => {
        this.promise.then((cb, data) => {
          let key = this.componentList[this.idx]

          let List = this.getList(null, data, _.cloneDeep(resource[key]))
          let Type = this.getTypeList(List)

          this.$set(this, 'typeList', Type)
          this.$set(this, 'list', List)
          this.$nextTick(() => {
            this.cur = -1

            this.$emit('init-component', key)
            this.$refs[key].$emit('startInit')
          })
          cb()
          preLoad(this)
        })
      }, 300)
    })
  }
}
</script>

<style lang="less" scoped>
.module-user-guide {
  position: relative;
  width: 796px;
  height: 557px;
  margin: 0 auto;
  margin-top: 50px;
  .guide-header {
    color: #55a4fc;
    font-size: 26px;
  }
  .welani {
    animation: font1 0.8s ease-in-out forwards;
  }
  .testani {
    animation: font2 0.8s ease-in-out forwards;
  }
  .videoani {
    animation: font3 0.8s ease-in-out forwards;
  }
  .examani {
    animation: font4 0.8s ease-in-out forwards;
  }
  .lisani {
    animation: font5 0.8s ease-in-out forwards;
  }
  .speakani {
    animation: font6 0.8s ease-in-out forwards;
  }
  .readani {
    animation: font7 0.8s ease-in-out forwards;
  }
  .writeani {
    animation: font8 0.8s ease-in-out forwards;
  }
  .qq {
    font-size: 14px;
    float: right;
    color: #55a4fc;
  }
}

@keyframes font1 {
  0% {
    transform: translateX(0);
    z-index: 100;
  }
  50% {
    transform: rotateZ(-5deg) translateX(-750px);
    z-index: 100;
  }
  51% {
    z-index: 1;
  }
  100% {
    transform: rotateZ(0deg) translateX(0px);
    z-index: 1;
  }
}

@keyframes font2 {
  0% {
    transform: translateX(0);
    z-index: 99;
  }
  50% {
    transform: rotateZ(-5deg) translateX(-750px);
    z-index: 99;
  }
  51% {
    z-index: 1;
  }
  100% {
    transform: rotateZ(0deg) translateX(0px);
    z-index: 1;
  }
}

@keyframes font3 {
  0% {
    transform: translateX(0);
    z-index: 98;
  }
  50% {
    transform: rotateZ(-5deg) translateX(-750px);
    z-index: 98;
  }
  51% {
    z-index: 1;
  }
  100% {
    transform: rotateZ(0deg) translateX(0px);
    z-index: 1;
  }
}

@keyframes font4 {
  0% {
    transform: translateX(0);
    z-index: 97;
  }
  50% {
    transform: rotateZ(-5deg) translateX(-750px);
    z-index: 97;
  }
  51% {
    z-index: 1;
  }
  100% {
    transform: rotateZ(0deg) translateX(0px);
    z-index: 1;
  }
}

@keyframes font5 {
  0% {
    transform: translateX(0);
    z-index: 96;
  }
  50% {
    transform: rotateZ(-5deg) translateX(-750px);
    z-index: 96;
  }
  51% {
    z-index: 1;
  }
  100% {
    transform: rotateZ(0deg) translateX(0px);
    z-index: 1;
  }
}

@keyframes font6 {
  0% {
    transform: translateX(0);
    z-index: 95;
  }
  50% {
    transform: rotateZ(-5deg) translateX(-750px);
    z-index: 95;
  }
  51% {
    z-index: 1;
  }
  100% {
    transform: rotateZ(0deg) translateX(0px);
    z-index: 1;
  }
}

@keyframes font7 {
  0% {
    transform: translateX(0);
    z-index: 94;
  }
  50% {
    transform: rotateZ(-5deg) translateX(-750px);
    z-index: 94;
  }
  51% {
    z-index: 1;
  }
  100% {
    transform: rotateZ(0deg) translateX(0px);
    z-index: 1;
  }
}

@keyframes font8 {
  0% {
    transform: translateX(0);
    z-index: 93;
  }
  50% {
    transform: rotateZ(-5deg) translateX(-750px);
    z-index: 93;
  }
  51% {
    z-index: 1;
  }
  100% {
    transform: rotateZ(0deg) translateX(0px);
    z-index: 1;
  }
}

@keyframes font9 {
  0% {
    transform: translateX(0);
    z-index: 92;
  }
  50% {
    transform: rotateZ(-5deg) translateX(-750px);
    z-index: 92;
  }
  51% {
    z-index: 1;
  }
  100% {
    transform: rotateZ(0deg) translateX(0px);
    z-index: 1;
  }
}

.learn-icon {
  background: url("../../../../static/images/user-guide/guide-listen.png") 0 0 no-repeat;
  width: image-width;
  height: image-height;
  float: left;
  margin-top: 35px;
  margin-right: 15px;
}

.guide-body {
  width: 796px;
  height: 557px;
  border: #dde2ee 1px solid;
  background-color: #fff;
  padding: 36px 42px 0 42px;
  position: absolute;
  backface-visibility: hidden;
  // transform: translate3d(0, 0, 0);
  //opacity: 1;
}

// @import "welcome/webcome";
// @import "environment-test/environment-test";
// @import "guide-bottom/guide-bottom";
// @import "video-guide/video-guide";
// @import "example-before/example-before";
// @import "guide-listen/guide-listen";
// @import "guide-speak/guide-speak";
// @import "guide-read/guide-read";
// @import "guide-write/guide-write";
// @import "guide-final/guide-final";
.help-tip {
  position: absolute;
  z-index: 99;
  display: none;
  b {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #424777;
    left: 7px;
    top: -5px;
    display: block;
    position: absolute;
    animation: scase 0.8s ease;
    animation-iteration-count: infinite;
  }
}

.help-hand {
  background: url("../../../../static/images/user-guide/hand.png") no-repeat;
  width: image-width;
  height: image-height;
  position: absolute;
}

@keyframes scase {
  0% {
    transform: scale(0.8);
    opacity: 0.8;
  }
  99% {
    transform: scale(1.2);
    opacity: 0.5;
  }
}

.stage {
    width: 80%;
    min-width: 680px;
    margin: 0 auto;
    position: relative;
}

.stage {
  width: 80%;
  min-width: 680px;
  margin: 0 auto;
  position: relative;
}

.f-usn {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.f-cb, .f-cbli li {
  zoom: 1;
}
</style>
