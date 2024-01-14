class Parse_Calendar{

	constructor() {

		this.days = "";

		this.startDate = "";
	
		this.endDate = "";
	
		this.startTime = "";
	
		this.endTime = "";
	
		this.templateUniqId = "";
	
		this.templateId ="";
	}

	setDays = function (value) {
		this.days = Tools.defaultValue(value, "unknown");
	};

	setStartDate = function (value) {
		this.startDate = Tools.defaultValue(value, "unknown");
	};

	setEndDate = function (value) {
		this.endDate = Tools.defaultValue(value, "unknown");
	};

	setStartTime = function (value) {
		this.startTime = Tools.defaultValue(value, "unknown");
	};

	setEndTime = function (value) {
		this.endTime = Tools.defaultValue(value, "unknown");
	};

	setTemplateId = function (value) {
		this.templateId = Tools.defaultValue(value, "unknown");
	};

	setTemplateUniqId = function (value) {
		this.templateUniqId = Tools.defaultValue(value, "unknown");
	};

}
if (typeof module !== 'undefined') module.exports = { Parse_Calendar };

