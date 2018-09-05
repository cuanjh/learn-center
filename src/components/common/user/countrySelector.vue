<template>
  <multiselect
    label="name"
    :selected="value"
    v-model="selected"
    :options="options"
    :searchable='true'
    @input="updateSelected"
    placeholder='搜索国籍/地区'
    select-label='按回车可选择'
    deselect-label='按回车取消选择'
    selected-label='已选择'>
    <span slot="noResult" >未找到相匹配的国家</span>
  </multiselect>
</template>

<script>
import { mapActions } from 'vuex'
import Multiselect from 'vue-multiselect'
export default {
  props: ['value'],
  components: {
    Multiselect
  },
  created () {
    this.$on('init', (val) => {
      this.selected = val
    })
  },
  data () {
    return {
      selected: this.value,
      options: [] // 国家列表
    }
  },
  mounted () {
    // 加载国家列表数据
    var _this = this
    this.getCountries({}).then((res) => {
      if (res.success) {
        _this.options = []
        res.countries.forEach((value, index, array) => {
          var _tmp = {}
          _tmp.language = value.country_code
          _tmp.name = value.country_name[_this.languageHandler]
          _this.options.push(_tmp)
        })
      } else {
        var msgStr = 'country load error![' + res.code + ']' + res.errorMsg
        throw msgStr
      }
    })
  },
  methods: {
    ...mapActions({
      getCountries: 'user/getCountries'
    }),
    updateSelected (newValue) {
      this.$emit('update', newValue)
    }
  },
  computed: {
    languageHandler () {
      return this.$store.state.user.languageHandler
    }
  }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>
  .multiselect__option--highlight {
    background: #3c9bbe;
  }
  .multiselect__option--highlight:after {
    background: #3c9bbe;
  }
</style>
