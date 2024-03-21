function Content_Weather(contentInfo, parentFrameObject) {

    Content_Abstractor.call(this, contentInfo, parentFrameObject);
    try {
        this.width = contentInfo.width;
        this.height = contentInfo.height;
        this.x = contentInfo.x;
        this.y = contentInfo.y
        this.z = contentInfo.z

        this.refreshTimer = 0;
        this.isCurrentDtSet = false;
        this.currentDtPending = false;
        this.timerCurrentDt = 0;


        this.weatherProperty = contentInfo.getTypeContentProperty("type");

        console.log("Content_Weather weatherProperty :",this.weatherProperty);

        if(this.weatherProperty == "icon")
        {
            this.uniqueKey = contentInfo.fileUniqId; //buraya uniqId gelmeli
            this.playlistContentUniqueKey = contentInfo.playlistUniqueKey + '-' + moment().format('HHmmss');    
            this.data = Publisher.playerGlobalData.replace(/\\/g, '/')  + contentInfo.getTypeContentProperty("weatherValue");

        }else{
            this.backgroundColor = contentInfo.getTypeContentProperty("backgroundColor");
            this.textColor = contentInfo.getTypeContentProperty("color");
            this.textFontFamily = contentInfo.getTypeContentProperty("fontFamily");
            this.textSizePixels = parseInt(contentInfo.getTypeContentProperty("fontSize")) || 0;
            this.textHorizontalAlignment = contentInfo.getTypeContentProperty("align");
            this.textVerticalAlignment = contentInfo.getTypeContentProperty("verticalAlign");
            this.data = contentInfo.getTypeContentProperty("weatherValue"); //
        }

       //buraya kac derece oldugu ile degiscez
      
        this.actualProvider = 0;

        console.log("Content_Weather Value:",this.data);

        this.frameUniqueKey = parentFrameObject.uniqueKey;

    }
    catch (exception)
    {
        console.log("Content_Weather EX", + exception);
    }
}

Content_Weather.prototype = Object.create(Content_Abstractor.prototype);
Content_Weather.prototype.constructor = Content_Weather;

Content_Weather.prototype.showContent = function () {

    Content_Abstractor.prototype.showContent.call(this);
    
    try {

        Player_Ui_Creator.UIElement.appendHTML("#frame-" + this.frameUniqueKey, this.generateUIElement());

        if(this.weatherProperty == "icon")
        {
            $("#content-" + this.frameUniqueKey).css('background-image', "url('{0}')".pxcFormatString(this.data));
            $("#content-" + this.frameUniqueKey).css("background-size", "{0}px {1}px".pxcFormatString(this.width, this.height));
            $("#content-" + this.frameUniqueKey).css("background-repeat", "no-repeat");
        }

        
        if (!Tools.isEmptyString(this.backgroundColor)) {
            $("#content-" + this.frameUniqueKey).css("background-color", "{0}".pxcFormatString(this.backgroundColor));
        }

        if (!Tools.isEmptyString(this.textColor)) {
            $("#content-" + this.frameUniqueKey).css("color", "{0}".pxcFormatString(this.textColor));
        }

        if (!Tools.isEmptyString(this.textFontFamily)) {
            $("#content-" + this.frameUniqueKey).css("font-family", "{0}".pxcFormatString(this.textFontFamily));
        }

        if (this.textSizePixels > 0) {
            $("#content-" + this.frameUniqueKey).css("font-size", this.textSizePixels.toString()+"px");
        }

        var fontWeight = "normal";
        var fontStyle = "normal";
        var textDecoration = "none";
        
        if (this.isBold)
            fontWeight = "bold";

        if (this.isItalic)
            fontStyle = "italic";

        if (this.isUnderlined)
            textDecoration = "underline";

        $("#content-" + this.frameUniqueKey + "-span").css("font-weight", fontWeight);
        $("#content-" + this.frameUniqueKey + "-span").css("font-style", fontStyle);
        $("#content-" + this.frameUniqueKey + "-span").css("text-decoration", textDecoration);

        if (!Tools.isEmptyString(this.textHorizontalAlignment)) {
            var horizontalAlignValue = "";

            if (this.textHorizontalAlignment.toLowerCase().trim() == "center")
                horizontalAlignValue = "center";
            else if (this.textHorizontalAlignment.toLowerCase().trim() == "left")
                horizontalAlignValue = "left";
            else if (this.textHorizontalAlignment.toLowerCase().trim() == "right")
                horizontalAlignValue = "right";

            if (!Tools.isEmptyString(horizontalAlignValue)) {
                $("#content-" + this.frameUniqueKey + "-span").css("text-align", horizontalAlignValue);
            }

        }

        if (!Tools.isEmptyString(this.textVerticalAlignment)) {

            var verticalAlignValue = "";

            if (this.textVerticalAlignment.toLowerCase().trim() == "center")
                verticalAlignValue = "middle";
            else if (this.textVerticalAlignment.toLowerCase().trim() == "bottom")
                verticalAlignValue = "bottom";
            else if (this.textVerticalAlignment.toLowerCase().trim() == "top")
                verticalAlignValue = "top";

            if (!Tools.isEmptyString(verticalAlignValue)) {
               // $("#content-" + this.frameUniqueKey).css("line-height", this.parentFrameObject + "px");
                $("#content-" + this.frameUniqueKey + "-span").css("vertical-align", verticalAlignValue);
            }
        }

        $("#content-" + this.frameUniqueKey).show();
            
    } catch (exception) {

        console.log("Content_Weather.ShowContent", exception);
        this.parentFrameObject.setCurrentContentValidity(false);
        this.contentEnded();
        return;
    }
};

Content_Weather.prototype.deleteUIElement = function () {
    $("#content-" + this.frameUniqueKey).remove();
};

Content_Weather.prototype.deleteContent = function () {

    this.deleteUIElement();
    Content_Abstractor.prototype.deleteContent.call(this);
};

Content_Weather.prototype.generateUIElement = function () {

    this.value = this.data;

    if(this.weatherProperty == "icon")
        return '<div id="content-{0}" class="playing-platform-content playing-common-content-image" style="z-index:{1};width:{2}px; height:{3}px;"></div>'.pxcFormatString(this.frameUniqueKey, Tools.defaultValue(this.z, 0), this.width, this.height);   
    else
        return '<div id="content-{0}" class="playing-platform-content playing-common-content-datetime" style="top:{1}px;left:{2}px;z-index:{3};width:{4}px; height:{5}px; position: absolute;"><span id="content-{0}-span" style="width:{4}px; height:{5}px; display:table-cell;">{6}</span></div>'
        .pxcFormatString(this.frameUniqueKey,
        this.y,
        this.x,
        Tools.defaultValue(this.z, 0),
        this.width,
        this.height,
        this.value);
};

