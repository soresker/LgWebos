var downloader;
var fs;
var defaultDir = 'file://internal/';
var publishmentsDir = defaultDir + 'publishments/';
var contentsDir = defaultDir + 'contents/';
var contentsDirReq = './content/publishments/';
var connection = null;
var urlArray;
var currentIndex = -1
var globalPublishment = "";
var downloadDir = "";
var downloadName = "";
var webosIsRegister = "";

//var keyboardControl = new Keyboard_Control();

function listener(event) {
	Logger.sendMessage("Html message coming brooo", event.data);
	messageCheck(event.data);
}

function CreateIframeElement(source, divId) {

	var el = document.createElement("iframe");

	// setting the values for the attributes. 
	el.src = source;
	el.width = "100%";
	el.height = "100%";

	// Adding the created iframe to div as a child element 
	document.getElementById(divId).appendChild(el);

}

function RemoveIframeElement(divId) {
	// Remove the last child ( iframe element ) of div. 
	document.getElementById(divId)
		.removeChild(document
			.getElementById(divId).lastChild);
}

function getWebOSVersion() {

	function successCallback(successObject) {
		Logger.sendMessage('webOS Signage version: ' + successObject.webOSVersion);
		webOsHardwareVersion = successObject.webOSVersion;

		if (successObject.webOSVersion <= "3.2") {
			Logger.sendMessage('webOS 3 ve ya 3 ten kuccuk: ' + successObject.webOSVersion);
			$('body').append('<script type="text/javascript" src="./js/cordova-cd/1.5/power.js" onload="loaded=true;"></script>');
			$('body').append('<script type="text/javascript" src="./js/cordova-cd/1.5/signage.js" onload="loaded=true;"></script>');
			$('body').append('<script type="text/javascript" src="./js/cordova-cd/1.5/configuration.js" onload="loaded=true;"></script>');
			//$('body').append('<script type="text/javascript" src="./js/cordova-cd/1.5/deviceInfo.js" onload="loaded=true;"></script>');
			this.addLastScript('./js/cordova-cd/1.5/deviceInfo.js')
		}
		else {
			Logger.sendMessage('webOS 3 ten buyyuk: ' + successObject.webOSVersion);
			$('body').append('<script type="text/javascript" src="./js/cordova-cd/1.5/power16.js" onload="loaded=true;"></script>');
			$('body').append('<script type="text/javascript" src="./js/cordova-cd/1.5/signage16.js" onload="loaded=true;"></script>');
			$('body').append('<script type="text/javascript" src="./js/cordova-cd/1.5/configuration16.js" onload="loaded=true;"></script>');
			//$('body').append('<script type="text/javascript" src="./js/cordova-cd/1.5/deviceInfo16.js" onload="loaded=true;"></script>');
			this.addLastScript('./js/cordova-cd/1.5/deviceInfo16.js')
		}
	}
	function failureCallback(failureObject) {
		$('body').append('<script type="text/javascript" src="./js/cordova-cd/1.5/power16.js" onload="loaded=true;"></script>');
		$('body').append('<script type="text/javascript" src="./js/cordova-cd/1.5/signage16.js" onload="loaded=true;"></script>');
		$('body').append('<script type="text/javascript" src="./js/cordova-cd/1.5/configuration16.js" onload="loaded=true;"></script>');
		//$('body').append('<script type="text/javascript" src="./js/cordova-cd/1.5/deviceInfo16.js" onload="loaded=true;"></script>');
		this.addLastScript('./js/cordova-cd/1.5/deviceInfo16.js')
		Logger.sendMessage("getWebOSVersion" + '[' + failureObject.errorCode + ']' + failureObject.errorText);
	}
	var custom = new Custom();

	custom.Signage.getwebOSVersion(successCallback, failureCallback);

}

function addLastScript(url) {

	var script = document.createElement('script')
	script.setAttribute('src', url)
	script.setAttribute('type', 'text/javascript')
	script.setAttribute('onload', 'loaded=true;')
	Logger.sendMessage("Scriptler yükleniyor.", script)
	script.onload = function()  {
		Logger.sendMessage("Scriptler yüklenmiştir.")
		WebosDevice.getNetworkMacInfo();
		WebosDevice.getPlatformInfo();
		WebosDevice.getNetworkInfo();
		WebosDevice.getSystemUsageInfo()
		WebosDevice.setUiTile(false);
	}
	document.body.appendChild(script)

}

