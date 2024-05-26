var downloader;
var fs;
var defaultDir = 'file://internal/';
var publishmentsDir = defaultDir + 'publishments/';
var contentsDir = defaultDir + 'contents/';
var fontsDir = defaultDir + 'fonts/';
var scheduleDir = defaultDir + 'schedule/';
var contentsDirReq = './content/publishments/';
var connection = null;
var downloadedContentList = "";
var currentIndex = -1;
var currentPubIndex = -1;
var globalPublishment = "";
var downloadDir = "";
var downloadName = "";
var webosIsRegister = "";
var globalKeyCode ="";
var globalPublishmentControlForNet = false;
var globalPublishmentName = "";
var globalPublishmentUrl = "";
var globalScheduleData = "";
var devicePublishment = "";
var cameCheckPublish = false;
var webosAppVersion = "1.0.117"
var changeActiveDatas = false;
var weatherActive = false;
var currencyActive = false;
var newsActive = false;
var isMac = "";
var urlArray = "";
var starting = false;
var fontUrlArray  = "";
var weatherOneRequest = false;
var changeActiveDatas = false;
var fontExtension = "";

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
		WebosDevice.getRotate();
		WebosDevice.getNetworkMacInfo();
		WebosDevice.getPlatformInfo();
		WebosDevice.getNetworkInfo();
		WebosDevice.getSystemUsageInfo();
		WebosDevice.enableAllOffTimer();
		WebosDevice.setCurrentTime();
		WebosDevice.setPowerSaveMode();
	}
	document.body.appendChild(script);

}

window.onkeydown = function (event) {

	console.log("window.event : " + event);
	var temp = "";
	var iframe = document.getElementById('login').getElementsByTagName('iframe')[0];
	var keyCode = event.keyCode || event.which;

	if(keyCode == 406)
	{
		var customerId =  WebosSettings.value("Customer/id", "");
		var playerId = WebosSettings.value("PlayerSettings/playerId", "");

		Logger.sendMessage("Player Log");

		$(".download-bar").show();
		$(".download-bar").html("ID:"+ playerId+ " CID:" + customerId+ " PKEY:" + webOsMacAdress+ " URL:"+hubUrl+" "+" IP:"+webOsIp);
	}

	if (webosIsRegister == true)
	{
		temp = WTools.keyCodeToValue(keyCode);

		Logger.sendMessage("Player Sifirlamaca1 temp:"+temp +"keycode:"+keyCode);
		globalKeyCode += temp.toString();
		Logger.sendMessage("Player Sifirlamaca2 temp:"+temp +"globalKeyCode:"+globalKeyCode);

		if(globalKeyCode == "2580")
		{
			Logger.sendMessage("Player Sifirlamaca3");
			removeDir();
			window.localStorage.clear();
			localStorage.clear();
			setTimeout(function () {
				WebosDevice.restartApplication();
			}, 2000);
		}
		return;
	}

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
			/*
			setTimeout(function () {
				$("#screen-shot-image").hide();
			}, 2000);
			*/
		} else {

			Logger.sendMessage('player register degil');
			webosIsRegister = WebosSettings.value("PlayerSettings/status","");
			CreateIframeElement("Login/login.html", "login");
			$("#screen-shot-image").show();

		}

	});

	checkWifi();
	clearScreenInterval();
	//sendHardbitSystemInfo();
	sendSystemInfoInterval();
	checkPeriodPublishment();
	
	setTimeout(function() {
		checkSocketConnection();
	}, 20000);
	
	checkOnlinePeriodDatas();
	checksendNewDataShowUi();
	StartSyncAction();
	startSchedule(true);

	setTimeout(function() {
		readPublishmentForMessage();
	}, 10000);
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
			
			setTimeout(function() {
				
				this.readPulishmentFile(path).then(function (publishmentContent) {
					globalPublishment = JSON.parse(publishmentContent);
					Logger.sendMessage("publishmentContent" + publishmentContent);
					urlArray = globalPublishment.filesUrlArray;
					Logger.sendMessage("publishmentContent urlArray" + urlArray);
					downloadedContentList = globalPublishment.filesUrlArray;
					downloadDir = contentsDir;
					downloadName = "";
					starting = true;
					fontUrlArray = globalPublishment.fontsUrlArray;
					downloadAction(fontUrlArray);

					$(".download-bar").show();
					downloadNext();
					
					//showPlayer();
				})

			}, 2000);
		

			break;

		default:
			break;
	}
}

function getRotate () {

    var rotate = "rotate(0deg)";

	console.log("getRotate:"+globalRotation);
    
    if(globalRotation == "0")
        {
            rotate = "rotate(0deg)";
            return rotate;

        }else if (globalRotation == "90") {
            
            rotate = "rotate(90deg)";
            return rotate;
        }
        else if (globalRotation == "180") {
            rotate = "rotate(180deg)";
            return rotate;           
        }
        else{
            rotate = "rotate(270deg)";
            return rotate;
    }

};

