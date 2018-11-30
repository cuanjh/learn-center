/**
 * 1:官方课程
 * 2:安全语言
 * 3:濒危语言
 * 4:一带一路语言
 * 5:语伴
 */
const courseLangMap = [
  // 欧洲
  { lang_code: 'SER', lon: 20.479038, lat: 44.781025, type: ',1,2,' },
  { lang_code: 'ENG', lon: -0.052345, lat: 51.51444, type: ',1,2,' },
  { lang_code: 'FRE', lon: 2.376098, lat: 48.845377, type: ',1,2,' },
  { lang_code: 'GER', lon: 13.414476, lat: 52.535823, type: ',1,2,' },
  { lang_code: 'SPA', lon: -3.672588, lat: 40.379965, type: ',1,2,' },
  { lang_code: 'RUS', lon: 37.667863, lat: 55.766521, type: ',1,2,' },
  { lang_code: 'FIN', lon: 25.010522, lat: 60.154508, type: ',1,2,' },
  { lang_code: 'ALB', lon: 19.827084, lat: 41.32166, type: ',1,2,' },
  { lang_code: 'UKR', lon: 30.575705, lat: 50.451919, type: ',1,2,' },
  { lang_code: 'DUT', lon: 4.929873, lat: 52.372881, type: ',1,2,' },
  { lang_code: 'DAN', lon: 12.472765, lat: 55.664316, type: ',1,2,' },
  { lang_code: 'POL', lon: 21.045905, lat: 52.226251, type: ',1,2,' },
  { lang_code: 'POR', lon: -9.125662, lat: 38.762711, type: ',1,2,' },
  { lang_code: 'SWE', lon: 18.08394, lat: 59.325705, type: ',1,2,' },
  { lang_code: 'SLO', lon: 17.113483, lat: 48.145373, type: ',1,2,' },
  { lang_code: 'ITA', lon: 12.477364, lat: 43.932994, type: ',1,2,' },
  { lang_code: 'RUM', lon: 26.109761, lat: 44.409698, type: ',1,2,' },
  { lang_code: 'ICE', lon: -21.833595, lat: 64.101701, type: ',1,2,' },
  { lang_code: 'HRV', lon: 15.991248, lat: 45.803663, type: ',1,2,' },
  { lang_code: 'GRE', lon: 23.73651, lat: 37.969671, type: ',1,2,' },
  { lang_code: 'HUN', lon: 19.063596, lat: 47.488622, type: ',1,2,' },
  { lang_code: 'EST', lon: 24.766758, lat: 59.42194, type: ',1,2,' },
  { lang_code: 'NOR', lon: 10.80321, lat: 59.896709, type: ',1,2,' },
  { lang_code: 'LAT', lon: 14.786225, lat: 40.670002, type: ',1,2,' },
  { lang_code: 'CZE', lon: 14.473471, lat: 50.065651, type: ',1,2,' },
  { lang_code: 'BUL', lon: 23.32257, lat: 42.690344, type: ',1,2,' },
  { lang_code: 'LIT', lon: 25.291081, lat: 54.682459, type: ',1,2,' },
  { lang_code: 'LAV', lon: 24.113654, lat: 56.950224, type: ',1,2,' },
  { lang_code: 'MON', lon: 19.261367, lat: 42.428524, type: ',1,2,' },
  { lang_code: 'BOS', lon: 18.419691, lat: 43.856494, type: ',1,2,' },
  { lang_code: 'FRA', lon: 7.698666, lat: 45.06535, type: ',1,2,' },
  { lang_code: 'MAC', lon: 21.436848, lat: 41.994272, type: ',1,2,' },
  // 东亚
  { lang_code: 'CHI', lon: 116.439339, lat: 39.955211, type: ',1,2,' },
  { lang_code: 'KOR', lon: 127.036182, lat: 37.593625, type: ',1,2,' },
  { lang_code: 'JPN', lon: 139.767111, lat: 35.756111, type: ',1,2,' },
  { lang_code: 'CAN', lon: 113.575109, lat: 22.851907, type: ',1,2,' },
  { lang_code: 'UYG', lon: 87.653318, lat: 43.829862, type: ',1,2,' },
  { lang_code: 'TIB', lon: 91.148805, lat: 29.664091, type: ',1,2,' },
  { lang_code: 'MOG', lon: 111.790572, lat: 40.883288, type: ',1,2,' },
  { lang_code: 'HYE', lon: 44.502458, lat: 40.174357, type: ',1,2,' },
  // 中东
  { lang_code: 'ARA', lon: 46.719333, lat: 24.719938, type: ',1,2,' },
  { lang_code: 'TUR', lon: 32.861569, lat: 39.926927, type: ',1,2,' },
  { lang_code: 'FAR', lon: 51.387647, lat: 35.703647, type: ',1,2,' },
  { lang_code: 'HEB', lon: 35.296911, lat: 31.781871, type: ',1,2,' },
  { lang_code: 'PUS', lon: 69.239924, lat: 34.528309, type: ',1,2,' },
  { lang_code: 'UZB', lon: 69.249122, lat: 41.307789, type: ',1,2,' },
  { lang_code: 'GLG', lon: 44.835909, lat: 41.708846, type: ',1,2,' },
  { lang_code: 'AZE', lon: 49.876769, lat: 40.406819, type: ',1,2,' },
  // 东南亚
  { lang_code: 'FIL', lon: 121.044412, lat: 14.592477, type: ',1,2,' },
  { lang_code: 'SUN', lon: 106.841124, lat: -6.206072, type: ',1,2,' },
  { lang_code: 'THA', lon: 100.50613, lat: 13.706646, type: ',1,2,' },
  { lang_code: 'VIE', lon: 105.730962, lat: 20.946161, type: ',1,2,' },
  { lang_code: 'LAO', lon: 102.677011, lat: 18.015103, type: ',1,2,' },
  { lang_code: 'IND', lon: 114.819227, lat: 4.842456, type: ',1,2,' },
  { lang_code: 'BUR', lon: 96.124698, lat: 19.766819, type: ',1,2,' },
  { lang_code: 'MAY', lon: 101.699079, lat: 3.133956, type: ',1,2,' },
  { lang_code: 'KHM', lon: 104.872901, lat: 11.554368, type: ',1,2,' },
  { lang_code: 'TET', lon: 125.56986, lat: -8.55689, type: ',1,2,' },
  { lang_code: 'JAV', lon: 112.746944, lat: -7.266533, type: ',1,2,' },
  { lang_code: 'AMB', lon: 128.191474, lat: -3.708852, type: ',1,2,' },
  // 南亚
  { lang_code: 'MAL', lon: 77.148462, lat: 28.715625, type: ',1,2,' },
  { lang_code: 'NEP', lon: 85.353656, lat: 27.721555, type: ',1,2,' },
  { lang_code: 'MAR', lon: 72.836595, lat: 18.97316, type: ',1,2,' },
  { lang_code: 'TAM', lon: 80.273703, lat: 13.086639, type: ',1,2,' },
  { lang_code: 'BEN', lon: 90.415212, lat: 23.808914, type: ',1,2,' },
  { lang_code: 'PUN', lon: 76.778216, lat: 30.736057, type: ',1,2,' },
  { lang_code: 'SIN', lon: 79.967847, lat: 6.999199, type: ',1,2,' },
  { lang_code: 'URD', lon: 73.087258, lat: 33.714722, type: ',1,2,' },
  { lang_code: 'TEL', lon: 78.500663, lat: 17.386043, type: ',1,2,' },
  { lang_code: 'HIN', lon: 77.15766, lat: 28.725001, type: ',1,2,' },
  { lang_code: 'SND', lon: 67.28866, lat: 25.066891, type: ',1,2,' },
  { lang_code: 'GUJ', lon: 72.568685, lat: 23.026837, type: ',1,2,' },
  { lang_code: 'KAS', lon: 73.886391, lat: 33.980489, type: ',1,2,' },
  { lang_code: 'KAN', lon: 77.611844, lat: 12.956976, type: ',1,2,' },
  // 中亚
  { lang_code: 'TGK', lon: 68.777692, lat: 38.549924, type: ',1,2,' },
  { lang_code: 'KAZ', lon: 71.475195, lat: 51.140765, type: ',1,2,' },
  { lang_code: 'TUK', lon: 58.37632, lat: 37.938031, type: ',1,2,' },
  // 非洲
  { lang_code: 'SOM', lon: 45.394727, lat: 2.010977, type: ',1,2,' },
  { lang_code: 'SWA', lon: 36.839697, lat: -1.312678, type: ',1,2,' },
  { lang_code: 'FAN', lon: 9.501314, lat: 0.423702, type: ',1,2,' },
  { lang_code: 'LUG', lon: 32.617517, lat: 0.349613, type: ',1,2,' },
  { lang_code: 'YOR', lon: 7.431618, lat: 9.072176, type: ',1,2,' },
  { lang_code: 'KIN', lon: 30.14998, lat: -2.023175, type: ',1,2,' },
  { lang_code: 'RUN', lon: 29.368095, lat: -3.364534, type: ',1,2,' },
  { lang_code: 'SAG', lon: 57.502736, lat: -20.160128, type: ',1,2,' },
  { lang_code: 'MRD', lon: -6.814501, lat: 33.952704, type: ',1,2,' },
  // 世界语
  { lang_code: 'ESP', lon: 23.183441, lat: 53.136259, type: ',1,2,' }
]

export default {
  courseLangMap
}
