var sock = null;
var WAITING_MASTER_DURATION = 10000;
var WAITING_MASTER_COUNT = 60;
var networkErrorCnt = 0;
var _connected = false;
var masterIP = "";
var masterPort = "";
var isMaster = "";
var tickControlHandle = null;

function webosServiceIsHere(_ip, _port, isMaster) {

    masterIP = _ip;
    masterPort = _port;
    isMaster = isMaster;

    if (isMaster == "true") {
      webOS.service.request('luna://com.lg.app.signage.server', {
        method: 'serverOn',
        parameters: {},
        onSuccess: function onSuccess(ret) {
          console.log(ret);
        },
        onFailure: function onFailure(err) {
          console.log(err);
        },
        subscribe: true
      });
    }

    if(isMaster == "true" )
    {
      isMaster = "master"
    }else{
      isMaster = "slave"
    }
    wsConnect(isMaster,masterIP,masterPort);
}

function wsConnect(isMaster,masterIP,masterPort) {
    var that = this;
    that.sock = new WebSocket("ws://"+(masterIP)+":"+masterPort+"?role="+(isMaster)+"&playerID="+masterIP);
    //${that.isMaster?"localhost":that.masterIP}
    that.sock.onopen = function () {
      that.networkErrorCnt = 0;
      that._connected = true;
      console.log("Connected to Synchronous Master Server... ", "success");
     // PLAYER.stopTick();
      if (!that.isMaster) {
        that.tickControlHandle = setTimeout(function () {
          that.sock.close();
         // PLAYER.smartTVApi.apiRestart();
        }, 30000);
      }
    };
    that.sock.onmessage = function (msg) {
      var m = JSON.parse(msg.data);
      console.log(m);
      if (m.c === 'sync_tick') {
        /*
        if (PLAYER._workerTick != null) PLAYER.stopTick();
        clearTimeout(that.tickControlHandle);
        PLAYER.onWorkerTickMessage({
          data: m.data
        });
        */
      } else if (m.c === 'sync_begin') {
        /*PLAYER.stop(function () {
          PLAYER.play();
        });*/
      } else if (m.c === 'sync_comp_adjusment') {
        console.log(m.data);
        /*
        PLAYER.COMPS.slice(1).forEach(function (v) {
          var it = m.data.find(function (x) {
            return x.id == v.id;
          });
          if (it) {
            if (it.hasOwnProperty("cpPLIndex")) v.cpPLIndex = it.cpPLIndex;
            if (it.hasOwnProperty("currentTime")) v.currentTime = it.currentTime;
            if (it.hasOwnProperty("durationOver")) v.durationOver = it.durationOver;
            if (it.isItAppear) {
              v.show();
              if (v.className == TVIDEO_) {
                v.element.load();
                v.element.play();
                v.element.currentTime = Math.round(it.videoCurrentTime);
              }
            } else v.hide();
          }
        });*/
      } else if (m.c === 'sync_adjust') {
        /*
        PLAYER.stopTick();
        that.sendMaster({
          cmd: "comp_adjustment",
          data: PLAYER.COMPS.slice(1).map(function (x) {
            var r = {
              id: x.id,
              isItAppear: x.isItAppear
            };
            if (x.hasOwnProperty("cpPLIndex")) r.cpPLIndex = x.cpPLIndex;
            if (x.hasOwnProperty("currentTime")) r.currentTime = x.currentTime;
            if (x.hasOwnProperty("durationOver")) r.durationOver = x.durationOver;
            if (x.hasOwnProperty("newsIndex")) r.newsIndex = x.newsIndex;
            if (x.hasOwnProperty("newsduration")) r.newsduration = x.newsduration;
            if (x.hasOwnProperty("shownTotal")) r.shownTotal = x.shownTotal;
            if (x.hasOwnProperty(LAST_NEWS_SHOW_ID)) r[LAST_NEWS_SHOW_ID] = x[LAST_NEWS_SHOW_ID];
            if (x.className == TVIDEO_) r.videoCurrentTime = x.element.currentTime;
            return r;
          })
        });
        if (!PLAYER.syncMasterBeginHandle) {
          setTimeout(function () {
            PLAYER.startTick();
          }, 500);
        }*/
      } else if (m.c === 'video_play') {
        var videoItem = document.getElementById(m.data);
        videoItem.play();
        if (that.isMaster) {
          setTimeout(function () {
            that.sendMaster({
              cmd: "video_set_time",
              data: {
                currentTime: videoItem.currentTime,
                id: m.data
              }
            });
          }, 1000);
        }
      } else if (m.c === "reconnect") {
        that.sock.close();
        //PLAYER.smartTVApi.apiRestart();
      } else if (m.c === "sync_video_time") {
        var _videoItem = document.getElementById(m.data.id);
        _videoItem.currentTime = Math.round(m.data.currentTime);
      } else if (m.c === "master_disconnect") {
        //PLAYER.stopTick();
        setTimeout(function () {
          //PLAYER.startTick();
        }, 500);
      } else if (m.c === "client_list") {
        /*PLAYER.sendMessage({
          cmd: "log",
          data: m.data
        });*/
        console.log(m.data);
      }
    };
    that.sock.onerror = function () {
      that.sock.close();
    };
    that.sock.onclose = function () {
      console.log("Disconnected to Synchronous Master Server... ", "error");
      that._connected = false;
      if (that.networkErrorCnt == 0) {
       /* PLAYER.stopTick();
        setTimeout(function () {
          PLAYER.startTick();
        }, 500);*/
      }
      if (++that.networkErrorCnt <= that.WAITING_MASTER_COUNT) {
        setTimeout(function () {
            wsConnect(isMaster,masterIP,masterPort);
        }, that.WAITING_MASTER_DURATION);
      } else console.log("Network Error for Sync Content");
    };
  }