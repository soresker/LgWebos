function Parse_Frame() {
	this.playlistInfoList = [];
	this.templateId = "";
	this.templateGuid = "";
  }
  
  Parse_Frame.prototype.clearPlaylistInfoList = function () {
	this.playlistInfoList = [];
  };
  
  Parse_Frame.prototype.addToPlaylistInfoList = function (playlistInfo) {
	this.playlistInfoList.push(playlistInfo);
  };
  
  Parse_Frame.prototype.setContentIsValidAt = function (playlistIndex, contentIndex, isValid) {
	this.playlistInfoList[playlistIndex].setContentIsValidAt(contentIndex, isValid);
  };
  
  Parse_Frame.prototype.setContentIsOnScheduleAt = function (playlistIndex, contentIndex, isOnSchedule) {
	if (this.playlistInfoList.length > 0) {
	  this.playlistInfoList[playlistIndex].setContentIsOnScheduleAt(contentIndex, isOnSchedule);
	}
  };
  
  Parse_Frame.prototype.removeContentAt = function (playlistIndex, contentIndex) {
	this.playlistInfoList[playlistIndex].removeContentAt(contentIndex);
  };
    