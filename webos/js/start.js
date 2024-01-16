let StartPlayer = {
     playerIsRegister : function(callback){
		_log("Webos Registered");
		if(WebosSettings.value("PlayerSettings/status","0") != "0"){
			callback(true);		
		}else{
			
			_log("Webos Register Degil");
            WebosSettings.loadDefaultSettings();
            //TV.getTVInfo();
			callback(false);

		}	
		
	}
}
