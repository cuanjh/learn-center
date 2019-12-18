var minx = {}

minx.shake = {
  methods: {
    shake (obj) {
      obj.addClass('shake')
      setTimeout(() => {
        obj.removeClass('shake')
      }, 800)
    }
  }
}

minx.isLearned = {
  methods: {
    isLearned (formCode) {
      let key = formCode.split('-').slice(5).join('-')
      let flag = false
      if (this.recordForms[key] === 0 || this.recordForms[key] === 1) {
        flag = true
      }
      return flag
    }
  }
}

export default minx
