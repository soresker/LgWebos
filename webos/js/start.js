var StartPlayer = {
     playerIsRegister : function(callback){
		
		if(WebosSettings.value("PlayerSettings/status","0") != "0"){
			Logger.sendMessage("Webos Registered");
			callback(true);		
		}else{
			
			Logger.sendMessage("Webos Register Degil");
            WebosSettings.loadDefaultSettings();
            //TV.getTVInfo();
			callback(false);

		}	
		
	}
}
