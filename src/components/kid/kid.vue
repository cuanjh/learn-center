<template>
  <transition name="fade" mode="out-in">
    <router-view v-if="isRouterAlive"></router-view>
  </transition>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data () {
    return {
      isRouterAlive: true
    }
  },
  provide () {
    return {
      reload: this.reload
    }
  },
  created () {
    this.getUserInfo()
  },
  mounted () {
    // 测试语音测评接口并发
    // this.testISE()
  },
  computed: {
    ...mapState({
      xfLang: state => state.xfLang
    })
  },
  methods: {
    ...mapActions([
      'getUserInfo',
      'xfISE'
    ]),
    reload () {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    },
    testISE () {
      let dataLists = [
        {
          content: 'What are you doing?',
          sound: 'https://uploadfile1.talkmate.com/feed/sound/2019/11/27/5a9f583a3a700e81118b457b/1574836814802.wav'
        },
        {
          content: 'What are you doing? Walking, walking, walking, I’m walking.',
          sound: 'https://uploadfile1.talkmate.com/feed/sound/2019/11/27/5a9f583a3a700e81118b457b/1574843662907.wav'
        },
        {
          content: 'What are you doing? Running, running, running, I’m running.',
          sound: 'https://uploadfile1.talkmate.com/feed/sound/2019/11/27/5a9f583a3a700e81118b457b/1574843813556.wav'
        },
        {
          content: 'What are you doing? Jumping, jumping, jumping, I’m jumping.',
          sound: 'https://uploadfile1.talkmate.com/feed/sound/2019/11/27/5a9f583a3a700e81118b457b/1574843840314.wav'
        },
        {
          content: 'What are you doing? Singing, singing, singing, I’m singing.',
          sound: 'https://uploadfile1.talkmate.com/feed/sound/2019/11/27/5a9f583a3a700e81118b457b/1574843865483.wav'
        },
        {
          content: 'What are you doing? Dancing, dancing, dancing, I’m dancing.',
          sound: 'https://uploadfile1.talkmate.com/feed/sound/2019/11/27/5a9f583a3a700e81118b457b/1574843896986.wav'
        },
        {
          content: 'We are so happy.',
          sound: 'https://uploadfile1.talkmate.com/feed/sound/2019/11/26/5a9f583a3a700e81118b457b/1574735084766.wav'
        },
        {
          content: 'The egg becomes...',
          sound: 'https://uploadfile1.talkmate.com/feed/sound/2019/11/25/5a9f583a3a700e81118b457b/1574672805592.wav'
        },
        {
          content: 'the chicken.',
          sound: 'https://uploadfile1.talkmate.com/feed/sound/2019/11/25/5a9f583a3a700e81118b457b/1574665268097.wav'
        }
      ]
      let _this = this
      this.mapLimit(dataLists, 5, (curItem) => {
        return new Promise(resolve => {
          _this.xfISE({language: _this.xfLang['KEN'], text: curItem.content, url: curItem.sound}).then(res => {
            resolve(res)
          })
          // setTimeout(() => {
          //   console.log(curItem.content, '当前并发量：', count--)
          //   resolve()
          // }, Math.random() * 5000)
        })
      }).then(response => {
        console.log('finish', response)
      })
    },
    mapLimit (list, limit, asyncHandle) {
      let recursion = (arr) => {
        return asyncHandle(arr.shift()).then(() => {
          if (arr.length !== 0) return recursion(arr)
          else return 'finish'
        })
      }

      let listCopy = [].concat(list)
      let asyncList = []
      while (limit--) {
        asyncList.push(recursion(listCopy))
      }
      return Promise.all(asyncList)
    }
  }
}
</script>

<style lang="less" scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s
}

.fade-enter, .fade-leave-to {
  opacity: 0
}
</style>
