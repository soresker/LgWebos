function Content_Abstractor(contentInfo, parentFrameObject) {
    console.log("Content_Abstractor" ,'Info');

    this.name = contentInfo.name;
    this.duration = contentInfo.duration;
    this.templateUniqueKey = contentInfo.templateUniqueKey;
    this.playlistUniqueKey = contentInfo.playlistUniqueKey;
    this.frameUniqueKey = contentInfo.frameUniqueKey;
    this.type = contentInfo.type;
    this.uniqueKey = parentFrameObject.uniqueKey + "-" + contentInfo.uniqueKey;

    this.expireDate = contentInfo.expireDate;
    this.contentStartDate = "";
    this.startDate = contentInfo.startDate;
    this.startTime = contentInfo.startTime;
    this.endTime = contentInfo.endTime;
    this.days = contentInfo.days;
    this.repeatCount = contentInfo.repeatCount;
    this.width = contentInfo.width;
    this.height = contentInfo.height;
    this.x = contentInfo.x;
    this.y = contentInfo.y;
    this.z = contentInfo.z;
    this.mainTimer = 0;
    this.uniqueKey = contentInfo.uniqueKey;
    this.playlistContentUniqueKey = contentInfo.playlistContentUniqueKey;

    this.parentFrameObject = parentFrameObject;
}


Content_Abstractor.prototype.deleteContent = function() {

    if (this.mainTimer != 0) {
        clearTimeout(this.mainTimer);
    }

    this.parentFrameObject = 0;

    if (this.contentStartDate != "") {
        console.log(this.templateUniqueKey, this.frameUniqueKey, this.uniqueKey, this.playlistUniqueKey, this.type, this.contentStartDate, Tools.getDateTimeNow().format(("YYYY-MM-DD HH:mm:ss.SSS")), this.categoryId, this.playLimit);
        
    }
};

Content_Abstractor.prototype.showFailoverImage = function() {

    if ($("#content-" + this.uniqueKey + "-failover").length == 0) {
        var failoverDiv = "<div id='content-{0}-failover' style='width:100%; height:100%; z-index:{1}; background-color:white; position:absolute;'><div id='content-{0}-failover-image' class='content-failover-image-visible' style='width:100%; height:100%; z-index:{1}'></div></div>".pxcFormatString(this.uniqueKey, this.z + 1);
        //Akin append lazim
    }

};

Content_Abstractor.prototype.hideFailoverImage = function() {
    $("#content-" + this.uniqueKey + "-failover").remove();
};


Content_Abstractor.prototype.showContent = function() {

    this.contentStartDate = Tools.getDateTimeNow().format("YYYY-MM-DD HH:mm:ss.SSS");
    console.log("Content_Abstractor.showContent","");

    var _this = this;

    var callMethod = function() {
        _this.contentEnded();
    }
/*
    setTimeout(function() {
		WebosDevice.screenShot(true,false);    
    },(this.duration-2) * 1000);
*/ 
    this.mainTimer = window.setTimeout(callMethod,(this.duration) * 1000);
};


Content_Abstractor.prototype.contentEnded = function() {

    clearTimeout(this.mainTimer);
    this.mainTimer = 0;
    this.parentFrameObject.continueFrame(true);

};

Content_Abstractor.prototype.setName = function(name) {

    this.name = name;

};

Content_Abstractor.prototype.getName = function() {

    return this.name;

};

Content_Abstractor.prototype.OnError = function(exception) {

    console.log("Content_Abstractor.prototype.OnError | " + this.name, this.name + " | " + exception, "error");
};
