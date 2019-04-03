<template>
  <div class="canvas">
    <canvas id="myCanvas" width="160" height="160" style="width:140px;height:140px;"></canvas>
  </div>
</template>
<script>
export default {
  props: ['percent'],
  data () {
    return {
      num: 0,
      canvas: '',
      context: '',
      cirX: '',
      cirY: '',
      rad: '',
      n: 0,
      speed: 150,
      r: 36
    }
  },
  mounted () {
    this.canvas = document.getElementById('myCanvas')
    this.context = this.canvas.getContext('2d')
    this.context.scale(2, 2)
    this.cirX = 40 // this.canvas.width/ 2
    this.cirY = 40 // this.canvas.height/ 2
    this.rad = Math.PI * 1.75 / 100 // 总弧度
    console.log('rad', this.rad)
    this.DreamLoading()
  },
  created () {
  },
  methods: {
    // 绘制最外层细圈
    writeCircle () {
      this.context.save() // save和restore可以保证样式属性只运用于该段canvas元素
      this.context.beginPath() // 开始路径
      this.context.strokeStyle = '#F2F5F8FF' // 设置边线的颜色
      this.context.lineWidth = 5
      this.context.lineCap = 'round'
      this.context.beginPath()
      this.context.arc(this.cirX, this.cirY, this.r, 90, Math.PI * 2.35) // 画一个圆的路径
      this.context.stroke() // 绘制边线
      // this.context.restore()
      // this.context.closePath()
    },
    // 绘制文本
    writeText (n) {
      this.context.save()
      this.context.font = '30px PingFangSC-Semibold;'
      this.context.fillStyle = '#333333FF' // 字体颜色
      this.context.fillText(n.toFixed(0) + '%', this.cirX - 10, this.cirY + 10) // 绘制实心
      // context.strokeStyle = '#49f'
      // context.strokeText(n.toFixed(0) + '%', cirX - 30 , cirY +10) // 绘制空心
      this.context.stroke()
      this.context.restore()
    },
    // 绘制蓝色外圈
    writeBlue (n) {
      // console.log('n', n)
      this.context.save()
      this.context.strokeStyle = '#2A9FE4FF'
      this.context.lineWidth = 5
      this.context.lineCap = 'round'
      this.context.beginPath()
      // this.context.arc(this.cirX, this.cirY, this.r, 0.625 * Math.PI, 0.375 * Math.PI + this.rad * n)
      // console.log('起始角', 0.625 * Math.PI)
      // console.log('结束角', 0.375 * Math.PI + this.rad * n)
      // ctx.arc(100,75,50,0.625*Math.PI,0.625*Math.PI+1.75*Math.PI);
      this.context.arc(this.cirX, this.cirY, this.r, 0.625 * Math.PI, 0.625 * Math.PI + this.rad * n, false)
      this.context.stroke()
      this.context.restore()
    },
    DreamLoading () {
      // console.log(this.n)
      // 清除所有，重新绘制
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.writeCircle()
      this.writeText(this.n)
      this.writeBlue(this.n)
      // if(this.n < 100 && this.n <= 60){
      console.log('-----', this.percent)
      if (this.n <= this.percent) {
        this.n = this.n + 0.4
      } else {
        this.n = 0
        return this.n
      }
      // setTimeout(DreamLoading, speed)
      requestAnimationFrame(this.DreamLoading)
    }
  }
}
</script>
<style lang="less" scoped>
.canvas {
  text-align: center;
}
</style>
