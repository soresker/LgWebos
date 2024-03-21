function Content_ScrollText(contentInfo, parentFrameObject) {

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

        this.value = contentInfo.getTypeContentProperty("contents");
        this.backgroundColor = contentInfo.getTypeContentProperty("backgroundColor");
        this.textColor = contentInfo.getTypeContentProperty("color");
        this.textFontFamily = contentInfo.getTypeContentProperty("fontFamily");
        this.textSizePixels = contentInfo.getTypeContentProperty("fontSize");
        this.textHorizontalAlignment = contentInfo.getTypeContentProperty("align");
        this.textVerticalAlignment = contentInfo.getTypeContentProperty("verticalAlign");
        this.textFontType = contentInfo.getTypeContentProperty("fontType");
        this.speed = contentInfo.getTypeSpecificProperty("speed");

        this.actualProvider = 0;
        this.frameUniqueKey = parentFrameObject.uniqueKey;

    }
    catch (exception)
    {
        console.log("Content_ScrollText EX", + exception);
    }
}

Content_ScrollText.prototype = Object.create(Content_Abstractor.prototype);
Content_ScrollText.prototype.constructor = Content_ScrollText;

Content_ScrollText.prototype.showContent = function () {

    Content_Abstractor.prototype.showContent.call(this);
    
    try {

        Player_Ui_Creator.UIElement.appendHTML("#frame-" + this.frameUniqueKey, this.generateUIElement());

        console.log("Content_ScrollText this.value" + this.value);
        console.log("Content_ScrollText this.backgroundColor" + this.backgroundColor);
        console.log("Content_ScrollText this.speed" + this.speed);
        console.log("Content_ScrollText this.textColor" + this.textColor);
        console.log("Content_ScrollText this.textFontFamily" + this.textFontFamily);
        console.log("Content_ScrollText this.textSizePixels" + this.textSizePixels);
        console.log("Content_ScrollText this.textFontType" + this.textFontType);
        console.log("Content_ScrollText this.textHorizontalAlignment" + this.textHorizontalAlignment);
        console.log("Content_ScrollText this.textVerticalAlignment" + this.textVerticalAlignment);

        console.log("Content_ScrollText getTypeContentProperty:"+this.value);
        console.log("Content_ScrollText getTypeContentProperty:"+JSON.stringify(this.value));
        console.log("Content_ScrollText getTypeContentProperty:"+contentInfo.getTypeContentProperty("contents"));
        console.log("Content_ScrollText getTypeContentProperty:"+JSON.stringify(contentInfo.getTypeContentProperty("contents")));

        var fontWeight =this.textFontType;
        var fontStyle = "normal";
        var textDecoration = "none";

        //fontWeight = "bold";


        if (this.isUnderlined)
            textDecoration = "underline";

        /*    
        $("#content-" + this.frameUniqueKey + "-span").css("font-weight", fontWeight);
        $("#content-" + this.frameUniqueKey + "-span").css("font-style", fontStyle);
        $("#content-" + this.frameUniqueKey + "-span").css("text-decoration", textDecoration);
            */  
        var marqueeStyle = "font-weight:" + fontWeight +";font-style:" +fontStyle + ";font-size:" +this.textSizePixels +";text-decoration:" +textDecoration + ";color:"+this.textColor +";";
        
        $("#content-" + this.frameUniqueKey).html("");
        $("#content-" + this.frameUniqueKey).html('<marquee width="100%" direction="left" scrollamount="'+this.speed+'" height="100px" style="'+marqueeStyle+'">'+this.value+'</marquee>');
        $("#content-" + this.frameUniqueKey).show();

       
    } catch (exception) {

        console.log("Content_ScrollText.ShowContent", exception);
        this.parentFrameObject.setCurrentContentValidity(false);
        this.contentEnded();
        return;
    }
};

Content_ScrollText.prototype.deleteUIElement = function () {
    $("#content-" + this.frameUniqueKey).remove();
};

Content_ScrollText.prototype.deleteContent = function () {
    this.deleteUIElement();
    Content_Abstractor.prototype.deleteContent.call(this);
};

Content_ScrollText.prototype.generateUIElement = function () {

    return '<div id="content-{0}" class="playing-platform-content playing-common-content-datetime" style="top:{1}px;left:{2}px;z-index:{3};width:{4}px; height:{5}px; position: absolute;"><span id="content-{0}-span" style="width:{4}px; height:{5}px;"></span></div>'
        .pxcFormatString(this.frameUniqueKey,
        this.y,
        this.x,
        Tools.defaultValue(this.z, 0),
        this.width,
        this.height);
};

