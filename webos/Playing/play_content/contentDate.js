function Content_Date(contentInfo, parentFrameObject) {

    Content_Abstractor.call(this, contentInfo, parentFrameObject);
    try {
        this.width = parentFrameObject.width;
        this.height = parentFrameObject.height;
        this.x = 0;
        this.y = 0;
        this.refreshTimer = 0;
        this.isCurrentDtSet = false;
        this.currentDtPending = false;
        this.timerCurrentDt = 0;

        this.format = contentInfo.getTypeContentProperty("format");

        //this.format = Tools.dateTimeFormatConverter(this.format);

        this.backgroundColor = contentInfo.getTypeContentProperty("backgroundColor");
        this.textColor = contentInfo.getTypeContentProperty("color");
        this.textFontFamily = contentInfo.getTypeContentProperty("fontFamily");
        this.textSizePixels = parseInt(contentInfo.getTypeContentProperty("fontSize")) || 0;
        this.textHorizontalAlignment = contentInfo.getTypeContentProperty("align");
        this.textVerticalAlignment = contentInfo.getTypeContentProperty("verticalAlign");
        
        this.frameUniqueKey = parentFrameObject.uniqueKey;

    }
    catch (exception)
    {
        console.log("Content_Date EX", + exception);
    }
}

Content_Date.prototype = Object.create(Content_Abstractor.prototype);
Content_Date.prototype.constructor = Content_Date;

Content_Date.prototype.showContent = function () {

    if (this.currentDtPending === false) {
        Content_Abstractor.prototype.showContent.call(this);
    }

    try {

        var currentDt = Tools.getDateTimeNow();
        if (currentDt.isBefore(moment([1980, 1, 1]))) {
            this.currentDtPending = true;
            if (this.timerCurrentDt === 0) {
                var _this = this;
                this.timerCurrentDt = setInterval(function () {
                    _this.showContent();
                }, 1000);
            }
            return;
        }
        else {
            this.currentDtPending = false;
            this.isCurrentDtSet = true;

            if (this.timerCurrentDt != 0) {
                clearInterval(this.timerCurrentDt);
                this.timerCurrentDt = null;
            }

        }

        Player_Ui_Creator.UIElement.appendHTML("#frame-" + this.frameUniqueKey, this.generateUIElement());

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
            $("#content-" + this.frameUniqueKey).css("font-size", this.textSizePixels);
        }

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

        $("#content-" + this.frameUniqueKey + "-span").html(Tools.getDateTimeNow().locale("tr-TR").format(this.format));
        var _this = this;
        this.refreshTimer = setInterval(function () {
            var currentDateTime = Tools.getDateTimeNow().locale("tr-TR").format(_this.format);
            $("#content-" + _this.frameUniqueKey+"-span").html(currentDateTime);
        }, 1000);


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

        $("#content-" + this.frameUniqueKey).show();

    } catch (exception) {

        console.log("Content_Date.ShowContent", exception);
        this.parentFrameObject.setCurrentContentValidity(false);
        this.contentEnded();
        return;
    }
};


Content_Date.prototype.deleteUIElement = function () {
    $("#content-" + this.frameUniqueKey).remove();
};

Content_Date.prototype.deleteContent = function () {

    if (this.refreshTimer != 0) {
        clearInterval(this.refreshTimer);
        this.refreshTimer = null;
    }

    if (this.timerCurrentDt != 0) {
        clearInterval(this.timerCurrentDt);
        this.timerCurrentDt = null;
    }

    this.deleteUIElement();
    Content_Abstractor.prototype.deleteContent.call(this);
};

Content_Date.prototype.generateUIElement = function () {

    return '<div id="content-{0}" class="playing-platform-content playing-common-content-datetime" style="top:{1}px;left:{2}px;z-index:{3};width:{4}px; height:{5}px;"><span id="content-{0}-span" style="width:{4}px; height:{5}px; display:table-cell;">{6}</span></div>'
        .pxcFormatString(this.frameUniqueKey,
        this.y,
        this.x,
        Tools.defaultValue(this.z, 0),
        this.width,
        this.height,
        this.value);
};

