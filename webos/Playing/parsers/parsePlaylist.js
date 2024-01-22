function Parse_Playlist(){
	this.contentInfoList = [];
}
	

Parse_Playlist.prototype.clearContentInfoList = function() {
	
	this.contentInfoList = [];
	
};

Parse_Playlist.prototype.addToContentInfoList = function(contentInfo) {
	
	this.contentInfoList.push(contentInfo);
	
};

Parse_Playlist.prototype.setContentIsValidAt = function(contentIndex, isValid) {
			
	if(this.contentInfoList.length > 0){
		
		this.contentInfoList[contentIndex].isValid = isValid;
		
	}
	
};

Parse_Playlist.prototype.removeContentAt = function(contentIndex) {
	
	if(this.contentInfoList.length > 0){
		
		delete this.contentInfoList[contentIndex];
		
	}
		
};

Parse_Playlist.prototype.setContentIsOnScheduleAt = function (contentIndex, isOnSchedule) {

	if (this.contentInfoList.length > 0) {

		this.contentInfoList[contentIndex].isOnSchedule = isOnSchedule;

	}

};