function download(url, callback) {
	downloader.start({
		url: url,
		path: downloadDir,
		filename: downloadName
	}, function (error, data) {
		callback(error, data)
	});
}
function downloadForPublish(camePeriod) {
	currentPubIndex = currentPubIndex + 1;
	if (currentPubIndex < urlArray.length) {
		var currentUrl = urlArray[currentPubIndex];
		Logger.sendMessage('download start for publishment:' + 'download status:' + (currentPubIndex + 1) + '/' + urlArray.length);
		sendConsoleLog('download start for publishment:' + 'download status:' + (currentPubIndex + 1) + '/' + urlArray.length)
		Logger.sendMessage('download file for publishment url:' + currentUrl)
		var fileName = currentUrl.split('/').pop();
		//fileExistForPublish(downloadDir + fileName, function (error, data) {
			//if (data != null && data == true) {
				download(currentUrl, function (err, data) {
					if (err) {
						Logger.sendMessage("download  for publishment failed: " + (currentPubIndex + 1) + '/' + urlArray.length);
						Logger.sendMessage("download for publishment failed error:" + JSON.stringify(err));
						sendConsoleLog("download for publishment failed error:" + (currentPubIndex + 1) + JSON.stringify(err));
					} else {
						Logger.sendMessage('download for publishment complete: ' + (currentPubIndex + 1) + '/' + urlArray.length + ' 😃');
						sendConsoleLog("download for publishment complete: " + (currentPubIndex + 1) + "/" + urlArray.length);			
					}
					$(".download-bar").html("Downloading " + (currentPubIndex + 1) + "/" + urlArray.length);
					downloadForPublish(camePeriod);
				})
			//}
			/*else {
				Logger.sendMessage("download file exist! Go Next File: " + (currentPubIndex + 1) + '/' + urlArray.length)
				downloadForPublish(false)
			}*/
		//});
	}
	else {
		currentPubIndex = -1;
		Logger.sendMessage("download complated all files ✅");

		//this.fsync();
		setTimeout(function () {
			$("#screen-shot-image").hide();
		}, 2000);

		if(camePeriod == true)
		{

			this.readPulishmentFile("xxxyyyzzz"+".json").then(function (publishmentContent) {

				globalPublishment = JSON.parse(publishmentContent);
				
				var devicePublishmentName =  WebosSettings.value("Publishment/NewVersion","");
				
				if(devicePublishmentName == globalPublishment.publishmentName)
				{
					console.info("HERSEY YOLUNDA PUBLISHMENT ESIT");
					console.info("devicePublishmentName:",devicePublishmentName);
					console.info("globalPublishment.publishmentName:",globalPublishment.publishmentName);
					return;	
				}else{

					Logger.sendMessage("publishmentContent" + publishmentContent);
					urlArray = globalPublishment.filesUrlArray;
					Logger.sendMessage("publishmentContent urlArray" + urlArray);
					downloadedContentList = globalPublishment.filesUrlArray;
					fontUrlArray = globalPublishment.fontsUrlArray;
					downloadDir = contentsDir;
					downloadName = "";
					starting = false;
					$(".download-bar").show();
					downloadNext();
					downloadAction(fontUrlArray);

				}		

			})

		}else{

			if (downloadDir == publishmentsDir) {

				WebosSettings.setValue("Publishment/NewVersion", globalPublishmentName);
				WebosSettings.setValue("Publishment/OldVersion", globalPublishmentName);
				WebosSettings.setValue("Publishment/PublishmentUrl", globalPublishmentUrl);

				Logger.sendMessage("YENI PublishmentUrl ✅" +globalPublishmentUrl);
				Logger.sendMessage("YENI Publisment Download edildi ✅" +globalPublishmentName);

				if(cameCheckPublish == false)
				{

					Logger.sendMessage("YENI PUBLISMENT VAR ONUN DA ICERIKLERINI INDIRMEYE BASLAYAK✅");
					//getLastPublishment();
					this.readPulishmentFile(globalPublishmentName+".json").then(function (publishmentContent) {

						globalPublishment = JSON.parse(publishmentContent);
						Logger.sendMessage("publishmentContent" + publishmentContent);
						urlArray = globalPublishment.filesUrlArray;
						Logger.sendMessage("publishmentContent urlArray" + urlArray);
						downloadedContentList = globalPublishment.filesUrlArray;
						fontUrlArray = globalPublishment.fontsUrlArray;
						downloadDir = contentsDir;
						downloadName = "";
						starting = false;
						$(".download-bar").show();
						downloadNext();
						downloadAction(fontUrlArray);
						//showPlayer();
					})

				}else{

					Logger.sendMessage("SHOWWW PLAYERE publishmentsDir✅");
					showPlayer();
					//deleteNonListedFiles(downloadedContentList,contentsDir);
					cameCheckPublish = false;
					this.updatePublishmentDate();
				}
			
			} 
		}

		$(".download-bar").hide()
		listDir(publishmentsDir);
	}
}

