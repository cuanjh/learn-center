<template>
  <div class="baidumap" id="allmap"></div>
</template>

<script>
import BMap from 'BMap'
// import BMapSymbolSHAPEPOINT from 'BMap_Symbol_SHAPE_POINT'
export default {
  data () {
    return {
      map: null
    }
  },
  mounted () {
    this.baiduMap()
  },
  methods: {
    // 返回
    goback () {
      this.$router.go(-1)
    },
    baiduMap () {
      // 创建地图实例
      this.map = new BMap.Map('allmap')
      // 开启鼠标滚轮缩放
      this.map.enableScrollWheelZoom(true)
      // 创建点坐标
      var point = new BMap.Point(116.404, 39.915)
      // 初始化地图，设置中心点坐标和地图级别
      this.map.centerAndZoom(point, 1)
      // 创建标注
      var marker = new BMap.Marker(point)
      // 将标注添加到地图中
      this.map.addOverlay(marker)
      /* eslint-disable */
      var opts = {
        // offset: new BMap.Size(150, 5),
        anchor: BMAP_ANCHOR_TOP_RIGHT,
        type: BMAP_NAVIGATION_CONTROL_SMALL
      }
      /* eslint-enable */
      this.map.addControl(new BMap.NavigationControl(opts))
      // map.addControl(new BMap.ScaleControl(opts))
      // map.addControl(new BMap.OverviewMapControl())
      // map.addControl(new BMap.MapTypeControl())
      this.map.addControl(new BMap.CopyrightControl('aaaa'))
      // setTimeout(() => {
      //   map.panTo(new BMap.Point(116.409, 39.918))
      // }, 2000)
      // 设置地图样式
      // var mapStyle = { style: 'midnight' }
      // map.setMapStyle(mapStyle)

      // var myStyleJson = [
      //   {
      //     'featureType': 'road',
      //     'elementType': 'geometry.stroke',
      //     'stylers': {
      //       'color': '#ff0000'
      //     }
      //   }
      // ]
      // map.setMapStyle({ styleJson: myStyleJson })
      this.setMapStyle()

      // 随机向地图添加10个标注
      var bounds = this.map.getBounds()
      var lngSpan = bounds.maxX - bounds.minX
      var latSpan = bounds.maxY - bounds.minY
      for (var i = 0; i < 10; i++) {
        var point1 = new BMap.Point(bounds.minX + lngSpan * (Math.random() * 0.7 + 0.15), bounds.minY + latSpan * (Math.random() * 0.7 + 0.15))
        this.addMarker(point1, i)
      }
    },
    // 设置地图样式
    setMapStyle () {
      // var styleJson = [
      //   {
      //     'featureType': 'land',
      //     'elementType': 'geometry',
      //     'stylers': {
      //       'visibility': 'on',
      //       'color': '#091220ff'
      //     }
      // }, {
      //   'featureType': 'water',
      //   'elementType': 'geometry',
      //   'stylers': {
      //     'visibility': 'on',
      //     'color': '#113549ff'
      //   }
      // }, {
      //     'featureType': 'green',
      //     'elementType': 'geometry',
      //     'stylers': {
      //         'visibility': 'on',
      //         'color': '#0e1b30ff'
      //     }
      // }, {
      //     'featureType': 'building',
      //     'elementType': 'geometry',
      //     'stylers': {
      //         'visibility': 'on'
      //     }
      // }, {
      //     'featureType': 'building',
      //     'elementType': 'geometry.fill',
      //     'stylers': {
      //         'color': '#ffffffb3'
      //     }
      // }, {
      //     'featureType': 'building',
      //     'elementType': 'geometry.stroke',
      //     'stylers': {
      //         'color': '#dadadab3'
      //     }
      // }, {
      //     'featureType': 'subwaystation',
      //     'elementType': 'geometry',
      //     'stylers': {
      //         'visibility': 'on',
      //         'color': '#b15454B2'
      //     }
      // }, {
      //     'featureType': 'education',
      //     'elementType': 'geometry',
      //     'stylers': {
      //         'visibility': 'on',
      //         'color': '#e4f1f1ff'
      //     }
      // }, {
      //     'featureType': 'medical',
      //     'elementType': 'geometry',
      //     'stylers': {
      //         'visibility': 'on',
      //         'color': '#f0dedeff'
      //     }
      // }, {
      //     'featureType': 'scenicspots',
      //     'elementType': 'geometry',
      //     'stylers': {
      //         'visibility': 'on',
      //         'color': '#e2efe5ff'
      //     }
      // }, {
      //     'featureType': 'highway',
      //     'elementType': 'geometry',
      //     'stylers': {
      //         'visibility': 'on',
      //         'weight': 4
      //     }
      // }, {
      //     'featureType': 'highway',
      //     'elementType': 'geometry.fill',
      //     'stylers': {
      //         'color': '#f7c54dff'
      //     }
      // }, {
      //     'featureType': 'highway',
      //     'elementType': 'geometry.stroke',
      //     'stylers': {
      //         'color': '#fed669ff'
      //     }
      // }, {
      //     'featureType': 'highway',
      //     'elementType': 'labels',
      //     'stylers': {
      //         'visibility': 'on'
      //     }
      // }, {
      //     'featureType': 'highway',
      //     'elementType': 'labels.text.fill',
      //     'stylers': {
      //         'color': '#8f5a33ff'
      //     }
      // }, {
      //     'featureType': 'highway',
      //     'elementType': 'labels.text.stroke',
      //     'stylers': {
      //         'color': '#ffffffff'
      //     }
      // }, {
      //     'featureType': 'highway',
      //     'elementType': 'labels.icon',
      //     'stylers': {
      //         'visibility': 'on'
      //     }
      // }, {
      //     'featureType': 'arterial',
      //     'elementType': 'geometry',
      //     'stylers': {
      //         'visibility': 'on',
      //         'weight': 2
      //     }
      // }, {
      //     'featureType': 'arterial',
      //     'elementType': 'geometry.fill',
      //     'stylers': {
      //         'color': '#d8d8d8ff'
      //     }
      // }, {
      //     'featureType': 'arterial',
      //     'elementType': 'geometry.stroke',
      //     'stylers': {
      //         'color': '#ffeebbff'
      //     }
      // }, {
      //     'featureType': 'arterial',
      //     'elementType': 'labels',
      //     'stylers': {
      //         'visibility': 'on'
      //     }
      // }, {
      //     'featureType': 'arterial',
      //     'elementType': 'labels.text.fill',
      //     'stylers': {
      //         'color': '#525355ff'
      //     }
      // }, {
      //     'featureType': 'arterial',
      //     'elementType': 'labels.text.stroke',
      //     'stylers': {
      //         'color': '#ffffffff'
      //     }
      // }, {
      //     'featureType': 'local',
      //     'elementType': 'geometry',
      //     'stylers': {
      //         'visibility': 'on',
      //         'weight': 1
      //     }
      // }, {
      //     'featureType': 'local',
      //     'elementType': 'geometry.fill',
      //     'stylers': {
      //         'color': '#d8d8d8ff'
      //     }
      // }, {
      //     'featureType': 'local',
      //     'elementType': 'geometry.stroke',
      //     'stylers': {
      //         'color': '#ffffffff'
      //     }
      // }, {
      //     'featureType': 'local',
      //     'elementType': 'labels',
      //     'stylers': {
      //         'visibility': 'on'
      //     }
      // }, {
      //     'featureType': 'local',
      //     'elementType': 'labels.text.fill',
      //     'stylers': {
      //         'color': '#979c9aff'
      //     }
      // }, {
      //     'featureType': 'local',
      //     'elementType': 'labels.text.stroke',
      //     'stylers': {
      //         'color': '#ffffffff'
      //     }
      // }, {
      //     'featureType': 'railway',
      //     'elementType': 'geometry',
      //     'stylers': {
      //         'visibility': 'on',
      //         'weight': 1
      //     }
      // }, {
      //     'featureType': 'railway',
      //     'elementType': 'geometry.fill',
      //     'stylers': {
      //         'color': '#123c52ff'
      //     }
      // }, {
      //     'featureType': 'railway',
      //     'elementType': 'geometry.stroke',
      //     'stylers': {
      //         'color': '#12223dff'
      //     }
      // }, {
      //     'featureType': 'subway',
      //     'elementType': 'geometry',
      //     'stylers': {
      //         'visibility': 'on',
      //         'weight': 1
      //     }
      // }, {
      //     'featureType': 'subway',
      //     'elementType': 'geometry.fill',
      //     'stylers': {
      //         'color': '#d8d8d8ff'
      //     }
      // }, {
      //     'featureType': 'subway',
      //     'elementType': 'geometry.stroke',
      //     'stylers': {
      //         'color': '#ffffff00'
      //     }
      // }, {
      //     'featureType': 'subway',
      //     'elementType': 'labels',
      //     'stylers': {
      //         'visibility': 'on'
      //     }
      // }, {
      //     'featureType': 'subway',
      //     'elementType': 'labels.text.fill',
      //     'stylers': {
      //         'color': '#979c9aff'
      //     }
      // }, {
      //     'featureType': 'subway',
      //     'elementType': 'labels.text.stroke',
      //     'stylers': {
      //         'color': '#ffffffff'
      //     }
      // }, {
      //     'featureType': 'continent',
      //     'elementType': 'labels',
      //     'stylers': {
      //         'visibility': 'on'
      //     }
      // }, {
      //     'featureType': 'continent',
      //     'elementType': 'labels.icon',
      //     'stylers': {
      //         'visibility': 'on'
      //     }
      // }, {
      //     'featureType': 'continent',
      //     'elementType': 'labels.text.fill',
      //     'stylers': {
      //         'color': '#333333ff'
      //     }
      // }, {
      //     'featureType': 'continent',
      //     'elementType': 'labels.text.stroke',
      //     'stylers': {
      //         'color': '#ffffffff'
      //     }
      // }, {
      //     'featureType': 'city',
      //     'elementType': 'labels.icon',
      //     'stylers': {
      //         'visibility': 'on'
      //     }
      // }, {
      //     'featureType': 'city',
      //     'elementType': 'labels',
      //     'stylers': {
      //         'visibility': 'on'
      //     }
      // }, {
      //     'featureType': 'city',
      //     'elementType': 'labels.text.fill',
      //     'stylers': {
      //         'color': '#454d50ff'
      //     }
      // }, {
      //     'featureType': 'city',
      //     'elementType': 'labels.text.stroke',
      //     'stylers': {
      //         'color': '#ffffffff'
      //     }
      // }, {
      //     'featureType': 'town',
      //     'elementType': 'labels.icon',
      //     'stylers': {
      //         'visibility': 'on'
      //     }
      // }, {
      //     'featureType': 'town',
      //     'elementType': 'labels',
      //     'stylers': {
      //         'visibility': 'on'
      //     }
      // }, {
      //     'featureType': 'town',
      //     'elementType': 'labels.text.fill',
      //     'stylers': {
      //         'color': '#454d50ff'
      //     }
      // }, {
      //     'featureType': 'town',
      //     'elementType': 'labels.text.stroke',
      //     'stylers': {
      //         'color': '#ffffffff'
      //     }
      // }, {
      //     'featureType': 'road',
      //     'elementType': 'geometry.fill',
      //     'stylers': {
      //         'color': '#12223dff'
      //     }
      // }, {
      //     'featureType': 'poilabel',
      //     'elementType': 'labels',
      //     'stylers': {
      //         'visibility': 'on'
      //     }
      // }, {
      //     'featureType': 'districtlabel',
      //     'elementType': 'labels',
      //     'stylers': {
      //         'visibility': 'off'
      //     }
      // }, {
      //     'featureType': 'road',
      //     'elementType': 'geometry',
      //     'stylers': {
      //         'visibility': 'on'
      //     }
      // }, {
      //     'featureType': 'road',
      //     'elementType': 'labels',
      //     'stylers': {
      //         'visibility': 'off'
      //     }
      // }, {
      //     'featureType': 'road',
      //     'elementType': 'geometry.stroke',
      //     'stylers': {
      //         'color': '#ffffff00'
      //     }
      // }, {
      //     'featureType': 'district',
      //     'elementType': 'labels',
      //     'stylers': {
      //         'visibility': 'off'
      //     }
      // }, {
      //     'featureType': 'poilabel',
      //     'elementType': 'labels.icon',
      //     'stylers': {
      //         'visibility': 'off'
      //     }
      // }, {
      //     'featureType': 'poilabel',
      //     'elementType': 'labels.text.fill',
      //     'stylers': {
      //         'color': '#2dc4bbff'
      //     }
      // }, {
      //     'featureType': 'poilabel',
      //     'elementType': 'labels.text.stroke',
      //     'stylers': {
      //         'color': '#ffffff00'
      //     }
      // }, {
      //     'featureType': 'manmade',
      //     'elementType': 'geometry',
      //     'stylers': {
      //         'color': '#12223dff'
      //     }
      // }, {
      //     'featureType': 'districtlabel',
      //     'elementType': 'labels.text.stroke',
      //     'stylers': {
      //         'color': '#ffffffff'
      //     }
      // }, {
      //     'featureType': 'entertainment',
      //     'elementType': 'geometry',
      //     'stylers': {
      //         'color': '#ffffffff'
      //     }
      // }, {
      //     'featureType': 'shopping',
      //     'elementType': 'geometry',
      //     'stylers': {
      //         'color': '#12223dff'
      //     }
      // }
      // ];
      // this.map.setMapStyleV2({styleJson:styleJson})
    },
    addMarker (point, index) {
      // 创建图标对象
      var myIcon = new BMap.Icon('../../../static/images/home/back-top.png', new BMap.Size(23, 25), {
        // 指定定位位置。
        // 当标注显示在地图上时，其所指向的地理位置距离图标左上
        // 角各偏移10像素和25像素。您可以看到在本例中该位置即是
        // 图标中央下端的尖角位置。
        anchor: new BMap.Size(10, 25),
        // 设置图片偏移。
        // 当您需要从一幅较大的图片中截取某部分作为标注图标时，您
        // 需要指定大图的偏移位置，此做法与css sprites技术类似。
        imageOffset: new BMap.Size(0, 0 - index * 25)
      })
      // 创建标注对象并添加到地图
      var marker = new BMap.Marker(point, { icon: myIcon })
      this.map.addOverlay(marker)
    }
  }
}
</script>

<style scoped>
.baidumap {
}
</style>
