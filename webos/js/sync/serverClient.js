var socketInstance = null;
var connectedActive = false;
var masterIP = "";
var masterPort = "";
var isMaster = "";
var syncThreshold = 0.2; // Sync interval in milliseconds
var globalData = "";
var isMacAdress = "";

function webosServiceIsHere(dev_ip, dev_port, isMaster,webOsMacAdress) {

    masterIP = dev_ip;
    masterPort = dev_port;
    isMaster = isMaster;
    isMacAdress = webOsMacAdress;

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
      isMaster = "master";
      MasterTimer();
    }else{
      isMaster = "slave"
    }
    SocketStart(isMaster,masterIP,masterPort,isMacAdress);
}

function SocketStart(isMaster,masterIP,masterPort,webOsMacAdress) {

    socketInstance = new WebSocket("ws://"+(masterIP)+":"+masterPort+"?role="+(isMaster)+"&playerID="+webOsMacAdress);
    
    socketInstance.onopen = function () {

      connectedActive = true;

      if(isMaster == "master" )
      {
        console.log("Connected to  Master on the Server... :" );
      }
      else
      {
        console.log("Connected to  Slave on the Server..");
        MessageSendMaster({
          cmd: "begin",
        });
      }
    }

    socketInstance.onmessage = function (msg) {

      var m = JSON.parse(msg.data);
      console.log("Client socketInstance.onmessage: "+JSON.stringify(m));

      {
        globalData = m;
      }
      
     if (m.c === "log") {
        console.log("LOGSSSSS:::::"+m.data);

      }
      else if (m.c == 'sync_begin') {
      
      console.log("sync_begin geldi");

      console.log("VIDEO URL: "+globalVideoPath.replace("#",""));

      var syncVideo = document.getElementById(globalVideoPath.replace("#",""));

        startForSync();
        /*setTimeout(function () {
          MessageSendMaster({
            cmd: "video_set_time",
            data: {
              currentTime: syncVideo.currentTime,
              id: m.data
            }
          });
        }, 20000);*/
      
      } else if (m.c === "reconnect") {

        console.log("m.c === reconnect");
        socketInstance.close();
      } else if (m.c === "sync_video_time") {

        console.log("sync_video_time");
        console.log("isMASTER:"+isMaster);

        if(isMaster == "slave" )
        {
          console.log("BEN SLAVE VIDEO sync start");

          var syncItem = document.getElementById(globalVideoPath.replace("#",""))
          console.log('syncItem:'+JSON.stringify(syncItem));

          var currentItemTime = syncItem.currentTime;
          var receivedTime = m.data.currentTime;

          console.log('currentItemTime:'+currentItemTime);
          console.log('timeDifference:'+receivedTime);

          var timeDifference = Math.abs(receivedTime - currentItemTime);

          console.log('timeDifference:'+timeDifference);

          if (timeDifference > 1.1) {
            syncItem.currentTime = receivedTime+1;
            return;
          }

          if (timeDifference > syncThreshold) {
            console.log('Time difference is greater than 500 ms. Syncing video...');
            syncItem.currentTime = receivedTime;

        }else{
          console.log("BEN MASTERIM VIDEO sync bana uymaz kardas git slave yapsin");
        }
 
      }

    }
    };

    socketInstance.onerror = function () {
      console.log("Disconnected socketInstance.onerror");

      socketInstance.close();
      setTimeout(function() {
        SocketStart(isMaster,masterIP,masterPort,isMacAdress);
      }, 10000);
      
    };

  }

function MessageSendSlave(m) {

  console.log("MessageSendSlave:"+JSON.stringify(m));
  console.log("Socket Instance Slave Null ? :" + socketInstance);
  socketInstance.send(JSON.stringify(m));
    
}

function MessageSendMaster(m) {
  console.log("MessageSendMaster:"+JSON.stringify(m));
  console.log("Socket Instance Master Null ? :" + socketInstance);
  socketInstance.send(JSON.stringify(m));

}

function MasterTimer() {
  
  console.log("**************MASTER************isMaster:"+isMaster);
  console.log("**************MASTER************globalData:"+globalData);

  setInterval(() => {
   
    console.log("**************MASTER************ NEW TIME GONDERIYOR");
    var syncVideo = document.getElementById(globalVideoPath.replace("#",""));

      MessageSendMaster({
        cmd: "video_set_time",
        data: {
          currentTime: syncVideo.currentTime,
          //id: globalData.data
        }
      });
    
  }, 7000);

}
