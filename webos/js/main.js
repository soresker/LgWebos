var downloader;
var fs;

var defaultDir = 'file://internal/';
var settingsDir = defaultDir + 'settings/setting.json';
var publishmentsDir = defaultDir + 'publishments/publishment.json';
var contentsDir = defaultDir + 'contents/';
var defaultsPort = "http://127.0.0.1:9080/file://internal/contents/"
var connection = null;

function listener(event) {
	_log("Html message coming", event.data);
	messageCheck( event.data);
}

const CreateIframeElement = (source,divId) => { 
  
	var el = document.createElement("iframe"); 

	// setting the values for the attributes. 
	el.src = source; 
	el.width = "100%"; 
	el.height = "100%"; 

	// Adding the created iframe to div as a child element 
	document.getElementById(divId).appendChild(el); 

}

const RemoveIframeElement = (divId) => { 
	// Remove the last child ( iframe element ) of div. 
	document.getElementById(divId) 
		.removeChild(document 
		.getElementById(divId).lastChild); 
} 


window.onload = function () {

	document.getElementById('iframe').setAttribute('src', 'Playing/player.html');

	WebosDevice.getNetworkInfo();
	WebosDevice.getPlatformInfo();
	WebosDevice.getNetworkMacInfo();

	startSignalSocket();

	downloader = new Downloader();
	fs = new Filesystem();
	fs.init();

	if (window.addEventListener) {
		_log("message")
		window.addEventListener('message', listener, false);
	} else if (window.attachEvent) {
		_log("onmessage")
		window.attachEvent('onmessage', listener);
	}

	_log('onload init');

	//localStorage.clear();

	StartPlayer.playerIsRegister(function (result) {

		_log('StartPlayer.playerIsRegister');

		if (result) {

		//Player is registered
		_log('player register');

		} else {
			_log('player register degil');
			 CreateIframeElement("Login/login.html","login");
			 setTimeout(() => {
				_log('webos ip:',webOsIp);
				_log('webos internet active:',isInternetActive);
			 }, 3000);
		
		}

	});

	sendHardbitSystemInfo();
/*
	setTimeout(() => {
		CreateIframeElement("Playing/player.html","play");
		setTimeout(() => {
			RemoveIframeElement("login");
		}, 3000);
	},5000);
*/
}

function messageCheck(msg) {

	 msg = JSON.parse(msg);
	 _log("Message Check:",msg);
	 _log("Message MessageType:",msg.MessageType);

    switch (msg.MessageType) {

        case commandMessage.Player_Register:
			_log("Player_Register yapacaz",msg);
			playerRegister(msg);
            break;

        case commandMessage.PlayingLog:
            break;    

        case commandMessage.PlayerReady:
            break;
           
        default:
            break;
    }
}
function download(url) {
	_log('download start:', url);
	downloader.start({
		url: url,
		path: defaultDir + contentsDir,
	}, function (error, data) {
		_log('complete', error, data)
	});
}

function listDir() {
	var path = defaultDir;
	_log('listdir path', path);
	fs.ls(path, function (error, data) {
		if (error)
			return _log('error', error);
		_log('data', data);
		return data
	})
}

function removeDir() {
	var path = defaultDir;
	_log('rmdir path', path);
	fs.rmdir(path, { recursive: true }, function (error, data) {
		if (error)
			return _log('error', error);
		_log('data', data);
	})
}

function playerRegister(data) {

	var isRegisterData = {
		playerCode: "",
		privateKey: webOsSerialNumber,
		publicKey: webOsSerialNumber,
		playerId: data.playerId,
		playerName: webOsModelName,
		customerId: data.customerId
	}
	
	WebosSettings.setValue("Customer/id", data.customerId);
	WebosSettings.setValue("PlayerSettings/playerName", isRegisterData.playerName);
	WebosSettings.setValue("PlayerSettings/playerId",data.playerId);

	sendSignal(commandMessage.Player_Register,isRegisterData);
	_log("Send Player Register:",isRegisterData);

}