function fileExistForPublish(files, callback) {
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

function downloadNext() {
    currentIndex++;
    if (currentIndex < urlArray.length) {
        var currentFile = urlArray[currentIndex];
        Logger.sendMessage('download start:' + 'download status:' + (currentIndex + 1) + '/' + urlArray.length);
        sendConsoleLog('download start:' + 'download status:' + (currentIndex + 1) + '/' + urlArray.length)
        Logger.sendMessage('download file url:' + currentFile.url);

        var fileName = getFileExtensionUrl(currentFile.url);
        var filePath = downloadDir + fileName;

		Logger.sendMessage('download fileName:' +fileName);
		Logger.sendMessage('download filePath:' +filePath);

        fileExists(filePath, currentFile.fileSize, function (fileExistsError, exists, mismatch) {
            if (fileExistsError || !exists || mismatch) {
                Logger.sendMessage("File does not exist or size mismatch, downloading: " + filePath);
                download(currentFile.url, function (downloadError, data) {
                    if (downloadError) {
                        Logger.sendMessage("Download failed: " + (currentIndex + 1) + '/' + urlArray.length);
                        Logger.sendMessage("Download failed:" + (currentIndex + 1) + "");
                        Logger.sendMessage("Download failed error:" + JSON.stringify(downloadError));
                        sendConsoleLog("Download failed error:" + (currentIndex + 1) + JSON.stringify(downloadError));

						currentIndex--;
						setTimeout(function() {	
							sendConsoleLog("Tekrar dene indirmeyi:"+currentFile.url);
							downloadNext();
						}, 1000);
                    } else {
                        Logger.sendMessage('Download complete: ' + (currentIndex + 1) + '/' + urlArray.length + ' 😃');
                        sendConsoleLog("Download complete: " + (currentIndex + 1) + "/" + urlArray.length);
                    }
                    $(".download-bar").html("Downloading " + (currentIndex + 1) + "/" + urlArray.length);
                    downloadNext();
                });
            } else {
                Logger.sendMessage("File exists and size matches: " + filePath);
                downloadNext();
            }
        });
    } else {
        currentIndex = -1;
        Logger.sendMessage("Download completed for all files ✅");

        setTimeout(function () {
            $("#screen-shot-image").hide();
        }, 2000);

		if (downloadDir == contentsDir) {

            if (starting) {
                Logger.sendMessage("Showing player starting ✅");
				starting = false;
                showPlayer();
                //deleteNonListedFiles(downloadedContentList, contentsDir);
                this.updatePublishmentDate();
            } 
			else if(cameCheckPublish == false)
			{
                Logger.sendMessage("CIHAZ KAPALI YADA ACIK IKEN YENI YAYIN GELDI Showing player starting ✅");
				cameCheckPublish = true;
                getPublishment();
				starting = false;
                showPlayer();
                //deleteNonListedFiles(downloadedContentList, contentsDir);
                this.updatePublishmentDate();
			}
			else {
                Logger.sendMessage("Checking for new publishment, downloading the publishment: ✅");
                cameCheckPublish = true;
                getPublishment();
            }
        }

        $(".download-bar").hide();
        listDir(publishmentsDir);
		listDir(fontsDir);

    }
}

// Dosya uzantısını alma fonksiyonu
/*
function getFileExtension(filename) {
    return filename.split('.').pop();
}
*/
// Dosya boyutu uyumsuzsa true döndürür
// Dosya boyutu uyumsuzsa true döndürür
function fileSizeMismatch(filePath, expectedSize, callback) {
    var successCb = function (cbObject) {
        Logger.sendMessage("Show File Size " + cbObject.size);
        if (cbObject.size != expectedSize) {
            Logger.sendMessage("File size mismatch: " + filePath);
            callback(true);
        } else {
            callback(false);
        }
    };

    var failureCb = function (cbObject) {
        var errorCode = cbObject.errorCode;
        var errorText = cbObject.errorText;
        Logger.sendMessage(" Error Code [" + errorCode + "]: " + errorText);
        callback(true);
    };

    var options = {
        path: filePath,
    };

    var storage = new Storage();
    storage.statFile(successCb, failureCb, options);
}


function fileExists(filePath, fileSize, callback) {
    var successCb = function (cbObject) {
        var exists = cbObject.exists;
        if (exists) {
            fileSizeMismatch(filePath, fileSize, function (mismatch) {
                callback(null, exists, mismatch);
            });
        } else {
            callback(null, exists, false);
        }
    };

    var failureCb = function (cbObject) {
        callback(cbObject, null, false);
    };

    var options = {
        path: filePath
    };

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
	Logger.sendMessage("Receive Command status:" + commands.status, "");

	if (commands.command === commandMessage.Player_Register) {
		Logger.sendMessage("Receive commandMessage.Player_Register ");
		WebosSettings.setValue("PlayerSettings/status", commands.status);

		var iframe = document.getElementById('login').getElementsByTagName('iframe')[0];
		var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
		
		iframeDocument.getElementsByClassName('debug-bar')[0].textContent= JSON.stringify(commands)+ "-Privatekey:" +webOsMacAdress;

		Logger.sendMessage("Receive commandMessage.Player_Register "+JSON.stringify(commands));

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
			sendSignal(commandMessage.Get_Publishment, isGetPublishment);
		}else{

			Logger.sendMessage("ERRORRRR"+commands.message);

			Logger.sendMessage("ERRORRRR"+JSON.stringify(commands.message));

			var iframe = document.getElementById('login').getElementsByTagName('iframe')[0];
			var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
			
			iframeDocument.getElementsByClassName('debug-bar')[0].textContent= commands.message+ "Privatekey:" +webOsMacAdress;
			//iframeDocument.getElementsByClassName('debug-bar')[0].show();
		}

	} else if (commands.command === commandMessage.Check_Publishment) {
		sendConsoleLog("Receive Command:" + commands.command);
		Logger.sendMessage("commandMessage.Check_Publishment"+ JSON.stringify(commands));

		var temp = WebosSettings.value("Publishment/NewVersion", "");
		var playerStatus = WebosSettings.value("PlayerSettings/status", "");

		if (temp == "" && playerStatus == true) {
			Logger.sendMessage("Player ilk kez ayaga kalkiyor ve yayini indirmeli:", commands);
			//WebosSettings.setValue("Publishment/NewVersion", commands.jsonData.publishmentName);
			//WebosSettings.setValue("Publishment/OldVersion", commands.jsonData.publishmentName);
			fetchPublishment(commands.jsonData.publishmentData);
		}

		if (temp != commands.jsonData.publishmentName && playerStatus == true) {
			Logger.sendMessage("Publisment dosyasi indiriliyor:", commands);
			//WebosSettings.setValue("Publishment/NewVersion", commands.jsonData.publishmentName);
			//WebosSettings.setValue("Publishment/OldVersion", commands.jsonData.publishmentName);
			fetchPublishment(commands.jsonData.publishmentData);
		} else {
			if(cameCheckPublish == false)
			{
				fetchPublishment(commands.jsonData.publishmentData);

			}else{
				Logger.sendMessage("DEVAMKEEEE :)");
			}		
		}

	} else if (commands.command === commandMessage.WinScreenShotRequest) {
		sendConsoleLog("Receive Command:" + commands.command);
		Logger.sendMessage("WinScreenShotRequest");
		WebosDevice.screenShot(false, true);
	}
	else if (commands.command === commandMessage.Player_Restart) {
		sendConsoleLog("Receive Command:" + commands.command);
		Logger.sendMessage("Player_Restart");
		WebosDevice.deviceRestart();
	}
	else if (commands.command === commandMessage.Player_Shutdown) {
		sendConsoleLog("Receive Command:" + commands.command);
		Logger.sendMessage("Player_Shutdown");
		WebosDevice.deviceShutDown();
	}
	else if (commands.command === commandMessage.Check_Upgrade) {
		sendConsoleLog("Receive Command:" + commands.command);
		Logger.sendMessage("Check_Upgrade");
		WebosDevice.upgradeIpkApplication();
	}
	else if (commands.command === commandMessage.PlayerDeleted) {
		sendConsoleLog("Receive Command:" + commands.command);

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
	else if (commands.command === commandMessage.GetSchedules) {
		Logger.sendMessage("GetSchedules");
		writefileScheduleJSON(commands.jsonData,"schedule");
	}
	else if (commands.command === commandMessage.AppRestart) {
		sendConsoleLog("Receive Command:" + commands.command);

		Logger.sendMessage("AppRestart");
		WebosDevice.restartApplication();
	}
	else if (commands.command === commandMessage.GetNewsData)
	{
		console.info("Player GetNewsData geldi"); 
		setForKey(globalPublishment.templates[0].frames, "news",  "tagId","contents",commands.jsonData.tagId, commands.jsonData.content, function(response) {
		if (response) {
			console.log("Okk GetNewsData kardi");
			changeActiveDatas = true;
		} else {
			console.log("GetNewsData zaten yeni veri ile ayni. Değişiklik yapilmadi.");     
		}
		});
	}
	else if (commands.command === commandMessage.GetWeatherForecast)
	{
		console.info("Player GetWeatherForecast Ayarlari geldi"); 
		setWeatherForecast(commands.jsonData);
	}
	else if (commands.command === commandMessage.GetCurrencies)
	{
		console.info("Player GetCurrencies Ayarlari geldi"); 
		setForKey(globalPublishment.templates[0].frames, "currency",  "currencyId","currencyValue",commands.jsonData.currencyId, commands.jsonData.currencyValue, function(response) {
		if (response) {
			console.log("Okk GetCurrencies kardi");
			changeActiveDatas = true;
		} else {
			console.log("CurrencyValue zaten yeni veri ile ayni. Değişiklik yapilmadi.");     
		}
		});
	
	}
	else if (commands.command === commandMessage.PlayerSettingsHere) {
		sendConsoleLog("Receive Command:" + commands.command);

		Logger.sendMessage("PlayerSettingsHere:" + JSON.stringify(commands));
		if (webOsHardwareVersion >= "3.0") {
			Logger.sendMessage("Rotate Setleniyor:" + JSON.stringify(commands));
			WebosDevice.setRotate(commands.jsonData.rotation);
		}
		if (webOsHardwareVersion >= "2.0") {
			if(commands.jsonData.isSync == true)
			{
				Logger.sendMessage("Sync setleniyor" + JSON.stringify(commands));
				sendConsoleLog("Sync setleniyor" + JSON.stringify(commands));
				
				WebosSettings.setValue("PlayerSettings/isSync",commands.jsonData.isSync);
				WebosSettings.setValue("PlayerSettings/isMaster",commands.jsonData.isMaster);
				WebosSettings.setValue("PlayerSettings/syncMasterIp",commands.jsonData.syncMasterIp);
				WebosSettings.setValue("PlayerSettings/syncMasterPort",commands.jsonData.syncMasterPort);
				WebosSettings.setValue("PlayerSettings/privateKey",commands.jsonData.privateKey);

				StartSyncAction();
			}else{
				Logger.sendMessage("Sync FALSE setleniyor" + JSON.stringify(commands));

				WebosSettings.setValue("PlayerSettings/isSync",commands.jsonData.isSync);
				WebosSettings.setValue("PlayerSettings/isMaster",commands.jsonData.isMaster);
				WebosSettings.setValue("PlayerSettings/syncMasterIp",commands.jsonData.syncMasterIp);
				WebosSettings.setValue("PlayerSettings/syncMasterPort",commands.jsonData.syncMasterPort);
				WebosSettings.setValue("PlayerSettings/privateKey",commands.jsonData.privateKey);

			}
		}

		if(commands.jsonData.isWifi == "true")
		{
			Logger.sendMessage("Wifi setleniyor" + JSON.stringify(commands));
			sendConsoleLog("Wifi setleniyor" + JSON.stringify(commands));
			
			WebosSettings.setValue("PlayerSettings/isWifi",commands.jsonData.isWifi);
			WebosSettings.setValue("PlayerSettings/wifiName",commands.jsonData.wifiName);
			WebosSettings.setValue("PlayerSettings/wifiPassword",commands.jsonData.wifiPassword);
			WebosDevice.connectWifi(commands.jsonData.wifiName,commands.jsonData.wifiPassword);
		}else{
			Logger.sendMessage("Wifi FALSE setleniyor" + JSON.stringify(commands));

			WebosSettings.setValue("PlayerSettings/isWifi",commands.jsonData.isWifi);
			WebosSettings.setValue("PlayerSettings/wifiName",commands.jsonData.wifiName);
			WebosSettings.setValue("PlayerSettings/wifiPassword",commands.jsonData.wifiPassword);

		}
		//WebosDevice.setUiTile(false); //sonra acilabilir.      
	}
	else if (commands.command === commandMessage.Sys_Info) {
		Logger.sendMessage(" Receive commandMessage.Sys_Info"+ JSON.stringify(commands));
	}
	else if (commands.command === commandMessage.Get_Publishment) {
		sendConsoleLog("Receive Command:" + commands.command);
		Logger.sendMessage("Receive GetPublishment:"+ JSON.stringify(commands));
		receive_Publishment(commands);
	}
	else if (commands.command === commandMessage.ServerSettingsHere) {
		sendConsoleLog("Receive Command:" + commands.command);
		Logger.sendMessage("Receive ServerSettingsHere:"+ JSON.stringify(commands));
		WebosDevice.setServerProperty(commands.jsonData);
	}
	else if (commands.command === commandMessage.PublishmentDelete) {
		sendConsoleLog("Receive Command:" + commands.command);

		Logger.sendMessage(" Receive PublishmentDelete", JSON.stringify(commands));

		var path = contentsDir;
		Logger.sendMessage('rmdir path' + path);
		fs.rmdir(path, { recursive: true }, function (error, data) {
			if (error)
				return Logger.sendMessage('error', error);
			Logger.sendMessage('data' + data);
		})
	}

	else {
		Logger.sendMessage("UNKNOWN Command");
	}

}
function showPlayer() {

	Logger.sendMessage("showPlayer :)");
	sendConsoleLog("showPlayer :)");

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
	urlArray = readPublishment.filesUrlArray;
	fontUrlArray = readPublishment.fontsUrlArray;
	downloadedContentList = readPublishment.filesUrlArray;
	downloadDir = contentsDir;
	downloadName = "";
	$(".download-bar").show();
	downloadNext();
	downloadAction(fontUrlArray);
	Logger.sendMessage("fetchPublishment download baslayacak");

}

function checkPublishment() {
	fs.ls(defaultDir + 'publishments', function (error, data) {
		if (error) {
			Logger.sendMessage('publishments file not found -'+ error);
			fs.mkdir(defaultDir + 'publishments/', function (error, data) {
				if (error) {
					Logger.sendMessage('publishments dir not created -'+ error);
				}
				else {
					Logger.sendMessage('publishments dir created +'+ publishmentsDir);
				}
			});
		}
	});

	fs.ls(defaultDir + 'contents', function (error, data) {
		if (error) {
			Logger.sendMessage('contents file not found -'+ error);

			fs.mkdir(defaultDir + 'contents/', function (error, data) {
				if (error) {
					Logger.sendMessage('contents dir not created -'+ error);
				}
				else {
					Logger.sendMessage('contents dir created +'+ contentsDir);
				}
			});
		}
	});

	fs.ls(defaultDir + 'fonts', function (error, data) {
		if (error) {
			Logger.sendMessage('fonts file not found -'+ error);

			fs.mkdir(defaultDir + 'fonts/', function (error, data) {
				if (error) {
					Logger.sendMessage('fonts dir not created -'+ error);
				}
				else {
					Logger.sendMessage('fonts dir created +'+ fontsDir);
				}
			});
		}
	});

	fs.ls(defaultDir + 'schedule', function (error, data) {
		if (error) {
			Logger.sendMessage('schedule file not found -'+ error);

			fs.mkdir(defaultDir + 'schedule/', function (error, data) {
				if (error) {
					Logger.sendMessage('schedule dir not created -'+ error);

					IsHere(scheduleDir + "/" + "schedule.json", function(exists) {
						if (exists) {
							console.warn("schedule Dosya zaten mevcut.");
							readfileScheduleJSON("schedule");
						} else {
							console.warn("schedule create ediiliyor : ");
							newDefaultSchedule(function(result) {
								writefileScheduleJSON(result,"schedule");
								globalScheduleData = JSON.parse(result);
								console.log(result); 
							});
						}
					});
				}
				else {
					Logger.sendMessage('schedule dir created +'+ fontsDir);
					console.warn("scheduleç.json create ediiliyor : ");
					newDefaultSchedule(function(result) {
						writefileScheduleJSON(result,"schedule");
						console.log(result); 
					});
				}
			});
		}else{

			readfileScheduleJSON("schedule");

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
	}, 30000);

}

function checkSocketConnection() {

	setInterval(function () {
		Logger.sendMessage("checkSocketConnection");
		if (getConnectionState() == false) {
			
			Logger.sendMessage("socke tekrar baslasin amqq");
			scheduleReconnect();
		}

	}, 10000);

}

function sendSystemInfoInterval() {
	
	sendSystemInfo();

	setInterval(function () {
		sendSystemInfo()
	},  30*60*1000);

}

function sendSystemInfo() {

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
		appVersion: webosAppVersion,
		customerId: WebosSettings.value("Customer/id", "")

	}
	if(webosIsRegister == true)
		sendSignal(commandMessage.Sys_Info, systemInfData);
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

	var temp2 = [];
	temp2[0] = publishment.jsonData.fontsUrlArray;
	fontUrlArray = temp2; //guncelle

	Logger.sendMessage("BURASI ONEMLI receive_Publishment URL: " + urlArray);

	devicePublishment = WebosSettings.value("Publishment/NewVersion", "");
	Logger.sendMessage("BURASI ONEMLI devicePublishment: " + devicePublishment);

	if(devicePublishment != publishment.jsonData.publishmentName)
	{
		globalPublishmentUrl = publishment.jsonData.publishmentUrl;
		globalPublishmentName = publishment.jsonData.publishmentName;
		downloadDir = publishmentsDir;
		downloadName = publishment.jsonData.publishmentName + ".json";
		downloadForPublish(false);
		downloadAction(fontUrlArray);
	}else{
		Logger.sendMessage("Get Publishment sonrasi DEVAM KE : " + devicePublishment);
	}

}

function readPulishmentFile(fileName) {
	return new Promise(function (resolve, reject) {
		//listDir(publishmentsDir);

		var rawFile = new XMLHttpRequest();
		rawFile.open("GET", "./content/publishments/" + fileName, true);
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

function updatePublishmentDate() {
	var updatePublishment = {
		playerCode: "",
		privateKey: webOsMacAdress,
		publicKey: webOsMacAdress,
		playerId: WebosSettings.value("PlayerSettings/playerId", ""),
		playerName: webOsModelName,
		customerId: WebosSettings.value("Customer/id", "")
	}
	sendSignal(commandMessage.Update_Publisment_Date, updatePublishment);
}

function sendConsoleLog(log) {
    console.log("sendConsoleLog",log);
    var sendLogs = {
      customerid : WebosSettings.value("Customer/id", ""),
      playerId : WebosSettings.value("PlayerSettings/playerId", ""),
      logs: JSON.stringify(log)
    }
    sendSignal(commandMessage.ConsoleLogging, sendLogs);    
}

function StartSyncAction() {
    console.log("StartSyncAction");

	webosIsSync = WebosSettings.value("PlayerSettings/isSync","");
	webosIsMaster = WebosSettings.value("PlayerSettings/isMaster","");
	webosSyncMasterIp = WebosSettings.value("PlayerSettings/syncMasterIp","");
	webosSyncMasterPort = WebosSettings.value("PlayerSettings/syncMasterPort","");
	isMac = WebosSettings.value("PlayerSettings/privateKey","");

	console.log("StartSyncAction webosIsSync"+webosIsSync);

	if(webosIsSync == "true" && webosSyncMasterIp != "" && webosSyncMasterPort != "")
	{
		console.log("StartSyncAction webosIsSync"+webosIsSync);
		console.log("StartSyncAction webosIsMaster"+webosIsMaster);
		console.log("StartSyncAction webosSyncMasterIp"+webosSyncMasterIp);
		console.log("StartSyncAction webosSyncMasterPort"+webosSyncMasterPort);
		console.log("StartSyncAction isMac "+isMac);

		if(webosIsMaster == "true")
		{
			console.log("StartSyncAction: webosIsMaster");
			webosServiceIsHere(webosSyncMasterIp,webosSyncMasterPort,webosIsMaster,isMac)
		}else{
			console.log("StartSyncAction: webosIsSlave");
			webosServiceIsHere(webosSyncMasterIp,webosSyncMasterPort,webosIsMaster,isMac)
		}
	}else{

		console.log("StartSyncAction: NOT ACTIVE");

	}

}

function getLastPublishment() {
    console.log("getLastPublishment");
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

function checkPeriodPublishment() {

	setInterval(function () {
		Logger.sendMessage("checkPeriodPublishment ----getPublishment");
		//getPublishment();

		var temp = [];
		temp[0] = WebosSettings.value("Publishment/PublishmentUrl","");
		urlArray = temp; //guncelle

		Logger.sendMessage("checkPeriodPublishment ----getPublishment"+urlArray);

		downloadDir = publishmentsDir;
		downloadName = "xxxyyyzzz" + ".json";
		downloadForPublish(true);

	}, 6*60*1000); //5dk da bir
}

function getFileExtensionUrl(url) {
    var parts = url.split('/');
    return parts[parts.length - 1];
}

function deleteNonListedFiles(urlList, basePath) {
    var existingFiles = "";
	Logger.sendMessage("deleteNonListedFiles");
	Logger.sendMessage("deleteNonListedFiles path:"+basePath);
	Logger.sendMessage("deleteNonListedFiles urlList:"+urlList);

	fs.ls(basePath, function (error, data) {
		if (error)
			return Logger.sendMessage('error', error);

		Logger.sendMessage("List Files:" + JSON.stringify(data));
		
		existingFiles = data;
		
		for (var i = 0; i < existingFiles.length; i++) {
			var file = existingFiles[i].name;
			var filePath = basePath + file;
			var found = false;
	
			for (var j = 0; j < urlList.length; j++) {
				if (getFileExtensionUrl(urlList[j].url) === file) {
					found = true;
					break;
				}
			}
	
			if (!found) {
				WebosDevice.removeFile(filePath);
				Logger.sendMessage('URL listesinde olmayan dosya silenecek: ' +filePath);
			}
		}

		listDir(contentsDir);

	})
}
//************************WIDGET LAR **********************/
function readPublishmentForMessage() {

	console.info('readPublishmentForMessage:',JSON.stringify(globalPublishment));
	weatherActive = checkForKey(globalPublishment.templates[0].frames, "weather","locationId");
	//newsActive = checkForKey(publishment.templates[0].frames, "news","tagId");
	currencyActive = checkForKey(globalPublishment.templates[0].frames, "currency","currencyId");

	console.log("checkForKey weatherActive:"+weatherActive);
	console.log("checkForKey newsActive:"+newsActive);
	console.log("checkForKey currencyActive:"+currencyActive);
	
  }

function randomInRange(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getCurrency(id) {
	
	console.log("getCurrency");
	var getCurrency = {
	  customerId : WebosSettings.value("Customer/id", ""),
	  playerId : WebosSettings.value("PlayerSettings/playerId", ""),
	  privateKey: webOsMacAdress,
	  currencyId: id,
	  direction: 'Buy',
	  digit: '2'
	}
	
	sendSignal(commandMessage.GetCurrencies, getCurrency);
  }
  
  function getWeather(id) {
	  
	console.log("GetWeatherForecast");
	var getWeather = {
		customerId : WebosSettings.value("Customer/id", ""),
		playerId : WebosSettings.value("PlayerSettings/playerId", ""),
		privateKey: webOsMacAdress,
	  	locationId: id
	}
	sendSignal(commandMessage.GetWeatherForecast, getWeather);
  }
  
  function getNewsData(id) {
	  
	console.log("GetNewsData");
  
	var getNewsData = {
		customerId : WebosSettings.value("Customer/id", ""),
		playerId : WebosSettings.value("PlayerSettings/playerId", ""),
		privateKey: webOsMacAdress,
		tagId: id,
		count: '1',
		dayLimit: '0'
	}
	sendSignal(commandMessage.GetNewsData, getNewsData);
  }

  function checkForKey(frameData, checkValue, property) {
    var found = false;
    for (var i = 0; i < frameData.length; i++) {
        var frame = frameData[i];
        if (frame.playlists) {
            for (var j = 0; j < frame.playlists.length; j++) {
                var playlist = frame.playlists[j];
                if (playlist.contents) {
                    for (var k = 0; k < playlist.contents.length; k++) {
                        var content = playlist.contents[k];
                        if (content.type && content.type === checkValue && content.contentProperties) {
                            for (var l = 0; l < content.contentProperties.length; l++) {
                                var prop = content.contentProperties[l];
                                if (prop.name === property) {
                                    console.log("Found " + property + ": " + prop.value);
                                    if (checkValue == "weather") {
                                        setTimeout(function() {
                                            if (!weatherOneRequest) {
                                                getWeather(prop.value);
                                                weatherOneRequest = true;
                                            }
                                        }, randomInRange(5, 15) * 1000);

                                    } else if (checkValue == "news") {
                                        setTimeout(function() {
                                            getNewsData(prop.value);
                                        }, randomInRange(5, 15) * 1000);

                                    } else {
                                        setTimeout(function() {
                                            getCurrency(prop.value);
                                        }, randomInRange(5, 15) * 1000);
                                    }
                                    found = true;
                                    break;
                                }
                            }
                        }
                        if (found) break;
                    }
                }
                if (found) break;
            }
        }
        if (found) break;
    }
    return found;
}

function setForKey(frameData, checkValue, property, value, currencyId, newData, callback) {
    var success = false;
    for (var i = 0; i < frameData.length; i++) {
        var frame = frameData[i];
        if (frame.playlists) {
            for (var j = 0; j < frame.playlists.length; j++) {
                var playlist = frame.playlists[j];
                if (playlist.contents) {
                    for (var k = 0; k < playlist.contents.length; k++) {
                        var content = playlist.contents[k];
                        if (content.type && content.type === checkValue && content.contentProperties) {
                            var propId = null;
                            var propValue = null;
                            for (var l = 0; l < content.contentProperties.length; l++) {
                                var prop = content.contentProperties[l];
                                if (prop.name === property && prop.value === currencyId) {
                                    propId = prop;
                                }
                                if (prop.name === value) {
                                    propValue = prop;
                                }
                            }
                            if (propId && propValue) {
                                console.log("Found " + property + ": " + propId.value);
                                // Değerin kontrolü
                                if (propValue.value !== newData) {
                                    // Yeni değerin atanması
                                    propValue.value = newData;
                                    console.log("Set " + value + " to " + newData);
                                    success = true;
                                } else {
                                    console.log("CurrencyValue is already equal to " + newData + ". No change made.");
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    // Geri çağrı fonksiyonunu çağırma
    if (callback && typeof callback === 'function') {
        callback(success);
    }
}

function SetForKeyWeather(frameData, contentType, contentPropName, changeValue, changeType, dayValue, callback) {
    var success = false;
    for (var i = 0; i < frameData.length; i++) {
        var frame = frameData[i];
        if (frame.playlists) {
            for (var j = 0; j < frame.playlists.length; j++) {
                var playlist = frame.playlists[j];
                if (playlist.contents) {
                    for (var k = 0; k < playlist.contents.length; k++) {
                        var content = playlist.contents[k];
                        if (content.type && content.type === contentType) {
                            //console.log("Playlist '" + playlist.name + "' icinde '" + contentType + "' turunde icerik bulundu.");
                            if (content.contentProperties) {
                                var propValue = null;
                                var propType = null;
                                var propDay = null;
                                for (var l = 0; l < content.contentProperties.length; l++) {
                                    var prop = content.contentProperties[l];
                                    if (prop.name === contentPropName) {
                                        propValue = prop;
                                    } else if (prop.name === 'type' && prop.value === changeType) {
                                        propType = prop;
                                    } else if (prop.name === 'day' && prop.value === dayValue) {
                                        propDay = prop;
                                    }
                                }
                                if (propValue && propType && propDay) {
                                    console.log("Ozellik bulundu: '" + propValue.name + "' degeri '" + propValue.value + "', type '" + propType.value + "' ve day '" + propDay.value + "'");
                                    if (propValue.value !== changeValue) {
                                        propValue.value = changeValue;
                                        console.log("'" + contentPropName + "' degeri '" + changeValue + "' olarak ayarlandi.");
                                        success = true;
                                    } else {
                                        console.log("'" + contentPropName + "' zaten '" + changeValue + "' degerine esit. Degisiklik yapilmadi.");
                                    }
                                } else {
                                    if (!propType) {
                                        //console.log("type '" + changeType + "' degeri bulunamadi.");
                                    }
                                    if (!propValue) {
                                        //console.log("contentPropName '" + contentPropName + "' degeri bulunamadi.");
                                    }
                                    if (!propDay) {
                                        //console.log("day '" + dayValue + "' degeri bulunamadi.");
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    callback(success);
}


function setWeatherForecast(weatherArray) {
    for (var index = 0; index < weatherArray.length; index++) {
        var item = weatherArray[index];
        var date = item.date;
        var min = item.min;
        var max = item.max;
        var icon = item.icon;
        var dayValue = (index + 1).toString(); // Day değerini ayarlama

	// "date" degeri icin ayarlama
	SetForKeyWeather(globalPublishment.templates[0].frames, "weather", "weatherValue", date, "date", dayValue, function(response) {
		if (response) {
			console.log("date WeatherForecast degeri degistirildi");
			changeActiveDatas = true;
		} else {
			console.log("date WeatherForecast zaten yeni veri ile ayni. Degisiklik yapilmadi.");
		}
	});

	// "min" degeri icin ayarlama
	SetForKeyWeather(globalPublishment.templates[0].frames, "weather", "weatherValue", min, "min", dayValue, function(response) {
		if (response) {
			console.log("min WeatherForecast degeri degistirildi");
			changeActiveDatas = true;
		} else {
			console.log("min WeatherForecast zaten yeni veri ile ayni. Degisiklik yapilmadi.");
		}
	});

	// "max" degeri icin ayarlama
	SetForKeyWeather(globalPublishment.templates[0].frames, "weather", "weatherValue", max, "max", dayValue, function(response) {
		if (response) {
			console.log("max WeatherForecast degeri degistirildi");
			changeActiveDatas = true;
		} else {
			console.log("max WeatherForecast zaten yeni veri ile ayni. Degisiklik yapilmadi.");
		}
	});

	// "icon" degeri icin ayarlama
	SetForKeyWeather(globalPublishment.templates[0].frames, "weather", "weatherValue", icon, "icon", dayValue, function(response) {
		if (response) {
			console.log("icon WeatherForecast degeri degistirildi");
			changeActiveDatas = true;
		} else {
			console.log("icon WeatherForecast zaten yeni veri ile ayni. Degisiklik yapilmadi.");
		}
	});

	// Min, max, icon ve date degerleri ile islem yapma
	console.log("Date: " + date + ", Min: " + min + ", Max: " + max + ", Icon: " + icon + ", Day: " + dayValue);

    }
}


// "min" değeri için ay

  
  function checksendNewDataShowUi() {
	
	setInterval(function()  {

		console.log("*********checksendNewDataShowUi************");

		if (changeActiveDatas === true) {
		console.log("************sendNewDataShowUi gönderildi*************");
		changeActiveDatas = false;

		var Data = globalPublishment;
		var initPlayer = { "MessageType": "initPlayer", "Data": { "filePath": "./content/contents/", "videoMode": "0" } }
		
		Start_Handler.receiveMessage(initPlayer);
		
		var jsonData = {
			"MessageType": "startPublishment", "Data": Data
		};

		Start_Handler.receiveMessage(jsonData);;
		
		}
	}, 50000); //40 sn 

  }
  
  function checkOnlinePeriodDatas() {

	setInterval(function() {
		console.log("checkOnlinePeriodDatas");

	  if (weatherActive === true || newsActive === true || currencyActive === true) {
		console.log("checkOnlinePeriodDatas gönderildi");
		weatherOneRequest = false;

		weatherActive = checkForKey(globalPublishment.templates[0].frames, "weather", "locationId");
		//newsActive = checkForKey(globalPublishment.templates[0].frames, "news", "tagId");
		currencyActive = checkForKey(globalPublishment.templates[0].frames, "currency", "currencyId");
  
		console.log("checkForKey weatherActive:" + weatherActive);
		console.log("checkForKey newsActive:" + newsActive);
		console.log("checkForKey currencyActive:" + currencyActive);
	  }
	}, 120 * 60 * 1000); //2 saate bir kontrol et
  }
  
  function startForSync() {
	console.log("*********startForSync************");
	  var Data = globalPublishment;
	  var initPlayer = { "MessageType": "initPlayer", "Data": { "filePath": "./content/contents/", "videoMode": "0" } }
	  
	  Start_Handler.receiveMessage(initPlayer);
	  
	  var jsonData = {
		  "MessageType": "startPublishment", "Data": Data
	  };

	  Start_Handler.receiveMessage(jsonData);;
		
  }

  function checkForPlayStartEndSync() {
	
	webosIsSync = WebosSettings.value("PlayerSettings/isSync","");
	webosIsMaster = WebosSettings.value("PlayerSettings/isMaster","");

	if(webosIsSync == "true" && webosIsMaster == "true" )
	{
		console.log("*********checkForPlayStartEndSync************");
		MessageSendMaster({
			cmd: "begin",
		  });
	}  				
}

function downloadAction(data) {
    console.warn("downloadAction FONT: " + data);

    for (var index = 0; index < data.length; index++) {
        var urlObj = data[index];
        var url = urlObj.url;

		var parts = url.split(".");
		fontExtension = parts[parts.length - 1];

		var name = urlObj.title + "."+fontExtension;

        console.warn("Font Dosya uzantisi adi: " + name);

        IsHere(fontsDir + "/" + name, function(exists) {
            if (exists) {
                console.warn("FONT Dosya zaten mevcut.");
            } else {
                console.warn("FONT İndiriliyor: " + url);
                downloadFile(url, fontsDir, name, function(error, data) {
                    if (error) {
                        console.error("FONT İndirme sirasinda bir hata oluştu:", error);
                    } else {
                        console.log("FONT Dosya başariyla indirildi:", data);
                    }
                });
            }
        });
    }
}

function fsync() {
	// Failure callback function for copyFile() method.
	var failureCb = function (cbObject) {
		var errorCode = cbObject.errorCode;
		var errorText = cbObject.errorText;
		console.log(" Error Code [" + errorCode + "]: " + errorText);
	};
	
	var storage = new Storage();

	storage.fsync(
		// Success callback function of fsync() method
		function () {
			console.log("File synched!!!!!!!!!!");
		},
		failureCb, {} // No parameter given to fsync()
	);

}
	
function downloadFile(url, path,name) {
	downloader.start({
		url: url,
		path: path,
		filename: name
	}, function (error, data) {
		callback(error, data)
	});
}

function IsHere(path, callback) {
    var successCb = function (cbObject) {
        var exists = cbObject.exists;
        console.log("Dosya mevcut: " + exists);
        callback(exists);
    };

    var failureCb = function (cbObject) {
        var errorCode = cbObject.errorCode;
        var errorText = cbObject.errorText;
        console.log(" Hata Kodu [" + errorCode + "]: " + errorText);
        callback(false);
    };

    var options = path;

    var storage = new Storage();
    storage.exists(successCb, failureCb, options);
}

function connecttoWifi() {

sendConsoleLog("Wifi setlenecek");
console.log("Wifi setlenecek");

var IsWifiActive = WebosSettings.value("PlayerSettings/isWifi","");
console.log("Wifi IsWifiActive:"+IsWifiActive);

	sendConsoleLog("Wifi setleniyor2");
	console.log("Wifi setleniyor2");
	var IswifiName = WebosSettings.value("PlayerSettings/wifiName","");
	var IswifiPassword = WebosSettings.value("PlayerSettings/wifiPassword","");

	console.log("Wifi setleniyor IswifiName "+IswifiName);
	console.log("Wifi setleniyor IswifiPassword"+IswifiPassword);

	WebosDevice.connectWifi("Akn","Y3fuNuEjhN");
}

function checkWifi() {

	setInterval(function () {
		Logger.sendMessage("checkIs WifiActive");

		Logger.sendMessage("**************SAAT***********:"+moment().format());

			
			var IsWifiActive = WebosSettings.value("PlayerSettings/isWifi","");

			Logger.sendMessage("IsWifiActive: "+IsWifiActive);

			if(IsWifiActive == "true")
			{	
				Logger.sendMessage("Wifi opening");
				var IswifiName = WebosSettings.value("PlayerSettings/wifiName","");
				var IswifiPassword = WebosSettings.value("PlayerSettings/wifiPassword","");
				
				Logger.sendMessage("Wifi setleniyor IswifiName="+IswifiName);
				Logger.sendMessage("Wifi setleniyor IswifiPassword="+IswifiPassword);
				WebosDevice.connectWifi(IswifiName,IswifiPassword);
			}
		
		//connecttoWifi();

	}, 15000);
}

function clearScreenInterval() {

	setInterval(function () {
		Logger.sendMessage("clearScreenInterval");
		$(".download-bar").hide()
		Logger.sendMessage("**************SAAT***********:"+moment().format());
	}, 60000);
}

function writefileScheduleJSON(data,filename) {

	globalScheduleData = data;
	Logger.sendMessage("data schedule" + data)
	var path = scheduleDir + filename + ".json";
	Logger.sendMessage("data schedule path" + path)

	fs.writeFile(path, JSON.stringify(data), function (error) {
		if (error)
			return Logger.sendMessage('error write json:' + error);
		else
			Logger.sendMessage('write schedule json data:' + data);
	})
}

function readfileScheduleJSON(filename) {

	Logger.sendMessage("readfileScheduleJSON");

	var path = scheduleDir + filename + ".json";
	Logger.sendMessage('read schedule file path:', path);
	fs.readFile(path, function (error, data) {
		if (error)
			return Logger.sendMessage('error write json:' + error);
		else
			Logger.sendMessage('read schedule json data:' + data);
			globalScheduleData = JSON.parse(data);
	});
}