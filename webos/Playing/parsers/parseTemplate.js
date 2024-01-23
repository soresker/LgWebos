function Parse_Template (){
	
	this.frameInfoList = [];
	this.triggerRules = [];	
	this.playlistInfoList = [];
}

Parse_Template.prototype.clearFrameInfoList = function() {
	
	this.frameInfoList = [];
	
};

Parse_Template.prototype.addToFrameInfoList = function(frameInfo) {
	
	this.frameInfoList.push(frameInfo);
	
};


Parse_Template.prototype.clearPlaylistInfoList = function() {
	
	this.playlistInfoList = [];

};

Parse_Template.prototype.addToPlaylistInfoList = function(playlistInfo) {

	this.playlistInfoList.push(playlistInfo);
	
};
if (typeof module !== 'undefined') module.exports = { Parse_Template };