window.onkeydown = function (event) {

	console.log("window.event : " + event);

	var iframe = document.getElementById('login').getElementsByTagName('iframe')[0];
	var keyCode = event.keyCode || event.which;

	var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

	// Enter tuşuna basıldığında
	if (keyCode === 13) {

		if (iframeDocument.getElementById('playerId').value == "") {
			iframeDocument.getElementById('playerId').focus();

			iframeDocument.getElementById('register').value = "Player Id Girmek icin 15 sn var ";

			setTimeout(function () {

				iframeDocument.getElementById("playerId").disabled = true;
				iframeDocument.getElementById("playerId").disabled = false;
				iframeDocument.getElementById('customerId').focus();
				iframeDocument.getElementById('register').value = "CustomerId Id Girmek icin 15 sn var ";

				setTimeout(function () {

					iframeDocument.getElementById("customerId").disabled = true;
					iframeDocument.getElementById("customerId").disabled = false;
					iframeDocument.getElementById('register').focus();
					iframeDocument.getElementById('register').click();
					iframeDocument.getElementById('register').value = "Eger Register Olamadiysan Cihazi Restart Et";
				}, 15000);

			}, 15000);
		}
	}
};

window.onload = function () {

	this.getWebOSVersion();

	fs = new Filesystem();
	fs.init();

	startSignalSocket();
	downloader = new Downloader();

	if (window.addEventListener) {
		Logger.sendMessage("message")
		window.addEventListener('message', listener, false);
	} else if (window.attachEvent) {
		Logger.sendMessage("onmessage")
		window.attachEvent('onmessage', listener);
	}

	Logger.sendMessage('onload init');
	checkPublishment();

	StartPlayer.playerIsRegister(function (result) {

		Logger.sendMessage('StartPlayer.playerIsRegister');

		if (result) {

			webosIsRegister = WebosSettings.value("PlayerSettings/status","");

			Logger.sendMessage('player register'+webosIsRegister);
			Logger.sendMessage('player playerId:' + WebosSettings.value("PlayerSettings/playerId", ""));
			Logger.sendMessage('player custormerId:' + WebosSettings.value("Customer/id", ""));

			setTimeout(function () {
				$("#screen-shot-image").hide();
			}, 2000);

		} else {

			Logger.sendMessage('player register degil');
			webosIsRegister = WebosSettings.value("PlayerSettings/status","");
			CreateIframeElement("Login/login.html", "login");
			$("#screen-shot-image").show();

		}

	});

	sendHardbitSystemInfo();
	sendSystemInfo();
	checkSocketConnection();
}

function messageCheck(msg) {

	msg = JSON.parse(msg);
	Logger.sendMessage("Message Check:", msg);
	Logger.sendMessage("Message MessageType:", msg.MessageType);

	switch (msg.MessageType) {

		case commandMessage.Player_Register:
			Logger.sendMessage("Player_Register yapacaz" + msg);
			playerRegister(msg);
			break;

		case commandMessage.PlayingLog:
			break;

		case commandMessage.PlayerReady:

			var fileName = WebosSettings.value("Publishment/NewVersion", "");
			var path = fileName + ".json";

			Logger.sendMessage('read file:' + path);

			this.readPulishmentFile(path).then(function (publishmentContent) {
				globalPublishment = publishmentContent;
				Logger.sendMessage("publishmentContent" + publishmentContent);
				showPlayer();
			})

			break;

		default:
			break;
	}
}

function writefile(fileName, data) {
	Logger.sendMessage('writefile path:' + fileName);
	Logger.sendMessage("data" + data)

	var path = publishmentsDir + fileName + ".json";
	Logger.sendMessage('writefile path:', path);
	var Data = data;
	var jsonData = {
		"MessageType": "startPublishment", "Data": Data
	};
	fs.writeFile(path, JSON.stringify(jsonData), function (error) {
		if (error)
			return Logger.sendMessage('error write json:' + error);
		else
			Logger.sendMessage('write json data:' + data);
	})
}
function download(url, callback) {
	downloader.start({
		url: url,
		path: downloadDir,
		filename: downloadName
	}, function (error, data) {
		callback(error, data)
	});
}

