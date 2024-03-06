//var deviceInfo = new DeviceInfo();
//var power = new Power();
//var signage = new Signage();
//var configuration = new Configuration();

var webOsModelName = "";
var webOsSerialNumber = ""; 
var webOsManufacturer = "";
var webOsMacAdress =  ""; 
var webOsTotalMemory = "";
var webOsUsedMemory = "";
var webOsHardwareVersion = "";
var webOsFirmwareVersion = "";

var isInternetActive = false;
var webOsIp = "";

var webosIsSync = false;
var webosIsMaster = false;
var webosSyncMasterIp = "";
var webosSyncMasterPort = "";
var globalVideoPath = "";

function WebosDevice ()  {
                     
}

WebosDevice.setRotate =  function(rotate){

    function successCb(cbObject) {
       
        Logger.sendMessage("setRotate edildi cbObject : " + JSON.stringify(cbObject));

    }
        
    function failureCb(cbObject) {
        var errorCode = cbObject.errorCode;
        var errorText = cbObject.errorText;
        
        Logger.sendMessage("setRotate Error Code [" + errorCode + "]: " + errorText);
    }

    var temp = Custom.NATIVEPORTRAIT.OFF;
    
    if(rotate == 0)
    {
        temp = Custom.NATIVEPORTRAIT.OFF;
    }else if (rotate == 90) {
        temp = Custom.NATIVEPORTRAIT.DEGREE_90;
    }
    else if (rotate == 180) {
        temp = Custom.NATIVEPORTRAIT.DEGREE_180;
    }
    else{
        temp = Custom.NATIVEPORTRAIT.DEGREE_270;
    }
     
    var options = {};
    options.nativePortrait = temp;     

    var custom = new Custom();
    custom.Configuration.setNativePortraitMode(successCb, failureCb, options);
    
} 

WebosDevice.getPlatformInfo =  function(){
		
    function successCb(cbObject) {
        Logger.sendMessage("[Platform Info] : " +cbObject.modelName);
        Logger.sendMessage("[Platform Info] : " +cbObject.serialNumber);
        Logger.sendMessage("[Platform Info] : " +cbObject.firmwareVersion);
        Logger.sendMessage("[Platform Info] : " +cbObject.hardwareVersion);
        Logger.sendMessage("[Platform Info] : " +cbObject.sdkVersion);
        Logger.sendMessage("[Platform Info] : " +cbObject.manufacturer);
        
        webOsFirmwareVersion = cbObject.firmwareVersion;
        //webOsHardwareVersion = cbObject.hardwareVersion; 
        webOsModelName = cbObject.modelName;
        webOsSerialNumber = cbObject.serialNumber;
        webOsManufacturer = cbObject.manufacturer;
        
    }
        
    function failureCb(cbObject) {
        var errorCode = cbObject.errorCode;
        var errorText = cbObject.errorText;
        
        Logger.sendMessage("getPlatformInfo Error Code [" + errorCode + "]: " + errorText);
    }

    var deviceInfo = new DeviceInfo();   
    deviceInfo.getPlatformInfo(successCb, failureCb);
} 

WebosDevice.getNetworkMacInfo = function () {
function successCb(cbObject) {
    Logger.sendMessage("cbObject : " + JSON.stringify(cbObject));
    Logger.sendMessage("wiredInfo.macAddress : " + cbObject.wiredInfo.macAddress);
    Logger.sendMessage("wifiInfo.macAddress : " + cbObject.wifiInfo.macAddress);

    if(cbObject.wiredInfo.macAddress == "")
    {
        webOsMacAdress = cbObject.wifiInfo.macAddress;
    }else{
        webOsMacAdress = cbObject.wiredInfo.macAddress;
    }
}

function failureCb(cbObject) {
    var errorCode = cbObject.errorCode;
    var errorText = cbObject.errorText;

    Logger.sendMessage("getNetworkMacInfo Error Code [" + errorCode + "]: " + errorText);
}
    var deviceInfo = new DeviceInfo();
    deviceInfo.getNetworkMacInfo(successCb, failureCb);
} 

WebosDevice.getNetworkInfo = function() {
    function successCb(cbObject) {
        Logger.sendMessage("[Network Info] : " + JSON.stringify(cbObject));
        isInternetActive = cbObject.isInternetConnectionAvailable;
        webOsIp = cbObject.wired.ipAddress; //sonra ac
    };
    
    function failureCb(cbObject) {
        var errorCode = cbObject.errorCode;
        var errorText = cbObject.errorText;
    
        Logger.sendMessage("getNetworkInfoError Code [" + errorCode + "]: " + errorText);
    };

    var deviceInfo = new DeviceInfo();
    deviceInfo.getNetworkInfo(successCb, failureCb);
} 

