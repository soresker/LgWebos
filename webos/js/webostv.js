var deviceInfo = new DeviceInfo();

let WebosDevice =  {

    webOsModelName: "",
    webOsSerialNumber: "",
    webOsManufacturer: "",
    webOsMacAdress: "",

    getPlatformInfo : function(){
		
        function successCb(cbObject) {
            _log("[Platform Info] : " +cbObject.modelName);
            _log("[Platform Info] : " +cbObject.serialNumber);
            _log("[Platform Info] : " +cbObject.firmwareVersion);
            _log("[Platform Info] : " +cbObject.hardwareVersion);
            _log("[Platform Info] : " +cbObject.sdkVersion);
            _log("[Platform Info] : " +cbObject.manufacturer);
            
            this.webOsModelName = cbObject.modelName;
            this.webOsSerialNumber = cbObject.serialNumber;
            this.webOsManufacturer = cbObject.manufacturer;

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
        this.webOsMacAdress = cbObject.wiredInfo.macAddress;
            
    }
    
    function failureCb(cbObject) {
        var errorCode = cbObject.errorCode;
        var errorText = cbObject.errorText;
    
        console.log("Error Code [" + errorCode + "]: " + errorText);
    }
    
        deviceInfo.getNetworkMacInfo(successCb, failureCb);
    }
        
}


