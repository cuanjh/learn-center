/**
 * 1:官方课程
 * 2:安全语言
 * 3:濒危语言
 * 4:一带一路语言
 * 5:语伴
 */
/* jshint esversion: 6 */
const courseLangMap = [
  // 欧洲
  { lang_code: 'SER', lng: 20.479038, lat: 44.781025, type: ',1,2,' },
  { lang_code: 'ENG', lng: -0.052345, lat: 51.51444, type: ',1,2,' },
  { lang_code: 'FRE', lng: 2.376098, lat: 48.845377, type: ',1,2,' },
  { lang_code: 'GER', lng: 13.414476, lat: 52.535823, type: ',1,2,' },
  { lang_code: 'SPA', lng: -3.672588, lat: 40.379965, type: ',1,2,' },
  { lang_code: 'RUS', lng: 37.667863, lat: 55.766521, type: ',1,2,' },
  { lang_code: 'FIN', lng: 25.010522, lat: 60.154508, type: ',1,2,' },
  { lang_code: 'ALB', lng: 19.827084, lat: 41.32166, type: ',1,2,' },
  { lang_code: 'UKR', lng: 30.575705, lat: 50.451919, type: ',1,2,' },
  { lang_code: 'DUT', lng: 4.929873, lat: 52.372881, type: ',1,2,' },
  { lang_code: 'DAN', lng: 12.472765, lat: 55.664316, type: ',1,2,' },
  { lang_code: 'POL', lng: 21.045905, lat: 52.226251, type: ',1,2,' },
  { lang_code: 'POR', lng: -9.125662, lat: 38.762711, type: ',1,2,' },
  { lang_code: 'SWE', lng: 18.08394, lat: 59.325705, type: ',1,2,' },
  { lang_code: 'SLO', lng: 17.113483, lat: 48.145373, type: ',1,2,' },
  { lang_code: 'ITA', lng: 12.477364, lat: 43.932994, type: ',1,2,' },
  { lang_code: 'RUM', lng: 26.109761, lat: 44.409698, type: ',1,2,' },
  { lang_code: 'ICE', lng: -21.833595, lat: 64.101701, type: ',1,2,' },
  { lang_code: 'HRV', lng: 15.991248, lat: 45.803663, type: ',1,2,' },
  { lang_code: 'GRE', lng: 23.73651, lat: 37.969671, type: ',1,2,' },
  { lang_code: 'HUN', lng: 19.063596, lat: 47.488622, type: ',1,2,' },
  { lang_code: 'EST', lng: 24.766758, lat: 59.42194, type: ',1,2,' },
  { lang_code: 'NOR', lng: 10.80321, lat: 59.896709, type: ',1,2,' },
  { lang_code: 'LAT', lng: 14.786225, lat: 40.670002, type: ',1,2,' },
  { lang_code: 'CZE', lng: 14.473471, lat: 50.065651, type: ',1,2,' },
  { lang_code: 'BUL', lng: 23.32257, lat: 42.690344, type: ',1,2,' },
  { lang_code: 'LIT', lng: 25.291081, lat: 54.682459, type: ',1,2,' },
  { lang_code: 'LAV', lng: 24.113654, lat: 56.950224, type: ',1,2,' },
  { lang_code: 'MON', lng: 19.261367, lat: 42.428524, type: ',1,2,' },
  { lang_code: 'BOS', lng: 18.419691, lat: 43.856494, type: ',1,2,' },
  { lang_code: 'FRA', lng: 7.698666, lat: 45.06535, type: ',1,2,' },
  { lang_code: 'MAC', lng: 21.436848, lat: 41.994272, type: ',1,2,' },
  // 东亚
  { lang_code: 'CHI', lng: 116.439339, lat: 39.955211, type: ',1,2,' },
  { lang_code: 'KOR', lng: 127.036182, lat: 37.593625, type: ',1,2,' },
  { lang_code: 'JPN', lng: 139.767111, lat: 35.756111, type: ',1,2,' },
  { lang_code: 'CAN', lng: 113.575109, lat: 22.851907, type: ',1,2,' },
  { lang_code: 'UYG', lng: 87.653318, lat: 43.829862, type: ',1,2,' },
  { lang_code: 'TIB', lng: 91.148805, lat: 29.664091, type: ',1,2,' },
  { lang_code: 'MOG', lng: 111.790572, lat: 40.883288, type: ',1,2,' },
  { lang_code: 'HYE', lng: 44.502458, lat: 40.174357, type: ',1,2,' },
  // 中东
  { lang_code: 'ARA', lng: 46.719333, lat: 24.719938, type: ',1,2,' },
  { lang_code: 'TUR', lng: 32.861569, lat: 39.926927, type: ',1,2,' },
  { lang_code: 'FAR', lng: 51.387647, lat: 35.703647, type: ',1,2,' },
  { lang_code: 'HEB', lng: 35.296911, lat: 31.781871, type: ',1,2,' },
  { lang_code: 'PUS', lng: 69.239924, lat: 34.528309, type: ',1,2,' },
  { lang_code: 'UZB', lng: 69.249122, lat: 41.307789, type: ',1,2,' },
  { lang_code: 'GLG', lng: 44.835909, lat: 41.708846, type: ',1,2,' },
  { lang_code: 'AZE', lng: 49.876769, lat: 40.406819, type: ',1,2,' },
  // 东南亚
  { lang_code: 'FIL', lng: 121.044412, lat: 14.592477, type: ',1,2,' },
  { lang_code: 'SUN', lng: 106.841124, lat: -6.206072, type: ',1,2,' },
  { lang_code: 'THA', lng: 100.50613, lat: 13.706646, type: ',1,2,' },
  { lang_code: 'VIE', lng: 105.730962, lat: 20.946161, type: ',1,2,' },
  { lang_code: 'LAO', lng: 102.677011, lat: 18.015103, type: ',1,2,' },
  { lang_code: 'IND', lng: 114.819227, lat: 4.842456, type: ',1,2,' },
  { lang_code: 'BUR', lng: 96.124698, lat: 19.766819, type: ',1,2,' },
  { lang_code: 'MAY', lng: 101.699079, lat: 3.133956, type: ',1,2,' },
  { lang_code: 'KHM', lng: 104.872901, lat: 11.554368, type: ',1,2,' },
  { lang_code: 'TET', lng: 125.56986, lat: -8.55689, type: ',1,2,' },
  { lang_code: 'JAV', lng: 112.746944, lat: -7.266533, type: ',1,2,' },
  { lang_code: 'AMB', lng: 128.191474, lat: -3.708852, type: ',1,2,' },
  // 南亚
  { lang_code: 'MAL', lng: 77.148462, lat: 28.715625, type: ',1,2,' },
  { lang_code: 'NEP', lng: 85.353656, lat: 27.721555, type: ',1,2,' },
  { lang_code: 'MAR', lng: 72.836595, lat: 18.97316, type: ',1,2,' },
  { lang_code: 'TAM', lng: 80.273703, lat: 13.086639, type: ',1,2,' },
  { lang_code: 'BEN', lng: 90.415212, lat: 23.808914, type: ',1,2,' },
  { lang_code: 'PUN', lng: 76.778216, lat: 30.736057, type: ',1,2,' },
  { lang_code: 'SIN', lng: 79.967847, lat: 6.999199, type: ',1,2,' },
  { lang_code: 'URD', lng: 73.087258, lat: 33.714722, type: ',1,2,' },
  { lang_code: 'TEL', lng: 78.500663, lat: 17.386043, type: ',1,2,' },
  { lang_code: 'HIN', lng: 77.15766, lat: 28.725001, type: ',1,2,' },
  { lang_code: 'SND', lng: 67.28866, lat: 25.066891, type: ',1,2,' },
  { lang_code: 'GUJ', lng: 72.568685, lat: 23.026837, type: ',1,2,' },
  { lang_code: 'KAS', lng: 73.886391, lat: 33.980489, type: ',1,2,' },
  { lang_code: 'KAN', lng: 77.611844, lat: 12.956976, type: ',1,2,' },
  // 中亚
  { lang_code: 'TGK', lng: 68.777692, lat: 38.549924, type: ',1,2,' },
  { lang_code: 'KAZ', lng: 71.475195, lat: 51.140765, type: ',1,2,' },
  { lang_code: 'TUK', lng: 58.37632, lat: 37.938031, type: ',1,2,' },
  // 非洲
  { lang_code: 'SOM', lng: 45.394727, lat: 2.010977, type: ',1,2,' },
  { lang_code: 'SWA', lng: 36.839697, lat: -1.312678, type: ',1,2,' },
  { lang_code: 'FAN', lng: 9.501314, lat: 0.423702, type: ',1,2,' },
  { lang_code: 'LUG', lng: 32.617517, lat: 0.349613, type: ',1,2,' },
  { lang_code: 'YOR', lng: 7.431618, lat: 9.072176, type: ',1,2,' },
  { lang_code: 'KIN', lng: 30.14998, lat: -2.023175, type: ',1,2,' },
  { lang_code: 'RUN', lng: 29.368095, lat: -3.364534, type: ',1,2,' },
  { lang_code: 'SAG', lng: 57.502736, lat: -20.160128, type: ',1,2,' },
  { lang_code: 'MRD', lng: -6.814501, lat: 33.952704, type: ',1,2,' },
  // 世界语
  { lang_code: 'ESP', lng: 23.183441, lat: 53.136259, type: ',1,2,' }
]

