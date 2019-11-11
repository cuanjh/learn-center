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

export default minx
