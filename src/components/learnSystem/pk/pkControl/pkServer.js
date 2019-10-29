/* eslint-disable */
import EventEmitter from 'EventEmitter'
var $event      = new EventEmitter();
var server      = null;
var data_pkOver = null;

$event.on("pk_ready", function (slideId) {
    if (server && server.OPEN) server.close();
    console.log("slideId:", slideId);
    server = createServer(Config.URL.pkWaitServer, {
        type: 2,
        data: slideId
    });
})

$event.on("pk_player_setProgress", function ($index, $score) {
    //console.log("server:", server);
    if (!server || server.readyState == 3) return;
    server.send(JSON.stringify({
        type: 6,
        data: JSON.stringify({
            score: $score,
            index: $index,
            userId: Config.userData.userID,
            type: "pk_progress"
        })
    }))
})

$event.on("pk_over", function ($time) {

    //console.log("pk_over:", $time);
    var myPkOver = {
        time: $time,
        userId: Config.userData.userID,
        type: "pk_over"
    }
    if (!server || server.readyState == 3) return;
    //先广播自己结束
    server.send(JSON.stringify({
        type: 6,
        data: JSON.stringify(myPkOver)
    }))

    //告诉服务器结束
    server.send(JSON.stringify({
        type: 7,
        data: JSON.stringify({
            userId: Config.userData.userID
        })
    }))

})

$event.on("pk_break", function () {
    console.log("pk break!!!!!!");
    if (server) server.close();
})


function createServer(gw, data) {

    var ws = new WebSocket(gw); //8070 进房间 //8071pk
    ws.onopen = function () {

        console.log("connected:", ws.url);
        ws.send(JSON.stringify(data));

    };

    ws.onmessage = function (evt) {
        var data = JSON.parse(evt.data);
        switch (data.type) {
        case 2:
            console.log("enter room ......", evt.data);
            evt.target.close();
            var ws = "ws://" + data.ip + ":" + 8071;
            //进入房间
            server = createServer(ws, {
                type: 3,
                userId: Config.userData.userID,
                roomId: data.id,
                userDetial: JSON.stringify({
                    userName: Config.userData.userName,
                    userID: Config.userData.userID,
                    photoURL: Config.userData.photoURL
                })
            });
            break;
        case 4: //挑战者进入
            //console.log("challenger enter room!!!!!!", data);
            data = JSON.parse(data.userDetial);
            $event.trigger("pk_player_enter", [data]);

            /*ws.send(JSON.stringify({
                type: 6,
                data: JSON.stringify({
                    cur: 1
                })
            }))*/
            break;
        case 5: //挑战者离开
            console.log("challenger leave!!!!!!", data);
            data = JSON.parse(data.userDetial);
            $event.trigger("pk_player_leave", [data]);
            break;
        case 6: //挑战者更新了进度
            //console.log("challenger update progress:", data);
            data = JSON.parse(data.data);
            switch (data.type) {
            case "pk_progress":
                $event.trigger("pk_player_getProgress", [data]);
                break;
            case "pk_over":
                data_pkOver = data;
                //对方完成
                $event.trigger("pk_player_finish", [data]);
                /*server.send(JSON.stringify({
                    type: 7,
                    data: JSON.stringify({
                        userId: data.userId
                    })
                }))*/
                break;
            default:
                break;
            }
            break;
        case 7: //pk总结
            console.log("pk finish!!!");

            //console.log("data_pkOver:", data_pkOver);
            $event.trigger("pk_finish", [data_pkOver]);
            server.close();
            break;
        }

        //ws.close();
    };

    ws.onclose = function (evt) {
        console.log("closed:", evt.target.url);
    };

    ws.onerror = function (evt) {
        console.log("WebSocketError:", evt);
    };

    return ws;
}