const countryCaptial = [{
  'country': '中国',
  'capital': '北京',
  'lng': '116.422091',
  'lat': '39.912096'
}, {
  'country': '韩国',
  'capital': '首尔',
  'lng': '126.962592',
  'lat': '37.592064'
}, {
  'country': '日本',
  'capital': '东京',
  'lng': '139.70847',
  'lat': '35.800427'
}, {
  'country': '泰国',
  'capital': '曼谷',
  'lng': '100.467035',
  'lat': '13.705803'
}, {
  'country': '马来西亚',
  'capital': '吉隆坡',
  'lng': '101.708853',
  'lat': '3.132511'
}, {
  'country': '越南',
  'capital': '河内',
  'lng': '105.710265',
  'lat': '20.962634'
}, {
  'country': '朝鲜',
  'capital': '平壤',
  'lng': '125.781716',
  'lat': '39.042371'
}, {
  'country': '印度',
  'capital': '新德里',
  'lng': '77.130064',
  'lat': '28.710809'
}, {
  'country': '文莱',
  'capital': '斯里巴加湾市',
  'lng': '114.826126',
  'lat': '4.832363'
}, {
  'country': '黎巴嫩',
  'capital': '贝鲁特',
  'lng': '35.51078',
  'lat': '33.897107'
}, {
  'country': '老挝',
  'capital': '万象',
  'lng': '102.647115',
  'lat': '17.979068'
}, {
  'country': '阿联酋',
  'capital': '阿布扎比',
  'lng': '54.666965',
  'lat': '24.3347'
}, {
  'country': '科威特',
  'capital': '科威特城',
  'lng': '47.979548',
  'lat': '29.373685'
}, {
  'country': '巴勒斯坦',
  'capital': '伊斯兰堡',
  'lng': '73.082659',
  'lat': '33.7128'
}, {
  'country': '阿曼',
  'capital': '马斯喀特',
  'lng': '58.424613',
  'lat': '23.565349'
}, {
  'country': '吉尔吉斯斯坦',
  'capital': '比什凯克',
  'lng': '74.595837',
  'lat': '42.876047'
}, {
  'country': '柬埔寨',
  'capital': '金边',
  'lng': '104.914582',
  'lat': '11.537642'
}, {
  'country': '阿塞拜疆',
  'capital': '巴库',
  'lng': '49.869942',
  'lat': '40.40682'
}, {
  'country': '缅甸',
  'capital': '内比都',
  'lng': '96.083879',
  'lat': '19.748039'
}, {
  'country': '哈萨克斯坦',
  'capital': '阿斯塔纳',
  'lng': '71.486694',
  'lat': '51.168244'
}, {
  'country': '格鲁吉亚',
  'capital': '第比利斯',
  'lng': '44.865805',
  'lat': '41.701306'
}, {
  'country': '菲律宾',
  'capital': '马尼拉',
  'lng': '121.085806',
  'lat': '14.639275'
}, {
  'country': '不丹',
  'capital': '廷布',
  'lng': '89.649425',
  'lat': '27.47902'
}, {
  'country': '巴林',
  'capital': '麦纳麦',
  'lng': '50.591964',
  'lat': '26.233152'
}, {
  'country': '巴基斯坦',
  'capital': '伊斯兰堡',
  'lng': '73.087258',
  'lat': '33.705112'
}, {
  'country': '卡塔尔',
  'capital': '多哈',
  'lng': '51.534825',
  'lat': '25.2835'
}, {
  'country': '土库曼斯坦',
  'capital': '阿什哈巴德',
  'lng': '58.424613',
  'lat': '37.972629'
}, {
  'country': '约旦',
  'capital': '安曼',
  'lng': '35.947715',
  'lat': '31.953846'
}, {
  'country': '印度尼西亚',
  'capital': '雅加达',
  'lng': '106.860096',
  'lat': '-6.212114'
}, {
  'country': '以色列',
  'capital': '特拉维夫',
  'lng': '34.816282',
  'lat': '32.094912'
}, {
  'country': '伊朗',
  'capital': '德黑兰',
  'lng': '51.447438',
  'lat': '35.706695'
}, {
  'country': '伊拉克',
  'capital': '巴格达',
  'lng': '44.382876',
  'lat': '33.315959'
}, {
  'country': '也门',
  'capital': '萨那',
  'lng': '44.2173',
  'lat': '15.368006'
}, {
  'country': '亚美尼亚',
  'capital': '埃里温',
  'lng': '44.507058',
  'lat': '40.173696'
}, {
  'country': '叙利亚',
  'capital': '大马士革',
  'lng': '36.283466',
  'lat': '33.512683'
}, {
  'country': '蒙古',
  'capital': '乌兰巴托',
  'lng': '106.933685',
  'lat': '47.916499'
}, {
  'country': '乌兹别克斯坦',
  'capital': '塔什干',
  'lng': '69.311213',
  'lat': '41.30367'
}, {
  'country': '马尔代夫',
  'capital': '马累',
  'lng': '73.524194',
  'lat': '4.172252'
}, {
  'country': '土耳其',
  'capital': '安卡拉',
  'lng': '32.866168',
  'lat': '39.929804'
}, {
  'country': '塔吉克斯坦',
  'capital': '杜尚别',
  'lng': '68.814486',
  'lat': '38.55647'
}, {
  'country': '斯里兰卡',
  'capital': '科伦坡',
  'lng': '79.926454',
  'lat': '6.983114'
}, {
  'country': '沙特阿拉伯',
  'capital': '利雅得',
  'lng': '46.700935',
  'lat': '24.709218'
}, {
  'country': '塞浦路斯',
  'capital': '尼科西亚',
  'lng': '33.390491',
  'lat': '35.183519'
}, {
  'country': '尼泊尔',
  'capital': '加德满都',
  'lng': '85.344457',
  'lat': '27.708507'
}, {
  'country': '孟加拉国',
  'capital': '达卡',
  'lng': '90.417512',
  'lat': '23.815262'
}, {
  'country': '阿富汗',
  'capital': '喀布尔',
  'lng': '69.228425',
  'lat': '34.554238'
}, {
  'country': '新加坡',
  'capital': '新加坡',
  'lng': '103.861337',
  'lat': '1.365048'
}, {
  'country': '英国',
  'capital': '伦敦',
  'lng': '-0.115586',
  'lat': '51.505323'
}, {
  'country': '意大利',
  'capital': '罗马',
  'lng': '12.492312',
  'lat': '41.918957'
}, {
  'country': '法国',
  'capital': '巴黎',
  'lng': '2.334704',
  'lat': '48.860777'
}, {
  'country': '西班牙',
  'capital': '马德里',
  'lng': '-3.697309',
  'lat': '40.431647'
}, {
  'country': '德国',
  'capital': '柏林',
  'lng': '13.409877',
  'lat': '52.520601'
}, {
  'country': '瑞士',
  'capital': '伯尔尼',
  'lng': '7.453752',
  'lat': '46.94826'
}, {
  'country': '俄罗斯',
  'capital': '莫斯科',
  'lng': '37.625319',
  'lat': '55.759256'
}, {
  'country': '瑞典',
  'capital': '斯底哥尔摩',
  'lng': '18.078191',
  'lat': '59.331728'
}, {
  'country': '比利时',
  'capital': '布鲁塞尔',
  'lng': '4.363006',
  'lat': '50.851241'
}, {
  'country': '丹麦',
  'capital': '哥本哈根',
  'lng': '12.43942',
  'lat': '55.665778'
}, {
  'country': '保加利亚',
  'capital': '索非亚',
  'lng': '23.32602',
  'lat': '42.695646'
}, {
  'country': '白俄罗斯',
  'capital': '明斯克',
  'lng': '27.571196',
  'lat': '53.903735'
}, {
  'country': '列支敦士登',
  'capital': '瓦杜兹',
  'lng': '9.561464',
  'lat': '47.164952'
}, {
  'country': '奥地利',
  'capital': '维也纳',
  'lng': '16.38104',
  'lat': '48.208628'
}, {
  'country': '捷克',
  'capital': '布拉格',
  'lng': '14.442425',
  'lat': '50.071757'
}, {
  'country': '波兰',
  'capital': '华沙',
  'lng': '21.019459',
  'lat': '52.232076'
}, {
  'country': '波黑',
  'capital': '萨拉热窝',
  'lng': '18.418584',
  'lat': '43.856078'
}, {
  'country': '安道尔',
  'capital': '安道尔城',
  'lng': '1.518037',
  'lat': '42.528643'
}, {
  'country': '爱沙尼亚',
  'capital': '塔林',
  'lng': '24.758422',
  'lat': '59.439295'
}, {
  'country': '爱尔兰',
  'capital': '都柏林',
  'lng': '-6.25942',
  'lat': '53.351031'
}, {
  'country': '梵蒂冈',
  'capital': '梵蒂冈城',
  'lng': '12.2711',
  'lat': '41.5410'
}, {
  'country': '芬兰',
  'capital': '赫尔辛基',
  'lng': '24.940095',
  'lat': '60.173776'
}, {
  'country': '荷兰',
  'capital': '阿姆斯特丹',
  'lng': '4.89624',
  'lat': '52.368394'
}, {
  'country': '冰岛',
  'capital': '雷克雅未克',
  'lng': '-21.853429',
  'lat': '64.099501'
}, {
  'country': '摩尔多瓦',
  'capital': '基希讷乌',
  'lng': '28.870218',
  'lat': '47.010726'
}, {
  'country': '匈牙利',
  'capital': '布达佩斯',
  'lng': '19.048361',
  'lat': '47.491447'
}, {
  'country': '希腊',
  'capital': '雅典',
  'lng': '23.735072',
  'lat': '37.983893'
}, {
  'country': '乌克兰',
  'capital': '基辅',
  'lng': '30.525975',
  'lat': '50.450175'
}, {
  'country': '斯洛文尼亚',
  'capital': '卢布尔雅那',
  'lng': '14.506528',
  'lat': '46.058516'
}, {
  'country': '斯洛伐克',
  'capital': '布拉迪斯拉发',
  'lng': '17.107446',
  'lat': '48.146623'
}, {
  'country': '圣马力诺',
  'capital': '圣马力诺',
  'lng': '12.462129',
  'lat': '43.944315'
}, {
  'country': '葡萄牙',
  'capital': '里斯本',
  'lng': '-9.154695',
  'lat': '38.764174'
}, {
  'country': '拉脱维亚',
  'capital': '里加',
  'lng': '24.109702',
  'lat': '56.94991'
}, {
  'country': '摩纳哥',
  'capital': '摩纳哥城',
  'lng': '7.418179',
  'lat': '43.735098'
}, {
  'country': '克罗地亚',
  'capital': '萨格勒布',
  'lng': '15.982408',
  'lat': '45.810097'
}, {
  'country': '马其顿',
  'capital': '斯科普里',
  'lng': '21.434907',
  'lat': '41.997704'
}, {
  'country': '马耳他',
  'capital': '瓦莱塔',
  'lng': '14.486478',
  'lat': '35.91533'
}, {
  'country': '罗马尼亚',
  'capital': '布加勒斯特',
  'lng': '26.103221',
  'lat': '44.422884'
}, {
  'country': '卢森堡',
  'capital': '卢森堡',
  'lng': '6.135255',
  'lat': '49.628449'
}, {
  'country': '直布罗陀(英)',
  'capital': '',
  'lng': '',
  'lat': ''
}, {
  'country': '立陶宛',
  'capital': '维尔纽斯',
  'lng': '25.282242',
  'lat': '54.686456'
}, {
  'country': '阿尔巴尼亚',
  'capital': '地拉那',
  'lng': '19.823132',
  'lat': '41.326428'
}, {
  'country': '挪威',
  'capital': '奥斯陆',
  'lng': '10.762175',
  'lat': '59.914035'
}, {
  'country': '埃及',
  'capital': '开罗',
  'lng': '31.236067',
  'lat': '30.042983'
}, {
  'country': '南非',
  'capital': '比勒陀利亚',
  'lng': '28.108527',
  'lat': '-25.653807'
}, {
  'country': '坦桑尼亚',
  'capital': '达累斯萨拉姆',
  'lng': '39.211295',
  'lat': '-6.795508'
}, {
  'country': '尼日利亚',
  'capital': '阿布贾',
  'lng': '7.402369',
  'lat': '9.06989'
}, {
  'country': '肯尼亚',
  'capital': '内罗毕',
  'lng': '36.826546',
  'lat': '-1.29416'
}, {
  'country': '加纳',
  'capital': '阿克拉',
  'lng': '-0.186516',
  'lat': '5.605599'
}, {
  'country': '喀麦隆',
  'capital': '雅温得',
  'lng': '11.509566',
  'lat': '3.845156'
}, {
  'country': '津巴布韦',
  'capital': '哈拉雷',
  'lng': '31.038296',
  'lat': '-17.826867'
}, {
  'country': '埃塞俄比亚',
  'capital': '亚的斯亚贝巴',
  'lng': '38.762861',
  'lat': '8.981868'
}, {
  'country': '毛里求斯',
  'capital': '路易港',
  'lng': '57.500795',
  'lat': '-20.161486'
}, {
  'country': '卢旺达',
  'capital': '基加利',
  'lng': '30.153214',
  'lat': '-2.014498'
}, {
  'country': '利比亚',
  'capital': '的黎波里',
  'lng': '13.193206',
  'lat': '32.883577'
}, {
  'country': '摩洛哥',
  'capital': '拉巴特',
  'lng': '-6.84375',
  'lat': '33.967316'
}, {
  'country': '塞舌尔',
  'capital': '维多利亚',
  'lng': '55.451222',
  'lat': '-4.616047'
}, {
  'country': '赞比亚',
  'capital': '卢萨卡',
  'lng': '28.323258',
  'lat': '-15.383067'
}, {
  'country': '突尼斯',
  'capital': '突尼斯',
  'lng': '10.183523',
  'lat': '36.809305'
}, {
  'country': '赤道几内亚',
  'capital': '马拉博',
  'lng': '10.266311',
  'lat': '1.649734'
}, {
  'country': '西撒哈拉',
  'capital': '阿尤恩',
  'lng': '-13.186277',
  'lat': '27.179912'
}, {
  'country': '几内亚比绍',
  'capital': '比绍',
  'lng': '-15.605463',
  'lat': '11.920939'
}, {
  'country': '吉布提',
  'capital': '吉布提市',
  'lng': '43.151479',
  'lat': '11.567124'
}, {
  'country': '刚果（布）',
  'capital': '布拉柴维尔',
  'lng': '15.24278',
  'lat': '-4.264033'
}, {
  'country': '冈比亚',
  'capital': '班珠尔',
  'lng': '-16.577645',
  'lat': '13.456081'
}, {
  'country': '佛得角',
  'capital': '普拉亚',
  'lng': '-23.48583',
  'lat': '14.934646'
}, {
  'country': '法属波里尼西亚',
  'capital': '帕皮提',
  'lng': '-149.553336',
  'lat': '-17.539724'
}, {
  'country': '利比里亚',
  'capital': '蒙罗维亚',
  'lng': '-10.7595',
  'lat': '6.290936'
}, {
  'country': '多哥',
  'capital': '洛美',
  'lng': '1.235538',
  'lat': '6.173561'
}, {
  'country': '布隆迪',
  'capital': '布琼布拉',
  'lng': '29.366729',
  'lat': '-3.355866'
}, {
  'country': '布基纳法索',
  'capital': '瓦加杜古',
  'lng': '-1.517733',
  'lat': '12.371239'
}, {
  'country': '博茨瓦纳',
  'capital': '哈博罗内',
  'lng': '25.967829',
  'lat': '-24.626469'
}, {
  'country': '贝宁',
  'capital': '波多诺伏',
  'lng': '2.638332',
  'lat': '6.500303'
}, {
  'country': '安哥拉',
  'capital': '罗安达',
  'lng': '13.288067',
  'lat': '-8.842074'
}, {
  'country': '乍得',
  'capital': '恩贾梅纳',
  'lng': '15.056507',
  'lat': '12.140245'
}, {
  'country': '厄立特里亚',
  'capital': '阿斯马拉',
  'lng': '38.928724',
  'lat': '15.328114'
}, {
  'country': '马达加斯加',
  'capital': '塔那那利佛',
  'lng': '47.507039',
  'lat': '-18.876314'
}, {
  'country': '尼日尔',
  'capital': '尼亚美',
  'lng': '2.125507',
  'lat': '13.512348'
}, {
  'country': '圣多美和普林西比',
  'capital': '圣多美',
  'lng': '6.710458',
  'lat': '0.349035'
}, {
  'country': '纳米比亚',
  'capital': '温得和克',
  'lng': '17.036516',
  'lat': '-22.553978'
}, {
  'country': '莫桑比克',
  'capital': '马普托',
  'lng': '32.609828',
  'lat': '-25.894055'
}, {
  'country': '斯威士兰',
  'capital': '姆巴巴纳',
  'lng': '31.142643',
  'lat': '-26.301058'
}, {
  'country': '毛里塔尼亚',
  'capital': '努瓦克肖特',
  'lng': '-15.954437',
  'lat': '18.071479'
}, {
  'country': '苏丹',
  'capital': '喀土穆',
  'lng': '32.563835',
  'lat': '15.506311'
}, {
  'country': '加蓬',
  'capital': '利伯维尔',
  'lng': '9.498224',
  'lat': '0.436726'
}, {
  'country': '马拉维',
  'capital': '利隆圭',
  'lng': '33.778056',
  'lat': '-13.965926'
}, {
  'country': '乌干达',
  'capital': '坎帕拉',
  'lng': '32.582232',
  'lat': '0.344115'
}, {
  'country': '中非',
  'capital': '班吉',
  'lng': '18.563492',
  'lat': '4.391586'
}, {
  'country': '苏里南',
  'capital': '帕拉马里博',
  'lng': '-55.201045',
  'lat': '5.853813'
}, {
  'country': '阿尔及利亚',
  'capital': '阿尔及尔',
  'lng': '3.061469',
  'lat': '36.757509'
}, {
  'country': '莱索托',
  'capital': '马塞卢',
  'lng': '27.513202',
  'lat': '-29.364871'
}, {
  'country': '索马里',
  'capital': '摩加迪沙',
  'lng': '45.32006',
  'lat': '2.050074'
}, {
  'country': '科特迪瓦',
  'capital': '亚穆苏克罗',
  'lng': '-5.247785',
  'lat': '6.827116'
}, {
  'country': '科摩罗',
  'capital': '莫罗尼',
  'lng': '43.275086',
  'lat': '-11.700035'
}, {
  'country': '塞内加尔',
  'capital': '达喀尔',
  'lng': '-17.364129',
  'lat': '14.764634'
}, {
  'country': '马里',
  'capital': '巴马科',
  'lng': '-8.00048',
  'lat': '12.6424'
}, {
  'country': '美国',
  'capital': '华盛顿哥伦比亚特区',
  'lng': '-77.035762',
  'lat': '38.909531'
}, {
  'country': '加拿大',
  'capital': '渥太华',
  'lng': '-75.692759',
  'lat': '45.42216'
}, {
  'country': '墨西哥',
  'capital': '墨西哥城',
  'lng': '-99.126316',
  'lat': '19.434172'
}, {
  'country': '古巴',
  'capital': '哈瓦那',
  'lng': '-82.361779',
  'lat': '23.110892'
}, {
  'country': '巴巴多斯',
  'capital': '布里奇顿',
  'lng': '-59.583626',
  'lat': '13.137358'
}, {
  'country': '巴哈马',
  'capital': '拿骚',
  'lng': '-77.357714',
  'lat': '25.05956'
}, {
  'country': '巴拿马',
  'capital': '巴拿马城',
  'lng': '-79.395215',
  'lat': '9.101036'
}, {
  'country': '伯利兹',
  'capital': '贝尔莫潘',
  'lng': '-88.757139',
  'lat': '17.255711'
}, {
  'country': '多米尼加 ',
  'capital': '圣多明各',
  'lng': '-69.932105',
  'lat': '18.484524'
}, {
  'country': '多米尼克',
  'capital': '罗索',
  'lng': '-61.368164',
  'lat': '15.349037'
}, {
  'country': '哥斯达黎加',
  'capital': '圣何塞',
  'lng': '-84.088825',
  'lat': '9.927497'
}, {
  'country': '格林纳达',
  'capital': '圣乔治',
  'lng': '-61.703914',
  'lat': '12.104037'
}, {
  'country': '格陵兰岛',
  'capital': '戈特霍布',
  'lng': '-51.408902',
  'lat': '64.141651'
}, {
  'country': '安提瓜和巴布达',
  'capital': '圣约翰',
  'lng': '-61.826371',
  'lat': '17.12114'
}, {
  'country': '洪都拉斯',
  'capital': '特古西加尔巴',
  'lng': '-87.235338',
  'lat': '14.031893'
}, {
  'country': '牙买加',
  'capital': '金斯敦',
  'lng': '-76.803496',
  'lat': '18.016478'
}, {
  'country': '尼加拉瓜',
  'capital': '马那瓜',
  'lng': '-86.234985',
  'lat': '12.113372'
}, {
  'country': '萨尔瓦多',
  'capital': '圣萨尔瓦多',
  'lng': '-89.226845',
  'lat': '13.710581'
}, {
  'country': '圣克里斯托弗和尼维斯',
  'capital': '巴斯特尔',
  'lng': '-62.734738',
  'lat': '17.325583'
}, {
  'country': '圣卢西亚',
  'capital': '卡斯特里',
  'lng': '-60.98642',
  'lat': '14.011403'
}, {
  'country': '特立尼达和多巴哥',
  'capital': '西班牙港',
  'lng': '-61.49407',
  'lat': '10.671391'
}, {
  'country': '危地马拉',
  'capital': '危地马拉城',
  'lng': '-90.504308',
  'lat': '14.637316'
}, {
  'country': '维尔京群岛和圣罗克伊',
  'capital': '夏洛特·阿马里',
  'lng': '',
  'lat': ''
}, {
  'country': '海地',
  'capital': '太子港',
  'lng': '-72.299608',
  'lat': '18.605172'
}, {
  'country': '巴西',
  'capital': '巴西利亚',
  'lng': '-47.882945',
  'lat': '-15.801011'
}, {
  'country': '阿根廷',
  'capital': '布宜诺斯艾利斯',
  'lng': '-58.383202',
  'lat': '-34.607972'
}, {
  'country': '智利',
  'capital': '圣地亚哥',
  'lng': '-70.695593',
  'lat': '-33.451496'
}, {
  'country': '乌拉圭',
  'capital': '蒙得维的亚',
  'lng': '-56.161729',
  'lat': '-34.90028'
}, {
  'country': '委内瑞拉',
  'capital': '加拉加斯',
  'lng': '-66.901151',
  'lat': '10.479965'
}, {
  'country': '秘鲁',
  'capital': '利马',
  'lng': '-77.042661',
  'lat': '-12.045753'
}, {
  'country': '圭亚那',
  'capital': '乔治敦',
  'lng': '-58.153236',
  'lat': '6.800393'
}, {
  'country': '哥伦比亚',
  'capital': '圣菲波哥大',
  'lng': '-74.071497',
  'lat': '4.704312'
}, {
  'country': '刚果(金)',
  'capital': '金沙萨',
  'lng': '15.247379',
  'lat': '-4.439485'
}, {
  'country': '法属圭亚那',
  'capital': '卡宴',
  'lng': '-52.312094',
  'lat': '4.923483'
}, {
  'country': '厄瓜多尔',
  'capital': '基多',
  'lng': '-78.461552',
  'lat': '-0.180306'
}, {
  'country': '玻利维亚',
  'capital': '苏克雷',
  'lng': '-65.256892',
  'lat': '-19.019648'
}, {
  'country': '巴拉圭',
  'capital': '亚松森',
  'lng': '-57.573721',
  'lat': '-25.300749'
}, {
  'country': '新西兰',
  'capital': '惠灵顿',
  'lng': '174.756542',
  'lat': '-41.241859'
}, {
  'country': '澳大利亚',
  'capital': '堪培拉',
  'lng': '149.161303',
  'lat': '-35.369045'
}, {
  'country': '斐济',
  'capital': '苏瓦',
  'lng': '178.454398',
  'lat': '-18.125087'
}, {
  'country': '萨摩亚',
  'capital': '阿皮亚',
  'lng': '-171.703048',
  'lat': '-13.913419'
}, {
  'country': '瓦努阿图',
  'capital': '维拉港',
  'lng': '168.331286',
  'lat': '-17.733224'
}, {
  'country': '图瓦卢',
  'capital': '富纳富提',
  'lng': '179.010917',
  'lat': '-8.516254'
}, {
  'country': '汤加',
  'capital': '努库阿洛法',
  'lng': '-175.195085',
  'lat': '-21.193326'
}, {
  'country': '所罗门群岛',
  'capital': '霍尼亚拉',
  'lng': '160.096167',
  'lat': '-9.579865'
}, {
  'country': '帕劳',
  'capital': '科罗尔',
  'lng': '134.502106',
  'lat': '7.327386'
}, {
  'country': '瑙鲁',
  'capital': '亚伦区',
  'lng': '166.858352',
  'lat': '-0.634388'
}, {
  'country': '马绍尔群岛',
  'capital': '马朱罗',
  'lng': '171.116147',
  'lat': '7.118959'
}, {
  'country': '几内亚',
  'capital': '科纳克里',
  'lng': '-13.559338',
  'lat': '9.635215'
}, {
  'country': '基里巴斯',
  'capital': '塔拉瓦',
  'lng': '172.923682',
  'lat': '1.395428'
}, {
  'country': '巴布亚新几内亚',
  'capital': '莫尔斯比港',
  'lng': '147.296247',
  'lat': '-9.472565'
}]

