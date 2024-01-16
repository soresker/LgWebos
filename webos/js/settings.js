class WebosSettings  {

	static init = function () {
	
		//this.loadDefaultSettings();	
	
	}
	
	static value = function (key,defaultValue)  {
	
		if (localStorage.getItem(key) === null) {
			
			return defaultValue;
		  
		}else{
			
			return Tools.defaultValue(localStorage.getItem(key),defaultValue);
			
		}

	}
	
	static setValue = function (key,value){
	
		localStorage.setItem(key, value);
	
	}

	static removeValue =  function (key) {

	    localStorage.removeItem(key);

	}

	static loadDefaultSettings =  function () {

        localStorage.clear();

        this.setValue("Customer/id", "1");
        this.setValue("Apis/appServerUrl", "http://device.apiteknoloji.com.tr/playerHub");

		this.setValue("PlayerSettings/playerName", "");
		this.setValue("PlayerSettings/playerId", "");
		this.setValue("PlayerSettings/playerCode", "");
		this.setValue("PlayerSettings/privateKey", "");
		this.setValue("PlayerSettings/publicKey", "");
		this.setValue("PlayerSettings/status", "0");
		this.setValue("PlayerSettings/screenWidth", "1920");
		this.setValue("PlayerSettings/screenHeight", "1080");
		this.setValue("PlayerSettings/videoType", "0");
		this.setValue("PlayerSettings/appVersion", "0");
		this.setValue("PlayerSettings/playerType", "PC");

		this.setValue("Publishment/NewVersion", "");
		this.setValue("Publishment/OldVersion", "");
		this.setValue("Publishment/StartDateTime", "");

	}

	static settingData = {
		"Customer": {
			"id": "1"
		},
		"Apis": {
			"appServerUrl": "http://device.apiteknoloji.com.tr/playerHub"
		},
		"PlayerSettings": {
			"playerName": "",
			"playerId": "",
			"playerCode": "",
			"privateKey": "",
			"publicKey": "",
			"status": "1",
			"screenWidth": 1920,
			"screenHeight": 1080,
			"videoType": "0",
			"appVersion": "0",
			"playerType": "PC"
		},
		"Publishment": {
			"NewVersion": "",
			"OldVersion": "",
			"StartDateTime": ""
		}
	}
  
}
  
  if (typeof module !== 'undefined') module.exports = { WebosSettings };
  
  