WebosDevice.deviceRestart = function () {
    Logger.sendMessage("deviceRestart edildi");

    var options = {};
    options.powerCommand = Power.PowerCommand.REBOOT;
    
    function successCb() {
        // Do something
        Logger.sendMessage("deviceRestart edildi");

    }
    
    function failureCb(cbObject) {
        var errorCode = cbObject.errorCode;
        var errorText = cbObject.errorText;
    
        Logger.sendMessage("deviceRestart Error Code [" + errorCode + "]: " + errorText);
    }
    
    var power = new Power();
    power.executePowerCommand(successCb, failureCb, options);

}

WebosDevice.deviceShutDown = function () {

    var options = {};
    options.powerCommand = Power.PowerCommand.SHUTDOWN;
    
    function successCb() {
        // Do something
    }
    
    function failureCb(cbObject) {
        var errorCode = cbObject.errorCode;
        var errorText = cbObject.errorText;
    
        Logger.sendMessage("deviceShutDown Error Code [" + errorCode + "]: " + errorText);
    }
    
    var power = new Power();
    power.executePowerCommand(successCb, failureCb, options);

} 

WebosDevice.deviceScreenOn = function () {

    var options = {};
    options.displayMode  = Power.DisplayMode.DISPLAY_ON;
    
    function successCb() {
        Logger.sendMessage("deviceScreenOn edildi");
    }
    
    function failureCb(cbObject) {
        var errorCode = cbObject.errorCode;
        var errorText = cbObject.errorText;
    
        Logger.sendMessage("deviceScreenOn Error Code [" + errorCode + "]: " + errorText);
    }
    
    var power = new Power();
    power.setDisplayMode(successCb, failureCb, options);

},

WebosDevice.deviceScreenOff = function () {

    var options = {};
    options.displayMode  = Power.DisplayMode.DISPLAY_OFF;
    
    function successCb() {
        Logger.sendMessage("deviceScreenOn edildi");
    }
    
    function failureCb(cbObject) {
        var errorCode = cbObject.errorCode;
        var errorText = cbObject.errorText;
    
        Logger.sendMessage("deviceScreenOff Error Code [" + errorCode + "]: " + errorText);
    }
    
    var power = new Power();
    power.setDisplayMode(successCb, failureCb, options);

} 

WebosDevice.restartApplication = function () {
    function successCb() {
        Logger.sendMessage("restart success : ");
    }
    
    function failureCb(cbObject) {
        var errorCode = cbObject.errorCode;
        var errorText = cbObject.errorText;
    
        Logger.sendMessage("restartApplication Error Code [" + errorCode + "]: " + errorText);
    }                
    var configuration = new Configuration();
    configuration.restartApplication(successCb, failureCb);
}

WebosDevice.setPortraitMode = function () {
    var options = {
        portraitMode: Signage.OsdPortraitMode.ON
    };
    
    var successCb = function () {
        Logger.sendMessage("Portrait Mode successfully Set");
    };
    
    var failureCb = function (cbObject) {
        var errorCode = cbObject.errorCode;
        var errorText = cbObject.errorText;
        Logger.sendMessage("setPortraitMode Error Code [" + errorCode + "]: " + errorText);
    };
    
    var signage = new Signage();
    signage.setPortraitMode(successCb, failureCb, options);
} 

WebosDevice.upgradeIpkApplication = function () {
    Logger.sendMessage("upgradeIpkApplication");
    var successCb = function () {
        Logger.sendMessage("IPK type app update successful");
        Logger.sendMessage("3 SN sonra restart");
        WebosDevice.deviceRestart();
    };
    
    var failureCb = function (cbObject) {
        var errorCode = cbObject.errorCode;
        var errorText = cbObject.errorText;
        Logger.sendMessage("upgradeIpkApplication Error Code [" + errorCode + "]: " + errorText);
    };
    
    var options = {
        type: Storage.AppType.IPK,
        to: Storage.AppMode.LOCAL,
        recovery: false
    };
    var storage = new Storage();
    storage.upgradeApplication(successCb, failureCb, options);
}

