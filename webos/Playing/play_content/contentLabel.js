function Content_Label(contentInfo, parentFrameObject) {

    Content_Abstractor.call(this, contentInfo, parentFrameObject);
    try {
        this.width = parentFrameObject.width;
        this.height = parentFrameObject.height;
        this.x = 0;
        this.y = 0;
  

        this.value = contentInfo.getTypeContentProperty("content");
        this.backgroundColor = contentInfo.getTypeContentProperty("backgroundColor");
        this.textColor = contentInfo.getTypeContentProperty("color");
        this.textFontFamily = contentInfo.getTypeContentProperty("fontFamily");
        this.textSizePixels = parseInt(contentInfo.getTypeContentProperty("fontSize")) || 0;
        this.textHorizontalAlignment = contentInfo.getTypeContentProperty("align");
        this.textVerticalAlignment = contentInfo.getTypeContentProperty("verticalAlign");

        this.actualProvider = 0;
        this.frameUniqueKey = parentFrameObject.uniqueKey;
        this.playlistContentUniqueKey = contentInfo.playlistUniqueKey + '-' +Math.floor(Math.random() * 10000);
        console.log("Content_Label");

    }
    catch (exception)
    {
        console.log("Content_Label EX", + exception);
    }
}

Content_Label.prototype = Object.create(Content_Abstractor.prototype);
Content_Label.prototype.constructor = Content_Label;

Content_Label.prototype.showContent = function (func) {
    Content_Abstractor.prototype.showContent.call(this);
    
    try {
        var _this = this;

        Player_Ui_Creator.UIElement.appendHTML("#frame-" + this.frameUniqueKey, this.generateUIElement());
        var fontPath = Publisher.playerGlobalData.replace(/\\/g, '/').replace("/contents/","/fonts/");

        if (!Tools.isEmptyString(this.backgroundColor)) {
            $("#content-" + _this.playlistContentUniqueKey).css("background-color", "{0}".pxcFormatString(this.backgroundColor));
        }

        if (!Tools.isEmptyString(this.textColor)) {
            $("#content-" + _this.playlistContentUniqueKey).css("color", "{0}".pxcFormatString(this.textColor));
        }
        if (this.textSizePixels > 0) {
            $("#content-" + _this.playlistContentUniqueKey).css("font-size", this.textSizePixels + "px");
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
                $("#content-" + _this.playlistContentUniqueKey + "-span").css("text-align", horizontalAlignValue);
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
                $("#content-" + _this.playlistContentUniqueKey + "-span").css("vertical-align", verticalAlignValue);
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

        $("#content-" + _this.playlistContentUniqueKey + "-span").css("font-weight", fontWeight);
        $("#content-" + _this.playlistContentUniqueKey + "-span").css("font-style", fontStyle);
        $("#content-" + _this.playlistContentUniqueKey + "-span").css("text-decoration", textDecoration);
            
        if (!Tools.isEmptyString(this.textFontFamily)) {
            if(this.textFontFamily == "verdana") {
                $("#content-" + _this.playlistContentUniqueKey).css("font-family", "{0}".pxcFormatString(this.textFontFamily));
            }
            else {
                var fontUrl = fontPath + this.textFontFamily + "."+fontExtension;

            if(webOsHardwareVersion <= "2.0")
            {

                var style = document.createElement('style');
                style.appendChild(document.createTextNode("@font-face { font-family: '" + this.textFontFamily + "'; src: url('" + fontUrl + "'); }"));
                document.head.appendChild(style);

                // Font-family ayarı
                $("#content-" + _this.playlistContentUniqueKey).css("font-family", "'" + this.textFontFamily + "'");
                $("#content-" + _this.playlistContentUniqueKey).show();
    
               }else{

                var fontFace = new FontFace(this.textFontFamily, 'url(' + fontUrl + ')');
                var self = this;
                fontFace.load().then(function(loadedFont) {
                    document.fonts.add(loadedFont);
                    $("#content-" + self.frameUniqueKey + "-span").css("font-family", "'" + self.textFontFamily + "'");
                    $("#content-" + self.frameUniqueKey).show();
                }).catch(function(error) {
                    console.error('Font yüklenirken hata oluştu:', error);
                });
            }
            }    
        }
   
        $("#content-" + _this.playlistContentUniqueKey).show();
        if (func)
        func();

    } catch (exception) {
        console.log("ERRRO Content_Label.ShowContent", exception);
        this.parentFrameObject.setCurrentContentValidity(false);
        this.contentEnded();
        return;
    }
};


Content_Label.prototype.deleteUIElement = function () {
    console.log("*********Content_Label.prototype.deleteUIElement: ",this.playlistContentUniqueKey);
    $("#content-" + this.playlistContentUniqueKey+"-span").remove();
    $("#content-" + this.playlistContentUniqueKey).remove();
};

Content_Label.prototype.deleteContent = function () {

    this.deleteUIElement();
    Content_Abstractor.prototype.deleteContent.call(this);
};

Content_Label.prototype.generateUIElement = function () {

    return '<div id="content-{0}" class="playing-platform-content playing-common-content-datetime" style="top:{1}px;left:{2}px;z-index:{3};width:{4}px; height:{5}px; position: absolute;"><span id="content-{0}-span" style="width:{4}px; height:{5}px; display:table-cell;">{6}</span></div>'
        .pxcFormatString(this.playlistContentUniqueKey,
        this.y,
        this.x,
        Tools.defaultValue(this.z, 0),
        this.width,
        this.height,
        this.value);
};