function downloadNext() {
	currentIndex = currentIndex + 1
	if (currentIndex < urlArray.length) {
		var currentUrl = urlArray[currentIndex];
		Logger.sendMessage('download start:' + 'download status:' + (currentIndex + 1) + '/' + urlArray.length)
		Logger.sendMessage('download file url:' + currentUrl)
		var fileName = currentUrl.split('/').pop();
		fileExists(downloadDir + fileName, function (error, data) {
			if (data != null && data == false) {
				download(currentUrl, function (err, data) {
					if (err) {
						Logger.sendMessage("download failed: " + (currentIndex + 1) + '/' + urlArray.length);
						Logger.sendMessage("download failed:" + (currentIndex + 1) + "");
						Logger.sendMessage("download failed error:" + JSON.stringify(err));
					} else {
						Logger.sendMessage('download complete: ' + (currentIndex + 1) + '/' + urlArray.length + ' 😃');
						Logger.sendMessage("download complete: " + (currentIndex + 1) + "/" + urlArray.length);
					}
					$(".download-bar").html("Downloading " + (currentIndex + 1) + "/" + urlArray.length);
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
		setTimeout(function () {
			$("#screen-shot-image").hide();
		}, 2000);

		if (downloadDir == publishmentsDir) {
			Logger.sendMessage("SHOWWW PLAYERE✅");
			showPlayer();
		} else {
			this.getPublishment();
		}
		$(".download-bar").hide()
		listDir(publishmentsDir);
		listDir(contentsDir);
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
	Logger.sendMessage('listdir path' + path);
	fs.ls(path, function (error, data) {
		if (error)
			return Logger.sendMessage('error', error);
		Logger.sendMessage("List Contents:" + JSON.stringify(data));
		return data;
	})
}

function removeDir() {
	var path = defaultDir;
	Logger.sendMessage('rmdir path' + path);
	fs.rmdir(path, { recursive: true }, function (error, data) {
		if (error)
			return Logger.sendMessage('error', error);
		Logger.sendMessage('data' + data);
	})

	var path = publishmentsDir;
	Logger.sendMessage('rmdir path' + path);
	fs.rmdir(path, { recursive: true }, function (error, data) {
		if (error)
			return Logger.sendMessage('error', error);
		Logger.sendMessage('data' + data);
	})
}

function playerRegister(data) {

	var isRegisterData = {
		playerCode: "",
		privateKey: webOsMacAdress,
		publicKey: webOsMacAdress,
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
	Logger.sendMessage("Receive Command:" + commands.command, "");
	if (commands.command === commandMessage.Player_Register) {
		Logger.sendMessage("Receive commandMessage.Player_Register ");
		WebosSettings.setValue("PlayerSettings/status", commands.status);

		if (commands.status == true) {
			webosIsRegister = true;
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
			//this.writefile(commands.jsonData.publishmentName, commands.jsonData.publishmentData);
			fetchPublishment(commands.jsonData.publishmentData);
			Logger.sendMessage("burayageldik mi :", commands.jsonData);

		}

		if (temp != commands.jsonData.publishmentName && playerStatus == true) {
			Logger.sendMessage("Publisment dosyasi indiriliyor:", commands);
			//this.writefile(commands.jsonData.publishmentName, commands.jsonData.publishmentData);
			WebosSettings.setValue("Publishment/NewVersion", commands.jsonData.publishmentName);
			WebosSettings.setValue("Publishment/OldVersion", commands.jsonData.publishmentName);
			fetchPublishment(commands.jsonData.publishmentData);
		} else {
			Logger.sendMessage("DEVAMKEEEE :)");
		}

	} else if (commands.command === commandMessage.WinScreenShotRequest) {
		Logger.sendMessage("WinScreenShotRequest");
		WebosDevice.screenShot(false, true);
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
		setTimeout(function () {
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
		Logger.sendMessage("PlayerSettingsHere:" + JSON.stringify(commands));
		if (webOsHardwareVersion >= "3.0") {
			Logger.sendMessage("Rotate Setleniyor:" + JSON.stringify(commands));
			WebosDevice.setRotate(commands.jsonData.rotation);
		}
		//WebosDevice.setUiTile(false); //sonra acilabilir.      
	}
	else if (commands.command === commandMessage.Sys_Info) {
		Logger.sendMessage(" Receive commandMessage.Sys_Info", JSON.stringify(commands));
	}
	else if (commands.command === commandMessage.Get_Publishment) {
		Logger.sendMessage(" Receive GetPublishment", JSON.stringify(commands));
		receive_Publishment(commands);
	}
	else if (commands.command === commandMessage.PublishmentDelete) {
		Logger.sendMessage(" Receive PublishmentDelete", JSON.stringify(commands));
		removeDir();
	}

	else {
		Logger.sendMessage("UNKNOWN Command");
	}

}
function showPlayer() {

	Logger.sendMessage("showPlayer :)");

	var Data = globalPublishment;
	var initPlayer = { "MessageType": "initPlayer", "Data": { "filePath": "./content/contents/", "videoMode": "0" } }

	var playerStatus = WebosSettings.value("PlayerSettings/status", "");

	if (playerStatus == true) {

		Start_Handler.receiveMessage(initPlayer);
		var jsonData = {
			"MessageType": "startPublishment", "Data": Data
		};
		Start_Handler.receiveMessage(jsonData);;
	} else {

		Logger.sendMessage("showPlayer sikinti :)");

	}
}

function fetchPublishment(readPublishment) {

	Logger.sendMessage("received publishment:" + JSON.stringify(readPublishment));
	//listDir(publishmentsDir)
	globalPublishment = readPublishment;
	urlArray = readPublishment.urlArray;
	downloadDir = contentsDir;
	downloadName = "";
	$(".download-bar").show();
	downloadNext();

	Logger.sendMessage("fetchPublishment download sonrasi:)");

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

function sendHardbitSystemInfo() {

	setInterval(function () {
		Logger.sendMessage("sendHardbitSystemInfo");
		var systemInfData = {
			playerCode: "",
			privateKey: webOsMacAdress,
			publicKey: webOsMacAdress,
			playerId: WebosSettings.value("PlayerSettings/playerId", ""),
			playerName: webOsModelName,
			customerId: WebosSettings.value("Customer/id", "")

		}
		if(webosIsRegister == true)
			sendSignal(commandMessage.HealthCheck, systemInfData);
	}, 10000);

}

function checkSocketConnection() {

	setInterval(function () {
		Logger.sendMessage("checkSocketConnection");
		if (getConnectionState() == false) {
			Logger.sendMessage("socke tekrar baslasin amqq");
			startSignalSocket();
		}
	}, 5000);

}

function sendSystemInfo() {

	setInterval(function () {

		var systemInfData = {
			privateKey: webOsMacAdress,
			publicKey: webOsMacAdress,
			deviceType: webOsModelName,
			osType: 'Lg Webos ' + webOsHardwareVersion,
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
			appVersion: '1.0.61',
			customerId: WebosSettings.value("Customer/id", "")

		}
		if(webosIsRegister == true)
			sendSignal(commandMessage.Sys_Info, systemInfData);

	}, 60000);


}

function getPublishment() {

	var isGetPublishment = {
		playerCode: "",
		privateKey: webOsMacAdress,
		publicKey: webOsMacAdress,
		playerId: WebosSettings.value("PlayerSettings/playerId", ""),
		playerName: webOsModelName,
		customerId: WebosSettings.value("Customer/id", "")
	}
	sendSignal(commandMessage.Get_Publishment, isGetPublishment);
}

function receive_Publishment(publishment) {

	Logger.sendMessage("BURASI ONEMLI receive_Publishment: " + JSON.stringify(publishment));
	var temp = [];
	temp[0] = publishment.jsonData.publishmentUrl;
	urlArray = temp; //guncelle
	Logger.sendMessage("BURASI ONEMLI receive_Publishment URLLLLL " + urlArray);

	downloadDir = publishmentsDir;
	downloadName = publishment.jsonData.publishmentName + ".json";
	downloadNext();
}

function readPulishmentFile(fileName) {
	return new Promise(function (resolve, reject) {
		listDir(publishmentsDir);

		var rawFile = new XMLHttpRequest();
		rawFile.open("GET", "./content/publishments/" + fileName, false);
		rawFile.overrideMimeType('text/plain; charset=utf-8');

		rawFile.onreadystatechange = function () {
			if (rawFile.readyState === 4) {
				Logger.sendMessage("rawFile.readyState 4 " + rawFile.readyState, "");
				if (rawFile.status === 200 || rawFile.status == 0) {
					var allText = rawFile.responseText;
					//Logger.sendMessage("allText " + allText, ""); //sonra kapat
					resolve(allText);
				} else {
					reject(new Error("Failed to fetch file. Status code: " + rawFile.status));
				}
			}
			else {
				Logger.sendMessage("readFile Error" + rawFile.responseText, "");
			}
		}
		rawFile.send(null);
	});
}
