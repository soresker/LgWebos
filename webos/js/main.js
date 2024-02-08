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
	Logger.sendMessage("Html message coming brooo", event.data);
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
	WebosDevice.getSystemUsageInfo()
	WebosDevice.setUiTile(false);

	startSignalSocket();

	downloader = new Downloader();
	fs = new Filesystem();
	fs.init();

	if (window.addEventListener) {
		Logger.sendMessage("message")
		window.addEventListener('message', listener, false);
	} else if (window.attachEvent) {
		Logger.sendMessage("onmessage")
		window.attachEvent('onmessage', listener);
	}

	Logger.sendMessage('onload init');
	checkPublishment();
	//localStorage.clear();

	StartPlayer.playerIsRegister(function (result) {

		Logger.sendMessage('StartPlayer.playerIsRegister');

		if (result) {

			//Player is registered
			Logger.sendMessage('player register');
			Logger.sendMessage('player playerId:'+WebosSettings.value("PlayerSettings/playerId", ""));
			Logger.sendMessage('player custormerId:'+WebosSettings.value("Customer/id", ""));

		} else {
			Logger.sendMessage('player register degil');
			CreateIframeElement("Login/login.html", "login");
		}

	});

	sendHardbitSystemInfo();
	sendSystemInfo();
}

function messageCheck(msg) {

	msg = JSON.parse(msg);
	Logger.sendMessage("Message Check:", msg);
	Logger.sendMessage("Message MessageType:", msg.MessageType);

	switch (msg.MessageType) {

		case commandMessage.Player_Register:
			Logger.sendMessage("Player_Register yapacaz", msg);
			playerRegister(msg);
			break;

		case commandMessage.PlayingLog:
			break;

		case commandMessage.PlayerReady:
			var publishment = WebosSettings.value("Publishment/NewVersion", "");
			Logger.sendMessage('publishment:', publishment);
			this.readfile(publishment);
			break;

		default:
			break;
	}
}

function readfile(fileName) {

	Logger.sendMessage("readfile","");

	var path = publishmentsDir + fileName + ".json";
	Logger.sendMessage('read file path:', path);
	fs.readFile(path, function (error, data) {
		Logger.sendMessage('readfile3:', data);
		var initPlayer = JSON.stringify({ "MessageType": "initPlayer", "Data": { "filePath": "./content/contents/", "videoMode": "0" } });
		Start_Handler.receiveMessage(initPlayer);
		Start_Handler.receiveMessage(data);
	});
}

