/* eslint-disable */
var audio = new Audio();
var endedHandler = null;
var loadHandler = null
var sndLoaded = false;
var curTime = 0;
var interval_sndLoaded;

audio.onloadedmetadata = function () {
  sndLoaded = true;
  loaded();
};

audio.addEventListener("ended", ended, false);

function getDuration() {
  return audio.duration;
}

function loaded () {
  if (loadHandler) {
    loadHandler();
  }
}

function ended(e) {
  if (endedHandler) {
    endedHandler();
  }
}

function play(cb) {
  if (!sndLoaded) {
    clearInterval(interval_sndLoaded);
    interval_sndLoaded = setInterval(function () {
      if (sndLoaded) {
        clearInterval(interval_sndLoaded);
        audio.play();
        endedHandler = cb;
      }
    }, 100);
  } else {
    audio.play();
    endedHandler = cb;
  }



}

function pause() {
  audio.pause();
}

function stop() {
  if (!audio || audio.readyState != 4) return;
  audio.pause();
  audio.currentTime = 0;

}

function setSnd(curaudio) {
  sndLoaded = false;
  audio.setAttribute("src", curaudio);

}

function setSndCallback(curaudio, cb) {
  sndLoaded = false;
  audio.setAttribute("src", curaudio);
  loadHandler = cb;
}

function setVolume (val = 0.5) {
  audio.volume = val;
}

function setCurrentTime (time) {
  audio.currentTime = time;
}


export default {
  Audio: audio,
  getDuration: getDuration,
  setSndCallback: setSndCallback,
  play: play,
  pause: pause,
  stop: stop,
  setSnd: setSnd,
  setVolume: setVolume,
  setCurrentTime: setCurrentTime
};
