let StartPlayer = {
     playerIsRegister : function(callback){
		_log("playerIsRegister function");
		if(WebosSettings.value("PlayerSettings/status","0") != "0"){
			callback(true);		
		}else{
			
			_log("playerIsRegister function");
            WebosSettings.loadDefaultSettings();
            //TV.getTVInfo();
			callback(false);

		}	
		
	}
}
