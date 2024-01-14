class Parse_Frame {

	constructor(){
		this.playlistInfoList = [];
	
		this.templateId = "";
		
		this.templateGuid = "";

	}
	    

clearPlaylistInfoList = function() {
	
		this.playlistInfoList = [];
	
};

addToPlaylistInfoList = function(playlistInfo) {
	
		this.playlistInfoList.push(playlistInfo);
		
};

setContentIsValidAt = function(playlistIndex, contentIndex, isValid) {
	
		this.playlistInfoList[playlistIndex].setContentIsValidAt(contentIndex,isValid);
	
};

setContentIsOnScheduleAt = function (playlistIndex, contentIndex, isOnSchedule) {
    if (this.playlistInfoList.length > 0) {
        this.playlistInfoList[playlistIndex].setContentIsOnScheduleAt(contentIndex, isOnSchedule);
    }
};

removeContentAt = function(playlistIndex, contentIndex) {
		
		this.playlistInfoList[playlistIndex].removeContentAt(contentIndex);
			
};

}
if (typeof module !== 'undefined') module.exports = { Parse_Frame };
