var deviceInfo = new DeviceInfo();
var power = new Power();
var screenShot = new Signage();


var webOsModelName = "";
var webOsSerialNumber = ""; 
var webOsManufacturer = "";
var webOsMacAdress =  ""; 
var isInternetActive = false;
var webOsIp = "";

let WebosDevice =  {

    getPlatformInfo : function(){
		
        function successCb(cbObject) {
            _log("[Platform Info] : " +cbObject.modelName);
            _log("[Platform Info] : " +cbObject.serialNumber);
            _log("[Platform Info] : " +cbObject.firmwareVersion);
            _log("[Platform Info] : " +cbObject.hardwareVersion);
            _log("[Platform Info] : " +cbObject.sdkVersion);
            _log("[Platform Info] : " +cbObject.manufacturer);
            
            webOsModelName = cbObject.modelName;
            webOsSerialNumber = cbObject.serialNumber;
            webOsManufacturer = cbObject.manufacturer;

        }
            
        function failureCb(cbObject) {
            var errorCode = cbObject.errorCode;
            var errorText = cbObject.errorText;
            
            _log("Error Code [" + errorCode + "]: " + errorText);
        }
            
        deviceInfo.getPlatformInfo(successCb, failureCb);
	},

    getNetworkMacInfo: function () {
    function successCb(cbObject) {
        _log("cbObject : " + JSON.stringify(cbObject));
        _log("wiredInfo.macAddress : " + cbObject.wiredInfo.macAddress);
        _log("wifiInfo.macAddress : " + cbObject.wifiInfo.macAddress);
        webOsMacAdress = cbObject.wiredInfo.macAddress;
        webOsMacAdress = cbObject.wifiInfo.macAddress;
    }
    
    function failureCb(cbObject) {
        var errorCode = cbObject.errorCode;
        var errorText = cbObject.errorText;
    
        _log("Error Code [" + errorCode + "]: " + errorText);
    }
    
        deviceInfo.getNetworkMacInfo(successCb, failureCb);
    },
    
    getNetworkInfo :function() {
        function successCb(cbObject) {
            _log("[Network Info] : " + JSON.stringify(cbObject));
            isInternetActive = cbObject.isInternetConnectionAvailable;
            webOsIp = cbObject.wired.ipAddress; //sonra ac
        };
        
        function failureCb(cbObject) {
            var errorCode = cbObject.errorCode;
            var errorText = cbObject.errorText;
        
            _log("Error Code [" + errorCode + "]: " + errorText);
        };
        
        deviceInfo.getNetworkInfo(successCb, failureCb);
    },

    deviceRestart: function () {

        var options = {};
        options.powerCommand = Power.PowerCommand.REBOOT;
        
        function successCb() {
            // Do something
        }
        
        function failureCb(cbObject) {
            var errorCode = cbObject.errorCode;
            var errorText = cbObject.errorText;
        
            console.log("Error Code [" + errorCode + "]: " + errorText);
        }
        
        power.executePowerCommand(successCb, failureCb, options);

    },

    deviceShutDown: function () {

        var options = {};
        options.powerCommand = Power.PowerCommand.SHUTDOWN;
        
        function successCb() {
            // Do something
        }
        
        function failureCb(cbObject) {
            var errorCode = cbObject.errorCode;
            var errorText = cbObject.errorText;
        
            console.log("Error Code [" + errorCode + "]: " + errorText);
        }
        
        power.executePowerCommand(successCb, failureCb, options);

    },

    deviceScreenOn: function () {

        var options = {};
        options.displayMode  = Power.DisplayMode.DISPLAY_ON;
        
        function successCb() {
            _log("deviceScreenOn edildi");
        }
        
        function failureCb(cbObject) {
            var errorCode = cbObject.errorCode;
            var errorText = cbObject.errorText;
        
            console.log("Error Code [" + errorCode + "]: " + errorText);
        }
        
        power.setDisplayMode(successCb, failureCb, options);

    },

    deviceScreenOff: function () {

        var options = {};
        options.displayMode  = Power.DisplayMode.DISPLAY_OFF;
        
        function successCb() {
            _log("deviceScreenOn edildi");
        }
        
        function failureCb(cbObject) {
            var errorCode = cbObject.errorCode;
            var errorText = cbObject.errorText;
        
            console.log("Error Code [" + errorCode + "]: " + errorText);
        }
        
        power.setDisplayMode(successCb, failureCb, options);

    },


        
}


