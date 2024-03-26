var socketInstance = null;
var connectedActive = false;
var masterIP = "";
var masterPort = "";
var isMaster = "";
var syncInterval = 500; // Sync interval in milliseconds
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
        MessageSendSlave({
          c: "begin",
        });
      }
    }

    socketInstance.onmessage = function (msg) {

      var m = JSON.parse(msg.data);
      console.log("Client socketInstance.onmessage: "+JSON.stringify(m));

      if(isMaster == "slave" )
      {
        globalData = m;
      }
      
      if (m.c === 'sync_begin') {
        console.log("m.c === sync_begin");

       if(isMaster == "master" )
      {
      var syncVideo = document.getElementById(globalVideoPath.replace("#",""));

        setTimeout(function () {
          MessageSendMaster({
            cmd: "video_set_time",
            data: {
              currentTime: syncVideo.currentTime,
              id: globalData.data
            }
          });
        }, 250);
      }
      } else if (m.c === "reconnect") {

        console.log("m.c === reconnect");
        socketInstance.close();

      } else if (m.c === "sync_video_time") {

        console.log("sync_video_time");
        console.log("isMASTER:"+isMaster);

        if(isMaster == "slave" )
        {
          var syncItem = document.getElementById(globalVideoPath.replace("#",""))
          var currentItemTime = syncItem.currentTime;
          var receivedTime = m.data.currentTime;
          var timeDifference = Math.abs(receivedTime - currentItemTime);
          if (timeDifference > syncThreshold) {
            console.log('Time difference is greater than 500 ms. Syncing video...');
            syncItem.currentTime = receivedTime;
        }
 
      }

    } else if (m.c === "master_disconnect") {
      console.log("master_disconnect");
        setTimeout(function () {
          SocketStart(isMaster,masterIP,masterPort,isMacAdress);
        }, 8000);
      }
    };

    socketInstance.onerror = function () {
      console.log("Disconnected socketInstance.onerror");

      socketInstance.close();
      setTimeout(function() {
        SocketStart(isMaster,masterIP,masterPort,isMacAdress);
      }, 10000);
    };

    socketInstance.onclose = function () {
      console.log("Disconnected Server... ", "error");
      connectedActive = false;
      setTimeout(function() {
        SocketStart(isMaster,masterIP,masterPort,isMacAdress);
      }, 5000);
    };

  }

function MessageSendSlave(m) {

  console.log("MessageSendSlave:"+JSON.stringify(m));
  socketInstance.send(JSON.stringify(m));
    
}

function MessageSendMaster(m) {
  console.log("MessageSendMaster:"+JSON.stringify(m));

  socketInstance.send(JSON.stringify(m));

}

function MasterTimer() {
  
  console.log("**************MASTER************ NEW TIME GONDERECEK isMaster"+isMaster);

  setInterval(() => {
   
    console.log("**************MASTER************ NEW TIME GONDERIYOR");
    var syncVideo = document.getElementById(globalVideoPath.replace("#",""));

      setTimeout(function () {
        MessageSendMaster({
          cmd: "video_set_time",
          data: {
            currentTime: syncVideo.currentTime,
            id: globalData.data
          }
        });
      }, 250);
    
  }, 15000);

}
