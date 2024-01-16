class StartPlayer  {

    static playerIsRegister =  function(callback){
		
		if(WebosSettings.value("PlayerSettings/status","0") != "0"){
			callback(true);		
		}else{
			
            WebosSettings.loadDefaultSettings();
            //TV.getTVInfo();
			callback(false);

		}	
		
	}
}

if (typeof module !== 'undefined') module.exports = { StartPlayer };
