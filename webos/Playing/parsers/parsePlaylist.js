class Parse_Playlist{

	constructor()
	{
		this.contentInfoList = [];
	}
	

clearContentInfoList = function() {
	
		this.contentInfoList = [];
	
};

addToContentInfoList = function(contentInfo) {
	
		this.contentInfoList.push(contentInfo);
	
};

setContentIsValidAt = function(contentIndex, isValid) {
			
		if(this.contentInfoList.length > 0){
			
			this.contentInfoList[contentIndex].isValid = isValid;
			
		}
	
};

removeContentAt = function(contentIndex) {
	
		if(this.contentInfoList.length > 0){
			
			delete this.contentInfoList[contentIndex];
			
		}
		
};

setContentIsOnScheduleAt = function (contentIndex, isOnSchedule) {

	if (this.contentInfoList.length > 0) {

			this.contentInfoList[contentIndex].isOnSchedule = isOnSchedule;

	}

};
}
if (typeof module !== 'undefined') module.exports = { Parse_Playlist };
