/* eslint-disable */

// var _ = require("lodash");
import _ from 'lodash'

var sndLis = {};
var snd = null;

function preLoad(data) {
  var loadObject;
  var url = 'https://course-assets1.talkmate.com/course/sound_efect/' + data;
  loadObject = new Audio();
  loadObject.src = url;
  loadObject.onloadedmetadata = function () {
    //console.log("load sndEff :", url);
    var url_infos = url.split("/");
    var tmp_name = url_infos[url_infos.length - 1];
    var name_infos = tmp_name.split(".");
    var _name = name_infos[0];
    sndLis[_name] = loadObject;
  };


}


var SoundManager = {



  load: function (sndEff) {
    var list = sndEff;
    _.map(list, function (itm) {
      preLoad(itm);
    });
  },


  removeSnd: function (name) {
    if (sndLis.hasOwnProperty(name)) {
      sndLis[name] = null;
      delete sndLis[name];
    }
  },


  playSnd: function (name, playcomplete) {
    var audio = sndLis[name];
    //console.log("sndLis:", sndLis);
    if (audio) {
      this.stop();
      snd = audio;

      if (playcomplete != null) {
        snd.playcomplete = playcomplete;
        snd.addEventListener("ended", playEnded);
        //console.log("Event add to sound");
      }
      //this.snd.position = 0;
      snd.play();
    } else {
      console.log(name + ": is not exist")
    }

  },


  pause: function () {
    if (snd && !snd.ended) {
      snd.pause();
    }
  },

  stop: function () {
    if (snd && !snd.ended) {
      snd.currentTime = 0;
      snd.pause();
    }
  }
}

function playEnded(event) {
  var audio = event.currentTarget;
  //console.log("audio.cb:", audio.cb);
  if (!audio) return;
  if (audio.playcomplete) audio.playcomplete();
  if (!audio.loop) {
    audio.removeEventListener("ended", audio.playcomplete);
    audio.playcomplete = null;
    delete audio.playcomplete;
    //console.log("audio.playcomplete:", audio.playcomplete);
  }


}

export default SoundManager
