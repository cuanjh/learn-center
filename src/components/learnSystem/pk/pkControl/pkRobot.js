/* eslint-disable */
import EventEmitter from 'EventEmitter'
var $event      = new EventEmitter();

var progress        = [];
var delay_time      = 1000;
var interval_Id     = null;
var time            = 0;
var userPKOver      = false;
var robotPKOver     = false;
var currentProgress = null;
var index;

$event.on("pk_break", function () {
    pkRobot.break();
})

$event.on("pk_over", function () {
    userPKOver = true;
    pkRobot.checkOver();
})

$event.on("pk_robot_start", function (progress) {
    if(!progress) return;
    pkRobot.getProgress(progress);
    pkRobot.start();
})

var pkRobot = {

    getProgress: function (data) {
        progress = data;
    },

    start: function () {
        this.break();
        var _this = this;
        interval_Id = setInterval(function () {

            time++;

            if (progress && progress.length) {
                var itm = progress[0];
                //更新挑战者进度
                itm.time = parseInt(itm.time)
                if (time == itm.time) {
                    currentProgress = progress.shift();
                    currentProgress.score = parseInt(currentProgress.score )
                    currentProgress.index = index;
                    index++;
                    $event.trigger("pk_player_getProgress", [currentProgress]);
                }
            } else {
                $event.trigger("pk_player_finish");
                clearInterval(interval_Id);
                robotPKOver = true;
                _this.checkOver();
            }

        }, delay_time);

    },

    break: function () {
        clearInterval(interval_Id);
        interval_Id = null;
        time = 0;
        userPKOver = false;
        robotPKOver = false;
        index = 0;
    },

    checkOver: function () {
        if (robotPKOver && userPKOver) {
            $event.trigger("pk_finish", [currentProgress]);
            this.break();
        }
    }

};

export default pkRobot;
