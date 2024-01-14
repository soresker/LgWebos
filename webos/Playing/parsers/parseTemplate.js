class Parse_Template {
	
	constructor() {

		this.frameInfoList = [];
		this.triggerRules = [];	
		this.playlistInfoList = [];
	}

clearFrameInfoList = function() {
	
	this.frameInfoList = [];
	
};

addToFrameInfoList = function(frameInfo) {
	
	this.frameInfoList.push(frameInfo);
	
};


clearPlaylistInfoList = function() {
	
	this.playlistInfoList = [];

};

addToPlaylistInfoList = function(playlistInfo) {

	this.playlistInfoList.push(playlistInfo);
	
};

}
if (typeof module !== 'undefined') module.exports = { Parse_Template };