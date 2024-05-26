function Content_ScrollText(contentInfo, parentFrameObject) {
    Content_Abstractor.call(this, contentInfo, parentFrameObject);
    try {
        this.width = parentFrameObject.width;
        this.height = parentFrameObject.height;
        this.x = 0;
        this.y = 0;
     
        this.value = contentInfo.getTypeContentProperty("contents");
        this.backgroundColor = contentInfo.getTypeContentProperty("backgroundColor");
        this.textColor = contentInfo.getTypeContentProperty("color");
        this.textFontFamily = contentInfo.getTypeContentProperty("fontFamily");
        this.textSizePixels = contentInfo.getTypeContentProperty("fontSize");
        this.textHorizontalAlignment = contentInfo.getTypeContentProperty("align");
        this.textVerticalAlignment = contentInfo.getTypeContentProperty("verticalAlign");
        this.textFontType = contentInfo.getTypeContentProperty("fontType");
        this.speed = 10;//contentInfo.getTypeSpecificProperty("speed");

        this.frameUniqueKey = parentFrameObject.uniqueKey;
        this.playlistContentUniqueKey = contentInfo.playlistUniqueKey + '-' + Math.floor(Math.random() * 10000);

    }
    catch (exception) {
        console.log("Content_ScrollText EX", + exception);
    }
}

Content_ScrollText.prototype = Object.create(Content_Abstractor.prototype);
Content_ScrollText.prototype.constructor = Content_ScrollText;

Content_ScrollText.prototype.showContent = function (func) {
    try {
        Content_Abstractor.prototype.showContent.call(this);
        
        var _this = this;
        Player_Ui_Creator.UIElement.appendHTML("#frame-" + this.frameUniqueKey, this.generateUIElement());
        var fontPath = Publisher.playerGlobalData.replace(/\\/g, '/').replace("/contents/","/fonts/");

        // Font yükleme işlemi
        if (!Tools.isEmptyString(this.textFontFamily)) {

            if(this.textFontFamily == "verdana")
            {
                console.log("Content_ScrollText this.textFontFamily" + this.textFontFamily);
                $("#content-" + _this.playlistContentUniqueKey).css("font-family", "{0}".pxcFormatString(this.textFontFamily));
                _this.createMarquee(_this);

            }else{
                var fontUrl = fontPath + this.textFontFamily + "."+fontExtension;
                var fontFace = new FontFace(this.textFontFamily, 'url(' + fontUrl + ')');
    
                fontFace.load().then(function(loadedFont) {
                    document.fonts.add(loadedFont);
                    _this.createMarquee(_this);
                }).catch(function(error) {
                    console.error('Content_ScrollText Font yüklenirken hata oluştu:', error);
                });
            }

        } else {
            // Font belirtilmemişse doğrudan marquee oluştur
            _this.createMarquee(_this);
        }

        if (func)
        func();

    } catch (exception) {
        console.log("ERORR Content_ScrollText.ShowContent", exception);
        this.parentFrameObject.setCurrentContentValidity(false);
        this.contentEnded();
        return;
    }
};

Content_ScrollText.prototype.createMarquee = function (_this) {
    var fontWeight = this.textFontType;
    var fontStyle = "normal";
    var textDecoration = "none";

    if (this.isUnderlined)
        textDecoration = "underline";

    var contentArray = JSON.parse(this.value);
    var result = contentArray.reduce(function(acc, item) {
        return acc + item.replace(/<\/?p>/g, ''); // <p> etiketlerini kaldır
    }, '');

    var marqueeStyle = "font-weight:" + fontWeight + ";font-style:" + fontStyle + ";font-size:" + this.textSizePixels + ";text-decoration:" + textDecoration + ";color:" + this.textColor + ";";

    $("#content-" + _this.playlistContentUniqueKey).html("");
    $("#content-" + _this.playlistContentUniqueKey).html('<marquee width="100%" direction="left" scrollamount="' + this.speed + '" height="100px" style="' + marqueeStyle + '">' + result + '</marquee>');
    $("#content-" + _this.playlistContentUniqueKey).show();
};

Content_ScrollText.prototype.deleteUIElement = function () {
    $("#content-" + this.playlistContentUniqueKey).remove();
};

Content_ScrollText.prototype.deleteContent = function () {
    this.deleteUIElement();
    Content_Abstractor.prototype.deleteContent.call(this);
};

Content_ScrollText.prototype.generateUIElement = function () {
    return '<div id="content-{0}" class="playing-platform-content playing-common-content-datetime" style="top:{1}px;left:{2}px;z-index:{3};width:{4}px; height:{5}px; position: absolute;"><span id="content-{0}-span" style="width:{4}px; height:{5}px;"></span></div>'
        .pxcFormatString(this.playlistContentUniqueKey,
        this.y,
        this.x,
        Tools.defaultValue(this.z, 0),
        this.width,
        this.height);
};