function writefile(fileName, data) {
	Logger.sendMessage('writefile path:', fileName);
	Logger.sendMessage("data", data)

	var path = publishmentsDir + fileName + ".json";
	Logger.sendMessage('writefile path:', path);
	var Data = data;
	var jsonData = {
		"MessageType": "startPublishment", "Data":Data
	};
	fs.writeFile(path, JSON.stringify(jsonData), function (error) {
		if (error)
			return Logger.sendMessage('error', error);
		else
			Logger.sendMessage('write json data:', data);
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
		Logger.sendMessage('download start:', 'download status:' + (currentIndex + 1) + '/' + urlArray.length)
		Logger.sendMessage('download file url:', currentUrl)
		var fileName = currentUrl.split('/').pop();
		fileExists(contentsDir + fileName, function (error, data) {
			if (data != null && data == false) {
				download(currentUrl, function (err, data) {
					if (err) {
						Logger.sendMessage("download failed: " + (currentIndex + 1) + '/' + urlArray.length);
						Logger.sendMessage("download failed:"  + (currentIndex + 1),"");
					} else {
						Logger.sendMessage('download complete: ' + (currentIndex + 1) + '/' + urlArray.length + ' 😃');
						Logger.sendMessage("download complete: " + (currentIndex + 1) + "/" + urlArray.length ,"");
					}
					downloadNext()
				})
			}
			else {
				Logger.sendMessage("download file exist! Go Next File: " + (currentIndex + 1) + '/' + urlArray.length)
				downloadNext()
			}
		});
	}
	else {
		currentIndex = -1;
		Logger.sendMessage("download complated all files ✅");
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
	Logger.sendMessage('listdir path', path);
	fs.ls(path, function (error, data) {
		if (error)
			return Logger.sendMessage('error', error);
		Logger.sendMessage('data', data);
		Logger.sendMessage("List Contents"+data,"");
		return data;
	})
}

function removeDir() {
	var path = defaultDir;
	Logger.sendMessage('rmdir path', path);
	fs.rmdir(path, { recursive: true }, function (error, data) {
		if (error)
			return Logger.sendMessage('error', error);
		Logger.sendMessage('data', data);
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
	Logger.sendMessage("Send Player Register:", isRegisterData);
}

function executeReceiveCommands(commands) {
	Logger.sendMessage("Receive Command:"+ commands.command,"");
	if (commands.command === commandMessage.Player_Register) {
		Logger.sendMessage("Receive commandMessage.Player_Register ");
		WebosSettings.setValue("PlayerSettings/status", commands.status);

		if (commands.status == true) {
			RemoveIframeElement("login");
			var isGetPublishment = {
				playerCode: "",
				privateKey: webOsMacAdress,
				publicKey: webOsMacAdress,
				playerId: WebosSettings.value("PlayerSettings/playerId", ""),
				playerName: webOsModelName,
				customerId: WebosSettings.value("Customer/id", "")
			}
			sendSignal(commandMessage.Check_Publishment, isGetPublishment);
		}

	} else if (commands.command === commandMessage.Check_Publishment) {
		Logger.sendMessage("commandMessage.Check_Publishment", commands.command);

		var temp = WebosSettings.value("Publishment/NewVersion", "");
		var playerStatus = WebosSettings.value("PlayerSettings/status", "");

		if (temp == "" && playerStatus == true) {
			Logger.sendMessage("Player ilk kez ayaga kalkiyor ve yayini indirmeli:", commands);
			WebosSettings.setValue("Publishment/NewVersion", commands.jsonData.publishmentName);
			WebosSettings.setValue("Publishment/OldVersion", commands.jsonData.publishmentName);
			writefile(commands.jsonData.publishmentName, commands.jsonData.publishmentData);
			fetchPublishment(commands.jsonData.publishmentData);
			Logger.sendMessage("burayageldik mi :", commands.jsonData);

		}

		if (temp != commands.jsonData.publishmentName && playerStatus == true) {
			Logger.sendMessage("Publisment dosyasi indiriliyor:", commands);
			writefile(commands.jsonData.publishmentName, commands.jsonData.publishmentData);
			WebosSettings.setValue("Publishment/NewVersion", commands.jsonData.publishmentName);
			fetchPublishment(commands.jsonData.publishmentData);
		} else {
			Logger.sendMessage("Devamke :)");
		}

	} else if (commands.command === commandMessage.WinScreenShotRequest) {
		Logger.sendMessage("WinScreenShotRequest");
		WebosDevice.screenShot();    
	}
	else if (commands.command === commandMessage.Player_Restart) {
		Logger.sendMessage("Player_Restart");
		WebosDevice.deviceRestart();
	}
	else if (commands.command === commandMessage.Player_Shutdown) {
		Logger.sendMessage("Player_Shutdown");
		WebosDevice.deviceShutDown();
	}
	else if (commands.command === commandMessage.Check_Upgrade) {
		Logger.sendMessage("Check_Upgrade");
		WebosDevice.upgradeIpkApplication();  
	}
	else if (commands.command === commandMessage.PlayerDeleted) {
		Logger.sendMessage("PlayerDeleted");
		removeDir();
		window.localStorage.clear();
		localStorage.clear();
		setTimeout(function()  {
			WebosDevice.restartApplication();    
		}, 2000);
	}
	else if (commands.command === commandMessage.HealthCheck) {
		Logger.sendMessage("HealthCheck");
	}
	else if (commands.command === commandMessage.AppRestart) {
		Logger.sendMessage("AppRestart");
		WebosDevice.restartApplication();    
	}
	else if (commands.command === commandMessage.PlayerSettingsHere) {
		Logger.sendMessage("PlayerSettingsHere");
		WebosDevice.setUiTile(false);      
	}
	else if (commands.command === commandMessage.Sys_Info) {
		Logger.sendMessage(" Receive commandMessage.Sys_Info",commands);
	}
	else {
		Logger.sendMessage("UNKNOWN Command");
	}

}
function showPlayer() {

	Logger.sendMessage("showPlayer :)");

	var Data = globalPublishment;
	var initPlayer = JSON.stringify({ "MessageType": "initPlayer", "Data": { "filePath": "./content/contents/", "videoMode": "0" } })
	Start_Handler.receiveMessage(initPlayer);

	Start_Handler.receiveMessage(JSON.stringify({
		"MessageType": "startPublishment","Data":Data
	}));

}


function fetchPublishment(readPublishment) {

	Logger.sendMessage("start download","");
	listDir(publishmentsDir)
	globalPublishment = readPublishment;
	urlArray = readPublishment.urlArray;

	downloadNext();

	Logger.sendMessage("fetchPublishment download sonrasi:)");

}

function sendHardbitSystemInfo  () {

	setInterval(function() {
		Logger.sendMessage("sendHardbitSystemInfo");
		var systemInfData = {
			playerCode: "",
			privateKey: webOsMacAdress,
			publicKey: webOsMacAdress,
			playerId: WebosSettings.value("PlayerSettings/playerId", ""),
			playerName: webOsModelName,
			customerId: WebosSettings.value("Customer/id", "")

		}

		sendSignal(commandMessage.HealthCheck, systemInfData);
	}, 10000);

}

function sendScreenShot (base64Image)  {

	Logger.sendMessage("sendScreenShot","");

	var playerInfo = {
		privateKey: webOsMacAdress,
		publicKey: webOsMacAdress,
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
			Logger.sendMessage('publishments file not found -', error);

			fs.mkdir(defaultDir + 'publishments/', function (error, data) {
				if (error) {
					Logger.sendMessage('publishments dir not created -', error);
				}
				else {
					Logger.sendMessage('publishments dir created +', publishmentsDir);
				}
			});
		}
	});

	fs.ls(defaultDir + 'contents', function (error, data) {
		if (error) {
			Logger.sendMessage('contents file not found -', error);

			fs.mkdir(defaultDir + 'contents/', function (error, data) {
				if (error) {
					Logger.sendMessage('contents dir not created -', error);
				}
				else {
					Logger.sendMessage('contents dir created +', contentsDir);
				}
			});
		}
	});
}

function sendSystemInfo() {

	setTimeout(function() {
		
		var systemInfData = {
			privateKey: webOsMacAdress,
			publicKey: webOsMacAdress,
			deviceType: webOsModelName,
			osType: 'Lg Webos '+webOsHardwareVersion,
			osArch: webOsFirmwareVersion,
			totalHddSize: webOsTotalMemory,
			currentHddSize: webOsUsedMemory,
			screenResolution: '',
			fileSystemType: 'fat32',
			ipAddress: webOsIp,
			mac: webOsMacAdress,
			playerDeviceType: 'Webos',
			serialNo: webOsSerialNumber,
			playerId: WebosSettings.value("PlayerSettings/playerId", ""),
			appVersion: '1.0.1',
			customerId: WebosSettings.value("Customer/id", "")
	
		}
		sendSignal(commandMessage.Sys_Info, systemInfData);

	}, 5000);


}
