var deviceInfo = new DeviceInfo();

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
        webOsMacAdress = cbObject.wiredInfo.macAddress;
            
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
            webOsIp = webOsIp.wired.ipAddress;
        };
        
        function failureCb(cbObject) {
            var errorCode = cbObject.errorCode;
            var errorText = cbObject.errorText;
        
            _log("Error Code [" + errorCode + "]: " + errorText);
        };
        
        deviceInfo.getNetworkInfo(successCb, failureCb);
    }
        
}


