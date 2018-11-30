<template>
  <div class="baidumap" id="allmap"></div>
</template>

<script>
import $ from 'jquery'
import BMap from 'BMap'
import Bus from '../../bus'
import mapData from '../../api/mapData'
// import BMapSymbolSHAPEPOINT from 'BMap_Symbol_SHAPE_POINT'
export default {
  props: ['data'],
  data () {
    return {
      map: null,
      markers: [],
      langList: [],
      winOpts: {
        width: 0, // 信息窗口宽度
        height: 0, // 信息窗口高度
        title: '' // 信息窗口标题
      }
    }
  },
  created () {
    Bus.$on('mapSearch', (key) => {
      this.mapSearch(key)
    })

    // 加载官方语言数据
    this.$on('loadCourseLangs', (courseLangs) => {
      console.log('courseLangs', courseLangs)
      courseLangs.forEach(item => {
        let langInfos = item.lang_infos
        langInfos.forEach(lang => {
          this.langList.push(lang)
        })
      })
      console.log('langlist', this.langList)
      this.courseLangsMap()
    })
  },
  mounted () {
    console.log('mapData', mapData)
    this.baiduMap()
  },
  methods: {
    // 返回
    goback () {
      this.$router.go(-1)
    },
    baiduMap () {
      // 创建地图实例
      this.map = new BMap.Map('allmap', {
        enableMapClick: false,
        minZoom: 1,
        maxZoom: 6
      })
      // 开启鼠标滚轮缩放
      this.map.enableScrollWheelZoom(true)
      // 创建点坐标
      // var point = new BMap.Point(-3.658035, 40.467359)

      // var options = {
      //   renderOptions: {
      //     map: this.map
      //   },
      //   onSearchComplete: (results) => {
      //     alert('Search Completed')
      //     // 可添加自定义回调函数
      //   }
      // }

      // var localSearch = new BMap.LocalSearch(this.map, options)
      this.map.addEventListener('load', () => {
        console.log('map_langlist', this.langList)
        // this.addPosition()
      //   alert(0)
      //   var circle = new BMap.Circle(point, 500000, {
      //     fillColor: 'blue',
      //     strokeWeight: 1,
      //     fillOpacity: 0.3,
      //     strokeOpacity: 0.3
      //   })
      //   this.map.addOverlay(circle)
      //   localSearch.search('中', {
      //     customData: {
      //       geotableId: 1000005042
      //     }
      //   })
      })

      // 初始化地图，设置中心点坐标和地图级别
      // this.map.centerAndZoom(point, 4)
      /* 浏览器定位 */
      // var geolocation = new BMap.Geolocation()
      // geolocation.getCurrentPosition((r) => {
      //   /* eslint-disable */
      //   if (this.getStatus() == BMAP_STATUS_SUCCESS) {
      //     var mk = new BMap.Marker(r.point)
      //     this.map.addOverlay(mk)
      //     this.map.panTo(r.point)
      //     alert('您的位置：' + r.point.lng + ',' + r.point.lat)
      //   } else {
      //     alert('failed' + this.getStatus())
      //   }
      //   /* eslint-enable */
      // }, {
      //   enableHighAccuracy: true
      // })
      // 创建标注
      // var myIcon = new BMap.Icon('http://lbsyun.baidu.com/jsdemo/img/fox.gif', new BMap.Size(100, 100))
      // var myIcon = new BMap.Symbol('M515.5,1019 C521.166667,1008.88381 524,1002.30463 524,999.262473 C524,994.699235 520.19442,991 515.5,991 C510.80558,991 507,994.699235 507,999.262473 C507,1002.30463 509.833333,1008.88381 515.5,1019 Z', {
      //   rotation: 0, // 顺时针旋转40度
      //   fillColor: 'green',
      //   fillOpacity: 0.8,
      //   strokeColor: '#555',
      //   strokeWeight: 3 // 线宽
      // })
      // var marker = new BMap.Marker(point, {icon: myIcon})
      // marker.enableDragging()
      // marker.addEventListener('dragend', (e) => {
      //   console.log('当前位置：' + e.point.lng + ', ' + e.point.lat)
      // })
      // 将标注添加到地图中
      // this.map.addOverlay(marker)

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
      // this.map.addControl(new BMap.CopyrightControl('aaaa'))
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
      // var local = new BMap.LocalSearch(this.map, {
      //   renderOptions:{map: this.map}
      // })
      // local.search('景点')

      // 随机向地图添加10个标注
      // var bounds = this.map.getBounds()
      // var lngSpan = bounds.maxX - bounds.minX
      // var latSpan = bounds.maxY - bounds.minY
      // for (var i = 0; i < 10; i++) {
      //   var point1 = new BMap.Point(bounds.minX + lngSpan * (Math.random() * 0.7 + 0.15), bounds.minY + latSpan * (Math.random() * 0.7 + 0.15))
      //   this.addMarker(point1, i)
      // }

      // var optsWin = {
      //   width: 250, // 信息窗口宽度
      //   height: 100, // 信息窗口高度
      //   title: 'Hello', // 信息窗口标题
      //   enableMessage: true, // 设置允许信息窗发送短息
      //   message: '亲耐滴，晚上一起吃个饭吧？戳下面的链接看下地址喔~'
      // }
      // var infoWindow = new BMap.InfoWindow('World', optsWin) // 创建信息窗口对象
      // // // this.map.openInfoWindow(infoWindow, this.map.getCenter()) // 打开信息窗口
      // marker.addEventListener('click', () => {
      //   this.map.openInfoWindow(infoWindow, point) // 开启信息窗口
      // })

      // var tilelayer = new BMap.TileLayer() // 创建地图层实例
      // tilelayer.getTilesUrl = () => {
      //   // 设置图块路径
      //   return '../../../static/images/home/back-top.png'
      // }
      // this.map.addTileLayer(tilelayer) // 将图层添加到地图上

      // var geoc = new BMap.Geocoder()
      // this.map.addEventListener('click', (e) => {
      //   var pt = e.point
      //   geoc.getLocation(pt, (rs) => {
      //     var addComp = rs.addressComponents
      //     alert(addComp.province + ', ' + addComp.city + ', ' + addComp.district + ', ' + addComp.street + ', ' + addComp.streetNumber)
      //   })
      // })

      // var geolocation = new BMap.Geolocation()
      // geolocation.getCurrentPosition((r) => {
      //   /* eslint-disable */
      //   if(this.getStatus() === BMAP_STATUS_SUCCESS) {
      //     /* eslint-enable */
      //     var mk = new BMap.Marker(r.point)
      //     this.map.addOverlay(mk)
      //     this.map.panTo(r.point)
      //     alert('您的位置：' + r.point.lng + ',' + r.point.lat)
      //   } else {
      //     alert('failed' + this.getStatus())
      //   }
      // })

      var myCity = new BMap.LocalCity()
      myCity.get((result) => {
        var cityName = result.name
        this.map.setCenter(cityName)
        this.map.centerAndZoom(cityName, 4)
        // alert('当前定位城市:' + cityName)
      })

      // this.map.clearOverlays()

      // var customLayer = new BMap.CustomLayer({
      //   geotableId: 1000005042,
      //   q: '', // 检索关键字
      //   tags: '', // 空格分隔的多字符串
      //   filter: '' // 过滤条件,参考http://lbsyun.baidu.com/index.php?title=lbscloud/api/geosearch
      // })

      // this.map.addTileLayer(customLayer) // 添加自定义图层
    },
    // 设置地图样式
    setMapStyle () {
      /* eslint-disable */
      let styleJson = [
        {
            "featureType": "land",
            "elementType": "geometry",
            "stylers": {
                "visibility": "on",
                "color": "#c1c9cbff"
            }
        }, {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": {
                "visibility": "on",
                "color": "#f2f4edff"
            }
        }, {
            "featureType": "green",
            "elementType": "geometry",
            "stylers": {
                "visibility": "on",
                "color": "#abbbc0ff"
            }
        }, {
            "featureType": "building",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "building",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#ffffffb3"
            }
        }, {
            "featureType": "building",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#dadadab3"
            }
        }, {
            "featureType": "subwaystation",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "color": "#b15454B2"
            }
        }, {
            "featureType": "education",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "color": "#e4f1f1ff"
            }
        }, {
            "featureType": "medical",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "color": "#f0dedeff"
            }
        }, {
            "featureType": "scenicspots",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "color": "#e2efe5ff"
            }
        }, {
            "featureType": "highway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "weight": 4
            }
        }, {
            "featureType": "highway",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#f7c54dff"
            }
        }, {
            "featureType": "highway",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#fed669ff"
            }
        }, {
            "featureType": "highway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "highway",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#8f5a33ff"
            }
        }, {
            "featureType": "highway",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "highway",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "on"
            }
        }, {
            "featureType": "arterial",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "weight": 2
            }
        }, {
            "featureType": "arterial",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#d8d8d8ff"
            }
        }, {
            "featureType": "arterial",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#ffeebbff"
            }
        }, {
            "featureType": "arterial",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "arterial",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#525355ff"
            }
        }, {
            "featureType": "arterial",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "local",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "weight": 1
            }
        }, {
            "featureType": "local",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#d8d8d8ff"
            }
        }, {
            "featureType": "local",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "local",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "local",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#979c9aff"
            }
        }, {
            "featureType": "local",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "railway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "weight": 1
            }
        }, {
            "featureType": "railway",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#123c52ff"
            }
        }, {
            "featureType": "railway",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#12223dff"
            }
        }, {
            "featureType": "subway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "weight": 1
            }
        }, {
            "featureType": "subway",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#d8d8d8ff"
            }
        }, {
            "featureType": "subway",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#ffffff00"
            }
        }, {
            "featureType": "subway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "subway",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#979c9aff"
            }
        }, {
            "featureType": "subway",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "continent",
            "elementType": "labels",
            "stylers": {
                "visibility": "on"
            }
        }, {
            "featureType": "continent",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "on"
            }
        }, {
            "featureType": "continent",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#333333ff"
            }
        }, {
            "featureType": "continent",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "city",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "on"
            }
        }, {
            "featureType": "city",
            "elementType": "labels",
            "stylers": {
                "visibility": "on"
            }
        }, {
            "featureType": "city",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#1e2d33ff"
            }
        }, {
            "featureType": "city",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "town",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "on"
            }
        }, {
            "featureType": "town",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "town",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#454d50ff"
            }
        }, {
            "featureType": "town",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#12223dff"
            }
        }, {
            "featureType": "poilabel",
            "elementType": "labels",
            "stylers": {
                "visibility": "on"
            }
        }, {
            "featureType": "districtlabel",
            "elementType": "labels",
            "stylers": {
                "visibility": "on"
            }
        }, {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "weight": 3
            }
        }, {
            "featureType": "road",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "road",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#ffffff00"
            }
        }, {
            "featureType": "district",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "poilabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "poilabel",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#2dc4bbff"
            }
        }, {
            "featureType": "poilabel",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#ffffff00"
            }
        }, {
            "featureType": "manmade",
            "elementType": "geometry",
            "stylers": {
                "color": "#12223dff",
                "visibility": "off"
            }
        }, {
            "featureType": "districtlabel",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "entertainment",
            "elementType": "geometry",
            "stylers": {
                "color": "#ffffffff",
                "visibility": "off"
            }
        }, {
            "featureType": "shopping",
            "elementType": "geometry",
            "stylers": {
                "color": "#12223dff",
                "visibility": "off"
            }
        }, {
            "featureType": "village",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "estate",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "transportation",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "districtlabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }
      ]
      /* eslint-enable */
      this.map.setMapStyle({styleJson: styleJson})
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
      marker.addEventListener('click', () => {
        alert('您点击了标注')
      })
      this.map.addOverlay(marker)
    },
    // 定义自定义覆盖物的构造函数
    SquareOverlay (center, length, color) {
      // this._center = center
      // his._length = length
      // this._color = color
    },
    addPosition () {
      let marker
      let label
      let pt = null
      console.log(this.map.getBounds())
      $.ajax({
        type: 'GET',
        dataType: 'JSONP',
        url: 'http://api.map.baidu.com/geosearch/v3/bound?ak=8oTo926ag3Q4L76hGg3QIYeFieYphvOC&geotable_id=196965&bounds=' + this.map.getBounds().getSouthWest().lng + ',' + this.map.getBounds().getSouthWest().lat + ';' + this.map.getBounds().getNorthEast().lng + ',' + this.map.getBounds().getNorthEast().lat,
        success: (data) => {
          console.log(data)
          for (var j = 0; j < data.size; j++) {
            // 点聚合
            pt = new BMap.Point(data.contents[j].location[0], data.contents[j].location[1])
            var myIcon = new BMap.Icon('https://course-assets1.talkmate.com/course/icons/ENG-3x.webp?v=3', new BMap.Size(30, 30))
            if (data.contents[j].lang_code) {
              // myIcon = new BMap.Icon(data.contents[j].lang_type_icon['big'], new BMap.Size(50, 50))
              marker = new BMap.Marker(pt, {icon: myIcon})
            } else {
              marker = new BMap.Marker(pt)
            }

            label = new BMap.Label(data.contents[j].name, {offset: new BMap.Size(12, 0)}) // 创建marker点的标记

            // 对label 样式隐藏
            // label.setStyle({display: 'none'})
            // 把label设置到maker上
            marker.setLabel(label)
            this.map.addOverlay(marker)
            // 添加点击事件
            var sContent =
              '<div>' +
                '<p>' +
                  '<img style="float:left;margin:4px" src="' + data.contents[j].flag.big + '" width="40" height="40" title=""/>' +
                  '<span style="font-size:13px; font-weight:bold; color:#333333; line-height: 20px; margin-left: 5px;">' +
                    data.contents[j].name +
                  '</span>' +
                '</p>' +
                '<p style="margin:0;line-height:1.5;font-size:13px;text-indent:2em">天安门坐落在中国北京市中心,故宫的南侧,与天安门广场隔长安街相望,是清朝皇城的大门...</p>' +
              '</div>'
            // sContent = ''
            this.addClickHandler(sContent, marker)
            // var infoWindow = new BMap.InfoWindow(sContent)
            // var optsWin = {
            //   width: 250, // 信息窗口宽度
            //   height: 100, // 信息窗口高度
            //   title: 'Hello', // 信息窗口标题
            //   enableMessage: true, // 设置允许信息窗发送短息
            //   // offset: {
            //   //   width: -40,
            //   //   height: -40
            //   // },
            //   message: '亲耐滴，晚上一起吃个饭吧？戳下面的链接看下地址喔~'
            // }
            // var infoWindow = new BMap.InfoWindow(sContent, this.winOpts) // 创建信息窗口对象
            // marker.addEventListener('click', (e) => {
            //   console.log(e)
            //   let curPoint = new BMap.Point(e.currentTarget.point['lng'], e.currentTarget.point['lat'])
            //   this.map.openInfoWindow(infoWindow, curPoint) // 开启信息窗口
            // })
          }
        }
      })
    },
    addClickHandler (content, marker) {
      marker.addEventListener('click', (e) => {
        this.openInfo(content, e)
      })
    },
    addMouseoverHandler (content, marker) {
      marker.addEventListener('mouseover', (e) => {
        this.openInfo(content, e)
      })
    },
    openInfo (content, e) {
      var p = e.target
      var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat)
      // 创建信息窗口对象
      var infoWindow = new BMap.InfoWindow(content, {
        width: 50,
        height: 30
      })
      // 开启信息窗口
      this.map.openInfoWindow(infoWindow, point)
    },
    mapSearch (key) {
      console.log(key)
      console.log(this.map)
      var options = {
        renderOptions: {
          map: this.map
        },
        onSearchComplete: (results) => {
          console.log('Search Completed', results)
          // 可添加自定义回调函数
        }
      }
      var localSearch = new BMap.LocalSearch(this.map, options)
      let swLng = this.map.getBounds().getSouthWest().lng
      let swLat = this.map.getBounds().getSouthWest().lat
      let neLng = this.map.getBounds().getNorthEast().lng
      let neLat = this.map.getBounds().getNorthEast().lat
      var b = new BMap.Bounds(new BMap.Point(swLng, swLat), new BMap.Point(neLng, neLat)) // 范围 左下角，右上角的点位置
      localSearch.searchInBounds(key, b, {
        customData: {
          geotableId: 196965
        }
      })
    },
    // 官方语言地图
    courseLangsMap () {
      // let courseLangsData = mapData.courseLangsMap
      mapData.courseLangMap.forEach(lang => {
        let pt = new BMap.Point(lang.lon, lang.lat)
        var myIcon = new BMap.Icon('http://lbsyun.baidu.com/jsdemo/img/fox.gif', new BMap.Size(100, 100))

        let marker = new BMap.Marker(pt, {icon: myIcon, offset: new BMap.Size(0, 15)})
        let obj = this.langList.find((x) => {
          return x.lan_code === lang.lang_code
        })
        let label = new BMap.Label(obj.name['zh-CN'], {offset: new BMap.Size(60, 15)}) // 创建marker点的标记

        // 对label 样式隐藏
        // label.setStyle({display: 'none'})
        // 把label设置到maker上
        marker.setLabel(label)
        this.map.addOverlay(marker)
        var sContent =
          '<div>' +
            '<p>' +
              '<img style="float:left;margin:4px" src="' + obj.flag + '" width="50" height="50" title=""/>' +
              '<a href="./book-details/' + obj.lan_code + '-Basic">' +
                '<span style="font-size:18px; font-weight:bold; color:#333333; line-height: 60px; margin-left: 5px;">' +
                  obj.name['zh-CN'] +
                '</span>' +
              '</a>' +
            '</p>' +
          '</div>'
        this.addMouseoverHandler(sContent, marker)
      })
    }
  }
}
</script>

<style>
.baidumap {
}

.BMap_cpyCtrl {
  display: none;
}
.anchorBL{
  display: none;
}
</style>
