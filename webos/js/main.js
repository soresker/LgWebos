var downloader;
var fs;

var defaultDir = 'file://internal/';
var settingsDir = defaultDir + 'settings/setting.json';
var publishmentsDir = defaultDir + 'publishments/';
var contentsDir = defaultDir + 'contents/';
var defaultsPort = "http://127.0.0.1:9080/file://internal/contents/"
var connection = null;
var urlArray;
var currentIndex = 0

function listener(event) {
	_log("Html message coming", event.data);
	messageCheck(event.data);
}

const CreateIframeElement = (source, divId) => {

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

	//document.getElementById('iframe').setAttribute('src', 'Playing/player.html');

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
	checkPublishment();
	//localStorage.clear();

	StartPlayer.playerIsRegister(function (result) {

		_log('StartPlayer.playerIsRegister');

		if (result) {

			//Player is registered
			_log('player register');

		} else {
			_log('player register degil');
			CreateIframeElement("Login/login.html", "login");
			setTimeout(() => {
				_log('webos ip:', webOsIp);
				_log('webos internet active:', isInternetActive);
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
	_log("Message Check:", msg);
	_log("Message MessageType:", msg.MessageType);

	switch (msg.MessageType) {

		case commandMessage.Player_Register:
			_log("Player_Register yapacaz", msg);
			playerRegister(msg);
			break;

		case commandMessage.PlayingLog:
			break;

		case commandMessage.PlayerReady:
			var publishment = WebosSettings.value("Publishment/NewVersion", "");
			_log('publishment:', publishment);
			readfile(publishment);
			break;

		default:
			break;
	}
}

function readfile(fileName) {
	var path = publishmentsDir + fileName + ".json";
	_log('read file path:', path);
	fs.readFile(path, function (error, data) {
		_log('readfile3:', data);
		var Data = data;
		let initPlayer = JSON.stringify({ "MessageType": "initPlayer", "Data": { "filePath": "http://127.0.0.1:9080/file://internal/contents/", "videoMode": "0" } })
		Start_Handler.receiveMessage(initPlayer);
	
		let newPublish = JSON.stringify({
			"MessageType": "startPublishment",Data
		});
		Start_Handler.receiveMessage(newPublish);

		//document.getElementById('iframe').contentWindow.postMessage(JSON.stringify({ "MessageType": "initPlayer", "Data": { "filePath": "http://127.0.0.1:9080/file://internal/contents/", "videoMode": "0" } }), '*');

		//document.getElementById('iframe').contentWindow.postMessage(data, "*")
	})
}

function writefile(fileName, data) {
	_log('writefile path:', fileName);
	_log("data", data)

	var path = publishmentsDir + fileName + ".json";
	_log('writefile path:', path);
	var Data = data
	var jsonData = {
		"MessageType": "startPublishment", Data
	}
	fs.writeFile(path, JSON.stringify(jsonData), function (error) {
		if (error)
			return _log('error', error);
		else
			_log('write json data:', data);
	})
}

function download(url, callback) {
	downloader.start({
		url: url,
		path: contentsDir,
	}, function (error, data) {
		_log('download complete: ' + (currentIndex + 1) +' ✓' , error, data)
		callback(error, data)
	});
}

function downloadNext() {
	var currentUrl = urlArray[currentIndex];
	_log('download start:', 'download status:' + (currentIndex + 1) + '/' + urlArray.length);
	_log('download file url:', currentUrl);
	download(currentUrl, function (err, data) {
		if (currentIndex < urlArray.length) {
			downloadNext()
			currentIndex = currentIndex + 1
		}
		else {
			currentIndex = 0
			_log("download complated all files ✓")
		}
	})
}

function listDir(dir) {
	var path = dir;
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
	WebosSettings.setValue("PlayerSettings/playerId", data.playerId);

	sendSignal(commandMessage.Player_Register, isRegisterData);
	_log("Send Player Register:", isRegisterData);

}

function executeReceiveCommands(commands) {
	_log("executeReceiveCommands");

	if (commands.command === commandMessage.Player_Register) {
		_log("Receive commandMessage.Player_Register ");
		WebosSettings.setValue("PlayerSettings/status", commands.status);

		if (commands.status == true) {
			var isGetPublishment = {
				playerCode: "",
				privateKey: webOsSerialNumber,
				publicKey: webOsSerialNumber,
				playerId: WebosSettings.value("PlayerSettings/playerId", ""),
				playerName: webOsModelName,
				customerId: WebosSettings.value("Customer/id", "")
			}
			sendSignal(commandMessage.Check_Publishment, isGetPublishment);
		}

	} else if (commands.command === commandMessage.Check_Publishment) {
		_log("commandMessage.Check_Publishment", commands.command);

		var temp = WebosSettings.value("Publishment/NewVersion", "");
		var playerStatus = WebosSettings.value("PlayerSettings/status", "");

		if (temp == "" && playerStatus == true) {
			_log("Player ilk kez ayaga kalkiyor ve yayini indirmeli:", commands);
			WebosSettings.setValue("Publishment/NewVersion", commands.jsonData.publishmentName);
			WebosSettings.setValue("Publishment/OldVersion", commands.jsonData.publishmentName);
			writefile(commands.jsonData.publishmentName, commands.jsonData.publishmentData);
			fetchPublishment(commands.jsonData.publishmentData);
			_log("burayageldik mi :", commands.jsonData);

		}

		if (temp != commands.jsonData.publishmentName && playerStatus == true) {
			_log("Publisment dosyasi indiriliyor:", commands);
			writefile(commands.jsonData.publishmentName, commands.jsonData.publishmentData);
			WebosSettings.setValue("Publishment/NewVersion", commands.jsonData.publishmentName);
			fetchPublishment(commands.jsonData.publishmentData);
		} else {
			_log("Devamke :)");
		}

	} else if (commands.command === commandMessage.WinScreenShotRequest) {
		_log("WinScreenShotRequest");
		//WebosDevice.screenShot();    
	}
	else if (commands.command === commandMessage.Player_Restart) {
		_log("Player_Restart");
		//WebosDevice.deviceRestart();
	}
	else if (commands.command === commandMessage.Player_Shutdown) {
		_log("Player_Shutdown");
		//WebosDevice.deviceShutDown();
	}
	else if (commands.command === commandMessage.Check_Upgrade) {
		_log("Check_Upgrade");
		//WebosDevice.upgradeIpkApplication();  
	}
	else if (commands.command === commandMessage.PlayerDeleted) {
		_log("PlayerDeleted");
		window.localStorage.clear();
		localStorage.clear();
	}
	else if (commands.command === commandMessage.HealthCheck) {
		_log("HealthCheck");
	}
	else if (commands.command === commandMessage.AppRestart) {
		_log("AppRestart");
		//WebosDevice.restartApplication();    
	}
	else if (commands.command === commandMessage.PlayerSettingsHere) {
		_log("PlayerSettingsHere");
		//WebosDevice.setPortraitMode();      
	}
	else {
		_log("UNKNOWN Command");
	}

}

function fetchPublishment(readPublishment) {

	_log("fetchPublishment :)");

	listDir(publishmentsDir)
	var Data = readPublishment;
	urlArray = readPublishment.urlArray;

	downloadNext();

	_log("fetchPublishment download sonrasi:)");

	let initPlayer = JSON.stringify({ "MessageType": "initPlayer", "Data": { "filePath": "http://127.0.0.1:9080/file://internal/contents/", "videoMode": "0" } })
	Start_Handler.receiveMessage(initPlayer);

	let newPublish = JSON.stringify({
		"MessageType": "startPublishment", Data
	});
	Start_Handler.receiveMessage(newPublish);

	//document.getElementById('iframe').contentWindow.postMessage(JSON.stringify({ "MessageType": "initPlayer", "Data": { "filePath": "http://127.0.0.1:9080/file://internal/contents/", "videoMode": "0" } }), '*');
	//document.getElementById('iframe').contentWindow.postMessage(JSON.stringify({
	//	"MessageType": "startPublishment", Data
	//}), "*")

}

sendHardbitSystemInfo = (() => {

	setInterval(() => {
		_log("sendHardbitSystemInfo");
		var systemInfData = {
			playerCode: "",
			privateKey: webOsSerialNumber,
			publicKey: webOsSerialNumber,
			playerId: WebosSettings.value("PlayerSettings/playerId", ""),
			playerName: webOsModelName,
			customerId: WebosSettings.value("Customer/id", "")

		}

		sendSignal(commandMessage.HealthCheck, systemInfData);
	}, 10000);

});

sendScreenShot = ((base64Image) => {

	_log("sendScreenShot");
	var playerInfo = {
		privateKey: webOsSerialNumber,
		publicKey: webOsSerialNumber,
		playerId: WebosSettings.value("PlayerSettings/playerId", ""),
		customerId: WebosSettings.value("Customer/id", ""),
		base64Image: base64Image,
		screenResolution: '400x300',
	}

	sendSignal(commandMessage.Win_ScreenShot, playerInfo);

});

function checkPublishment() {
	fs.ls(defaultDir + 'publishments', function (error, data) {
		if (error) {
			_log('publishments file not found -', error);

			fs.mkdir(defaultDir + 'publishments/', function (error, data) {
				if (error) {
					_log('publishments dir not created -', error);
				}
				else {
					_log('publishments dir created +', publishmentsDir);
				}
			});
		}
	});

	fs.ls(defaultDir + 'contents', function (error, data) {
		if (error) {
			_log('contents file not found -', error);

			fs.mkdir(defaultDir + 'contents/', function (error, data) {
				if (error) {
					_log('contents dir not created -', error);
				}
				else {
					_log('contents dir created +', contentsDir);
				}
			});
		}
	});
}
