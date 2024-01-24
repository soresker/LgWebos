function Parse_Calendar() {
	this.days = "";
	this.startDate = "";
	this.endDate = "";
	this.startTime = "";
	this.endTime = "";
	this.templateUniqId = "";
	this.templateId = "";
  }
  
  Parse_Calendar.prototype.setDays = function (value) {
	this.days = Tools.defaultValue(value, "unknown");
  };
  
  Parse_Calendar.prototype.setStartDate = function (value) {
	this.startDate = Tools.defaultValue(value, "unknown");
  };
  
  Parse_Calendar.prototype.setEndDate = function (value) {
	this.endDate = Tools.defaultValue(value, "unknown");
  };
  
  Parse_Calendar.prototype.setStartTime = function (value) {
	this.startTime = Tools.defaultValue(value, "unknown");
  };
  
  Parse_Calendar.prototype.setEndTime = function (value) {
	this.endTime = Tools.defaultValue(value, "unknown");
  };
  
  Parse_Calendar.prototype.setTemplateId = function (value) {
	this.templateId = Tools.defaultValue(value, "unknown");
  };
  
  Parse_Calendar.prototype.setTemplateUniqId = function (value) {
	this.templateUniqId = Tools.defaultValue(value, "unknown");
  };
    