/* eslint-disable */
const mapStyle = [{
  "featureType": "background",
  "elementType": "geometry",
  "stylers": {
      "color": "#9fc9edff"
  }
}, {
  "featureType": "land",
  "elementType": "geometry",
  "stylers": {
      "color": "#e0effdff"
  }
}, {
  "featureType": "subway",
  "elementType": "geometry",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "highwaysign",
  "elementType": "labels",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "provincialwaysign",
  "elementType": "labels",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "vacationway",
  "elementType": "geometry",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "universityway",
  "elementType": "geometry",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "scenicspotsway",
  "elementType": "geometry",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "local",
  "elementType": "geometry",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "cityhighway",
  "elementType": "geometry",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "arterial",
  "elementType": "geometry",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "tertiaryway",
  "elementType": "geometry",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "fourlevelway",
  "elementType": "geometry",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "fourlevelway",
  "elementType": "labels",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "local",
  "elementType": "labels",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "village",
  "elementType": "labels",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "town",
  "elementType": "labels",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "district",
  "elementType": "labels",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "city",
  "elementType": "labels",
  "stylers": {
      "visibility": "on"
  }
}, {
  "featureType": "city",
  "elementType": "labels.icon",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "financelabel",
  "elementType": "labels.icon",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "financelabel",
  "elementType": "labels",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "transportationlabel",
  "elementType": "labels",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "transportationlabel",
  "elementType": "labels.icon",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "carservicelabel",
  "elementType": "labels",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "carservicelabel",
  "elementType": "labels.icon",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "lifeservicelabel",
  "elementType": "labels",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "lifeservicelabel",
  "elementType": "labels.icon",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "shoppinglabel",
  "elementType": "labels",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "shoppinglabel",
  "elementType": "labels.icon",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "hotellabel",
  "elementType": "labels",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "restaurantlabel",
  "elementType": "labels",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "restaurantlabel",
  "elementType": "labels.icon",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "hotellabel",
  "elementType": "labels.icon",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "governmentlabel",
  "elementType": "labels",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "governmentlabel",
  "elementType": "labels.icon",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "companylabel",
  "elementType": "labels",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "companylabel",
  "elementType": "labels.icon",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "businesstowerlabel",
  "elementType": "labels",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "businesstowerlabel",
  "elementType": "labels.icon",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "estatelabel",
  "elementType": "labels",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "estatelabel",
  "elementType": "labels.icon",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "entertainmentlabel",
  "elementType": "labels",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "entertainmentlabel",
  "elementType": "labels.icon",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "medicallabel",
  "elementType": "labels",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "medicallabel",
  "elementType": "labels.icon",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "educationlabel",
  "elementType": "labels",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "educationlabel",
  "elementType": "labels.icon",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "scenicspotslabel",
  "elementType": "labels",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "scenicspotslabel",
  "elementType": "labels.icon",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "airportlabel",
  "elementType": "labels",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "airportlabel",
  "elementType": "labels.icon",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "poilabel",
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
  "featureType": "transportation",
  "elementType": "labels",
  "stylers": {
      "visibility": "on"
  }
}, {
  "featureType": "transportation",
  "elementType": "geometry",
  "stylers": {
      "visibility": "on"
  }
}, {
  "featureType": "shopping",
  "elementType": "geometry",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "entertainment",
  "elementType": "geometry",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "scenicspots",
  "elementType": "geometry",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "scenicspots",
  "elementType": "labels",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "medical",
  "elementType": "geometry",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "medical",
  "elementType": "labels",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "education",
  "elementType": "labels",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "education",
  "elementType": "geometry",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "subwaystation",
  "elementType": "geometry",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "manmade",
  "elementType": "geometry",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "manmade",
  "elementType": "labels",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "building",
  "elementType": "geometry",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "green",
  "elementType": "geometry",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "water",
  "elementType": "geometry",
  "stylers": {
      "visibility": "on"
  }
}, {
  "featureType": "water",
  "elementType": "labels",
  "stylers": {
      "visibility": "on"
  }
}]
/* eslint-enable */
export default {
  courseLangMap,
  countryCaptial,
  mapStyle
}
