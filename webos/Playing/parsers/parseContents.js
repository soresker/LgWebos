function Parse_Content() {
    this.type = "unknown";
    this.fileName = "";
    this.fileUniqId = "";
    this.playlistUniqId = "";
    this.playlistContentUniqueKey = "";
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
    this.loop = false;
    this.volume = 0;
    this.typeContentProperties = {};
  }
  
  Parse_Content.prototype.setType = function (value) {
    this.type = Tools.defaultValue(value, "unknown");
  };
  
  Parse_Content.prototype.setFileName = function (value) {
    this.fileName = Tools.defaultValue(value, "unknown");
  };
  
  Parse_Content.prototype.setFileUniqueKey = function (value) {
    this.fileUniqId = Tools.defaultValue(value, "unknown");
  };
  
  Parse_Content.prototype.setPlaylistContentUniqueKey = function (value) {
    this.playlistContentUniqueKey = Tools.defaultValue(value, "unknown");
  };
  
  Parse_Content.prototype.setPlaylistUniqueKey = function (value) {
    this.playlistUniqId = Tools.defaultValue(value, "unknown");
  };
  
  Parse_Content.prototype.setTemplateId = function (value) {
    this.templateId = Tools.defaultValue(value, "unknown");
  };
  
  Parse_Content.prototype.setFrameId = function (value) {
    this.frameId = Tools.defaultValue(value, "unknown");
  };
  
  Parse_Content.prototype.setPlaylistId = function (value) {
    this.playlistId = Tools.defaultValue(value, "unknown");
  };
  
  Parse_Content.prototype.setExpireDate = function (value) {
    this.expireDate = Tools.defaultValue(value, "");
  };
  
  Parse_Content.prototype.setStartDate = function (value) {
    this.startDate = Tools.defaultValue(value, "");
  };
  
  Parse_Content.prototype.setStartTime = function (value) {
    this.startTime = Tools.defaultValue(value, "");
  };
  
  Parse_Content.prototype.setEndTime = function (value) {
    this.endTime = Tools.defaultValue(value, "");
  };
  
  Parse_Content.prototype.setDays = function (value) {
    this.days = Tools.defaultValue(value, "");
  };
  
  Parse_Content.prototype.setRepeatCount = function (value) {
    this.repeatCount = Tools.defaultValue(value, "");
  };
  
  Parse_Content.prototype.setPlayLimit = function (value) {
    this.playLimit = Tools.defaultValue(value, "");
  };
  
  Parse_Content.prototype.setLoop = function (value) {
    this.loop = Tools.defaultValue(value, true);
  };
  
  Parse_Content.prototype.setVolume = function (value) {
    this.volume = Tools.defaultValue(value, 0);
  };
  
  Parse_Content.prototype.setTypeContentProperty = function (key, value) {
    this.typeContentProperties[key.toLowerCase()] = value;
  };
  
  Parse_Content.prototype.getTypeContentProperty = function (key) {
    return this.typeContentProperties[key.toLowerCase()];
  };
    