function executeReceiveCommands(commands) {
	_log("executeReceiveCommands");

if (commands.command === commandMessage.Player_Register )
  {
	_log("Receive commandMessage.Player_Register ");
	 WebosSettings.setValue("PlayerSettings/status",commands.status);

      if (commands.status == true)
      {
		var isGetPublishment = {
			playerCode: "",
			privateKey: webOsSerialNumber,
			publicKey: webOsSerialNumber,
			playerId:  WebosSettings.value("PlayerSettings/playerId",""),
			playerName: webOsModelName,
			customerId: WebosSettings.value("Customer/id","")
		}
		sendSignal(commandMessage.Check_Publishment, isGetPublishment);      
      }  

  }else if (commands.command === commandMessage.Check_Publishment )
  {
	_log("commandMessage.Check_Publishment",commands.command);

      var temp = WebosSettings.value("Publishment/NewVersion","");
	  var playerStatus = WebosSettings.value("PlayerSettings/status","");

	  if(temp == "" && playerStatus == true)
	  {	
		  _log("Player ilk kez ayaga kalkiyor ve yayini indirmeli:",commands);
		  WebosSettings.setValue("Publishment/NewVersion",commands.jsonData.publishmentName);
		  WebosSettings.setValue("Publishment/OldVersion",commands.jsonData.publishmentName); 
		  fetchPublishment(commands.jsonData.publishmentData); 	
		  _log("burayageldik mi :",commands.jsonData);

	  }

      if (playerStatus == true)
      {
        _log("Publisment dosyasi indiriliyor:",commands);
		WebosSettings.setValue("Publishment/NewVersion",commands.jsonData.publishmentName);
        fetchPublishment(commands.jsonData.publishmentData);
      }else{
        _log("Devamke :)");      
      }
   
  }else if (commands.command === commandMessage.WinScreenShotRequest ){
	_log("WinScreenShotRequest");  
	//WebosDevice.screenShot();    
  }
  else if (commands.command === commandMessage.Player_Restart ){
	_log("Player_Restart");   
	//WebosDevice.deviceRestart();
  }
  else if (commands.command === commandMessage.Player_Shutdown ){
	_log("Player_Shutdown");      
	//WebosDevice.deviceShutDown();
  }
  else if (commands.command === commandMessage.Check_Upgrade ){
	_log("Check_Upgrade");    
	//WebosDevice.upgradeIpkApplication();  
  }
  else if (commands.command === commandMessage.PlayerDeleted ){
	_log("PlayerDeleted");      
	localStorage.clear();
  }
  else if (commands.command === commandMessage.HealthCheck ){
	_log("HealthCheck");      
  }
  else if (commands.command === commandMessage.AppRestart ){
	_log("AppRestart"); 
	//WebosDevice.restartApplication();    
  }
  else if (commands.command === commandMessage.PlayerSettingsHere ){
	_log("PlayerSettingsHere"); 
	//WebosDevice.setPortraitMode();      
  }
  else{
	_log("UNKNOWN Command");
  }

}

function fetchPublishment(readPublishment) {

	_log("fetchPublishment :)");      

	var Data = readPublishment;
 	var urlArray = readPublishment.urlArray;
	 urlArray.forEach((item, key) => {
	 	download(item);
	 });

	 _log("fetchPublishment download sonrasi:)");      

	 document.getElementById('iframe').contentWindow.postMessage(JSON.stringify({ "MessageType": "initPlayer", "Data": { "filePath": "http://127.0.0.1:9080/file://internal/contents/", "videoMode": "0" } }), '*');

	 document.getElementById('iframe').contentWindow.postMessage(JSON.stringify({
		"MessageType": "startPublishment",Data
	 }), "*")
	 
}

sendHardbitSystemInfo = (() => {

	  setInterval(() => {
		_log("sendHardbitSystemInfo");
		var systemInfData = {
			playerCode: "",
			privateKey: webOsSerialNumber,
			publicKey: webOsSerialNumber,
			playerId: WebosSettings.value("PlayerSettings/playerId",""),
			playerName: webOsModelName,
			customerId: WebosSettings.value("Customer/id","")

		}

		sendSignal(commandMessage.HealthCheck, systemInfData);      
	  }, 10000);
  
});

sendScreenShot = ((base64Image) => {

	  _log("sendScreenShot");
	  var playerInfo = {
		  privateKey: webOsSerialNumber,
		  publicKey: webOsSerialNumber,
		  playerId: WebosSettings.value("PlayerSettings/playerId",""),
		  customerId: WebosSettings.value("Customer/id",""),
		  base64Image: base64Image,
		  screenResolution: '400x300',
	  }

	  sendSignal(commandMessage.Win_ScreenShot, playerInfo);      

});
