var StartPlayer = {
     playerIsRegister : function(callback){
		
		if(WebosSettings.value("PlayerSettings/status","0") != "0"){
			_log("Webos Registered");
			callback(true);		
		}else{
			
			_log("Webos Register Degil");
            WebosSettings.loadDefaultSettings();
            //TV.getTVInfo();
			callback(false);

		}	
		
	}
}
