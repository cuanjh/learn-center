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
      'getKidCatalog'
    ]),
    async initData () {
      let curCourseCode = this.code.split('-').slice(0, 2).join('-')
      let curLevelCode = this.code.split('-').slice(0, 3).join('-')
      let res22 = await this.getKidCatalog({course_code: curCourseCode})
      console.log(res22)
      this.assetsServer = res22.assets_server
      this.catalogs = res22.catalogInfo.catalogs
      let curLevel = this.catalogs.find(item => {
        return item.code === curLevelCode
      })
      this.curLevelChapters = curLevel.chapters
      let chapter = curLevel.chapters.find(item => {
        return item.code === this.code
      })
      switch (this.type) {
        case 'read':
          this.list = chapter.teacher_content.draw_contents
          break
        case 'word':
          this.list = chapter.teacher_content.words
          break
        default:
          this.list = chapter.teacher_content.words
          break
      }
      console.log('kid stage list', this.list)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
