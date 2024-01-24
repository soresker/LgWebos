function Content_Image(contentInfo, parentFrameObject) {

    console.log("function Content_Image contentInfo: " +JSON.stringify(contentInfo) ,'Info');

    Content_Abstractor.call(this, contentInfo, parentFrameObject);
    try {
        //Akin düzenlenecek
        this.fileName = contentInfo.getTypeContentProperty("filename");
        this.displayOption = contentInfo.getTypeContentProperty("displayoption");
        this.width = contentInfo.width;
        this.height = contentInfo.height;
        this.frameUniqueKey = contentInfo.frameUniqueKey;
        this.name = contentInfo.name;

        this.uniqueKey = contentInfo.uniqId;
        this.playlistContentUniqueKey = contentInfo.playlistUniqueKey + '-' + moment().format('HHmmss');

        this.x = contentInfo.x;
        this.y = contentInfo.y;
        this.z = contentInfo.z;

        this.uniqueKey = contentInfo.fileUniqId; //buraya uniqId gelmeli
        this.playlistContentUniqueKey = contentInfo.playlistUniqueKey + '-' + moment().format('HHmmss');

        console.log("function Content_Image contentInfo: " +JSON.stringify(this.playlistContentUniqueKey) ,'Info');
        console.log("function Content_Image this.fileName: " +JSON.stringify(this.fileName) ,'Info');
        console.log("function Content_Image this.width: " +JSON.stringify(this.width) ,'Info');
        console.log("function Content_Image this.height: " +JSON.stringify(this.height) ,'Info');
        console.log("function Content_Image this.frameUniqueKey: " +JSON.stringify(this.frameUniqueKey) ,'Info');
        console.log("function Content_Image this.uniqueKey: " +JSON.stringify(this.uniqueKey) ,'Info');

        console.log("function Content_Image this.fileName:" +this.fileName ,'Info');

    } catch (exception) {
         console.log("Content_Image"+ exception, "error");
    }
}

Content_Image.prototype = Object.create(Content_Abstractor.prototype);
Content_Image.prototype.constructor = Content_Image;


Content_Image.prototype.showContent = function(func) {

    setTimeout(function() { $("#frame-" + this.frameUniqueKey).addClass('bg-black'); }, 2000)

    Content_Abstractor.prototype.showContent.call(this);

    try {

        //Akin düzenlenecek
        Player_Ui_Creator.UIElement.appendHTML("#frame-" + this.frameUniqueKey, this.generateUIElement());
        var fileExists = false;
        var _this = this;
        //buraya path local path verilmeli    
        
        var fileUrlEdits = Publisher.playerGlobalData.replace(/\\/g, '/')  + _this.fileName;
        console.log("Publisher.initGlobalData.basePath2:" +fileUrlEdits);

        $("#content-" + _this.playlistContentUniqueKey).css('background-image', "url('{0}')".pxcFormatString(fileUrlEdits));

        if (!Tools.isEmptyString(_this.displayOption)) {
            if (_this.displayOption.trim().toLowerCase() == "fit") {
                $("#content-" + _this.playlistContentUniqueKey).css("background-size", "{0}px {1}px".pxcFormatString(_this.width, _this.height));
                $("#content-" + _this.playlistContentUniqueKey).css("background-repeat", "no-repeat");
            } else if (_this.displayOption.trim().toLowerCase() == "tile") {
                $("#content-" + _this.playlistContentUniqueKey).css("background-repeat", "repeat");
            } else if (_this.displayOption.trim().toLowerCase() == "none") {
                $("#content-" + _this.playlistContentUniqueKey).css("background-repeat", "no-repeat");
                //$("#content-" + _this.playlistContentUniqueKey).css("background-attachment", "fixed");
                $("#content-" + _this.playlistContentUniqueKey).css("background-position", "top left");
            } else {

                $("#content-" + _this.playlistContentUniqueKey).css("background-repeat", "no-repeat");
                //  $("#content-" + _this.guid).css("background-attachment", "fixed");
                $("#content-" + _this.playlistContentUniqueKey).css("background-position", "top left");

            }
        }
        $("#content-" + _this.playlistContentUniqueKey).show();

        if (func)
            func();

    } catch (exception) {
        console.log("Content_Image.ShowContent Error", exception.message, "Error");
        this.parentFrameObject.setCurrentContentValidity(false);
        this.contentEnded();
        return;
    }

};

Content_Image.prototype.deleteUIElement = function() {
    console.log("*********Content_Image.prototype.deleteUIElement: ",this.playlistContentUniqueKey);
    $("#content-" + this.playlistContentUniqueKey).remove();
};

Content_Image.prototype.deleteContent = function() {

    console.log("*********Content_Image.prototype.deleteUIElement: ",this.playlistContentUniqueKey);

    this.deleteUIElement();
    Content_Abstractor.prototype.deleteContent.call(this);
};

Content_Image.prototype.generateUIElement = function() {

    return '<div id="content-{0}" class="playing-platform-content playing-common-content-image" style="z-index:{1};width:{2}px; height:{3}px;"></div>'.pxcFormatString(this.playlistContentUniqueKey, Tools.defaultValue(this.z, 0), this.width, this.height);
};