WebosDevice.screenShot = function (opt1,opt2) {
    Logger.sendMessage("screenShot start");

    var options = {};
    options.save = opt1;
    options.thumbnail = opt2;
    
    if(opt2)
        options.imgResolution = Signage.ImgResolution.FHD;
    
    var successCB = function (cbObject) {
        var size = cbObject.size;
        var encoding = cbObject.encoding;
        var data = cbObject.data;
        var capturedElement = "";
    
        Logger.sendMessage("Got Data size:" + size);
        Logger.sendMessage("Got Data encoding :" + encoding);
        Logger.sendMessage("Got Data :" + data);

        Logger.sendMessage("sendScreenShot",data);

        if(opt1 == true)
        {
            capturedElement = document.getElementById("screen-shot-image");
            capturedElement.src = 'data:image/jpeg;base64,' + data;
        }
     
        var playerInfo = {
            privateKey: webOsMacAdress,
            publicKey: webOsMacAdress,
            playerId: WebosSettings.value("PlayerSettings/playerId", ""),
            customerId: WebosSettings.value("Customer/id", ""),
            base64Image: data,
            screenResolution: '400x300',
        }

        if(opt1 == false)
            sendSignal(commandMessage.Win_ScreenShot, playerInfo);
    };
    
    var failureCB = function (cbObject) {
        var errorCode = cbObject.errorCode;
        var errorText = cbObject.errorText;
    
        Logger.sendMessage("screenShot Error Code [" + errorCode + "]: " + errorText);
    }
    
    var signage = new Signage();
    signage.captureScreen(successCB, failureCB, options);
}

WebosDevice.getSystemUsageInfo = function() {

    function successCb(cbObject) {
       Logger.sendMessage("cbObject : " + JSON.stringify(cbObject));
    
       Logger.sendMessage("memory.total : " + cbObject.memory.total);
       Logger.sendMessage("memory.used : " + cbObject.memory.used);
       Logger.sendMessage("memory.free : " + cbObject.memory.free);
       Logger.sendMessage("memory.buffer : " + cbObject.memory.buffer);
       Logger.sendMessage("memory.cached : " + cbObject.memory.cached);
    
       this.webOsTotalMemory = cbObject.memory.total;
       this.webOsUsedMemory = cbObject.memory.used;

        for (var i in cbObject.cpus) {
           Logger.sendMessage("cpu.model " + cbObject.cpus[i].model);
           Logger.sendMessage("cpu.times.user " + cbObject.cpus[i].times.user);
           Logger.sendMessage("cpu.times.nice " + cbObject.cpus[i].times.nice);
           Logger.sendMessage("cpu.times.sys " + cbObject.cpus[i].times.sys);
           Logger.sendMessage("cpu.times.idle " + cbObject.cpus[i].times.idle);
           Logger.sendMessage("cpu.times.irq " + cbObject.cpus[i].times.irq);
        }
    
        // Get usage information in percentage
        var cpus = cbObject.cpus;
        var memory = cbObject.memory;
        for (var i = 0, len = cpus.length; i < len; i++) {
           Logger.sendMessage("CPU %s:", i);
            var cpu = cpus[i],
                total = 0;
            for (type in cpu.times)
                total += cpu.times[type];
    
            for (type in cpu.times)
               Logger.sendMessage("	", type, Math.round(100 * cpu.times[type] / total));
        }
    
        var actualFree = memory.free + memory.buffer + memory.cached;
        //Actual memory usage ratio
       Logger.sendMessage("Memory: " + Math.round(100*((memory.total-actualFree)/memory.total))); 
    }
    
    function failureCb(cbObject) {
        var errorCode = cbObject.errorCode;
        var errorText = cbObject.errorText;
       Logger.sendMessage("getSystemUsageInfo Error Code [" + errorCode + "]: " + errorText);
    }
    
    var options = {
        cpus: true,
        memory: true
    };
    
    var deviceInfo = new DeviceInfo();
    deviceInfo.getSystemUsageInfo(successCb, failureCb, options);
}

WebosDevice.setUiTile = function(data) {
    Logger.sendMessage("Tile Info start ");

    var options = {
        tileInfo: {
            enabled: false,
            row : 1,
            column : 1,
            tileId: 1,
            naturalMode : true
        }
    };
        
    var successCb = function (){
    Logger.sendMessage("Tile Info successfully Set");
    }; 

    var failureCb = function(cbObject){ 
    var errorCode = cbObject.errorCode; 
    var errorText = cbObject.errorText; 
    Logger.sendMessage( "setUiTile Error Code [" + errorCode + "]: " + errorText); 
    };

    var signage = new Signage();
    signage.setTileInfo(successCb, failureCb, options);
    
}

WebosDevice.setMasterSync = function (dev_ip,dev_port) {
// Sets the master signage device.
var custom = new Custom();

    Logger.sendMessage('setMaster is : ' + dev_ip+"--"+dev_port +"--"+globalVideoPath);

    custom.VideoSync.setMaster(
        function successCallback(successObject) {
            Logger.sendMessage('setMaster successCallback is : ' + JSON.stringify(successObject));
        },
        function failureCallback(failureObject) {
            Logger.sendMessage('[' + failureObject.errorCode + '] ' + failureObject.errorText)
        },
        {
            ip : dev_ip,
            port :parseInt(dev_port),
            //Optional property when there are multiple video tags.
            videoElement : document.getElementById(globalVideoPath)
        }
    );

} 

