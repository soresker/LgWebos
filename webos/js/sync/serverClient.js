var socketInstance = null;
var connectedActive = false;
var masterIP = "";
var masterPort = "";
var isMaster = "";
var syncInterval = 500; // Sync interval in milliseconds

function webosServiceIsHere(dev_ip, dev_port, isMaster) {

    masterIP = dev_ip;
    masterPort = dev_port;
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
    SocketStart(isMaster,masterIP,masterPort);
}

function SocketStart(isMaster,masterIP,masterPort) {

    socketInstance = new WebSocket("ws://"+(masterIP)+":"+masterPort+"?role="+(isMaster)+"&playerID="+masterIP);
    
    socketInstance.onopen = function () {

      connectedActive = true;
      
      if(isMaster == "master" )
      {
        console.log("Connected to  Master on the Server... ");
        MessageSendMaster({
          c: "begin",
        });
      }
      else
      {
        console.log("Connected to  Slave on the Server..");
      }
    }

    socketInstance.onmessage = function (msg) {
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
        startForSync();
      } else if (m.c === 'video_play') {
        var syncVideo = document.getElementById(globalVideoPath.replace("#",""));

        if (isMaster == "master") {
          setTimeout(function () {
            MessageSendMaster({
              cmd: "video_set_time",
              data: {
                currentTime: syncVideo.currentTime,
                id: m.data
              }
            });
          }, 250);
        }
      } else if (m.c === "reconnect") {
        socketInstance.close();
      } else if (m.c === "sync_video_time") {
        console.log("sync_video_time");
        var syncItem = document.getElementById(globalVideoPath.replace("#",""))
        var currentItemTime = syncItem.currentTime;
        var receivedTime = m.data.currentTime;
        var timeDifference = Math.abs(receivedTime - currentItemTime);
        if (timeDifference > syncThreshold) {
          console.log('Time difference is greater than 500 ms. Syncing video...');
          syncItem.currentTime = receivedTime;
      }

    } else if (m.c === "master_disconnect") {
      console.log("master_disconnect");
        setTimeout(function () {
          SocketStart(isMaster,masterIP,masterPort);
        }, 500);
      } else if (m.c === "client_list") {
        /*PLAYER.sendMessage({
          cmd: "log",
          data: m.data
        });*/
        console.log(m.data);
      }
    };
    socketInstance.onerror = function () {
      socketInstance.close();
      SocketStart(isMaster,masterIP,masterPort);
    };
    socketInstance.onclose = function () {
      console.log("Disconnected Server... ", "error");
      connectedActive = false;
      SocketStart(isMaster,masterIP,masterPort);
    };
  }

function MessageSendSlave(m) {

  socketInstance.send(JSON.stringify(m));
    
}

function MessageSendMaster(m) {
  socketInstance.send(JSON.stringify(m));   
}
