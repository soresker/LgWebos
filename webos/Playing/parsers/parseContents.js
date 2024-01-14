class Parse_Content {

    constructor(){
        this.type = "unknown";
        this.fileName = "";
        this.fileUniqId = "";
        this.playlistUniqId = "";
        this.playlistContentUniqueKey ="";
        this.isValid = true;
        this.templateId = "";
        this.frameId = "";
        this.playlistId = "";
        this.expireDate = "";
        this.startDate = "";
        this.startTime = "";
        this.endTime = "";
        this.days = "";
        this.repeatCount = 0;
        this.playLimit = 0;
        this.loop=false;
        this.volume=0;
        this.typeContentProperties = {};
    }

setType = function(value) {

    this.type = Tools.defaultValue(value, "unknown");

};

setFileName = function(value) {

    this.fileName = Tools.defaultValue(value, "unknown");

};

setFileUniqueKey = function(value) {

    this.fileUniqId = Tools.defaultValue(value, "unknown");

};

setPlaylistContentUniqueKey = function(value) {

    this.playlistContentUniqueKey = Tools.defaultValue(value, "unknown");

};

setPlaylistUniqueKey = function(value) {
    this.playlistUniqId = Tools.defaultValue(value, "unknown");
};

setTemplateId = function(value) {

    this.templateId = Tools.defaultValue(value, "unknown");

};

setFrameId = function(value) {

    this.frameId = Tools.defaultValue(value, "unknown");

};

setPlaylistId = function(value) {

    this.playlistId = Tools.defaultValue(value, "unknown");

};

setExpireDate = function(value) {

    this.expireDate = Tools.defaultValue(value, "");

};

setStartDate = function(value) {

    this.startDate = Tools.defaultValue(value, "");

};

setStartTime = function(value) {

    this.startTime = Tools.defaultValue(value, "");

};

setEndTime = function(value) {

    this.endTime = Tools.defaultValue(value, "");

};

setDays = function(value) {

    this.days = Tools.defaultValue(value, "");

};

setRepeatCount = function(value) {

    this.repeatCount = Tools.defaultValue(value, "");

};

setPlayLimit = function(value) {

    this.playLimit = Tools.defaultValue(value, "");

};

setLoop = function(value) {

    this.loop = Tools.defaultValue(value, true);

};

setVolume = function(value) {

    this.volume = Tools.defaultValue(value, 0);
};

setTypeContentProperty = function(key, value) {

    this.typeContentProperties[key.toLowerCase()] = value;

};

getTypeContentProperty = function(key) {

    return this.typeContentProperties[key.toLowerCase()];
};

}
if (typeof module !== 'undefined') module.exports = { Parse_Content };
