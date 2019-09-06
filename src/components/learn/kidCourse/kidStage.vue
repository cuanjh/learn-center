<template>
  <div class="kid-stage-container">
    kid stage container
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: ['code', 'type'],
  data () {
    return {
      list: []
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    ...mapActions([
      'getKidCourseContent'
    ]),
    async initData () {
      let res = await this.getKidCourseContent({chapter_code: this.code})
      switch (this.type) {
        case 'read':
          this.list = res.teacherContent.draw_contents
          break
        case 'word':
          this.list = res.teacherContent.words
          break
        default:
          this.list = res.teacherContent.words
          break
      }
      console.log('kid stage list', this.list)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
