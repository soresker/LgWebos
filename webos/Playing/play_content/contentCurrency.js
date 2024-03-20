function Content_Currency(contentInfo, parentFrameObject) {

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


        this.backgroundColor = contentInfo.getTypeContentProperty("backgroundColor");
        this.textColor = contentInfo.getTypeContentProperty("color");
        this.textFontFamily = contentInfo.getTypeContentProperty("fontFamily");
        this.textSizePixels = parseInt(contentInfo.getTypeContentProperty("fontSize")) || 0;
        this.textHorizontalAlignment = contentInfo.getTypeContentProperty("align");
        this.textVerticalAlignment = contentInfo.getTypeContentProperty("verticalAlign");
        this.data = contentInfo.getTypeContentProperty("currencyValue");
      
        this.actualProvider = 0;

        /*
        if(contentInfo.name == "usd")
        this.data = Publisher.currencyValues.usd;
        if(contentInfo.name == "euro")
        this.data = Publisher.currencyValues.euro;
*/
        console.log("Content_Currency currencyValue:",this.data);
        this.frameUniqueKey = parentFrameObject.uniqueKey;

    }
    catch (exception)
    {
        console.log("Content_Currency EX", + exception);
    }
}

Content_Currency.prototype = Object.create(Content_Abstractor.prototype);
Content_Currency.prototype.constructor = Content_Currency;

Content_Currency.prototype.showContent = function () {

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

        console.log("Content_Currency.ShowContent", exception);
        this.parentFrameObject.setCurrentContentValidity(false);
        this.contentEnded();
        return;
    }
};

Content_Currency.prototype.deleteUIElement = function () {
    $("#content-" + this.frameUniqueKey).remove();
};

Content_Currency.prototype.deleteContent = function () {

    this.deleteUIElement();
    Content_Abstractor.prototype.deleteContent.call(this);
};

Content_Currency.prototype.generateUIElement = function () {

    this.value = this.data;

    return '<div id="content-{0}" class="playing-platform-content playing-common-content-datetime" style="top:{1}px;left:{2}px;z-index:{3};width:{4}px; height:{5}px; position: absolute;"><span id="content-{0}-span" style="width:{4}px; height:{5}px; display:table-cell;">{6}</span></div>'
        .pxcFormatString(this.frameUniqueKey,
        this.y,
        this.x,
        Tools.defaultValue(this.z, 0),
        this.width,
        this.height,
        this.value);
};