WebosDevice.setSlaveSync = function (dev_ip,dev_port) {
// Sets the slave device.

Logger.sendMessage('setSlaveSync is : ' + dev_ip+"--"+dev_port +"--"+globalVideoPath);

var custom = new Custom();

    custom.VideoSync.setSlave(
        function successCallback(successObject) {
            Logger.sendMessage('setSlave is successfully run.'+JSON.stringify(successObject));
        },
        function failureCallback(failureObject) {
            Logger.sendMessage('[' + failureObject.errorCode + '] ' + failureObject.errorText)
        },
        {
            ip : dev_ip,
            port : parseInt(dev_port),
            // Value from Master device
            //Optional property when there are multiple video tags.
            videoElement : document.getElementById(globalVideoPath)
        }
    );
} 

WebosDevice.enableAllOffTimer = function () {

    var options = {};
    options.allOffTimer = true;
    options.clearOffTimer = true;

    function successCb(successObject) {
        Logger.sendMessage('enableAllOffTimer is successfully run.'+JSON.stringify(successObject));
    }

    function failureCb(cbObject) {
        var errorCode = cbObject.errorCode;
        var errorText = cbObject.errorText;

        Logger.sendMessage("Error Code [" + errorCode + "]: " + errorText);
    }

    var power = new Power();
    power.enableAllOffTimer(successCb, failureCb, options);

}

WebosDevice.setTimeZone = function () {

    function successCb(cbObject) {
        Logger.sendMessage('setTimeZone is successfully run.'+JSON.stringify(cbObject));
    }
    
    function failureCb(cbObject) {
        var errorCode = cbObject.errorCode;
        var errorText = cbObject.errorText;
        Logger.sendMessage("Error Code [" + errorCode + "]: " + errorText);
    }
    
    var timeZone = {
        continent: "Europe",
        country: "Turkey",
        city: "Istanbul"
    };
    var options = {
        timeZone: timeZone
    };
    
    var configuration = new Configuration();
    configuration.setTimeZone(successCb, failureCb, options);
        
}

WebosDevice.getTimeZone = function () {

    function successCb(cbObject) {
        Logger.sendMessage('getTimeZone is successfully run.'+JSON.stringify(cbObject));
        Logger.sendMessage("timeZone.continent : " + cbObject.timeZone.continent);
        Logger.sendMessage("timeZone.country : " + cbObject.timeZone.country);
        Logger.sendMessage("timeZone.city : " + cbObject.timeZone.city);
    }
    
    function failureCb(cbObject) {
        var errorCode = cbObject.errorCode;
        var errorText = cbObject.errorText;
        Logger.sendMessage("Error Code [" + errorCode + "]: " + errorText);
    }
        
    var configuration = new Configuration();
    configuration.getTimeZone(successCb, failureCb)
        
}

WebosDevice.setCurrentTime = function () {

    var options = {};
    options.year = 2024;
    options.month = 3;
    options.day = 4;
    options.hour = 14;
    options.minute = 40;
    options.sec = 50;
    options.ntp = true;
    options.ntpServerAddress = "";
    
    function successCb(cbObject) {
        Logger.sendMessage("setCurrentTime : " + JSON.stringify(cbObject));
   /*     if (webOsHardwareVersion == "4.0" || webOsHardwareVersion == "4.2" ) 
        Logger.sendMessage("setCurrentTime : " + JSON.stringify(cbObject));
        else*/
        this.WebosDevice.setTimeZone();
    }
    
    function failureCb(cbObject) {
        var errorCode = cbObject.errorCode;
        var errorText = cbObject.errorText;
    
        Logger.sendMessage("Error Code [" + errorCode + "]: " + errorText);
    }
    
    var configuration = new Configuration();
    configuration.setCurrentTime(successCb, failureCb, options);
}

WebosDevice.setPowerSaveMode = function () {

    var options = {
        powerSaveMode: {
            ses: false,
            dpmMode: Signage.DpmMode.OFF,
            automaticStandby: Signage.AutomaticStandbyMode.OFF,
            do15MinOff: false
        }
    };
    
    var successCb = function () {
        Logger.sendMessage("setPowerSaveMode successfully Set");
    };
    
    var failureCb = function (cbObject) {
        var errorCode = cbObject.errorCode;
        var errorText = cbObject.errorText;
        Logger.sendMessage(" Error Code [" + errorCode + "]: " + errorText);
    };
    
    var signage = new Signage();
    signage.setPowerSaveMode(successCb, failureCb, options);
}
    
    
    
