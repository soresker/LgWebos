var downloader;
var fs;

var defaultDir = 'file://internal/';
var settingsDir = defaultDir + 'settings/setting.json';
var publishmentsDir = defaultDir + 'publishments/publishment.json';
var contentsDir = defaultDir + 'contents/';
var defaultsPort = "http://127.0.0.1:9080/file://internal/contents/"
var connection = null;

var jsonData = {
	"MessageType": "startPublishment",
	"Data": {
		"calendar": {
			"templates": [
				{
					"days": "1111111",
					"templateUniqId": "842f1d0c4bb44dddbeb94a21a2e03ca",
					"endDate": "2023-11-11",
					"endTime": "23:59:00",
					"startDate": "2023-02-01",
					"startTime": "00:00:00",
					"id": 1
				}
			]
		},
		"urlArray": [
			"https://cdn.jsdelivr.net/gh/belaviyo/download-with/samples/sample.png",
			"https://cdn.jsdelivr.net/gh/belaviyo/download-with/samples/sample.mp4"
		],
		"templates": [
			{
				"duration": 86400,
				"templateUniqId": "842f1d0c4bb44dddbeb94a21a2e03ca",
				"width": 1920,
				"height": 1080,
				"x": 0,
				"y": 0,
				"z": 1,
				"name": "template1",
				"id": 9,
				"frames": [
					{
						"frameUniqId": "7842f1d0c4bb44dddbeb94a21a2e03ca",
						"width": 1920,
						"height": 1080,
						"x": 0,
						"y": 0,
						"z": 5,
						"name": "frame1",
						"id": 2,
						"playlists": [
							{
								"contents": [
									{
										"contentProperties": [
											{
												"name": "filename",
												"value": "sample.png"
											},
											{
												"name": "animation",
												"value": "none"
											},
											{
												"name": "displayoption",
												"value": "fit"
											}
										],
										"duration": 15,
										"expireDate": "",
										"startDate": "",
										"startTime": "00:00:00",
										"endTime": "23:59:59",
										"days": "1111111",
										"contentUniqId": "sample",
										"width": 1920,
										"height": 1080,
										"name": "image 02",
										"type": "image",
										"id": 4
									},
									{
										"contentProperties": [
											{
												"name": "seekstart",
												"value": "0"
											},
											{
												"name": "seekend",
												"value": "0"
											},
											{
												"name": "loop",
												"value": "true"
											},
											{
												"name": "filename",
												"value": "sample.mp4"
											},
											{
												"name": "volume",
												"value": "5"
											},
											{
												"name": "animation",
												"value": ""
											},
											{
												"name": "displayption",
												"value": "fit"
											}
										],
										"days": "1111111",
										"duration": 47,
										"expireDate": "",
										"startDate": "",
										"startTime": "00:00:00",
										"endTime": "23:59:59",
										"contentUniqId": "sample",
										"name": "video amqq",
										"width": 1920,
										"height": 1080,
										"type": "video",
										"id": 5
									}
								],
								"duration": 57,
								"playlistUniqId": "c6c66a3c57dc4f25b806cf37d05896fb",
								"name": "background",
								"id": 3
							}
						]
					}
				],
				"triggertemplates": [],
				"version": "84f5e5be0c0ef1ba"
			}
		]
	}
};

function listener(event) {
	_log("Socket message coming", event.data);
	messageCheck( event.data);
	/*
	sendSignal("playerRegister", {
		playerCode: '',
		privateKey: '0d:a7:40:cb:d0',
		publicKey: 'c4580-84f4-11ed-b092-15041eae1600',
		playerId: '7',
		playerName: '3',
		customerId: '1'
	})*/
}

const CreateIframeElement = (source,divId) => { 
  
	var el = document.createElement("iframe"); 

	// setting the values for the attributes. 
	el.src = source; 
	el.width = "100%"; 
	el.height = "100%"; 

	// Adding the created iframe to div as a child element 
	//document.getElementById(divId).appendChild(el); 

}

const RemoveIframeElement = (divId) => { 
	// Remove the last child ( iframe element ) of div. 
	document.getElementById(divId) 
		.removeChild(document 
		.getElementById(divId).lastChild); 
} 


window.onload = function () {

	WebosDevice.getNetworkInfo();
	WebosDevice.getPlatformInfo();
	WebosDevice.getNetworkMacInfo();

	document.getElementById('iframe').setAttribute('src', 'Playing/player.html');

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

	//removeDir();

	// var urlArray = jsonData.Data.urlArray;
	// urlArray.forEach((item, key) => {
	// 	download(item);
	// });  

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
	
/*
	var isRegisterData = {
		playerCode: "",
		privateKey: "08:00:27:58:99:55",
		publicKey: "08:00:27:58:99:55",
		playerId: "9",
		playerName: "WEBOS4.1",
		customerId: "1"
	}
	 */

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
		/*
		CreateIframeElement("Playing/player.html","play");
		setTimeout(() => {
			RemoveIframeElement("login");
		}, 3000);
		
		*/	
		var isGetPublishment = {
			playerCode: "",
			privateKey: webOsSerialNumber,
			publicKey: webOsSerialNumber,
			playerId: data.playerId,
			playerName: webOsModelName,
			customerId: data.customerId
		}
	
	/*
		var isGetPublishment = {
			playerCode: "",
			privateKey: "08:00:27:58:99:55",
			publicKey: "08:00:27:58:99:55",
			playerId: "9",
			playerName: "WEBOS4.1",
			customerId: "1"
		}*/
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
   
  }else{
	_log("ELSE Commands");
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