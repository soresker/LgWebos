var downloader;
var fs;
var defaultDir = 'file://internal/';
var publishmentsDir = defaultDir + 'publishments/';
var contentsDir = defaultDir + 'contents/';
var connection = null;
var urlArray;
var currentIndex = -1
var globalPublishment = "";

function listener(event) {
	_log("Html message coming", event.data);
	messageCheck(event.data);
}

function CreateIframeElement  (source, divId) {

	var el = document.createElement("iframe");

	// setting the values for the attributes. 
	el.src = source;
	el.width = "100%";
	el.height = "100%";

	// Adding the created iframe to div as a child element 
	document.getElementById(divId).appendChild(el);

}

function RemoveIframeElement (divId) {
	// Remove the last child ( iframe element ) of div. 
	document.getElementById(divId)
		.removeChild(document
			.getElementById(divId).lastChild);
}


window.onload = function () {

	WebosDevice.getNetworkInfo();
	WebosDevice.getPlatformInfo();
	WebosDevice.getNetworkMacInfo();
	//WebosDevice.getSystemUsageInfo()

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
		}

	});

	sendHardbitSystemInfo();
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

	Logger.sendMessage("readfile","");

	var path = publishmentsDir + fileName + ".json";
	_log('read file path:', path);
	fs.readFile(path, function (error, data) {
		_log('readfile3:', data);
		var Data = data;

		var initPlayer = JSON.stringify({ "MessageType": "initPlayer", "Data": { "filePath": "./content/contents/", "videoMode": "0" } });
		Start_Handler.receiveMessage(initPlayer);
		Start_Handler.receiveMessage(data);
	});
}

function writefile(fileName, data) {
	_log('writefile path:', fileName);
	_log("data", data)

	var path = publishmentsDir + fileName + ".json";
	_log('writefile path:', path);
	var Data = data;
	var jsonData = {
		"MessageType": "startPublishment", "Data":Data
	};
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
		callback(error, data)
	});
}

function downloadNext() {
	currentIndex = currentIndex + 1
	if (currentIndex < urlArray.length) {
		var currentUrl = urlArray[currentIndex];
		_log('download start:', 'download status:' + (currentIndex + 1) + '/' + urlArray.length)
		_log('download file url:', currentUrl)
		var fileName = currentUrl.split('/').pop();
		fileExists(contentsDir + fileName, function (error, data) {
			if (data != null && data == false) {
				download(currentUrl, function (err, data) {
					if (err) {
						_log("download failed: " + (currentIndex + 1) + '/' + urlArray.length)
					} else {
						_log('download complete: ' + (currentIndex + 1) + '/' + urlArray.length + ' 😃');
						Logger.sendMessage("download complete: " + (currentIndex + 1) + "/" + urlArray.length ,"");
					}
					downloadNext()
				})
			}
			else {
				_log("download file exist! Go Next File: " + (currentIndex + 1) + '/' + urlArray.length)
				downloadNext()
			}
		});
	}
	else {
		currentIndex = -1;
		_log("download complated all files ✅");
		Logger.sendMessage("download complated all files ✅","");
		showPlayer();
	}
}

function fileExists(files, callback) {
	var successCb = function (cbObject) {
		var exists = cbObject.exists;
		callback(null, exists)
	};

	var failureCb = function (cbObject) {
		callback(cbObject, null)
	};

	var options = {};
	options.path = files;

	var storage = new Storage();
	storage.exists(successCb, failureCb, options);
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
			RemoveIframeElement("login");
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
		setTimeout(function()  {
			WebosDevice.restartApplication();    
		}, 2000);
	}
	else if (commands.command === commandMessage.HealthCheck) {
		_log("HealthCheck");
	}
	else if (commands.command === commandMessage.AppRestart) {
		_log("AppRestart");
		WebosDevice.restartApplication();    
	}
	else if (commands.command === commandMessage.PlayerSettingsHere) {
		_log("PlayerSettingsHere");
		//WebosDevice.setPortraitMode();      
	}
	else {
		_log("UNKNOWN Command");
	}

}
function showPlayer() {

	_log("showPlayer :)");
	Logger.sendMessage("showPlayer","");

	var Data = globalPublishment;
	var initPlayer = JSON.stringify({ "MessageType": "initPlayer", "Data": { "filePath": "./content/contents/", "videoMode": "0" } })
	Start_Handler.receiveMessage(initPlayer);

	Start_Handler.receiveMessage(JSON.stringify({
		"MessageType": "startPublishment","Data":Data
	}));

}


function fetchPublishment(readPublishment) {

	_log("fetchPublishment :)");

	listDir(publishmentsDir)
	globalPublishment = readPublishment;
	urlArray = readPublishment.urlArray;

	downloadNext();

	_log("fetchPublishment download sonrasi:)");

}

function sendHardbitSystemInfo  () {

	setInterval(function() {
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

}

function sendScreenShot (base64Image)  {

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

}

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
