/* eslint-disable */
import common from './common'
import Cookie from 'js-cookie'


var Loader = function (array, loader) {
  return common.webpHack(array).each(null, function (cont, data) {
    if (loader) {
      loader.$emit("reset");
      loader.$emit("init4DelayShow", array.length);
      data.loader = loader;
    }
    perLoad(data, cont);
  })
}

function perLoad(data, cb) {
  var loadObject;

  // 保证测评和学习系统公用loader
  var assetsApi = Cookie.get('assetsApi')
  if (data.url && !(data.url.indexOf('http') > -1)) {
    data.url = assetsApi + data.url;
  }
  if (/mp3/i.test(data.url || data)) {
    loadObject = new Audio();
    loadObject.src = data.url || data;
    loadObject.onloadedmetadata = function () {
      if (data.loader) {
        data.loader.$emit("addProcess", data.url);
        delete data.loader;
      }
      cb(null, data);
    };
  } else {
    loadObject = new Image();
    loadObject.src = data.url || data;
    loadObject.onload = function () {
      if (data.loader) {
        data.loader.$emit("addProcess", data.url);
        delete data.loader;
      }
      cb(null, data);
    };

  }

}

export default Loader
