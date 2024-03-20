function Content_Label(contentInfo, parentFrameObject) {

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


        this.value = contentInfo.getTypeContentProperty("content");
        this.backgroundColor = contentInfo.getTypeContentProperty("backgroundColor");
        this.textColor = contentInfo.getTypeContentProperty("color");
        this.textFontFamily = contentInfo.getTypeContentProperty("fontFamily");
        this.textSizePixels = parseInt(contentInfo.getTypeContentProperty("fontSize")) || 0;
        this.textHorizontalAlignment = contentInfo.getTypeContentProperty("align");
        this.textVerticalAlignment = contentInfo.getTypeContentProperty("verticalAlign");

        this.actualProvider = 0;
        this.frameUniqueKey = parentFrameObject.uniqueKey;

    }
    catch (exception)
    {
        console.log("Content_Label EX", + exception);
    }
}

Content_Label.prototype = Object.create(Content_Abstractor.prototype);
Content_Label.prototype.constructor = Content_Label;

Content_Label.prototype.showContent = function () {

    Content_Abstractor.prototype.showContent.call(this);
    
    try {

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

        console.log("Content_Label.ShowContent", exception);
        this.parentFrameObject.setCurrentContentValidity(false);
        this.contentEnded();
        return;
    }
};

Content_Label.prototype.deleteUIElement = function () {
    $("#content-" + this.frameUniqueKey).remove();
};

Content_Label.prototype.deleteContent = function () {

    this.deleteUIElement();
    Content_Abstractor.prototype.deleteContent.call(this);
};

Content_Label.prototype.generateUIElement = function () {

    return '<div id="content-{0}" class="playing-platform-content playing-common-content-datetime" style="top:{1}px;left:{2}px;z-index:{3};width:{4}px; height:{5}px; position: absolute;"><span id="content-{0}-span" style="width:{4}px; height:{5}px; display:table-cell;">{6}</span></div>'
        .pxcFormatString(this.frameUniqueKey,
        this.y,
        this.x,
        Tools.defaultValue(this.z, 0),
        this.width,
        this.height,
        this.value);
};

